interface BaseItem {
  name?: string;
  region?: string;
  category?: string;
  value?: number;
  revenue?: number;
  orders?: number;
  outcome?: "positive" | "negative";
  date?: string;
  [key: string]: any; // For custom properties
}

interface SummaryItem extends BaseItem {
  name: string;
  value: number;
  revenue: number;
  orders: number;
  percentage?: number;
}

interface DetailItem extends BaseItem {
  id: number;
  region: string;
  category: string;
  revenue: number;
  orders: number;
  avgOrder?: number;
  growth?: number;
}

interface SummaryData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue?: number;
  growthRate?: number;
  regions: SummaryItem[];
  categories: SummaryItem[];
}

interface MatrixData {
  summary: SummaryData;
  details: DetailItem[];
}

// Filter Types
interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterConfig {
  id: string;
  type:
    | "date-range"
    | "single-date"
    | "select"
    | "multi-select"
    | "text"
    | "number-range";
  label: string;
  field: string; // The field this filter applies to
  required?: boolean;
  options?: FilterOption[]; // For select/multi-select
  defaultValue?: any;
  placeholder?: string;
  min?: number; // For number-range
  max?: number; // For number-range
}

interface AppliedFilter {
  filterId: string;
  value: any;
}

interface MatrixDisplayProps {
  apiEndpoint?: string;
  displayType?: "summary" | "details";
  viewType?: "tabular" | "single-value" | "pie-chart" | "chart" | "comparison";
  additionalInfo?: {
    outcome?: boolean;
  };
  onItemClick?: (data: ClickData) => void;
  title?: string;
  refreshInterval?: number;
  customStyles?: React.CSSProperties;
  filters?: FilterConfig[];
  appliedFilters?: AppliedFilter[];
  onFiltersChange?: (filters: AppliedFilter[]) => void;
}

interface ClickData {
  item: BaseItem | SummaryItem | DetailItem;
  type: string;
  displayType: string;
  viewType: string;
}

interface TableColumn {
  key: string;
  label: string;
}

// Dashboard Configuration Types
interface DashboardWidget {
  id: string;
  title: string;
  displayType: "summary" | "details";
  viewType: "tabular" | "single-value" | "pie-chart" | "chart" | "comparison";
  position: {
    row: number;
    col: number;
    width: number;
    height: number;
  };
  apiEndpoint?: string;
  refreshInterval?: number;
  additionalInfo?: {
    outcome?: boolean;
  };
  customStyles?: React.CSSProperties;
  filters?: FilterConfig[];
}

interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  grid: {
    columns: number;
    rows: number;
    gap: number;
  };
  widgets: DashboardWidget[];
}

const applyFiltersToData = (
  data: MatrixData,
  displayType: "summary" | "details",
  appliedFilters: AppliedFilter[],
  filters: FilterConfig[]
): MatrixData => {
  if (appliedFilters.length === 0) return data;

  const filterData = (items: any[]) => {
    return items.filter((item) => {
      return appliedFilters.every((appliedFilter) => {
        const filter = filters.find((f) => f.id === appliedFilter.filterId);
        if (!filter || !appliedFilter.value) return true;

        const fieldValue = item[filter.field];
        const filterValue = appliedFilter.value;

        switch (filter.type) {
          case "date-range":
            if (!fieldValue || !filterValue.start || !filterValue.end)
              return true;
            const itemDate = new Date(fieldValue);
            const startDate = new Date(filterValue.start);
            const endDate = new Date(filterValue.end);
            return itemDate >= startDate && itemDate <= endDate;

          case "single-date":
            if (!fieldValue || !filterValue) return true;
            return (
              new Date(fieldValue).toDateString() ===
              new Date(filterValue).toDateString()
            );

          case "select":
            if (!filterValue) return true;
            return fieldValue === filterValue;

          case "multi-select":
            if (!Array.isArray(filterValue) || filterValue.length === 0)
              return true;
            return filterValue.includes(fieldValue);

          case "text":
            if (!filterValue) return true;
            return String(fieldValue)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());

          case "number-range":
            if (!filterValue.min && !filterValue.max) return true;
            const numValue = Number(fieldValue);
            const min = filterValue.min || -Infinity;
            const max = filterValue.max || Infinity;
            return numValue >= min && numValue <= max;

          default:
            return true;
        }
      });
    });
  };

  if (displayType === "summary") {
    return {
      ...data,
      summary: {
        ...data.summary,
        regions: filterData(data.summary.regions),
        categories: filterData(data.summary.categories),
      },
    };
  } else {
    return {
      ...data,
      details: filterData(data.details),
    };
  }
};

export type {
  BaseItem,
  SummaryItem,
  DetailItem,
  SummaryData,
  MatrixData,
  FilterOption,
  FilterConfig,
  AppliedFilter,
  MatrixDisplayProps,
  ClickData,
  TableColumn,
  DashboardWidget,
  DashboardLayout,
};  


