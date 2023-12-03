import createTheme, {
  ThemeOptions as ThemeOptionsOld,
} from "@mui/material/styles/createTheme";

// Colors
const themeCustoms = {
  size: {
    menu: "256px",
  },
  color: {
    // Color Brand
    main: `#0DB4AA`,

    // Color System
    notification: "#0F62FE",
    success: "#198038",
    warning: "#FF832B",
    error: "#DA1E28",
    click: "#8A3FFC",
    gray: "#121619",

    // Define color

    // Main
    main44: "#B30017",

    // notification
    notification10: "#E6F3FF",
    notification20: "#B3D7FF",
    notification30: "#8ABEFF",

    // success
    success10: "#DEFBE6",
    success20: "#A7F0BA",
    success50: "#24A148",

    // warning

    // error
    error10: "#FFF1F0",
    error20: "#FFCCC7",
    error60: "#DA1E28",

    // click

    // gray
    gray10: "#F2F4F8",
    gray20: "#DDE1E6",
    gray30: "#C1C7CD",
    gray31: "#A2A9B0",
    gray50: "#878D96",
    gray60: "#697077",
    gray100: "#121619",

    // ===================== Background =====================
    bg: "#fff",
    bg2: "#191919",

    // ===================== Text =====================
    text: "#fff",

    // ===================== Border =====================

    // ===================== BoxShadow =====================
    boxShadow: "0px 16px 64px -11px rgba(31, 47, 70, 0.15)",
  },
  typography: {
    fontSize: 16,
    fontFamily: "Be Vietnam Pro, sans-serif",
    // Weight
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    // Size, lineHeight
    h1: {
      fontSize: 64,
      lineHeight: "72px",
    },
    h2: {
      fontSize: 48,
      lineHeight: "56px",
    },
    h3: {
      fontSize: 40,
      lineHeight: "48px",
    },
    h4: {
      fontSize: 32,
      lineHeight: "40px",
    },
    h5: {
      fontSize: 24,
      lineHeight: "32px",
    },
    h6: {
      fontSize: 20,
      lineHeight: "28px",
    },
    copy: {
      fontSize: 18,
      lineHeight: "26px",
    },
    body: {
      fontSize: 16,
      lineHeight: "24px",
    },
    label: {
      fontSize: 14,
      lineHeight: "22px",
    },
    caption: {
      fontSize: 12,
      lineHeight: "20px",
    },
    small: {
      fontSize: 10,
      lineHeight: "16px",
    },
  },
  // } as TypographyOptions | ((palette: Palette) => TypographyOptions),
};

// Override style Mui
const themeOptions: ThemeOptionsOld = {
  ...themeCustoms,
  // breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1160,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: themeCustoms.color.main,
      dark: "#0DB4A9",
      contrastText: themeCustoms.color.text
    },
    secondary: {
      main: themeCustoms.color.main,
    },
    info: {
      main: themeCustoms.color.notification,
    },
    error: {
      main: themeCustoms.color.error,
    },
    warning: {
      main: themeCustoms.color.warning,
    },
    success: {
      main: themeCustoms.color.success,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '12px',
          borderRadius: '8px'
          // '&&&:hover': {
          //   backgroundColor: 'transparent',
          // },
        }
      }
    }
  }
};

// Update for Typescript
type CustomTheme = {
  [Key in keyof typeof themeCustoms]: (typeof themeCustoms)[Key];
};
declare module "@mui/material/styles/createTheme" {
  interface Theme extends CustomTheme { }

  interface ThemeOptions extends CustomTheme { }
}

export type TypeTypography = keyof typeof themeCustoms.typography;

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body1: false;
    body2: false;
    button: false;
    overline: false;
    subtitle1: false;
    subtitle2: false;
    //
    copy: true;
    body: true;
    label: true;
    small: true;
  }
}

// Create theme
export const theme = createTheme({ ...themeCustoms, ...themeOptions });
