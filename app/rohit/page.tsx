import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import AdminDashboardContent from "./AdminDashboardContent";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("f2r_auth");
  
  if (authCookie?.value !== "true") {
    return redirect("/login");
  }

  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-salmon italic">Database configuration error. Please contact the administrator.</p>
      </div>
    );
  }

  // Fetch initial data
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: declarations } = await supabase
    .from("declarations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark p-8 md:p-12 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-pink/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue/5 rounded-full blur-[120px] -ml-64 -mb-64" />

        <div className="max-w-7xl mx-auto relative z-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="relative w-40 h-12">
                        <Image src="/Logo-1.png" alt="F2R" fill className="object-contain object-left" />
                    </div>
                    <div className="h-8 w-[1px] bg-glass-border mx-2 hidden md:block" />
                    <h1 className="text-3xl font-heading">Admin Dashboard</h1>
                </div>
                
                <form action="/auth/signout" method="post">
                    <button className="px-6 py-2 bg-dark text-white rounded-full hover:bg-salmon transition-colors">
                        Sign Out
                    </button>
                </form>
            </header>

            <AdminDashboardContent 
                initialEnquiries={enquiries || []} 
                initialDeclarations={declarations || []} 
            />
        </div>
    </div>
  );
}
