import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight, CircleDot, Sheet, DoorOpen, Building2, Layers, Glasses, Columns3, Grid2X2, Type, Activity, Home, Armchair } from "lucide-react";
import ksLogo from "../assets/ks_logo.png";

const productCategories = [
  { name: "Pipes & Tubes", full: "Stainless Steel Pipes & Tubes", icon: CircleDot, color: "from-blue-500 to-blue-700" },
  { name: "Fitting Items", full: "Stainless Steel Fitting Items", icon: Sheet, color: "from-slate-500 to-slate-700" },
  { name: "Gates", full: "Stainless Steel Gates", icon: DoorOpen, color: "from-red-500 to-red-700" },
  { name: "Compound Gates", full: "Stainless Steel Compound Gates", icon: Building2, color: "from-orange-500 to-orange-700" },
  { name: "Railing", full: "Stainless Steel Railing", icon: Layers, color: "from-emerald-500 to-emerald-700" },
  { name: "Glass Railing", full: "Stainless Steel Glass Railing", icon: Glasses, color: "from-cyan-500 to-cyan-700" },
  { name: "Balkani", full: "Stainless Steel Balkani", icon: Columns3, color: "from-purple-500 to-purple-700" },
  { name: "Utility Box & Grills", full: "Stainless Steel Box and Grills", icon: Grid2X2, color: "from-amber-500 to-amber-700" },
  { name: "Signboards", full: "Stainless Steel Letters (Signboards)", icon: Type, color: "from-pink-500 to-pink-700" },
  { name: "Spiral Staircase", full: "Stainless Steel Spiral Staircase", icon: Activity, color: "from-indigo-500 to-indigo-700" },
  { name: "Mandir Designs", full: "Stainless Steel Mandir Designs", icon: Home, color: "from-rose-500 to-rose-700" },
  { name: "Chairs & Tables", full: "Stainless Steel Chairs & Tables", icon: Armchair, color: "from-teal-500 to-teal-700" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (window.scrollY < 50) {
        setActiveSection("");
        return;
      }

      // Determine active section for scroll spy
      const sections = ["home", "about-us", "product", "get-quote", "enquiry-form"];
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) { // Slightly larger threshold to catch it earlier
            current = section;
          }
        }
      }
      if (current) {
        if (current === "get-quote" || current === "enquiry-form") {
          setActiveSection("enquiry-form");
        } else {
          setActiveSection(current);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setProductDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setProductDropdownOpen(false);
    }, 250);
  };

  const links = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about-us" },
    { name: "Product", href: "#product", hasDropdown: true },
    { name: "Get Quote", href: "#enquiry-form", highlight: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-2 sm:px-6 pt-2 sm:pt-4 pointer-events-none`}
    >
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-500 pointer-events-auto ${
          scrolled
            ? "bg-white/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-amber-500/30 py-2 px-4 sm:px-8 rounded-full max-w-6xl"
            : "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(245,158,11,0.05)] border border-amber-500/20 py-3 px-5 sm:px-10 rounded-2xl max-w-7xl"
        }`}
      >
        {/* Brand */}
        <a href="#home" className="flex items-center gap-4 group">
          <div className="relative h-20 w-20 sm:h-20 sm:w-20 rounded-full overflow-hidden shrink-0">
            <img
              src={ksLogo}
              alt="Kiran Steels Logo"
              className="w-full h-full object-cover scale-[1.05]"
            />
          </div>
          <span className="font-rozha text-primary text-3xl sm:text-4xl lg:text-[2.75rem] uppercase tracking-normal leading-none pt-1">
            KIRAN STEELS
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 lg:gap-14">
          {links.map((link) =>
            link.hasDropdown ? (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <a
                  href={isHome ? link.href : `/${link.href}`}
                  onClick={(e) => {
                    if (!isHome) {
                      e.preventDefault();
                      navigate(`/${link.href}`);
                    }
                  }}
                  className={`relative text-sm lg:text-base font-medium transition-all duration-300 hover:text-primary flex items-center gap-1 ${
                    activeSection === link.href.substring(1) ? "text-primary font-bold" : "text-slate-700"
                  }`}
                >
                  {link.name}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${productDropdownOpen ? "rotate-180 text-primary" : ""}`}
                  />
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    activeSection === link.href.substring(1) ? "w-full" : "w-0"
                  }`} />
                </a>

                {/* Premium Dropdown */}
                <div
                  className={`absolute top-full right-0 pt-3 transition-all duration-300 ease-out ${productDropdownOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-3 pointer-events-none"
                    }`}
                  style={{ zIndex: 9999 }}
                >
                  <div
                    className="rounded-2xl overflow-hidden w-[480px]"
                    style={{
                      boxShadow: "0 30px 70px -12px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.05)",
                    }}
                  >
                    {/* Dark header */}
                    <div className="bg-gradient-to-r from-[#1a0505] to-[#6b1414] px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold text-sm tracking-wide">Our Products</p>
                        <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mt-0.5">Premium Stainless Steel</p>
                      </div>
                      <div className="bg-white/10 rounded-full px-3 py-1 text-white/70 text-[10px] font-semibold tracking-wider border border-white/10">
                        Since 1998
                      </div>
                    </div>

                    {/* 3-column card grid */}
                    <div className="bg-white p-4 grid grid-cols-3 gap-2">
                      {productCategories.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.name}
                            href={isHome ? "#product" : "/#product"}
                            className="group/item flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:bg-slate-50 hover:shadow-md border border-transparent hover:border-slate-200 text-center"
                            onClick={(e) => {
                              if (!isHome) {
                                e.preventDefault();
                                navigate("/#product");
                              }
                              setProductDropdownOpen(false);
                              setTimeout(() => {
                                window.dispatchEvent(new CustomEvent('openProduct', { detail: item.full }));
                              }, 100);
                            }}
                            style={{ animationDelay: `${idx * 30}ms` }}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-200`}
                            >
                              <Icon size={18} className="text-white" />
                            </div>
                            <span className="text-[11px] text-slate-600 group-hover/item:text-slate-900 font-semibold leading-tight">
                              {item.name}
                            </span>
                          </a>
                        );
                      })}
                    </div>

                    {/* Footer CTA */}
                    <div className="border-t border-slate-100 bg-gradient-to-r from-slate-50 to-red-50/40">
                      <a
                        href={isHome ? "#product" : "/#product"}
                        className="group/cta flex items-center justify-between px-5 py-3 transition-all duration-200 hover:bg-red-50/60"
                        onClick={(e) => {
                          if (!isHome) {
                            e.preventDefault();
                            navigate("/#product");
                          }
                          setProductDropdownOpen(false);
                        }}
                      >
                        <span className="text-xs font-bold text-primary tracking-wide uppercase">
                          View All Products
                        </span>
                        <ArrowRight
                          size={14}
                          className="text-primary group-hover/cta:translate-x-1 transition-transform duration-200"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.name}
                href={isHome ? link.href : `/${link.href}`}
                onClick={(e) => {
                  if (!isHome) {
                    e.preventDefault();
                    navigate(`/${link.href}`);
                  }
                }}
                className={`relative text-sm lg:text-base transition-all duration-300 hover:text-primary ${link.highlight
                    ? "text-secondary font-bold text-base lg:text-lg"
                    : activeSection === link.href.substring(1) ? "text-primary font-bold" : "text-slate-700 font-medium"
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${link.highlight ? "bg-secondary" : "bg-primary"} ${
                  activeSection === link.href.substring(1) ? "w-full" : "w-0"
                }`} />
              </a>
            )
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-800 p-2 rounded-sm hover:bg-slate-50 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-6 flex flex-col gap-2 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          {links.map((link) =>
            link.hasDropdown ? (
              <div key={link.name}>
                <button
                  className="w-full text-left text-base font-bold tracking-wide py-3 px-4 rounded-sm transition-colors text-slate-800 hover:bg-slate-50 flex items-center justify-between"
                  onClick={() => setMobileProductOpen(!mobileProductOpen)}
                >
                  {link.name}
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${mobileProductOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${mobileProductOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="pl-2 pr-2 pb-3 grid grid-cols-2 gap-2 mt-2">
                    {productCategories.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.name}
                          href={isHome ? "#product" : "/#product"}
                          className="flex items-center gap-3 text-sm text-slate-700 font-semibold py-2.5 px-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all duration-200"
                          onClick={(e) => {
                            if (!isHome) {
                              e.preventDefault();
                              navigate("/#product");
                            }
                            setOpen(false);
                            setMobileProductOpen(false);
                            setTimeout(() => {
                              window.dispatchEvent(new CustomEvent('openProduct', { detail: item.full }));
                            }, 100);
                          }}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon size={14} className="text-white" />
                          </div>
                          <span className="leading-tight text-[12px]">{item.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.name}
                href={isHome ? link.href : `/${link.href}`}
                className={`text-base font-bold tracking-wide py-3 px-4 rounded-sm transition-colors ${link.highlight
                    ? "text-secondary hover:bg-secondary/5"
                    : "text-slate-800 hover:bg-slate-50"
                  }`}
                onClick={(e) => {
                  if (!isHome) {
                    e.preventDefault();
                    navigate(`/${link.href}`);
                  }
                  setOpen(false);
                }}
              >
                {link.name}
              </a>
            )
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
