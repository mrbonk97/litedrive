import { BottomNav } from "@/components/nav/bottom-nav";
import { Leftnav } from "@/components/nav/left-nav";
import { Topnav } from "@/components/nav/top-nav";
import { DnDProvider } from "@/context/dnd-provider";

interface Props {
  children: React.ReactNode;
}

async function FoldersLayout({ children }: Props) {
  return (
    <>
      <Leftnav />
      <DnDProvider>
        <Topnav />
        {children}
      </DnDProvider>
      <BottomNav />
    </>
  );
}

export default FoldersLayout;
