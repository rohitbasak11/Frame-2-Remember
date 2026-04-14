"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Download, Trash2, RefreshCw, Layers } from "lucide-react";

interface AdminDashboardContentProps {
  initialEnquiries: any[];
  initialDeclarations: any[];
}

export default function AdminDashboardContent({ initialEnquiries, initialDeclarations }: AdminDashboardContentProps) {
  const [activeTab, setActiveTab] = useState<"enquiries" | "declarations">("enquiries");
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [declarations, setDeclarations] = useState(initialDeclarations);
  const [refreshing, setRefreshing] = useState(false);
  const supabase = createClient();

  const handleRefresh = async () => {
    setRefreshing(true);
    const { data: enq } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    const { data: decl } = await supabase.from("declarations").select("*").order("created_at", { ascending: false });
    if (enq) setEnquiries(enq);
    if (decl) setDeclarations(decl);
    setRefreshing(false);
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      alert("Error deleting record: " + error.message);
    } else {
      handleRefresh();
    }
  };

  const printRecord = (data: any, type: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const dateStr = new Date(data.created_at || data.time).toLocaleString();
    const content = type === 'declaration' 
      ? `
        <div class="section">
          <h2>Consents & Preferences</h2>
          <p>${data.message}</p>
        </div>
        <div class="signature">
          <h3>Digital Signature</h3>
          ${data.pdf_base64 ? `<img src="${data.pdf_base64}" alt="Signature" />` : '<p>No signature provided.</p>'}
        </div>
      `
      : `
        <div class="section">
          <h2>Enquiry Details</h2>
          <p><strong>Shoot Type:</strong> ${data.shoot_type}</p>
          <p><strong>Shoot Length:</strong> ${data.shoot_length}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <h3>Additional Notes</h3>
          <pre>${data.message}</pre>
        </div>
      `;

    printWindow.document.write(`
      <html>
        <head>
          <title>${type.toUpperCase()} - ${data.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto; color: #1a1a1a; }
            h1 { color: #E85D9A; margin-bottom: 5px; text-transform: capitalize; }
            h2 { font-size: 1.2rem; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; }
            .meta { color: #666; margin-bottom: 30px; font-size: 0.9em; background: #fafafa; padding: 15px; border-radius: 8px; }
            .section { margin-bottom: 30px; }
            .signature { margin-top: 40px; border-top: 2px solid #eee; padding-top: 20px; }
            .signature img { max-height: 100px; display: block; margin-top: 10px; }
            pre { white-space: pre-wrap; font-family: inherit; background: #fafafa; padding: 15px; border-radius: 8px; }
            @media print {
              body { padding: 0; }
              @page { margin: 2cm; }
            }
          </style>
        </head>
        <body>
          <h1>Frame 2 Remember - ${type}</h1>
          <div class="meta">
            <strong>Name:</strong> ${data.name}<br>
            <strong>Email:</strong> ${data.email}<br>
            <strong>Date:</strong> ${dateStr}<br>
            <strong>Reference ID:</strong> ${data.id}
          </div>
          ${content}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex p-1 bg-gray-200 dark:bg-white/5 rounded-2xl">
          <button 
            onClick={() => setActiveTab("enquiries")}
            className={`px-8 py-3 rounded-xl transition-all font-medium ${activeTab === "enquiries" ? "bg-white dark:bg-dark shadow-sm text-pink" : "text-color-text-muted hover:text-color-text"}`}
          >
            Enquiries ({enquiries.length})
          </button>
          <button 
            onClick={() => setActiveTab("declarations")}
            className={`px-8 py-3 rounded-xl transition-all font-medium ${activeTab === "declarations" ? "bg-white dark:bg-dark shadow-sm text-pink" : "text-color-text-muted hover:text-color-text"}`}
          >
            Declarations ({declarations.length})
          </button>
        </div>

        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-glass-border rounded-xl hover:border-pink transition-all disabled:opacity-50"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="glass rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-white/5">
                <th className="px-8 py-6 text-xs uppercase tracking-widest text-color-text-muted font-bold">Date</th>
                <th className="px-8 py-6 text-xs uppercase tracking-widest text-color-text-muted font-bold">Contact</th>
                <th className="px-8 py-6 text-xs uppercase tracking-widest text-color-text-muted font-bold">Details</th>
                <th className="px-8 py-6 text-xs uppercase tracking-widest text-color-text-muted font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {activeTab === "enquiries" ? (
                enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-pink/5 transition-colors">
                    <td className="px-8 py-6 text-sm text-color-text-muted whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-lg">{e.name}</div>
                      <div className="text-sm text-color-text-muted">{e.email}</div>
                      <div className="text-xs text-pink">{e.phone}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs uppercase font-bold text-salmon mb-1">{e.shoot_type}</div>
                      <div className="text-xs text-color-text-muted mb-1 font-medium">{e.shoot_length}</div>
                      <div className="text-sm line-clamp-2 text-color-text-muted italic">&quot;{e.message}&quot;</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => printRecord(e, 'enquiry')}
                          className="p-3 bg-blue/10 text-blue hover:bg-blue hover:text-white rounded-xl transition-all"
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete("enquiries", e.id)}
                          className="p-3 bg-salmon/10 text-salmon hover:bg-salmon hover:text-white rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                declarations.map((d) => (
                  <tr key={d.id} className="hover:bg-pink/5 transition-colors">
                    <td className="px-8 py-6 text-sm text-color-text-muted whitespace-nowrap">
                      {new Date(d.created_at || d.time).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-lg">{d.name}</div>
                      <div className="text-sm text-color-text-muted">{d.email}</div>
                      <div className="text-xs opacity-50 font-mono uppercase tracking-tighter">ID: {String(d.id).slice(0,8)}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-color-text-muted mb-2">{d.message}</div>
                      {d.pdf_base64 && (
                        <div className="mt-2 bg-white/20 p-2 rounded-lg inline-block border border-glass-border">
                          <img src={d.pdf_base64} alt="Signature" className="h-12 w-auto grayscale contrast-125" />
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => printRecord(d, 'declaration')}
                          className="p-3 bg-blue/10 text-blue hover:bg-blue hover:text-white rounded-xl transition-all"
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete("declarations", d.id)}
                          className="p-3 bg-salmon/10 text-salmon hover:bg-salmon hover:text-white rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {(activeTab === "enquiries" ? enquiries : declarations).length === 0 && (
            <div className="py-24 text-center">
              <Layers size={48} className="mx-auto text-color-text-muted opacity-20 mb-4" />
              <p className="text-color-text-muted">No records found for this section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
