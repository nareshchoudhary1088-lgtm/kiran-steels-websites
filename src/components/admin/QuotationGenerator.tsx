import { useState, useRef } from "react";
import { Download, Plus, Trash2, FileText } from "lucide-react";
import { toWords } from "number-to-words";
import ksLogo from "../../assets/ks_logo.png";
import quoteLogo from "../../assets/quote_logo.png";

type LineItem = {
   id: string;
   description: string;
   qty: number | "";
   unit: string;
   rate: number | "";
};

export default function QuotationGenerator({ defaultCustomerName = "", defaultCustomerPhone = "" }: { defaultCustomerName?: string, defaultCustomerPhone?: string }) {
   const PREDEFINED_ITEMS = [
      "Stainless Steel Pipes & Tubes",
      "Stainless Steel Fitting Items",
      "Stainless Steel Gates",
      "Stainless Steel Compound Gates",
      "Stainless Steel Railing",
      "Stainless Steel Glass Railing",
      "Stainless Steel Balkani",
      "Stainless Steel Box and Grills",
      "Stainless Steel Letters (Signboards)",
      "Stainless Steel Spiral Staircase",
      "Stainless Steel Mandir Designs"
   ];

   const [customerName, setCustomerName] = useState(defaultCustomerName);
   const [customerPhone, setCustomerPhone] = useState(defaultCustomerPhone);
   const [customerAddress, setCustomerAddress] = useState("");
   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
   const [quoteNumber, setQuoteNumber] = useState(() => {
      const lastQuote = localStorage.getItem("lastQuoteNumber");
      if (!lastQuote) return "QT-0001";
      const match = lastQuote.match(/(\d+)$/);
      if (match) {
         const numStr = match[1];
         const nextNum = parseInt(numStr, 10) + 1;
         const nextNumStr = nextNum.toString().padStart(numStr.length, '0');
         return lastQuote.replace(new RegExp(numStr + '$'), nextNumStr);
      }
      return lastQuote + "-1";
   });

   const [items, setItems] = useState<LineItem[]>([
      { id: "1", description: "", qty: "", unit: "RFT", rate: "" }
   ]);

   const [taxRate, setTaxRate] = useState(0); // Default 0% GST
   const [discount, setDiscount] = useState(0);

   const addItem = () => {
      setItems([...items, { id: Math.random().toString(), description: "", qty: "", unit: "Kg", rate: "" }]);
   };

   const updateItem = (id: string, field: keyof LineItem, value: any) => {
      setItems(items.map(i => {
         if (i.id === id) {
            let updatedItem = { ...i, [field]: value };
            
            if (field === 'description') {
               const desc = value as string;
               if (desc === "Stainless Steel Pipes & Tubes" || desc === "Stainless Steel Fitting Items") {
                  updatedItem.unit = "Kg";
               } else if (desc === "Stainless Steel Gates" || desc === "Stainless Steel Compound Gates" || desc === "Stainless Steel Box and Grills" || desc === "Stainless Steel Mandir Designs") {
                  updatedItem.unit = "Sq.Ft";
               } else if (desc === "Stainless Steel Railing" || desc === "Stainless Steel Glass Railing" || desc === "Stainless Steel Balkani" || desc === "Stainless Steel Spiral Staircase") {
                  updatedItem.unit = "RFT";
               } else if (desc === "Stainless Steel Letters (Signboards)") {
                  updatedItem.unit = "Inch";
               }
            }
            return updatedItem;
         }
         return i;
      }));
   };

   const removeItem = (id: string) => {
      setItems(items.filter(i => i.id !== id));
   };

   const subtotal = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
   const taxAmount = (subtotal - discount) * (taxRate / 100);
   const grandTotal = subtotal - discount + taxAmount;

   const handlePrint = () => {
      localStorage.setItem("lastQuoteNumber", quoteNumber);
      const originalTitle = document.title;
      document.title = customerName ? `Kiran_Steels_Quotation_${customerName.trim().replace(/\s+/g, '_')}` : `Kiran_Steels_Quotation_${quoteNumber}`;
      window.print();
      setTimeout(() => {
         document.title = originalTitle;
      }, 500);
   };

   return (
      <div className="flex flex-col lg:flex-row gap-8">
         <datalist id="predefined-items">
            {PREDEFINED_ITEMS.map((item, idx) => (
               <option key={idx} value={item} />
            ))}
         </datalist>
         {/* ── LEFT PANE: INPUT FORM (Hidden on Print) ── */}
         <div className="w-full lg:w-[450px] xl:w-[500px] shrink-0 space-y-6 bg-card border border-border rounded-3xl p-6 shadow-sm no-print">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-xl font-black uppercase tracking-widest text-foreground">Quote Builder</h2>
               <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
               >
                  <Download size={14} /> Generate PDF
               </button>
            </div>

            {/* Customer Details */}
            <div className="space-y-4 bg-muted/30 p-5 rounded-2xl border border-border/50">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer Details</h3>
               <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                  <input type="text" placeholder="Phone Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                  <input type="text" placeholder="Address / Site Location" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="col-span-2 w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
               </div>
               <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                     <label className="text-[9px] font-bold text-muted-foreground uppercase ml-1">Quote Date</label>
                     <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none mt-1" />
                  </div>
                  <div>
                     <label className="text-[9px] font-bold text-muted-foreground uppercase ml-1">Quote Number</label>
                     <input type="text" value={quoteNumber} onChange={(e) => setQuoteNumber(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none mt-1" />
                  </div>
               </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Line Items</h3>
                  <button onClick={addItem} className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest hover:underline">
                     <Plus size={12} /> Add Item
                  </button>
               </div>

               <div className="space-y-3">
                  {items.map((item, index) => (
                     <div key={item.id} className="flex gap-2 items-start">
                        <div className="flex-1 grid grid-cols-12 gap-1.5">
                           <input type="text" list="predefined-items" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="col-span-5 bg-card border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-primary/50" />
                           <input type="number" placeholder="Qty" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value ? Number(e.target.value) : "")} className="col-span-2 bg-card border border-border rounded-lg px-2 py-2 text-sm focus:outline-none [&::-webkit-inner-spin-button]:appearance-none" />
                           <select value={item.unit} onChange={(e) => updateItem(item.id, 'unit', e.target.value)} className="col-span-2 bg-card border border-border rounded-lg px-1 py-2 text-xs focus:outline-none">
                              <option value="Kg">Kg</option>
                              <option value="RFT">RFT</option>
                              <option value="Sq.Ft">Sq.Ft</option>
                              <option value="Piece">Piece</option>
                              <option value="Inch">Inch</option>
                           </select>
                           <input type="number" placeholder="Rate" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', e.target.value ? Number(e.target.value) : "")} className="col-span-3 bg-card border border-border rounded-lg px-2 py-2 text-sm focus:outline-none [&::-webkit-inner-spin-button]:appearance-none" />
                        </div>
                        <button onClick={() => removeItem(item.id)} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors mt-0.5">
                           <Trash2 size={16} />
                        </button>
                     </div>
                  ))}
               </div>
            </div>

            {/* Totals */}
            <div className="space-y-4 bg-muted/30 p-5 rounded-2xl border border-border/50">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Totals & Tax</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[9px] font-bold text-muted-foreground uppercase ml-1">Discount (₹)</label>
                     <input type="number" value={discount || ""} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none mt-1" />
                  </div>
                  <div>
                     <label className="text-[9px] font-bold text-muted-foreground uppercase ml-1">GST Rate (%)</label>
                     <select value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none mt-1">
                        <option value={0}>No GST (0%)</option>
                        <option value={12}>12% GST</option>
                        <option value={18}>18% GST</option>
                     </select>
                  </div>
               </div>
            </div>
         </div>

         {/* ── RIGHT PANE: LIVE PREVIEW (Shown on Print) ── */}
         <div className="flex-1 print-container">
            <div className="bg-white text-black min-h-[297mm] shadow-2xl print:shadow-none mx-auto w-full max-w-[210mm] print:max-w-none print:w-full font-sans border-t-[12px] border-primary relative overflow-hidden flex flex-col box-border">

               {/* Background Watermark */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                  <img src={ksLogo} alt="Watermark" className="w-[500px] grayscale" />
               </div>

               <div className="p-8 sm:p-12 flex-1 flex flex-col z-10 relative">

                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-8">
                     <div className="flex items-center">
                        <img src={quoteLogo} alt="Kiran Steels" className="h-28 sm:h-32 w-auto object-contain" />
                     </div>
                     <div className="text-right">
                        <h2 className="text-4xl font-black text-primary uppercase tracking-widest mb-4">Quotation</h2>

                        <table className="ml-auto text-left text-xs border-collapse">
                           <tbody>
                              <tr>
                                 <th className="py-1 px-3 bg-primary/5 border border-primary/20 font-black text-primary uppercase text-[9px] tracking-wider">Quote No.</th>
                                 <td className="py-1 px-3 border border-primary/20 font-bold text-foreground">{quoteNumber}</td>
                              </tr>
                              <tr>
                                 <th className="py-1 px-3 bg-primary/5 border border-primary/20 font-black text-primary uppercase text-[9px] tracking-wider">Date</th>
                                 <td className="py-1 px-3 border border-primary/20 text-foreground font-medium">{new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                              </tr>
                              <tr>
                                 <th className="py-1 px-3 bg-primary/5 border border-primary/20 font-black text-primary uppercase text-[9px] tracking-wider">Valid Till</th>
                                 <td className="py-1 px-3 border border-primary/20 text-foreground font-medium">
                                    {new Date(new Date(date).getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  {/* Thick Divider */}
                  <div className="h-1 w-full bg-primary mb-8"></div>

                  {/* Customer Details Block */}
                  <div className="mb-8 border border-primary/20 p-5 bg-primary/5 rounded-xl">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 border-b border-primary/20 pb-2">Bill To</h3>
                     <p className="font-bold text-foreground text-base mb-1">{customerName || "Client Name"}</p>
                     {customerAddress && <p className="text-zinc-600 text-xs leading-relaxed w-2/3">{customerAddress}</p>}
                     {customerPhone && <p className="text-zinc-600 text-xs mt-1.5 font-medium">Contact: <span className="text-foreground">{customerPhone}</span></p>}
                  </div>

                  {/* Line Items Table */}
                  <div className="mb-8 flex-1 rounded-xl overflow-hidden border border-primary/20 shadow-sm">
                     <table className="w-full text-sm border-collapse">
                        <thead className="bg-primary text-primary-foreground">
                           <tr>
                              <th className="py-3 px-3 text-center text-[10px] font-black uppercase tracking-widest w-12 border-r border-primary-foreground/20">#</th>
                              <th className="py-3 px-4 text-left text-[10px] font-black uppercase tracking-widest border-r border-primary-foreground/20">Description of Goods</th>
                              <th className="py-3 px-3 text-right text-[10px] font-black uppercase tracking-widest w-24 border-r border-primary-foreground/20">Qty</th>
                              <th className="py-3 px-3 text-right text-[10px] font-black uppercase tracking-widest w-28 border-r border-primary-foreground/20">Rate (₹)</th>
                              <th className="py-3 px-4 text-right text-[10px] font-black uppercase tracking-widest w-32">Amount (₹)</th>
                           </tr>
                        </thead>
                        <tbody>
                           {items.map((item, i) => (
                              <tr key={item.id} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                                 <td className="py-3 px-3 text-zinc-900 text-xs text-center border-r border-primary/10 font-bold bg-primary/5">{i + 1}</td>
                                 <td className="py-3 px-4 font-semibold text-foreground border-r border-primary/10 text-xs">{item.description || "—"}</td>
                                 <td className="py-3 px-3 text-foreground text-right border-r border-primary/10 text-xs font-medium">{item.qty} <span className="text-[9px] text-zinc-500 ml-0.5">{item.unit}</span></td>
                                 <td className="py-3 px-3 text-foreground text-right border-r border-primary/10 text-xs font-medium">{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                 <td className="py-3 px-4 font-black text-foreground text-right text-xs">{(item.qty * item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* Totals Section */}
                  <div className="flex justify-end items-start mb-16">
                     <div className="w-1/2">
                        <table className="w-full text-sm border-collapse rounded-xl overflow-hidden border border-primary/20">
                           <tbody>
                              <tr className="bg-primary/5">
                                 <td className="py-2.5 px-4 text-right text-primary text-[10px] font-black uppercase tracking-widest border-b border-primary/10">Subtotal</td>
                                 <td className="py-2.5 px-4 text-right font-bold text-foreground border-b border-primary/10 w-40">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              </tr>
                              {discount > 0 && (
                                 <tr className="bg-primary/5">
                                    <td className="py-2.5 px-4 text-right text-primary text-[10px] font-black uppercase tracking-widest border-b border-primary/10">Discount</td>
                                    <td className="py-2.5 px-4 text-right font-bold text-emerald-600 border-b border-primary/10 w-40">-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                 </tr>
                              )}
                              {taxRate > 0 && (
                                 <tr className="bg-primary/5">
                                    <td className="py-2.5 px-4 text-right text-primary text-[10px] font-black uppercase tracking-widest border-b border-primary/10">GST ({taxRate}%)</td>
                                    <td className="py-2.5 px-4 text-right font-bold text-foreground border-b border-primary/10 w-40">₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                 </tr>
                              )}
                              <tr className="bg-primary text-primary-foreground shadow-xl">
                                 <td className="py-3.5 px-4 text-right font-black uppercase tracking-widest text-[11px]">Grand Total</td>
                                 <td className="py-3.5 px-4 text-right font-black text-xl w-40">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              </tr>
                           </tbody>
                        </table>
                        <p className="text-right text-[9px] text-zinc-500 mt-2 font-black uppercase tracking-widest">All amounts in Indian Rupees (INR)</p>
                     </div>
                  </div>

                  {/* Footer / Terms */}
                  <div className="mt-auto border-t-2 border-primary pt-6 flex justify-between items-end">
                     <div className="w-2/3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Terms & Conditions</h4>
                        <ul className="text-[9px] text-zinc-600 font-medium list-decimal pl-4 space-y-1 marker:text-primary marker:font-black">
                           <li>This quotation is valid for 15 days from the date of issue.</li>
                           <li>50% advance payment is mandatory to commence fabrication work.</li>
                           <li>Balance 50% payment must be cleared prior to dispatch/installation.</li>
                           <li>Goods once sold will not be taken back. Subject to Visakhapatnam jurisdiction.</li>
                        </ul>
                     </div>
                     <div className="w-1/3 text-right">
                        <div className="h-12 w-40 ml-auto mb-1">
                           {/* Space for signature or stamp */}
                        </div>
                        <div className="border-t-2 border-primary w-48 ml-auto pt-1.5">
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary">For Kiran Steels</p>
                           <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Authorized Signatory</p>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </div>
      </div>
   );
}
