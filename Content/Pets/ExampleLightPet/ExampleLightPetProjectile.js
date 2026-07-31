import { Terraria, Microsoft, Modules } from './../../../TL/ModImports.js';
import { BuffLoader } from './../../../TL/Loaders/BuffLoader.js';
import { ModProjectile } from './../../../TL/ModProjectile.js';

const { Vector2, Rectangle, Color } = Modules;

export class ExampleLightPetProjectile extends ModProjectile {
	constructor() {
		super();
		this.Texture = 'Pets/' + this.constructor.name;
	}
	
	SetStaticDefaults() {
		Terraria.Main.projFrames[this.Type] = 1;
		Terraria.Main.projPet[this.Type] = true;
		
		this.trailScaleDecay = 0.015;
        this.trailAlpha = 0.75;
        Terraria.ID.ProjectileID.Sets.TrailCacheLength[this.Type] = 4;
		Terraria.ID.ProjectileID.Sets.TrailingMode[this.Type] = 2;
		
		Terraria.ID.ProjectileID.Sets.LightPet[this.Type] = true;
	}
    
	SetDefaults() {
		this.Projectile.width = 30;
		this.Projectile.height = 30;
		this.Projectile.penetrate = -1;
		this.Projectile.netImportant = true;
		this.Projectile.minionSlots = 1;
		this.Projectile.timeLeft = 18000;
		this.Projectile.friendly = true;
		this.Projectile.ignoreWater = true;
		this.Projectile.scale = 0.8;
		this.Projectile.tileCollide = false;
	}
	
	AI(proj) {
	    if (!this.buffType) {
	        this.buffType = BuffLoader.getTypeByName('ExampleLightPetBuff');
	    }
	    
	    const player = Terraria.Main.player[Terraria.Main.myPlayer];
	    
	    // Despawn
	    if (player.dead || player.FindBuffIndex(this.buffType) < 0) {
	        proj.timeLeft = 0;
	        return;
	    }
	    
	    const toPlayerX = player.Center.X - proj.Center.X;
        const toPlayerY = player.Center.Y - proj.Center.Y;
        const distance = Math.sqrt(toPlayerX*toPlayerX + toPlayerY*toPlayerY);
        
        let dirX = toPlayerX / distance || 0;
        let dirY = toPlayerY / distance || 0;
        
        let speed = 5;
        let turnSpeed = 0.05;
        let rotSpeed = 0.05;
        
        if (distance > 450) {
            speed *= 1 + distance * 0.005;
        }
        
        if (distance < 48) {
            const angle = Math.atan2(toPlayerY, toPlayerX) + Math.PI / 2;
            proj.velocity = Vector2.new(
                Math.cos(angle) * speed * 0.85,
                Math.sin(angle) * speed * 0.85
            );
            proj.rotation += 0.05;
        } else {
            proj.velocity = Vector2.new(
                proj.velocity.X * (1 - turnSpeed) + dirX * speed * turnSpeed,
                proj.velocity.Y * (1 - turnSpeed) + dirY * speed * turnSpeed
            );
        }
        
        const targetRot = Math.atan2(proj.velocity.Y, proj.velocity.X) + Math.PI / 2;
        proj.rotation = Terraria.Utils.AngleLerp(proj.rotation, targetRot, rotSpeed);
	}
	
	// Trail
	PreDraw(proj) {
        const texture = Terraria.GameContent.TextureAssets.Projectile[this.Type].Value;
        const drawOrigin = Vector2.new(texture.Width * 0.5, texture.Height * 0.5);
        const effects = Microsoft.Xna.Framework.Graphics.SpriteEffects.None;
        for (let k = proj.oldPos.Length - 1; k > 0; k--) {
            let drawPos = Vector2.Subtract(proj.oldPos.get_Item(k), Terraria.Main.screenPosition);
            drawPos = Vector2.Add(drawPos, Vector2.new(drawOrigin.X, drawOrigin.Y + proj.gfxOffY));
            const alpha = this.trailAlpha * (1 - k / proj.oldPos.Length);
            const color = Color.Lerp(Color.Transparent, Color.White, alpha);
            const scale = Math.max(proj.scale - k * this.trailScaleDecay);
            Terraria.Main.spriteBatch['void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)'
            ](texture, drawPos, null, color, proj.rotation, drawOrigin, scale, effects, 0);
        }
        return true;
    }
}