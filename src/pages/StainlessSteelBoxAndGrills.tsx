import React from "react";
import SEO from "../components/SEO";
import { products } from "../data/products";
import ProductGalleryView from "../components/ProductGalleryView";
import { useNavigate } from "react-router-dom";

const StainlessSteelBoxAndGrills = () => {
  const navigate = useNavigate();
  const product = products.find(p => p.name === "Stainless Steel Box and Grills");
  
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Stainless Steel Box and Grills - Kiran Steels" 
        description="Protective stainless steel window grills and utility boxes, custom-designed to fit your space." 
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

export default StainlessSteelBoxAndGrills;
