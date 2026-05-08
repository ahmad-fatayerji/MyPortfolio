"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useIsAppleMobileWebKit } from "@/lib/useIsAppleMobileWebKit";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const reloadTimeoutRef = React.useRef<number | null>(null);
  const isAppleMobileWebKit = useIsAppleMobileWebKit();

  React.useEffect(() => {
    setMounted(true);
    return () => {
      if (reloadTimeoutRef.current) {
        window.clearTimeout(reloadTimeoutRef.current);
      }
    };
  }, []);

  const handleToggleTheme = () => {
    const isDark = resolvedTheme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    setTheme(nextTheme);

    if (!isAppleMobileWebKit) {
      return;
    }

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);

    if (reloadTimeoutRef.current) {
      window.clearTimeout(reloadTimeoutRef.current);
    }

    reloadTimeoutRef.current = window.setTimeout(() => {
      window.location.reload();
    }, 120);
  };

  return (
    <button
      type="button"
      onClick={handleToggleTheme}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
      aria-label="Toggle theme"
      disabled={!mounted}
    >
      {mounted ? (
        <>
          <Sun className="h-4 w-4 text-muted-foreground dark:hidden" />
          <Moon className="hidden h-4 w-4 text-muted-foreground dark:block" />
        </>
      ) : (
        <span className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
