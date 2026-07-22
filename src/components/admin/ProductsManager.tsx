import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Upload, X, GripVertical,
  ImagePlus, Save, ArrowLeft, Loader2, CheckCircle2
} from "lucide-react";

export type Product = {
  id: string;
  name: string;
  description: string;
  icon: string;
  cover_image_url: string | null;
  gallery_image_urls: string[] | null;
  is_enabled: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Dynamic SEO mapping stored as JSON inside description
  project_info?: Record<number, {
    seoTitle?: string;
    desc?: string;
    cta?: string;
    alt?: string;
    specs?: { label: string; val: string }[];
  }>;
};

type View = "list" | "edit" | "new";

// ─── Image upload helper ───────────────────────────────────────────────────
async function uploadImage(file: File, folder = "covers"): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

// ─── Cover Image Uploader ──────────────────────────────────────────────────
const CoverUploader = ({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, "covers");
      onChange(url);
    } catch (e) {
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">Cover Image</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-full h-44 rounded-xl border-2 border-dashed border-border bg-muted flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
      >
        {uploading ? (
          <Loader2 className="animate-spin text-primary" size={28} />
        ) : value ? (
          <>
            <img src={value} alt="cover" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-white flex items-center justify-center shadow"
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus size={28} />
            <p className="text-xs font-medium">Click to upload cover image</p>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
};

// ─── Individual SEO Meta Editor ──────────────────────────────────────────
const ProjectInfoModal = ({
  index,
  data,
  onSave,
  onClose,
}: {
  index: number;
  data: any;
  onSave: (newData: any) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState(data || { seoTitle: "", desc: "", cta: "", alt: "", specs: [] });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
          <h3 className="font-black text-foreground uppercase tracking-wider text-sm">Project #{index + 1} SEO Data</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">SEO Title</label>
            <input value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm" placeholder="Premium SS Gate in Gajuwaka" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Description</label>
            <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={3} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm resize-none" placeholder="Targeted neighborhood description..." />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Call to Action (CTA)</label>
            <input value={form.cta} onChange={e => setForm({ ...form, cta: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm" placeholder="Call +91 9618012403 for quotes..." />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Alt Tag Slug</label>
            <input value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm" placeholder="ss-gate-gajuwaka-visakhapatnam" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 bg-primary text-white font-bold py-2 rounded-xl text-xs uppercase tracking-widest hover:bg-primary/90 transition-all">Save Project Data</button>
        </div>
      </div>
    </div>
  );
};

// ─── Gallery Image Manager ─────────────────────────────────────────────────
const GalleryManager = ({
  images,
  projectData,
  onChange,
  onDataChange,
}: {
  images: string[];
  projectData: Record<number, any>;
  onChange: (urls: string[]) => void;
  onDataChange: (data: Record<number, any>) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map((f) => uploadImage(f, "gallery"))
      );
      onChange([...images, ...urls]);
    } catch {
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
    const newData = { ...projectData };
    delete newData[idx];
    onDataChange(newData);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Gallery Images</label>
        <span className="text-[10px] text-muted-foreground italic">Click ⚙️ to edit SEO per image</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((url, idx) => (
          <div key={url + idx} className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-card shadow-sm">
            <img src={url} alt={`gallery-${idx}`} className="w-full h-full object-cover" />

            {/* Delete/Edit Buttons */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setEditingIndex(idx)}
                className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center shadow hover:scale-110 transition-transform"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="w-8 h-8 rounded-full bg-destructive text-white flex items-center justify-center shadow hover:scale-110 transition-transform"
              >
                <X size={14} />
              </button>
            </div>

            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center border border-white/20">
              {idx + 1}
            </div>

            {/* SEO Badge */}
            {projectData[idx] && (
              <div className="absolute top-1 left-1 bg-green-500/90 text-white text-[8px] font-black rounded px-1 tracking-tighter uppercase">SEO ✓</div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer"
        >
          {uploading ? <Loader2 className="animate-spin text-primary" size={24} /> : <><Plus size={24} /><span className="text-[10px] uppercase font-black tracking-widest">Add</span></>}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }}
      />

      {editingIndex !== null && (
        <ProjectInfoModal
          index={editingIndex}
          data={projectData[editingIndex]}
          onSave={(data) => {
            onDataChange({ ...projectData, [editingIndex]: data });
          }}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </div>
  );
};

// ─── Subcategories Manager ──────────────────────────────────────────────────
const SubcategoriesManager = ({
  subcategories,
  onChange,
}: {
  subcategories: { name: string; images: string[]; projectData: Record<number, any> }[];
  onChange: (subs: any[]) => void;
}) => {
  const addSub = () => {
    const name = prompt("Enter subcategory name (e.g. Modern Gates):");
    if (name) onChange([...subcategories, { name, images: [], projectData: {} }]);
  };
  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl">
        <div>
          <h3 className="font-black text-sm uppercase tracking-widest text-foreground">Subcategories</h3>
          <p className="text-xs text-muted-foreground mt-1">Manage specific sub-types (e.g. Modern, Luxury, Budget)</p>
        </div>
        <button type="button" onClick={addSub} className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all">
          <Plus size={14} className="inline mr-1" /> Add
        </button>
      </div>
      {subcategories.map((sub, idx) => (
        <div key={idx} className="border border-border p-4 rounded-xl bg-card space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
             <h4 className="font-bold text-sm text-foreground">{sub.name}</h4>
             <button type="button" onClick={() => {
                if(confirm(`Delete subcategory "${sub.name}"?`)) onChange(subcategories.filter((_, i) => i !== idx));
             }} className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors"><Trash2 size={16} /></button>
          </div>
          <GalleryManager 
            images={sub.images || []} 
            projectData={sub.projectData || {}} 
            onChange={urls => {
               const n = [...subcategories]; n[idx].images = urls; onChange(n);
            }} 
            onDataChange={data => {
               const n = [...subcategories]; n[idx].projectData = data; onChange(n);
            }} 
          />
        </div>
      ))}
    </div>
  );
};

// ─── Product Form (edit/new) ───────────────────────────────────────────────
const ProductForm = ({
  initial,
  onSave,
  onBack,
}: {
  initial: Partial<Product>;
  onSave: (p: Partial<Product>) => Promise<void>;
  onBack: () => void;
}) => {
  // Parse project_info from description if it exists
  const parseData = () => {
    if (!initial.description?.includes("||_PROJECT_DATA_||")) {
      return { desc: initial.description || "", info: { subCategories: [], ...(initial.project_info || {}) } };
    }
    const [desc, json] = initial.description.split("||_PROJECT_DATA_||");
    try {
      const parsed = JSON.parse(json);
      return { desc, info: { subCategories: [], ...parsed } };
    } catch {
      return { desc, info: { subCategories: [] } };
    }
  };

  const { desc: initDesc, info: initInfo } = parseData();

  const [form, setForm] = useState<Partial<Product>>({
    name: "",
    description: initDesc,
    icon: "🔩",
    cover_image_url: null,
    gallery_image_urls: [],
    is_enabled: true,
    sort_order: 0,
    ...initial,
    project_info: initInfo,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof Product, val: unknown) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Pack project_info back into description
      const payload = { ...form };
      payload.description = `${form.description || ""}||_PROJECT_DATA_||${JSON.stringify(form.project_info || {})}`;
      await onSave(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Back + Title */}
      <div className="flex items-center gap-3 mb-2">
        <button type="button" onClick={onBack} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h2 className="font-black text-foreground text-base tracking-tight">{initial.id ? "Edit Product" : "New Product"}</h2>
      </div>

      {/* Name */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1.5">Product Name</label>
        <input
          required value={form.name || ""} onChange={(e) => set("name", e.target.value)}
          className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="e.g. Stainless Steel Pipes"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1.5">Description (Main)</label>
        <textarea
          value={form.description || ""} onChange={(e) => set("description", e.target.value)} rows={3}
          className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          placeholder="General product description..."
        />
      </div>

      {/* Icon + Sort row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1.5">Icon (Emoji)</label>
          <input
            value={form.icon || ""} onChange={(e) => set("icon", e.target.value)}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center"
            placeholder="🔩"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1.5">Position</label>
          <input
            type="number" value={form.sort_order ?? 0}
            onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Enable toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
        <div>
          <p className="font-bold text-xs uppercase tracking-widest text-foreground">Live on Website</p>
          <p className="text-[10px] text-muted-foreground">Toggle to show or hide from users</p>
        </div>
        <button
          type="button"
          onClick={() => set("is_enabled", !form.is_enabled)}
          className={`w-12 h-6 rounded-full transition-all relative ${form.is_enabled ? "bg-primary" : "bg-muted-foreground/30"}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${form.is_enabled ? "left-[calc(100%-1.375rem)]" : "left-0.5"}`} />
        </button>
      </div>

      {/* Cover Image */}
      <CoverUploader value={form.cover_image_url ?? null} onChange={(url) => set("cover_image_url", url)} />

      {/* Main Gallery */}
      <div className="bg-muted/10 p-4 rounded-xl border border-border">
        <h3 className="font-black text-sm uppercase tracking-widest text-foreground mb-4">Main Gallery (Uncategorized)</h3>
        <GalleryManager
          images={form.gallery_image_urls || []}
          projectData={form.project_info || {}}
          onChange={(urls) => set("gallery_image_urls", urls)}
          onDataChange={(info) => set("project_info", { ...form.project_info, ...info })}
        />
      </div>

      {/* Subcategories */}
      <SubcategoriesManager 
        subcategories={form.project_info?.subCategories || []} 
        onChange={(subs) => set("project_info", { ...form.project_info, subCategories: subs })} 
      />

      {/* Save */}
      <div className="pt-4">
        <button
          type="submit" disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saving ? "Processing..." : saved ? "Changes Saved!" : "Update Master Data"}
        </button>
      </div>
    </form>
  );
};

// ─── Product Card in list ──────────────────────────────────────────────────
const ProductRow = ({
  product,
  onEdit,
  onToggle,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) => (
  <div className={`flex items-center gap-3 bg-card border rounded-xl p-3 shadow-sm transition-all ${product.is_enabled ? "border-border" : "border-border opacity-60"}`}>
    <GripVertical size={14} className="text-muted-foreground shrink-0" />
    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
      {product.cover_image_url ? (
        <img src={product.cover_image_url} alt={product.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xl">{product.icon}</div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-foreground text-sm truncate">{product.name}</p>
      <p className="text-muted-foreground text-xs truncate">{product.description || "No description"}</p>
      <p className="text-muted-foreground text-[10px] mt-0.5">{product.gallery_image_urls?.length || 0} gallery images</p>
    </div>
    <div className="flex items-center gap-1 shrink-0">
      <button onClick={onToggle} title={product.is_enabled ? "Hide" : "Show"}
        className={`p-1.5 rounded-lg transition-colors ${product.is_enabled ? "text-green-600 hover:bg-green-50" : "text-muted-foreground hover:bg-muted"}`}>
        {product.is_enabled ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
      <button onClick={onEdit} className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors">
        <Pencil size={14} />
      </button>
      <button onClick={onDelete} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

// ─── Main Products Manager ─────────────────────────────────────────────────
const ProductsManager = ({
  products,
  onRefresh,
}: {
  products: Product[];
  onRefresh: () => void;
}) => {
  const [view, setView] = useState<View>("list");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const handleSave = async (form: Partial<Product>) => {
    if (form.id) {
      await supabase.from("products").update({
        name: form.name,
        description: form.description,
        icon: form.icon,
        cover_image_url: form.cover_image_url,
        gallery_image_urls: form.gallery_image_urls,
        is_enabled: form.is_enabled,
        sort_order: form.sort_order,
      }).eq("id", form.id);
    } else {
      await supabase.from("products").insert({
        name: form.name!,
        description: form.description || "",
        icon: form.icon || "🔩",
        cover_image_url: form.cover_image_url || null,
        gallery_image_urls: form.gallery_image_urls || [],
        is_enabled: form.is_enabled ?? true,
        sort_order: form.sort_order ?? products.length,
      });
    }
    onRefresh();
    setView("list");
  };

  const handleToggle = async (p: Product) => {
    await supabase.from("products").update({ is_enabled: !p.is_enabled }).eq("id", p.id);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    onRefresh();
  };

  if (view === "edit" && editing) {
    return (
      <ProductForm
        initial={editing}
        onSave={handleSave}
        onBack={() => { setView("list"); setEditing(null); }}
      />
    );
  }

  if (view === "new") {
    return (
      <ProductForm
        initial={{}}
        onSave={handleSave}
        onBack={() => setView("list")}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground">{products.length} product{products.length !== 1 ? "s" : ""}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              if (confirm("Reset to 11 default categories? This will delete all current products.")) {
                await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
                onRefresh();
              }
            }}
            className="flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <Trash2 size={13} /> Reset Inventory
          </button>
          <button
            onClick={() => setView("new")}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={13} /> Add Product
          </button>
        </div>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImagePlus size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium text-sm">No products yet</p>
          <p className="text-xs">Click "Add Product" to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              onEdit={() => { setEditing(p); setView("edit"); }}
              onToggle={() => handleToggle(p)}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
