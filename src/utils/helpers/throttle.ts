export const throttle = (func: (args: any[]) => void, delay: number) => {
    let lastCalled = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCalled >= delay) {
            lastCalled = now;
            return func(...args);
        }
    };
};
