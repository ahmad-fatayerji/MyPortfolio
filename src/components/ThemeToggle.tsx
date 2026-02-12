"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      document.documentElement.classList.remove("theme-transition");
    };
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  const handleToggleTheme = () => {
    document.documentElement.classList.add("theme-transition");
    setTheme(nextTheme);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
      timeoutRef.current = null;
    }, 350);
  };

  return (
    <button
      type="button"
      onClick={handleToggleTheme}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
      aria-label="Toggle theme"
      disabled={!mounted}
    >
      <Sun className="h-4 w-4 text-muted-foreground dark:hidden" />
      <Moon className="hidden h-4 w-4 text-muted-foreground dark:block" />
    </button>
  );
}
