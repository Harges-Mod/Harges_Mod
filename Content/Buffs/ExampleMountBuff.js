import { Terraria } from './../../TL/ModImports.js';
import { ModBuff } from './../../TL/ModBuff.js';
import { ModMount } from './../../TL/ModMount.js';

/**
 * This buff will be linked to the mount when it is registered
 * see: 'Content/Mounts/ExampleMount.js'
 */
export class ExampleMountBuff extends ModBuff {
    constructor() {
        super();
        this.Texture = 'Buffs/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Terraria.Main.buffNoTimeDisplay[this.Type] = true; // The time remaining won't display on this buff
        Terraria.Main.buffNoSave[this.Type] = true; // This buff won't save when you exit the world
    }
    
    UpdatePlayer(player, buffIndex) {
        player.mount.SetMount(ModMount.getTypeByName('ExampleMount'), player, false);
        player.buffTime[buffIndex] = 10; // reset buff time
    }
}