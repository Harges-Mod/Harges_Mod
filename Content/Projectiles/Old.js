import { Terraria, Microsoft, Modules } from './../../TL/ModImports.js';
import { ModProjectile } from './../../TL/ModProjectile.js';
import { ProjAI } from './../../TL/ProjAI.js';

const { Color, MathHelper, Rectangle, Vector2 } = Modules;
const { SpriteEffects } = Microsoft.Xna.Framework.Graphics;

const EntitySpriteDraw = Terraria.Main['void EntitySpriteDraw(Texture2D texture, Vector2 position, Rectangle sourceRectangle, Color color, float rotation, Vector2 origin, Vector2 scale, SpriteEffects effects, float worthless)'];
const NewDust = Terraria.Dust['int NewDust(Vector2 Position, int Width, int Height, int Type, float SpeedX, float SpeedY, int Alpha, Color newColor, float Scale)'];
const CheckSolidCollision = Terraria.Collision['bool SolidCollision(Vector2 Position, int Width, int Height)'];

const Vector3 = new NativeClass('Microsoft.Xna.Framework', 'Vector3');
const Multiply = Vector3['Vector3 Multiply(Vector3 value1, float scaleFactor)'];
const AddLight = Terraria.Lighting['void AddLight(Vector2 position, Vector3 rgb)'];

export class SlimeRubyLaser extends ModProjectile {
    constructor() {
        super();
        this.Texture = 'Projectiles/' + this.constructor.name;
        this.MaxLaserLength = 1500;
    }
    GetLaserColor(proj) {
        return Color.new(255, 100, 120, 200); 
    }
    GetDustColor(proj) {
        return Color.new(255, 50, 60);
    }
    GetLightColor(proj) {
        return Color.new(255, 30, 30);
    }
    GetLightIntensity(proj) {
        return 1.5 * Terraria.Main.essScale * proj.scale;
    }

    SetStaticDefaults() {
        Terraria.Main.projFrames[this.Type] = 3;
    }

    SetDefaults() {
        this.Projectile.width = this.Projectile.height = 10;
        this.Projectile.friendly = false; 
        this.Projectile.hostile = true;   
        this.Projectile.penetrate = -1; 
        this.Projectile.tileCollide = false;
        this.Projectile.extraUpdates = 0;
        this.Projectile.timeLeft = 60 * 1;
    }

    GetLaserEnd(startPos, rotation) {
        let dist = 0;
        let unitX = Math.cos(rotation);
        let unitY = Math.sin(rotation);
        let current = Vector2.new(startPos.X, startPos.Y);
        while (dist <= this.MaxLaserLength) {
            current.X = startPos.X + (unitX * dist);
            current.Y = startPos.Y + (unitY * dist);
            if (CheckSolidCollision(current, 1, 1)) {
                return dist;
            }
            dist += 16;
        }
        return this.MaxLaserLength;
    }

    AI(proj) {  
        const ai = new ProjAI(proj);  
          
        if (proj.velocity.X !== 0 || proj.velocity.Y !== 0) {
            proj.rotation = Math.atan2(proj.velocity.Y, proj.velocity.X);
            ai[3] = proj.velocity.X;
            ai[4] = proj.velocity.Y;
            proj.velocity = Vector2.Zero;
        }
        
        const maxTime = 120; 
        const timeLeft = proj.timeLeft;
        const fadeInTime = 15;  
        const fadeOutTime = 15; 

        if (timeLeft > maxTime - fadeInTime) {
            proj.scale = (maxTime - timeLeft) / fadeInTime;
        } else if (timeLeft < fadeOutTime) {
            proj.scale = timeLeft / fadeOutTime;
        } else {
            proj.scale = 1.0;
        }
          
        ai[1] = this.GetLaserEnd(proj.Center, proj.rotation);  
          
        const len = ai[1];  
        const cos = Math.cos(proj.rotation);  
        const sin = Math.sin(proj.rotation);  
        const dir = Vector2.new(cos, sin);  
        const start = proj.Center;  
        const end = Vector2.Add(start, Vector2.Multiply(dir, len));  
          
        if (proj.scale > 0.3 && ai[2] % 5 === 0) {
            this.DamagePlayers(proj, dir, len, start, end);  
        }
        ai[2]++; 
          
        for (let i = 0; i <= len; i += 48) {  
            AddLight(Vector2.new(start.X + cos * i, start.Y + sin * i), Multiply(this.GetLightColor(proj).ToVector3(), this.GetLightIntensity(proj)));
        }  
          
        if (Terraria.Main.netMode !== 2 && ai[1] < this.MaxLaserLength && ai[2] % 4 === 0) {
            const dustColor = this.GetDustColor(proj);
            const dustPos = Vector2.Subtract(end, 8);
            for (let i = 0; i < 4; i++) {  
            
                const idx = NewDust(dustPos, 16, 16, 278, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, 100, dustColor, 1.2 * proj.scale);  
                Terraria.Main.dust[idx].noGravity = true;
            }
        }
    }

    DamagePlayers(proj, dir, len, start, end) {
        const maxDistSq = (len + 50) * (len + 50);
        const line = Vector2.Subtract(end, start);
        const lineLenSq = line.X * line.X + line.Y * line.Y;

        for (let i = 0; i < 255; i++) {
            const target = Terraria.Main.player[i];
            if (!target.active || target.dead || target.ghost) continue;
    
            const dx = target.position.X - start.X;
            const dy = target.position.Y - start.Y;
            if (dx * dx + dy * dy > maxDistSq) continue;
    
            const center = Vector2.new(target.position.X + target.width * 0.5, target.position.Y + target.height * 0.5);
            const radius = Math.max(target.width, target.height) * 0.5;
    
            let t = ((center.X - start.X) * line.X + (center.Y - start.Y) * line.Y) / lineLenSq;
            if (t < 0) t = 0;
            else if (t > 1) t = 1;
    
            const closest = Vector2.Add(start, Vector2.Multiply(line, t));
            const distX = center.X - closest.X;
            const distY = center.Y - closest.Y;
    
            if (distX * distX + distY * distY < (20 + radius) * (20 + radius)) {
                target.Hurt(Terraria.DataStructures.PlayerDeathReason.ByProjectile(-1, proj.whoAmI), proj.damage, proj.direction, false, false, false, 0, true);
            }
        }
    }
    
    PreDraw(proj, lightColor) {
        const texture = Terraria.GameContent.TextureAssets.Projectile[this.Type].Value;
        const fh = texture.Height / 3;
        const len = proj.ai.val1;
        const rot = proj.rotation + MathHelper.PiOver2;
        const cos = Math.cos(proj.rotation);
        const sin = Math.sin(proj.rotation);
        
        const scale = Vector2.new(proj.scale * 1.2, 1); 
        const color = Color.Lerp(Color.Transparent, Color.Crimson, 0.7)
        const origin = Vector2.new(texture.Width * 0.5, fh);
        const effects = SpriteEffects.None;
        
        let x = proj.Center.X - Terraria.Main.screenPosition.X;
        let y = proj.Center.Y - Terraria.Main.screenPosition.Y;

        const spriteBatch = Terraria.Main.spriteBatch;
        
		const batch = Terraria.Main.spriteBatch;
		const beginMethod = batch['void Begin(SpriteSortMode sortMode, BlendState blendState, SamplerState samplerState, DepthStencilState depthStencilState, RasterizerState rasterizerState, Effect effect, Nullable`1 transformMatrix, bool defferedBatch)'];

		
		/*Main.spriteBatch.End();
		batch.End();
		beginMethod(SpriteSortMode.Deferred, BlendState.Additive, null, null, null, null, null, true);
        */
        
        
        EntitySpriteDraw(
            texture, Vector2.new(x, y),
            Rectangle.new(0, fh * 2, texture.Width, fh),
            color, rot, origin, scale, effects, 0
        );
        return false;
    }
}
