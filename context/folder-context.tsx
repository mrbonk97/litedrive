"use client";

import { createContext, useContext, useReducer } from "react";
import { FolderAction, folderReducer, FolderState } from "./folder-reducer";

const FolderContext = createContext<{
  state: FolderState;
  dispatch: React.Dispatch<FolderAction>;
}>({
  state: { drag: null, target: null },
  dispatch: () => {},
});

export function FolderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(folderReducer, {
    drag: null,
    target: null,
  });

  return (
    <FolderContext.Provider value={{ state, dispatch }}>
      {children}
    </FolderContext.Provider>
  );
}

export function useFolder() {
  return useContext(FolderContext);
}
