import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminPage = lazy(() => import("./pages/Admin"));
const OurStory = lazy(() => import("./pages/OurStory"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const StainlessSteelPipes = lazy(() => import("./pages/StainlessSteelPipes"));
const StainlessSteelFittingItems = lazy(() => import("./pages/StainlessSteelFittingItems"));
const StainlessSteelGates = lazy(() => import("./pages/StainlessSteelGates"));
const StainlessSteelCompoundGates = lazy(() => import("./pages/StainlessSteelCompoundGates"));
const StainlessSteelRailing = lazy(() => import("./pages/StainlessSteelRailing"));
const StainlessSteelGlassRailing = lazy(() => import("./pages/StainlessSteelGlassRailing"));
const StainlessSteelBalkani = lazy(() => import("./pages/StainlessSteelBalkani"));
const StainlessSteelBoxAndGrills = lazy(() => import("./pages/StainlessSteelBoxAndGrills"));
const StainlessSteelSignboards = lazy(() => import("./pages/StainlessSteelSignboards"));
const StainlessSteelSpiralStaircase = lazy(() => import("./pages/StainlessSteelSpiralStaircase"));
const StainlessSteelMandirDesigns = lazy(() => import("./pages/StainlessSteelMandirDesigns"));
const StainlessSteelChairsTables = lazy(() => import("./pages/StainlessSteelChairsTables"));

import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-background"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/kiran-secure-portal-99" element={<AdminPage />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/stainless-steel-pipes" element={<StainlessSteelPipes />} />
            <Route path="/stainless-steel-fitting-items" element={<StainlessSteelFittingItems />} />
            <Route path="/stainless-steel-gates" element={<StainlessSteelGates />} />
            <Route path="/stainless-steel-compound-gates" element={<StainlessSteelCompoundGates />} />
            <Route path="/stainless-steel-railing" element={<StainlessSteelRailing />} />
            <Route path="/stainless-steel-glass-railing" element={<StainlessSteelGlassRailing />} />
            <Route path="/stainless-steel-balkani" element={<StainlessSteelBalkani />} />
            <Route path="/stainless-steel-box-grills" element={<StainlessSteelBoxAndGrills />} />
            <Route path="/stainless-steel-signboards" element={<StainlessSteelSignboards />} />
            <Route path="/stainless-steel-spiral-staircase" element={<StainlessSteelSpiralStaircase />} />
            <Route path="/stainless-steel-mandir-designs" element={<StainlessSteelMandirDesigns />} />
            <Route path="/stainless-steel-chairs-tables" element={<StainlessSteelChairsTables />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
    <Analytics />
  </QueryClientProvider>
);



export default App;
