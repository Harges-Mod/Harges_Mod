import { Terraria, Microsoft } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';
import { ModProjectile } from './../../../TL/ModProjectile.js';

const Vec2 = (x, y) => Microsoft.Xna.Framework.Vector2.new()['void .ctor(float x, float y)'](x, y);

export class ExampleFishingRod extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Tools/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Terraria.ID.ItemID.Sets.CanFishInLava[this.Type] = true;
    }
    
    SetDefaults() {
        this.CloneDefaults(Terraria.ID.ItemID.WoodFishingPole);
        
        this.Item.fishingPole = 30;
        this.Item.shootSpeed = 12;
        this.Item.shoot = ModProjectile.getTypeByName('ExampleBobber');
    }
    
    HoldItem(item, player) {
        player.accFishingLine = true;
    }
}