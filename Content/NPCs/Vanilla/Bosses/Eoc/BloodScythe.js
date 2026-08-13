let DustID = Terraria.ID;

using("Terraria");
using("Terraria.Graphics.CameraModifiers");
using("Microsoft.Xna.Framework");
using("Terraria.DataStructures");
using("Terraria.Graphics");
using("Terraria.Graphics.Shaders");

GlobalImports.AllModules();

export class BloodScythe extends ModProjectile {
    constructor() {
        super();
        this.Texture = `Projectiles/Visual/Umbra`;
        this.ScytheTexture = null;
        this.LaserPreview = null;
    }

    SetStaticDefaults() {
        this.ScytheTexture = tl.texture.load(
            "Textures/Projectiles/BloodScythe.png"
        );
        this.LaserPreview = tl.texture.load(
            "Textures/Projectiles/Visual/ThinLaser.png"
        );
    }

    SetDefaults() {
        this.Projectile.width = 22;
        this.Projectile.height = 48;
        this.Projectile.hostile = true;
        this.Projectile.friendly = false;
        this.Projectile.timeLeft = 350;
        this.Projectile.aiStyle = -1;
        this.Projectile.tileCollide = true;
    }

    Draw(proj) {
        /* let colorDelegate = (VertexStrip.StripColorFunction, progress => this.StripColors(progress));
    let widthDelegate = (VertexStrip.StripHalfWidthFunction, progress => this.StripWidth(progress));

    this._vertexStrip['void PrepareStripWithProceduralPadding(Vector2[] positions, float[] rotations, StripColorFunction colorFunction, StripHalfWidthFunction widthFunction, Vector2 offsetForAllPositions, bool includeBacksides)'](
        proj.oldPos,
        proj.oldRot,
        colorDelegate,
        widthDelegate,
        Vector2.Add(Vector2.Multiply(Main.screenPosition, -1), Vector2.Multiply(proj.Size, 0.5)),
        false
    );

    this._vertexStrip.DrawTrail();
    Main.pixelShader.CurrentTechnique.Passes[0].Apply();
    */
    }

    StripColors(progressOnStrip) {
        let hue =
            (((progressOnStrip * 1.6 - Main.GlobalTimeWrappedHourly) % 1.0) +
                1.0) %
            1.0;
        let rainbow = Main.hslToRgb(hue, 1.0, 0.5);
        let lerpFactor = Utils.GetLerpValue(-0.2, 0.5, progressOnStrip, true);
        let baseColor = Color.Lerp(Color.White, rainbow, lerpFactor);
        let fadeOut =
            1.0 - Utils.GetLerpValue(0.0, 0.98, progressOnStrip, true);

        let finalColor = Color.Multiply(baseColor, fadeOut);
        finalColor.A = 0;
        return finalColor;
    }

    StripWidth(progressOnStrip) {
        let num = 1.0;
        let lerpValue = Utils.GetLerpValue(0.0, 0.2, progressOnStrip, true);
        let factor = 1.0 - (1.0 - lerpValue) * (1.0 - lerpValue);
        return MathHelper.Lerp(0.0, 32.0, num * factor);
    }
    AI(proj) {
        let ai = new ProjAI(proj);

        ai[1]++;

        if (ai[1] < 30) {
            proj.velocity = Vector2.Multiply(proj.velocity, 0.99);
            if (ai[1] == 5) this.DrawLaserPreview(proj)
        } else if (ai[1] % 3 === 0) {
            proj.rotation += 1.8;
            
                            
            if (Rand.NextBool(3)) {
	                Harges.Graphics.UParticle.Spawn(Harges.Assets.Loader.Load('Textures/Projectiles/Visual/spark_01_Pixel.png'), proj.Center, Vector2.Zero, {
	                    life: 15,
	                    scaleTo: Vector2.new(0.0, 0.0),
	                    scaleFrom: Vector2.new(0.10, 0.10),
	                    colorFrom: Color.Purple,
	                    colorTo: Color.Red,
	                    rot: Math.random() * Math.PI + Rand.NextSign(),
	                    additive: true,
	                    layer: 1
	                });
	        }
	                
            proj.velocity = Vector2.Multiply(proj.velocity, 1.15);
        }
    }

    OnHitPlayer(projectile, player, damage, crit) {}

    DrawLaserPreview(proj) {
        if (!this.LaserPreview) return;

        let ai = new ProjAI(proj);
        let timer = ai[1];
        let progress = Math.min(timer / 30.0, 1.0);

        let scaleX = 0.5 * (1.0 - progress);
        let scaleY = 4.0;
        let scale = Vector2.new(parseFloat(scaleX), parseFloat(scaleY));

        let rotation = Vector2.ToRotation(proj.velocity) - Math.PI / 2;

        let startColor = Color.new(255, 30, 30, 0);
        let transparentColor = Color.new(0, 0, 0, 0);
        let previewColor = Color.Lerp(startColor, transparentColor, progress);

        let origin = Vector2.new(parseFloat(this.LaserPreview.Width / 2), 0.0);
        
                                    Harges.Graphics.UParticle.Spawn(
                                    this.LaserPreview,
                                    proj.Center,
                                    Vector2.Zero, {
                                        rot: rotation,
                                        origin: (origin),
                                        scaleFrom: scale,
                                        scaleTo: scale,
                                        life: 30,
                                        colorFrom: Color.Red,
                                        colorTo: Color.Pink,
                                        additive: true,
                                        layer: 1
                                    });
       /* Generic.EntityDraw(
            this.LaserPreview,
            Generic.toScreenPosition(proj.Center),
            Generic.getRect(this.LaserPreview),
            previewColor,
            rotation,
            origin,
            scale,
            SpriteEffects.None
        );*/
    }

    PreDraw(proj, lightColor) {
    
   let ai = new ProjAI(proj);
   if (ai[1] > 5){
   
        
        // this.Draw(proj);
        let tex = TextureAssets.Projectile[proj.type].Value;
        
        let finalScale = Vector2.new(
            parseFloat(proj.scale) / 11.1304,
            parseFloat(proj.scale) / 11.1304
        );

        let redColor = Color.new(Color.Purple.R, Color.Purple.G, Color.Purple.B, 0);
        
        
        Generic.EntityDraw(
            tex,
            Generic.toScreenPosition(proj.Center),
            Generic.getRect(tex),
            redColor,
            proj.rotation,
            Generic.getOrigin(tex),
            finalScale,
            SpriteEffects.None
        );
    }
    return false
    }
}