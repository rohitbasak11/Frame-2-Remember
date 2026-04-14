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
                      <div className="font-bold text-lg">{e.full_name}</div>
                      <div className="text-sm text-color-text-muted">{e.email}</div>
                      <div className="text-xs text-pink">{e.phone}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs uppercase font-bold text-salmon mb-1">{e.event_type}</div>
                      <div className="text-sm line-clamp-2 text-color-text-muted italic">&quot;{e.comments}&quot;</div>
                      <div className="text-[10px] mt-2 text-white bg-blue px-2 py-0.5 rounded inline-block">{e.source}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => downloadTxt(e, `enquiry_${e.full_name.replace(/\s/g, '_')}`)}
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
                      {new Date(d.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-lg">{d.full_name}</div>
                      <div className="text-sm text-color-text-muted opacity-70">Client ID: {d.id.slice(0,8)}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {d.can_share_social && <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">Social OK</span>}
                        {d.can_use_marketing && <span className="text-[10px] bg-blue/10 text-blue px-2 py-0.5 rounded border border-blue/20">Marketing OK</span>}
                        {d.can_use_ads && <span className="text-[10px] bg-pink/10 text-pink px-2 py-0.5 rounded border border-pink/20">Ads OK</span>}
                      </div>
                      <div className="text-xs text-color-text-muted">Agreement Version 1.0</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => downloadTxt(d, `declaration_${d.full_name.replace(/\s/g, '_')}`)}
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
