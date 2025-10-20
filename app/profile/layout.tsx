import { Metadata } from "next";
import { Topnav2 } from "@/components/nav/top-nav-2";
import { Footer } from "@/components/nav/footer";

export const metadata: Metadata = {
  title: "프로필 - LiteDrive",
};

interface Props {
  children: React.ReactNode;
}

async function ProfileLayout({ children }: Props) {
  return (
    <>
      <Topnav2 />
      {children}
      <Footer />
    </>
  );
}

export default ProfileLayout;
