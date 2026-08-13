let DustID = Terraria.ID;

using("Terraria");
using("Terraria.Graphics.CameraModifiers");
using("Microsoft.Xna.Framework");
using("Terraria.DataStructures");
using("Terraria.Graphics");
using("Terraria.Graphics.Shaders");

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

        this.lastShootTimer = 0;
    }

    Init(npc, player) {
        if (!this.initialize) {
            npc.Center = Vector2.new(player.Center.X, player.Center.Y - 450);

            this.State = this.States.DashAndProj;

            this.States = {
                DashAndProj: 0,
                StopAndShootCone: 1,
                FinalBulletHell: 2
            };

            this.dashCount = 0;
            this.wasDashing = false;

            this.stateTimer = 0;
            this.bulletHellAngle = 0.0;
            this.lastShootTimer = 0;

            this.Phase1Dashing = false;
            this.Phase2Dashing = false;
            this.Phase2 = false;

            this.initialize = true;
        }
    }

    OnSpawn(npc) {
        if (npc.type !== 4) return;

        let player = Main.player[0];
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

        if (this.SpawnAnimationTime % 10 === 0) {
            Camera.Shake(12, 2.5);
        }

        this.SpawnAnimationTime--;

        if (this.SpawnAnimationTime <= 0) {
            Harges.Graphics.SpawnStormLightning(
                npc.Center,
                Vector2.Zero,
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

    DrawDirect() {}

    AI(npc) {
        let player = Main.player[0];

        if (!player || !player.active || player.statLife <= 0) {
            return;
        }

        if (npc.type == 4) {
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

            this.Init(npc, player);

            let arenaType = ModProjectile.getTypeByName("EocArena");

            /*if (
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
            }*/

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

            this.Phase2 = npc.life <= npc.lifeMax * 0.5;
            this.Phase1Dashing = npc.ai[1] == 2 && npc.ai[2] == 8;
            this.Phase2Dashing = npc.ai[1] == 4 && npc.ai[2] == 1;

            if (
                npc.life <= npc.lifeMax * 0.15 &&
                this.State !== this.States.FinalBulletHell
            ) {
                Effects.PlaySound(SoundID.Roar, npc.Center.X, npc.Center.Y);

                this.State = this.States.FinalBulletHell;
                this.stateTimer = 0;
                this.bulletHellAngle = 0.0;
                this.wasDashing = false;
                this.dashCount = 0;
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
                            this.lastShootTimer = 0;
                        }
                    }

                    this.wasDashing = isDashingNow;
                }
            } else if (this.State === this.States.StopAndShootCone) {
                this.stateTimer++;

                npc.velocity = Vector2.Multiply(npc.velocity, 0.90);

                let dirToPlayer = Vector2.Subtract(player.Center, npc.Center);

                if (dirToPlayer.X !== 0 || dirToPlayer.Y !== 0) {
                    npc.rotation =
                        Vector2.ToRotation(dirToPlayer) - Math.PI / 2;
                }

                if (this.stateTimer === 10) {
                    this.ShootConePattern(npc, player, npc.ai[3]);
                }

                if (this.stateTimer >= 25) {
                    this.State = this.States.DashAndProj;
                    this.stateTimer = 0;
                    this.lastShootTimer = 0;
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

                this.bulletHellAngle += 0.035;
                npc.rotation += 0.03;

                /*
                 * Rhythmic pattern in 3-shot bursts with a pause to allow dodging.
                 */
                let cycle = this.stateTimer % 45;
                if (cycle === 0 || cycle === 10 || cycle === 20) {
                    this.ShootBulletHellWave(npc, this.bulletHellAngle);
                }
            }
        }

        if (npc.type == 5) {
            if (this.Phase1Dashing) {
                let direction = Vector2.Subtract(player.Center, npc.Center);

                if (direction.X !== 0 || direction.Y !== 0) {
                    direction = Vector2.Normalize(direction);
                }

                let speed = 8.0;
                npc.velocity = Vector2.Multiply(direction, speed);
            }
        }
    }

    ShootConePattern(npc, player, count = 1) {
        if (!this.rubyLaserType) {
            this.rubyLaserType = ModProjectile.getTypeByName("BloodScythe");
        }

        if (!this.rubyLaserType || this.rubyLaserType <= 0) return;

        let baseDir = Vector2.Subtract(player.Center, npc.Center);
        if (baseDir.X === 0 && baseDir.Y === 0) {
            baseDir = Vector2.new(0, 1);
        } else {
            baseDir = Vector2.Normalize(baseDir);
        }

        let baseAngle = Vector2.ToRotation(baseDir);
        let spreadAngle = Math.PI / 6; 
        let projCount = count;
        let startAngle = baseAngle - spreadAngle / 2;
        let angleStep = spreadAngle / (projCount - 1);

        let recoilVector = Vector2.Multiply(baseDir, -20.0);
        npc.velocity = Vector2.Add(npc.velocity, recoilVector);
        
        Effects.PlaySound(SoundID.Item14, npc.Center.X, npc.Center.Y);

        for (let i = 0; i < projCount; i++) {
            let currentAngle = startAngle + i * angleStep;
            let vel = Vector2.new(Math.cos(currentAngle), Math.sin(currentAngle));
            vel = Vector2.Multiply(vel, 6);
            
            let maxScale = 4;
            let scale = maxScale - (count - 1);

            let projIndex = Generic.NewProjectile(
                Projectile.GetNoneSource(),
                npc.Center,
                vel,
                this.rubyLaserType,
                16,
                0,
                Main.myPlayer,
                currentAngle - Math.PI / 2,
                0,
                0,
                null
            );

            if (projIndex >= 0 && projIndex < Main.projectile.length) {
                let proj = Main.projectile[projIndex];
                if (proj && proj.active) {
                    proj.scale = scale;
                }
            }
        }
    }

    ShootAndDashAI(npc) {
        if (npc.ai[2] == 8) {
            if (this.lastShootTimer <= 0) {
                this.ShootCrossSlimeRubyLaser(npc);
                this.lastShootTimer = 15;
            }
        }

        if (this.lastShootTimer > 0) {
            this.lastShootTimer--;
        }

        if (npc.ai[2] == 8) {
            npc.velocity = Vector2.Multiply(npc.velocity, 1.35);
        }
    }

    ShootBulletHellWave(npc, extraRot = 0) {
        if (!this.rubyLaserType) {
            this.rubyLaserType = ModProjectile.getTypeByName("BloodScythe");
        }

        if (!this.rubyLaserType || this.rubyLaserType <= 0) return;

        // Firing in cardinal/dual-cardinal directions with wide spacing (4 ways per wave)
        const angles = [0, 90, 180, 270];

        for (let i = 0; i < angles.length; i++) {
            let rad = angles[i] * (Math.PI / 180) + extraRot;
            let laserAngle = rad - Math.PI / 2;
            let vel = Vector2.new(Math.cos(rad), Math.sin(rad));
            
            // Reduced velocity to allow time for dodging
            vel = Vector2.Multiply(vel, 6.5);

            Generic.NewProjectile(
                Projectile.GetNoneSource(),
                npc.Center,
                vel,
                this.rubyLaserType,
                10,
                0,
                Main.myPlayer,
                laserAngle,
                0,
                0,
                null
            );
        }
    }

    ShootCrossSlimeRubyLaser(npc, extraRot = 0) {
        if (!this.rubyLaserType) {
            this.rubyLaserType = ModProjectile.getTypeByName("BloodScythe");
        }

        if (!this.rubyLaserType || this.rubyLaserType <= 0) {
            return;
        }

        const angles = [0, 30, 45, 90, 135, 180, 225, 270, 315];

        for (let i = 0; i < angles.length; i++) {
            let rad = angles[i] * (Math.PI / 180) + extraRot;
            let laserAngle = rad - Math.PI / 2;
            let vel = Vector2.new(Math.cos(rad), Math.sin(rad));
            vel = Vector2.Multiply(vel, 11);

            Generic.NewProjectile(
                Projectile.GetNoneSource(),
                npc.Center,
                vel,
                this.rubyLaserType,
                12,
                0,
                Main.myPlayer,
                laserAngle,
                0,
                0,
                null
            );
        }
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
