import { Terraria } from './../../TL/ModImports.js';
import { ModAchievement } from './../../TL/ModAchievement.js';
import { ModNPC } from './../../TL/ModNPC.js';

export class ManyWormsKilled extends ModAchievement {
    constructor() {
        super();
        this.Texture = 'Achievements/' + this.constructor.name;
    }
    
    // There are 4 AchievementCategory options: Slayer, Collector, Explorer, and Challenger.
    // Slayer is the default.
    get Category() {
        return Terraria.Achievements.AchievementCategory.Collector;
    }
    
    SetStaticDefaults() {
        // Unlike ExampleBossKilled, which uses AddNPCKilledCondition, this ModAchievement uses AddIntCondition to track the 5 kills. This is necessary because AddNPCKilledCondition only supports tracking a single kill.
        this.AddIntCondition('ManyWormsKilled', 5);
        this.UseTrackerFromCondition('ManyWormsKilled');
    }
    
    OnNPCKilled(player, npcId) {
        if (player.whoAmI !== Terraria.Main.myPlayer) return;
        
        if (npcId === 10) {
            // Int conditions will automatically complete once you've incremented it enough. There is no need to call the Complete method manually.
            const condition = this.Achievement.GetCondition('ManyWormsKilled');
            condition.Value++;
        }
    }
}