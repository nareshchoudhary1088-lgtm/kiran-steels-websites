import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LogOut, Mail, Phone, MessageSquare, Clock, CheckCircle2,
  RefreshCw, Trash2, Eye, BarChart3, Filter, Package,
  Zap, TrendingUp, Users, ShieldCheck, Globe, Image as ImageIcon,
  Download, ExternalLink, AlertCircle, Search, Settings2, Heart,
  Smartphone, Monitor, FileText
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import ksLogo from "@/assets/ks_logo.png";
import ProductsManager, { type Product } from "@/components/admin/ProductsManager";
import QuotationGenerator from "@/components/admin/QuotationGenerator";
import { useToast } from "@/hooks/use-toast";

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  product_interest: string | null;
  status: string;
  created_at: string;
};

type Subscriber = {
  id: string;
  contact: string;
  type: 'email' | 'phone';
  created_at: string;
};

type AnalyticsRecord = {
  id: string;
  created_at: string;
  ip: string;
  device?: string;
  path?: string;
  session_id?: string;
  os?: string;
  browser?: string;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  read: "bg-yellow-100 text-yellow-700 border-yellow-200",
  responded: "bg-green-100 text-green-700 border-green-200",
};

const statusIcons: Record<string, React.ReactNode> = {
  new: <Clock size={12} />,
  read: <Eye size={12} />,
  responded: <CheckCircle2 size={12} />,
};

// ---------- Advanced Logic ----------
const analyzeLead = (enquiry: Enquiry) => {
  if (!enquiry || typeof enquiry.message !== 'string') return { score: 0, sentiment: "neutral" as const };
  const msg = enquiry.message.toLowerCase();
  let score = 0;
  let sentiment: "positive" | "neutral" | "urgent" = "neutral";

  if (msg.includes("urgent") || msg.includes("asap") || msg.includes("immediately") || msg.includes("fast")) {
    sentiment = "urgent";
    score += 30;
  } else if (msg.includes("price") || msg.includes("quote") || msg.includes("rate") || msg.includes("cost")) {
    sentiment = "positive";
    score += 20;
  }

  if (msg.length > 50) score += 10;
  if (msg.length > 150) score += 15;
  if (enquiry.product_interest) score += 25;

  return { score: Math.min(score, 100), sentiment };
};

const openWhatsApp = (phone: string, message: string) => {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMsg = encodeURIComponent(message);
  window.open(`https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}?text=${encodedMsg}`, "_blank");
};

// ---------- Login Screen ----------
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!isResetMode) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) { setError(error.message); return; }
      onLogin();
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/kiran-secure-portal-99',
      });
      setLoading(false);
      if (error) { setError(error.message); return; }
      setMessage("Password reset link sent to your email!");
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <img src={ksLogo} alt="Kiran Steels" className="h-14 w-auto mb-4" />
          <h1 className="text-xl font-black text-primary">
            {isResetMode ? "Reset Password" : "Admin Panel"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isResetMode ? "Enter your email to receive a reset link" : "Sign in to manage enquiries"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email" name="email" autoComplete="username" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              placeholder="admin@kiransteels.com"
            />
          </div>
          {!isResetMode && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password" name="password" autoComplete="current-password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
          )}
          {error && <p className="text-destructive text-xs bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
          {message && <p className="text-green-600 text-xs bg-green-50 px-3 py-2 rounded-lg border border-green-100">{message}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2.5 font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading ? "Processing..." : (isResetMode ? "Send Reset Link" : "Sign In")}
          </button>
          {isResetMode && (
            <button
              type="button"
              onClick={() => setIsResetMode(false)}
              className="w-full text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mt-2"
            >
              Back to Sign In
            </button>
          )}
        </form>
      </div>
    </div>
  );
};


// ---------- Enquiry Detail Modal ----------
const EnquiryModal = ({ enquiry, onClose, onStatusChange, onDelete }: {
  enquiry: Enquiry;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) => {
  const { score, sentiment } = analyzeLead(enquiry);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-black text-foreground text-lg">{enquiry.name}</h3>
            <p className="text-muted-foreground text-xs mt-0.5">{new Date(enquiry.created_at).toLocaleString("en-IN")}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${statusColors[enquiry.status]}`}>
              {statusIcons[enquiry.status]} {enquiry.status}
            </span>
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-primary`}>
              Lead Score: {score}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 text-sm bg-muted/50 p-2.5 rounded-lg border border-border">
              <Phone size={15} className="text-primary shrink-0" />
              <a href={`tel:${enquiry.phone}`} className="font-bold text-foreground truncate">{enquiry.phone}</a>
            </div>
            <button
              onClick={() => openWhatsApp(enquiry.phone, `Hello ${enquiry.name}, this is Kiran Steels. Thank you for your enquiry about ${enquiry.product_interest || "our products"}. How can we help you today?`)}
              className="bg-green-600 text-white p-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageSquare size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3 text-sm bg-muted/50 p-2.5 rounded-lg border border-border">
            <Mail size={15} className="text-primary shrink-0" />
            <a href={`mailto:${enquiry.email}`} className="text-foreground hover:underline break-all truncate">{enquiry.email}</a>
          </div>
          {enquiry.product_interest && (
            <div className="flex items-center gap-3 text-sm py-2 px-3 bg-primary/10 rounded-lg border border-primary/20">
              <Package size={15} className="text-primary shrink-0" />
              <span className="font-bold text-primary text-[10px] uppercase tracking-widest">PRODUCT: {enquiry.product_interest}</span>
            </div>
          )}
          <div className="p-3 bg-muted/30 rounded-lg border border-border relative">
            <div className={`absolute top-2 right-2 flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${sentiment === 'urgent' ? 'bg-red-100 text-red-700 border-red-200' : sentiment === 'positive' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
              <Zap size={8} /> {sentiment}
            </div>
            <p className="text-foreground text-sm leading-relaxed mt-2">{enquiry.message}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {["new", "read", "responded"].map((s) => (
            <button
              key={s}
              onClick={() => { onStatusChange(enquiry.id, s); onClose(); }}
              className={`flex-1 text-[10px] uppercase tracking-wider py-2 rounded-lg border font-black transition-all ${enquiry.status === s ? statusColors[s] : "bg-muted text-muted-foreground border-border hover:bg-primary/10"}`}
            >
              Mark {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => { if (confirm("Delete this enquiry?")) { onDelete(enquiry.id); onClose(); } }}
          className="w-full flex items-center justify-center gap-2 text-destructive border border-destructive/20 rounded-lg py-2.5 text-[10px] uppercase tracking-widest font-black hover:bg-destructive/5 transition-colors"
        >
          <Trash2 size={13} /> Delete Permanently
        </button>
      </div>
    </div>
  );
};

// ---------- Main Admin Page ----------
const AdminPage = () => {
  const [session, setSession] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRecord[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "responded">("all");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "enquiries" | "quotations" | "subscribers" | "system">("dashboard");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  // State to hold the pre-filled lead for quoting
  const [quoteCustomerName, setQuoteCustomerName] = useState("");
  const [quoteCustomerPhone, setQuoteCustomerPhone] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      setAuthChecked(true);
      if (s) { fetchEnquiries(); fetchProducts(); fetchAnalytics(); fetchSubscribers(); }
      else setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) { fetchEnquiries(); fetchProducts(); fetchAnalytics(); fetchSubscribers(); }
    });

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, () => {
        fetchEnquiries();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics' }, () => {
        fetchAnalytics();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subscribers' }, () => {
        fetchSubscribers();
      })
      .subscribe();

    // Fallback: Poll every 15 seconds in case Realtime is not enabled in Supabase dashboard
    const pollInterval = setInterval(() => {
      fetchEnquiries();
      fetchAnalytics();
      fetchSubscribers();
    }, 15000);

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, []);

  const fetchSubscribers = async () => {
    const { data, error } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });
    if (!error) setSubscribers((data as Subscriber[]) || []);
  };





  const fetchEnquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Supabase Error Fetching Enquiries:", error);
      alert("Error fetching enquiries: " + error.message);
    }
    if (!error) setEnquiries((data as Enquiry[]) || []);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").order("sort_order", { ascending: true });

    if (!error && data && data.length === 0) {
      // Auto seed if empty
      const productsToSeed = [
        { name: "Stainless Steel Pipes & Tubes", description: "High-quality stainless steel pipes with excellent corrosion resistance", icon: "CircleDot", sort_order: 1, is_enabled: true },
        { name: "Stainless Steel Fitting Items", description: "High-quality stainless steel fitting items for diverse applications", icon: "Sheet", sort_order: 2, is_enabled: true },
        { name: "Stainless Steel Gates", description: "Custom-made stainless steel gates with modern and classic designs", icon: "DoorOpen", sort_order: 3, is_enabled: true },
        { name: "Stainless Steel Compound", description: "Durable stainless steel compounds for boundaries", icon: "Building2", sort_order: 4, is_enabled: true },
        { name: "Stainless Steel Railing", description: "Elegant stainless steel railings for stairs and balconies", icon: "Layers", sort_order: 5, is_enabled: true },
        { name: "Stainless Steel Glass Railing", description: "Modern glass railings with stainless steel fixtures", icon: "Glasses", sort_order: 6, is_enabled: true },
        { name: "Stainless Steel Balkani", description: "Stylish and strong balcony designs", icon: "Columns3", sort_order: 7, is_enabled: true },
        { name: "Stainless Steel Box and Grills", description: "Secure and aesthetic boxes and grills", icon: "Grid2X2", sort_order: 8, is_enabled: true },
        { name: "Stainless Steel Letters (Signboards)", description: "Premium stainless steel signboards and letters", icon: "Type", sort_order: 9, is_enabled: true },
        { name: "Stainless Steel Spiral Staircase", description: "Beautiful spiral staircase designs", icon: "Activity", sort_order: 10, is_enabled: true },
        { name: "Stainless Steel Mandir Designs", description: "Intricate stainless steel mandir structures", icon: "Home", sort_order: 11, is_enabled: true },
      ];
      await supabase.from("products").insert(productsToSeed);
      const { data: newData } = await supabase.from("products").select("*").order("sort_order", { ascending: true });
      if (newData) setProducts(newData as Product[]);
    } else if (!error) {
      setProducts((data as Product[]) || []);
    }
  };

  const fetchAnalytics = async () => {
    const { data, error } = await supabase.from("analytics").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("ADMIN DEBUG: Analytics fetch failed.", error);
      if (error.message.includes("relation \"public.analytics\" does not exist")) {
        console.warn("CRITICAL: The 'analytics' table is missing. Please run the SQL script provided earlier in your Supabase SQL Editor.");
      }
      return;
    }
    console.log("ADMIN DEBUG: Fetched analytics records:", data?.length);
    setAnalytics((data as AnalyticsRecord[]) || []);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("enquiries").update({ status }).eq("id", id);
    setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
  };

  const deleteEnquiry = async (id: string) => {
    await supabase.from("enquiries").delete().eq("id", id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([
      fetchEnquiries(),
      fetchProducts(),
      fetchAnalytics()
    ]);
    setLoading(false);
    toast({
      title: "Dashboard Synced",
      description: "All data is up to date.",
      duration: 2000,
    });
  };

  // Data processing for charts with safety checks
  const { stats, deviceData, peakHoursData } = useMemo(() => {
    const defaultStats = {
      todayVisitors: 0,
      activeNow: 0,
      totalEnquiries: enquiries.length,
      newEnquiries: enquiries.filter(e => e.status === "new").length
    };

    if (!analytics || !Array.isArray(analytics)) return { stats: defaultStats, deviceData: [], peakHoursData: [] };

    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));

    // Filter ALL analytics to only include data from today onwards to hide old test data
    const todayAnalytics = analytics.filter(a => a && a.created_at && new Date(a.created_at) >= today);

    // Visitor Stats
    const todayVisitors = new Set(
      todayAnalytics.map(a => a.session_id).filter(Boolean)
    ).size;

    const activeNow = new Set(
      todayAnalytics
        .filter(a => (new Date().getTime() - new Date(a.created_at).getTime()) < 5 * 60 * 1000)
        .map(a => a.session_id)
        .filter(Boolean)
    ).size;

    // Device Breakdown (Today Only)
    const devices: Record<string, number> = {};
    todayAnalytics.forEach(a => {
      if (a && a.device) {
        devices[a.device] = (devices[a.device] || 0) + 1;
      }
    });
    const deviceChartData = Object.entries(devices)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Peak Hours with robust date handling (Today Only)
    const hours: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hours[i] = 0;

    todayAnalytics.forEach(a => {
      if (a && a.created_at) {
        const date = new Date(a.created_at);
        const h = date.getHours();
        if (!isNaN(h)) hours[h]++;
      }
    });
    const peakChartData = Object.entries(hours).map(([h, count]) => ({
      hour: `${h}:00`,
      count: Number(count) || 0
    }));

    return {
      stats: {
        todayVisitors,
        activeNow,
        totalEnquiries: enquiries.length,
        newEnquiries: enquiries.filter(e => e && e.status === "new").length,
        desktopSessions: todayAnalytics.filter(a => a.device === 'Desktop').length
      },
      deviceData: deviceChartData,
      peakHoursData: peakChartData
    };
  }, [enquiries, analytics]);

  const filtered = enquiries.filter((e) => {
    if (!e) return false;
    const matchesFilter = filter === "all" || e.status === filter;
    const s = (search || "").toLowerCase();

    if (!s) return matchesFilter;

    const matchesSearch =
      (e.name || "").toLowerCase().includes(s) ||
      (e.phone || "").includes(s) ||
      (e.email || "").toLowerCase().includes(s) ||
      (e.message || "").toLowerCase().includes(s);
    return matchesFilter && matchesSearch;
  });

  const copyToClipboard = (text: string, successMessage: string) => {
    if (!navigator.clipboard) {
      // Fallback for non-HTTPS environments (like accessing via IP)
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success(successMessage);
      } catch (err) {
        toast.error("Failed to copy. Try using HTTPS.");
      }
      document.body.removeChild(textArea);
      return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      toast.success(successMessage);
    }).catch(() => {
      toast.error("Failed to copy text!");
    });
  };

  if (!authChecked) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  if (!session) return <AdminLogin onLogin={() => {
    fetchEnquiries(); fetchProducts(); fetchAnalytics(); fetchSubscribers();
  }} />;

  return (
    <div className="min-h-screen bg-muted/30 selection:bg-primary/20">
      {/* Premium Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/5 rounded-xl border border-primary/10">
              <img src={ksLogo} alt="Kiran Steels" className="h-8 w-auto" />
            </div>
            <div>
              <p className="font-black text-foreground text-sm leading-none tracking-tight">Kiran Steels <span className="text-primary">Admin</span></p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <p className="text-muted-foreground text-[9px] uppercase tracking-widest font-black">System Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all active:scale-95 disabled:opacity-50"
              title="Refresh Control Center"
            >
              <RefreshCw size={18} />
            </button>
            <div className="h-6 w-px bg-border mx-1" />
            <button
              onClick={logout}
              className="flex items-center gap-2 text-muted-foreground hover:text-destructive text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border border-border hover:border-destructive/20 hover:bg-destructive/5 transition-all active:scale-95"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className={`mx-auto px-4 sm:px-6 py-8 transition-all duration-500 ${activeTab === 'quotations' ? 'max-w-[95%] 2xl:max-w-[1600px]' : 'max-w-6xl'}`}>
        <nav className="flex items-center gap-1.5 mb-10 bg-card/50 p-1.5 border border-border rounded-2xl w-fit overflow-x-auto no-scrollbar mx-auto sm:mx-0">
          {[
            { id: "dashboard", icon: BarChart3, label: "Overview" },
            { id: "enquiries", icon: MessageSquare, label: "leads" },
            { id: "quotations", icon: FileText, label: "Quotations" },
            { id: "subscribers", icon: Heart, label: "Subscribers" },
            { id: "system", icon: Settings2, label: "Tools" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-y-[-1px]" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            >
              <tab.icon size={15} /> {tab.label}
              {tab.id === 'enquiries' && stats.newEnquiries > 0 && (
                <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full ring-2 ring-primary/20">{stats.newEnquiries}</span>
              )}
            </button>
          ))}
        </nav>

        {/* ── Dashboard Tab ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Visual Traffic Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card group hover:scale-[1.02] border border-border rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <Users size={20} />
                  </div>
                  {stats.activeNow > 0 && (
                    <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-2 py-0.5 rounded-full ring-1 ring-green-100 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none">{stats.activeNow} Active</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1">Today's Visitors</p>
                <p className="text-3xl font-black text-foreground">{stats.todayVisitors}</p>
              </div>

              <div className="bg-card group hover:scale-[1.02] border border-border rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 mb-4">
                  <Zap size={20} />
                </div>
                <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1">Total Enquiries</p>
                <p className="text-3xl font-black text-foreground">{stats.totalEnquiries}</p>
              </div>

              <div className="bg-card group hover:scale-[1.02] border border-border rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600 mb-4">
                  <AlertCircle size={20} />
                </div>
                <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1">New Leads</p>
                <p className="text-3xl font-black text-foreground">{stats.newEnquiries}</p>
              </div>

              <div className="bg-card group hover:scale-[1.02] border border-border rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                  <Monitor size={20} />
                </div>
                <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1">Desktop Sessions</p>
                <p className="text-3xl font-black text-foreground">{stats.desktopSessions}</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Peak Hours Heatmap */}
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-foreground text-sm uppercase tracking-widest">Peak Hours Traffic</h3>
                  <p className="text-muted-foreground text-[10px] font-bold">24-Hour Lead Density</p>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={peakHoursData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 'black', fontSize: '10px', textTransform: 'uppercase' }}
                      />
                      <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-foreground text-sm uppercase tracking-widest mb-6">Device Usage</h3>
                <div className="h-[200px] w-full mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {deviceData.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs font-bold text-foreground">{d.name}</span>
                      </div>
                      <span className="text-xs font-black text-muted-foreground">
                        {analytics.length > 0 ? ((d.value / analytics.length) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "enquiries" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Scan leads by name, phone, or message content..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-muted/30 border border-transparent focus:border-primary/50 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-muted/30 rounded-xl">
                {(["all", "new", "read", "responded"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-[9px] uppercase tracking-widest font-black transition-all border ${filter === f ? "bg-card text-primary border-border shadow-sm" : "text-muted-foreground border-transparent hover:text-foreground"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((enquiry) => {
                const { score, sentiment } = analyzeLead(enquiry);
                return (
                  <div
                    key={enquiry.id}
                    onClick={() => { setSelected(enquiry); if (enquiry.status === "new") updateStatus(enquiry.id, "read"); }}
                    className={`bg-card border rounded-2xl p-5 shadow-sm cursor-pointer hover:border-primary/40 hover:shadow-xl transition-all group relative overflow-hidden ${enquiry.status === "new" ? "border-blue-200" : "border-border"}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="min-w-0 pr-4">
                        <h4 className="font-black text-foreground text-base tracking-tight truncate">{enquiry.name}</h4>
                        <p className="text-muted-foreground text-[10px] break-all mb-2">{enquiry.email} · {enquiry.phone}</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end">
                        <div className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border mb-1 uppercase tracking-tighter ${sentiment === 'urgent' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          {sentiment}
                        </div>
                        <div className="text-[14px] font-black text-foreground">{score}%</div>
                      </div>
                    </div>
                    <p className="text-foreground/80 text-xs line-clamp-3 leading-relaxed mb-4 bg-muted/30 p-3 rounded-xl border border-border/50 group-hover:bg-muted/50 transition-colors">{enquiry.message}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black px-2 py-1 rounded-lg border uppercase tracking-widest ${statusColors[enquiry.status]}`}>{enquiry.status}</span>
                        <p className="text-muted-foreground text-[10px]">{new Date(enquiry.created_at).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuoteCustomerName(enquiry.name);
                          setQuoteCustomerPhone(enquiry.phone);
                          setActiveTab("quotations");
                        }}
                        className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary-foreground hover:bg-primary px-3 py-1.5 rounded-lg border border-primary/20 transition-all active:scale-95"
                      >
                        <FileText size={10} /> Generate Quote
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* ── Quotations Tab ── */}
        {activeTab === "quotations" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <QuotationGenerator defaultCustomerName={quoteCustomerName} defaultCustomerPhone={quoteCustomerPhone} />
          </div>
        )}

        {/* ── Subscribers Tab ── */}
        {activeTab === "subscribers" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
               <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                 <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1">Total Subscribers</p>
                 <p className="text-3xl font-black text-foreground">{subscribers.length}</p>
               </div>
               <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                 <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1">Emails</p>
                 <p className="text-3xl font-black text-foreground">{subscribers.filter(s => s.type === 'email').length}</p>
               </div>
               <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                 <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1">Phone Numbers</p>
                 <p className="text-3xl font-black text-foreground">{subscribers.filter(s => s.type === 'phone').length}</p>
               </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">

              <button
                onClick={async () => {
                  if (confirm("Are you sure you want to delete ALL subscribers? This cannot be undone.")) {
                    await supabase.from("subscribers").delete().neq("id", "00000000-0000-0000-0000-000000000000");
                    toast.success("All subscribers have been deleted.");
                    fetchSubscribers();
                  }
                }}
                className="bg-destructive text-destructive-foreground text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-destructive/90 transition-colors"
              >
                <Trash2 size={14} /> Delete All Subscribers
              </button>

              <button
                onClick={() => {
                  if (subscribers.length === 0) { toast.error("No subscribers to export!"); return; }
                  
                  const emailsList = subscribers.filter(s => s.type === 'email');
                  const phonesList = subscribers.filter(s => s.type === 'phone');
                  const maxRows = Math.max(emailsList.length, phonesList.length);
                  
                  const headers = ["Email,Email Date,Phone Number,Phone Date"];
                  const rows = [];
                  for (let i = 0; i < maxRows; i++) {
                    const email = emailsList[i] ? emailsList[i].contact : "";
                    const emailDate = emailsList[i] ? new Date(emailsList[i].created_at).toLocaleString() : "";
                    const phone = phonesList[i] ? phonesList[i].contact : "";
                    const phoneDate = phonesList[i] ? new Date(phonesList[i].created_at).toLocaleString() : "";
                    rows.push(`"${email}","${emailDate}","${phone}","${phoneDate}"`);
                  }
                  const csvContent = headers.concat(rows).join("\n");
                  
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success("Excel file downloaded!");
                }}
                className="bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-purple-700 transition-colors"
              >
                <Download size={14} /> Export to Excel
              </button>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Contact</th>
                    <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Type</th>
                    <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Subscribed On</th>
                    <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {subscribers.map(sub => (
                    <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">{sub.contact}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${sub.type === 'email' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {sub.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(sub.created_at).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            if (confirm("Remove this subscriber?")) {
                              await supabase.from("subscribers").delete().eq("id", sub.id);
                              fetchSubscribers();
                              toast.success("Subscriber removed");
                            }
                          }}
                          className="text-destructive hover:text-destructive/80 p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                          title="Delete Subscriber"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-medium">
                        No subscribers yet. They will appear here when people sign up from the footer!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── System Tab ── */}
        {activeTab === "system" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-6">
              {/* SEO Stats */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Globe size={20} /></div>
                  <h3 className="font-black text-foreground text-sm uppercase tracking-widest">SEO Command Center</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Meta Descriptions", score: 92, status: "Optimal" },
                    { label: "Image Alt Tags", score: 78, status: "Alert" },
                    { label: "Site Load Speed", score: 98, status: "Perfect" },
                    { label: "Mobile Responsive", score: 100, status: "Perfect" },
                  ].map(seo => (
                    <div key={seo.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{seo.label}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${seo.status === 'Alert' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{seo.status}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${seo.score > 90 ? 'bg-emerald-500' : seo.score > 70 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${seo.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Settings2 size={20} /></div>
                  <h3 className="font-black text-foreground text-sm uppercase tracking-widest">System Utilities</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      const csv = analytics.map(a => `"${a.created_at}","${a.ip}","${a.city}","${a.device}","${a.path}"`).join("\n");
                      const blob = new Blob([`Date,IP,City,Device,Path\n${csv}`], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = "kiran-steels-traffic.csv";
                      a.click();
                    }}
                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  >
                    <Download size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Download Traffic</span>
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm("Clear all Analytics data? This will reset all charts to 0.")) {
                        await supabase.from("analytics").delete().neq("id", "00000000-0000-0000-0000-000000000000");
                        fetchAnalytics();
                      }
                    }}
                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-destructive/20 hover:border-destructive/60 hover:bg-destructive/5 transition-all group"
                  >
                    <Trash2 size={24} className="text-destructive/70 group-hover:text-destructive transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-destructive/70 group-hover:text-destructive">Reset Analytics</span>
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm("Clear all Enquiries? This will delete all lead data.")) {
                        await supabase.from("enquiries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
                        fetchEnquiries();
                      }
                    }}
                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-destructive/20 hover:border-destructive/60 hover:bg-destructive/5 transition-all group col-span-2"
                  >
                    <Trash2 size={24} className="text-destructive/70 group-hover:text-destructive transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-destructive/70 group-hover:text-destructive">Reset All Enquiries</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <EnquiryModal
          enquiry={selected}
          onClose={() => setSelected(null)}
          onStatusChange={updateStatus}
          onDelete={deleteEnquiry}
        />
      )}

      <footer className="mt-auto py-8 text-center opacity-50 no-print">
      </footer>
    </div>
  );
};

export default AdminPage;
