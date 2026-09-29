# Website translations

Edit matching files in `locales/en/` and `locales/ar/`:

| File | Content |
| --- | --- |
| `common.ts` | Shared labels, header, footer, and cities |
| `home.ts` | Home sections and hero |
| `search.ts` | Search controls and results |
| `singerDetails.ts` | Singer details and FAQs |
| `bookings.ts` | Booking forms and summaries |
| `payments.ts` | Payment results and HyperPay labels |
| `auth.ts` | Login, registration, and verification |
| `contact.ts` | Contact page |

Keep existing flat keys such as `auth.login`; components continue to use
`useLanguage().t(key, params)`. Preserve interpolation placeholders such as
`{name}` in both languages.

Each Arabic feature dictionary uses the matching English dictionary's keys as
its TypeScript contract. Missing or extra Arabic keys fail `npm run build`.
English values define keys, not the required Arabic text.

The locale `index.ts` files combine feature dictionaries. `translations.ts`
exports the combined dictionaries, language metadata, and `TranslationKey`.
When introducing a new feature file, import and spread it in both locale indexes,
and use the same `satisfies Record<keyof typeof en, string>` pattern in Arabic.
Keep each key in exactly one feature file.

Language persistence, interpolation, and document direction remain in
`LanguageContext.tsx`.
