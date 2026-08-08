import React from "react";
import SEO from "../components/SEO";
import { products } from "../data/products";
import ProductGalleryView from "../components/ProductGalleryView";
import { useNavigate } from "react-router-dom";

const StainlessSteelSpiralStaircase = () => {
  const navigate = useNavigate();
  const product = products.find(p => p.name === "Stainless Steel Spiral Staircase");
  
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Stainless Steel Spiral Staircase - Kiran Steels" 
        description="Space-saving and elegant stainless steel spiral staircases for homes and commercial spaces." 
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

export default StainlessSteelSpiralStaircase;
