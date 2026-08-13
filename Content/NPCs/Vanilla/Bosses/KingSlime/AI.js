using("Terraria");
using("Terraria.ID");
using("Microsoft.Xna.Framework");

GlobalImports.AllModules();

export default class SlimeKing extends GlobalNPC {
    InitProperties() {
        if (this.initialized) return;
        this.Timer = 0;
        this.SlimeState = 0;
        this.PlayerAim = null;
        this.ShotsFired = 0;
        this.RainPositions = [];
        this.RainTimer = 0;
        this.rubyLaserType = 0;
        this.initialized = true;
    }

    AI(npc) {
        if (npc.type !== NPCID.KingSlime || !npc.active || ModPlayer.Get("HargesMMode").MModeActivated == false) return;
        
        
        if (Rand.NextBool(6)) {
        		Harges.Graphics.UParticle.Spawn(
                    Harges.Assets.Loader.Load(
                        "Textures/Projectiles/Visual/spark_01.png"
                    ),
                    npc.Center,
                    Vector2.Zero,
                    {
                        life: 60,
                        scaleTo: Vector2.new(0.0, 0.0),
                        scaleFrom: Vector2.new(0.4, 0.4),
                        colorFrom: Color.Purple,
                        colorTo: Color.Red,
                        rot: Math.random() * Math.PI + Rand.NextSign(),
                        additive: true,
                        layer: 0
                    }
                );
        }
        
        this.InitProperties();
        this.Timer++;

        const spawnPos = Vector2.new(npc.Center.X, npc.Center.Y - 70);
        const lifePercent = (npc.life / npc.lifeMax) * 100;
        const shootTime = lifePercent <= 50 ? Generic.toSec(2) : Generic.toSec(3);

        switch (this.SlimeState) {
            case 0: this.StateCharging(npc, spawnPos, shootTime); break;
            case 1: this.StateShoot(npc, spawnPos); break;
            case 2: this.StateRainPreparation(npc, spawnPos); break;
            case 3: this.StateRainAttack(npc); break;
        }
    }

    StateCharging(npc, spawnPos, shootTime) {
        const timeToEscape = 35;
        const chargeDuration = Math.min(45, shootTime - timeToEscape);
        const startChargeTime = shootTime - chargeDuration;
        const target = Main.player[npc.target];

        if (!target || target.dead) return;

        if (this.Timer < shootTime - timeToEscape) {
            this.PlayerAim = target.Center;
        }

        if (this.Timer === startChargeTime) {
            const particleData = {
                life: chargeDuration,
                scaleFrom: Vector2.new(0.1, 0.1),
                scaleTo: Vector2.new(0.6, 0.6),
                colorFrom: Color.Red,
                colorTo: Color.Crimson,
                rotVel: 0.15,
                additive: true,
                layer: 1
            };

            Harges.Graphics.UParticle.Spawn(Harges.Assets.Loader.Load('Assets/Adittive/Pretty.png'), spawnPos, Vector2.Zero, 
                { ...particleData, target: () => Vector2.new(npc.Center.X, npc.Center.Y - 70) });
      
            Harges.Graphics.UParticle.Spawn(Harges.Assets.Loader.Load('Assets/Adittive/Pretty.png'), this.PlayerAim, Vector2.Zero, 
                { ...particleData, target: () => this.PlayerAim });
        }

        if (this.Timer >= shootTime) this.SlimeState = 1;
    }

    StateShoot(npc, spawnPos) {
        this.Timer = 0;
        const target = Main.player[npc.target];

        if (target && this.PlayerAim) {
            let velocity = Vector2.Multiply(Vector2.Normalize(Vector2.Subtract(this.PlayerAim, spawnPos)), 11);
            this.LaserShoot(spawnPos, velocity, 12);

            Harges.Graphics.UParticle.Spawn(Harges.Assets.Loader.Load('Assets/Adittive/Shine.png'), spawnPos, Vector2.Zero, {
                life: 15,
                
                scaleFrom: Vector2.new(0.8, 0.8),
                scaleTo: Vector2.new(0.1, 0.1),
                colorFrom: Color.Red,
                additive: true
            });
        }

        if ((npc.life / npc.lifeMax) * 100 <= 50) {
            this.ShotsFired++;
            this.SlimeState = this.ShotsFired >= 3 ? 2 : 0;
        } else {
            this.SlimeState = 0;
        }
    }

    StateRainPreparation(npc, spawnPos) {
        this.RainTimer++;
        const duration = Generic.toSec(3);

        if (this.RainTimer === 1) {
            this.SetupRainPositions(npc);
            
            this.RainPositions.forEach(pos => {
                Harges.Graphics.UParticle.Spawn(Harges.Assets.Loader.Load('Assets/Adittive/Shine.png'), pos, Vector2.Zero, {
                    life: duration,
                    scaleFrom: Vector2.new(0, 0),
                    scaleTo: Vector2.new(0.3, 0.3),
                    colorFrom: Color.Red,
                    rotVel: 0.15,
                    additive: true
                });
            });
        }

        if (this.RainTimer === 60) {
            this.LaserShoot(spawnPos, Vector2.new(0, -12), 10); // visual Shoot
        }

        if (this.RainTimer >= duration) {
            this.RainTimer = 0;
            this.SlimeState = 3;
        }
    }

    StateRainAttack(npc) {
        this.RainPositions.forEach(pos => {
            this.LaserShoot(Vector2.new(pos.X, pos.Y - 1000), Vector2.new(0, 14), 12);
        });

        this.RainPositions = [];
        this.ShotsFired = 0;
        this.Timer = 0;
        this.SlimeState = 0;
    }

    SetupRainPositions(npc) {
        const target = Main.player[npc.target];
        if (!target) return;
        this.RainPositions = [];
        const screenLeft = Main.screenPosition.X - 100;
        const screenRight = Main.screenPosition.X + Main.screenWidth + 100;

        for (let x = screenLeft; x <= screenRight; x += 180) {
            this.RainPositions.push(Vector2.new(x, target.Center.Y));
        }
    }

    LaserShoot(pos, vel, dmg) {
        if (!this.rubyLaserType) this.rubyLaserType = ModProjectile.getTypeByName("SlimeRubyLaser");
        return Generic.NewProjectile(Projectile.GetNoneSource(), pos, vel, this.rubyLaserType, Generic.getFixedDamage(dmg), 0.5, Main.myPlayer);
    }
}