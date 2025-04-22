import {
  colors,
  fonts,
  fontSizes,
  spacing,
  breakpoints,
  shadows,
  borderRadius,
  threadStyles,
  threadColors,
} from "../config/designSystem";

const convertToFigmaTokens = () => {
  const figmaTokens = {
    global: {
      colors: {
        primary: Object.entries(colors.primary).reduce((acc, [key, value]) => {
          acc[key] = { value };
          return acc;
        }, {} as Record<string, { value: string }>),
        secondary: Object.entries(colors.secondary).reduce(
          (acc, [key, value]) => {
            acc[key] = { value };
            return acc;
          },
          {} as Record<string, { value: string }>
        ),
        accent: Object.entries(colors.accent).reduce((acc, [key, value]) => {
          acc[key] = { value };
          return acc;
        }, {} as Record<string, { value: string }>),
      },
      typography: {
        fonts: {
          heading: {
            primary: { value: fonts.heading.primary },
            secondary: { value: fonts.heading.secondary },
            tertiary: { value: fonts.heading.tertiary },
            quaternary: { value: fonts.heading.quaternary },
          },
          body: {
            primary: { value: fonts.body.primary },
            secondary: { value: fonts.body.secondary },
            tertiary: { value: fonts.body.tertiary },
            quaternary: { value: fonts.body.quaternary },
          },
        },
        fontSizes: Object.entries(fontSizes).reduce((acc, [key, value]) => {
          acc[key] = { value };
          return acc;
        }, {} as Record<string, { value: string }>),
      },
      spacing: Object.entries(spacing).reduce((acc, [key, value]) => {
        acc[key] = { value };
        return acc;
      }, {} as Record<string, { value: string }>),
      breakpoints: Object.entries(breakpoints).reduce((acc, [key, value]) => {
        acc[key] = { value };
        return acc;
      }, {} as Record<string, { value: string }>),
      shadows: Object.entries(shadows).reduce((acc, [key, value]) => {
        acc[key] = { value };
        return acc;
      }, {} as Record<string, { value: string }>),
      borderRadius: Object.entries(borderRadius).reduce((acc, [key, value]) => {
        acc[key] = { value };
        return acc;
      }, {} as Record<string, { value: string }>),
    },
    threads: {
      styles: Object.entries(threadStyles).reduce((acc, [key, value]) => {
        acc[key] = {
          fontFamily: { value: value.fontFamily },
          fontWeight: { value: value.fontWeight },
          color: { value: value.color },
        };
        return acc;
      }, {} as Record<string, any>),
      colors: Object.entries(threadColors).reduce((acc, [key, value]) => {
        acc[key] = Object.entries(value).reduce(
          (colorAcc, [colorKey, colorValue]) => {
            colorAcc[colorKey] = { value: colorValue };
            return colorAcc;
          },
          {} as Record<string, { value: string }>
        );
        return acc;
      }, {} as Record<string, any>),
    },
  };

  return figmaTokens;
};

export const generateFigmaTokens = () => {
  const tokens = convertToFigmaTokens();
  const jsonString = JSON.stringify(tokens, null, 2);

  // Create a download link
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "figma-tokens.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default generateFigmaTokens;
