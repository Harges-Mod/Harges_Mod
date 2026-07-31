import { Terraria } from './../../../TL/ModImports.js';
import { ModBuff } from './../../../TL/ModBuff.js';
import { ModProjectile } from './../../../TL/ModProjectile.js';

export class ExamplePetBuff extends ModBuff {
    constructor() {
        super();
        this.Texture = 'Pets/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Terraria.Main.buffNoTimeDisplay[this.Type] = true;
        Terraria.Main.vanityPet[this.Type] = true;
    }
    
    UpdatePlayer(player, buffIndex) {
        if (!this.petType)
            this.petType = ModProjectile.getTypeByName('ExamplePetProjectile');
        
        player.BuffHandle_SpawnPetIfNeededAndSetTime(buffIndex, true, this.petType, 3600);
    }
}