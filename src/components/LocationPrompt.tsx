import React, { useState, useEffect } from "react";
import { MapPin, Search, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import useAnalytics from "@/hooks/useAnalytics";

const LocationPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [askCount, setAskCount] = useState(0);
  const { requestPreciseLocation } = useAnalytics();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (askCount < 2) setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [askCount]);

  const handleAllow = () => {
    setIsLoading(true);
    requestPreciseLocation();
    setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true); // Don't hide yet, show success? No, just finish.
      setIsVisible(false);
      setAskCount(2);
    }, 2000);
  };

  const handleManualSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 3) {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&countrycodes=in`);
      const data = await res.json();
      setSuggestions(data);
    }
  };

  const selectManualLocation = async (item: any) => {
    const sessionId = sessionStorage.getItem("session_id");
    if (sessionId) {
      await supabase.from("analytics").update({ 
        lat: parseFloat(item.lat), 
        lng: parseFloat(item.lon),
        city: item.display_name.split(',')[0] + ", Visakhapatnam"
      }).eq("session_id", sessionId);
    }
    setIsVisible(false);
    setAskCount(2);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:bottom-6 animate-in slide-in-from-bottom-full duration-500 flex justify-center">
      <div className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl border border-primary/10 p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
           <Navigation size={40} />
        </div>
        
        <div className="space-y-2">
           <h3 className="text-2xl font-black text-foreground italic leading-none">Find my house?</h3>
           <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">For 10m Precision Delivery</p>
        </div>

        <button 
          onClick={handleAllow}
          disabled={isLoading}
          className="w-full bg-primary text-white font-black uppercase tracking-widest py-5 rounded-[24px] shadow-2xl shadow-primary/20 active:scale-95 transition-all text-sm"
        >
          {isLoading ? "Locking Satellites..." : "Allow Precision GPS"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted"></span></div>
          <div className="relative flex justify-center text-[8px] uppercase font-black text-muted-foreground"><span className="bg-white px-2 italic">Or Search Area</span></div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text" 
            placeholder="Type your area in Vizag..." 
            value={searchQuery}
            onChange={(e) => handleManualSearch(e.target.value)}
            className="w-full bg-muted/30 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-1 max-h-[120px] overflow-y-auto no-scrollbar pt-2">
             {suggestions.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => selectManualLocation(item)}
                  className="w-full text-left p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/5 transition-all"
                >
                   <p className="text-[10px] font-black text-foreground truncate">{item.display_name.split(',')[0]}</p>
                   <p className="text-[8px] text-muted-foreground truncate">{item.display_name}</p>
                </button>
             ))}
          </div>
        )}

        <button 
          onClick={() => { setIsVisible(false); setAskCount(prev => prev + 1); }}
          className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.2em] border-b border-transparent hover:border-muted px-1 pb-0.5"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default LocationPrompt;
