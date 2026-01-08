export class PlatformUtils {
    userPlatform: string;
    userOrientation: string;

    constructor() {
        const hasWindow = typeof window !== 'undefined';
        this.userPlatform = typeof navigator !== 'undefined' ? navigator.userAgent : '';
        
        if (hasWindow && (PlatformUtils.isPhoneStatic(this.userPlatform) || PlatformUtils.isPadStatic(this.userPlatform))) {
            this.userOrientation = window?.screen.orientation?.type ?? 'landscape-primary';
        } else {
            this.userOrientation = "landscape-primary";
        }
    }

    private orientationChangeHandler = () => {
        if (typeof window === 'undefined') return;
        this.userOrientation = window?.screen.orientation?.type ?? 'landscape-primary';
    }

    startListening(): void {
        if (typeof window === 'undefined') return;
        if (PlatformUtils.isPhoneStatic(this.userPlatform) && (window.screen && 'onchange' in window.screen.orientation)) {
            window.screen.orientation.addEventListener('change', this.orientationChangeHandler);
        } else {
            window.addEventListener('orientationchange', this.orientationChangeHandler);
        }
    }

    stopListening(): void {
        if (typeof window === 'undefined') return;
        if (PlatformUtils.isPhoneStatic(this.userPlatform) && (window.screen && 'onchange' in window.screen.orientation)) {
            window.screen.orientation.removeEventListener('change', this.orientationChangeHandler);
        } else {
            window.removeEventListener('orientationchange', this.orientationChangeHandler);
        }
    }

    static isPhoneStatic(userAgent: string): boolean {
        const ua = userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
        return /Mobi|Android|iPhone|iPod/i.test(ua);
    }

    static isPadStatic(userAgent: string): boolean {
        const ua = userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
        return /iPad|Tablet|Nexus 7|Nexus 10|KFAPWI/i.test(ua);
    }

    getOrientation(): string {
        return this.userOrientation;
    }
}