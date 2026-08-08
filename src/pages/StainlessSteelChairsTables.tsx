import React from "react";
import SEO from "../components/SEO";
import { products } from "../data/products";
import ProductGalleryView from "../components/ProductGalleryView";
import { useNavigate } from "react-router-dom";

const StainlessSteelChairsTables = () => {
  const navigate = useNavigate();
  const product = products.find(p => p.name === "Stainless Steel Chairs & Tables");
  
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Stainless Steel Chairs & Tables - Kiran Steels" 
        description="Luxury interior stainless steel furniture including designer dining tables and chairs." 
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

export default StainlessSteelChairsTables;
