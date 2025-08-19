import { X } from "lucide-react";
import "./index.css";

function LibraryPage(props: {
  isLibraryOpen: boolean;
  setIsLibraryOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isLibraryOpen, setIsLibraryOpen } = props;

  return (
    <div
      className={
        (props.isLibraryOpen ? "h-full" : "h-[0]") + " w-full overflow-hidden"
      }
    >
      {/* Backdrop */}
      <div
        className={
          "absolute top-[0] bottom-[0] left-[0] right-[0] inset-[0] z-40 w-full " +
          (isLibraryOpen ? "h-full" : "h-[0]")
        }
        onClick={() => setIsLibraryOpen(false)}
      />

      {/* Bottom Sheet */}
      <div
        className={
          (isLibraryOpen ? "h-[90vh]" : "h-[0]") +
          " absolute top-[10vh] left-[0] right-[0] bg-[#fff] rounded-t-[32px] shadow-lg/30 z-50 w-full max-w-[calc(100vw-64px)] m-auto flex flex-col"
        }
      >
        {/* Header */}
        <div
          className={
            (isLibraryOpen ? "" : "hidden") +
            " flex items-center justify-between p-4 border-b border-gray-200 px-[16px]"
          }
        >
          <h2 className="text-lg font-semibold text-gray-900 select-none">
            Excalidraw Libraries
          </h2>
          <button
            onClick={() => setIsLibraryOpen(false)}
            className="p-[4px] bg-transparent hover:bg-gray-100 rounded-full transition-all duration-500"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <iframe
            id="excaLib"
            src="https://libraries.excalidraw.com"
            className="w-full h-full min-h-[400px] border-0"
            title="Excalidraw Libraries"
            sandbox="allow-scripts allow-same-origin allow-downloads allow-forms"
          />
        </div>
      </div>
    </div>
  );
}

export default LibraryPage;
