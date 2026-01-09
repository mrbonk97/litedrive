import { describe, expect, it } from "vitest";
import { folderReducer } from "./folder-reducer";
import { RowType } from "@/types";

describe("folderReducer", () => {
  const row = { id: "1" } as RowType;

  it("sets drag on DRAG_START", () => {
    const state = { drag: null, target: null };

    const next = folderReducer(state, {
      type: "DRAG_START",
      row,
    });

    expect(next).toEqual({
      drag: row,
      target: null,
    });
  });

  it("sets target on DRAG_OVER", () => {
    const state = { drag: row, target: null };

    const next = folderReducer(state, {
      type: "DRAG_OVER",
      row,
    });

    expect(next.target).toBe(row);
    expect(next.drag).toBe(row);
  });

  it("resets state on DRAG_END", () => {
    const state = { drag: row, target: row };

    const next = folderReducer(state, {
      type: "DRAG_END",
    });

    expect(next).toEqual({
      drag: null,
      target: null,
    });
  });
});
