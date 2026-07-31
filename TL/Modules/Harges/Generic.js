import { using } from '../../../lib/_ModClasses.js'

using('Terraria')
using('Microsoft.Xna.Framework')

export class Generic {
    
    static toSec(s) {
        return s * 60;
    }
    
    static getFixedDamage(d) {
        return d /** Main.GameMode + 1;*/
    }
    
    
    
    static dropItem = (condition, entity, Type, stack) => {
    
        let self = entity
        
        if (condition!== 'none' && !condition) return
        
        return Terraria.Item['int NewItem(int X, int Y, int Width, int Height, int Type, int Stack, bool noBroadcast, int pfix, bool noGrabDelay)'
                            ](self.position.X, self.position.Y, self.width, self.height, Type, stack, false, 0, false)
    }
    
    static screenPosition = () => Main.screenPosition
    
    static toScreenPosition = vector2 => Vector2.Subtract(vector2, Generic.screenPosition())
    
    static getOrigin(texture) {
        return Vector2.new(texture.Width / 2, texture.Height / 2);
    }
    
    static NewParticle(position, velocity, color, scale, timeToLive = 60, rotation = 0) {
    
    let TEMP_SCALE = Vector2.new()
        const p = Terraria.GameContent.Drawing.ParticleOrchestrator._poolPrettySparkle.RequestParticle();
        
        p.LocalPosition = position;
        p.Velocity = velocity || VEC_ZERO;
        p.ColorTint = color || Color.White;
        p.Rotation = rotation;
        p.TimeToLive = timeToLive;

        if (typeof scale === 'number') {
            TEMP_SCALE.X = scale;
            TEMP_SCALE.Y = scale;
            p.Scale = TEMP_SCALE;
        } else {
            p.Scale = scale;
        }

        Main.ParticleSystem_World_OverPlayers.Add(p);
        return p;
    }
    
    
    static getRect = (tex) => Rectangle.new(0, 0, tex.Width, tex.Height);
    
    static EntityDraw(texture, position, sourceRectangle, color, rotation, origin, scale, effects) {
    
    if (origin == null) origin= this.getOrigin(texture)
    
        Terraria.Main['void EntitySpriteDraw(Texture2D texture, Vector2 position, Rectangle sourceRectangle, Color color, float rotation, Vector2 origin, Vector2 scale, SpriteEffects effects, float worthless)'](
            texture, position, sourceRectangle, color, rotation, origin, scale, effects, 0
        );
    }
           
    static NewProjectile(source, pos, vel, type, damage, knockback, owner = Main.myPlayer, ai0 = 0, ai1 = 0, ai2 = 0, modifier = null) {
        return Terraria.Projectile['int NewProjectile(IEntitySource spawnSource, Vector2 position, Vector2 velocity, int Type, int Damage, float KnockBack, int Owner, float ai0, float ai1, float ai2, NewProjectileModifier modifer)'](
            source, pos, vel, type, damage, knockback, owner, ai0, ai1, ai2, modifier
        );
    }
}
