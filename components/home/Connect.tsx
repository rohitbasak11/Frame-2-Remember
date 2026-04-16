"use client";

import Link from "next/link";
import { Sparkles, FileText, MessageCircle, Mail, Star } from "lucide-react";

export default function Connect() {
  const options = [
    {
      href: "/enquire",
      icon: <Sparkles className="w-10 h-10" />,
      title: "Let's Create",
      desc: "Ready to capture your memories? Head over to our enquiry form to share the details of your upcoming wedding or event, and we'll get the conversation started.",
      btnText: "Submit Enquiry"
    },
    {
      href: "/declaration",
      icon: <FileText className="w-10 h-10" />,
      title: "Formalities",
      desc: "For our booked clients: Please read and complete our digital declaration and confidentiality agreement to formalize our upcoming collaboration.",
      btnText: "Sign Declaration"
    },
    {
      href: "https://wa.me/message/EVETACBTZR3QF1",
      icon: <MessageCircle className="w-10 h-10" />,
      title: "Instant Chat",
      desc: "Want a faster response? Connect with us instantly over WhatsApp Business for quick questions, scheduling updates, or direct consultations.",
      btnText: "WhatsApp Us",
      external: true
    },
    {
      href: "mailto:rohitbasaknote@gmail.com",
      icon: <Mail className="w-10 h-10" />,
      title: "Direct Line",
      desc: "Have a formal question or a unique request? Reach out to our studio directly via email and we will respond as soon as possible.",
      btnText: "Email Us",
      external: true
    }
  ];

  return (
    <div id="connect" className="py-24 px-12 bg-white/5 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto">
        <section className="mb-16 text-center">
            <h1 className="text-5xl md:text-7xl font-heading mb-6 tracking-tight">
                Let&apos;s <span className="text-pink italic">Connect</span>
            </h1>
            <p className="text-lg md:text-xl text-color-text-muted max-w-2xl mx-auto">
                Choose how you&apos;d like to get in touch. Whether it&apos;s planning your next big shoot, reviewing our agreements, or just saying hello.
            </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {options.map((opt, i) => (
                <Link 
                    key={i} 
                    href={opt.href} 
                    target={opt.external ? "_blank" : undefined}
                    className="glass p-10 rounded-[40px] flex flex-col group hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-500"
                >
                    <div className="mb-8 text-pink group-hover:scale-110 transition-transform duration-500 origin-left">
                        {opt.icon}
                    </div>
                    <h2 className="text-3xl font-heading mb-4">{opt.title}</h2>
                    <p className="text-color-text-muted mb-8 line-clamp-4">{opt.desc}</p>
                    <div className="mt-auto font-semibold text-color-text group-hover:text-pink transition-colors">
                        {opt.btnText} &rarr;
                    </div>
                </Link>
            ))}

            <div className="glass p-10 rounded-[40px] flex flex-col lg:col-span-2 group">
                <div className="mb-8 text-pink group-hover:scale-110 transition-transform duration-500 origin-left">
                    <Star className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-heading mb-4">Our Journey</h2>
                <p className="text-color-text-muted mb-8">
                    Follow the daily frames, behind-the-scenes moments, and our latest curated portfolios over on Instagram.
                </p>
                <div className="flex flex-wrap gap-6 mt-auto">
                    <a href="https://www.instagram.com/frame2remember" target="_blank" className="font-semibold hover:text-pink transition-colors">Follow F2R &rarr;</a>
                    <a href="https://www.instagram.com/rohitbasak11" target="_blank" className="font-semibold text-salmon hover:text-pink transition-colors">Personal Insta &rarr;</a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
