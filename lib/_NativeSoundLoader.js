const SystemArray = new NativeClass('System', 'Array');
const ObjectType = new NativeClass('System', 'Type')['Type GetType(string typeName)']('System.Object');
const CreateInstance = SystemArray['Array CreateInstance(Type elementType, int length)'];
const SetValue = SystemArray['void SetValue(object value, int index)'];
const AndroidJavaObject = new NativeClass('UnityEngine', 'AndroidJavaObject');
const TerrariaMain = new NativeClass('Terraria', 'Main');
const SystemFile = new NativeClass('System.IO', 'File');
const Exists = SystemFile['bool Exists(string path)'];
const ConstrutorJavaObj = AndroidJavaObject['void .ctor(string className, object[] args)'];
const CallVoid = AndroidJavaObject['void Call(string methodName, object[] args)'];

export class AndroidSound {
    constructor(fileName, defaultVolume = 1.0, isLooping = false) {
        this.filePath = tl.mod.path + '/' + fileName;
        this.defaultVolume = defaultVolume;
        this.isLooping = isLooping;
        this.nativePlayer = null;
        this._initializePlayer();
    }

    _initializePlayer() {
        if (!Exists(this.filePath)) {
            throw new Error(`Audio ${this.filePath} not found`);
        }
        this.nativePlayer = AndroidJavaObject.new();
        const emptyArgs = CreateInstance(ObjectType, 0);
        ConstrutorJavaObj(this.nativePlayer, 'android.media.MediaPlayer', emptyArgs);

        const sourceArgs = CreateInstance(ObjectType, 1);
        SetValue(sourceArgs, NativeObject.wrap(this.filePath, 'string'), 0);
        CallVoid(this.nativePlayer, 'setDataSource', sourceArgs);
        CallVoid(this.nativePlayer, 'prepare', emptyArgs);

        if (this.isLooping) {
            const loopArgs = CreateInstance(ObjectType, 1);
            SetValue(loopArgs, NativeObject.wrap(true, 'bool'), 0);
            CallVoid(this.nativePlayer, 'setLooping', loopArgs);
        }

        this.setNativeVolume(this.defaultVolume, this.defaultVolume);
    }

    setNativeVolume(leftVolume, rightVolume) {
        if (!this.nativePlayer) return;
        const volumeArgs = CreateInstance(ObjectType, 2);
        SetValue(volumeArgs, NativeObject.wrap(leftVolume, 'float'), 0);
        SetValue(volumeArgs, NativeObject.wrap(rightVolume, 'float'), 1);
        CallVoid(this.nativePlayer, 'setVolume', volumeArgs);
    }
}

export class AndroidSoundManager {
    static play(soundInstance, targetX = null, targetY = null, maxDistance = 900) {
        if (!soundInstance || !soundInstance.nativePlayer) return;

        let finalLeftVolume = soundInstance.defaultVolume;
        let finalRightVolume = soundInstance.defaultVolume;

        if (targetX !== null && targetY !== null && TerrariaMain.LocalPlayer) {
            const playerPosition = TerrariaMain.LocalPlayer.Center;

            if (playerPosition) {
                const deltaX = targetX - playerPosition.X;
                const deltaY = targetY - playerPosition.Y;
                const linearDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                if (linearDistance > maxDistance) return;

                const soundIntensity = 1.0 - (linearDistance / maxDistance);
                let panBalance = deltaX / maxDistance;
                panBalance = Math.max(-1, Math.min(1, panBalance));

                finalLeftVolume = soundIntensity * (panBalance < 0 ? 1.0 : 1.0 - panBalance) * soundInstance.defaultVolume;
                finalRightVolume = soundIntensity * (panBalance > 0 ? 1.0 : 1.0 + panBalance) * soundInstance.defaultVolume;
            }
        }

        soundInstance.setNativeVolume(finalLeftVolume, finalRightVolume);

        const seekArgs = CreateInstance(ObjectType, 1);
        SetValue(seekArgs, NativeObject.wrap(0, 'int'), 0);
        CallVoid(soundInstance.nativePlayer, 'seekTo', seekArgs);

        const emptyArgs = CreateInstance(ObjectType, 0);
        CallVoid(soundInstance.nativePlayer, 'start', emptyArgs);
    }
    
    static playByName(id, targetX = null, targetY = null, maxDistance = 900) {
        let sound = NativeSound.Get(id)
        if (sound)
        return this.play(sound, targetX, targetY, maxDistance)
    }
    
    static stopByName(id, targetX = null, targetY = null, maxDistance = 900) {
        let sound = NativeSound.Get(id)
        if (sound)
        return this.stop(sound)
    }
    
    
    static stop(soundInstance) {
        if (!soundInstance || !soundInstance.nativePlayer) return;
        const emptyArgs = CreateInstance(ObjectType, 0);
        CallVoid(soundInstance.nativePlayer, 'pause', emptyArgs);
    }
}


class NativeSound{
    static SoundData = new Map()
    static Get = id => this.SoundData.get(id)
    
    static New(fileName, id, defaultVolume = 1.0, isLooping = false) {
     
     if (this.Get(id)) return this.Get(id);
     let instance = new AndroidSound(fileName, defaultVolume, isLooping)
     
     if (id) this.SoundData.set(id, instance)
     return instance
     
    }
    static Manager = AndroidSoundManager
}

globalThis.NativeSound = NativeSound