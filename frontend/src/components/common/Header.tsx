import React, { useState } from "react";
import { Globe } from "lucide-react";
import Button from "./Button";
import LogoFull from "../../assets/images/common/logofull.png";
import { useNavigate } from "react-router";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<string>("home");

  const navItems: NavItem[] = [
    { id: "home", label: "Home", href: "/" },
    { id: "singers", label: "Singers listing", href: "/singers" },
    { id: "about", label: "About Us", href: "/about" },
    { id: "testimonials", label: "Testimonials", href: "/testimonials" },
  ];

  const handleNavClick = (id: string, href: string) => {
    setActiveNav(id);
    if (href === "/") {
      navigate(href);
    }
  };

  return (
    <header className="bg-primary w-full rounded-[20px] shadow-lg custom-container pr-8 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={LogoFull}
          alt="Singerlia Logo"
          className="w-40 h-20 object-cover mr-14"
        />

        {/* Navigation Links */}
        <nav className="flex items-center gap-12">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id, item.href);
              }}
              className="relative group"
            >
              <span className="text-white heading text-base font-normal hover:text-secondary transition-colors">
                {item.label}
              </span>
              {/* Active indicator dots */}
              {activeNav === item.id && (
                <div className="absolute -bottom-2 left-0 flex items-center gap-1">
                  <div className="w-8 h-1 bg-secondary rounded-full" />
                  <div className="w-1 h-1 bg-secondary rounded-full" />
                </div>
              )}
            </a>
          ))}
        </nav>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Language/Globe Icon */}
        <button
          className="text-white hover:text-secondary transition-colors p-2"
          aria-label="Change language"
        >
          <Globe size={24} />
        </button>

        {/* Log In Button */}
        <Button
          variant="default"
          size="medium"
          onClick={() => navigate("/auth/login")}
        >
          Log In
        </Button>

        {/* Sign Up Button */}
        <Button
          variant="primary"
          className="!px-10"
          size="medium"
          onClick={() => navigate("/auth/create-account")}
        >
          Sign Up
        </Button>
      </div>
    </header>
  );
};

export default Header;
