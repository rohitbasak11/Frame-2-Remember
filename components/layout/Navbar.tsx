"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initial Theme Sync - only runs on mount
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefDark ? "dark" : "light");
    
    // Check if we actually need to update the state to avoid unnecessary re-render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(prev => {
      if (prev !== initialTheme) return initialTheme;
      return prev;
    });
    document.documentElement.setAttribute("data-theme", initialTheme);

    // Scroll Handler
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <>
      <nav
        ref={navbarRef}
        className={`fixed left-1/2 -translate-x-1/2 z-[2000] px-8 transition-all duration-500 ease-out ${
          isScrolled 
            ? "top-4 w-[95%] max-w-[1400px] py-4 glass border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-full backdrop-blur-xl saturate-150" 
            : "top-0 w-full py-6 bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Left Links */}
          <div className="flex-1 flex items-center gap-8">
              <button 
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
                className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 transition-colors"
              >
                {/* Theme toggle SVG can be ported later, using simple emoji for now */}
                {theme === "light" ? "☀️" : "🌙"}
              </button>
              <ul className={`flex gap-10 list-none transition-all duration-400 ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"} hidden md:flex`}>
                <li><Link href="/" className="font-medium text-color-text hover:text-pink transition-colors">Home</Link></li>
                <li><Link href="/#about" className="font-medium text-color-text hover:text-pink transition-colors">About</Link></li>
              </ul>
          </div>

          {/* Center Logo Placeholder - The real logo sits over this in Layout */}
          <div id="nav-logo-placeholder" className={`transition-all duration-600 ${isScrolled ? "w-[120px] md:w-[160px]" : "w-0"} h-10`} />

          {/* Right Links */}
          <div className="flex-1 flex items-center justify-end">
              <ul className={`flex gap-10 list-none transition-all duration-400 ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"} hidden md:flex`}>
                <li><Link href="/#portfolio" className="font-medium text-color-text hover:text-pink transition-colors">Portfolio</Link></li>
                <li className="relative group">
                  <Link 
                    href="/#connect" 
                    aria-haspopup="true"
                    aria-expanded="false" // Would need state to be truly accurate, but hover-based for now
                    className="flex items-center gap-1 font-medium text-color-text group-hover:text-pink transition-colors focus:outline-none"
                  >
                    Connect <ChevronDown size={16} />
                  </Link>
                  <ul className="absolute right-0 top-full mt-2 w-48 py-2 glass rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <li><Link href="/enquire" className="block px-4 py-2 hover:bg-pink/10 transition-colors">Enquiry</Link></li>
                    <li><Link href="/declaration" className="block px-4 py-2 hover:bg-pink/10 transition-colors">Declaration</Link></li>
                    <li><a href="https://wa.me/message/EVETACBTZR3QF1" target="_blank" className="block px-4 py-2 hover:bg-pink/10 transition-colors">WhatsApp</a></li>
                  </ul>
                </li>
              </ul>

              <button 
                className="md:hidden text-color-text"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - rendered OUTSIDE the nav to avoid transform breaking fixed positioning */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[1999] bg-white/80 dark:bg-[#0d0d10]/90 backdrop-blur-2xl flex flex-col justify-center items-center gap-6">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-heading hover:text-pink transition-colors">Home</Link>
          <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-heading hover:text-pink transition-colors">About</Link>
          <Link href="/#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-heading hover:text-pink transition-colors">Portfolio</Link>
          <Link href="/#connect" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-heading hover:text-pink transition-colors">Connect</Link>
          <div className="w-12 h-[2px] bg-pink/30 my-2" />
          <Link href="/enquire" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-heading text-pink">Submit Enquiry</Link>
        </div>
      )}
    </>
  );
}
