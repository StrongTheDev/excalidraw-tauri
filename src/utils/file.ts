import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { ExcalidrawFileType } from "./types";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { confirm } from "@tauri-apps/plugin-dialog";

export async function loadFile(api: ExcalidrawImperativeAPI, payload: string) {
  const content = await readTextFile(payload);
  const file = JSON.parse(content) as ExcalidrawFileType;

  const old_elements = api.getSceneElements();
  if (!(old_elements.length === 0)) {
    const response = await confirm(
      "Are you sure you want to load a new file?\nThis will discard your current drawing.",
      {
        title: "Load File",
        kind: "warning",
        okLabel: "Load",
        cancelLabel: "Cancel",
      },
    );
    if (!response) return;
  }
  api.updateScene({
    appState: file.appState,
    elements: file.elements,
  });
}
