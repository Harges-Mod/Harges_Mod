let DustID = Terraria.ID;

using("Terraria");
using("Terraria.Graphics.CameraModifiers");
using("Microsoft.Xna.Framework");
using("Terraria.DataStructures");
using("Terraria.Graphics");
using("Terraria.Graphics.Shaders");

GlobalImports.AllModules();


export class EocArena extends ModProjectile {
    constructor() {
        super();
        this.ArenaAsset = null;
        this.ArenaRotation = 0.0;

        this.oldPos = [];
        this.oldRot = [];
        this.oldScale = [];
        
        // old 8
        this.maxTrailLength = 5;

        this.currentBaseScale = 12.0; 
        this.targetBaseScale = 3.0;
    }

    SetStaticDefaults() {
        this.ArenaAsset = tl.texture.load("Assets/Adittive/HardEdgeRing.png");
    }

    SetDefaults() {
        let proj = this.Projectile;
        proj.width = 512;
        proj.height = 512;
        proj.friendly = false;
        proj.hostile = false;
        proj.penetrate = -1;
        proj.tileCollide = false;
        proj.ignoreWater = true;
        proj.timeLeft = 2;
    }

    OnKill(proj, timeLeft) {
        GlobalNPC.GetByName('Eoc').initialize = false;
    }

    AI(proj) {
        let player = Main.player[0];

        if (!player || !player.active || player.statLife <= 0) {
            proj.Kill();
            return;
        }

        this.ArenaRotation += 0.05;

        let ai = new ProjAI(proj);

        let normalScale = ai[0] === 1 ? 4.5 : 3.0;

        if (this.currentBaseScale > normalScale) {
            this.currentBaseScale = Math.max(
                normalScale,
                this.currentBaseScale - 0.25
            );
        } else {
            this.targetBaseScale = normalScale;
            let lerpRes = Vector2.Lerp(
                Vector2.new(parseFloat(this.currentBaseScale), 0.0),
                Vector2.new(parseFloat(this.targetBaseScale), 0.0),
                0.08
            );
            this.currentBaseScale = lerpRes.X;
        }

        let scaleTime = Main.GameUpdateCount * 0.08;
        let scaleX = this.currentBaseScale + Math.sin(scaleTime) * 0.25;
        let scaleY = this.currentBaseScale + Math.cos(scaleTime * 1.3) * 0.25;

        this.oldPos.unshift(Vector2.new(proj.Center.X, proj.Center.Y));
        this.oldRot.unshift(this.ArenaRotation);
        this.oldScale.unshift(
            Vector2.new(parseFloat(scaleX), parseFloat(scaleY))
        );

        if (this.oldPos.length > this.maxTrailLength) {
            this.oldPos.pop();
            this.oldRot.pop();
            this.oldScale.pop();
        }

        let averageScale = (scaleX + scaleY) / 2;

        if (this.ArenaAsset) {
            let arenaRadius = (this.ArenaAsset.Width / 2) * averageScale * 0.92;

            if (Main.GameUpdateCount % 60 === 0) {
                let playerDistance = Vector2.Distance(
                    player.Center,
                    proj.Center
                );
                if (playerDistance > arenaRadius) {
                    player.AddBuff(BuffID.Obstructed, 60, true);
                    player.AddBuff(BuffID.Venom, 60, true);
                }
            }
        }
    }

    PreDraw(proj, lightColor) {
        if (!this.ArenaAsset) return false;

        let rect = Rectangle.new(
            0,
            0,
            this.ArenaAsset.Width,
            this.ArenaAsset.Height
        );
        let origin = Vector2.new(
            parseFloat(this.ArenaAsset.Width / 2),
            parseFloat(this.ArenaAsset.Height / 2)
        );

        let baseR = Math.floor(
            120 + (Math.sin(Main.GameUpdateCount * 0.05) * 0.5 + 0.5) * 135
        );

        for (let i = this.oldPos.length - 1; i >= 0; i--) {
            let trailCenter = Generic.toScreenPosition(this.oldPos[i]);

            let progress = (this.maxTrailLength - i) / this.maxTrailLength;
            let alphaFactor = progress * 0.4;

            let trailR = Math.floor(baseR * alphaFactor);
            let trailColor = Color.new(trailR, 0, 0, 0);

            Generic.EntityDraw(
                this.ArenaAsset,
                trailCenter,
                rect,
                trailColor,
                this.oldRot[i],
                origin,
                this.oldScale[i],
                SpriteEffects.None
            );
        }

        let scaleTime = Main.GameUpdateCount * 0.08;
        let scaleX = this.currentBaseScale + Math.sin(scaleTime) * 0.25;
        let scaleY = this.currentBaseScale + Math.cos(scaleTime * 1.3) * 0.25;
        let currentScale = Vector2.new(parseFloat(scaleX), parseFloat(scaleY));

        let arenaScreenCenter = Generic.toScreenPosition(proj.Center);
        let rgbColor = Color.new(baseR, 0, 0, 0);
        
        
        Generic.EntityDraw(
            this.ArenaAsset,
            arenaScreenCenter,
            rect,
            rgbColor,
            this.ArenaRotation,
            origin,
            currentScale,
            SpriteEffects.None
        );

        return false;
    }
}
