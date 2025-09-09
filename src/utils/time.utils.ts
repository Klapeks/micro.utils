const ms: any = (() => {
    try {
        return require('jsonwebtoken/node_modules/ms/index');
    } catch {
        return require('ms');
    }
})();

export function mstime(time: string | number): number {
    return typeof time === "number" ? time : ms(time)
}

export const timeUtils = {
    mstime,
    expiredIn(time: string | number): Date {
        return new Date(Date.now() + mstime(time));
    },
    isExpired(time: Date | number): boolean {
        if (typeof time == 'object') time = time.getTime();
        return time < Date.now();
    }
}