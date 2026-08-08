import React from "react";
import SEO from "../components/SEO";
import { products } from "../data/products";
import ProductGalleryView from "../components/ProductGalleryView";
import { useNavigate } from "react-router-dom";

const StainlessSteelGates = () => {
  const navigate = useNavigate();
  const product = products.find(p => p.name === "Stainless Steel Gates");
  
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Stainless Steel Gates - Kiran Steels" 
        description="Custom residential and commercial stainless steel main doors and architectural structural fabrication." 
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

export default StainlessSteelGates;
