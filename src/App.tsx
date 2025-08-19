import "@excalidraw/excalidraw/index.css";
import {
  Excalidraw,
  WelcomeScreen,
  useHandleLibrary,
} from "@excalidraw/excalidraw";
import React, { useEffect, useState } from "react";
import type {
  ExcalidrawImperativeAPI,
  UIOptions,
} from "@excalidraw/excalidraw/types";
import LibraryPage from "./LibraryPage";
import { Info } from "lucide-react";
import { message } from "@tauri-apps/plugin-dialog";
import {
  addLibrary,
  loadAllLocalLibraries,
  // loadLocalLibrary,
  // updateLocalLibrary,
} from "./utils/library";
import { listen, emit, type Event } from "@tauri-apps/api/event";
import { loadFile } from "./utils/file";
import type { Payload } from "./utils/types";

function App() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  // @ts-expect-error Because of apparently mismatched types
  const [eAPI, setEAPI]: [
    ExcalidrawImperativeAPI,
    React.Dispatch<ExcalidrawImperativeAPI>,
  ] = useState(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href.startsWith("https://libraries.excalidraw.com")) {
        e.preventDefault();
        setIsLibraryOpen(true);
        eAPI?.updateLibrary({
          libraryItems(currentLibraryItems) {
            return currentLibraryItems;
          },
          openLibraryMenu: false,
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [eAPI]);

  const uiOptions: UIOptions = {
    canvasActions: {
      loadScene: true,
      export: {
        // onExportToBackend(exportedElements, appState, files) {
        //   console.log(exportedElements)
        // },
        // renderCustomUI(exportedElements, appState, files, canvas) {
        //   return <>
        //     <div>Benjamin</div>
        //   </>;
        // },
      },
    },
  };

  useHandleLibrary({ excalidrawAPI: eAPI });

  useEffect(() => {
    if (eAPI) loadAllLocalLibraries(eAPI);
  }, [eAPI]);

  useEffect(() => {
    if (!eAPI) return;
    const e = listen("addLibrary", async (libPath: Event<Payload>) => {
      console.log(
        `Received a addLibrary event with payload: ${libPath.payload}`,
      );
      // await loadLocalLibrary(eAPI);
      await addLibrary(eAPI, libPath.payload);
    });
    return () => {
      (async () => {
        (await e)();
      })();
    };
  }, [eAPI]);

  useEffect(() => {
    if (!eAPI) return;
    const e = listen("openFile", (filePath: Event<Payload>) => {
      const payload = filePath.payload;
      console.log(`${payload.fileName} is being opened...`);
      loadFile(eAPI, payload.fileName);
    });
    return () => {
      (async () => {
        (await e)();
      })();
    };
  }, [eAPI]);

  useEffect(() => {
    if (eAPI) emit("appReady");
  }, [eAPI]);

  return (
    <>
      <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
        <Excalidraw
          excalidrawAPI={async (api) => {
            setEAPI(api);
          }}
          UIOptions={uiOptions}
          // onLibraryChange={(lib) => {
          //   updateLocalLibrary(lib);
          // }}
          renderTopRightUI={() => {
            return (
              <>
                <button
                  style={{
                    borderRadius: 24,
                    height: 24,
                    width: 24,
                    padding: 6,
                    border: 0,
                    outline: 0,
                  }}
                  className="bg-transparent! opacity-30 hover:opacity-100 hover:bg-gray! hover:shadow-xl transition-all duration-400"
                  onClick={() => {
                    message(
                      "Download libraries from the libraries page, then open them from the file explorer menu to automatically import them. \n\nThis helps to persist them to the disk.",
                      {
                        title: "Directions For libraries",
                        kind: "info",
                        okLabel: "I understand.",
                      },
                    );
                  }}
                >
                  <Info size={12} color="grey" />
                </button>
              </>
            );
          }}
        >
          <WelcomeScreen />
        </Excalidraw>
        <div
          className={
            (isLibraryOpen
              ? "center-item h-[100vh] inset-shadow-sm/20"
              : "top-[100vh] h-[0] left-1/2 -translate-1/2") +
            " absolute z-100 backdrop-blur-xs backdrop-grayscale-50 bg-transparent w-full m-auto mt-auto mb-auto transition-all duration-700"
          }
        >
          <LibraryPage
            setIsLibraryOpen={setIsLibraryOpen}
            isLibraryOpen={isLibraryOpen}
          />
        </div>
      </div>
    </>
  );
}

export default App;
