/**
 * PWA Installation utility
 * Handles app installation prompts and PWA features
 */

class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isStandalone = false;

    this.init();
  }

  init() {
    // Check if app is already installed/standalone
    this.isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true ||
      document.referrer.includes("android-app://");

    // Listen for install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      console.log("PWA install prompt available");
    });

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      console.log("PWA installed successfully");
    });
  }

  /**
   * Check if installation is available
   */
  canInstall() {
    return this.deferredPrompt !== null && !this.isStandalone;
  }

  /**
   * Check if app is running as standalone PWA
   */
  isRunningStandalone() {
    return this.isStandalone;
  }

  /**
   * Trigger installation prompt
   */
  async install() {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const result = await this.deferredPrompt.userChoice;

      if (result.outcome === "accepted") {
        console.log("User accepted PWA installation");
        this.deferredPrompt = null;
        return true;
      } else {
        console.log("User dismissed PWA installation");
        return false;
      }
    } catch (error) {
      console.error("Error installing PWA:", error);
      return false;
    }
  }

  /**
   * Get installation instructions for different platforms
   */
  getInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !isChrome;

    if (isIOS && isSafari) {
      return {
        platform: "iOS Safari",
        steps: [
          "1. Tap the Share button (square with arrow)",
          '2. Scroll down and tap "Add to Home Screen"',
          '3. Tap "Add" to confirm',
        ],
      };
    } else if (isAndroid && isChrome) {
      return {
        platform: "Android Chrome",
        steps: [
          "1. Tap the menu (⋮) in the top right",
          '2. Tap "Add to Home screen"',
          '3. Tap "Add" to confirm',
        ],
      };
    } else if (isChrome) {
      return {
        platform: "Desktop Chrome",
        steps: [
          "1. Click the install icon in the address bar",
          '2. Or use Chrome menu > "Install Meridian Mastery"',
          '3. Click "Install" to confirm',
        ],
      };
    } else {
      return {
        platform: "Other Browser",
        steps: [
          '1. Look for "Install" or "Add to Home Screen" options',
          "2. Usually found in browser menu",
          "3. Follow your browser's installation prompts",
        ],
      };
    }
  }

  /**
   * Check if app is currently online
   */
  isOnline() {
    return navigator.onLine;
  }

  /**
   * Get PWA status information
   */
  getStatus() {
    return {
      canInstall: this.canInstall(),
      isStandalone: this.isStandalone,
      isOnline: this.isOnline(),
      isInstalled: this.isInstalled,
      platform: this.getInstallInstructions().platform,
    };
  }
}

// Create singleton instance
const pwaInstaller = new PWAInstaller();

export default pwaInstaller;
