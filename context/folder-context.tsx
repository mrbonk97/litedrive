"use client";

import { createContext, useContext, useReducer } from "react";
import { FolderAction, folderReducer, FolderState } from "./folder-reducer";
import { FileType } from "@/app/types";
import { updateFileById } from "@/services/file-service";
import { toast } from "sonner";
import { updateFolderById } from "@/services/folder-client";
import { useRouter } from "next/navigation";
import { safeAwait } from "@/lib/safe-await";

const FolderContext = createContext<{
  state: FolderState;
  dispatch: React.Dispatch<FolderAction>;
  dragDrop: (target: FileType) => Promise<void>;
}>({
  state: {
    drag: null,
    target: null,
    modalItem: null,
    modalType: "idle",
    loading: false,
  },
  dispatch: () => {},
  dragDrop: async () => {},
});

export function FolderProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(folderReducer, {
    drag: null,
    target: null,
    modalItem: null,
    modalType: "idle",
    loading: false,
  });

  const dragDrop = async (target: FileType) => {
    const { drag } = state;
    if (!drag) return;

    if (target.FILE_TYPE === "FILE") {
      dispatch({ type: "DRAG_END" });
      return;
    }

    if (drag.ID === target.ID) {
      dispatch({ type: "DRAG_END" });
      return;
    }

    if (drag.FILE_TYPE === "FILE" && drag.FOLDER_ID === target.ID) {
      dispatch({ type: "DRAG_END" });
      return;
    }

    const ff =
      drag.FILE_TYPE === "FILE"
        ? updateFileById(drag.ID, drag.NAME, target.ID)
        : updateFolderById(drag.ID, target.ID, drag.NAME);

    const [_, err] = await safeAwait(ff);

    if (err) {
      toast.error("폴더 이동 실패");
    } else {
      toast.success("폴더 이동 성공");
      router.refresh();
    }

    dispatch({ type: "DRAG_END" });
  };

  return (
    <FolderContext.Provider value={{ state, dispatch, dragDrop }}>
      {children}
    </FolderContext.Provider>
  );
}

export function useFolder() {
  return useContext(FolderContext);
}
