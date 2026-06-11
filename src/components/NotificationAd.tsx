'use client';

import { useEffect } from 'react';

const NOTIFICATION_AD_SRC =
  'https://pl29616863.effectivecpmnetwork.com/4f/24/07/4f240742e2939686623fe2466fe852cd.js';

function isMobileDevice() {
  const hasMobileViewport = window.matchMedia('(max-width: 767px)').matches;
  const hasMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  return hasMobileViewport || hasMobileUserAgent;
}

export function NotificationAd() {
  useEffect(() => {
    if (isMobileDevice() || document.getElementById('notification-ad')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'notification-ad';
    script.src = NOTIFICATION_AD_SRC;
    script.async = true;

    document.head.appendChild(script);
  }, []);

  return null;
}
