import { Download, Upload, RotateCcw, Bell } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { DashboardLayout } from "../DashbiardExampleProps";

const DashboardManager: React.FC<{
  currentDashboard: DashboardLayout;
  onLoadDashboard: (config: string) => void;
  currentNavigationPath: string;
  onClearLayout: () => void;
}> = ({
  currentDashboard,
  onLoadDashboard,
  currentNavigationPath,
  onClearLayout,
}) => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configText, setConfigText] = useState("");
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  const exportConfig = () => {
    const config = JSON.stringify(currentDashboard, null, 2);
    setConfigText(config);
    setIsConfigModalOpen(true);
  };

  const importConfig = () => {
    try {
      JSON.parse(configText);
      onLoadDashboard(configText);
      setIsConfigModalOpen(false);
      setConfigText("");
    } catch {
      alert("Invalid JSON configuration");
    }
  };

  const downloadConfig = () => {
    const config = JSON.stringify(currentDashboard, null, 2);
    const blob = new Blob([config], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentDashboard.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex gap-2 ">
        <select className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none bg-white border border-gray-200 rounded-lg p-2 ">
          <option>My Dashboard</option>
          <option>Analytics Dashboard</option>
          <option>Sales Dashboard</option>
        </select>
        <button
          onClick={exportConfig}
          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
          title="Export Configuration"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={downloadConfig}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
          title="Download Configuration"
        >
          <Download className="w-4 h-4" />
          JSON
        </button>

        <button
          onClick={() => {
            setConfigText("");
            setIsConfigModalOpen(true);
          }}
          className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
          title="Import Configuration"
        >
          <Upload className="w-4 h-4" />
        </button>

        <button
          onClick={onClearLayout}
          className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center gap-1"
          title="Reset Layout for Current Path"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-1 relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Configuration Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold mb-4">
              Dashboard Configuration
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Current Navigation Path:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {currentNavigationPath.replace("->", " → ")}
              </code>
            </p>

            <textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              placeholder="Paste your dashboard configuration JSON here..."
              className="flex-1 p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ minHeight: "400px" }}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsConfigModalOpen(false);
                  setConfigText("");
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {configText && (
                <button
                  onClick={importConfig}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Import
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardManager;