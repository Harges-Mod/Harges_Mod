import { Terraria } from './../../TL/ModImports.js';
import { ModBuff } from './../../TL/ModBuff.js';

const GetTextValue = Terraria.Localization.Language['string GetTextValue(string key)'];

/**
 * This buff will be linked to the mount when it is registered
 * see: 'Content/Mounts/ExampleMinecartMount.js'
 */
export class ExampleMinecartBuff extends ModBuff {
    constructor() {
        super();
        this.Texture = 'Buffs/' + this.constructor.name;
    }
    
    ModifyDisplayName() {
        // Use the vanilla DisplayName ("Minecart")
        this.DisplayName = GetTextValue('BuffName.Minecart');
    }
    
    ModifyDescription() {
        // Use the vanilla Description
        this.Description = GetTextValue('BuffDescription.Minecart');
    }
}