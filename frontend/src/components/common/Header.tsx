import React, { useState, useEffect } from "react";
import { Globe, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [compact, setCompact] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems: NavItem[] = [
    { id: "home", label: "Home", href: "/" },
    { id: "singers", label: "Singers listing", href: "/singers" },
    { id: "about", label: "About Us", href: "/about" },
    { id: "testimonials", label: "Testimonials", href: "/testimonials" },
  ];

  const handleNavClick = (id: string, href: string) => {
    setActiveNav(id);
    setMobileMenuOpen(false); // Close mobile menu on navigation
    if (href === "/") {
      navigate(href);
    }
  };

  // Toggle compact header on scroll
  useEffect(() => {
    const onScroll = () => {
      const shouldCompact = window.scrollY > 48; // threshold in px
      setCompact(shouldCompact);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // init state
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={compact ? "compact" : "expanded"}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      variants={{
        expanded: {
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 32,
          paddingRight: 32,
          borderRadius: 20,
          top: 16,
          left: "50%",
          x: "-50%",
          width: "90%",
          maxWidth: "100%",
        },
        compact: {
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 24,
          paddingRight: 24,
          borderRadius: 0,
          top: 0,
          left: 0,
          x: 0,
          width: "100%",
          maxWidth: "100%",
        },
      }}
      className="bg-primary shadow-lg flex items-center justify-between fixed z-50"
      style={{ willChange: "transform, width, padding" }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <motion.img
          src={LogoFull}
          alt="Singerlia Logo"
          className="object-cover"
          animate={{
            scale: compact ? 0.75 : 1,
            marginRight: compact ? 8 : 56,
            width: compact ? 120 : 160,
            height: compact ? 60 : 80,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        />

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-12">
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
              <motion.span
                className="text-white heading font-normal hover:text-secondary transition-colors"
                animate={{
                  fontSize: compact ? "14px" : "16px",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                {item.label}
              </motion.span>
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
      <div className="flex items-center gap-2 md:gap-4">
        {/* Hamburger Menu - Mobile Only */}
        <button
          className="md:hidden text-white hover:text-secondary transition-colors p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </button>

        {/* Language/Globe Icon - Desktop Only */}
        <button
          className="hidden md:block text-white hover:text-secondary transition-colors p-2"
          aria-label="Change language"
        >
          <motion.div
            animate={{
              scale: compact ? 0.9 : 1,
            }}
          >
            <Globe size={compact ? 20 : 24} />
          </motion.div>
        </button>

        {/* Log In Button - Desktop Only */}
        <motion.div
          className="hidden md:block"
          animate={{
            scale: compact ? 0.9 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <Button
            variant="default"
            size={compact ? "small" : "medium"}
            onClick={() => navigate("/auth/login")}
          >
            Log In
          </Button>
        </motion.div>

        {/* Sign Up Button - Desktop Only */}
        <motion.div
          className="hidden md:block"
          animate={{
            scale: compact ? 0.9 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <Button
            variant="primary"
            className="!px-6 sm:!px-10"
            size={compact ? "small" : "medium"}
            onClick={() => navigate("/auth/create-account")}
          >
            Sign Up
          </Button>
        </motion.div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-6/7 left-0 w-full bg-primary shadow-lg md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id, item.href);
                    }}
                    className="relative group py-2"
                  >
                    <span
                      className={`text-white heading text-base font-normal hover:text-secondary transition-colors ${
                        activeNav === item.id ? "text-secondary" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                    {activeNav === item.id && (
                      <div className="absolute left-0 bottom-0 flex items-center gap-1">
                        <div className="w-8 h-1 bg-secondary rounded-full" />
                        <div className="w-1 h-1 bg-secondary rounded-full" />
                      </div>
                    )}
                  </a>
                ))}
              </nav>

              {/* Divider */}
              <div className="border-t border-white/20"></div>

              {/* Mobile Buttons */}
              <div className="flex flex-col space-y-3">
                <Button
                  variant="default"
                  size="medium"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/auth/login");
                  }}
                  className="w-full"
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/auth/create-account");
                  }}
                  className="w-full"
                >
                  Sign Up
                </Button>
              </div>

              {/* Language Selector in Mobile Menu */}
              <button
                className="flex items-center justify-center gap-2 text-white hover:text-secondary transition-colors py-2"
                aria-label="Change language"
              >
                <Globe size={20} />
                <span className="text-sm">Language</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
