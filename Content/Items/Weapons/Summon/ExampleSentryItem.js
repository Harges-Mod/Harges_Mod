import { Terraria, Modules } from './../../../../TL/ModImports.js';
import { ModItem } from './../../../../TL/ModItem.js';
import { ModProjectile } from './../../../../TL/ModProjectile.js';

const { Vector2 } = Modules;
const NewProjectile = Terraria.Projectile['int NewProjectile(IEntitySource spawnSource, Vector2 position, Vector2 velocity, int Type, int Damage, float KnockBack, int Owner, float ai0, float ai1, float ai2, NewProjectileModifier modifer)'];

export class ExampleSentryItem extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Weapons/Summon/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Terraria.ID.ItemID.Sets.GamepadWholeScreenUseRange[this.Type] = true;
        Terraria.ID.ItemID.Sets.LockOnIgnoresCollision[this.Type] = true;
    }
    
    SetDefaults() {
        this.Item.damage = 50;
        this.Item.knockBack = 3;
        this.Item.noMelee = true;
        this.Item.sentry = true;
        this.Item.summon = true;
        
        this.Item.useTime = this.Item.useAnimation = 30;
        this.Item.useStyle = Terraria.ID.ItemUseStyleID.Swing;
        
        this.Item.value = Terraria.Item.buyPrice(0, 30, 0, 0);
        this.Item.rare = Terraria.ID.ItemRarityID.Cyan;
        this.Item.UseSound = Terraria.ID.SoundID.Item83;
        
        this.Item.mana = 10;
        this.Item.shoot = ModProjectile.getTypeByName('ExampleSentry');
    }
    
    ModifyShootStats(item, player, stats) {
        stats.position = Terraria.Main.MouseWorld;
    }
    
    Shoot(item, player, position, velocity, type, damage, knockBack) {
        position = this.LimitPointToPlayerReachableArea(player, position);
        
        // This code will "snap" the sentry to the floor.
        let canSpawn = this.FindRestingSpot(position);
        if (!canSpawn) return false;
        
        // Spawn the sentry projectile at the calculated location.
        const idx = NewProjectile(
            player.GetProjectileSource_Item(item),
            position, Vector2.Zero, type,
            0, knockBack, player.whoAmI, 0, 0, 0, null
        );
        const proj = Terraria.Main.projectile[idx];
        proj.originalDamage = damage;
        
        // Kills older sentry projectiles according to player.maxTurrets
        player.UpdateMaxTurrets();
        
        return false;
    }
    
    LimitPointToPlayerReachableArea(player, pointPosition) {
        const worldBorders = Terraria.WorldBuilding.WorldUtils.ClampToWorldBorders(Terraria.Utils['Rectangle CenteredRectangle(Vector2 center, Vector2 size)'](player.Center, Terraria.Utils['Vector2 ToVector2(Point p)'](Terraria.Main.MaxWorldViewSize)));
        const vector2_1 = Terraria.Utils['Vector2 ToVector2(Point p)'](worldBorders.Center);
        const vector2_2 = Vector2.Subtract(pointPosition, vector2_1);
        let num1 = Math.abs(vector2_2.X),
        num2 = Math.abs(vector2_2.Y),
        num3 = 1, num4 = worldBorders.Width / 2;
        if (num1 > num4) {
            let num5 = num4 / num1;
            if (num3 > num5) num3 = num5;
        }
        let num6 = worldBorders.Height / 2;
        if (num2 > num6) {
            let num7 = num6 / num2;
            if (num3 > num7) num3 = num7;
        }
        const vector2_3 = Vector2.Multiply(vector2_2, num3);
        return Vector2.Add(vector2_1, vector2_3);
    }
    
    FindRestingSpot(position) {
        let flag = false;
        let x = Math.floor(position.X / 16);
        position.X = x * 16;
        let y = Math.floor(position.Y / 16);
        const maxY = Math.min(y + 25, Terraria.Main.maxTilesY);
        
        while (y < maxY) {
            position.Y = y * 16;
            const tile = Terraria.Main.tile.get_Item(x, y);
            if (tile['bool active()']()) {
                if (Terraria.Main.tileSolid[tile.type]) {
                    flag = true;
                    position.Y -= tile['bool halfBrick()']() ? 8 : 16;
                    break;
                }
            }
            y++;
        }
        
        return flag;
    }
}