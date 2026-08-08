import React from "react";
import SEO from "../components/SEO";
import { products } from "../data/products";
import ProductGalleryView from "../components/ProductGalleryView";
import { useNavigate } from "react-router-dom";

const StainlessSteelBalkani = () => {
  const navigate = useNavigate();
  const product = products.find(p => p.name === "Stainless Steel Balkani");
  
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Stainless Steel Balkani - Kiran Steels" 
        description="Beautiful stainless steel balcony designs and grills for residential safety and aesthetics." 
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

export default StainlessSteelBalkani;
