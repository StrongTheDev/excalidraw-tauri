import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { AppState, LibraryItems } from "@excalidraw/excalidraw/types";

export type ExcalidrawLibType = {
  type: "excalidrawlib";
  version: number;
  source?: string;
  library?: Array<LibraryItems>;
  libraryItems?: LibraryItems;
};

export type ExcalidrawFileType = {
  type: "excalidraw",
  version: number,
  source?: string,
  elements: ExcalidrawElement[],
  appState?: AppState,
  files?: object
};

export type Payload = {
  fileName: string,
  content: string,
};

// export type { ExcalidrawLibType, ExcalidrawFileType };
