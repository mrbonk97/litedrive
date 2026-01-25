"use client";

import { updateFile } from "@/client/api/file.api";
import { UpdateFilePayload } from "@/client/api/file.type";
import { updateFolder } from "@/client/api/folder.api";
import { UpdateFolderPayload } from "@/client/api/folder.type";
import { useFolder } from "@/hooks/use-folder";
import { RowType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useReducer } from "react";
import { toast } from "sonner";

/* ---------- types ---------- */

type DndState = {
  drag: RowType | null;
  target: RowType | null;
};

type DndAction =
  | { type: "DRAG_START"; row: RowType | null }
  | { type: "DRAG_OVER"; row: RowType | null }
  | { type: "DROP" }
  | { type: "RESET" };

/* ---------- reducer ---------- */

function dndReducer(state: DndState, action: DndAction): DndState {
  switch (action.type) {
    case "DRAG_START":
      return { drag: action.row, target: null };
    case "DRAG_OVER":
      return { ...state, target: action.row };
    case "RESET":
      return { drag: null, target: null };
    default:
      return state;
  }
}

/* ---------- context ---------- */

export const DndContext = createContext<{
  state: DndState;
  dispatch: React.Dispatch<DndAction>;
  drop: () => void;
} | null>(null);

/* ---------- provider ---------- */

interface Props {
  children: ReactNode;
}

export function DnDProvider({ children }: Props) {
  const { folderId } = useFolder();
  const queryClient = useQueryClient();

  const [state, dispatch] = useReducer(dndReducer, {
    drag: null,
    target: null,
  });

  const folderMutation = useMutation({
    mutationFn: (payload: UpdateFolderPayload) => updateFolder(payload),
    onSuccess: () => {
      toast.success("폴더 변경됨");
      queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
      queryClient.invalidateQueries({ queryKey: ["folder", state.target?.id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const fileMutation = useMutation({
    mutationFn: (payload: UpdateFilePayload) => updateFile(payload),
    onSuccess: () => {
      toast.success("폴더 변경됨");
      queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
      queryClient.invalidateQueries({ queryKey: ["folder", state.target?.id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const drop = () => {
    const { drag, target } = state;

    if (!drag || !target) return;

    //  루트 폴더를 드래그 한 경우
    if (drag.id === null) {
      return;
    }

    // 파일 위 드롭 금지
    if (target.type === "file") {
      dispatch({ type: "RESET" });
      return;
    }

    // 자기 자신
    if (drag.id === target.id) {
      dispatch({ type: "RESET" });
      return;
    }

    // 같은 부모면 무시
    if (drag.parentId === target.id) {
      dispatch({ type: "RESET" });
      return;
    }

    // 중복 요청 방지
    if (folderMutation.isPending || fileMutation.isPending) {
      return;
    }

    if (drag.type === "folder") {
      console.log("타켓은요", target.id);
      folderMutation.mutate({
        id: drag.id,
        parentFolderId: target.id,
      });
    }

    if (drag.type === "file") {
      console.log("타켓은요", target.id);
      fileMutation.mutate({
        id: drag.id,
        folderId: target.id,
      });
    }

    dispatch({ type: "RESET" });
  };

  return (
    <DndContext.Provider value={{ state, dispatch, drop }}>
      {children}
    </DndContext.Provider>
  );
}
