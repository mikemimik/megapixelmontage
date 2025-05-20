import { Suspense, useEffect, useState } from "react";
import AOS from "aos";

import Paper from "@mui/material/Paper";
import CssBaseline from "@mui/material/CssBaseline";

import {
  ThemeProvider,
  createTheme,
  alpha,
  responsiveFontSizes,
} from "@mui/material/styles";

const useDarkMode = () => {
  const [themeMode, setTheme] = useState("light");
  const [mountedComponent, setMountedComponent] = useState(false);

  const setMode = (mode) => {
    try {
      window.localStorage.setItem("themeMode", mode);
    } catch {
      /* do nothing */
    }

    setTheme(mode);
  };

  const themeToggler = () => {
    themeMode === "light" ? setMode("dark") : setMode("light");
  };

  useEffect(() => {
    try {
      const localTheme = window.localStorage.getItem("themeMode");
      localTheme ? setTheme(localTheme) : setMode("light");
    } catch {
      setMode("light");
    }

    setMountedComponent(true);
  }, []);

  return [themeMode, themeToggler, mountedComponent];
};

// INFO: theme/shadows.js
const shadows = (themeMode = "light") => {
  const rgb = themeMode === "light" ? "#8c98a4" : "#000000";

  return [
    "none",
    `0 3px 6px 0 ${alpha(rgb, 0.25)}`,
    `0 12px 15px ${alpha(rgb, 0.1)}`,
    `0 6px 24px 0 ${alpha(rgb, 0.125)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
    `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  ];
};

// INFO: theme/palette.js
const light = {
  alternate: {
    main: "#f7faff",
    dark: "#edf1f7",
  },
  cardShadow: "rgba(23, 70, 161, .11)",
  mode: "light",
  primary: {
    main: "#377dff",
    light: "#467de3",
    dark: "#2f6ad9",
    contrastText: "#fff",
  },
  secondary: {
    light: "#ffb74d",
    main: "#f9b934",
    dark: "#FF9800",
    contrastText: "rgba(0, 0, 0, 0.87)",
  },
  text: {
    primary: "#1e2022",
    secondary: "#677788",
  },
  divider: "rgba(0, 0, 0, 0.12)",
  background: {
    paper: "#ffffff",
    default: "#ffffff",
    level2: "#f5f5f5",
    level1: "#ffffff",
  },
};

const dark = {
  alternate: {
    main: "#1a2138",
    dark: "#151a30",
  },
  cardShadow: "rgba(0, 0, 0, .11)",
  common: {
    black: "#000",
    white: "#fff",
  },
  mode: "dark",
  primary: {
    main: "#1976d2",
    light: "#2196f3",
    dark: "#0d47a1",
    contrastText: "#fff",
  },
  secondary: {
    light: "#FFEA41",
    main: "#FFE102",
    dark: "#DBBE01",
    contrastText: "rgba(0, 0, 0, 0.87)",
  },
  text: {
    primary: "#EEEEEF",
    secondary: "#AEB0B4",
  },
  divider: "rgba(255, 255, 255, 0.12)",
  background: {
    paper: "#222B45",
    default: "#222B45",
    level2: "#333",
    level1: "#2D3748",
  },
};

// INFO: theme/index.js
const getTheme = (mode, themeToggler) =>
  responsiveFontSizes(
    createTheme({
      palette: mode === "light" ? light : dark,
      shadows: shadows(mode),
      typography: {
        fontFamily: '"Inter", sans-serif',
        button: {
          textTransform: "none",
          fontWeight: "medium",
        },
      },
      zIndex: {
        appBar: 1200,
        drawer: 1300,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              fontWeight: 400,
              borderRadius: 5,
              paddingTop: 10,
              paddingBottom: 10,
            },
            containedSecondary: mode === "light" ? { color: "white" } : {},
          },
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              borderRadius: 5,
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 5,
            },
            input: {
              borderRadius: 5,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          },
        },
      },
      themeToggler,
    }),
  );

// INFO: DEFAULT EXPORT
export default function Layout({ children }) {
  const [themeMode, themeToggler, mountedComponent] = useDarkMode();

  useEffect(() => {
    // NOTE: this might not be necessary
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    AOS.init({
      once: true,
      delay: 0,
      duration: 800,
      offset: 0,
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [mountedComponent, themeMode]);

  return (
    <Suspense>
      <ThemeProvider theme={getTheme(themeMode, themeToggler)}>
        <CssBaseline />
        <Paper elevation={0}>{children}</Paper>
      </ThemeProvider>
    </Suspense>
  );
}
