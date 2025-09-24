import React, { useState, type JSX } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Grid, Settings } from "lucide-react";
import type {
  DashboardLayout,
  AppliedFilter,
  DashboardWidget,
  ClickData,
} from "./DashbiardExampleProps";
import type { RootState } from "./redux/store";
import { setLayoutForPath, setLayoutLoading } from "./redux/layoutSlice";
import { layoutStorage } from "./utils/layoutStorage";
import DashboardManager from "./components/DashboardManager";
import MatrixDisplay from "./components/MatrixDisplay";
import WidgetEditor from "./components/WidgetEditor";
import { Responsive, WidthProvider } from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

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
          id: "revenue-date-range",
          type: "date-range",
          label: "Date Range",
          field: "date",
        },
        {
          id: "region-filter",
          type: "multi-select",
          label: "Region",
          field: "region",
          options: [
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
  const dispatch = useDispatch();
  const { currentNavigationPath, layouts, isLayoutLoading } = useSelector(
    (state: RootState) => state.layout
  );
  
  const [dashboards, setDashboards] = useState<DashboardLayout[]>([
    DEFAULT_DASHBOARD,
  ]);
  const [currentDashboard, setCurrentDashboard] =
    useState<DashboardLayout>(DEFAULT_DASHBOARD);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(
    null
  );
  const [isWidgetEditorOpen, setIsWidgetEditorOpen] = useState(false);
  const [widgetFilters, setWidgetFilters] = useState<
    Record<string, AppliedFilter[]>
  >({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize IndexedDB and load layout for current navigation path
  React.useEffect(() => {
    const initializeLayout = async () => {
      try {
        dispatch(setLayoutLoading(true));
        await layoutStorage.init();
        
        // Load layout for current navigation path
        const savedLayout = await layoutStorage.getLayout(currentNavigationPath);
        if (savedLayout) {
          dispatch(setLayoutForPath({ path: currentNavigationPath, layout: savedLayout }));
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize layout storage:', error);
        setIsInitialized(true);
      } finally {
        dispatch(setLayoutLoading(false));
      }
    };

    initializeLayout();
  }, [currentNavigationPath, dispatch]);

  // Load layout when navigation path changes
  React.useEffect(() => {
    if (!isInitialized) return;

    const loadLayoutForPath = async () => {
      try {
        dispatch(setLayoutLoading(true));
        const savedLayout = await layoutStorage.getLayout(currentNavigationPath);
        if (savedLayout) {
          dispatch(setLayoutForPath({ path: currentNavigationPath, layout: savedLayout }));
        }
      } catch (error) {
        console.error('Failed to load layout for path:', currentNavigationPath, error);
      } finally {
        dispatch(setLayoutLoading(false));
      }
    };

    loadLayoutForPath();
  }, [currentNavigationPath, dispatch, isInitialized]);

  const handleItemClick = (data: ClickData): void => {
    console.log("Item clicked:", data);
    if (!isEditMode) {
      // Handle item click logic
    }
  };

  const handleEditWidget = (widgetId: string): void => {
    const widget = currentDashboard.widgets.find((w) => w.id === widgetId);
    if (widget) {
      setEditingWidget(widget);
      setIsWidgetEditorOpen(true);
    }
  };

  const handleDeleteWidget = (widgetId: string): void => {
    if (confirm("Are you sure you want to delete this widget?")) {
      const updatedDashboard = {
        ...currentDashboard,
        widgets: currentDashboard.widgets.filter((w) => w.id !== widgetId),
      };
      setCurrentDashboard(updatedDashboard);
      const newWidgetFilters = { ...widgetFilters };
      delete newWidgetFilters[widgetId];
      setWidgetFilters(newWidgetFilters);
    }
  };

  const handleSaveWidget = (updatedWidget: DashboardWidget): void => {
    const updatedDashboard = {
      ...currentDashboard,
      widgets: currentDashboard.widgets.map((w) =>
        w.id === updatedWidget.id ? updatedWidget : w
      ),
    };
    setCurrentDashboard(updatedDashboard);
  };

  const handleWidgetFiltersChange = (
    widgetId: string,
    filters: AppliedFilter[]
  ): void => {
    setWidgetFilters((prev) => ({ ...prev, [widgetId]: filters }));
  };

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

    const updatedDashboard = {
      ...currentDashboard,
      widgets: [...currentDashboard.widgets, newWidget],
    };
    setCurrentDashboard(updatedDashboard);
  };

  const handleLoadDashboard = (configText: string): void => {
    try {
      const config: DashboardLayout = JSON.parse(configText);
      setCurrentDashboard(config);
      setWidgetFilters({});
    } catch {
      alert("Invalid dashboard configuration");
    }
  };

  const onLayoutChange = (layout: ReactGridLayout.Layout[]): void => {
    // Save layout to Redux store
    dispatch(setLayoutForPath({ path: currentNavigationPath, layout }));
    
    // Save layout to IndexedDB
    layoutStorage.saveLayout(currentNavigationPath, layout).catch(error => {
      console.error('Failed to save layout to IndexedDB:', error);
    });

    const updatedWidgets = currentDashboard.widgets.map((widget) => {
      const layoutItem = layout.find((item) => item.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          position: {
            ...widget.position,
            col: layoutItem.x,
            row: layoutItem.y,
            width: layoutItem.w,
            height: layoutItem.h,
          },
        };
      }
      return widget;
    });

    setCurrentDashboard({
      ...currentDashboard,
      widgets: updatedWidgets,
    });
  };

  // Get layout from Redux store or fallback to widget positions
  const getCurrentLayout = (): ReactGridLayout.Layout[] => {
    const savedLayout = layouts[currentNavigationPath];
    if (savedLayout && savedLayout.length > 0) {
      return savedLayout;
    }
    
    // Fallback to widget positions
    return currentDashboard.widgets.map((w) => ({
      i: w.id,
      x: w.position.col,
      y: w.position.row,
      w: w.position.width,
      h: w.position.height,
    }));
  };

  const layout = getCurrentLayout();

  // Show loading state while initializing
  if (!isInitialized || isLayoutLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Grid className="w-8 h-8" />
              JSON-Driven Dashboard with Filters
            </h1>
            <p className="text-gray-600 mt-1">{currentDashboard.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              Navigation Path: {currentNavigationPath.replace('->', ' → ').replace('#', ' | Filters: ')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DashboardManager
              dashboards={dashboards}
              currentDashboard={currentDashboard}
              onDashboardChange={setCurrentDashboard}
              onSaveDashboard={setCurrentDashboard}
              onLoadDashboard={handleLoadDashboard}
              currentNavigationPath={currentNavigationPath}
              onClearLayout={() => {
                layoutStorage.deleteLayout(currentNavigationPath);
                dispatch(setLayoutForPath({ path: currentNavigationPath, layout: [] }));
              }}
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

      <div className="p-6">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          onLayoutChange={onLayoutChange}
          isDraggable={isEditMode}
          isResizable={isEditMode}
        >
          {currentDashboard.widgets.map((widget) => (
            <div key={widget.id} className="bg-white rounded-lg shadow-md">
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
                isDragging={false} // isDragging is no longer needed
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
        </ResponsiveGridLayout>
      </div>

      <WidgetEditor
        widget={editingWidget}
        isOpen={isWidgetEditorOpen}
        onClose={() => {
          setIsWidgetEditorOpen(false);
          setEditingWidget(null);
        }}
        onSave={handleSaveWidget}
      />

      {isEditMode && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <h4 className="font-semibold mb-2">Edit Mode Active</h4>
          <ul className="text-sm space-y-1">
            <li>• Drag and resize widgets as needed.</li>
            <li>• Click the edit icon to modify a widget's properties.</li>
            <li>• Use the filter icon to configure widget-specific filters.</li>
            <li>• Remove widgets by clicking the trash icon.</li>
            <li>• Layout changes are automatically saved for this navigation path.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default JsonDrivenDashboard;
