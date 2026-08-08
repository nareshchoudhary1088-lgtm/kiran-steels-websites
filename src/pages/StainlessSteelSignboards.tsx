import React from "react";
import SEO from "../components/SEO";
import { products } from "../data/products";
import ProductGalleryView from "../components/ProductGalleryView";
import { useNavigate } from "react-router-dom";

const StainlessSteelSignboards = () => {
  const navigate = useNavigate();
  const product = products.find(p => p.name === "Stainless Steel Letters (Signboards)");
  
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Stainless Steel Letters & Signboards - Kiran Steels" 
        description="Laser-cut stainless steel letters and signboards for luxury interior and exterior branding." 
      />
      {product && (
        <ProductGalleryView 
          selectedProduct={product}
          onClose={() => navigate("/")}
        />
      )}
    </div>
  );
};

export default StainlessSteelSignboards;
