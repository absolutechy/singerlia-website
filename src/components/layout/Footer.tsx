import { Button } from "@/components/common";
import React from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Star,
  CircleCheck,
  Pin,
} from "lucide-react";
import logo from "@/assets/images/common/logolia.png";

const quickLinks = [
  "Home",
  "Singers listing",
  "About Us",
  "Contact Us",
  "Testimonials",
];
const artistLinks = ["Join Platform", "Success Stories"];
const supportLinks = ["Help Center", "Contact Support", "Terms", "Policy"];

const Footer: React.FC = () => {
  return (
    <footer className="mt-24 w-full bg-primary text-white">
      <div className="custom-container px-6 py-20 lg:px-24">
        <div className="flex flex-col gap-10 border-b border-white/15 pb-12 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="md:flex hidden items-center gap-2 text-[#FFD700]">
              <div className="flex items-center gap-1 text-sm">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={`star-${index}`}
                    className="h-4 w-4 fill-[#FFD700] text-[#FFD700]"
                    strokeWidth={1.2}
                  />
                ))}
                <span className="ml-2 font-semibold">4.9 / 5</span>
              </div>
              <span className="text-xs">| 34,000+ Reviews</span>
            </div>
            <h2 className="max-w-2xl text-2xl font-semibold text-[#FFD700] md:text-3xl">
              Getting Started Singerlia in Easy Steps With Osm Experiences
            </h2>
            <div className="flex items-center gap-3 text-[#FFFFFF]">
              <CircleCheck className="h-5 w-5 border" strokeWidth={1.5} />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase">
                No credit card required
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 md:max-w-lg">
            <div className="flex md:hidden items-center gap-2 text-[#FFD700]">
              <div className="flex items-center gap-1 text-sm">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={`star-${index}`}
                    className="h-4 w-4 fill-[#FFD700] text-[#FFD700]"
                    strokeWidth={1.2}
                  />
                ))}
                <span className="ml-2 font-semibold">4.9 / 5</span>
              </div>
              <span className="text-xs">| 34,000+ Reviews</span>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-2 rounded-2xl lg:border border-white/20 lg:bg-white/40 p-1 pr-1 lg:shadow-sm">
              <input
                className="h-12 flex-1 my-3 rounded-2xl bg-transparent py-6 px-10 text-sm text-white border border-white/20 lg:border-none placeholder:text-white/40 focus:outline-none"
                type="email"
                placeholder="Enter your email"
                aria-label="Enter your email"
              />
              <Button variant="primary" size="large" type="button">
                <p className="font-normal text-base normal-case">
                  Subscribe News Letter
                </p>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 text-sm text-white/80 md:grid-cols-[minmax(0,1.7fr)_repeat(3,minmax(0,1fr))]">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Singerlia logo"
                className="h-16 w-16 rounded-full border border-white/15 bg-white/5 p-3"
              />
              <p className="text-2xl font-semibold tracking-wide text-white">
                Singerlia
              </p>
            </div>
            <p className="max-w-sm text-sm text-white/70">
              Professional live music booking made simple, secure, and
              memorable.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-white/70">
              <a
                href="#"
                aria-label="Facebook"
                className="transition hover:text-[#FFD700] border rounded-full border-white p-1"
              >
                <Facebook className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="transition hover:text-[#FFD700] border rounded-full border-white p-1"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="transition hover:text-[#FFD700] border rounded-full border-white p-1"
              >
                <Youtube className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                aria-label="Pinterest"
                className="transition hover:text-[#FFD700] border rounded-full border-white p-1"
              >
                <Pin className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="transition hover:text-[#FFD700] border rounded-full border-white p-1"
              >
                <Linkedin className="h-5 w-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-base font-semibold text-white">Quick Links</p>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a className="transition hover:text-[#FFD700]" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-base font-semibold text-white">For Artists</p>
            <ul className="space-y-3">
              {artistLinks.map((link) => (
                <li key={link}>
                  <a className="transition hover:text-[#FFD700]" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-base font-semibold text-white">Help & Support</p>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a className="transition hover:text-[#FFD700]" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-center text-xs text-white/60">
          © {new Date().getFullYear()} Singerlia. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
