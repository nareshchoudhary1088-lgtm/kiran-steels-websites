import React from "react";
import SEO from "../components/SEO";
import { products } from "../data/products";
import ProductGalleryView from "../components/ProductGalleryView";
import { useNavigate } from "react-router-dom";

const StainlessSteelPipes = () => {
  const navigate = useNavigate();
  const product = products.find(p => p.name === "Stainless Steel Pipes & Tubes");
  
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Stainless Steel Pipes & Tubes - Kiran Steels" 
        description="Premium B2B industrial stainless steel pipes, welded tubes, and fittings. Highlighting Jindal Stainless Steel supplies in Grades 304 and 316." 
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

export default StainlessSteelPipes;
