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

  const downloadTxt = (data: any, filename: string) => {
    const text = Object.entries(data)
      .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
                          onClick={() => downloadTxt(e, `enquiry_${(e.name || 'unnamed').replace(/\s/g, '_')}`)}
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
                      <div className="text-xs opacity-50 font-mono uppercase tracking-tighter">ID: {d.id.slice(0,8)}</div>
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
                          onClick={() => downloadTxt(d, `declaration_${(d.name || 'unnamed').replace(/\s/g, '_')}`)}
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
