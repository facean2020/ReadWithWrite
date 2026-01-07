import React from 'react';

const NavigationBar: React.FC = () => {
    return (
        <nav className="navigation-bar">
            <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/features">Features</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    );
}

export default NavigationBar;