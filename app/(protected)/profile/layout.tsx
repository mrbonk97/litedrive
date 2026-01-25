import { Metadata } from "next";
import { ProfileTopnav } from "@/components/nav/profile-top-nav";
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
      <ProfileTopnav />
      {children}
      <Footer />
    </>
  );
}

export default ProfileLayout;
