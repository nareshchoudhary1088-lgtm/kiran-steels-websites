import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const productsToSeed = [
  { name: "Stainless Steel Pipes & Tubes", description: "High-quality stainless steel pipes with excellent corrosion resistance", icon: "CircleDot", sort_order: 1 },
  { name: "Stainless Steel Sheets", description: "High-quality stainless steel sheets for diverse applications", icon: "Sheet", sort_order: 2 },
  { name: "Stainless Steel Gates", description: "Custom-made stainless steel gates with modern and classic designs", icon: "DoorOpen", sort_order: 3 },
  { name: "Stainless Steel Compound", description: "Durable stainless steel compounds for boundaries", icon: "Building2", sort_order: 4 },
  { name: "Stainless Steel Railing", description: "Elegant stainless steel railings for stairs and balconies", icon: "Layers", sort_order: 5 },
  { name: "Stainless Steel Glass Railing", description: "Modern glass railings with stainless steel fixtures", icon: "Glasses", sort_order: 6 },
  { name: "Stainless Steel Balkani", description: "Stylish and strong balcony designs", icon: "Columns3", sort_order: 7 },
  { name: "Stainless Steel Box and Grills", description: "Secure and aesthetic boxes and grills", icon: "Grid2X2", sort_order: 8 },
  { name: "Stainless Steel Letters (Signboards)", description: "Premium stainless steel signboards and letters", icon: "Type", sort_order: 9 },
  { name: "Stainless Steel Spiral Staircase", description: "Beautiful spiral staircase designs", icon: "Activity", sort_order: 10 },
  { name: "Stainless Steel Mandir Designs", description: "Intricate stainless steel mandir structures", icon: "Home", sort_order: 11 },
];

async function seed() {
  console.log("Seeding products...");
  
  // Clear existing to avoid duplicates in this demo script
  // await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  for (const product of productsToSeed) {
    const { data, error } = await supabase
      .from('products')
      .insert([product]);
      
    if (error) {
      console.error(`Error inserting ${product.name}:`, error.message);
    } else {
      console.log(`Inserted ${product.name}`);
    }
  }
  
  console.log("Seeding complete!");
}

seed();
