#!/usr/bin/env node

import { createRequire } from "node:module";

const TEST_CARD = {
  number: "4012000033330026",
  holder: "Any Name",
  expiry: "01/39",
  cvv: "100",
};

const loginData = {
  email: process.env.LOGIN_EMAIL || "tester1@datafortressit.com",
  password: process.env.LOGIN_PASSWORD || "testerone1122",
};

const bookingData = {
  eventType: process.env.BOOKING_EVENT_TYPE || "Wedding",
  timeSlot: process.env.BOOKING_TIME_SLOT || "Evening (6:00 PM onwards)",
  venueType: process.env.BOOKING_VENUE_TYPE || "Indoor",
  guests: process.env.BOOKING_GUESTS || "51-100 guests",
  city: process.env.BOOKING_CITY || "Riyadh",
  postalCode: process.env.BOOKING_POSTAL_CODE || "12211",
  venueName: process.env.BOOKING_VENUE_NAME || "Singerlia Test Venue",
  venueAddress: process.env.BOOKING_VENUE_ADDRESS || "King Fahd Road",
  fullName: process.env.BOOKING_FULL_NAME || "Any Name",
  email: process.env.BOOKING_EMAIL || "customer@example.com",
  phoneNumber: process.env.BOOKING_PHONE || "+966500000000",
  message: process.env.BOOKING_MESSAGE || "Automated test booking.",
  songs: process.env.BOOKING_SONGS || "Test song request.",
  equipment: process.env.BOOKING_EQUIPMENT || "I will provide a PA system (speakers, mic)",
};

const baseUrl = (process.env.APP_URL || "http://localhost:5174").replace(/\/+$/, "");
const bookingPath = process.env.BOOKING_PATH || "/booking/singer/49344b6f-1afc-49fb-a858-34b482ca1400";
const bookingUrl = process.env.BOOKING_URL || `${baseUrl}${bookingPath}`;
const storageState = process.env.PLAYWRIGHT_STORAGE_STATE;
const authToken = process.env.AUTH_TOKEN;
const userJson =
  process.env.USER_JSON ||
  JSON.stringify({
    userId: process.env.USER_ID || "automation-user",
    name: bookingData.fullName,
    role: process.env.USER_ROLE || "user",
    email: bookingData.email,
    phoneNumber: bookingData.phoneNumber,
  });
const headless = process.env.HEADLESS === "1" || process.env.HEADLESS === "true";
const slowMo = Number(process.env.SLOW_MO || 0);
const keepBrowserOpen = process.env.CLOSE_BROWSER !== "1";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error(
    "Playwright is required. Install it with: npm install --save-dev playwright"
  );
  process.exit(1);
}

const browser = await chromium.launch({ headless, slowMo });
const context = await browser.newContext({
  storageState,
  viewport: { width: 1440, height: 1100 },
});
if (authToken) {
  await context.addInitScript(
    ({ token, user }) => {
      window.localStorage.setItem("authToken", token);
      window.localStorage.setItem("user", user);
    },
    { token: authToken, user: userJson }
  );
}
const page = await context.newPage();
page.setDefaultTimeout(Number(process.env.PLAYWRIGHT_TIMEOUT || 60000));

try {
  if (!authToken && !storageState) {
    await login(page);
  }

  console.log(`Opening booking page: ${bookingUrl}`);
  await page.goto(bookingUrl, { waitUntil: "domcontentloaded" });

  if (/\/auth\/login/i.test(page.url())) {
    await login(page);
    await page.goto(bookingUrl, { waitUntil: "domcontentloaded" });
  }

  await page.getByRole("heading", { name: /book your artist/i }).waitFor();
  await chooseEventDate(page);
  await clickText(page, bookingData.timeSlot);
  await selectOption(page, "Select event type", bookingData.eventType);
  await clickText(page, bookingData.venueType);
  await selectOption(page, "Select guest count", bookingData.guests);
  await fillPlaceholder(page, "Enter city", bookingData.city);
  await fillPlaceholder(page, "Enter postal code", bookingData.postalCode);
  await fillPlaceholder(page, "Enter venue name", bookingData.venueName);
  await fillPlaceholder(page, "Street address", bookingData.venueAddress);
  await fillPlaceholder(page, "Enter your full name", bookingData.fullName);
  await fillPlaceholder(page, "your.email@example.com", bookingData.email);
  await fillPlaceholder(page, "+1 (555) 000-0000", bookingData.phoneNumber);
  await fillPlaceholder(page, /Share any special requests/i, bookingData.message);
  await fillPlaceholder(page, /First dance song/i, bookingData.songs);
  await clickText(page, bookingData.equipment);
  await clickText(page, /I agree to the Terms/i);

  console.log("Submitting booking form...");
  await page.getByRole("button", { name: /review booking/i }).click();
  await page.getByRole("heading", { name: /booking summary/i }).waitFor();

  console.log("Waiting for checkout and confirming amount...");
  await page
    .getByRole("button", { name: /confirm.*proceed to payment/i })
    .click();

  await page.locator("form.paymentWidgets, .wpwl-form, .wpwl-container").first().waitFor({
    state: "visible",
    timeout: Number(process.env.HYPERPAY_TIMEOUT || 120000),
  });

  console.log("HyperPay widget appeared. Filling test card details...");
  await fillHyperPayField(page, [
    ".wpwl-control-cardNumber",
    'input[name="card.number"]',
    'input[name="cardNumber"]',
    'input[autocomplete="cc-number"]',
    'input[placeholder*="Card"]',
  ], TEST_CARD.number);
  await fillHyperPayField(page, [
    ".wpwl-control-cardHolder",
    'input[name="card.holder"]',
    'input[name="cardHolder"]',
    'input[autocomplete="cc-name"]',
    'input[placeholder*="holder" i]',
  ], TEST_CARD.holder);
  await fillHyperPayField(page, [
    ".wpwl-control-expiry",
    'input[name="card.expiry"]',
    'input[name="expiry"]',
    'input[autocomplete="cc-exp"]',
    'input[placeholder*="MM"]',
  ], TEST_CARD.expiry);
  await fillHyperPayField(page, [
    ".wpwl-control-cvv",
    'input[name="card.cvv"]',
    'input[name="cvv"]',
    'input[autocomplete="cc-csc"]',
    'input[placeholder*="CVV" i]',
  ], TEST_CARD.cvv);

  console.log("Submitting HyperPay payment form...");
  await clickHyperPaySubmit(page);
  await page.waitForLoadState("domcontentloaded").catch(() => {});
  console.log(`Payment submitted. Current URL: ${page.url()}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  await page.screenshot({ path: "autofill-booking-error.png", fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  if (keepBrowserOpen) {
    console.log("Browser will remain open for manual confirmation. Press Ctrl+C in this terminal when done.");
    await new Promise(() => {});
  }
  await browser.close();
}

async function chooseEventDate(page) {
  const explicitDate = process.env.BOOKING_EVENT_DATE;
  const date = explicitDate ? new Date(`${explicitDate}T12:00:00`) : daysFromNow(14);
  const day = String(date.getDate());

  await clickText(page, /Select event date/i);
  const calendar = page.locator("[data-radix-popper-content-wrapper], [role='dialog']").last();
  await calendar.waitFor({ state: "visible" });
  await calendar
    .locator("button:not([disabled])")
    .filter({ hasText: new RegExp(`^${day}$`) })
    .first()
    .click();
}

async function login(page) {
  const loginUrl = `${baseUrl}/auth/login`;
  console.log(`Logging in as ${loginData.email}...`);
  await page.goto(loginUrl, { waitUntil: "domcontentloaded" });

  if (!/\/auth\/login/i.test(page.url())) {
    console.log("Already logged in, continuing to booking.");
    return;
  }

  await fillPlaceholder(page, "Phone Number or Email", loginData.email);
  await fillPlaceholder(page, "Password", loginData.password);
  await page
    .getByRole("button", { name: /^log in$/i })
    .filter({ has: page.locator("span", { hasText: /^log in$/i }) })
    .last()
    .click();

  await page.waitForFunction(() => Boolean(window.localStorage.getItem("authToken")));
  await page.waitForURL((url) => !/\/auth\/login/i.test(url.pathname), {
    timeout: Number(process.env.LOGIN_TIMEOUT || 60000),
  }).catch(() => {});

  const hasToken = await page.evaluate(() => Boolean(window.localStorage.getItem("authToken")));
  if (!hasToken) {
    throw new Error("Login did not store authToken in localStorage.");
  }

  console.log("Login successful.");
}

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(12, 0, 0, 0);
  return date;
}

async function fillPlaceholder(page, placeholder, value) {
  const field = page.getByPlaceholder(placeholder).first();
  await field.scrollIntoViewIfNeeded();
  await field.fill(value);
}

async function clickText(page, textOrRegex) {
  const target = page.getByText(textOrRegex, { exact: typeof textOrRegex === "string" }).first();
  await target.scrollIntoViewIfNeeded();
  await target.click();
}

async function selectOption(page, triggerText, optionText) {
  await clickText(page, triggerText);
  await page.getByRole("option", { name: optionText, exact: true }).click();
}

async function fillHyperPayField(page, selectors, value) {
  for (const frame of page.frames()) {
    for (const selector of selectors) {
      const locator = frame.locator(selector).first();
      if (await locator.count()) {
        try {
          await locator.waitFor({ state: "visible", timeout: 5000 });
          await locator.fill(value);
          return;
        } catch {
          // Keep trying alternate selectors/frames.
        }
      }
    }
  }

  throw new Error(`Could not find HyperPay field for value ending with "${value.slice(-4)}".`);
}

async function clickHyperPaySubmit(page) {
  const selectors = [
    ".wpwl-button-pay",
    'button[type="submit"]',
    'input[type="submit"]',
    'button:has-text("Pay")',
    'button:has-text("Submit")',
  ];

  for (const frame of page.frames()) {
    for (const selector of selectors) {
      const locator = frame.locator(selector).first();
      if (await locator.count()) {
        try {
          await locator.waitFor({ state: "visible", timeout: 5000 });
          await locator.click();
          return;
        } catch {
          // Keep trying alternate submit controls.
        }
      }
    }
  }

  throw new Error("Could not find HyperPay submit button.");
}
