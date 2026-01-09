import { createContext } from "react";

export const SystemColorThemeContext = createContext<{ systemColorTheme: 'Light' | 'Dark' }>({ systemColorTheme: 'Light' });