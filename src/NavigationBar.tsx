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

// Improved Date Range Filter Component
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
    <div className="flex items-center space-x-2 bg-slate-100 rounded-md p-2">
      <Calendar className="w-4 h-4 text-slate-500" />
      <input
        type="date"
        value={localStartDate}
        onChange={(e) => handleStartDateChange(e.target.value)}
        className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none w-32"
        placeholder="Start Date"
      />
      <span className="text-slate-400">-</span>
      <input
        type="date"
        value={localEndDate}
        onChange={(e) => handleEndDateChange(e.target.value)}
        className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none w-32"
        placeholder="End Date"
      />
    </div>
  );
};

// Improved Generic Filter Component
const GenericFilter: React.FC<{
  modifier: Modifier;
  onFilterChange: (value: string) => void;
  value?: string;
}> = ({ modifier, onFilterChange, value = "" }) => {
  return (
    <div className="flex items-center space-x-2 bg-slate-100 rounded-md p-2">
      <Filter className="w-4 h-4 text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder={modifier.displayText}
        className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none w-36"
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
  const [navigationPath, setNavigationPath] = useState<DimensionItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [modifierValues, setModifierValues] = useState<ModifierValues>({});

  useEffect(() => {
    const pathKey = generateNavigationPathKey(navigationPath, modifierValues);
    dispatch(setCurrentNavigationPath(pathKey));
  }, [navigationPath, modifierValues, dispatch]);

  const getIcon = (level: number, iconName?: string): React.ReactNode => {
    if (iconName) {
      const iconMap: { [key: string]: React.ReactNode } = {
        // Brand icons
        apple: <Zap className="w-5 h-5 text-yellow-400" />,
        microsoft: <Zap className="w-5 h-5 text-blue-400" />,
        amazon: <Zap className="w-5 h-5 text-orange-400" />,
        google: <Zap className="w-5 h-5 text-red-400" />,

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
            startDate={
              (
                currentValue as {
                  startDate: string;
                  endDate: string;
                }
              )?.startDate || ""
            }
            endDate={
              (
                currentValue as {
                  startDate: string;
                  endDate: string;
                }
              )?.endDate || ""
            }
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
            value={(currentValue as string) || ""}
          />
        );
    }
  };

  const getItemsForLevel = (level: number): DimensionItem[] => {
    if (level === 0) {
      return data;
    }

    const parentItem = navigationPath[level - 1];
    return parentItem?.children || [];
  };

  const getCurrentItem = (level: number): DimensionItem | null => {
    if (level === 0) {
      return data.find((item) => item.code === selectedItems[level]) || null;
    }

    const items = getItemsForLevel(level);
    return items.find((item) => item.code === selectedItems[level]) || null;
  };

  const renderNavigationBar = (level: number): React.ReactNode => {
    const items = getItemsForLevel(level);
    const currentItem = getCurrentItem(level);

    if (items.length === 0) return null;

    const isTopLevel = level === 0;

    return (
      <div key={level} className="w-full border-b border-slate-200">
        <div
          className={`w-full ${isTopLevel ? "bg-[#f0f8ff]" : "bg-slate-50"}`}
          // className={`w-full ${isTopLevel ? "bg-[#f0f8ff]" : "bg-slate-50"}`}
        >
          <div className="flex items-center overflow-x-auto p-2 space-x-2">
            {items.map((item: DimensionItem) => {
              const isSelected = selectedItems[level] === item.code;

              return (
                <button
                  key={item.code}
                  onClick={() => handleItemSelect(item, level)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 whitespace-nowrap transition-all duration-200 rounded-md
                    ${
                      isSelected
                        ? "bg-blue-500 text-white shadow-md"
                        : `text-slate-700 hover:bg-slate-200 ${
                            isTopLevel ? "font-semibold" : ""
                          }`
                    }
                  `}
                >
                  {getIcon(level, item.icon)}
                  <span className="text-sm">{item.name}</span>
                  {item.children && item.children.length > 0 && (
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {currentItem &&
          currentItem.modifiers &&
          currentItem.modifiers.length > 0 && (
            <div className="bg-white px-4 py-3 border-t border-slate-200">
              <div className="flex items-center space-x-4 overflow-x-auto">
                <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
                  Filters:
                </span>
                {currentItem.modifiers.map((modifier) => (
                  <div
                    key={modifier.code}
                    className="flex items-center space-x-1.5"
                  >
                    {renderModifier(modifier, level)}
                    {modifierValues[level]?.[modifier.code] && (
                      <button
                        onClick={() => clearModifier(level, modifier.code)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-100 transition-colors"
                        title="Clear filter"
                      >
                        <X className="w-3.5 h-3.5" />
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

  const maxLevel = Math.min(navigationPath.length + 1, 5);

  return (
    <div className="w-full bg-slate-50 shadow-lg rounded-xl overflow-hidden border border-slate-200 font-sans">
      <div className="flex flex-col">
        {Array.from({ length: maxLevel }, (_, index) =>
          renderNavigationBar(index)
        )}
      </div>

      {navigationPath.length > 0 && (
        <div className="p-4 bg-white border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Current Selection
          </h3>
          <div className="flex items-center flex-wrap gap-2 text-sm text-slate-700">
            {navigationPath.map((item: DimensionItem, index: number) => (
              <React.Fragment key={item.code}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
                <div className="flex items-center space-x-2 bg-slate-100 text-slate-800 px-3 py-1.5 rounded-md">
                  {getIcon(index, item.icon)}
                  <span>{item.name}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {Object.keys(modifierValues).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">
                Active Filters
              </h4>
              <div className="space-y-3">
                {Object.entries(modifierValues).map(
                  ([levelStr, levelModifiers]) => {
                    const level = parseInt(levelStr);
                    const levelItem =
                      level < navigationPath.length
                        ? navigationPath[level]
                        : null;

                    if (!levelItem) return null;

                    return (
                      <div
                        key={level}
                        className="text-sm p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="font-medium text-slate-700 mb-2">
                          {levelItem.name}
                        </div>
                        <div className="ml-2 space-y-2">
                          {Object.entries(levelModifiers).map(
                            ([modifierCode, value]) => (
                              <div
                                key={modifierCode}
                                className="flex items-center justify-between"
                              >
                                <span className="text-slate-500 text-xs uppercase font-semibold">
                                  {modifierCode.replace(/_/g, " ")}:
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
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
                                      : JSON.stringify(value)}
                                  </span>
                                  <button
                                    onClick={() =>
                                      clearModifier(level, modifierCode)
                                    }
                                    className="text-slate-400 hover:text-red-500"
                                    title="Remove filter"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
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
          <div className="mt-4 text-xs text-slate-400">
            <span className="font-semibold">Path Key:</span>{" "}
            <code className="bg-slate-100 text-slate-600 px-1.5 py-1 rounded">
              {generateNavigationPathKey(navigationPath, modifierValues)}
            </code>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
