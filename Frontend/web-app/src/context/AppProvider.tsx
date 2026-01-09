import React, { useEffect, useState } from "react";
import { SystemColorThemeContext } from "./AppContext";
import { SystemColorTheme } from "@/utilities/SystemTheme";

export function SystemColorThemeProvider({ children }: { children: React.ReactNode }) {
    const getInitialSystemColorTheme = () => 
    ((typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'Dark' : 'Light');
    const [systemColorTheme, setSystemColorTheme] = useState<'Light' | 'Dark'>(getInitialSystemColorTheme);

    useEffect(() => {
        const systemColorThemeManager = new SystemColorTheme((newTheme) => {
            setSystemColorTheme(newTheme);
        })
        systemColorThemeManager.startListening();
        return () => {
            systemColorThemeManager.stopListening();
        };
    }, []);
    return (
        <SystemColorThemeContext.Provider value={{ systemColorTheme }}>
            {children}
        </SystemColorThemeContext.Provider>
    );
}