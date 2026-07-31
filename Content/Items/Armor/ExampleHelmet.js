import { Terraria } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';
import { ModLocalization } from './../../../TL/ModLocalization.js';

export class ExampleHelmet extends ModItem {
    constructor() {
    	super();
        this.Texture = 'Items/Armor/' + this.constructor.name;
        this.ExtraMoveSpeedPercent = 20;
        this.ExtraMoveSpeedMultiplier = 1 + this.ExtraMoveSpeedPercent / 100;
    }
    
    SetDefaults() {
        this.Item.defense = 5;
        this.Item.value = Terraria.Item.sellPrice(0, 1, 0, 0);
        this.Item.rare = Terraria.ID.ItemRarityID.Green;
    }
    
    AddArmorSets() {
        const setBonusText = ModLocalization.getTranslationArmorSetBonus('CommonExtraSpeed'
        ).replace('{0}', this.ExtraMoveSpeedPercent);
        
        this.CreateArmorSet(
            this.Type,
            ModItem.getTypeByName('ExampleBreastplate'),
            ModItem.getTypeByName('ExampleLeggings'),
            setBonusText
        );
    }
    
    UpdateArmorSet(item, player) {
        player.moveSpeed *= this.ExtraMoveSpeedMultiplier;
    }
}