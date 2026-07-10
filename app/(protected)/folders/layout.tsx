import { DriveTopNav } from "@/features/navigation/ui/drive-top-nav";
import { Leftnav } from "@/components/nav/left-nav";

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <>
      <DriveTopNav />
      <Leftnav />
      {children}
    </>
  );
}
