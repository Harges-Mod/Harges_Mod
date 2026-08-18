using('Terraria.ID')
using('Microsoft.Xna.Framework.Graphics')
using('Terraria')
using('Microsoft.Xna.Framework')

export class BloodOrb extends ModProjectile {

    constructor() {
        super();
        this.Texture = 'Projectiles/' + this.constructor.name;
        
        this.basePosition = null;
        this.targetPlayer = null;
        this.detectionRangeSq = 180 * 180;
        this.scaleVector = Vector2.new(0.1, 0.1);
    }
    
    SetStaticDefaults() {
        this.Orb = tl.texture.load("Textures/Projectiles/BloodOrb.png");  
        this.target = Microsoft.Xna.Framework.Graphics.RenderTarget2D.new()
        
        ProjectileID.Sets.TrailCacheLength[this.Type] = 8;
        ProjectileID.Sets.TrailingMode[this.Type] = 0;
    }
    
    SetDefaults() {  
        let proj = this.Projectile;
        
        proj.width = 22;
        proj.height = 22;
        proj.scale = 1;
        proj.aiStyle = -1;
        proj.friendly = false;
        proj.tileCollide = false;
        proj.penetrate = 1;
        proj.ranged = true;
    }

    AI(proj) {
        let ai = new ProjAI(proj);
        ai[0]++;
        ai[1]++;
        
        
        if (ai[0] % 2 == 0) {
       	/*Harges.Graphics.UParticleHelper.SimulateMetaBall({
            center: proj.Center,
            baseSizePx: 32,
            color: Harges.Graphics.UParticleHelper.BallColor(Color.Red, Color.Red),
            count: 2
        });*/
        }
        
        if (ai[0] === 1) {
            this.basePosition = Vector2.new(proj.Center.X, proj.Center.Y);
        }

        let amplitude = 5;
        let floatSpeed = 0.06;

        if (Main.GameUpdateCount % 60 === 0 || !this.targetPlayer || !this.targetPlayer.active || this.targetPlayer.dead) {
            ai[1] = 0;
            let nearestDist = this.detectionRangeSq;
            this.targetPlayer = null;

                let player = Main.player[0];
        
                let dist = Vector2.DistanceSquared(player.Center, proj.Center);
        
                if (dist < nearestDist) {
                    nearestDist = dist;
                    this.targetPlayer = player;
                }
        }

        if (this.targetPlayer) {
            let dir = Vector2.Subtract(this.targetPlayer.Center, proj.Center);

            if (dir.Length() > 0.001)
                dir = Vector2.Normalize(dir);

            let speed = 2.2;
            let inertia = 25;

            proj.velocity = Vector2.Divide(
                Vector2.Add(
                    Vector2.Multiply(proj.velocity, inertia - 1),
                    Vector2.Multiply(dir, speed)
                ),
                inertia
            );

            if (Vector2.DistanceSquared(this.targetPlayer.Center, proj.Center) < 1024) {
                proj.Kill();
                return;
            }

            this.basePosition = Vector2.new(proj.Center.X, proj.Center.Y);

        } else if (this.basePosition) {
            let targetY = this.basePosition.Y + Math.sin(ai[0] * floatSpeed) * amplitude;
            let targetPos = Vector2.new(this.basePosition.X, targetY);
            
            let diff = Vector2.Subtract(targetPos, proj.Center);
            
            proj.position = Vector2.Multiply(diff, 0.18);
        }

        proj.rotation += 0.08;
    }

    PreDraw(proj, lightColor) {
        let tex = this.Orb;
        let rect = Generic.getRect(tex);
        let origin = Generic.getOrigin(tex);
        let trailLen = proj.oldPos.length;
        let halfWidth = proj.width / 2;
        let halfHeight = proj.height / 2;

        if (!this.target) {
            this.target = Microsoft.Xna.Framework.Graphics.RenderTarget2D.new();
            this.target.device = Main.instance.GraphicsDevice;
            this.target.width = proj.width;
            this.target.height = proj.height;
        }
        Terraria.Main.spriteBatch.End();

        Main.instance.GraphicsDevice.SetRenderTarget(this.target);
        Main.instance.GraphicsDevice['void Clear(Color color)'](Color.Transparent);

        Terraria.Main.spriteBatch['void Begin(SpriteSortMode sortMode, BlendState blendState, SamplerState samplerState, DepthStencilState depthStencilState, RasterizerState rasterizerState, Effect effect, Nullable`1 transformMatrix, bool defferedBatch)'
        ](SpriteSortMode.Deferred, null, null, null, null, null, null, true);
                    	
        Generic.EntityDraw(
            tex,
            Vector2.new(halfWidth, halfHeight),
            rect,
            Color.Red,
            proj.rotation,
            origin,
            this.scaleVector,
            SpriteEffects.None
        );
       
        Terraria.Main.spriteBatch.End();

        Main.instance.GraphicsDevice.SetRenderTarget(null);

        Terraria.Main.spriteBatch['void Begin(SpriteSortMode sortMode, BlendState blendState, SamplerState samplerState, DepthStencilState depthStencilState, RasterizerState rasterizerState, Effect effect, Nullable`1 transformMatrix, bool defferedBatch)'
        ](SpriteSortMode.Deferred, null, null, null, null, null, null, true);
        
        let targetRect = Rectangle.new(0, 0, proj.width, proj.height);

        Generic.EntityDraw(
            this.target,
            Generic.toScreenPosition(proj.Center),
            targetRect,
            Color.White,
            0,
            Vector2.new(halfWidth, halfHeight),
            Vector2.new(1, 1),
            SpriteEffects.None
        );

        return false;
    }


    OnKill(proj, timeLeft) {
        let modPlayer = ModPlayer.getByName('HargesMMode');
       
        if (modPlayer) {
            modPlayer.BloodyCoverAbstinenceTimer = 0;
            modPlayer.ModHealEffect(4, Color.Red);
        }
    }
}
