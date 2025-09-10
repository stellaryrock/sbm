"use client";

import { MonitorIcon, MoonStarIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const THEMES = ["light", "system", "dark"] as const;
const THEME_ICONS = {
  light: <MonitorIcon />,
  system: <MoonStarIcon />,
  dark: <SunIcon />,
};

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();
  const [mount, setMount] = useState<boolean>(false);

  useEffect(() => {
    setMount(true);
  }, []);

  const changeTheme = () => {
    const idx = THEMES.indexOf(theme as keyof typeof THEME_ICONS) + 1;
    setTheme(THEMES[idx === THEMES.length ? 0 : idx]);
  };

  if (!mount) {
    return <button></button>;
  }
  return (
    <div>
      <button type="button" onClick={changeTheme} className="btn-icon">
        {THEME_ICONS[theme as keyof typeof THEME_ICONS]}
      </button>
    </div>
  );
}
