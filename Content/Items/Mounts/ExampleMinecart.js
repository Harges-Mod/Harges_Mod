import { Terraria } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';
import { ModMount } from './../../../TL/ModMount.js';

export class ExampleMinecart extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Mounts/' + this.constructor.name;
    }
    
    SetDefaults() {
        this.Item.value = Terraria.Item.sellPrice(0, 1, 0 ,0);
        this.Item.rare = Terraria.ID.ItemRarityID.Blue;
    }
    
    PostSetupContent() {
        this.Item.mountType = ModMount.getTypeByName('ExampleMinecartMount');
    }
}