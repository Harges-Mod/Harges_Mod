import { Terraria } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';

const { ItemDropRule } = Terraria.GameContent.ItemDropRules;

function Next(min = 0, max = 1) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function Roll(denominator = 1, numerator = 1) {
    return Math.random() < numerator / denominator;
}

export class ExampleBossBag extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Consumables/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Terraria.ID.ItemID.Sets.BossBag[this.Type] = true;
    }
    
    SetDefaults() {
        this.Item.maxStack = ModItem.CommonMaxStack;
        this.Item.consumable = true;
        this.Item.rare = Terraria.ID.ItemRarityID.Purple;
        this.Item.expert = true;
    }
    
    OpenBossBag(item, player) {
        const source = player[
        'IEntitySource GetItemSource_OpenItem(int itemType)'
        ](item.type);
        
        const QuickSpawnItem = player['void QuickSpawnItem(IEntitySource source, int item, int stack)'];
        
        // Hardmode bags can drop dev items
        //player.TryGettingDevArmor(source);
        
        // Drops:
        // see './Content/NPCs/ExampleBoss.js';
        
        // Boss Mask (1/7 ≈ 14.29% chance)
        if (Roll(7)) {
            QuickSpawnItem(source, ModItem.getTypeByName('ExampleBossMask'), 1);
        }
        
        // Example Item 15-30
        QuickSpawnItem(source, ModItem.getTypeByName('ExampleItem'), Next(15, 30));
    }
}