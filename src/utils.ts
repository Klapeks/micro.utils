const mstime: any = (() => {
    try {
        return require('jsonwebtoken/node_modules/ms/index');
    } catch {
        return require('ms');
    }
})();

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

function sleep(ms: number) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, ms);
    });
}

export function assertNever(never: never): never {
    console.error("Never assert failed", never);
    throw "Never assert failed: " + never;
}

const utils = {
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
    delay: sleep, sleep, assertNever,
    random(max: number) {
        return (Math.random() * max) | 0;
    },
    randomInclude(max: number) {
        // return Math.round(Math.random() * max); // bad
        return Math.floor(Math.random() * (max+1)); // good
    },
    copyFiltered<T>(object: Partial<T>, keys: (keyof T)[]): Partial<T> {
        const obj: Partial<T> = {};
        for (let key of keys) {
            if (object[key] === undefined) continue;
            if (typeof object[key] == 'undefined') continue;
            obj[key] = object[key];
        }
        return obj;
    },
    removeUndefineds(object: any, deep = true): any {
        if (typeof object != 'object') return object;
        for (let key of Object.keys(object)) {
            if (object[key] === undefined) delete object[key];
            else if (typeof object[key] === 'undefined') {
                delete object[key];
            }
            else if (deep && typeof object[key] == 'object') {
                object[key] = utils.removeUndefineds(object[key]);
            }
        }
        return object;
    }
} as const;

export default utils;