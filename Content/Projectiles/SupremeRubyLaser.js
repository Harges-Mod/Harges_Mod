import { Terraria, Microsoft, Modules } from './../../TL/ModImports.js';
import { ModProjectile } from './../../TL/ModProjectile.js';

const { Color, Rectangle, Vector2 } = Modules;
const { SpriteEffects } = Microsoft.Xna.Framework.Graphics;

// Declarações de métodos nativos/interop FORA do ciclo de execução para não estourar a memória
const EntitySpriteDraw = Terraria.Main['void EntitySpriteDraw(Texture2D texture, Vector2 position, Rectangle sourceRectangle, Color color, float rotation, Vector2 origin, Vector2 scale, SpriteEffects effects, float worthless)'];
const SolidCollision = Terraria.Collision['bool SolidCollision(Vector2 Position, int Width, int Height)'];

export class SupremeRubyLaser extends ModProjectile {
    constructor() {
        super();
        this.Texture = 'Projectiles/Visual/ThinLaser';
        this.LaserRotation = 0;
        this.LengthMultiplier = 2.0; 
        this.CurrentLaserLength = 0;
    }
    
    PostSetupContent() {
        this.TextureAsset = Terraria.GameContent.TextureAssets.Projectile[this.Type].Value;
    }
    
    SetDefaults() {
        this.Projectile.width = 32; 
        this.Projectile.height = 32;
        this.Projectile.friendly = true;
        this.Projectile.hostile = false;
        this.Projectile.penetrate = -1; 
        this.Projectile.tileCollide = false;
        this.Projectile.scale = 1.0;
        this.Projectile.timeLeft = 45; 
        this.Projectile.ignoreWater = true;
        this.Projectile.usesLocalNPCInterval = true;
        this.Projectile.localNPCHitCooldown = 30; 
    }

    AI(proj) {  
        
        if (proj.velocity.X !== 0 || proj.velocity.Y !== 0) {
            this.LaserRotation = Math.atan2(proj.velocity.Y, proj.velocity.X) - (Math.PI / 2);
            proj.velocity = Vector2.Zero;
        }
        
        const maxTime = 60; 
        const timeLeft = proj.timeLeft;
        const fadeInTime = 10;  
        const fadeOutTime = 15; 

        
        if (timeLeft > maxTime - fadeInTime) {
            proj.scale = (maxTime - timeLeft) / fadeInTime;
        } else if (timeLeft < fadeOutTime) {
            proj.scale = timeLeft / fadeOutTime;
        } else {
            proj.scale = 1.0;
        }

        proj.rotation = this.LaserRotation;

        this.UpdateLaserLength(proj);

        if (proj.scale > 0.1) {
            this.ApplyBuffCheck(proj);
        }
    }

    UpdateLaserLength(proj) {
        const texture = this.TextureAsset;
        if (!texture) return;

        const maxLaserLength = texture.Height * this.LengthMultiplier;
        const visualAngle = this.LaserRotation + (Math.PI / 2);
        const dir = Vector2.new(Math.cos(visualAngle), Math.sin(visualAngle));
        
        const start = proj.Center;
        let currentLen = 0;
        const step = 16; 

        while (currentLen < maxLaserLength) {
            const checkPos = Vector2.new(
                start.X + dir.X * currentLen,
                start.Y + dir.Y * currentLen
            );
            
            // Checa colisão com blocos sólidos numa caixa 8x8
            if (SolidCollision(Vector2.new(checkPos.X - 4, checkPos.Y - 4), 8, 8)) {
                break;
            }

            currentLen += step;
        }

        this.CurrentLaserLength = Math.min(currentLen, maxLaserLength);
    }

    ModifyDamageHitbox(proj, hitbox) {
        const visualAngle = this.LaserRotation + (Math.PI / 2);
        const laserLength = this.CurrentLaserLength;

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
        const laserLength = this.CurrentLaserLength;
        const laserHalfWidth = (texture.Width * proj.scale) / 2;

        const cos = Math.cos(visualAngle);
        const sin = Math.sin(visualAngle);

        const startX = proj.Center.X;
        const startY = proj.Center.Y;
        
        const targetCenterX = targetHitbox.X + targetHitbox.Width / 2;
        const targetCenterY = targetHitbox.Y + targetHitbox.Height / 2;

        const targetX = targetCenterX - startX;
        const targetY = targetCenterY - startY;

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
    }

    PreDraw(proj, lightColor) {
        const batch = Terraria.Main.spriteBatch;
        
        const beginMethod = batch['void Begin(SpriteSortMode sortMode, BlendState blendState, SamplerState samplerState, DepthStencilState depthStencilState, RasterizerState rasterizerState, Effect effect, Nullable`1 transformMatrix, bool defferedBatch)'];
        
        const texture = this.TextureAsset;
        if (!texture) return false;

        const screenPos = Vector2.new(
            proj.Center.X - Terraria.Main.screenPosition.X,
            proj.Center.Y - Terraria.Main.screenPosition.Y
        );

        const lengthScale = this.CurrentLaserLength / texture.Height;

        batch.End();			
        beginMethod(
            Microsoft.Xna.Framework.Graphics.SpriteSortMode.Deferred, 
            Microsoft.Xna.Framework.Graphics.BlendState.Additive, 
            null, null, null, null, null, true
        );
        		
        const origin = Vector2.new(texture.Width / 2, 0);
        const scale = Vector2.new(proj.scale, lengthScale);
        const color = Color.new(Color.Red.R, Color.Red.G, Color.Red.B, 0);
        
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
