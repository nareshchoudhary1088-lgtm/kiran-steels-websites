import React from "react";
import SEO from "../components/SEO";
import { products } from "../data/products";
import ProductGalleryView from "../components/ProductGalleryView";
import { useNavigate } from "react-router-dom";

const StainlessSteelFittingItems = () => {
  const navigate = useNavigate();
  const product = products.find(p => p.name === "Stainless Steel Fitting Items");
  
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Stainless Steel Fitting Items - Kiran Steels" 
        description="High-quality stainless steel fitting items for industrial and residential applications." 
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

export default StainlessSteelFittingItems;
