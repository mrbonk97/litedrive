import { useContext } from "react";
import { DndContext } from "@/context/dnd-provider";

export function useDnd() {
  const ctx = useContext(DndContext);
  if (!ctx) {
    throw new Error("DnDProvider 밖에서 useDnd 사용함");
  }
  return ctx;
}
