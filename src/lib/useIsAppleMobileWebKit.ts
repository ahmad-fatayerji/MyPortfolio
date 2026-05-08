"use client";

import * as React from "react";

function detectAppleMobileWebKit() {
  if (typeof navigator === "undefined") {
    return false;
  }

  const { userAgent, platform, maxTouchPoints } = navigator;
  const isIOSDevice = /iP(hone|ad|od)/i.test(userAgent);
  const isIPadOS = platform === "MacIntel" && maxTouchPoints > 1;
  const isAppleMobile = isIOSDevice || isIPadOS;
  const isWebKit = /WebKit/i.test(userAgent);
  const isAltIOSBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(
    userAgent,
  );

  return isAppleMobile && isWebKit && !isAltIOSBrowser;
}

export { detectAppleMobileWebKit };

export function useIsAppleMobileWebKit() {
  const [isAppleMobileWebKit, setIsAppleMobileWebKit] = React.useState(false);

  React.useEffect(() => {
    setIsAppleMobileWebKit(detectAppleMobileWebKit());
  }, []);

  return isAppleMobileWebKit;
}
