import React from 'react';
import {Link} from 'react-router-dom';

const NavigationBar: React.FC = () => {

    const navItems = [
        { title: 'Home', path: '/'}
    ];

    return (
        <nav className="fixed left-0 right-0 z-50 bg-white dark:bg-gray-950 shadow-md">
        {/* Bottom navigation: Only displayed on phone */}
            <div className="mobile-nav md:hidden flex justify-around items-center h-16 border-t border-gray-200 dark:border-gray-700">
                {navItems.map((item) => (
                    <Link
                        key={item.title}
                        to={item.path}
                    >
                        {item.title}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

export default NavigationBar;