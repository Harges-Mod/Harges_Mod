const { ItemDropRule, LeadingConditionRule, Conditions } = Terraria.GameContent.ItemDropRules;


export class VanillaLoot extends GlobalLoot {
    constructor(itemDropsDatabase) {
        super(itemDropsDatabase);
    }
    
    ModifyGlobalLoot() {
    
    const Visuals_drops = () =>{
        let neverCondition = Conditions.NeverTrue.new();

        let dummyCrate = ItemDropRule.ByCondition(neverCondition, ItemID.WoodenCrate, 3, 1, 2, 0);
        let dummyLife = ItemDropRule.ByCondition(neverCondition, ItemID.LifeCrystal, 2, 1, 2, 0);
        let dummyMana = ItemDropRule.ByCondition(neverCondition, ItemID.ManaCrystal, 2, 1, 2, 0);

        this.RegisterToNPC(NPCID.KingSlime, dummyCrate);
        this.RegisterToNPC(NPCID.KingSlime, dummyLife);
        this.RegisterToNPC(NPCID.KingSlime, dummyMana);
    }
    
    Visuals_drops()
    
    }
}