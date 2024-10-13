const ms: any = (() => {
    try {
        return require('jsonwebtoken/node_modules/ms/index');
    } catch {
        return require('ms');
    }
})();

function mstime(time: string | number): number {
    return typeof time === "number" ? time : ms(time)
}

export default mstime;