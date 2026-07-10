import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/api/get-current-user.api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

interface Props {
  children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: Props) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/sign-in");
  }

  return children;
}
