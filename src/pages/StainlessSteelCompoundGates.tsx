import React from "react";
import SEO from "../components/SEO";
import { products } from "../data/products";
import ProductGalleryView from "../components/ProductGalleryView";
import { useNavigate } from "react-router-dom";

const StainlessSteelCompoundGates = () => {
  const navigate = useNavigate();
  const product = products.find(p => p.name === "Stainless Steel Compound Gates");
  
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Stainless Steel Compound Gates - Kiran Steels" 
        description="Durable and aesthetically pleasing stainless steel compound gates for maximum security and style." 
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

export default StainlessSteelCompoundGates;
