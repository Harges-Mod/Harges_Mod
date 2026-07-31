import { Terraria } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';

export class ExampleBreastplate extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Armor/' + this.constructor.name;
    }
    
    SetDefaults() {
        this.Item.defense = 6;
        this.Item.value = Terraria.Item.sellPrice(0, 2, 0, 0);
        this.Item.rare = Terraria.ID.ItemRarityID.Green;
    }
}