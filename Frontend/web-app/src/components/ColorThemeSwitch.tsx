import { useContext, useEffect } from "react";
import { SystemColorThemeContext } from "../context/AppContext";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function ColorThemeSwitch() {
    const { systemColorTheme, setSystemColorTheme } = useContext(SystemColorThemeContext);

    useEffect(() => {
        console.log("[ColorThemeSwitch] current theme:", systemColorTheme);
    }, [systemColorTheme]);

    const toggleTheme = () => {
        const newTheme = systemColorTheme === 'Light' ? 'Dark' : 'Light';
        console.log("[ColorThemeSwitch] toggling theme to", newTheme);
        setSystemColorTheme(newTheme);
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch 
                id="color-theme-switch" 
                checked={systemColorTheme === 'Dark'} 
                onCheckedChange={toggleTheme} 
            />
            <Label htmlFor="color-theme-switch" className="cursor-pointer">Color Theme</Label>
        </div>
    );
}
