const mstime: any = require('jsonwebtoken/node_modules/ms/index');

export const bits = {
    add(bitsArray: number, index: number): number {
        return bitsArray | (1 << (index-1));
    },
    remove(bitsArray: number, index: number): number {
        return bitsArray & ~(1 << (index-1));
    },
    has(bitsArray: number, index: number): boolean {
        return (bitsArray | (1 << (index-1))) == bitsArray;
    }
} as const;

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
    },
    async delay(ms: number){
        return new Promise<void>(resolve => {
            setTimeout(resolve, ms);
        })
    }
} as const;