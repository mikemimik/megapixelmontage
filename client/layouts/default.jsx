import { Suspense, useEffect } from "react";
import AOS from "aos";

import Paper from "@mui/material/Paper";
import CssBaseline from "@mui/material/CssBaseline";

import { ThemeProvider } from "@mui/material/styles";

import { useDarkMode } from "../hooks/useDarkMode";
import { getTheme } from "../theme";

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
