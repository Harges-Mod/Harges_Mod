import { Terraria } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';
import { ModProjectile } from './../../../TL/ModProjectile.js';

export class ExampleDrill extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Tools/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Terraria.ID.ItemID.Sets.IsDrill[this.Type] = true;
    }
    
    SetDefaults() {
        this.Item.damage = 27;
        this.Item.melee = true;
        this.Item.shoot = ModProjectile.getTypeByName('ExampleDrillProjectile');
        this.Item.shootSpeed = 32;
        this.Item.useStyle = 5;
        this.Item.useTime = 4;
        this.Item.useAnimation = 15;
        this.Item.noMelee = true;
        this.Item.noUseGraphic = true;
        this.Item.channel = true;
        this.Item.pick = 190;
        this.Item.tileBoost = 10;
        this.Item.value = Terraria.Item.sellPrice(0, 12, 60, 0);
        this.Item.rare = Terraria.ID.ItemRarityID.Green;
        this.Item.UseSound = Terraria.ID.SoundID.Item23;
    }
}