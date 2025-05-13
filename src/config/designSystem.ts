import { theme as chakraTheme } from "@chakra-ui/react";

export const colors = {
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  secondary: {
    50: "#ffffff",
    100: "#f8fafc",
    200: "#f1f5f9",
    300: "#e2e8f0",
    400: "#cbd5e1",
    500: "#94a3b8",
    600: "#64748b",
    700: "#475569",
    800: "#334155",
    900: "#1e293b",
  },
  accent: {
    orange: "#f97316",
    blue: "#3b82f6",
    gray: "#6b7280",
  },
};

export const fonts = {
  heading: {
    primary: "'Roboto', sans-serif",
    secondary: "'Roboto', sans-serif",
    tertiary: "'Roboto', sans-serif",
    quaternary: "'Roboto', sans-serif",
  },
  body: {
    primary: "'Roboto', sans-serif",
    secondary: "'Roboto', sans-serif",
    tertiary: "'Roboto', sans-serif",
    quaternary: "'Roboto', sans-serif",
  },
};

export const fontSizes = {
  xs: "0.875rem",
  sm: "1rem",
  md: "1.125rem",
  lg: "1.25rem",
  xl: "1.5rem",
  "2xl": "1.875rem",
  "3xl": "2.25rem",
  "4xl": "3rem",
};

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
};

export const breakpoints = {
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
};

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  none: "none",
};

export const borderRadius = {
  none: "0",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
};

export const threadColors: Record<string, ThreadColors> = {
  thread1: {
    bg: "#f1f5f9",
    userBg: "#334155",
    assistantBg: "#e2e8f0",
    thirdBg: "#64748b",
    borderColor: "#cbd5e1",
    buttonColor: "gray.600",
    textColor: "#1e293b",
  },
  thread2: {
    bg: "#fff7ed",
    userBg: "#f97316",
    assistantBg: "#ffedd5",
    thirdBg: "#fdba74",
    borderColor: "#fed7aa",
    buttonColor: "orange",
    textColor: "#f97316",
  },
  thread3: {
    bg: colors.primary[50],
    userBg: colors.primary[600],
    assistantBg: colors.primary[100],
    assistantBgLiked: "green.100",
    assistantBgDisliked: "red.100",
    thirdBg: colors.primary[300],
    borderColor: colors.primary[200],
    buttonColor: "green",
    textColor: colors.primary[700],
  },
  thread4: {
    bg: "#f0fdf4",
    userBg: "#166534",
    assistantBg: "#dcfce7",
    thirdBg: "#86efac",
    borderColor: "#bbf7d0",
    buttonColor: "green.600",
    textColor: "#166534",
  },
};

export const threadStyles: Record<string, any> = {
  thread1: {
    fontFamily: fonts.body.primary,
  },
  thread2: {
    fontFamily: fonts.body.primary,
  },
  thread3: {
    fontFamily: fonts.body.primary,
  },
  thread4: {
    fontFamily: fonts.body.primary,
  },
};

interface ThreadColors {
  bg: string;
  userBg: string;
  assistantBg: string;
  assistantBgLiked?: string;
  assistantBgDisliked?: string;
  thirdBg: string;
  borderColor: string;
  buttonColor: string;
  textColor?: string;
}

export const theme = {
  ...chakraTheme,
  colors,
  fonts,
  fontSizes,
  spacing,
  breakpoints,
  shadows,
  borderRadius,
  threadStyles,
  threadColors,
  components: {
    Input: {
      baseStyle: {
        field: {
          _focus: {
            boxShadow: "none",
            borderColor: "blue.400",
          },
          _hover: {
            borderColor: "blue.300",
          },
          _disabled: {
            opacity: 0.7,
            cursor: "not-allowed",
          },
          _placeholder: {
            color: "gray.400",
            fontFamily: fonts.body.primary,
          },
          px: 4,
          py: 2,
          fontFamily: fonts.body.primary,
        },
      },
      variants: {
        outline: {
          field: {
            borderWidth: "1px",
            borderColor: "gray.200",
            _focus: {
              borderColor: "blue.400",
              boxShadow: "none",
            },
          },
        },
        thread2: {
          field: {
            _placeholder: {
              fontFamily: fonts.body.primary,
            },
          },
        },
        thread3: {
          field: {
            _placeholder: {
              fontFamily: fonts.body.primary,
            },
          },
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          _focus: {
            boxShadow: "none",
            borderColor: "blue.400",
          },
          _hover: {
            borderColor: "blue.300",
          },
          fontFamily: fonts.body.primary,
        },
        iconWrapper: {
          display: "none",
        },
        icon: {
          display: "none",
        },
      },
    },
    Button: {
      baseStyle: {
        fontFamily: fonts.body.primary,
      },
    },
    Text: {
      baseStyle: {
        fontFamily: fonts.body.primary,
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: fonts.heading.primary,
        fontWeight: 300,
      },
    },
    Switch: {
      baseStyle: {
        track: {
          _checked: {
            bg: "blue.500",
          },
        },
      },
    },
  },
};
