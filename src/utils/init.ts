import { mkdir, exists /*create*/ } from "@tauri-apps/plugin-fs";
import { path } from "@tauri-apps/api";
// import type { ExcalidrawLibType } from "./types";
import { join } from "@tauri-apps/api/path";
import {
  restoreStateCurrent,
  StateFlags,
} from "@tauri-apps/plugin-window-state";

restoreStateCurrent(StateFlags.ALL);

console.log("Initializing App...");

const appDataDirectory = await path.appDataDir();
const customLibsDirectory = await join(appDataDirectory, "libs");
await makeDirectoryIfNotExists(appDataDirectory);
await makeDirectoryIfNotExists(customLibsDirectory);

// const localLibName = "local.excalidrawlib";
// const filename = await path.join(appDataDirectory, localLibName);

// console.log(`Checking if '${localLibName}' exists...`);

// if (!(await exists(filename))) {
//   console.log(`❗\t'${localLibName}' doesn't exist. Creating it now...`);

//   const file = await create(filename);
//   const data: ExcalidrawLibType = {
//     type: "excalidrawlib",
//     version: 2,
//     source: "https://excalidraw.com",
//   };
//   const enc = new TextEncoder();
//   file.write(enc.encode(JSON.stringify(data, null, 2)));
//   file.close();
//   console.log(`✅\tCreated '${localLibName}' in '${appDataDirectory}'...`);
// } else {
//   console.log(`✅\t'${localLibName}' exists in '${appDataDirectory}'...`);
// }
console.log("✅\tInitialization Complete...!");

// makeDirectoryIfNotExists
async function makeDirectoryIfNotExists(directory: string) {
  if (!(await exists(directory))) {
    console.log(`❗\t'${directory}' doesn't exist. Creating it now...`);
    await mkdir(directory);
    console.log(`✅\tCreated '${directory}'...`);
  } else {
    console.log(`✅\t'${directory}' exists already...`);
  }
}

export { appDataDirectory, customLibsDirectory };
