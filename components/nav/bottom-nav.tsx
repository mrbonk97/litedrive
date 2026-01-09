import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FileUploadModal } from "@/components/modal/file-upload-modal";
import { FolderCreateModal } from "@/components/modal/folder-create-modal";

interface Props {
  folderId: string | null;
}

export function BottomNav({ folderId }: Props) {
  return (
    <>
      <Drawer>
        <DrawerTrigger className="lg:hidden fixed bottom-8 right-8 z-50 text-rose-400">
          <PlusCircle size={32} className="bg-background shadow-2xl" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="sr-only">메뉴</DrawerTitle>
            <DrawerDescription className="sr-only">
              폴더 & 파일 업로드 메뉴
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <FolderCreateModal folderId={folderId} />
            <FileUploadModal folderId={folderId} />
            <Button variant={"secondary"} asChild>
              <DrawerClose>닫기</DrawerClose>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
