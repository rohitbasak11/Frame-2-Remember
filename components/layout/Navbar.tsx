"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initial Theme Sync
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefDark ? "dark" : "light");
    setTheme(initialTheme);
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
    <nav
      ref={navbarRef}
      className={`fixed top-0 left-0 w-full z-[2000] px-12 transition-all duration-400 ${
        isScrolled 
          ? "py-4 glass border-b border-glass-border" 
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Left Links */}
        <div className="flex-1 flex items-center gap-8">
            <button 
              onClick={toggleTheme}
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
                <button className="flex items-center gap-1 font-medium text-color-text group-hover:text-pink transition-colors focus:outline-none">
                  Connect <ChevronDown size={16} />
                </button>
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
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[80px] glass z-[1900] flex flex-col p-8 gap-8 animate-in fade-in slide-in-from-top-4">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-heading">Home</Link>
          <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-heading">About</Link>
          <Link href="/#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-heading">Portfolio</Link>
          <Link href="/enquire" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-heading">Enquiry</Link>
        </div>
      )}
    </nav>
  );
}
