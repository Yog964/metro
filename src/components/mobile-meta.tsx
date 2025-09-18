import { useEffect } from 'react';

export function MobileMeta() {
  useEffect(() => {
    // Ensure proper viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);
    } else {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }

    // Add theme-color for Android Chrome
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#ffffff';
      document.head.appendChild(meta);
    }

    // Add mobile-web-app-capable for better Android experience
    const mobileWebAppMeta = document.querySelector('meta[name="mobile-web-app-capable"]');
    if (!mobileWebAppMeta) {
      const meta = document.createElement('meta');
      meta.name = 'mobile-web-app-capable';
      meta.content = 'yes';
      document.head.appendChild(meta);
    }

    // Add apple-mobile-web-app-capable for iOS
    const appleMobileMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleMobileMeta) {
      const meta = document.createElement('meta');
      meta.name = 'apple-mobile-web-app-capable';
      meta.content = 'yes';
      document.head.appendChild(meta);
    }

    // Add apple-mobile-web-app-status-bar-style
    const appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleStatusBarMeta) {
      const meta = document.createElement('meta');
      meta.name = 'apple-mobile-web-app-status-bar-style';
      meta.content = 'default';
      document.head.appendChild(meta);
    }
  }, []);

  return null;
}