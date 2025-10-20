import { FileUploadModal } from "../modal/file-upload-modal";
import { FolderCreateModal } from "../modal/folder-create-modal";
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
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

interface Props {
  folderId: number;
}

export function BottomNav({ folderId }: Props) {
  return (
    <>
      <Drawer>
        <DrawerTrigger className="lg:hidden fixed bottom-8 right-8 z-50 text-rose-400">
          <PlusCircle size={32} />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="sr-only">메뉴</DrawerTitle>
            <DrawerDescription className="sr-only">폴더 & 파일 업로드 메뉴</DrawerDescription>
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
