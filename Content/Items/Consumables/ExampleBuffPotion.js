import { Terraria, Microsoft, Modules } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';
import { ModBuff } from './../../../TL/ModBuff.js';

const { Color } = Modules;

export class ExampleBuffPotion extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Consumables/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Terraria.ID.ItemID.Sets.DrinkParticleColors[this.Type] = [
            Color.new(240, 240, 240),
            Color.new(200, 200, 200),
            Color.new(140, 140, 140)
        ].makeGeneric(Microsoft.Xna.Framework.Graphics.Color);
    }
    
    SetDefaults() {
        this.Item.useStyle = Terraria.ID.ItemUseStyleID.DrinkLiquid;
        this.Item.useAnimation = 15;
        this.Item.useTime = 15;
        this.Item.useTurn = true;
        
        this.Item.UseSound = Terraria.ID.SoundID.Item3;
        this.Item.maxStack = 9999;
        this.Item.consumable = true;
        this.Item.rare = Terraria.ID.ItemRarityID.Orange;
        this.Item.value = Terraria.Item.sellPrice(0, 1, 0, 0);
        
        this.Item.buffType = ModBuff.getTypeByName('ExampleDefenseBuff');
        this.Item.buffTime = 5400;
    }
    
        UseItem(item, player) {
        if (player.whoAmI === Terraria.Main.myPlayer) {
        
        }
        }
        
}