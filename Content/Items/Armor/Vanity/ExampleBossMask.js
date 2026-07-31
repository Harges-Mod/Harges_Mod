import { Terraria } from './../../../../TL/ModImports.js';
import { ModItem } from './../../../../TL/ModItem.js';

export class ExampleBossMask extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Armor/Vanity/' + this.constructor.name;
    }
    
    SetDefaults() {
        // Common values for every boss mask
        this.Item.rare = Terraria.ID.ItemRarityID.Blue;
        this.Item.value = Terraria.Item.sellPrice(0, 0, 75, 0);
        this.Item.vanity = true;
        this.Item.maxStack = 1;
    }
}