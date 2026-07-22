import { Phone, Mail, MapPin } from "lucide-react";
import ksLogo from "../assets/ks_logo.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const Footer = () => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const contact = formData.get("contact") as string;
    
    if (!contact) return;

    const isEmail = contact.includes("@");
    const type = isEmail ? "email" : "phone";

    setLoading(true);
    const { error } = await supabase.from("subscribers").insert({ contact, type });
    setLoading(false);

    if (error) {
      if (error.code === '23505') {
         toast.error("You are already subscribed!");
      } else {
         toast.error(`Failed: ${error.message || "Please try again."}`);
      }
    } else {
      toast.success("Successfully subscribed to price alerts!");
      form.reset();
    }
  };

  return (
    <footer className="bg-steel-dark text-white py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-14 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-full overflow-hidden shadow-lg border border-white/10">
                <img
                  src={ksLogo}
                  alt="Kiran Steels"
                  className="w-full h-full object-cover scale-[1.05]"
                />
              </div>
              <span className="font-rozha font-bold text-2xl sm:text-3xl tracking-wider text-white">
                KIRAN STEELS
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed font-medium">
              Your premier destination for Jindal stainless steel pipes (Grade 316, 304 & JT), plus expert fabrication works including staircase railings, high-security gates, intricate grills, and custom signage.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h4 className="text-secondary font-bold text-sm uppercase tracking-[0.2em] mb-6">Explore</h4>
            <ul className="space-y-4">
              {["Home", "About Us", "Product", "Get Quote"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-white/60 text-sm font-medium hover:text-secondary transition-all hover:pl-2"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-secondary font-bold text-sm uppercase tracking-[0.2em] mb-6">Contact Us</h4>
            <div className="space-y-4">
              <p className="text-white/60 text-sm leading-relaxed font-medium">
                2-134/1 Opposite Police Station, Srinivas Nagar,<br />
                Gopalapatnam, Visakhapatnam,<br />
                Andhra Pradesh 530027
              </p>
              <div className="space-y-2">
                <a href="tel:+919618012403" className="text-white/60 text-[13px] hover:text-secondary block font-medium transition-colors">+91 96180 12403</a>
                <a href="tel:+919640304230" className="text-white/60 text-[13px] hover:text-secondary block font-medium transition-colors">+91 96403 04230</a>
                <a href="tel:+917665491606" className="text-white/60 text-[13px] hover:text-secondary block font-medium transition-colors">+91 76654 91606</a>
                <a href="mailto:kiransteels1088@gmail.com" className="text-white/60 text-[13px] hover:text-secondary block font-medium transition-all break-all mt-4">
                  kiransteels1088@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-secondary font-bold text-sm uppercase tracking-[0.2em] mb-6">Price Alerts</h4>
            <div className="space-y-4">
              <p className="text-white/60 text-sm leading-relaxed font-medium">
                Subscribe to get notified about steel price drops, new arrivals, and clearance sales.
              </p>
              <form 
                onSubmit={handleSubscribe}
                className="flex flex-col gap-3 mt-4"
              >
                <input 
                  type="text" 
                  name="contact"
                  required
                  placeholder="Email or WhatsApp number" 
                  className="bg-white/5 border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-secondary text-white font-bold text-sm rounded-md px-4 py-3 hover:bg-secondary/90 transition-colors uppercase tracking-wider disabled:opacity-50"
                >
                  {loading ? "Subscribing..." : "Subscribe Now"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest font-bold">© 2025 Kiran Steels. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest font-bold">Visakhapatnam</span>
            <span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest font-bold">Andhra Pradesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
