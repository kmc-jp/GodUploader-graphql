export const isTouchDevice = () => navigator.maxTouchPoints > 0;

export const isMac = () => navigator.userAgent.includes("Mac OS");
