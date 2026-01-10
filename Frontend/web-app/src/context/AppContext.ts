import React, { createContext } from "react";

export type SystemColorThemeType = 'Light' | 'Dark';

interface SystemColorThemeContextType {
    systemColorTheme: SystemColorThemeType;
    setSystemColorTheme: React.Dispatch<React.SetStateAction<SystemColorThemeType>>;
}

export const SystemColorThemeContext = createContext<SystemColorThemeContextType>({ systemColorTheme: 'Light', setSystemColorTheme: () => {} });