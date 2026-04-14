"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle2, ShieldCheck, Download, Printer, AtSign } from "lucide-react";
import Link from "next/link";
import SignaturePad from "@/components/shared/SignaturePad";

export default function DeclarationPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [signature, setSignature] = useState<string>("");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signature) {
      alert("Please provide a digital signature to continue.");
      return;
    }
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Format message with consents
    const consents = [
      formData.get("social-consent") === "on" ? "Social Media: YES" : "Social Media: NO",
      formData.get("marketing-consent") === "on" ? "Marketing: YES" : "Marketing: NO",
      formData.get("ads-consent") === "on" ? "Advertising: YES" : "Advertising: NO",
    ].join(", ");

    const data = {
      name: name,
      email: email,
      time: new Date().toISOString(),
      message: consents,
      pdf_base64: signature,
    };

    const { error } = await supabase.from("declarations").insert([data]);

    if (error) {
      alert(error.message);
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
            <CheckCircle2 className="w-20 h-20 text-blue" />
          </div>
          <h2 className="text-4xl font-heading">Digital Signature Confirmed</h2>
          <p className="text-color-text-muted">Thank you, {name}. Your declaration has been securely recorded and timestamped.</p>
          <Link href="/" className="inline-block px-8 py-4 bg-dark text-white rounded-full font-bold hover:bg-pink transition-all">
            Return Home &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-12 bg-gray-50 dark:bg-dark scroll-smooth">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <Link href="/" className="inline-flex items-center gap-2 text-color-text-muted hover:text-pink transition-colors">
                &larr; Back to Home
            </Link>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-white/5 border border-glass-border rounded-full hover:border-pink transition-all">
                <Printer size={18} /> Print for Records
            </button>
        </div>

        <div id="declaration-content" className="glass p-12 md:p-20 rounded-[40px] space-y-12 relative overflow-hidden">
            {/* Header Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue via-pink to-salmon" />
            
            <header className="space-y-4">
                <div className="flex items-center gap-3 text-blue font-bold tracking-widest text-sm uppercase">
                    <ShieldCheck size={20} /> Legal & Confidentiality
                </div>
                <h1 className="text-4xl md:text-6xl font-heading">Model Release & <br />Service Declaration</h1>
                <p className="text-color-text-muted italic">Agreement Version 1.0 — Frame 2 Remember Studio</p>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-color-text-muted">
                <section className="space-y-4">
                    <h2 className="text-2xl font-heading text-color-text">1. Introduction</h2>
                    <p>This agreement (the &quot;Agreement&quot;) is made between Frame 2 Remember (&quot;Photographer&quot;) and the undersigned Client (&quot;Client&quot;). By signing this document, the Client acknowledges and agrees to the terms regarding the capture, usage, and protection of photographic works.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-heading text-color-text">2. Model Release & Grant of Rights</h2>
                    <p>The Client hereby grants to the Photographer the absolute and irrevocable right and permission to use, reuse, publish, and republish photographic portraits or pictures of the Client or in which the Client may be included, in whole or in part.</p>
                    <div className="bg-white/30 dark:bg-white/5 p-6 rounded-2xl border-l-4 border-pink space-y-4 italic text-sm">
                        <p>This includes but is not limited to usage in Photographer&apos;s portfolio, website, social media profiles, and promotional materials.</p>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-heading text-color-text">3. Commercial Consents</h2>
                    <p>Please indicate your specific preferences below:</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-8 pt-4">
                        <div className="space-y-4">
                            {[
                                { id: "social-consent", label: "I consent to photos being shared on official Social Media channels (Instagram, Facebook)." },
                                { id: "marketing-consent", label: "I consent to photos being used in website portfolios and digital brochures." },
                                { id: "ads-consent", label: "I consent to photos being used in paid advertising campaigns for the studio." }
                            ].map((item) => (
                                <label key={item.id} className="flex items-center gap-4 p-6 bg-white/50 dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-white transition-colors border border-transparent hover:border-pink/20">
                                    <input type="checkbox" name={item.id} defaultChecked className="w-6 h-6 rounded-lg accent-pink" />
                                    <span className="text-sm md:text-base text-color-text">{item.label}</span>
                                </label>
                            ))}
                        </div>

                        <section className="space-y-8 pt-8 border-t border-glass-border">
                            <h2 className="text-2xl font-heading text-color-text">4. Declaration & Signature</h2>
                            <p className="text-sm">I have read the terms above and certify that I am at least 18 years of age and have the full legal capacity to execute this release.</p>
                            
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs uppercase font-bold tracking-widest opacity-50">Full Legal Name</label>
                                        <input 
                                            name="name" 
                                            type="text" 
                                            required 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-transparent border-b-2 border-dark dark:border-white py-4 text-3xl font-heading outline-none focus:border-pink transition-colors" 
                                            placeholder="Type your name..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs uppercase font-bold tracking-widest opacity-50">Email Address</label>
                                        <div className="flex items-center gap-3 border-b-2 border-dark dark:border-white focus-within:border-pink transition-colors">
                                            <AtSign size={20} className="opacity-30" />
                                            <input 
                                                name="email" 
                                                type="email" 
                                                required 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-transparent py-4 text-xl outline-none" 
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs uppercase font-bold tracking-widest opacity-50 flex justify-between">
                                        <span>Digital Signature Area</span>
                                        <span className={signature ? "text-green-500" : "text-salmon"}>
                                            {signature ? "✓ Signed" : "Required"}
                                        </span>
                                    </label>
                                    <SignaturePad 
                                        onSave={setSignature}
                                        onClear={() => setSignature("")}
                                    />
                                    <p className="text-[10px] uppercase opacity-40">Your hand-drawn signature acts as a legally binding digital mark of agreement</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs uppercase font-bold tracking-widest opacity-50">Date of Declaration</label>
                                    <div className="text-2xl font-heading opacity-50">
                                        {new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-6 bg-dark text-white rounded-3xl font-bold text-xl hover:bg-blue transition-all duration-500 shadow-xl disabled:opacity-50"
                        >
                            {loading ? "Recording Agreement..." : "Finalize & Sign Declaration"}
                        </button>
                    </form>
                </section>
            </div>
        </div>

        <footer className="text-center text-color-text-muted text-sm pb-12">
            &copy; {new Date().getFullYear()} Frame 2 Remember. All digital declarations are time-stamped and securely stored.
        </footer>
      </div>
    </div>
  );
}

