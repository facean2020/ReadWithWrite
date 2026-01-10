import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import { DeviceDetector } from '../utilities/DeviceDetector';
import ColorThemeSwitch from './ColorThemeSwitch';

const MainLayout: React.FC = () => {
    const isPhone = DeviceDetector.isPhone();
    
    return (
        <div className={`flex min-h-screen bg-background ${isPhone ? 'flex-col' : 'flex-row'}`}>
            <NavigationBar />
            
            <div className="flex-1 flex flex-col w-full">
                {/* Top Header Layer (Safe Area) */}
                <header className="h-16 w-full flex items-center justify-end px-6 border-b shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center">
                        <ColorThemeSwitch />
                    </div>
                </header>

                <main className="flex-1 w-full relative flex flex-col items-center">
                    <div className="w-full max-w-[1400px] p-4 md:p-6 lg:p-10 text-center">
                        <Outlet />
                    </div>
                    
                    {/* Spacer for mobile bottom nav */}
                    {isPhone && <div className="h-16 shrink-0" />}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
