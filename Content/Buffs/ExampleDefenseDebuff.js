import { Terraria } from './../../TL/ModImports.js';
import { ModBuff } from './../../TL/ModBuff.js';
import { ModPlayer } from './../../TL/ModPlayer.js';

export class ExampleDefenseDebuff extends ModBuff {
    constructor() {
        super();
        this.Texture = 'Buffs/' + this.constructor.name;
        this.DefenseReductionPercent = 25;
        this.DefenseMultiplier = 1 - this.DefenseReductionPercent / 100;
    }
    
    SetStaticDefaults() {
        Terraria.Main.debuff[this.Type] = true;
    }
    
    ModifyDescription() {
        this.Description = this.Description.replace('{0}', this.DefenseReductionPercent);
    }
    
    UpdatePlayer(player, buffIndex) {
        if (!this.gPlayer) this.gPlayer = ModPlayer.getByName('gPlayer');
        this.gPlayer.ExampleDefenseDebuff = true;
    }
}