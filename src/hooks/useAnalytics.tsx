import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const useAnalytics = () => {
  const trackVisit = useCallback(async () => {
    try {
      const ua = navigator.userAgent;
      let device = "Desktop";
      if (/android/i.test(ua)) device = "Android";
      else if (/iPad|iPhone|iPod/.test(ua)) device = "iPhone";

      let browser = "Other";
      if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";

      let os = "Other";
      if (ua.includes("Windows")) os = "Windows";
      else if (ua.includes("Mac OS")) os = "MacOS";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("iPhone")) os = "iOS";

      await supabase.from("analytics").insert({
        device,
        browser,
        os,
        path: window.location.pathname,
        session_id: sessionStorage.getItem("session_id") || (() => {
          const id = Math.random().toString(36).substring(7);
          sessionStorage.setItem("session_id", id);
          return id;
        })(),
      });
    } catch (err) {
      console.error("Analytics error:", err);
    }
  }, []);

  useEffect(() => {
    trackVisit();
  }, [trackVisit]);

  return {};
};

export default useAnalytics;
