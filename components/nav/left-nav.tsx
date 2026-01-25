import Link from "next/link";
import { Logo } from "@/components/nav/logo";
import { LEFT_MENU } from "@/constants";
import { FolderCreateModal } from "../modal/folder-create-modal";
import { FileUploadModal } from "../modal/file-upload-modal";
import { SettingsModal } from "../modal/settings-modal";

export function Leftnav() {
  return (
    <aside className="hidden lg:block z-50 fixed top-0 bottom-0 left-0 w-64 bg-sidebar border-r">
      <div className="p-2 h-14 border-b">
        <div className="p-2 hover:bg-sidebar-accent">
          <Logo />
        </div>
      </div>
      <div className="mt-2 p-2 pb-4 space-y-2 border-b">
        <FolderCreateModal />
        <FileUploadModal />
      </div>
      <nav className="mt-2 p-2 space-y-2 border-b">
        <div className="text-xs text-right font-medium text-muted-foreground">
          GENERAL
        </div>
        <ul className="mt-2">
          {LEFT_MENU.map((sub) => (
            <Link
              href={sub.url}
              key={sub.url}
              className={`p-2 flex items-center justify-end gap-2 rounded text-rose-400 hover:bg-sidebar-accent aria-[current='page']:bg-sidebar-accent`}
            >
              <span className="text-sm font-medium">{sub.title}</span>
              {sub.icon}
            </Link>
          ))}
        </ul>
      </nav>
      <div className="mt-2 p-2 space-y-2 border-b">
        <div className="text-xs text-right font-medium text-muted-foreground">
          SUPPORT
        </div>
        <ul className="mt-2">
          <li>
            <SettingsModal />
          </li>
        </ul>
      </div>
    </aside>
  );
}
