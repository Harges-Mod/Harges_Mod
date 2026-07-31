export class SupremeRuby extends ModItem{
        
        
        constructor() {
            super()
            this.Texture = "Textures/Items/Accessories/MMode/"+this.constructor.name
        }
        
        SetDefaults() {
        this.Item.accessory = true;
        this.Item.expert = true 
        this.Item.rare = Terraria.ID.ItemRarityID.Red;
        this.Item.value = Terraria.Item.sellPrice(0, 1, 0, 0);
    }
    
    UpdateAccessory(item, player, vanity, hideVisual) {
        if (vanity) return;
        
        ModPlayer.Get('HargesMMode').SupremeRuby = true;
    }
    
}