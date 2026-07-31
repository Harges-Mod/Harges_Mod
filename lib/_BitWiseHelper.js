/** @format */

/**
    used to AIs and Others systems 32 Bits.
*/
class BitWise {
    static Read(packageValue, bitShift, maxBit) {
        return (packageValue >> bitShift) & maxBit;
    }

    static Save(currentPackage, value, bitShift, maxBit) {
        const clearMask = ~(maxBit << bitShift);
        const cleanedPackage = currentPackage & clearMask;
        return cleanedPackage | ((value & maxBit) << bitShift);
    }
}

export class BitWiseHelper {
    constructor(config, debug = false) {
        this.schema = {};
        this.debug = debug;
        let shift = 0;

        for (const [prop, maxLimit] of Object.entries(config)) {
            const bitLength = maxLimit.toString(2).length;
            const mask = (1 << bitLength) - 1;
            
            this.schema[prop] = { shift, mask, maxLimit, bitLength };
            shift += bitLength;
        }

        this.totalBits = shift;

        if (this.debug && this.totalBits > 31) {
            console.error(
                `[Structural BitWiseHelper] CONFIGURATION ERROR: The sum of your properties' bits is ${this.totalBits} bits. ` +
                `JavaScript supports only 31 safe bits for bitwise operations. This WILL generate negative numbers and cause bugs in Unity!`
            );
        }
    }

    Unpack(rawPackage) {
        const res = {};
        const pkg = Math.floor(rawPackage || 0);

        for (const [name, cfg] of Object.entries(this.schema)) {
            res[name] = (pkg >> cfg.shift) & cfg.mask;
        }
        return res;
    }

    Pack(dataObj, currentPackage = 0) {
        let pkg = Math.floor(currentPackage || 0);

        for (const [name, val] of Object.entries(dataObj)) {
            const cfg = this.schema[name];
            if (cfg) {

                if (this.debug) {

                    if (val > cfg.maxLimit) {
                       throw new RangeError(
                            `[BitWiseHelper Actual Error] LIMIT OVERFLOW! The property '${name}' received the value (${val}), ` +
                            `but the maximum configured limit for it was (${cfg.maxLimit}) with a space of only ${cfg.bitLength} bits. ` +
                            `This will corrupt the data of the other variables in the package!`
                        );
                    }
                }

                pkg = (pkg & ~(cfg.mask << cfg.shift)) | ((val & cfg.mask) << cfg.shift);
            }
        }


        if (this.debug && pkg < 0) {
            console.log(
            'Negative Number'
            );
        }

        return pkg;
    }
}

/**
    let Data = new BitWiseHelper({
        Counter: 50,
        Bool: 1
    });
    
    let n = 0; 

    let d = Data.Unpack(n); // d : { Counter: 0, Bool: 0 }
    d.Counter = 42;
    d.Bool = 1;
    n = Data.Pack(d, n);
*/

globalThis.BitWiseHelper = BitWiseHelper;
