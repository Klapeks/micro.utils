const mstime: any = require('jsonwebtoken/node_modules/ms/index');

export default {
    replaceLast(str: string, from: string, to: string): string {
        const lastIndex = str.lastIndexOf(from);
        if (lastIndex < 0) return str;
        return str.substring(0, lastIndex) + to +
                str.substring(lastIndex + from.length);
    },
    mstime(time: string | number): number {
        if (typeof time === "number") return time;
        return mstime(time)
    }
}