using("Terraria");
using("Terraria.ID");
using("Microsoft.Xna.Framework");

GlobalImports.AllModules();

const NewProjectile =
    Terraria.Projectile[
        "int NewProjectile(IEntitySource spawnSource, Vector2 position, Vector2 velocity, int Type, int Damage, float KnockBack, int Owner, float ai0, float ai1, float ai2, NewProjectileModifier modifer)"
    ];

const { ItemDropRule, LeadingConditionRule, Conditions } =
    Terraria.GameContent.ItemDropRules;

// Constantes e referências estáticas (Zero GC no Heap)
const TWO_PI = Math.PI * 2;
const PI = Math.PI;
const CRIMSON_COLOR = Color.Crimson;
const RED_COLOR = Color.Red;
const CLEAR_COLOR = Color.new();

const VEC_ZERO = Vector2.Zero;
const TEMP_SCALE = Vector2.new(1, 1);

export default class SlimeKing extends GlobalNPC {
    InitProperties() {
        if (this.initialized) return;
        this.Timer = 0;
        this.LaserAimDelay = 0;
        this.SlimeState = 0;
        this.PlayerAim = null;
        this.LaserProj = null;
        this.rubyLaserType = 0;
        this.rubyFlameType = 0;
        this.SpawnDrawPos = null;
        this.PlayerAimDrawPos = null;
        this.DrawScalePretty = Vector2.Zero;
        this.DrawScaleAlert = Vector2.Zero;
        this.DrawRotPretty = 0;
        this.DrawRotAlert = 0;
        
        // --- Controle de Fade In e Fade Out dos Efeitos ---
        this.IsChargingDraw = false;
        this.drawAlpha = 0; 
        this.rainAlpha = 0; // Transparência do Draw do Rain
        this.rainScaleProgress = 0; // Escala progressiva do Draw do Rain
        
        this.OriginPretty = null;
        this.OriginAlert = null;
        this.RectPretty = null;
        this.RectAlert = null;
        
        this.ShotsFired = 0; 
        this.RainPositions = [];
        this.RainTimer = 0;
        this.IsChargingRainDraw = false;
        
        // Starts on First AI.
        this.ChangeState(0);
        
        this.initialized = true;
    }
    
    OnKill(npc) {
        if (npc.type !== 50) return;
        
        let items = [
            ItemID.ManaCrystal,
            ItemID.WoodenCrate,
            ItemID.LifeCrystal,
        ];
        
        items.forEach(loot => {
            let stack = Math.floor((Math.random() * 2) + 1);
            Generic.dropItem(
                ModPlayer.Get("HargesMMode").MModeActivated == true,
                npc,
                loot,
                stack,
            );
        });
    }
    
    DrawDirect(npc) {
        // --- 1. GERENCIAMENTO DE FADE IN/OUT (CARREGAMENTO DA MIRA) ---
        if (this.IsChargingDraw) {
            if (this.drawAlpha < 1.0) {
                this.drawAlpha += 0.08;
                if (this.drawAlpha > 1.0) this.drawAlpha = 1.0;
            }
        } else {
            if (this.drawAlpha > 0) {
                this.drawAlpha -= 0.1;
                if (this.drawAlpha < 0) this.drawAlpha = 0;
            }
        }

        // --- 2. GERENCIAMENTO DE FADE IN/OUT (DRAW DA RAIN/CHUVA) ---
        if (this.IsChargingRainDraw) {
            if (this.rainAlpha < 1.0) {
                this.rainAlpha += 0.05; // Fade In suave de transparência
                if (this.rainAlpha > 1.0) this.rainAlpha = 1.0;
            }
        } else {
            if (this.rainAlpha > 0) {
                this.rainAlpha -= 0.08; // Fade Out suave ao disparar
                if (this.rainAlpha < 0) this.rainAlpha = 0;
            }
        }

        if (!this.PrettyTexturePartcile || !this.AllertTexturePartcile || !this.ShineTexturePartcile) {
            return;
        }

        if (!this.OriginPretty) {
            this.OriginPretty = Vector2.new(
                this.PrettyTexturePartcile.Width / 2,
                this.PrettyTexturePartcile.Height / 2
            );
            this.OriginAlert = Vector2.new(
                this.AllertTexturePartcile.Width / 2,
                this.AllertTexturePartcile.Height / 2
            );

            this.RectPretty = Rectangle.new(
                0,
                0,
                this.PrettyTexturePartcile.Width,
                this.PrettyTexturePartcile.Height
            );
            this.RectAlert = Rectangle.new(
                0,
                0,
                this.AllertTexturePartcile.Width,
                this.AllertTexturePartcile.Height
            );
        }

        const screenPos = Main.screenPosition;

        // --- DESENHO COM FADE IN DA MIRA NORMAL ---
        if (this.drawAlpha > 0 && this.SpawnDrawPos && this.PlayerAimDrawPos) {
            let baseScale = (this.progress * Math.PI * 0.21) * this.drawAlpha;
            this.DrawScalePretty = Vector2.new(baseScale, baseScale);
            this.DrawRotPretty = this.Timer * 0.1;

            const drawColor = Color.new(
                RED_COLOR.R * this.drawAlpha,
                RED_COLOR.G * this.drawAlpha,
                RED_COLOR.B * this.drawAlpha,
                0
            );

            const drawPosSpawn = Vector2.Subtract(this.SpawnDrawPos, screenPos);
            Generic.EntityDraw(
                this.PrettyTexturePartcile,
                drawPosSpawn,
                this.RectPretty,
                drawColor,
                this.DrawRotPretty,
                this.OriginPretty,
                this.DrawScalePretty,
                SpriteEffects.None
            );

            const drawPosAim = Vector2.Subtract(
                this.PlayerAimDrawPos,
                screenPos
            );

            Generic.EntityDraw(
                this.PrettyTexturePartcile,
                drawPosAim,
                this.RectPretty,
                drawColor,
                this.DrawRotPretty,
                this.OriginPretty,
                this.DrawScalePretty,
                SpriteEffects.None
            );
        }

        // --- DRAW DA RAIN COM FADE IN DE TRANSPARÊNCIA E ESCALA PROGRESSIVA ---
        if (this.rainAlpha > 0 && this.RainPositions.length > 0) {
            const rainColor = Color.new(
                RED_COLOR.R * this.rainAlpha,
                RED_COLOR.G * this.rainAlpha,
                RED_COLOR.B * this.rainAlpha,
                0
            );

            // Transição de escala: cresce suavemente de 0 a 0.25 de acordo com o progresso
            const currentScale = 0.25 * this.rainScaleProgress * this.rainAlpha;
            const rainScaleVec = Vector2.new(currentScale, currentScale);
            const rainRot = this.Timer * 0.08;

            for (let i = 0; i < this.RainPositions.length; i++) {
                const drawPos = Vector2.Subtract(this.RainPositions[i], screenPos);
                Generic.EntityDraw(
                    this.ShineTexturePartcile,
                    drawPos,
                    this.RectPretty,
                    rainColor,
                    rainRot,
                    this.OriginPretty,
                    rainScaleVec,
                    SpriteEffects.None
                );
            }
        }
    }

    SetStaticDefaults() {
        this.PrettyTexturePartcile = tl.texture.load(
            "Assets/Adittive/Pretty.png"
        );
        this.AllertTexturePartcile = tl.texture.load(
            "Assets/Adittive/Allert.png"
        );
        this.ShineTexturePartcile = tl.texture.load(
            "Assets/Adittive/Shine.png"
        );
    }

    AI(npc) {
        if (npc.type !== NPCID.KingSlime || !npc.active) return;
        if (ModPlayer.Get("HargesMMode").MModeActivated == false) return;

        this.InitProperties();
        this.SlimeAI(npc);
    }

    ChangeState(newState) {
        this.SlimeState = newState;
    }

    SlimeAI(npc) {
        this.Timer++;
        this.LaserAimDelay++;

        const spawnPos = Vector2.new(npc.Center.X, npc.Center.Y - 70);
        const lifePercent = (npc.life / npc.lifeMax) * 100;

        if (this.LaserProj && !this.LaserProj.active) {
            this.LaserProj = null;
        }
        if (this.LaserProj) {
            this.LaserProj.Center = spawnPos;
        }

        const shootTime = lifePercent <= 50 ? Generic.toSec(2) : Generic.toSec(3); 

        if (this.SlimeState === 0) {
            this.LaserCharging(npc, spawnPos, shootTime);
        } else if (this.SlimeState === 1) {
            this.LaserShootOnAIm(npc, spawnPos);
        } else if (this.SlimeState === 2) {
            this.PreAnimationOfLaser(npc, spawnPos);
        } else if (this.SlimeState === 3) {
            this.LaserRainAtack(npc, 600);
        }
    }

    LaserCharging(npc, spawnPos, shootTime) {
        const timeToEscape = 35;
        const chargeDuration = Math.min(45, shootTime - timeToEscape);
        const startChargeTime = shootTime - chargeDuration;
        const targetPlayer = Main.player[npc.target];

        if (!targetPlayer || !targetPlayer.active || targetPlayer.dead) return;

        if (this.Timer < shootTime - timeToEscape || !this.PlayerAim) {
            this.PlayerAim = Vector2.new(targetPlayer.Center.X, targetPlayer.Center.Y);
        }

        if (this.Timer >= startChargeTime && this.Timer < shootTime) {
            const timer = this.Timer;
            this.progress = (timer - startChargeTime) / chargeDuration;
            const radius = 20 + (1.0 - this.progress) * 90;
            const aim = this.PlayerAim;

            this.IsChargingDraw = true;

            this.SpawnDrawPos = spawnPos;
            this.PlayerAimDrawPos = aim;

            const baseAngle = timer * 0.08;
            for (let k = 0; k < 2; k++) {
                const angle = baseAngle + k * PI;
                const dustPos = Vector2.new(
                    aim.X + Math.cos(angle) * radius,
                    aim.Y + Math.sin(angle) * radius
                );
                
                const d = Dust.NewDust(
                    dustPos,
                    0,
                    0,
                    60,
                    0,
                    0,
                    120,
                    CLEAR_COLOR,
                    1.4 * this.progress
                );
                Main.dust[d].noGravity = true;
                Main.dust[d].velocity = VEC_ZERO;
            }
        } else {
            this.IsChargingDraw = false;
        }

        if (this.Timer >= shootTime) this.ChangeState(1);
    }

    SetupRainPositions(npc, spacing = 180) {
        npc.ai[0] = 10;
        npc.ai[2] = 5;
        
        const target = Main.player[npc.target];
        if (!target) return;

        this.RainPositions = [];
        const playerY = target.Center.Y;
        
        const screenLeft = Main.screenPosition.X - 100;
        const screenRight = Main.screenPosition.X + Main.screenWidth + 100;

        for (let x = screenLeft; x <= screenRight; x += spacing) {
            this.RainPositions.push(Vector2.new(x, playerY));
        }
    }

    PreAnimationOfLaser(npc, spawnPos) {
        const target = Main.player[npc.target];
        if (!target || !target.active || target.dead) {
            this.IsChargingRainDraw = false;
            this.RainTimer = 0;
            this.rainScaleProgress = 0;
            this.ChangeState(0);
            return;
        }

        this.RainTimer++;
        const maxDuration = Generic.toSec(3);


        if (this.RainTimer === 1) {
            this.SetupRainPositions(npc, 180);
            this.IsChargingRainDraw = true;
        }


        this.rainScaleProgress = Math.min(1.0, this.RainTimer / maxDuration);

        if (this.RainTimer === 60) {
            const projDamage = Generic.getFixedDamage(10);
            this.LaserShoot(spawnPos, Vector2.new(0, -12), projDamage);
        }

        if (this.RainTimer > 60) {
            for (let i = 0; i < this.RainPositions.length; i++) {
                if (Math.random() < 0.3) {
                    const d = Dust.NewDust(
                        this.RainPositions[i],
                        0,
                        0,
                        60,
                        0,
                        -1,
                        100,
                        CLEAR_COLOR,
                        1.1 * this.rainAlpha
                    );
                    Main.dust[d].noGravity = true;
                }
            }
        }

        if (this.RainTimer >= maxDuration) {
            this.RainTimer = 0;
            this.IsChargingRainDraw = false;
            this.ChangeState(3);
        }
    }

    LaserRainAtack(npc, YOffSet = 1200) {
        const target = Main.player[npc.target];
        const projDamage = Generic.getFixedDamage(12);

        if (target && target.active && !target.dead && this.RainPositions.length > 0) {
            for (let i = 0; i < this.RainPositions.length; i++) {
                const targetPos = this.RainPositions[i];
                const spawnY = targetPos.Y - YOffSet;
                const dropPos = Vector2.new(targetPos.X, spawnY);

                this.LaserShoot(dropPos, Vector2.new(0, 14), projDamage);
            }
        }
        
        this.RainPositions = [];
        this.ShotsFired = 0;
        this.Timer = 0;
        this.PlayerAim = null;
        this.rainScaleProgress = 0;
        this.IsChargingRainDraw = false;
        this.ChangeState(0);
    }

    LaserShoot(pos, velocity, damage) {
        if (!this.rubyLaserType) {
            this.rubyLaserType =
                ModProjectile.getTypeByName("SlimeRubyLaser");
        }
        
        let laser = Generic.NewProjectile(
            Projectile.GetNoneSource(),
            pos,
            velocity,
            this.rubyLaserType,
            damage,
            0.5,
            Main.myPlayer,
            0,
            0,
            0,
            null
        );
        
        return laser;
    }

    LaserShootOnAIm(npc, spawnPos) {
        this.Timer = 0;
        this.IsChargingDraw = false;
        const target = Main.player[npc.target];

        if (target && target.active && !target.dead && this.PlayerAim) {
            let heading = Vector2.Subtract(this.PlayerAim, spawnPos);
            let direction = Vector2.Normalize(heading);

            const projDamage = Generic.getFixedDamage(12);
            
            this.Laser = this.LaserShoot(spawnPos, Vector2.Multiply(direction, 11), projDamage);
            this.LaserProj = Main.projectile[this.Laser];

            for (let i = 0; i < 20; i++) {
                const vx = (Math.random() - 0.5) * 6;
                const vy = (Math.random() - 0.5) * 6;
                const d = Dust.NewDust(
                    spawnPos,
                    0,
                    0,
                    60,
                    vx,
                    vy,
                    100,
                    CLEAR_COLOR,
                    1.8
                );
                Main.dust[d].noGravity = true;
            }
        }
        
        this.PlayerAim = null;

        const lifePercent = (npc.life / npc.lifeMax) * 100;

        if (lifePercent <= 50) {
            this.ShotsFired++;
            
            if (this.ShotsFired >= 3) {
                this.RainTimer = 0;
                this.rainScaleProgress = 0;
                this.ChangeState(2);
            } else {
                this.ChangeState(0);
            }
        } else {
            this.ShotsFired = 0;
            this.ChangeState(0);
        }
    }

    OnHitPlayer(npc, target, hurtInfo) {
        if (npc.type === NPCID.KingSlime) {
            if (!this.rubyFlameType) {
                this.rubyFlameType = ModBuff.getTypeByName("RubyFlame");
            }
            if (this.rubyFlameType > 0) {
                target.AddBuff(this.rubyFlameType, 240, true);
            }
        }
    }
}
