export class GoldShuriken extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Weapons/Ranged/' + this.constructor.name;
    }
    
    SetDefaults() {
      this.Item.ranged = true;
      this.Item.useStyle = 1;
      this.Item.shootSpeed = 8;
      this.Item.shoot = ModProjectile.getTypeByName('GoldShurikenProj');
      this.Item.damage = 30;
      this.Item.width = 18;
      this.Item.height = 20;
      this.Item.consumable = true;
      this.Item.UseSound = SoundID.Item1;
      this.Item.useAnimation = 15;
      this.Item.useTime = 15;
      this.Item.noUseGraphic = true;
      this.Item.noMelee = true;
      this.Item.value = 15;
      this.Item.ranged = true;
    }
    
    AddRecipes() {
        this.CreateRecipe(5)
        .AddIngredient(Terraria.ID.ItemID.Shuriken, 2)
        .AddIngredient(Terraria.ID.ItemID.GoldBar, 3)
        .AddTile(Terraria.ID.TileID.Anvils)
        .Register();
    }
    
}