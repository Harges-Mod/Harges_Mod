import { Terraria } from './../ModImports.js';

export class SystemLoader {
    static RegisteredSystems = [];
    
    static getByName(name) { return this.RegisteredSystems.find(s => s.constructor.name === name); }
    
    static _tick = 0;
    static _tasks = [];
    
    static OnModLoad() {
        for (const system of this.RegisteredSystems) {
            system?.OnModLoad();
        }
    }
    
    static SetupContent() {
        for (const system of this.RegisteredSystems) {
            system?.SetupContent();
        }
    }
    
    static PostSetupContent() {
        for (const system of this.RegisteredSystems) {
            system?.PostSetupContent();
        }
    }
    
    static DrawBehindEntity() {
        for (const system of this.RegisteredSystems) {
            system?.DrawBehindEntity();
        }
    }
    
    static DrawPostEntity() {
        for (const system of this.RegisteredSystems) {
            system?.DrawPostEntity();
        }
    }
    
    static OnLocalizationsLoaded() {
        for (const system of this.RegisteredSystems) {
            system?.OnLocalizationsLoaded();
        }
    }
    
    static AddRecipeGroups() {
        for (const system of this.RegisteredSystems) {
            system?.AddRecipeGroups();
        }
    }
    
    static PostDrawInterface() {
        for (const system of this.RegisteredSystems) {
            system?.PostDrawInterface();
        }
    }
    
    static AddRecipes() {
        for (const system of this.RegisteredSystems) {
            system?.AddRecipes();
        }
    }
    
    static OnWorldLoad() {
        this._tick = 0;
        this._tasks = [];
        for (const system of this.RegisteredSystems) {
            system?.OnWorldLoad();
        }
    }
    
    static OnWorldUnload() {
        this._tick = 0;
        this._tasks = [];
        const arr = this.RegisteredSystems;
        const len = arr.length;
        for (let i = 1; i < len; i++) {
            arr[i]?.OnWorldUnload();
        }
        if (len > 0) arr[0]?.OnWorldUnload();
    }
    
    static PreSaveAndQuit() {
        const arr = this.RegisteredSystems;
        const len = arr.length;
        for (let i = 1; i < len; i++) {
            arr[i]?.PreSaveAndQuit();
        }
        if (len > 0) arr[0]?.PreSaveAndQuit();
    }
    
    static PreUpdateTime() {
        for (const system of this.RegisteredSystems) {
            system?.PreUpdateTime();
        }
    }
    
    static PostUpdateTime() {
        for (const system of this.RegisteredSystems) {
            system?.PostUpdateTime();
        }
    }
    
    static OnStartDay() {
        for (const system of this.RegisteredSystems) {
            system?.OnStartDay();
        }
    }
    
    static OnStartNight() {
        for (const system of this.RegisteredSystems) {
            system?.OnStartNight();
        }
    }
    
    static SendMessage(player, message) {
        if (this.RegisteredSystems.some(s => (s?.SendMessage(player, message) ?? true) === false)) {
            return false;
        }
        return true;
    }
    
    static Pause() {
        if (this.RegisteredSystems.some(s => (s?.Pause() ?? true) === false)) {
            return false;
        }
        return false;
    }
    
    static Update(isActive) {
        if (!isActive) return;
        this._tick++;
        
        for (let i = 0; i < this._tasks.length; i++) {
            const t = this._tasks[i];
            if (this._tick >= t.next) {
                t.cb();
                if (t.repeat) {
                    if (t.stopCondition && t.stopCondition()) {
                        this._tasks.splice(i--, 1);
                        continue;
                    }
                    t.next += t.interval;
                } else this._tasks.splice(i--, 1);
            }
        }
        
    }
    
    static SetTimeout(cb, ticks) {
        this._tasks.push({ cb, next: this._tick + ticks, repeat: false });
    }

    static SetInterval(cb, ticks, stopCondition = null) {
        this._tasks.push({ cb, next: this._tick + ticks, interval: ticks, repeat: true, stopCondition });
    }
}