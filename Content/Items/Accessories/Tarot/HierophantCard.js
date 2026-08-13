GlobalImports.AllModules();

using('Terraria');


export class HierophantCard extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Accessories/Tarot/' + this.constructor.name;
    }

    SetDefaults() {
    	this.Item.accessory = true;
        this.Item.expert = true 
        
        this.Item.rare = Terraria.ID.ItemRarityID.Blue;
        this.Item.useAnimation = 30;
        this.Item.useTime = 30;
        this.Item.useStyle = Terraria.ID.ItemUseStyleID.HoldUp;
    }

    AddRecipes() {
    	// Tarot Card Recipe
    }
    
    UpdateAccessory(item, player, vanity, hideVisual) {
        if (vanity) return;
        
        ModPlayer.Get('HargesMMode')[this.constructor.name] = true;
    }
    
    
}
