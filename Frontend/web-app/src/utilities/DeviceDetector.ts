export class DeviceDetector {
    static isPhone(userAgent?: string): boolean {
        const ua = userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
        return /Mobi|Android|iPhone|iPod/i.test(ua);
    }

    static isPad(userAgent?: string): boolean {
        const ua = userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
        return /iPad|Tablet|Nexus 7|Nexus 10|KFAPWI/i.test(ua);
    }
}
