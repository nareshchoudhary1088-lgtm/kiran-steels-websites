import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [mapVisible, setMapVisible] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (mapRef.current) observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("enquiries").insert({
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: form.message,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    setForm({ name: "", phone: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="get-quote" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="font-inter text-secondary uppercase tracking-[0.4em] font-black mb-4 text-[0.8rem] block opacity-80">
            REACH OUT
          </span>
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-6 text-primary font-rozha uppercase tracking-tight">Contact</h2>
          <p className="font-inter text-slate-500 max-w-xl mx-auto text-[1.1rem] font-medium leading-relaxed mb-12">
            Connect with our industrial experts for custom fabrication quotes and premium product inquiries.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl p-2 bg-white mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <a
            href="https://maps.app.goo.gl/7TiWppK8ibbWjSXt7"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-[250px] sm:h-[320px] bg-slate-100 rounded-xl overflow-hidden shadow-inner relative group"
            title="Open in Google Maps"
          >
            {/* Invisible overlay to capture clicks and add a subtle hover effect */}
            <div className="absolute inset-0 z-10 bg-transparent cursor-pointer group-hover:bg-black/5 transition-colors duration-300" />
            <iframe
              title="Kiran Steels Location"
              src="https://maps.google.com/maps?q=Kiran+Steels+Gopalapatnam+Visakhapatnam&output=embed&z=16"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="pointer-events-none"
            />
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Info */}
          <div className="space-y-12">
            <div className="space-y-10">
              <div className="space-y-8">
                <div>
                  <h3 className="font-inter font-bold text-[#1F2937] text-xl mb-3 flex items-center gap-2">
                    <MapPin size={20} className="text-[#850014]" /> Gopalapatnam (Main Office)
                  </h3>
                  <p className="font-inter text-slate-500 text-lg leading-relaxed mb-2 font-bold text-[#850014]">
                    KIRAN STEELS
                  </p>
                  <p className="font-inter text-slate-500 text-base leading-relaxed">
                    2-134/1 Opposite Police Station, Srinivas Nagar,<br />
                    Gopalapatnam, Visakhapatnam,<br />
                    Andhra Pradesh 530027
                  </p>
                  <a
                    href="https://maps.app.goo.gl/7TiWppK8ibbWjSXt7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-white font-bold text-[10px] uppercase tracking-wider bg-[#850014] px-4 py-2 rounded-sm hover:bg-[#a5001a] transition-colors"
                  >
                    Locate Main Office &#8599;
                  </a>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h3 className="font-inter font-bold text-[#1F2937] text-xl mb-3 flex items-center gap-2">
                    <MapPin size={20} className="text-[#850014]" /> Pendurthi Branch
                  </h3>
                  <p className="font-inter text-slate-500 text-lg leading-relaxed mb-2 font-bold text-[#850014]">
                    KIRAN STEEL INDUSTRIES
                  </p>
                  <p className="font-inter text-slate-500 text-base leading-relaxed">
                    6-126 Nh, Main Rd, near Lic Satelite Office,<br />
                    Balaji Nagar, Pendurthi, Pendurti,<br />
                    Andhra Pradesh 531173
                  </p>
                  <a
                    href="https://maps.app.goo.gl/WwtNBd9iBg7N3pqYA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-white font-bold text-[10px] uppercase tracking-wider bg-[#850014] px-4 py-2 rounded-sm hover:bg-[#a5001a] transition-colors"
                  >
                    Locate Pendurthi Branch &#8599;
                  </a>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                <div>
                  <h3 className="font-inter font-bold text-[#1F2937] text-lg mb-3 flex items-center gap-2">
                    <Phone size={18} className="text-[#850014]" /> Phone
                  </h3>
                  <div className="space-y-1">
                    <a href="tel:+919618012403" className="block text-[#850014] text-base font-semibold hover:underline">+91 96180 12403</a>
                    <a href="tel:+919640304230" className="block text-[#850014] text-base font-semibold hover:underline">+91 96403 04230</a>
                  </div>
                </div>
                <div>
                  <h3 className="font-inter font-bold text-[#1F2937] text-lg mb-3 flex items-center gap-2">
                    <Mail size={18} className="text-[#850014]" /> Email
                  </h3>
                  <a href="mailto:kiransteels1088@gmail.com" className="text-[#850014] text-base font-semibold hover:underline break-all">
                    kiransteels1088@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div id="enquiry-form" className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-100 relative overflow-hidden group scroll-mt-28">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#850014]" />

            <h3 className="text-2xl font-bold text-[#1F2937] mb-2">Send an Enquiry</h3>
            <p className="text-slate-500 text-sm mb-8">Fill out the form below and our team will get back to you shortly.</p>

            {submitted ? (
              <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h4>
                <p className="text-slate-500">Thank you for reaching out. We will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Rahul Sharma"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#850014]/20 focus:border-[#850014] transition-all outline-none text-slate-700"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#850014]/20 focus:border-[#850014] transition-all outline-none text-slate-700"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="rahul@example.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#850014]/20 focus:border-[#850014] transition-all outline-none text-slate-700"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your requirements..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#850014]/20 focus:border-[#850014] transition-all outline-none text-slate-700 resize-none"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-4 bg-[#850014] hover:bg-[#a5001a] text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-[#850014]/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Submit Enquiry"
                  )}
                  {!loading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
