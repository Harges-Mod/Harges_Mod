import { Terraria } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';

export class ExampleHamaxe extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Tools/' + this.constructor.name;
    }
    
    SetDefaults() {
        this.Item.melee = true;
        this.Item.axe = 30;
        this.Item.hammer = 100;
        
        // (damage, knockback, crit);
        this.SetWeaponValues(25, 6, 0);
        // (useTime, autoReuse);
        this.SetDefaultWeaponStyle(15, true);
        
        this.Item.value = Terraria.Item.sellPrice(0, 1, 0, 0);
        this.Item.rare = Terraria.ID.ItemRarityID.Green;
        this.Item.UseSound = Terraria.ID.SoundID.Item1;
    }
}