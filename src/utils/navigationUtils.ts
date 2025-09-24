// Utility functions for navigation path handling
export const generateNavigationPathKey = (navigationPath: any[]): string => {
  if (!navigationPath || navigationPath.length === 0) {
    return 'default';
  }
  
  return navigationPath
    .map(item => item.code || item.name || 'unknown')
    .join('->');
};

export const isValidNavigationPath = (navigationPath: any[]): boolean => {
  return Array.isArray(navigationPath) && navigationPath.length > 0;
};