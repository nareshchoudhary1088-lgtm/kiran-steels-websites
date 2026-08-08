import React from "react";
import SEO from "../components/SEO";
import { products } from "../data/products";
import ProductGalleryView from "../components/ProductGalleryView";
import { useNavigate } from "react-router-dom";

const StainlessSteelRailing = () => {
  const navigate = useNavigate();
  const product = products.find(p => p.name === "Stainless Steel Railing");
  
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Stainless Steel Railing - Kiran Steels" 
        description="Premium stainless steel balcony and staircase railings, designed for safety and elegance." 
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

export default StainlessSteelRailing;
