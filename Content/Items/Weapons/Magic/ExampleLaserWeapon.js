import { Terraria, Modules } from './../../../../TL/ModImports.js';
import { ModItem } from './../../../../TL/ModItem.js';
import { ModProjectile } from './../../../../TL/ModProjectile.js';

const { Color } = Modules;

export class ExampleLaserWeapon extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Weapons/Magic/' + this.constructor.name;
    }
    
    SetDefaults() {
        this.CloneDefaults(Terraria.ID.ItemID.LastPrism);
        this.Item.mana = 4;
        this.Item.damage = 42;
        this.Item.shoot = ModProjectile.getTypeByName('ExampleLaserHoldout');
        this.Item.shootSpeed = 1;
        this.Item.color = Color.White;
    }
    
    CanUseItem(item, player) {
        return player.ownedProjectileCounts[item.shoot] < 1;
    }
}