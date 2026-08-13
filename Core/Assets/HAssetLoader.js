export default class HAssetLoader {

    static cache = new Map();
    static root = "Assets/";
    
    static Load(path) {
        let asset = this.cache.get(path);

        if (asset)
            return asset;

        asset = tl.texture.load(path);

        this.cache.set(path, asset);

        return asset;
    }

    static LoadAnimation(path, frameCount, frameTime) {
        let key = `${path}:${frameCount}:${frameTime}`;

        let asset = this.cache.get(key);

        if (asset)
            return asset;

        asset = tl.texture.loadAnimation(
            path,
            frameCount,
            frameTime
        );

        this.cache.set(key, asset);

        return asset;
    }

    static Exists(path) {
        return this.cache.has(path);
    }

    static Get(path) {
        return this.cache.get(path);
    }

    static Unload(path) {
        this.cache.delete(path);
    }

    static Clear() {
        this.cache.clear();
    }

}



