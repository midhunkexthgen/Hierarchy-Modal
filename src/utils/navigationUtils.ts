import type { Entity } from '../redux/navigationPathSlice';
import type { ModifierValues } from '../types';

// Utility functions for navigation path handling
export const generateNavigationPathKey = (navigationPath: Entity[], modifierValues?: ModifierValues): string => {
  if (!navigationPath || navigationPath.length === 0) {
    return 'default';
  }
  
  // Create base path from navigation hierarchy
  const basePath = navigationPath
    .map(item => item.code || item.name || 'unknown')
    .join('->');
  
  // Add modifier values to make path more specific if needed
  if (modifierValues && Object.keys(modifierValues).length > 0) {
    const modifierString = Object.entries(modifierValues)
      .map(([level, levelModifiers]) => {
        const modifierPairs = Object.entries(levelModifiers as Record<string, unknown>)
          .map(([key, value]) => {
            if (value && typeof value === 'object' && 'startDate' in value && 'endDate' in value) {
              return `${key}:${value.startDate}-${value.endDate}`;
            }
            return `${key}:${value}`;
          })
          .join(',');
        return `L${level}(${modifierPairs})`;
      })
      .join('|');
    
    return `${basePath}#${modifierString}`;
  }
  
  return basePath;
};

export const isValidNavigationPath = (navigationPath: Entity[]): boolean => {
  return Array.isArray(navigationPath) && navigationPath.length > 0;
}