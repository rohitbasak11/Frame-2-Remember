"use client";

import Image from "next/image";

export default function About() {
  return (
    <div id="about" className="scroll-mt-24">
      <section className="py-24 px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-heading leading-tight underline-offset-8 decoration-pink">
              The Story Behind <br /><span className="text-pink italic">The Lens</span>
            </h1>
            <div className="space-y-6 text-lg text-color-text-muted">
              <p className="text-xl text-color-text font-medium leading-relaxed">
                Frame 2 Remember was born out of a shared passion for capturing the raw,
                unscripted beauty of life. Established in 2018, we have been dedicated to preserving
                memories across New Zealand.
              </p>
              <p>
                Founded and run ever since by Rohit Basak and Vishnu, our mission has always been simple:
                to create timeless images that tell a story. Together, we approach every shoot with the
                same level of care, technical precision, and artistic vision.
              </p>
              <p>
                Whether it&apos;s the intimate glance during a wedding or the dynamic energy of a corporate
                event, we believe in the power of connection. Based in the stunning landscapes of New
                Zealand, we draw inspiration from our surroundings—incorporating natural light and
                authentic moments to create photography that resonates for a lifetime.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <div className="relative group overflow-hidden rounded-3xl w-full max-w-[320px] aspect-[4/5]">
              <Image 
                src="/rohitport.webp" 
                alt="Rohit Basak - Founder" 
                fill 
                className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 bg-white dark:bg-dark py-2 px-4 rounded-full text-sm font-semibold glass">
                Meet Rohit
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-3xl w-full max-w-[320px] aspect-[4/5] md:-translate-y-12">
              <Image 
                src="/vishport.webp" 
                alt="Vishnu - Founder" 
                fill 
                className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 bg-white dark:bg-dark py-2 px-4 rounded-full text-sm font-semibold glass">
                Meet Vishnu
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-12 bg-gray/50 dark:bg-white/5">
        <div className="max-w-[1400px] mx-auto">
            <h2 className="text-4xl font-heading text-center mb-16">Our Philosophy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    { title: "Authenticity", desc: "We believe the best photos are the ones where you are truly yourself.", icon: "✦" },
                    { title: "Excellence", desc: "Using state-of-the-art equipment and refined techniques for premium results.", icon: "✦" },
                    { title: "Connection", desc: "Building a relationship with our clients is the key to capturing their spirit.", icon: "✦" }
                ].map((value, i) => (
                    <div key={i} className="glass p-10 rounded-[40px] flex flex-col items-center text-center group hover:translate-y-[-10px] transition-all duration-500">
                        <div className="text-4xl text-pink mb-6 group-hover:scale-125 transition-transform">{value.icon}</div>
                        <h3 className="text-2xl font-heading mb-4">{value.title}</h3>
                        <p className="text-color-text-muted">{value.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}
