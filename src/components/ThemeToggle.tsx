"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 text-muted-foreground dark:hidden" />
      <Moon className="hidden h-4 w-4 text-muted-foreground dark:block" />
    </button>
  );
}
