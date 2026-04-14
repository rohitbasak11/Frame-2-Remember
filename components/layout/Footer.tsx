"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer id="footer" className="py-20 px-12 glass border-t border-glass-border relative z-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="relative w-48 h-16">
              <Image 
                src="/Logo-1.png" 
                alt="Frame 2 Remember" 
                fill 
                className="object-contain object-left pointer-events-none"
              />
            </div>
            <p className="text-color-text-muted max-w-xs">
              Photography by Rohit Basak and Vishnu. Based in New Zealand.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-heading mb-8">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-color-text-muted hover:text-pink transition-colors">Home</Link></li>
              <li><Link href="/#about" className="text-color-text-muted hover:text-pink transition-colors">About</Link></li>
              <li><Link href="/#portfolio" className="text-color-text-muted hover:text-pink transition-colors">Portfolio</Link></li>
              <li><Link href="/enquire" className="text-color-text-muted hover:text-pink transition-colors">Enquire Now</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-heading mb-8">Contact</h4>
            <div className="space-y-4 text-color-text-muted">
              <p><a href="mailto:rohitbasaknote@gmail.com" className="hover:text-pink transition-colors">rohitbasaknote@gmail.com</a></p>
              <p><a href="https://wa.me/message/EVETACBTZR3QF1" target="_blank" className="hover:text-pink transition-colors">Chat on WhatsApp</a></p>
              <p className="pt-4 text-sm uppercase tracking-widest">Established 2018</p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-color-text-muted">
          <p>&copy; 2018-{new Date().getFullYear()} Frame 2 Remember. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-pink transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-pink transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
