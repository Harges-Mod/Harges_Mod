import { Terraria } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';

export class ExampleQuestFish extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Quests/' + this.constructor.name;
    }
    
    SetDefaults() {
        this.DefaultToQuestFish();
    }
    
    IsQuestFish() {
        return true;
    }
}