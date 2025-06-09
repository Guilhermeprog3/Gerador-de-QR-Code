"use client";

import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  Primary_theme,
  Secondary_theme,
  Tertiary_theme,
} from "@/styles/themes";

function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const themes = {
  primary: Primary_theme,
  secondary: Secondary_theme,
  tertiary: Tertiary_theme,
};

type ThemeName = keyof typeof themes;
type Theme = typeof Primary_theme;

const isValidTheme = (theme: any): theme is ThemeName => {
    return theme in themes;
}

interface AppThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(
  undefined
);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>("secondary");

  useEffect(() => {
    const savedTheme = getCookie("app-theme");
    if (savedTheme && isValidTheme(savedTheme)) {
      setThemeName(savedTheme);
    } else {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setThemeName(mediaQuery.matches ? "tertiary" : "secondary");

      const handleThemeChange = (e: MediaQueryListEvent) => {
         if (!getCookie("app-theme")) {
            setThemeName(e.matches ? "tertiary" : "secondary");
         }
      };
      mediaQuery.addEventListener("change", handleThemeChange);
      return () => mediaQuery.removeEventListener("change", handleThemeChange);
    }
  }, []);

  const handleSetTheme = useCallback((name: ThemeName) => {
    setThemeName(name);
    setCookie("app-theme", name, 365);
  }, []);

  const theme = useMemo(() => themes[themeName], [themeName]);

  const value = useMemo(
    () => ({
      theme,
      themeName,
      setTheme: handleSetTheme,
    }),
    [theme, themeName, handleSetTheme]
  );

  return (
    <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be used within an AppThemeProvider");
  }
  return context;
}