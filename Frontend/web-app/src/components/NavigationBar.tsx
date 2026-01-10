import { BookIcon, EditIcon, HomeIcon, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DeviceDetector } from '../utilities/DeviceDetector';

const navItems = [
    { title: 'Home', icon: <HomeIcon className="w-5 h-5" />, path: '/' },
    { title: 'Write', icon: <EditIcon className="w-5 h-5" />, path: '/write' },
    { title: 'Read', icon: <BookIcon className="w-5 h-5" />, path: '/read' },
];

const NavigationBar: React.FC = () => {
    const location = useLocation();
    const isPhone = DeviceDetector.isPhone();
    
    // Sidebar state (only relevant for non-phone devices)
    const [isSlideOpen, setIsSlideOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return true;
    });

    useEffect(() => {
        if (isPhone) return;

        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSlideOpen(false);
            } else if (window.innerWidth >= 1200) {
                setIsSlideOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isPhone]);

    const toggleSlide = () => {
        setIsSlideOpen(!isSlideOpen);
    }

    const NavLinkItem = ({ item, isMobile }: { item: typeof navItems[0], isMobile?: boolean }) => {
        const isActive = location.pathname === item.path;
        
        if (isMobile) {
            return (
                <Link
                    to={item.path}
                    className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                        isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {item.icon}
                    <span className="text-[10px] mt-1">{item.title}</span>
                </Link>
            );
        }

        return (
            <Link
                to={item.path}
                className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all ${
                    isActive 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                title={!isSlideOpen ? item.title : undefined}
            >
                <div className="flex-shrink-0">{item.icon}</div>
                {isSlideOpen && (
                    <span className="text-sm font-medium transition-opacity duration-300 opacity-100 whitespace-nowrap">
                        {item.title}
                    </span>
                )}
            </Link>
        );
    };

    if (isPhone) {
        return (
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50 flex items-center justify-around px-2 pb-safe">
                {navItems.map((item) => (
                    <NavLinkItem key={item.path} item={item} isMobile />
                ))}
            </nav>
        );
    }

    return (
        <nav 
            className={`flex flex-col sticky top-0 h-screen z-40 bg-card border-r transition-all duration-300 shrink-0 ${
                isSlideOpen ? 'w-64' : 'w-16'
            }`}
        >
            <div className={`p-4 flex items-center h-16 border-b ${isSlideOpen ? 'justify-between' : 'justify-center'}`}>
                {isSlideOpen && <span className="font-bold text-lg truncate">ReadWithWrite</span>}
                <button
                    onClick={toggleSlide}
                    className="p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors"
                    aria-label={isSlideOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {isSlideOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {navItems.map((item) => (
                    <NavLinkItem key={item.path} item={item} />
                ))}
            </div>
        </nav>
    );
}

export default NavigationBar;
