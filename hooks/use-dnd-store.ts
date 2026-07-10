import { create } from "zustand";
import { createDndSlice, DndSlice } from "@/slice/dnd.slice";

type DndStore = DndSlice;

export const useDndStore = create<DndStore>()((...args) => ({
  ...createDndSlice(...args),
}));
