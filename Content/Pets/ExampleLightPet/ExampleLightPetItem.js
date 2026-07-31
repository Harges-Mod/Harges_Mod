import { Terraria } from './../../../TL/ModImports.js';
import { ProjectileLoader } from './../../../TL/Loaders/ProjectileLoader.js';
import { BuffLoader } from './../../../TL/Loaders/BuffLoader.js';
import { ModItem } from './../../../TL/ModItem.js';

export class ExampleLightPetItem extends ModItem {
    constructor() {
        super();
        this.Texture = 'Pets/' + this.constructor.name;
    }
    
    SetDefaults() {
        this.Item.damage = 0;
        this.Item.useStyle = Terraria.ID.ItemUseStyleID.Swing;
        this.Item.shoot = ProjectileLoader.getTypeByName('ExampleLightPetProjectile');
        this.Item.UseSound = Terraria.ID.SoundID.Item2;
        this.Item.useAnimation = 20;
        this.Item.useTime = 20;
        this.Item.rare = Terraria.ID.ItemRarityID.Orange;
        this.Item.noMelee = true;
        this.Item.value = Terraria.Item.sellPrice(0, 1, 0, 0);
        this.Item.buffType = BuffLoader.getTypeByName('ExampleLightPetBuff');
    }
    
    UseItem(item, player) {
        player.AddBuff(item.buffType, 3600, false);
    }
}