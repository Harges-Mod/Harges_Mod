import { ModAchievement } from './../../TL/ModAchievement.js';
import { ModNPC } from './../../TL/ModNPC.js';

export class ExampleBossKilled extends ModAchievement {
    constructor() {
        super();
        this.Texture = 'Achievements/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
       // this.AddNPCKilledCondition(ModNPC.getTypeByName('ExampleBoss'));
    }
}