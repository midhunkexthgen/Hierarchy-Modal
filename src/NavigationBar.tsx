import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  Package,
  Tag,
  Folder,
  Smartphone,
  Phone,
  Tablet,
  Headphones,
  Gamepad2,
  Video,
  Zap,
  Flag,
  Globe,
  Store,
  ShoppingCart,
  Building2,
  GraduationCap,
  Factory,
  Cloud,
  Monitor,
  Code,
  Users,
  Crown,
  Megaphone,
  Truck,
  Server,
  Search,
  TrendingUp,
  Map,
  Calendar,
  Filter,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setCurrentNavigationPath } from "./redux/layoutSlice";
import { generateNavigationPathKey } from "./utils/navigationUtils";

// Type definitions
interface Modifier {
  code: string;
  displayText: string;
}

interface DimensionItem {
  code: string;
  name: string;
  icon: string;
  modifiers?: Modifier[];
  children?: DimensionItem[];
}

interface SelectedItems {
  [level: number]: string;
}

interface ModifierValues {
  [level: number]: {
    [modifierCode: string]:
      | string
      | number
      | { startDate: string; endDate: string };
  };
}

interface DimensionProps {
  data?: DimensionItem[];
}

// Date Range Filter Component
const DateRangeFilter: React.FC<{
  onDateChange: (startDate: string, endDate: string) => void;
  startDate?: string;
  endDate?: string;
}> = ({ onDateChange, startDate = "", endDate = "" }) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  const handleStartDateChange = (date: string) => {
    setLocalStartDate(date);
    onDateChange(date, localEndDate);
  };

  const handleEndDateChange = (date: string) => {
    setLocalEndDate(date);
    onDateChange(localStartDate, date);
  };

  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-2">
      <Calendar className="w-4 h-4 text-gray-500" />
      <input
        type="date"
        value={localStartDate}
        onChange={(e) => handleStartDateChange(e.target.value)}
        className="text-xs border-none focus:ring-0 focus:outline-none"
        placeholder="Start Date"
      />
      <span className="text-gray-400">-</span>
      <input
        type="date"
        value={localEndDate}
        onChange={(e) => handleEndDateChange(e.target.value)}
        className="text-xs border-none focus:ring-0 focus:outline-none"
        placeholder="End Date"
      />
    </div>
  );
};

// Generic Filter Component
const GenericFilter: React.FC<{
  modifier: Modifier;
  onFilterChange: (value: string) => void;
  value?: string;
}> = ({ modifier, onFilterChange, value = "" }) => {
  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-2">
      <Filter className="w-4 h-4 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder={modifier.displayText}
        className="text-xs border-none focus:ring-0 focus:outline-none w-24"
      />
    </div>
  );
};

const NavigationBar: React.FC<DimensionProps> = ({ data: propData }) => {
  const dispatch = useDispatch();
  const defaultData: DimensionItem[] = [
    {
      code: "APPLE",
      name: "Apple Inc.",
      icon: "apple",
      modifiers: [
        { code: "DATE_RANGE", displayText: "Date Range" },
        { code: "REVENUE_TYPE", displayText: "Revenue Type" },
      ],
      children: [
        {
          code: "APPLE_USA",
          name: "United States",
          icon: "flag-us",
          modifiers: [
            { code: "DATE_RANGE", displayText: "Period" },
            { code: "SEGMENT", displayText: "Business Segment" },
          ],
          children: [
            {
              code: "APPLE_USA_RETAIL",
              name: "Apple Stores",
              icon: "store",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Sales Period" },
                { code: "STORE_TYPE", displayText: "Store Type" },
              ],
            },
            {
              code: "APPLE_USA_ONLINE",
              name: "Online Sales",
              icon: "shopping-cart",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Sales Period" },
                { code: "CHANNEL", displayText: "Sales Channel" },
              ],
            },
            {
              code: "APPLE_USA_ENTERPRISE",
              name: "Enterprise Solutions",
              icon: "building-2",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Contract Period" },
              ],
            },
            {
              code: "APPLE_USA_EDUCATION",
              name: "Education Services",
              icon: "graduation-cap",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Academic Year" },
                { code: "INSTITUTION_TYPE", displayText: "Institution" },
              ],
            },
          ],
        },
        {
          code: "APPLE_CHINA",
          name: "China",
          icon: "flag-cn",
          modifiers: [
            { code: "DATE_RANGE", displayText: "Period" },
            { code: "REGION", displayText: "Chinese Region" },
          ],
          children: [
            {
              code: "APPLE_CHINA_RETAIL",
              name: "Apple Stores China",
              icon: "store",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "APPLE_CHINA_MANUFACTURING",
              name: "Manufacturing Partners",
              icon: "factory",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Production Period" },
                { code: "PARTNER", displayText: "Manufacturing Partner" },
              ],
            },
            {
              code: "APPLE_CHINA_ONLINE",
              name: "Tmall & Online",
              icon: "shopping-cart",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
          ],
        },
        {
          code: "APPLE_EUROPE",
          name: "Europe",
          icon: "flag-eu",
          modifiers: [
            { code: "DATE_RANGE", displayText: "Period" },
            { code: "COUNTRY", displayText: "European Country" },
          ],
          children: [
            {
              code: "APPLE_EUROPE_RETAIL",
              name: "European Stores",
              icon: "store",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "APPLE_EUROPE_ENTERPRISE",
              name: "B2B Solutions",
              icon: "building-2",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Contract Period" },
              ],
            },
            {
              code: "APPLE_EUROPE_SERVICES",
              name: "Digital Services",
              icon: "cloud",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
              ],
            },
          ],
        },
        {
          code: "APPLE_JAPAN",
          name: "Japan",
          icon: "flag-jp",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "APPLE_JAPAN_RETAIL",
              name: "Apple Store Japan",
              icon: "store",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "APPLE_JAPAN_CARRIER",
              name: "Carrier Partnerships",
              icon: "phone",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Partnership Period" },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "MICROSOFT",
      name: "Microsoft Corporation",
      icon: "microsoft",
      modifiers: [
        { code: "DATE_RANGE", displayText: "Date Range" },
        { code: "PRODUCT_LINE", displayText: "Product Line" },
      ],
      children: [
        {
          code: "MICROSOFT_USA",
          name: "United States",
          icon: "flag-us",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "MICROSOFT_USA_CLOUD",
              name: "Azure Cloud Services",
              icon: "cloud",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
                { code: "SERVICE_TIER", displayText: "Service Tier" },
              ],
            },
            {
              code: "MICROSOFT_USA_SOFTWARE",
              name: "Software Licensing",
              icon: "package",
              modifiers: [
                { code: "DATE_RANGE", displayText: "License Period" },
              ],
            },
            {
              code: "MICROSOFT_USA_GAMING",
              name: "Xbox Gaming",
              icon: "gamepad-2",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Gaming Period" },
                { code: "PLATFORM", displayText: "Gaming Platform" },
              ],
            },
            {
              code: "MICROSOFT_USA_HARDWARE",
              name: "Surface Devices",
              icon: "tablet",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
          ],
        },
        {
          code: "MICROSOFT_INDIA",
          name: "India",
          icon: "flag-in",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "MICROSOFT_INDIA_SERVICES",
              name: "IT Services",
              icon: "monitor",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
              ],
            },
            {
              code: "MICROSOFT_INDIA_SUPPORT",
              name: "Customer Support",
              icon: "headphones",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Support Period" },
              ],
            },
            {
              code: "MICROSOFT_INDIA_DEVELOPMENT",
              name: "R&D Centers",
              icon: "code",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Development Period" },
              ],
            },
          ],
        },
        {
          code: "MICROSOFT_GERMANY",
          name: "Germany",
          icon: "flag-de",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "MICROSOFT_GERMANY_ENTERPRISE",
              name: "Enterprise Sales",
              icon: "building-2",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "MICROSOFT_GERMANY_CONSULTING",
              name: "Consulting Services",
              icon: "users",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Consulting Period" },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "AMAZON",
      name: "Amazon Inc.",
      icon: "amazon",
      modifiers: [
        { code: "DATE_RANGE", displayText: "Date Range" },
        { code: "BUSINESS_UNIT", displayText: "Business Unit" },
      ],
      children: [
        {
          code: "AMAZON_USA",
          name: "United States",
          icon: "flag-us",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "AMAZON_USA_ECOMMERCE",
              name: "E-commerce Platform",
              icon: "shopping-cart",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Sales Period" },
                { code: "CATEGORY", displayText: "Product Category" },
              ],
            },
            {
              code: "AMAZON_USA_AWS",
              name: "Amazon Web Services",
              icon: "cloud",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
                { code: "SERVICE_TYPE", displayText: "AWS Service" },
              ],
            },
            {
              code: "AMAZON_USA_PRIME",
              name: "Prime Membership",
              icon: "crown",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Membership Period" },
              ],
            },
            {
              code: "AMAZON_USA_ADVERTISING",
              name: "Advertising Services",
              icon: "megaphone",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Campaign Period" },
              ],
            },
            {
              code: "AMAZON_USA_LOGISTICS",
              name: "Fulfillment Centers",
              icon: "truck",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Fulfillment Period" },
              ],
            },
          ],
        },
        {
          code: "AMAZON_UK",
          name: "United Kingdom",
          icon: "flag-gb",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "AMAZON_UK_RETAIL",
              name: "Amazon.co.uk",
              icon: "shopping-cart",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "AMAZON_UK_AWS",
              name: "AWS Europe",
              icon: "cloud",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
              ],
            },
            {
              code: "AMAZON_UK_FRESH",
              name: "Amazon Fresh",
              icon: "apple",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Delivery Period" },
              ],
            },
          ],
        },
        {
          code: "AMAZON_BRAZIL",
          name: "Brazil",
          icon: "flag-br",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "AMAZON_BRAZIL_MARKETPLACE",
              name: "Brazilian Marketplace",
              icon: "store",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "AMAZON_BRAZIL_LOGISTICS",
              name: "Local Delivery",
              icon: "truck",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Delivery Period" },
              ],
            },
          ],
        },
        {
          code: "AMAZON_AUSTRALIA",
          name: "Australia",
          icon: "flag-au",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "AMAZON_AUSTRALIA_RETAIL",
              name: "Amazon.com.au",
              icon: "shopping-cart",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "AMAZON_AUSTRALIA_AWS",
              name: "AWS Australia",
              icon: "server",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "GOOGLE",
      name: "Google (Alphabet)",
      icon: "google",
      modifiers: [
        { code: "DATE_RANGE", displayText: "Date Range" },
        { code: "REVENUE_STREAM", displayText: "Revenue Stream" },
      ],
      children: [
        {
          code: "GOOGLE_USA",
          name: "United States",
          icon: "flag-us",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "GOOGLE_USA_SEARCH",
              name: "Search & Ads",
              icon: "search",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Ad Period" },
                { code: "AD_TYPE", displayText: "Advertisement Type" },
              ],
            },
            {
              code: "GOOGLE_USA_CLOUD",
              name: "Google Cloud Platform",
              icon: "cloud",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
              ],
            },
            {
              code: "GOOGLE_USA_YOUTUBE",
              name: "YouTube Revenue",
              icon: "video",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Content Period" },
                { code: "CONTENT_TYPE", displayText: "Content Type" },
              ],
            },
            {
              code: "GOOGLE_USA_HARDWARE",
              name: "Pixel & Nest",
              icon: "smartphone",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
          ],
        },
        {
          code: "GOOGLE_IRELAND",
          name: "Ireland",
          icon: "flag-ie",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "GOOGLE_IRELAND_EMEA",
              name: "EMEA Operations",
              icon: "globe",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Operations Period" },
              ],
            },
            {
              code: "GOOGLE_IRELAND_SALES",
              name: "International Sales",
              icon: "trending-up",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
          ],
        },
        {
          code: "GOOGLE_SINGAPORE",
          name: "Singapore",
          icon: "flag-sg",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "GOOGLE_SINGAPORE_APAC",
              name: "APAC Hub",
              icon: "map",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Regional Period" },
              ],
            },
            {
              code: "GOOGLE_SINGAPORE_CLOUD",
              name: "GCP Asia",
              icon: "server",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
              ],
            },
          ],
        },
      ],
    },
  ];

  const data = propData || defaultData;
  // State to manage the navigation path and selected items at each level
  const [navigationPath, setNavigationPath] = useState<DimensionItem[]>([]);

  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [modifierValues, setModifierValues] = useState<ModifierValues>({});

  // Update navigation path in Redux when it changes
  useEffect(() => {
    const pathKey = generateNavigationPathKey(navigationPath, modifierValues);
    dispatch(setCurrentNavigationPath(pathKey));
  }, [navigationPath, modifierValues, dispatch]);
  // const navigationPath = useSelector(
  //   (state: RootState) => state.navigationPath?.navigationPath || []
  // );
  // Function to get appropriate icon based on icon name or level
  const getIcon = (level: number, iconName?: string): React.ReactNode => {
    // If iconName is provided, use specific icons
    if (iconName) {
      const iconMap: { [key: string]: React.ReactNode } = {
        // Brand icons
        apple: <Zap className="w-5 h-5" />,
        microsoft: <Zap className="w-5 h-5" />,
        amazon: <Zap className="w-5 h-5" />,
        google: <Zap className="w-5 h-5" />,

        // Country/Flag icons (using Flag as generic)
        "flag-us": <Flag className="w-5 h-5" />,
        "flag-cn": <Flag className="w-5 h-5" />,
        "flag-eu": <Flag className="w-5 h-5" />,
        "flag-jp": <Flag className="w-5 h-5" />,
        "flag-in": <Flag className="w-5 h-5" />,
        "flag-de": <Flag className="w-5 h-5" />,
        "flag-gb": <Flag className="w-5 h-5" />,
        "flag-br": <Flag className="w-5 h-5" />,
        "flag-au": <Flag className="w-5 h-5" />,
        "flag-ie": <Flag className="w-5 h-5" />,
        "flag-sg": <Flag className="w-5 h-5" />,

        // Revenue Center icons
        store: <Store className="w-4 h-4" />,
        "shopping-cart": <ShoppingCart className="w-4 h-4" />,
        "building-2": <Building2 className="w-4 h-4" />,
        "graduation-cap": <GraduationCap className="w-4 h-4" />,
        factory: <Factory className="w-4 h-4" />,
        cloud: <Cloud className="w-4 h-4" />,
        monitor: <Monitor className="w-4 h-4" />,
        headphones: <Headphones className="w-4 h-4" />,
        code: <Code className="w-4 h-4" />,
        users: <Users className="w-4 h-4" />,
        package: <Package className="w-4 h-4" />,
        "gamepad-2": <Gamepad2 className="w-4 h-4" />,
        tablet: <Tablet className="w-4 h-4" />,
        crown: <Crown className="w-4 h-4" />,
        megaphone: <Megaphone className="w-4 h-4" />,
        truck: <Truck className="w-4 h-4" />,
        server: <Server className="w-4 h-4" />,
        search: <Search className="w-4 h-4" />,
        video: <Video className="w-4 h-4" />,
        smartphone: <Smartphone className="w-4 h-4" />,
        globe: <Globe className="w-4 h-4" />,
        "trending-up": <TrendingUp className="w-4 h-4" />,
        map: <Map className="w-4 h-4" />,
        phone: <Phone className="w-4 h-4" />,
      };

      return iconMap[iconName] || <Package className="w-5 h-5" />;
    }

    // Fallback to level-based icons
    switch (level) {
      case 0:
        return <Package className="w-5 h-5" />; // Brands
      case 1:
        return <Tag className="w-5 h-5" />; // Categories
      case 2:
        return <Folder className="w-5 h-5" />; // Sub Categories
      default:
        return <Folder className="w-4 h-4" />;
    }
  };

  // Handle item selection at any level
  const handleItemSelect = (item: DimensionItem, level: number): void => {
    const newPath = navigationPath.slice(0, level + 1);
    newPath[level] = item;
    setNavigationPath(newPath);

    const newSelectedItems: SelectedItems = { ...selectedItems };
    newSelectedItems[level] = item.code;

    // Clear selections for deeper levels
    for (let i = level + 1; i < 10; i++) {
      delete newSelectedItems[i];
    }
    setSelectedItems(newSelectedItems);

    // Clear modifier values for deeper levels
    const newModifierValues: ModifierValues = { ...modifierValues };
    for (let i = level + 1; i < 10; i++) {
      delete newModifierValues[i];
    }
    setModifierValues(newModifierValues);

    // Update navigation path in Redux
    const pathKey = generateNavigationPathKey(newPath, modifierValues);
    dispatch(setCurrentNavigationPath(pathKey));
  };

  // Handle modifier value changes
  const handleModifierChange = (
    level: number,
    modifierCode: string,
    value: string | number | { startDate: string; endDate: string }
  ): void => {
    setModifierValues((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        [modifierCode]: value,
      },
    }));
  };

  // Clear modifier value
  const clearModifier = (level: number, modifierCode: string): void => {
    setModifierValues((prev) => {
      const newValues = { ...prev };
      if (newValues[level]) {
        delete newValues[level][modifierCode];
        if (Object.keys(newValues[level]).length === 0) {
          delete newValues[level];
        }
      }
      return newValues;
    });
  };

  // Render modifier component based on code
  const renderModifier = (
    modifier: Modifier,
    level: number
  ): React.ReactNode => {
    const currentValue = modifierValues[level]?.[modifier.code];

    switch (modifier.code) {
      case "DATE_RANGE":
        return (
          <DateRangeFilter
            key={modifier.code}
            onDateChange={(startDate, endDate) =>
              handleModifierChange(level, modifier.code, { startDate, endDate })
            }
            startDate={currentValue?.startDate || ""}
            endDate={currentValue?.endDate || ""}
          />
        );
      default:
        return (
          <GenericFilter
            key={modifier.code}
            modifier={modifier}
            onFilterChange={(value) =>
              handleModifierChange(level, modifier.code, value)
            }
            value={currentValue || ""}
          />
        );
    }
  };

  // Get items to display at a specific level
  const getItemsForLevel = (level: number): DimensionItem[] => {
    if (level === 0) {
      return data;
    }

    const parentItem = navigationPath[level - 1];
    return parentItem?.children || [];
  };

  // Get current selected item for a level
  const getCurrentItem = (level: number): DimensionItem | null => {
    if (level === 0) {
      return data.find((item) => item.code === selectedItems[level]) || null;
    }

    const items = getItemsForLevel(level);
    return items.find((item) => item.code === selectedItems[level]) || null;
  };

  // Render a navigation bar for a specific level
  const renderNavigationBar = (level: number): React.ReactNode => {
    const items = getItemsForLevel(level);
    const currentItem = getCurrentItem(level);

    if (items.length === 0) return null;

    const isTopLevel = level === 0;

    return (
      <div key={level} className="w-full border-b">
        {/* Main navigation row */}
        <div className={`w-full ${isTopLevel ? "bg-blue-600" : "bg-gray-100"}`}>
          <div className="flex items-center overflow-x-auto">
            {items.map((item: DimensionItem) => {
              const isSelected = selectedItems[level] === item.code;

              return (
                <button
                  key={item.code}
                  onClick={() => handleItemSelect(item, level)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 whitespace-nowrap transition-colors
                    ${
                      isTopLevel
                        ? isSelected
                          ? "bg-blue-700 text-white"
                          : "text-blue-100 hover:bg-blue-500 hover:text-white"
                        : isSelected
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {getIcon(level, item.icon)}
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.children && item.children.length > 0 && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modifiers row */}
        {currentItem &&
          currentItem.modifiers &&
          currentItem.modifiers.length > 0 && (
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
              <div className="flex items-center space-x-3 overflow-x-auto">
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                  Filters:
                </span>
                {currentItem.modifiers.map((modifier) => (
                  <div
                    key={modifier.code}
                    className="flex items-center space-x-1"
                  >
                    {renderModifier(modifier, level)}
                    {modifierValues[level]?.[modifier.code] && (
                      <button
                        onClick={() => clearModifier(level, modifier.code)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="Clear filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  };

  // Determine how many levels to render
  const maxLevel = Math.min(navigationPath.length + 1, 5); // Limit to 5 levels for practical reasons

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex flex-col">
        {Array.from({ length: maxLevel }, (_, index) =>
          renderNavigationBar(index)
        )}
      </div>

      {/* Display current selection path */}
      {navigationPath.length > 0 && (
        <div className="p-4 bg-gray-50 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Current Selection:
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {navigationPath.map((item: DimensionItem, index: number) => (
              <div key={item.code} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
                )}
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Navigation codes: {Object.values(selectedItems).join(" → ")}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Full path key:{" "}
            <code className="bg-gray-100 px-1 rounded">
              {generateNavigationPathKey(navigationPath, modifierValues)}
            </code>
          </div>

          {/* Display active modifiers */}
          {Object.keys(modifierValues).length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Active Filters:
              </h4>
              <div className="space-y-2">
                {Object.entries(modifierValues).map(
                  ([levelStr, levelModifiers]) => {
                    const level = parseInt(levelStr);
                    const levelItem =
                      level < navigationPath.length
                        ? navigationPath[level]
                        : null;

                    return (
                      <div key={level} className="text-xs">
                        <span className="font-medium text-gray-600">
                          {levelItem ? levelItem.name : `Level ${level}`}:
                        </span>
                        <div className="ml-2 mt-1 space-y-1">
                          {Object.entries(levelModifiers).map(
                            ([modifierCode, value]) => (
                              <div
                                key={modifierCode}
                                className="flex items-center space-x-2"
                              >
                                <span className="text-gray-500">
                                  {modifierCode}:
                                </span>
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
                                  {value &&
                                  typeof value === "object" &&
                                  "startDate" in value &&
                                  "endDate" in value
                                    ? `${
                                        (
                                          value as {
                                            startDate: string;
                                            endDate: string;
                                          }
                                        ).startDate
                                      } to ${
                                        (
                                          value as {
                                            startDate: string;
                                            endDate: string;
                                          }
                                        ).endDate
                                      }`
                                    : value && typeof value === "object"
                                    ? JSON.stringify(value)
                                    : typeof value === "string" ||
                                      typeof value === "number"
                                    ? value
                                    : ""}
                                </span>
                                <button
                                  onClick={() =>
                                    clearModifier(level, modifierCode)
                                  }
                                  className="text-gray-400 hover:text-red-500"
                                  title="Remove filter"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
