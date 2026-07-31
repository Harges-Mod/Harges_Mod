GlobalImports.AllModules();

import { Terraria } from './../../TL/ModImports.js';
import { ModItem } from './../../TL/ModItem.js';

using('Terraria');


export class AriesCry extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/' + this.constructor.name;

        this.modes = [
            { name: "Rage Cry", mult: 3.0 }, 
            { name: "Calm Cry", mult: 0.5 },
            { name: "Normal Cry", mult: 1.0 } 
        ];
        
        this.currentModeIndex = 2;
    }

    SetDefaults() {
        this.Item.value = Terraria.Item.sellPrice(0, 0, 1, 0);
        this.Item.rare = Terraria.ID.ItemRarityID.Blue;
        this.Item.useAnimation = 30;
        this.Item.useTime = 30;
        this.Item.useStyle = Terraria.ID.ItemUseStyleID.HoldUp;
    }

    AddRecipes() {
        this.CreateRecipe(1)
            .AddIngredient(Terraria.ID.ItemID.CalmingPotion, 20)
            .AddIngredient(Terraria.ID.ItemID.BattlePotion, 20)
            .AddTile(Terraria.ID.TileID.WorkBenches)
            .Register();
    }
    
    applySpawnMultiplier = (mult) => {
        const rate = Math.max(1, Math.round(600 / mult));
        const max = Math.round(5 * mult);
    
        Terraria.NPC.spawnRate = rate;
        Terraria.NPC.defaultSpawnRate = rate;
        Terraria.NPC.maxSpawns = max;
        Terraria.NPC.defaultMaxSpawns = max;
    };
    
    UseItem(item, player) {
        if (player.whoAmI === Terraria.Main.myPlayer) {
            this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
            
            const activeMode = this.modes[this.currentModeIndex];
            
            this.applySpawnMultiplier(activeMode.mult);
            
            ModPlayer.getByName('HargesMMode')
            .ModCombatText(`Mode: ${activeMode.name}`, Color.Blue)
            
        }
        return true;
    }
}
