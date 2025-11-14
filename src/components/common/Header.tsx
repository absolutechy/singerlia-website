import React, { useState, useEffect, useRef } from "react";
import { Globe, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import LogoFull from "../../assets/images/common/logofull.png";
import LogoIcon from "@/assets/images/common/logolia.png"
import { Link, useNavigate, useLocation } from "react-router";
import authService, { type UserMetadata, subscribeToAuthChanges } from "@/api/services/authService";
import { toast } from "sonner";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState<string>("home");
  const [compact, setCompact] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserMetadata | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { id: "home", label: "Home", href: "/" },
    { id: "artists", label: "Artists listing", href: "/search" },
    { id: "contact", label: "Contact", href: "/contact" }
  ];

  const handleNavClick = (id: string, href: string) => {
    setActiveNav(id);
    setMobileMenuOpen(false); // Close mobile menu on navigation
    navigate(href);
  };

  // Sync activeNav with current location
  useEffect(() => {
    const currentItem = navItems.find(item => item.href === location.pathname);
    if (currentItem) {
      setActiveNav(currentItem.id);
    }
  }, [location.pathname]);

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

  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    // initialize in case SSR started with 0
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // optional: automatically close mobile menu when switching to desktop width
  useEffect(() => {
    if (windowWidth >= 768 && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [windowWidth, mobileMenuOpen]);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Header - Checking authentication...');
      const isAuth = authService.isAuthenticated();
      console.log('Header - isAuthenticated:', isAuth);
      
      if (isAuth) {
        console.log("Header - User is authenticated, fetching user data");
        try {
          const result = await authService.checkAuth();
          console.log("Header - checkAuth result:", result);
          setUser({
            userId: result.userId,
            name: result.name,
            role: result.role,
          });
          console.log("Header - User state updated:", { userId: result.userId, name: result.name, role: result.role });
        } catch (err) {
          console.error("Header - checkAuth failed:", err);
          // Token invalid, clear auth
          authService.logout();
          setUser(null);
        }
      } else {
        console.log("Header - User is NOT authenticated");
        setUser(null);
      }
    };
    
    // Check auth on mount
    console.log('Header - Component mounted, checking auth...');
    checkAuth();
    
    // Subscribe to auth changes (login/logout from other components)
    const unsubscribe = subscribeToAuthChanges(() => {
      console.log('Header - Auth state changed event received!');
      checkAuth();
    });
    
    return unsubscribe;
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    // Don't close dropdown immediately - keep it open while logging out
    
    try {
      await authService.logout();
      setUser(null);
      toast.success("Logged out successfully!");
      setDropdownOpen(false); // Close dropdown after successful logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error("Logout failed. Please try again.");
      setDropdownOpen(false); // Close dropdown even on error
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.header
      initial={false}
      animate={compact ? "compact" : "expanded"}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      variants={{
        expanded: {
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 16,
          paddingRight: 16,
          borderRadius: 20,
          top: 16,
          left: windowWidth > 1024 ? '50%' : 32,
          x: 0,
          transform: windowWidth > 1024 ? "translateX(-50%)" : "translateX(-15px)",
          width: "90vw",
          maxWidth: "100vw",
        },
        compact: {
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
          borderRadius: 0,
          top: 0,
          left: windowWidth > 640 ? '50%' : 0,
          transform: windowWidth > 640 ? "translateX(-50%)" : "none",
          x: 0,
          width: "100vw",
          maxWidth: "100vw",
        },
      }}
      className="bg-primary shadow-lg flex items-center justify-between fixed z-50 box-border"
      style={{ willChange: "transform, width, padding", maxWidth: "100vw" }}
    >
      {/* Logo */}
      <div className="flex items-center min-w-0">
        <Link to="/" className="mr-6">
        <motion.img
          src={compact ? LogoIcon : LogoFull}
          alt="Singerlia Logo"
          className="object-cover"
          animate={{
              scale: compact ? 0.75 : 1,
              marginRight: compact ? 4 : 24,
            width: compact ? 40 : 140,
            height: compact ? 40 : 70,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-12">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
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
            </Link>
          ))}
        </nav>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
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
        {/* <button
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
        </button> */}

        {/* Authenticated User Avatar & Dropdown - Desktop Only */}
        {user ? (
          <div className="hidden md:block relative" ref={dropdownRef}>
            <motion.button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              animate={{
                scale: compact ? 0.9 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <User size={18} className="text-primary" />
              </div>
              <span className="text-white text-sm font-medium">{user.name}</span>
              <ChevronDown 
                size={16} 
                className={`text-white transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
              />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/dashboard');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <LayoutDashboard size={18} />
                    <span className="font-medium">Dashboard</span>
                  </button>
                  <div className="border-t border-gray-200"></div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                      isLoggingOut 
                        ? 'text-red-400 bg-red-50/50 cursor-not-allowed' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <LogOut size={18} />
                    <span className="font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
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
                className="!text-base"
                size={compact ? "large" : "medium"}
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
                className="!px-6 sm:!px-10 !text-base"
                size={compact ? "large" : "medium"}
                onClick={() => navigate("/auth/create-account")}
              >
                Sign Up
              </Button>
            </motion.div>
          </>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-5/6 left-0 w-full bg-primary shadow-lg md:hidden overflow-hidden box-border"
            style={{ maxWidth: "100vw" }}
          >
            <div className="flex flex-col p-4 space-y-4">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
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
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="border-t border-white/20"></div>

              {/* Mobile Auth Section */}
              {user ? (
                <div className="flex flex-col space-y-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3 py-2">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <User size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{user.name}</p>
                      <p className="text-white/70 text-xs capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="default"
                    size="medium"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/dashboard");
                    }}
                    className="w-full flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Button>
                  
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    disabled={isLoggingOut}
                    className={`w-full flex items-center justify-center gap-2 cursor-pointer ${
                      isLoggingOut
                        ? '!bg-red-400 !opacity-70 !cursor-not-allowed'
                        : '!bg-red-600 hover:!bg-red-700'
                    }`}
                  >
                    <LogOut size={18} />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </Button>
                </div>
              ) : (
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
              )}

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
