import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", req.url), {
    status: 302,
  });

  response.cookies.delete("f2r_auth");
  
  revalidatePath("/", "layout");
  return response;
}
