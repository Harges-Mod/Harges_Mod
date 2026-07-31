import { Terraria } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';
import { ModMount } from './../../../TL/ModMount.js';

export class ExampleMountItem extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Mounts/' + this.constructor.name;
    }
    
    SetDefaults() {
        this.Item.useTime = this.Item.useAnimation = 20;
        this.Item.useStyle = Terraria.ID.ItemUseStyleID.Swing;
        this.Item.UseSound = Terraria.ID.SoundID.Item79;
        this.Item.noMelee = true;
        this.Item.value = Terraria.Item.sellPrice(0, 3, 0 ,0);
        this.Item.rare = Terraria.ID.ItemRarityID.Green;
    }
    
    PostSetupContent() {
        this.Item.mountType = ModMount.getTypeByName('ExampleMount');
    }
}