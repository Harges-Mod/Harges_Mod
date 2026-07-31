import { Terraria, Microsoft, Modules } from './../../TL/ModImports.js';
import { ModProjectile } from './../../TL/ModProjectile.js';

const { Color, Rectangle, Vector2 } = Modules;
const { SpriteEffects } = Microsoft.Xna.Framework.Graphics;

const EntitySpriteDraw = Terraria.Main['void EntitySpriteDraw(Texture2D texture, Vector2 position, Rectangle sourceRectangle, Color color, float rotation, Vector2 origin, Vector2 scale, SpriteEffects effects, float worthless)'];

export class SlimeRubyLaser extends ModProjectile {
    constructor() {
        super();
        this.Texture = 'Projectiles/Visual/ThinLaser';
        this.LaserRotation = 0;
        this.LengthMultiplier = 2.0; 
    }
    
    PostSetupContent() {
        this.TextureAsset = Terraria.GameContent.TextureAssets.Projectile[this.Type].Value;
        
    }
    
    SetDefaults() {
        // Tamanho base compacto — o ModifyDamageHitbox expande dinamicamente no mundo
        this.Projectile.width = 2000 
        this.Projectile.height = 2000;
        this.Projectile.friendly = false; 
        this.Projectile.hostile = true;   
        this.Projectile.penetrate = -1; 
        this.Projectile.tileCollide = false;
        this.Projectile.scale = 1.0;
        this.Projectile.timeLeft = 60; 
        this.Projectile.ignoreWater = true;
        this.Projectile.usesLocalNPCInterval = true;
          this.Projectile.localNPCHitCooldown = 10; 
    }

    AI(proj) {  
        
        // Fix rotation with P over 2.
        if (proj.velocity.X !== 0 || proj.velocity.Y !== 0) {
            this.LaserRotation = Math.atan2(proj.velocity.Y, proj.velocity.X) - (Math.PI / 2);
            proj.velocity = Vector2.Zero;
        }
        
        const maxTime = 60; 
        const timeLeft = proj.timeLeft;
        const fadeInTime = 10;  
        const fadeOutTime = 15; 

        // Animação da largura do laser
        if (timeLeft > maxTime - fadeInTime) {
            proj.scale = (maxTime - timeLeft) / fadeInTime;
        } else if (timeLeft < fadeOutTime) {
            proj.scale = timeLeft / fadeOutTime;
        } else {
            proj.scale = 1.0;
        }

        proj.rotation = this.LaserRotation;

        // Mantemos o buff customizado caso o jogador encoste
        if (proj.scale > 0.1) {
            this.ApplyBuffCheck(proj);
        }
    }
    

    // Calc the Hitbox Beasead on Rectangle Texture * this.LengthMultiplier
    ModifyDamageHitbox(proj, hitbox) {
        const texture = this.TextureAsset;
        if (!texture) return;

        const visualAngle = this.LaserRotation + (Math.PI / 2);
        const laserLength = texture.Height * this.LengthMultiplier;

        const startX = proj.Center.X;
        const startY = proj.Center.Y;
        const endX = startX + Math.cos(visualAngle) * laserLength;
        const endY = startY + Math.sin(visualAngle) * laserLength;

        const minX = Math.min(startX, endX) - 32;
        const minY = Math.min(startY, endY) - 32;
        const maxX = Math.max(startX, endX) + 32;
        const maxY = Math.max(startY, endY) + 32;

        hitbox.X = Math.floor(minX);
        hitbox.Y = Math.floor(minY);
        hitbox.Width = Math.floor(maxX - minX);
        hitbox.Height = Math.floor(maxY - minY);
    }
    
    Colliding(proj, projHitbox, targetHitbox) {
        const texture = this.TextureAsset;
        if (!texture) return false;

        const visualAngle = this.LaserRotation + (Math.PI / 2);
        const laserLength = texture.Height * this.LengthMultiplier;
        const laserHalfWidth = (texture.Width * proj.scale) / 2;

        const cos = Math.cos(visualAngle);
        const sin = Math.sin(visualAngle);

        const startX = proj.Center.X;
        const startY = proj.Center.Y;
        
        const targetCenterX = targetHitbox.X + targetHitbox.Width / 2;
        const targetCenterY = targetHitbox.Y + targetHitbox.Height / 2;

        const targetX = targetCenterX - startX;
        const targetY = targetCenterY - startY;

        // Animations
        const projection = targetX * cos + targetY * sin;
        const targetRadius = Math.max(targetHitbox.Width, targetHitbox.Height) / 2;

        if (projection >= 0 && projection <= laserLength + targetRadius) {
            const clampedProj = Math.min(Math.max(projection, 0), laserLength);
            const closestX = startX + cos * clampedProj;
            const closestY = startY + sin * clampedProj;

            const diffX = targetCenterX - closestX;
            const diffY = targetCenterY - closestY;
            const distanceSquared = diffX * diffX + diffY * diffY;

            const collisionRadius = laserHalfWidth + targetRadius;

            return distanceSquared <= collisionRadius * collisionRadius;
        }

        return false;
    }

    ApplyBuffCheck(proj) {
        // Reutilize colliding.
        const player = Terraria.Main.player[0];
        
        if (player.active && !player.dead && !player.ghost) {
            const playerHitbox = Rectangle.new(
                Math.floor(player.position.X), 
                Math.floor(player.position.Y), 
                player.width, 
                player.height
            );

            if (this.Colliding(proj, null, playerHitbox)) {
                player.AddBuff(ModBuff.getTypeByName('RubyFlame'), 60 * 2, true);
            }
        }
    }

    PreDraw(proj, lightColor) {
        const batch = Terraria.Main.spriteBatch;
        
        const beginMethod = batch['void Begin(SpriteSortMode sortMode, BlendState blendState, SamplerState samplerState, DepthStencilState depthStencilState, RasterizerState rasterizerState, Effect effect, Nullable`1 transformMatrix, bool defferedBatch)'];
        
        const texture = this.TextureAsset
        if (!texture) return false;

        const screenPos = Vector2.new(
            proj.Center.X - Terraria.Main.screenPosition.X,
            proj.Center.Y - Terraria.Main.screenPosition.Y
        );

        Terraria.Main.spriteBatch.End();			
        beginMethod(
            Microsoft.Xna.Framework.Graphics.SpriteSortMode.Deferred, 
            Microsoft.Xna.Framework.Graphics.BlendState.Additive, 
            null, null, null, null, null, true
        );
        		
        const origin = Vector2.new(texture.Width / 2, 0);
        const scale = Vector2.new(proj.scale, this.LengthMultiplier);
        const color = Color.new(Color.Crimson.R, Color.Crimson.G, Color.Crimson.B, 0);
        
        for (let i = 0; i < 3; i++) {
            EntitySpriteDraw(
                texture, 
                screenPos,
                Rectangle.new(0, 0, texture.Width, texture.Height),
                color, 
                this.LaserRotation, 
                origin, 
                scale, 
                SpriteEffects.None, 
                0
            );
        }

        batch.End();
        beginMethod(
            Microsoft.Xna.Framework.Graphics.SpriteSortMode.Deferred, 
            Microsoft.Xna.Framework.Graphics.BlendState.AlphaBlend, 
            null, null, null, null, null, true
        );

        return false;
    }
}
