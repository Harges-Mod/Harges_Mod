import { Terraria } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';
import { ModBuff } from './../../../TL/ModBuff.js';
import { ModProjectile } from './../../../TL/ModProjectile.js';

export class ExamplePetItem extends ModItem {
    constructor() {
        super();
        this.Texture = 'Pets/' + this.constructor.name;
    }
    
    SetDefaults() {
        this.Item.damage = 0;
        this.Item.noMelee = true;
        
        this.Item.useStyle = Terraria.ID.ItemUseStyleID.Swing;
        this.Item.useAnimation = 20;
        this.Item.useTime = 20;
        
        this.Item.UseSound = Terraria.ID.SoundID.Item2;
        this.Item.value = Terraria.Item.sellPrice(0, 3, 0, 0);
        this.Item.rare = Terraria.ID.ItemRarityID.Orange;
        
        this.Item.shoot = ModProjectile.getTypeByName('ExamplePetProjectile');
        this.Item.buffType = ModBuff.getTypeByName('ExamplePetBuff');
    }
    
    UseItem(item, player) {
        player.AddBuff(item.buffType, 3600, false);
    }
}