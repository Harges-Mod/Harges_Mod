import { Terraria } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';

export class ExampleLeggings extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Armor/' + this.constructor.name;
    }
    
    SetDefaults() {
        this.Item.defense = 5;
        this.Item.value = Terraria.Item.sellPrice(0, 1, 0, 0);
        this.Item.rare = Terraria.ID.ItemRarityID.Green;
    }
}