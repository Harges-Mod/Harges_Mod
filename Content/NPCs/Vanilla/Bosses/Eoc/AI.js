let DustID = Terraria.ID;

using("Terraria");
using("Terraria.Graphics.CameraModifiers");
using("Microsoft.Xna.Framework");
using("Terraria.DataStructures");
using("Terraria.Graphics");
using("Terraria.Graphics.Shaders");

GlobalImports.AllModules();

let PunchCameraNew = (startPosition, direction, strength) => {
    try {
        let modifier = PunchCameraModifier.new();
        modifier[
            "void .ctor(Vector2 startPosition, Vector2 direction, float strength, float vibrationCyclesPerSecond, int frames, float distanceFalloff, string uniqueIdentity)"
        ](
            startPosition,
            direction,
            parseFloat(strength),
            10.0,
            15,
            1.0,
            "Locks"
        );
        return modifier;
    } catch (e) {
        let modifier = PunchCameraModifier.new()[
            "void .ctor(Vector2 startPosition, Vector2 direction, float strength, float vibrationCyclesPerSecond, int frames, float distanceFalloff, string uniqueIdentity)"
        ](
            startPosition,
            direction,
            parseFloat(strength),
            10.0,
            15,
            1.0,
            "Locks"
        );
        return modifier;
    }
};

GlobalImports.AllModules();

export default class Eoc extends GlobalNPC {
    constructor() {
        super();
        this.initialize = false;
        this.Phase1Dashing = false;
        this.Phase2Dashing = false;
        this.Phase2 = false;
        this.ArenaProjectileIndex = -1;

        this.State = 0;
        this.States = {
            DashAndProj: 0,
            StopAndShootCone: 1,
            FinalBulletHell: 2
        };

        this.dashCount = 0;
        this.wasDashing = false;
        this.stateTimer = 0;
        this.bulletHellAngle = 0.0;

        this.SpawnAnimationTime = Generic.toSec(3);
        this.SpawnAnimationPos = null;
        this.OnSpawnAnimation = false;
        
        this.rubyLaserType = 0;
    }

    Init(npc, player) {
        if (!this.initialize) {
            npc.Center = Vector2.new(player.Center.X, player.Center.Y - 450);
            this.State = 0;

            this.States = {
                DashAndProj: 0,
                StopAndShootCone: 1,
                FinalBulletHell: 2
            };

            this.dashCount = 0;
            this.wasDashing = false;
            this.stateTimer = 0;
            this.bulletHellAngle = 0.0;

            this.initialize = true;
        }
    }
    
    OnSpawn(npc) {
        if (npc.type !== 4) return;
        
        let player = Main.player[0];
        
        Harges.Graphics.UParticle.Spawn(Harges.Assets.Loader.Load('Assets/Adittive/twirl_04.png'), Vector2.new(player.Center.X, player.Center.Y - 780), Vector2.Zero, {
            life: Generic.toSec(3),
            scaleTo: Vector2.new(0.0, 0.0),
            scaleFrom: Vector2.new(0.60, 0.60),
            colorFrom: Color.Red,
            colorTo: Color.Crimson,
            rotVel: 0.30,
            additive: true,
            layer: 1
        });
    }
    
    SpawnAnimation(npc, player) {
        Main.hideUI = true;

        let progress = 1.0 - this.SpawnAnimationTime / Generic.toSec(3);
        let easeProgress = 1.0 - Math.pow(1.0 - progress, 3.0);
        let startY = player.Center.Y - 800;
        let targetY = player.Center.Y - 200;
        
        npc.Center = Vector2.new(
            player.Center.X,
            startY + (targetY - startY) * easeProgress
        );
        
        npc.velocity = Vector2.Zero;
        npc.rotation = 0.0;

        Camera.Shake(60, 2.5);

        this.SpawnAnimationTime--;

        if (this.SpawnAnimationTime <= 0) {
            Harges.Graphics.SpawnStormLightning(
                npc.Center,
                Vector2.new(0, 0),
                Color.Purple
            );

            Effects.PlaySound(SoundID.Roar, npc.Center.X, npc.Center.Y);
            Camera.Shake(30, 5.0);

            Main.hideUI = false;
            this.OnSpawnAnimation = false;
        }
    }

    SetDefaults(npc) {
        if (npc.type == 4) {
            Camera.Shake(60, 5);

            let player = Main.player[0];

            this.oldLifeMax = npc.lifeMax;
            this.lastCalculatedLifeMax = npc.lifeMax;
            this.ArenaProjectileIndex = -1;

            this.initialize = false;

            this.SpawnAnimationTime = Generic.toSec(3);
            this.SpawnAnimationPos = null;
            this.OnSpawnAnimation = true;
            npc.position = Vector2.new(player.Center.X, player.Center.Y - 450);
        }

        if (npc.type == 5) {
            npc.lifeMax *= 2;
            npc.life = npc.lifeMax;
            npc.damage *= 2;
        }
    }
    
    UpdateCamera(npc) {
        if (npc?.type == 4) {
            let targetCameraPos = Vector2.new(
                npc.Center.X - Main.screenWidth / 2,
                npc.Center.Y - Main.screenHeight / 2
            );

            let applyCameraPos = force => {
                Main.screenPosition = Vector2.Lerp(
                    Main.screenPosition,
                    targetCameraPos,
                    force
                );
            };

            if (this.OnSpawnAnimation) {
                applyCameraPos(0.5);
            }

            if (this.State === this.States.FinalBulletHell) {
                applyCameraPos(0.1);
            }
        }
    }

    DrawDirect() {
    }

    AI(npc) {
        let player = Main.player[0];

        if (!player || !player.active || player.statLife <= 0) {
            return;
        }

        if (npc.type == 4) {
            if (Rand.NextBool(6)) {
                Harges.Graphics.UParticle.Spawn(Harges.Assets.Loader.Load('Textures/Projectiles/Visual/spark_01.png'), npc.Center, Vector2.Zero, {
                    life: 60,
                    scaleTo: Vector2.new(0.0, 0.0),
                    scaleFrom: Vector2.new(0.40, 0.40),
                    colorFrom: Color.Purple,
                    colorTo: Color.Red,
                    rot: Math.random() * Math.PI + Rand.NextSign(),
                    additive: true,
                    layer: 0
                });
            }
                
            this.Init(npc, player);
            
            let arenaType = ModProjectile.getTypeByName("EocArena");

            if (
                this.ArenaProjectileIndex === -1 ||
                !Main.projectile[this.ArenaProjectileIndex].active ||
                Main.projectile[this.ArenaProjectileIndex].type !== arenaType
            ) {
                if (Main.netMode !== 1) {
                    this.ArenaProjectileIndex = Generic.NewProjectile(
                        Projectile.GetNoneSource(),
                        npc.Center,
                        Vector2.Zero,
                        arenaType,
                        0,
                        0,
                        Main.myPlayer,
                        0,
                        0,
                        0,
                        null
                    );
                }
            }

            this.Phase2 = npc.ai[0] === 3 || npc.ai[1] === 4;

            if (
                this.ArenaProjectileIndex >= 0 &&
                this.ArenaProjectileIndex < Main.projectile.length
            ) {
                let arenaProj = Main.projectile[this.ArenaProjectileIndex];
                let ai = new ProjAI(arenaProj);

                if (
                    arenaProj &&
                    arenaProj.active &&
                    arenaProj.type === arenaType
                ) {
                    arenaProj.Center = npc.Center;
                    arenaProj.timeLeft = 2;

                    ai[0] = this.Phase2 ? 1 : 0;
                }
            }

            if (this.OnSpawnAnimation) {
                this.SpawnAnimation(npc, player);
                return;
            }

            this.Phase1Dashing = npc.ai[1] == 2 && npc.ai[2] == 8;
            this.Phase2Dashing = npc.ai[1] == 4 && npc.ai[2] == 1;

            if (
                npc.life <= npc.lifeMax * 0.15 &&
                this.State !== this.States.FinalBulletHell
            ) {
                Effects.PlaySound(SoundID.Roar, npc.Center.X, npc.Center.Y);
                this.State = this.States.FinalBulletHell;
                this.stateTimer = 0;
            }

            if (this.State === this.States.DashAndProj) {
                this.ShootAndDashAI(npc);

                if (this.Phase2) {
                    let isDashingNow = npc.ai[1] == 4;
                    if (isDashingNow && !this.wasDashing) {
                        this.dashCount++;
                        if (this.dashCount >= 2) {
                            this.dashCount = 0;
                            this.State = this.States.StopAndShootCone;
                            this.stateTimer = 0;
                        }
                    }
                    this.wasDashing = isDashingNow;
                }
            } else if (this.State === this.States.StopAndShootCone) {
                this.stateTimer++;

                npc.velocity = Vector2.Multiply(npc.velocity, 0.85);
                let dirToPlayer = Vector2.Subtract(player.Center, npc.Center);
                npc.rotation = Vector2.ToRotation(dirToPlayer) - Math.PI / 2;

                if (this.stateTimer === 30) {
                    if (!this.rubyLaserType) this.rubyLaserType = ModProjectile.getTypeByName("none");

                    if (this.rubyLaserType > 0) {
                        let dirNormalized = Vector2.Normalize(dirToPlayer);
                        let baseAngle = Math.atan2(dirNormalized.Y, dirNormalized.X) - (Math.PI / 2);
                        let spread = 0.26;
                        let angles = [
                            baseAngle - spread,
                            baseAngle,
                            baseAngle + spread
                        ];

                        angles.forEach(laserAngle => {
                            Generic.NewProjectile(
                                Projectile.GetNoneSource(),
                                npc.Center,
                                Vector2.Zero,
                                this.rubyLaserType,
                                12,
                                0,
                                Main.myPlayer,
                                laserAngle, // Passa o ângulo exato em ai0
                                0, 0, null
                            );
                        });
                    }
                }

                if (this.stateTimer >= 45) {
                    this.State = this.States.DashAndProj;
                    this.stateTimer = 0;
                }
            } else if (this.State === this.States.FinalBulletHell) {
                this.stateTimer++;

                npc.dontTakeDamage = true;
                npc.ai[1] = 0;
                npc.ai[2] = 0;

                npc.life -= 0.2;
                if (npc.life <= 0) {
                    npc.checkDead();
                }

                npc.velocity = Vector2.Zero;

                this.bulletHellAngle += 0.3;
                npc.rotation += 0.05;

                if (this.stateTimer % 20 === 0) {
                    if (!this.rubyLaserType) this.rubyLaserType = ModProjectile.getTypeByName("none");

                    if (this.rubyLaserType > 0) {
                        for (let i = 0; i < 4; i++) {
                            let angle = this.bulletHellAngle + i * (Math.PI / 2) - (Math.PI / 2);

                            Generic.NewProjectile(
                                Projectile.GetNoneSource(),
                                npc.Center,
                                Vector2.Zero,
                                this.rubyLaserType,
                                10,
                                0,
                                Main.myPlayer,
                                angle, // Passa o ângulo em ai0
                                0, 0, null
                            );
                        }
                    }
                }
            }
        }

        if (npc.type == 5) {
            if (this.Phase1Dashing) {
                let direction = Vector2.Subtract(player.Center, npc.Center);
                direction = Vector2.Normalize(direction);

                let speed = 8.0;
                npc.velocity = Vector2.Multiply(direction, speed);
            }
        }
    }

    ShootAndDashAI(npc) {
        if (npc.ai[2] <= 200 && npc.ai[1] == 0) {
            npc.ai[2] += 3;
        }

        if (npc.ai[2] == 8) {
            this.ShootCrossSlimeRubyLaser(npc);

            let phase1 = npc.ai[1] == 2;
            if (phase1) npc.velocity = Vector2.Multiply(npc.velocity, 1.4);
        }
    }

    ShootCrossSlimeRubyLaser(npc) {
        if (!this.rubyLaserType) this.rubyLaserType = ModProjectile.getTypeByName("none");
        if (!this.rubyLaserType || this.rubyLaserType <= 0) return;

        const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
        angles.forEach(angle => {
            let rad = (Math.PI / 180) * angle;
            let laserAngle = rad - (Math.PI / 2);

            Generic.NewProjectile(
                Projectile.GetNoneSource(),
                npc.Center,
                Vector2.Zero,
                this.rubyLaserType,
                12,
                0,
                Main.myPlayer,
                laserAngle,
                0, 0, null
            );
        });
    }

    OnHitPlayer(npc, target, hurtInfo) {
        if (npc.type == 4) {
            target.AddBuff(
                ModBuff.getTypeByName("EocCurse"),
                this.Phase2 ? Generic.toSec(3) : Generic.toSec(1),
                true
            );
            target.AddBuff(BuffID.Obstructed, Generic.toSec(1), true);
        }

        if (npc.type == 5) {
            target.AddBuff(23, 5, false);
        }
    }
}
