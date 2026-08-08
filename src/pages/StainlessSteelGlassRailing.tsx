import React from "react";
import SEO from "../components/SEO";
import { products } from "../data/products";
import ProductGalleryView from "../components/ProductGalleryView";
import { useNavigate } from "react-router-dom";

const StainlessSteelGlassRailing = () => {
  const navigate = useNavigate();
  const product = products.find(p => p.name === "Stainless Steel Glass Railing");
  
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Stainless Steel Glass Railing - Kiran Steels" 
        description="Modern frameless and semi-frameless stainless steel glass railings for balconies and stairs." 
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

export default StainlessSteelGlassRailing;
