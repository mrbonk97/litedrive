import { toast } from "sonner";
import type { StateCreator } from "zustand";
import { moveDriveItem } from "@/features/drive/api/move-drive-item.api";

export type DragItem = {
  id: string;
  type: "file" | "folder";
  parentId: string | null;
};

export type DropTarget = {
  id: string | null;
  type: "folder";
};

export interface DndSlice {
  draggedItem: DragItem | null;
  dropTarget: DropTarget | null;

  isMoving: boolean;

  dragStart: (item: DragItem) => void;
  dragEnter: (target: DropTarget) => void;
  dragLeave: () => void;
  dragEnd: () => void;
  canDrop: (target: DropTarget) => boolean;
  dropOnFolder: (target: DropTarget, onMoved?: () => void) => Promise<void>;
}

export const createDndSlice: StateCreator<DndSlice, [], [], DndSlice> = (
  set,
  get,
) => ({
  draggedItem: null,
  dropTarget: null,
  isMoving: false,

  dragStart: (item) => {
    set({
      isMoving: true,
      draggedItem: item,
      dropTarget: null,
    });
  },

  dragEnter: (target) => {
    if (!get().canDrop(target)) return;

    set({
      isMoving: true,
      dropTarget: target,
    });
  },

  dragLeave: () => {
    set({
      isMoving: true,
      dropTarget: null,
    });
  },

  dragEnd: () => {
    set({
      isMoving: false,
      draggedItem: null,
      dropTarget: null,
    });
  },

  dropOnFolder: async (target, onMoved) => {
    const { draggedItem } = get();

    if (!draggedItem || !get().canDrop(target)) {
      get().dragEnd();
      return;
    }

    set({
      dropTarget: target,
    });

    try {
      await moveDriveItem({
        id: draggedItem.id,
        type: draggedItem.type,
        targetFolderId: target.id,
      });
      toast.success(
        draggedItem.type === "file"
          ? "파일을 이동했습니다."
          : "폴더를 이동했습니다.",
      );
      onMoved?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "이동에 실패했습니다.");
    }

    set({
      draggedItem: null,
      dropTarget: null,
    });
  },

  canDrop: (target) => {
    const { draggedItem } = get();

    // draggedItem이 없을 경우 무시
    if (!draggedItem) return false;

    // 자기 자신에게 drop 방지
    if (draggedItem.id === target.id) {
      return false;
    }

    // 이미 같은 위치에 있는 경우 no-op
    if (draggedItem.parentId === target.id) return false;

    return true;
  },
});
