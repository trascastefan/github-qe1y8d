/**
 * Configuration for theme transitions
 */
export const TRANSITION_CONFIG = {
  duration: 200, // milliseconds
  timing: 'ease-in-out',
  properties: [
    'background-color',
    'border-color',
    'color',
    'fill',
    'stroke',
    'opacity',
    'box-shadow',
    'transform'
  ]
} as const;

/**
 * Manages theme transition classes
 */
export class ThemeTransitionManager {
  private static instance: ThemeTransitionManager;
  private transitionTimeout: number | null = null;
  private preloadClass = 'preload';
  private transitionClass = 'theme-transition';
  private hardwareAccelClass = 'hardware-accelerated';

  private constructor() {
    // Singleton pattern
  }

  public static getInstance(): ThemeTransitionManager {
    if (!ThemeTransitionManager.instance) {
      ThemeTransitionManager.instance = new ThemeTransitionManager();
    }
    return ThemeTransitionManager.instance;
  }

  /**
   * Initializes transition management
   */
  public initialize(): void {
    // Prevent transitions on page load
    document.documentElement.classList.add(this.preloadClass);

    // Remove preload class after a short delay
    window.addEventListener('load', () => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove(this.preloadClass);
      });
    });

    // Add hardware acceleration class to body
    document.body.classList.add(this.hardwareAcclClass);
  }

  /**
   * Enables transitions for theme changes
   */
  public enableTransitions(): void {
    if (this.transitionTimeout) {
      window.clearTimeout(this.transitionTimeout);
    }

    requestAnimationFrame(() => {
      document.documentElement.classList.add(this.transitionClass);
    });
  }

  /**
   * Disables transitions temporarily
   * @param duration - How long to disable transitions (ms)
   */
  public disableTransitions(duration: number = 100): void {
    document.documentElement.classList.remove(this.transitionClass);

    this.transitionTimeout = window.setTimeout(() => {
      this.enableTransitions();
    }, duration);
  }

  /**
   * Checks if reduced motion is preferred
   */
  public prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Updates transition duration based on reduced motion preference
   */
  public updateReducedMotion(reduceMotion: boolean): void {
    const duration = reduceMotion || this.prefersReducedMotion() ? '0s' : `${TRANSITION_CONFIG.duration}ms`;
    document.documentElement.style.setProperty('--theme-transition-duration', duration);
  }
}

// Export singleton instance
export const themeTransitions = ThemeTransitionManager.getInstance();
