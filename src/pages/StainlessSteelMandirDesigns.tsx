import React from "react";
import SEO from "../components/SEO";
import { products } from "../data/products";
import ProductGalleryView from "../components/ProductGalleryView";
import { useNavigate } from "react-router-dom";

const StainlessSteelMandirDesigns = () => {
  const navigate = useNavigate();
  const product = products.find(p => p.name === "Stainless Steel Mandir Designs");
  
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Stainless Steel Mandir Designs - Kiran Steels" 
        description="Beautifully crafted custom stainless steel mandir designs for your home." 
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

export default StainlessSteelMandirDesigns;
