export class SystemColorTheme {
    systemColorTheme: 'Light' | 'Dark';
    private onColorSchemeChange?: (theme: 'Light' | 'Dark') => void;
    private mql?: MediaQueryList;

    constructor(onColorSchemeChange?: (theme: 'Light' | 'Dark') => void) {
        this.onColorSchemeChange = onColorSchemeChange;
        if (typeof window !== 'undefined' && window.matchMedia) {
            this.mql = window.matchMedia('(prefers-color-scheme: dark)');
            this.systemColorTheme = this.mql.matches ? 'Dark' : 'Light';
        } else {
            this.systemColorTheme = 'Light';
        }

        this.stopListening();
    }

    private colorSchemeChangeHandler = (e: MediaQueryListEvent) => {
        this.systemColorTheme = e.matches ? 'Dark' : 'Light';
        if (this.onColorSchemeChange) {
            this.onColorSchemeChange(this.systemColorTheme);
        }
    }

    startListening(): void {
        this.mql?.addEventListener('change', this.colorSchemeChangeHandler);
    }

    stopListening(): void {
        this.mql?.removeEventListener('change', this.colorSchemeChangeHandler);
    }
}