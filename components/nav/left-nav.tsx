import Link from "next/link";
import { House, UsersRound } from "lucide-react";
import { FileUploadModal } from "@/components/modal/file-upload-modal";
import { FolderCreateModal } from "@/components/modal/folder-create-modal";
import { Logo } from "@/components/nav/logo";

interface Props {
  folderId: number;
}

export function Leftnav({ folderId }: Props) {
  return (
    <aside className="hidden lg:block z-50 fixed top-0 bottom-0 left-0 w-64 bg-sidebar border-r">
      <div className="p-2 h-14 border-b">
        <div className="p-2 hover:bg-sidebar-accent">
          <Logo />
        </div>
      </div>
      <div className="mt-2 p-2 pb-4 space-y-2 border-b">
        <FolderCreateModal folderId={folderId} />
        <FileUploadModal folderId={folderId} />
      </div>
      <nav className="mt-2 p-2 space-y-2">
        {MENU.map((menu) => {
          return (
            <Link
              href={menu.url}
              key={menu.url}
              className={`p-2 flex items-center justify-end gap-2 rounded text-rose-400 hover:bg-sidebar-accent`}
            >
              <span className="text-sm font-medium">{menu.title}</span>
              {menu.icon}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

const MENU = [
  {
    title: "홈",
    url: "/folders",
    icon: <House size={18} />,
  },
  {
    title: "공유중",
    url: "/folders?filter=share",
    icon: <UsersRound size={18} />,
  },
];
