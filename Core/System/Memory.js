export class Memory {
    constructor() {
        this.data = new Set();
        this.namedData = new Map();
    }

    static Create(name) {
        return (this[name] = new Memory());
    }

    Set(name, item) {
        const instance = item?.getInstance ? item.getInstance() : item;
        this.namedData.set(name, instance);
        this.data.add(instance);
        return instance;
    }

    Add(item) {
        const instance = item?.getInstance ? item.getInstance() : item;
        this.data.add(instance);
        return instance;
    }

    Get(keyOrPredicate) {
        if (typeof keyOrPredicate === 'string') {
            return this.namedData.get(keyOrPredicate) ?? null;
        }
        if (typeof keyOrPredicate === 'function') {
            for (const item of this.data) {
                if (keyOrPredicate(item)) return item;
            }
        }
        return null;
    }

    Call(methodName, ...args) {
        this.data.forEach(item => {
            if (typeof item[methodName] === 'function') {
                item[methodName](...args);
            }
        });
    }

    All() {
        return Array.from(this.data);
    }
}
