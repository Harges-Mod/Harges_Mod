import { Terraria, Modules } from './../../TL/ModImports.js';
import { ModMount } from './../../TL/ModMount.js';
import { ModBuff } from './../../TL/ModBuff.js';

export class ExampleMinecartMount extends ModMount {
    constructor() {
        super();
        this.Texture = 'Mounts/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Terraria.ID.MountID.Sets.Cart[this.Type] = true;
        
        // Helper method setting many common properties for a minecart
        Terraria.Mount.SetAsMinecart(
            this.Data,
            ModBuff.getTypeByName('ExampleMinecartBuff'),
            this.Data.frontTexture,
            0,
            0
        );
        
        // Change properties on MountData here further, for example:
        this.Data.spawnDust = 21;
    }
}