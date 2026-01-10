import React, { useEffect, useState } from "react";
import { SystemColorThemeContext } from "./AppContext";
import { SystemColorTheme } from "@/utilities/SystemTheme";

export function SystemColorThemeProvider({ children }: { children: React.ReactNode }) {
    const getInitialSystemColorTheme = (): 'Light' | 'Dark' => {
        if (typeof window === 'undefined') {
            console.log("[SystemColorThemeProvider] window undefined, defaulting to Light");
            return 'Light';
        }
        
        // Check localStorage first
        const storedTheme = localStorage.getItem('system-color-theme');
        if (storedTheme === 'Light' || storedTheme === 'Dark') {
            console.log("[SystemColorThemeProvider] using stored theme:", storedTheme);
            return storedTheme;
        }

        // Check system preference
        const derivedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
        console.log("[SystemColorThemeProvider] derived theme from system preference:", derivedTheme);
        return derivedTheme;
    };

    const [systemColorTheme, setSystemColorTheme] = useState<'Light' | 'Dark'>(getInitialSystemColorTheme);

    // Synchronization Theme to html element
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const theme = systemColorTheme.toLowerCase();
        document.documentElement.setAttribute('data-theme', theme);
        
        if (systemColorTheme === 'Dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('system-color-theme', systemColorTheme);
        console.log("[SystemColorThemeProvider] applied", systemColorTheme, "theme to document");
    }, [systemColorTheme]);

    // Listen for system color theme changes
    useEffect(() => {
        const systemColorThemeManager = new SystemColorTheme((newTheme) => {
            console.log("[SystemColorThemeProvider] system preference changed to", newTheme);
            setSystemColorTheme(newTheme);
        })
        systemColorThemeManager.startListening();
        return () => {
            systemColorThemeManager.stopListening();
        };
    }, []);

    return (
        <SystemColorThemeContext.Provider value={{ systemColorTheme, setSystemColorTheme }}>
            {children}
        </SystemColorThemeContext.Provider>
    );
}