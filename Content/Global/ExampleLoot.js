import { Terraria } from './../../TL/ModImports.js';
import { GlobalLoot } from './../../TL/GlobalLoot.js';

const { ItemID, NPCID } = Terraria.ID;
const { ItemDropRule } = Terraria.GameContent.ItemDropRules;

export class ExampleLoot extends GlobalLoot {
    constructor(itemDropsDatabase) {
        super(itemDropsDatabase);
    }
    
    ModifyGlobalLoot() {
        // In this example, we will make the Demolitionist NPC drop between 1 and 3 Dynamite with a 10% chance. (1/10 = 0.1 = 10%)
        // 1. Create an ItemDropRule
        const itemDropRule = ItemDropRule.Common(ItemID.Dynamite, 10, 1, 3);
        // 2. Add to NPC
        this.RegisterToNPC(NPCID.Demolitionist, itemDropRule);
        
        // In this other example, we will remove the item "ObsidianRose" from the NPC "FireImp"
        // 1. We need to get the ItemDropRule from ObsidianRose
        let obsidianRoseRule = null;
        const fireImpRules = this.GetRulesForNPCID(NPCID.FireImp).ToArray();
        for (let i = 0; fireImpRules.length; i++) {
            const rule = fireImpRules[i];
            // Here we compare the result of each ItemDropRule from the NPC FireImp and return the result from ObsidianRose
            let _type = -1;
            try { _type = rule.itemId; } catch {}
            if (_type === ItemID.ObsidianRose) {
                obsidianRoseRule = rule;
                break;
            }
        }
        // 2. Now we will remove it from the NPC
        if (obsidianRoseRule !== null) {
            this.RemoveFromNPC(NPCID.FireImp, obsidianRoseRule);
        }
    }
}