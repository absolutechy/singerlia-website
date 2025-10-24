import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const action = useNavigationType();

  // Disable browser's native scroll restoration so our logic always wins
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {}
    }
  }, []);

  useEffect(() => {
    const scrollTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    if (action === "POP") {
      // On back/forward, some browsers restore after effects; defer ours
      const id = requestAnimationFrame(() => {
        setTimeout(scrollTop, 0);
      });
      return () => cancelAnimationFrame(id);
    }

    // For PUSH/REPLACE navigate, scroll immediately
    scrollTop();
  }, [pathname, action]);

  return null;
};

export default ScrollToTop;
