import { DeviceDetector } from './DeviceDetector';

export class OrientationUtils {
    userPlatform: string;
    userOrientation: string;
    private onOrientationChange?: (orientation: string) => void;

    constructor(onOrientationChange?: (orientation: string) => void) {
        this.onOrientationChange = onOrientationChange;
        const hasWindow = typeof window !== 'undefined';
        this.userPlatform = typeof navigator !== 'undefined' ? navigator.userAgent : '';
        
        if (hasWindow && (DeviceDetector.isPhone(this.userPlatform) || DeviceDetector.isPad(this.userPlatform))) {
            this.userOrientation = window?.screen.orientation?.type ?? 'landscape-primary';
        } else {
            this.userOrientation = "landscape-primary";
        }
    }

    initialize(): void {
        this.startListening();
    }

    destroy(): void {
        this.stopListening();
    }

    private orientationChangeHandler = () => {
        if (typeof window === 'undefined') return;
        this.userOrientation = window?.screen.orientation?.type ?? 'landscape-primary';
        if (this.onOrientationChange) {
            this.onOrientationChange(this.userOrientation);
        }
    }

    startListening(): void {
        if (typeof window === 'undefined') return;
        if (DeviceDetector.isPhone(this.userPlatform) && (window.screen && 'onchange' in window.screen.orientation)) {
            window.screen.orientation.addEventListener('change', this.orientationChangeHandler);
        } else {
            window.addEventListener('orientationchange', this.orientationChangeHandler);
        }
    }

    stopListening(): void {
        if (typeof window === 'undefined') return;
        if (DeviceDetector.isPhone(this.userPlatform) && (window.screen && 'onchange' in window.screen.orientation)) {
            window.screen.orientation.removeEventListener('change', this.orientationChangeHandler);
        } else {
            window.removeEventListener('orientationchange', this.orientationChangeHandler);
        }
    }

    getOrientation(): string {
        return this.userOrientation;
    }
}
