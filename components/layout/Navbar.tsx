"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import NavbarLogo from "./NavbarLogo";
import { useRouter, usePathname } from "next/navigation";

// Local helper component for smooth scrolling on anchor links
function SmoothLink({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string, onClick?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick();
    const [path, hash] = href.split('#');

    // If it's the same page and has a hash
    if ((path === "" || path === pathname) && hash) {
      const target = document.getElementById(hash);
      if (target && window.lenisInstance) {
        window.lenisInstance.scrollTo(target, { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

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
        className={`fixed left-1/2 -translate-x-1/2 z-[2000] px-[2vw] transition-all duration-500 ease-out overflow-hidden hidden md:flex ${
          isScrolled 
            ? "top-4 w-[95%] max-w-[1400px] h-20 glass border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-full backdrop-blur-xl saturate-150" 
            : "top-0 w-full max-w-[1400px] h-24 bg-transparent"
        }`}
      >
        <div className="w-full h-full flex items-center justify-between">
          {/* Left Links */}
          <div className="flex-1 flex items-center gap-8">
              <button 
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
                className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 transition-colors"
              >
                {theme === "light" ? "☀️" : "🌙"}
              </button>
              <ul className={`flex items-center gap-10 list-none transition-all duration-400 ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                <li><SmoothLink href="/" className="font-medium text-color-text hover:text-pink transition-colors">Home</SmoothLink></li>
                <li><SmoothLink href="/#about" className="font-medium text-color-text hover:text-pink transition-colors">About</SmoothLink></li>
              </ul>
          </div>

          {/* Center Logo */}
          <NavbarLogo isScrolled={isScrolled} />

          {/* Right Links */}
          <div className="flex-1 flex items-center justify-end">
              <ul className={`flex items-center gap-10 list-none transition-all duration-400 ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                <li><SmoothLink href="/#portfolio" className="font-medium text-color-text hover:text-pink transition-colors">Portfolio</SmoothLink></li>
                <li className="relative group">
                  <SmoothLink 
                    href="/#connect" 
                    className="flex items-center gap-1 font-medium text-color-text group-hover:text-pink transition-colors focus:outline-none"
                  >
                    Connect <ChevronDown size={16} />
                  </SmoothLink>
                  <ul className="absolute right-0 top-full mt-2 w-48 py-2 glass rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <li><Link href="/enquire" className="block px-4 py-2 hover:bg-pink/10 transition-colors">Enquiry</Link></li>
                    <li><Link href="/declaration" className="block px-4 py-2 hover:bg-pink/10 transition-colors">Declaration</Link></li>
                    <li><a href="https://wa.me/message/EVETACBTZR3QF1" target="_blank" className="block px-4 py-2 hover:bg-pink/10 transition-colors">WhatsApp</a></li>
                  </ul>
                </li>
              </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav
        className={`md:hidden fixed left-1/2 -translate-x-1/2 z-[2000] transition-all duration-500 ease-out overflow-hidden top-4 w-[90%] h-16 glass border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-full backdrop-blur-xl saturate-150 flex items-center justify-between px-6`}
      >
          <button 
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
                className="relative w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 transition-colors"
          >
                {theme === "light" ? "☀️" : "🌙"}
          </button>
          
          <NavbarLogo isScrolled={true} />

          <button 
                className="text-color-text flex-shrink-0 w-10 h-10 flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          >
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[1999] bg-white/80 dark:bg-[#0d0d10]/90 backdrop-blur-2xl flex flex-col justify-center items-center gap-6">
          <SmoothLink href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-heading hover:text-pink transition-colors">Home</SmoothLink>
          <SmoothLink href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-heading hover:text-pink transition-colors">About</SmoothLink>
          <SmoothLink href="/#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-heading hover:text-pink transition-colors">Portfolio</SmoothLink>
          <SmoothLink href="/#connect" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-heading hover:text-pink transition-colors">Connect</SmoothLink>
          <div className="w-12 h-[2px] bg-pink/30 my-2" />
          <Link href="/enquire" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-heading text-pink">Submit Enquiry</Link>
        </div>
      )}
    </>
  );
}
