import React, { useState, type JSX } from "react";
import { Plus, Grid, Settings, Filter } from "lucide-react";
import type {
  DashboardLayout,
  AppliedFilter,
  DashboardWidget,
  ClickData,
} from "./DashbiardExampleProps";
import DashboardManager from "./components/DashboardManager";
import MatrixDisplay from "./components/MatrixDisplay";
import WidgetEditor from "./components/WidgetEditor";

const DEFAULT_DASHBOARD: DashboardLayout = {
  id: "default-dashboard",
  name: "Default Dashboard",
  description: "A comprehensive view of business metrics with filtering",
  grid: {
    columns: 12,
    rows: 8,
    gap: 16,
  },
  widgets: [
    {
      id: "widget-1",
      title: "Total Revenue",
      displayType: "summary",
      viewType: "single-value",
      position: { row: 0, col: 0, width: 3, height: 2 },
      filters: [
        {
          id: "revenue-date-range",
          type: "date-range",
          label: "Date Range",
          field: "date",
          defaultValue: { start: "2024-01-01", end: "2024-12-31" },
        },
      ],
    },
    {
      id: "widget-2",
      title: "Regional Performance",
      displayType: "summary",
      viewType: "comparison",
      position: { row: 0, col: 3, width: 3, height: 2 },
      additionalInfo: { outcome: true },
      filters: [
        {
          id: "region-filter",
          type: "multi-select",
          label: "Regions",
          field: "name",
          options: [
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
          ],
        },
        {
          id: "outcome-filter",
          type: "select",
          label: "Outcome",
          field: "outcome",
          options: [
            { label: "All", value: "" },
            { label: "Positive", value: "positive" },
            { label: "Negative", value: "negative" },
          ],
        },
      ],
    },
    {
      id: "widget-3",
      title: "Market Distribution",
      displayType: "summary",
      viewType: "pie-chart",
      position: { row: 0, col: 6, width: 3, height: 4 },
      filters: [
        {
          id: "category-date",
          type: "single-date",
          label: "Date",
          field: "date",
          defaultValue: "2024-01-15",
        },
      ],
    },
    {
      id: "widget-4",
      title: "Performance Chart",
      displayType: "summary",
      viewType: "chart",
      position: { row: 0, col: 9, width: 3, height: 4 },
      filters: [
        {
          id: "revenue-range",
          type: "number-range",
          label: "Revenue Range",
          field: "revenue",
          min: 0,
          max: 1000000,
          defaultValue: { min: 100000, max: 800000 },
        },
      ],
    },
    {
      id: "widget-5",
      title: "Regional Metrics",
      displayType: "summary",
      viewType: "comparison",
      position: { row: 2, col: 0, width: 6, height: 2 },
      additionalInfo: { outcome: true },
      filters: [
        {
          id: "search-filter",
          type: "text",
          label: "Search",
          field: "name",
          placeholder: "Search by name...",
        },
      ],
    },
    {
      id: "widget-6",
      title: "Detailed Analytics",
      displayType: "details",
      viewType: "tabular",
      position: { row: 4, col: 0, width: 12, height: 4 },
      additionalInfo: { outcome: true },
      filters: [
        {
          id: "details-date-range",
          type: "date-range",
          label: "Date Range",
          field: "date",
        },
        {
          id: "details-region",
          type: "select",
          label: "Region",
          field: "region",
          options: [
            { label: "All Regions", value: "" },
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
          ],
        },
        {
          id: "details-category",
          type: "select",
          label: "Category",
          field: "category",
          options: [
            { label: "All Categories", value: "" },
            { label: "Electronics", value: "Electronics" },
            { label: "Fashion", value: "Fashion" },
          ],
        },
      ],
    },
  ],
};

const JsonDrivenDashboard: React.FC = () => {
  const [dashboards] = useState<DashboardLayout[]>([DEFAULT_DASHBOARD]);
  const [currentDashboard, setCurrentDashboard] =
    useState<DashboardLayout>(DEFAULT_DASHBOARD);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(
    null
  );
  const [isWidgetEditorOpen, setIsWidgetEditorOpen] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [widgetFilters, setWidgetFilters] = useState<
    Record<string, AppliedFilter[]>
  >({});

  // Handle item click
  const handleItemClick = (data: ClickData): void => {
    console.log("Item clicked:", data);
    if (!isEditMode) {
      alert(`Clicked on: ${JSON.stringify(data.item, null, 2)}`);
    }
  };

  // Handle widget editing
  const handleEditWidget = (widgetId: string): void => {
    const widget = currentDashboard.widgets.find((w) => w.id === widgetId);
    if (widget) {
      setEditingWidget(widget);
      setIsWidgetEditorOpen(true);
    }
  };

  // Handle widget deletion
  const handleDeleteWidget = (widgetId: string): void => {
    if (confirm("Are you sure you want to delete this widget?")) {
      const updatedDashboard = {
        ...currentDashboard,
        widgets: currentDashboard.widgets.filter((w) => w.id !== widgetId),
      };
      setCurrentDashboard(updatedDashboard);

      // Remove widget filters
      const newWidgetFilters = { ...widgetFilters };
      delete newWidgetFilters[widgetId];
      setWidgetFilters(newWidgetFilters);
    }
  };

  // Handle widget save
  const handleSaveWidget = (updatedWidget: DashboardWidget): void => {
    const updatedDashboard = {
      ...currentDashboard,
      widgets: currentDashboard.widgets.map((w) =>
        w.id === updatedWidget.id ? updatedWidget : w
      ),
    };
    setCurrentDashboard(updatedDashboard);
  };

  // Handle widget filter changes
  const handleWidgetFiltersChange = (
    widgetId: string,
    filters: AppliedFilter[]
  ): void => {
    setWidgetFilters((prev) => ({
      ...prev,
      [widgetId]: filters,
    }));
  };

  // Add new widget
  const addNewWidget = (): void => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      title: "New Widget",
      displayType: "summary",
      viewType: "single-value",
      position: { row: 0, col: 0, width: 3, height: 2 },
      additionalInfo: { outcome: true },
      filters: [],
    };

    // Find available position
    const occupiedPositions = currentDashboard.widgets.map((w) => w.position);
    let row = 0;
    let col = 0;
    let positionFound = false;

    while (!positionFound && row < currentDashboard.grid.rows) {
      while (
        col <
        currentDashboard.grid.columns - newWidget.position.width + 1
      ) {
        const isOccupied = occupiedPositions.some(
          (pos) =>
            !(
              col + newWidget.position.width <= pos.col ||
              col >= pos.col + pos.width ||
              row + newWidget.position.height <= pos.row ||
              row >= pos.row + pos.height
            )
        );

        if (!isOccupied) {
          newWidget.position.row = row;
          newWidget.position.col = col;
          positionFound = true;
          break;
        }
        col++;
      }
      if (!positionFound) {
        row++;
        col = 0;
      }
    }

    const updatedDashboard = {
      ...currentDashboard,
      widgets: [...currentDashboard.widgets, newWidget],
    };
    setCurrentDashboard(updatedDashboard);
  };

  // Handle dashboard configuration load
  const handleLoadDashboard = (configText: string): void => {
    try {
      const config: DashboardLayout = JSON.parse(configText);
      setCurrentDashboard(config);
      setWidgetFilters({}); // Reset widget filters when loading new dashboard
    } catch (error) {
      alert("Invalid dashboard configuration");
    }
  };

  // Handle drag and drop
  const handleDragStart = (widgetId: string): void => {
    setDraggedWidget(widgetId);
  };

  const handleDragEnd = (): void => {
    setDraggedWidget(null);
  };

  const handleDrop = (row: number, col: number): void => {
    if (!draggedWidget) return;

    const widget = currentDashboard.widgets.find((w) => w.id === draggedWidget);
    if (!widget) return;

    // Check if position is valid
    if (
      col + widget.position.width > currentDashboard.grid.columns ||
      row + widget.position.height > currentDashboard.grid.rows
    ) {
      return;
    }

    // Check for overlaps with other widgets
    const otherWidgets = currentDashboard.widgets.filter(
      (w) => w.id !== draggedWidget
    );
    const wouldOverlap = otherWidgets.some(
      (w) =>
        !(
          col + widget.position.width <= w.position.col ||
          col >= w.position.col + w.position.width ||
          row + widget.position.height <= w.position.row ||
          row >= w.position.row + w.position.height
        )
    );

    if (wouldOverlap) return;

    // Update widget position
    const updatedDashboard = {
      ...currentDashboard,
      widgets: currentDashboard.widgets.map((w) =>
        w.id === draggedWidget
          ? { ...w, position: { ...w.position, row, col } }
          : w
      ),
    };
    setCurrentDashboard(updatedDashboard);
  };

  // Create grid layout
  const createGridLayout = (): JSX.Element => {
    const { grid, widgets } = currentDashboard;
    const gridCells: JSX.Element[] = [];

    // Create grid cells
    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.columns; col++) {
        const isOccupied = widgets.some(
          (widget) =>
            col >= widget.position.col &&
            col < widget.position.col + widget.position.width &&
            row >= widget.position.row &&
            row < widget.position.row + widget.position.height
        );

        if (!isOccupied) {
          gridCells.push(
            <div
              key={`${row}-${col}`}
              className={`border border-gray-200 ${
                isEditMode ? "hover:bg-blue-50 cursor-pointer" : ""
              }`}
              style={{
                gridColumn: col + 1,
                gridRow: row + 1,
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (isEditMode) handleDrop(row, col);
              }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => {
                if (isEditMode && !draggedWidget) {
                  // Could add widget placement logic here
                }
              }}
            />
          );
        }
      }
    }

    return (
      <div
        className="relative"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
          gap: `${grid.gap}px`,
          height: "800px",
        }}
      >
        {gridCells}
        {widgets.map((widget) => (
          <div
            key={widget.id}
            draggable={isEditMode}
            onDragStart={() => handleDragStart(widget.id)}
            onDragEnd={handleDragEnd}
            style={{
              gridColumn: `${widget.position.col + 1} / span ${
                widget.position.width
              }`,
              gridRow: `${widget.position.row + 1} / span ${
                widget.position.height
              }`,
            }}
            className={`${isEditMode ? "cursor-move" : ""}`}
          >
            <MatrixDisplay
              widget={widget}
              displayType={widget.displayType}
              viewType={widget.viewType}
              title={widget.title}
              apiEndpoint={widget.apiEndpoint}
              refreshInterval={widget.refreshInterval}
              additionalInfo={widget.additionalInfo}
              customStyles={widget.customStyles}
              onItemClick={handleItemClick}
              isDragging={draggedWidget === widget.id}
              onEdit={handleEditWidget}
              onDelete={handleDeleteWidget}
              isEditMode={isEditMode}
              filters={widget.filters || []}
              appliedFilters={widgetFilters[widget.id] || []}
              onFiltersChange={(filters) =>
                handleWidgetFiltersChange(widget.id, filters)
              }
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Grid className="w-8 h-8" />
              JSON-Driven Dashboard with Filters
            </h1>
            <p className="text-gray-600 mt-1">{currentDashboard.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <DashboardManager
              dashboards={dashboards}
              currentDashboard={currentDashboard}
              onDashboardChange={setCurrentDashboard}
              onSaveDashboard={setCurrentDashboard}
              onLoadDashboard={handleLoadDashboard}
            />

            <div className="flex gap-2">
              <button
                onClick={addNewWidget}
                disabled={!isEditMode}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Widget
              </button>

              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1 ${
                  isEditMode
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <Settings className="w-4 h-4" />
                {isEditMode ? "Exit Edit" : "Edit Mode"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">{createGridLayout()}</div>

      {/* Widget Editor Modal */}
      <WidgetEditor
        widget={editingWidget}
        isOpen={isWidgetEditorOpen}
        onClose={() => {
          setIsWidgetEditorOpen(false);
          setEditingWidget(null);
        }}
        onSave={handleSaveWidget}
      />

      {/* Instructions */}
      {isEditMode && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <h4 className="font-semibold mb-2">Edit Mode Active</h4>
          <ul className="text-sm space-y-1">
            <li>• Drag widgets to move them</li>
            <li>• Click edit icon to modify widget</li>
            <li>• Click filter icon to configure filters</li>
            <li>• Click trash icon to delete widget</li>
            <li>• Click "Add Widget" to create new widgets</li>
            <li>• Export/Import JSON configurations with filters</li>
          </ul>
        </div>
      )}

      {/* Filter Information */}
      {!isEditMode && (
        <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg max-w-xs">
          <h4 className="font-semibold mb-2 flex items-center">
            <Filter className="w-4 h-4 mr-1" />
            Filter Guide
          </h4>
          <ul className="text-xs space-y-1">
            <li>• Click filter icon on widgets to apply filters</li>
            <li>• Date ranges, text search, and multi-select available</li>
            <li>• Filter badges show active filter count</li>
            <li>• Filters persist until manually cleared</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default JsonDrivenDashboard;
