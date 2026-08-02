let DustID = Terraria.ID;

using('Terraria');
using('Terraria.Graphics.CameraModifiers');
using('Microsoft.Xna.Framework')
using('Terraria.DataStructures')
using('Terraria.Graphics')
using('Terraria.Graphics.Shaders')

GlobalImports.AllModules();

// tl.log(Object.keys(VertexStrip).join("\n"));

let PunchCameraNew = (startPosition, direction, strength) => {
    try {
        let modifier = PunchCameraModifier.new();
        modifier['void .ctor(Vector2 startPosition, Vector2 direction, float strength, float vibrationCyclesPerSecond, int frames, float distanceFalloff, string uniqueIdentity)'](
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
        let modifier = PunchCameraModifier.new()['void .ctor(Vector2 startPosition, Vector2 direction, float strength, float vibrationCyclesPerSecond, int frames, float distanceFalloff, string uniqueIdentity)'](
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

export class BloodScythe extends ModProjectile {
    constructor() {
        super();
        this.Texture = `Projectiles/${this.constructor.name}`;
        this.ScytheTexture = null;
        this.LaserPreview = null;
        this._vertexStrip = VertexStrip.new();
        
    }

    SetStaticDefaults() {
        this.ScytheTexture = tl.texture.load("Textures/Projectiles/BloodScythe.png");
        this.LaserPreview = tl.texture.load("Textures/Projectiles/Visual/ThinLaser.png");
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
        let hue = ((progressOnStrip * 1.6 - Main.GlobalTimeWrappedHourly) % 1.0 + 1.0) % 1.0;
        let rainbow = Main.hslToRgb(hue, 1.0, 0.5);
        let lerpFactor = Utils.GetLerpValue(-0.2, 0.5, progressOnStrip, true);
        let baseColor = Color.Lerp(Color.White, rainbow, lerpFactor);
        let fadeOut = 1.0 - Utils.GetLerpValue(0.0, 0.98, progressOnStrip, true);
    
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
       } 
       else if (ai[1] % 3 === 0) {
            proj.rotation += 1.8;
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

        let rotation = Vector2.ToRotation(proj.velocity) - (Math.PI / 2);

        let startColor = Color.new(255, 30, 30, 0);
        let transparentColor = Color.new(0, 0, 0, 0);
        let previewColor = Color.Lerp(startColor, transparentColor, progress);

        let origin = Vector2.new(parseFloat(this.LaserPreview.Width / 2), 0.0);

        Generic.EntityDraw(
            this.LaserPreview,
            Generic.toScreenPosition(proj.Center),
            Generic.getRect(this.LaserPreview),
            previewColor,
            rotation,
            origin,
            scale,
            SpriteEffects.None
        );
    }
    
    PreDraw(proj, lightColor) {
        let ai = new ProjAI(proj);
        this.Draw(proj)
        if (ai[1] < 30) {
            this.DrawLaserPreview(proj);
        }

        let tex = this.ScytheTexture || TextureAssets.Projectile[proj.type].Value;
        if (!tex) return false;
        
        let finalScale = Vector2.new(parseFloat(proj.scale), parseFloat(proj.scale));

        let time = Main.GlobalTimeWrappedHourly * 5.0;
        let pulse = (Math.sin(time) + 1.0) * 0.5;

        let r = Math.floor(220 + (pulse * 35));
        let g = Math.floor(20 + (pulse * 30));
        let b = Math.floor(40 + (pulse * 30));
        let redColor = Color.new(r, g, b, 0);

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

        return false;
    }
}

export class EocArena extends ModProjectile {
    constructor() {
        super();
        this.ArenaAsset = null;
        this.ArenaRotation = 0.0;
        
        this.oldPos = [];
        this.oldRot = [];
        this.oldScale = [];
        this.maxTrailLength = 8;

        this.currentBaseScale = 12.0; // Começa enorme (de fora para dentro)
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
        Eoc.initialize = false;
    }
    
    AI(proj) {
        let player = Main.player[0];
        
        if (!player || !player.active || player.statLife <= 0) {
            proj.Kill();
            return;
        }

        this.ArenaRotation += 0.05;

        let ai = new ProjAI(proj);
        
        // Define o alvo da escala dependendo da fase
        let normalScale = (ai[0] === 1) ? 4.5 : 3.0;
        
        // Animação de fechamento inicial (de fora para dentro nos primeiros frames)
        if (this.currentBaseScale > normalScale) {
            this.currentBaseScale = Math.max(normalScale, this.currentBaseScale - 0.25);
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
        this.oldScale.unshift(Vector2.new(parseFloat(scaleX), parseFloat(scaleY)));

        if (this.oldPos.length > this.maxTrailLength) {
            this.oldPos.pop();
            this.oldRot.pop();
            this.oldScale.pop();
        }

        let averageScale = (scaleX + scaleY) / 2;

        if (this.ArenaAsset) {
            let arenaRadius = (this.ArenaAsset.Width / 2) * averageScale * 0.92;

            if (Main.GameUpdateCount % 60 === 0) {
                let playerDistance = Vector2.Distance(player.Center, proj.Center);
                if (playerDistance > arenaRadius) {
                    player.AddBuff(BuffID.Obstructed, 60, true);
                    player.AddBuff(BuffID.Venom, 60, true);
                }
            }
        }
    }

    PreDraw(proj, lightColor) {
        if (!this.ArenaAsset) return false;

        let rect = Rectangle.new(0, 0, this.ArenaAsset.Width, this.ArenaAsset.Height);
        let origin = Vector2.new(parseFloat(this.ArenaAsset.Width / 2), parseFloat(this.ArenaAsset.Height / 2));

        let baseR = Math.floor(120 + (Math.sin(Main.GameUpdateCount * 0.05) * 0.5 + 0.5) * 135);

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
    }

    Init(npc, player) {
        if (!this.initialize) {
            npc.Center = Vector2.new(player.Center.X, player.Center.Y - 450); // Começa bem alto na tela
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
    
    SpawnAnimation(npc, player) {
        Main.hideUI = true;
        
        let progress = 1.0 - (this.SpawnAnimationTime / Generic.toSec(3));
            
        let easeProgress = 1.0 - Math.pow(1.0 - progress, 3.0);
        let startY = player.Center.Y - 800;
        let targetY = player.Center.Y - 200;
        
        npc.Center = Vector2.new(player.Center.X, startY + (targetY - startY) * easeProgress);
        npc.velocity = Vector2.Zero;
        npc.rotation = 0.0;
        
        
        
        Camera.Shake(60, 2.5)
        
        this.SpawnAnimationTime--
        
        if (this.SpawnAnimationTime <= 0) {
        
            
             
              
               


                 // 
            /*Generic.NewProjectile(
                Projectile.GetNoneSource(),
                npc.Center,
                Vector2.Zero,
                1091,
                10,
                0,
                Main.myPlayer,
                0, 0, 0, null
            );*/
            
            Harges.Graphics.SpawnStormLightning(npc.Center, Vector2.new(0,0), Color.Red)
            Harges.Graphics.SpawnLightning(npc.Center, Vector2.Zero, Color.Red, 5)
        let totalTime = Generic.toSec(3);
            
            Effects.PlaySound(SoundID.Roar, npc.Center.X, npc.Center.Y);
            
            Camera.Shake(30, 5.0)
            
            Main.hideUI = false;
            this.OnSpawnAnimation = false;
        }
    }

    SetDefaults(npc) {
        if (npc.type == 4) {
        
        
        Camera.Shake(60, 5)
        
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
    let player = Main.player[0];
    
    if (npc?.type == 4) {
        let targetCameraPos = Vector2.new(
            npc.Center.X - Main.screenWidth / 2,
            npc.Center.Y - Main.screenHeight / 2
        );      
        
        let applyCameraPos = force => {
            Main.screenPosition = Vector2.Lerp(Main.screenPosition, targetCameraPos, force);
        };
        
        if (this.OnSpawnAnimation) {
            // Main.GameZoomTarget = 0.58
            applyCameraPos(0.5);
        }
        
        if (this.State === this.States.FinalBulletHell) {
            applyCameraPos(0.1);
        }
    }
}

    
    SpawnStormLightning(pos, movement, color) {
    let finalColor = color ?? Color.White;

    // Corpo do raio
    let lightningParticle = Terraria.GameContent.Drawing.ParticleOrchestrator.StormLightningParticles.RequestParticle();
    let duration = 45;
    let x = Math.floor(movement.X);

    lightningParticle.Prepare(x, pos, duration, finalColor);
    Terraria.Main.ParticleSystem_World_OverPlayers.Add(lightningParticle);

    let endPos = lightningParticle.EndPosition;

    /*
    // Flash de impacto (camada externa, colorida)
    let scaleBase1 = Vector2.new(1.1, 1.1);
    let scaleVel1 = Vector2.new(-0.9, -0.9);
    let i1 = 1091;

    let fadingParticle1 = Terraria.GameContent.Drawing.ParticleOrchestrator._poolFading.RequestParticle();
    fadingParticle1.SetBasicInfo(
        Terraria.GameContent.TextureAssets.Projectile[i1],
        null,
        Vector2.Zero,
        endPos
    );
    fadingParticle1.SetTypeInfo(parseFloat(duration));
    fadingParticle1.ColorTint = finalColor;
    fadingParticle1.ColorTint.A = 0;
    fadingParticle1.FadeInNormalizedTime = 0.01;
    fadingParticle1.FadeOutNormalizedTime = 0.6;
    fadingParticle1.Scale = scaleBase1;
    fadingParticle1.ScaleVelocity = Vector2.Multiply(scaleVel1, 1.0 / duration);
    fadingParticle1.ScaleAcceleration = Vector2.Multiply(fadingParticle1.ScaleVelocity, -1.0 / duration);
    Terraria.Main.ParticleSystem_World_OverPlayers.Add(fadingParticle1);

    // Flash de impacto (camada interna, branca)
    let fadingParticle2 = Terraria.GameContent.Drawing.ParticleOrchestrator._poolFading.RequestParticle();
    fadingParticle2.SetBasicInfo(
        Terraria.GameContent.TextureAssets.Projectile[i1],
        null,
        Vector2.Zero,
        endPos
    );
    fadingParticle2.SetTypeInfo(parseFloat(duration));
    fadingParticle2.ColorTint = Color.new(255, 255, 255, 255);
    fadingParticle2.FadeInNormalizedTime = 0.01;
    fadingParticle2.FadeOutNormalizedTime = 0.6;
    fadingParticle2.Scale = Vector2.Multiply(scaleBase1, 0.7);
    fadingParticle2.ScaleVelocity = Vector2.Multiply(Vector2.Multiply(scaleVel1, 0.7), 1.0 / duration);
    fadingParticle2.ScaleAcceleration = Vector2.Multiply(fadingParticle2.ScaleVelocity, -1.0 / duration);
    Terraria.Main.ParticleSystem_World_OverPlayers.Add(fadingParticle2);

    // Rajada de faíscas ao redor do impacto
    let sparkCount = 12;
    let i2 = 916;

    for (let num4 = 0.0; num4 < 1.0; num4 += 1.0 / sparkCount) {
        let timeToLive = Math.floor(Math.random() * (22 - 14)) + 14;

        let angle = Math.random() * Math.PI * 2;
        let dist = Math.random() * 6;
        let initialLocalPosition = Vector2.Multiply(
            Vector2.new(Math.cos(angle) * dist, Math.sin(angle) * dist),
            0.7
        );

        let velAngle = Math.random() * Math.PI * 2;
        let velDist = Math.random() * 6;
        let sparkVelocity = Vector2.new(Math.cos(velAngle) * velDist, Math.sin(velAngle) * velDist);

        let spark1 = Terraria.GameContent.Drawing.ParticleOrchestrator._poolRandomizedFrame.RequestParticle();
        spark1.SetBasicInfo(
            Terraria.GameContent.TextureAssets.Projectile[i2],
            null,
            Vector2.Zero,
            initialLocalPosition
        );
        spark1.SetTypeInfo(Terraria.Main.projFrames[i2], 3, parseFloat(timeToLive));
        spark1.Velocity = sparkVelocity;
        spark1.ColorTint = finalColor;
        spark1.LocalPosition = Vector2.Add(endPos, initialLocalPosition);
        spark1.Rotation = Vector2.ToRotation(spark1.Velocity);
        spark1.Scale = Vector2.Multiply(Vector2.new(1.5, 0.75), 0.85);
        spark1.FadeInNormalizedTime = 0.01;
        spark1.FadeOutNormalizedTime = 0.0;
        spark1.ScaleVelocity = Vector2.new(0.025, 0.025);
        Terraria.Main.ParticleSystem_World_OverPlayers.Add(spark1);

        let spark2 = Terraria.GameContent.Drawing.ParticleOrchestrator._poolRandomizedFrame.RequestParticle();
        spark2.SetBasicInfo(
            Terraria.GameContent.TextureAssets.Projectile[i2],
            null,
            Vector2.Zero,
            initialLocalPosition
        );
        spark2.SetTypeInfo(Terraria.Main.projFrames[i2], 3, parseFloat(timeToLive));
        spark2.Velocity = spark1.Velocity;
        spark2.ColorTint = Color.new(255, 255, 255, 0);
        spark2.LocalPosition = spark1.LocalPosition;
        spark2.Rotation = spark1.Rotation;
        spark2.Scale = Vector2.Multiply(spark1.Scale, 0.5);
        spark2.FadeInNormalizedTime = spark1.FadeInNormalizedTime;
        spark2.FadeOutNormalizedTime = spark1.FadeOutNormalizedTime;
        spark2.ScaleVelocity = Vector2.Multiply(spark1.ScaleVelocity, 0.5);
        Terraria.Main.ParticleSystem_World_OverPlayers.Add(spark2);
    }
    */
}
    AI(npc) {
        let player = Main.player[0];

        if (!player || !player.active || player.statLife <= 0) {
            return;
        }
        
        if (npc.type == 4) {
            this.Init(npc, player);
            
            let arenaType = ModProjectile.getTypeByName("EocArena");

            if (this.ArenaProjectileIndex === -1 || !Main.projectile[this.ArenaProjectileIndex].active || Main.projectile[this.ArenaProjectileIndex].type !== arenaType) {
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
           
            this.Phase2 = (npc.ai[0] === 3 || npc.ai[1] === 4);
            
            // Arena logic Zone.
            if (this.ArenaProjectileIndex >= 0 && this.ArenaProjectileIndex < Main.projectile.length) {
                let arenaProj = Main.projectile[this.ArenaProjectileIndex];
                let ai = new ProjAI(arenaProj);
                
                if (arenaProj && arenaProj.active && arenaProj.type === arenaType) {
                    arenaProj.Center = npc.Center;
                    arenaProj.timeLeft = 2;

                    ai[0] = this.Phase2 ? 1 : 0;
                }
            }
            
            if (this.OnSpawnAnimation) {
                this.SpawnAnimation(npc, player);
                return;
            }
   
            this.Phase1Dashing = (npc.ai[1] == 2 && npc.ai[2] == 8);
            this.Phase2Dashing = (npc.ai[1] == 4 && npc.ai[2] == 1);
            
            if (npc.life <= npc.lifeMax * 0.15 && this.State !== this.States.FinalBulletHell) {
                Effects.PlaySound(SoundID.Roar, npc.Center.X, npc.Center.Y);
                this.State = this.States.FinalBulletHell;
                this.stateTimer = 0;
            }

            if (this.State === this.States.DashAndProj) {
                this.ShootAndDashAI(npc);

                if (this.Phase2) {
                    let isDashingNow = (npc.ai[1] == 4);
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
            } 
            else if (this.State === this.States.StopAndShootCone) {
                this.stateTimer++;

                npc.velocity = Vector2.Multiply(npc.velocity, 0.85);
                let dirToPlayer = Vector2.Subtract(player.Center, npc.Center);
                npc.rotation = Vector2.ToRotation(dirToPlayer) - (Math.PI / 2);

                if (this.stateTimer === 30) {
                    let baseAngle = Vector2.ToRotation(Vector2.Normalize(dirToPlayer));
                    let spread = 0.26;
                    let speed = 6.0;
                    let angles = [baseAngle - spread, baseAngle, baseAngle + spread];

                    angles.forEach(angle => {
                        let dir = Vector2.new(parseFloat(Math.cos(angle) * speed), parseFloat(Math.sin(angle) * speed));
                        Generic.NewProjectile(
                            Projectile.GetNoneSource(),
                            npc.Center,
                            dir,
                            ModProjectile.getTypeByName("BloodScythe"),
                            8,
                            0,
                            Main.myPlayer,
                            0, 0, 0, null
                        );
                    });
                }

                if (this.stateTimer >= 45) {
                    this.State = this.States.DashAndProj;
                    this.stateTimer = 0;
                }
            } 
            else if (this.State === this.States.FinalBulletHell) {
                this.stateTimer++;
                
                npc.dontTakeDamage = true;
                npc.ai[1] = 0;
                npc.ai[2] = 0;
                
                npc.life -= 0.2;
                if (npc.life <= 0) {
                    npc.checkDead();
                }

                npc.velocity = Vector2.Zero;

                this.bulletHellAngle += 0.30;
                npc.rotation += 0.05;

                if (this.stateTimer % 20 === 0) {
                    let speed = 3.5;
                    for (let i = 0; i < 4; i++) {
                        let angle = this.bulletHellAngle + (i * (Math.PI / 2));
                        let dir = Vector2.new(parseFloat(Math.cos(angle) * speed), parseFloat(Math.sin(angle) * speed));

                        Generic.NewProjectile(
                            Projectile.GetNoneSource(),
                            npc.Center,
                            dir,
                            ModProjectile.getTypeByName("BloodScythe"),
                            10,
                            0,
                            Main.myPlayer,
                            0, 0, 0, null
                        );
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
            this.ShootCrossBloodBloodScythe(npc);
            
            let phase1 = npc.ai[1] == 2;
            if (phase1) npc.velocity = Vector2.Multiply(npc.velocity, 1.4);
        }
    }
    
    ShootCrossBloodBloodScythe(npc) {
        let vel = 0.5;
        const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
        angles.forEach(angle => {
            let rad = (Math.PI / 180) * angle;
            
            let damage = 5;
            let dir = Vector2.new(parseFloat(Math.cos(rad) * vel), parseFloat(Math.sin(rad) * vel));
            
            return Generic.NewProjectile(
                Projectile.GetNoneSource(),
                npc.Center,
                dir,
                ModProjectile.getTypeByName("BloodScythe"),
                damage,
                0,
                Main.myPlayer,
                0,
                0,
                0,
                null
            );
        });
    }
    
    OnHitPlayer(npc, target, hurtInfo) {
        if (npc.type == 4) {
            target.AddBuff(ModBuff.getTypeByName("EocCurse"), this.Phase2 ? Generic.toSec(3) : Generic.toSec(1), true);
            target.AddBuff(BuffID.Obstructed, Generic.toSec(1), true);
        }

        if (npc.type == 5) {
            target.AddBuff(23, 5, false);
        }
    }
}
