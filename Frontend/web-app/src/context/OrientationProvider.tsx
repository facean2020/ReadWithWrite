import React, { useEffect, useState } from 'react';
import { OrientationUtils } from '../utilities/OrientationUtils';
import { OrientationContext } from './OrientationContext';

export function OrientationProvider({ children }: { children: React.ReactNode }) {
    const getInitialOrientation = () => (typeof window !== 'undefined' ? window.screen.orientation?.type ?? 'landscape-primary' : 'landscape-primary');
    const [orientation, setOrientation] = useState<string>(getInitialOrientation);

    useEffect(() => {
        const ou = new OrientationUtils((newOrientation) => {
            setOrientation(newOrientation);
        });
        ou.initialize();

        return () => {
            ou.destroy();
        };
    }, []);

    return (
        <OrientationContext.Provider value={{ orientation }}>
            {children}
        </OrientationContext.Provider>
    );
}
