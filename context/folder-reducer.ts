import { FileType } from "@/app/types";

export type FolderState = {
  drag: FileType | null;
  target: FileType | null;
  modalItem: FileType | null;
  modalType: "idle" | "share" | "update" | "delete";
  loading: boolean;
};

export type FolderAction =
  | { type: "DRAG_START"; file: FileType }
  | { type: "DRAG_OVER"; file: FileType }
  | { type: "DRAG_DROP"; file: FileType }
  | { type: "DRAG_END" }
  | { type: "MODAL_OPEN"; file: FileType; modalType: FolderState["modalType"] }
  | { type: "MODAL_CLOSE" };

export function folderReducer(state: FolderState, action: FolderAction): FolderState {
  switch (action.type) {
    case "DRAG_START":
      return { ...state, drag: action.file, target: null };
    case "DRAG_OVER":
      return { ...state, target: action.file };
    case "DRAG_END":
      return { ...state, drag: null, target: null };
    case "MODAL_OPEN":
      return { ...state, modalItem: action.file, modalType: action.modalType };
    case "MODAL_CLOSE":
      return { ...state, modalItem: null, modalType: "idle" };
    default:
      return state;
  }
}
