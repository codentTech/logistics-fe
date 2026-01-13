// utils/theme.js - Theme utility functions and configurations

/**
 * Theme Configuration System
 *
 * This file provides utilities for creating and managing themes across your application.
 * You can easily create new themes by extending the base configuration.
 */

// Base theme structure - defines the shape of all themes
export const baseThemeStructure = {
  colors: {
    primary: {},
    secondary: {},
    neutral: {},
    success: {},
    danger: {},
    warning: {},
    info: {},
  },
  typography: {
    fontFamily: {},
    fontSize: {},
  },
  spacing: {},
  borderRadius: {},
  shadows: {},
};

// Default theme configuration
export const defaultTheme = {
  name: "default",
  colors: {
    primary: {
      50: "#F0F9FF",
      100: "#E0F2FE",
      200: "#BAE6FD",
      300: "#7DD3FC",
      400: "#38BDF8",
      500: "#4F46E5",
      600: "#2563EB",
      700: "#1E40AF",
      800: "#1E3A8A",
      900: "#1E293B",
    },
    secondary: {
      50: "#ECFDF5",
      100: "#D1FAE5",
      200: "#A7F3D0",
      300: "#6EE7B7",
      400: "#34D399",
      500: "#047857",
      600: "#059669",
      700: "#047857",
      800: "#065F46",
      900: "#064E3B",
    },
    neutral: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#E5E5E5",
      300: "#D4D4D4",
      400: "#A3A3A3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
    success: {
      50: "#F0FDF4",
      100: "#DCFCE7",
      500: "#22C55E",
      600: "#16A34A",
      light: "#DEFFE4",
    },
    danger: {
      50: "#FEF2F2",
      100: "#FEE2E2",
      500: "#EF4444",
      600: "#DC2626",
      light: "#FFDEDE",
    },
    warning: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      500: "#F59E0B",
      600: "#D97706",
    },
    info: {
      50: "#EFF6FF",
      100: "#DBEAFE",
      500: "#3B82F6",
      600: "#2563EB",
    },
  },
  typography: {
    fontFamily: {
      primary: ["DM Sans", "sans-serif"],
      secondary: ["Roboto", "sans-serif"],
      mono: ["Fira Code", "monospace"],
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
    },
  },
  spacing: {
    container: {
      padding: "1rem",
      maxWidth: "1200px",
    },
    section: {
      padding: "4rem 0",
    },
  },
  borderRadius: {
    xs: "0.25rem",
    sm: "0.375rem",
    base: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    card: "1.25rem",
    button: "0.5rem",
  },
  shadows: {
    card: "0px 4px 20px rgba(0, 0, 0, 0.08)",
    modal: "0px 10px 50px rgba(0, 0, 0, 0.15)",
    button: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    form: "0px 0px 31px rgba(29, 78, 216, 0.1)",
  },
};

// Dark theme - extends default theme with dark-specific overrides
export const darkTheme = {
  ...defaultTheme,
  name: "dark",
  colors: {
    ...defaultTheme.colors,
    neutral: {
      50: "#171717",
      100: "#262626",
      200: "#404040",
      300: "#525252",
      400: "#737373",
      500: "#A3A3A3",
      600: "#D4D4D4",
      700: "#E5E5E5",
      800: "#F5F5F5",
      900: "#FAFAFA",
    },
  },
  shadows: {
    ...defaultTheme.shadows,
    card: "0px 4px 20px rgba(0, 0, 0, 0.3)",
    modal: "0px 10px 50px rgba(0, 0, 0, 0.5)",
  },
};

// Corporate theme example - professional blue-gray theme
export const corporateTheme = {
  ...defaultTheme,
  name: "corporate",
  colors: {
    ...defaultTheme.colors,
    primary: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#1E293B", // Main corporate blue-gray
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
    secondary: {
      50: "#FEFCE8",
      100: "#FEF9C3",
      200: "#FEF08A",
      300: "#FDE047",
      400: "#FACC15",
      500: "#EAB308", // Professional gold accent
      600: "#CA8A04",
      700: "#A16207",
      800: "#854D0E",
      900: "#713F12",
    },
  },
  typography: {
    ...defaultTheme.typography,
    fontFamily: {
      primary: ["Inter", "sans-serif"],
      secondary: ["Roboto", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
  },
};

// Creative theme example - vibrant and modern
export const creativeTheme = {
  ...defaultTheme,
  name: "creative",
  colors: {
    ...defaultTheme.colors,
    primary: {
      50: "#FDF2F8",
      100: "#FCE7F3",
      200: "#FBCFE8",
      300: "#F9A8D4",
      400: "#F472B6",
      500: "#EC4899", // Vibrant pink
      600: "#DB2777",
      700: "#BE185D",
      800: "#9D174D",
      900: "#831843",
    },
    secondary: {
      50: "#ECFDF5",
      100: "#D1FAE5",
      200: "#A7F3D0",
      300: "#6EE7B7",
      400: "#34D399",
      500: "#10B981", // Vibrant green
      600: "#059669",
      700: "#047857",
      800: "#065F46",
      900: "#064E3B",
    },
  },
  borderRadius: {
    ...defaultTheme.borderRadius,
    card: "2rem",
    button: "1rem",
  },
};

/**
 * Theme utility functions
 */

// Convert theme object to CSS custom properties
export const createCSSVariables = (theme) => {
  const variables = {};

  // Convert colors to CSS variables
  Object.entries(theme.colors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === "object") {
      Object.entries(colorValue).forEach(([shade, value]) => {
        variables[`--color-${colorName}-${shade}`] = value;
      });
    } else {
      variables[`--color-${colorName}`] = colorValue;
    }
  });

  // Convert typography to CSS variables
  Object.entries(theme.typography.fontFamily).forEach(([name, value]) => {
    variables[`--font-${name}`] = Array.isArray(value) ? value.join(", ") : value;
  });

  // Convert spacing to CSS variables
  Object.entries(theme.spacing).forEach(([name, value]) => {
    if (typeof value === "object") {
      Object.entries(value).forEach(([key, val]) => {
        variables[`--spacing-${name}-${key}`] = val;
      });
    } else {
      variables[`--spacing-${name}`] = value;
    }
  });

  // Convert border radius to CSS variables
  Object.entries(theme.borderRadius).forEach(([name, value]) => {
    variables[`--radius-${name}`] = value;
  });

  // Convert shadows to CSS variables
  Object.entries(theme.shadows).forEach(([name, value]) => {
    variables[`--shadow-${name}`] = value;
  });

  return variables;
};

// Convert theme to Tailwind config format
export const themeToTailwindConfig = (theme) => {
  return {
    colors: theme.colors,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    borderRadius: theme.borderRadius,
    boxShadow: theme.shadows,
  };
};

// Merge themes (useful for creating theme variants)
export const mergeThemes = (baseTheme, overrides) => {
  const mergeDeep = (target, source) => {
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== "object") {
          target[key] = {};
        }
        mergeDeep(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  };

  return mergeDeep({ ...baseTheme }, overrides);
};

// Validate theme structure
export const validateTheme = (theme) => {
  const requiredKeys = ["name", "colors", "typography", "spacing", "borderRadius", "shadows"];
  const missingKeys = requiredKeys.filter((key) => !theme[key]);

  if (missingKeys.length > 0) {
    throw new Error(`Theme is missing required keys: ${missingKeys.join(", ")}`);
  }

  // Validate color structure
  const requiredColorKeys = [
    "primary",
    "secondary",
    "neutral",
    "success",
    "danger",
    "warning",
    "info",
  ];
  const missingColorKeys = requiredColorKeys.filter((key) => !theme.colors[key]);

  if (missingColorKeys.length > 0) {
    throw new Error(`Theme colors is missing required keys: ${missingColorKeys.join(", ")}`);
  }

  return true;
};

// Theme switching utility for React applications
export const createThemeProvider = () => {
  let currentTheme = defaultTheme;
  const listeners = new Set();

  return {
    getCurrentTheme: () => currentTheme,

    setTheme: (theme) => {
      validateTheme(theme);
      currentTheme = theme;

      // Apply CSS variables to document
      const root = document.documentElement;
      const variables = createCSSVariables(theme);

      Object.entries(variables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });

      // Set theme attribute for CSS selectors
      root.setAttribute("data-theme", theme.name);

      // Notify listeners
      listeners.forEach((listener) => listener(theme));
    },

    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

// Available themes registry
export const themes = {
  default: defaultTheme,
  dark: darkTheme,
  corporate: corporateTheme,
  creative: creativeTheme,
};

// Helper to create a new theme based on an existing one
export const createThemeVariant = (baseThemeName, overrides, newName) => {
  const baseTheme = themes[baseThemeName];
  if (!baseTheme) {
    throw new Error(`Base theme "${baseThemeName}" not found`);
  }

  const newTheme = mergeThemes(baseTheme, { ...overrides, name: newName });
  validateTheme(newTheme);

  return newTheme;
};

// Generate theme from brand colors
export const generateThemeFromBrandColors = (brandColors, baseName = "custom") => {
  const { primary, secondary } = brandColors;

  // Generate color scales (simplified - you might want to use a proper color scale generator)
  const generateColorScale = (baseColor) => {
    // This is a simplified version - consider using libraries like polished or color2k
    return {
      50: lighten(baseColor, 0.4),
      100: lighten(baseColor, 0.3),
      200: lighten(baseColor, 0.2),
      300: lighten(baseColor, 0.1),
      400: lighten(baseColor, 0.05),
      500: baseColor,
      600: darken(baseColor, 0.05),
      700: darken(baseColor, 0.1),
      800: darken(baseColor, 0.2),
      900: darken(baseColor, 0.3),
    };
  };

  return mergeThemes(defaultTheme, {
    name: baseName,
    colors: {
      primary: generateColorScale(primary),
      secondary: generateColorScale(secondary),
    },
  });
};

// Utility functions for color manipulation (simplified)
const lighten = (color, amount) => {
  // Simplified color lightening - use a proper color library in production
  return color;
};

const darken = (color, amount) => {
  // Simplified color darkening - use a proper color library in production
  return color;
};

// Export all themes and utilities
export default {
  themes,
  defaultTheme,
  darkTheme,
  corporateTheme,
  creativeTheme,
  createCSSVariables,
  themeToTailwindConfig,
  mergeThemes,
  validateTheme,
  createThemeProvider,
  createThemeVariant,
  generateThemeFromBrandColors,
};
