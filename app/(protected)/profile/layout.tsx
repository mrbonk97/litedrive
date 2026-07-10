import { UserTopNav } from "@/features/navigation/ui/user-top-nav";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/features/auth/api/get-current-user.api";
import { createClient } from "@/lib/supabase/server";

interface Props {
  children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: Props) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  return (
    <>
      <UserTopNav user={user} />
      {children}
      <Footer />
    </>
  );
}
