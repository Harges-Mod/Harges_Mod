import { Terraria } from './../../TL/ModImports.js';
import { ModBuff } from './../../TL/ModBuff.js';

export class ExampleDefenseBuff extends ModBuff {
    constructor() {
        super();
        this.Texture = 'Buffs/' + this.constructor.name;
        this.DefenseBonus = 10;
    }
    
    ModifyDescription() {
        this.Description = this.Description.replace('{0}', this.DefenseBonus);
    }
    
    UpdatePlayer(player, buffIndex) {
        player.statDefense += this.DefenseBonus;
    }
}