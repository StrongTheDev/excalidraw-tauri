// /* eslint-disable @typescript-eslint/no-unused-vars */
import { mergeLibraryItems } from "@excalidraw/excalidraw";
import type {
  // LibraryItems,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types";
import {
  readTextFile,
  BaseDirectory,
  writeTextFile,
  readDir,
  type ReadFileOptions,
} from "@tauri-apps/plugin-fs";
import { join, sep } from "@tauri-apps/api/path";
import type { ExcalidrawLibType, Payload } from "./types";
import { customLibsDirectory } from "./init";
const log = console.log;

const localLibName = "local.excalidrawlib";
// - get local lib

export async function readLibFile(
  libFile?: string,
  {
    options,
    useDefaultOptions,
  }: { options?: ReadFileOptions; useDefaultOptions?: boolean } = {
    useDefaultOptions: true,
  },
) {
  if (useDefaultOptions) {
    options = {
      baseDir: BaseDirectory.AppData,
    };
  }
  // eslint-disable-next-line prefer-const
  let contents = await readTextFile(libFile ?? localLibName, options);
  log(`Contents loaded`);
  const lib = JSON.parse(contents) as ExcalidrawLibType;
  return lib;
}

// update
// export async function updateLocalLibrary(
//   items: LibraryItems,
//   mergeOld: boolean = false,
// ) {
//   log("updateLocalLibrary");
//   const lib: ExcalidrawLibType = await readLibFile();
//   // - update elements
//   const old = mergeOld ? lib.libraryItems : [];
//   lib.libraryItems = mergeLibraryItems(old ?? [], items);
//   // - save local lib
//   const newLib = JSON.stringify(lib, null, 2);
//   await writeTextFile(localLibName, newLib, {
//     baseDir: BaseDirectory.AppData,
//     append: false,
//   });
//   // localLib.close();
// }

// export async function loadLocalLibrary(api: ExcalidrawImperativeAPI) {
//   if (!api) return;
//   log("loadLocalLibrary");
//   const lib: ExcalidrawLibType = await readLibFile();
//   api.updateLibrary({
//     libraryItems(currentLibraryItems) {
//       const items = mergeLibraryItems(
//         currentLibraryItems,
//         lib.libraryItems ?? [],
//       );
//       updateLocalLibrary(items, true);
//       return items;
//     },
//     merge: true,
//     openLibraryMenu: false,
//   });
// }

export async function addLibrary(
  api: ExcalidrawImperativeAPI,
  payload: Payload,
) {
  if (!api) return;
  log("addLibrary");
  log(`Importing ${payload.fileName}`);
  const fileName = payload.fileName.slice(
    payload.fileName.lastIndexOf(sep()) + 1,
  );
  await writeTextFile(`libs/${fileName}`, payload.content, {
    baseDir: BaseDirectory.AppData,
    append: false,
  });

  log(`Imported ${payload.fileName} to ${customLibsDirectory}`);

  // const lib: ExcalidrawLibType = await readLibFile(payload.fileName, {
  //   useDefaultOptions: false,
  // });
  loadAllLocalLibraries(api);
}

export async function loadAllLocalLibraries(api: ExcalidrawImperativeAPI) {
  // api.updateLibrary({ libraryItems: [] });
  const entries = await readDir(customLibsDirectory);
  for (const entry of entries) {
    log(entry);
    const path = await join("libs", entry.name);
    const lib: ExcalidrawLibType = await readLibFile(path);
    api.updateLibrary({
      libraryItems(currentLibraryItems) {
        const items = mergeLibraryItems(
          currentLibraryItems,
          lib.libraryItems ?? [],
        );
        return items;
      },
      merge: true,
      openLibraryMenu: false,
    });
  }
}
