import { Terraria } from './../../TL/ModImports.js';
import { ModHair } from './../../TL/ModHair.js';

export class ExampleHair extends ModHair {
    constructor() {
        super();
    }
    
    IsUnlocked(isAtCharacterCreation, isAtStylist) {
        // If you're creating a character, it's always available
        if (isAtCharacterCreation) return true;
        
        // The Stylist can only sell it during the day
        if (isAtStylist && Terraria.Main.dayTime) return true;
        
        // Otherwise it is not available
        return false;
    }
}