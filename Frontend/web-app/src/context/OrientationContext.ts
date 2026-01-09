import { createContext } from 'react';

export const OrientationContext = createContext<{ orientation: string }>({ orientation: 'landscape-primary' });
