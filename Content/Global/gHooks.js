import { Terraria } from './../../TL/ModImports.js';
import { GlobalHooks } from './../../TL/GlobalHooks.js';

export class gHooks extends GlobalHooks {
    constructor() {
        super();
        this.worldName = '';
    }
    
    Initialize() {
        // Initialize your Hooks here
    }
    
    // Example of temporary data - used in './Content/Global/gPlayer.js' to display the welcome message
    OnWorldLoad() {
        this.worldName = Terraria.Main.worldName;
    }
    
    OnWorldUnload() {
        this.worldName = '';
    }
}