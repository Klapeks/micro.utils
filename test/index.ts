import utils from "../src/utils";


async function test() {
    let o = {} as any;
    for (let i = 0; i < 10000; i++){
        let a = utils.random(3);
        if (!o[a]) o[a] = 1;
        else o[a] = o[a] + 1;
    }
    console.log('random results:', o);
    o = {} as any;
    for (let i = 0; i < 10000; i++) {
        let a = utils.randomInclude(3);
        if (!o[a]) o[a] = 1;
        else o[a] = o[a] + 1;
    }
    console.log('random include results:', o);
}

test();