import { SystemLoader } from './Loaders/SystemLoader.js';

export class ModSystem {

    static instance = []
    
    constructor() {
        return ModSystem.instance.push(this)
    }
    
    OnModLoad() {}
    
    SetupContent() {}
    
    PostSetupContent() {}
    
    OnLocalizationsLoaded() {}
    
    AddRecipeGroups() {}
    
    AddRecipes() {}
    
    OnWorldLoad() {}
    
    OnWorldUnload() {}
    
    PreSaveAndQuit() {}
    
    PreUpdateTime() {}
    
    PostUpdateTime() {}
    
    OnStartDay() {}
    
    OnStartNight() {}
    
    DrawBehindEntity() {}    
    
    DrawPostEntity() {}
    
    
    PostDrawInterface() {}
    
    SendMessage(player, message) {
        return true;
    }
    
    static SetTimeout(cb, delay) {
        SystemLoader.SetTimeout(cb, delay);
    }
    
    static SetInterval(cb, interval, stopCondition = null) {
        SystemLoader.SetInterval(cb, interval, stopCondition);
    }
    
    static register(system) {
        SystemLoader.RegisteredSystems.push(new system());
    }
    static getByName(name) { return SystemLoader.getByName(name); }
}