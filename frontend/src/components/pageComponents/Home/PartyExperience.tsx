import { ArrowUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";

const carouselImages = [
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=500&q=80",
];

const PartyExperience: React.FC = () => {
  // Custom cursor state/refs (lerped follower)
  const sectionRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Track mouse within section bounds
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      setIsHovering(inside);
      if (inside) {
        targetPos.current.x = e.clientX;
        targetPos.current.y = e.clientY;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Smoothly follow target using lerp + rAF
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      // LERP factor controls smoothness (0.1-0.25 good range)
      const k = 0.18;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * k;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * k;
      setCursorPos({ x: currentPos.current.x, y: currentPos.current.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={sectionRef} className="w-full bg-white relative" style={{ cursor: isHovering ? "none" : "auto" }}>
      {/* Custom cursor that mimics the button */}
      {isHovering && (
        <div
          className="pointer-events-none fixed z-50"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full text-sm font-medium text-gray-900">
            {/* Outer gradient-stroked circle to match the button */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              className="absolute -inset-[20px]"
            >
              <circle cx="60" cy="60" r="59.5" fill="white" stroke="url(#paint0_linear_46_486)" />
              <defs>
                <linearGradient id="paint0_linear_46_486" x1="-52.8" y1="120" x2="145.2" y2="20.4" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" stopOpacity="0" />
                  <stop offset="1" stopColor="#4D4D4D" />
                </linearGradient>
              </defs>
            </svg>
            <ArrowUp className="absolute bottom-8 left-8 rotate-45" size={30} />
            <span className="absolute rotate-45 bottom-4 right-6 outfit">View all</span>
          </div>
        </div>
      )}
      <div className=" py-24 pl-6 lg:pl-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="space-y-6">
            <motion.h1
              className="text-6xl font-normal leading-tight text-gray-900 w-[500px]"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            >
              Together, let&apos;s make your event unforgettable!{" "}
              <motion.span
                className="text-primary inline-block"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                viewport={{ once: true, amount: 0.6 }}
              >
                with a ultimate party experience!
              </motion.span>
            </motion.h1>
            {/* Button replaced by custom cursor for this section */}
          </div>
          <div className="relative">
            <div className="rounded-l-3xl bg-[#3C1E66] px-8 py-10 text-white shadow-2xl">
              <Marquee gradient={false} speed={50} pauseOnHover={true}>
                {carouselImages.map((src, index) => (
                  <div
                    key={src}
                    className={`overflow-hidden rounded-2xl bg-white/10 mx-3 ${
                      index === 2 ? "hidden md:block" : ""
                    } ${index === 3 ? "hidden lg:block" : ""}`}
                  >
                    <img
                      src={src}
                      alt={`Party moment ${index + 1}`}
                      className="w-56 h-80 object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyExperience;
