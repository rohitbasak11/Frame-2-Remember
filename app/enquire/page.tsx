"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function EnquirePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      event_type: formData.get("shoot-type"),
      duration: formData.get("shoot-length"),
      location: formData.get("location"),
      budget: formData.get("budget"),
      source: formData.get("source"),
      comments: formData.get("comments"),
    };

    const { error } = await supabase.from("enquiries").insert([data]);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-12 bg-gray-50 dark:bg-dark">
        <div className="glass max-w-lg p-12 rounded-[40px] text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          <h2 className="text-4xl font-heading">Enquiry Received</h2>
          <p className="text-color-text-muted">Thank you for sharing your vision with us. We&apos;ll review your details and get back to you within 24 hours.</p>
          <Link href="/" className="inline-block px-8 py-4 bg-dark text-white rounded-full font-bold hover:bg-pink transition-all">
            Return Home &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-12 bg-gray-50 dark:bg-dark scroll-smooth">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8 lg:sticky lg:top-32 self-start">
          <Link href="/" className="inline-flex items-center gap-2 text-color-text-muted hover:text-pink transition-colors mb-4">
            &larr; Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-heading leading-tight underline-offset-8 decoration-pink">
            Let&apos;s <span className="text-blue italic">Capture</span> Something <span className="text-pink italic">Beautiful</span>
          </h1>
          <p className="text-lg text-color-text-muted max-w-md">
            Fill out the form below and I&apos;ll get back to you within 24 hours to discuss how we can bring your story to life.
          </p>
          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-4 text-color-text">
                <div className="w-10 h-10 rounded-full bg-pink/10 flex items-center justify-center text-pink"><Sparkles size={20} /></div>
                <span className="font-medium">Premium Quality Since 2018</span>
            </div>
          </div>
        </div>

        <div className="glass p-10 md:p-12 rounded-[40px] relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-widest text-color-text-muted">Full Name *</label>
                <input name="name" type="text" required className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-glass-border focus:border-pink outline-none transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-widest text-color-text-muted">Email Address *</label>
                <input name="email" type="email" required className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-glass-border focus:border-pink outline-none transition-all" placeholder="john@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-color-text-muted">Phone Number *</label>
              <input name="phone" type="tel" required className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-glass-border focus:border-pink outline-none transition-all" placeholder="+64 123 4567" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-widest text-color-text-muted">Type of Shoot *</label>
                <select name="shoot-type" required className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-glass-border focus:border-pink outline-none transition-all appearance-none cursor-pointer">
                  <option value="" disabled selected>Select an option</option>
                  <option value="Individual Portrait">Individual Portrait</option>
                  <option value="Couple Session">Couple Session</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Family Portraits">Family Portraits</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-widest text-color-text-muted">Expected Length *</label>
                <select name="shoot-length" required className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-glass-border focus:border-pink outline-none transition-all appearance-none cursor-pointer">
                  <option value="" disabled selected>Select duration</option>
                  <option value="1-2 Hours">1-2 Hours</option>
                  <option value="Half Day (3-4 Hours)">Half Day (3-4 Hours)</option>
                  <option value="Full Day (8+ Hours)">Full Day (8+ Hours)</option>
                  <option value="Multiple Days">Multiple Days</option>
                  <option value="Not Sure Yet">Not Sure Yet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-widest text-color-text-muted">Event Location</label>
                <input name="location" type="text" className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-glass-border focus:border-pink outline-none transition-all" placeholder="City or Venue" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-widest text-color-text-muted">Estimated Budget</label>
                <input name="budget" type="text" className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-glass-border focus:border-pink outline-none transition-all" placeholder="NZD ($)" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-color-text-muted">How did you hear about us?</label>
              <select name="source" className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-glass-border focus:border-pink outline-none transition-all appearance-none cursor-pointer">
                <option value="" disabled selected>Select an option</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Friend/Family">Friend/Family Recommendation</option>
                <option value="Venue">Venue Recommendation</option>
                <option value="Google">Google Search</option>
                <option value="Direct Connection">Been to a shoot/event before</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-color-text-muted">Tell us more about your vision</label>
              <textarea name="comments" className="w-full px-6 py-4 min-h-[160px] rounded-2xl bg-white/50 dark:bg-white/5 border border-glass-border focus:border-pink outline-none transition-all resize-none" placeholder="We'd love to hear some details..." />
            </div>

            {error && <p className="text-salmon text-sm bg-salmon/10 p-4 rounded-xl">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 bg-dark text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-pink transition-all duration-300 disabled:opacity-50 group"
            >
              {loading ? "Sending Enquiry..." : (
                <>
                  Submit Enquiry <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
