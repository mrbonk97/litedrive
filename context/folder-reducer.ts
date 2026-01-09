import { RowType } from "@/types";

export type FolderState = {
  drag: RowType | null;
  target: RowType | null;
};

export type FolderAction =
  | { type: "DRAG_START"; row: RowType }
  | { type: "DRAG_OVER"; row: RowType }
  | { type: "DRAG_END" };

export function folderReducer(
  state: FolderState,
  action: FolderAction
): FolderState {
  switch (action.type) {
    case "DRAG_START":
      return { ...state, drag: action.row, target: null };
    case "DRAG_OVER":
      return { ...state, target: action.row };
    case "DRAG_END":
      return { ...state, drag: null, target: null };
    default:
      return state;
  }
}
