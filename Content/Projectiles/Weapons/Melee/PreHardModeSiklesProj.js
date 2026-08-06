using("Terraria");

const { SpriteEffects } = Microsoft.Xna.Framework.Graphics;

let canHit =
    Collision[
        "bool CanHit(Vector2 Position1, int Width1, int Height1, Vector2 Position2, int Width2, int Height2)"
    ];

export class CarminSikleProj extends ModProjectile {
    static SWINGRANGE = 1.67 * Math.PI;
    static FIRSTHALFSWING = 0.45;
    static SPINRANGE = 3.5 * Math.PI;
    static WINDUP = 0.15;
    static UNWIND = 0.4;
    static SPINTIME = 2.5;

    constructor() {
        super();
        this.Texture = "Projectiles/Weapons/Melee/" + this.constructor.name;
    }

    SetStaticDefaults() {
        this.TextureAsset =
            Terraria.GameContent.TextureAssets.Projectile[this.Type].Value;
    }

    SetDefaults() {
        let proj = this.Projectile;

        proj.width = 132 * 1.2;
        proj.height = 119 * 1.2;
        proj.friendly = true;
        proj.timeLeft = 10000;
        proj.penetrate = -1;
        proj.knockBack = Main.player[0].HeldItem
            ? Main.player[0].HeldItem.knockBack
            : 0;

        // Atravessar paredes
        proj.tileCollide = false;
        proj.ignoreWater = true;

        this.Projectile.usesLocalNPCImmunity = true;
        this.Projectile.localNPCHitCooldown = 35;

        this.CurrentAttack = 0;
        this.CurrentStage = 0;
        this.InitialAngle = 0;
        this.Timer = 0;
        this.Progress = 0;
        this.Size = 0;
        this.PrevRotation = 0;
    }

    OnTileCollide(proj, oldVelocity) {
        return false;
    }

    OnSpawn(source) {
        let proj = this.Projectile;
        let owner = Main.player[0];

        proj.spriteDirection =
            Main.MouseWorld.X > owner.MountedCenter.X ? 1 : -1;

        let targetAngle = Math.atan2(
            Main.MouseWorld.Y - owner.MountedCenter.Y,
            Main.MouseWorld.X - owner.MountedCenter.X
        );

        if (this.CurrentAttack === 1) {
            this.InitialAngle =
                -Math.PI / 2 - Math.PI * (1 / 3) * proj.spriteDirection;
        } else {
            if (proj.spriteDirection === 1) {
                targetAngle = Math.max(
                    -Math.PI * (1 / 3),
                    Math.min(Math.PI * (1 / 6), targetAngle)
                );
            } else {
                if (targetAngle < 0) {
                    targetAngle += 2 * Math.PI;
                }
                targetAngle = Math.max(
                    Math.PI * (5 / 6),
                    Math.min(Math.PI * (4 / 3), targetAngle)
                );
            }

            this.InitialAngle =
                targetAngle -
                CarminSikleProj.FIRSTHALFSWING *
                    CarminSikleProj.SWINGRANGE *
                    proj.spriteDirection;
        }
    }

    AI(proj) {
        let owner = Main.player[proj.owner];
        this.PrevRotation = proj.rotation;

        owner.itemAnimation = 2;
        owner.itemTime = 2;

        if (!owner.active || owner.dead || owner.noItems || owner.CCed) {
            proj.Kill();
            return;
        }

        let attackSpeed = owner.GetTotalAttackSpeed
            ? owner.GetTotalAttackSpeed(proj.DamageType)
            : 1;
        let prepTime = 12 / attackSpeed;
        let execTime = 12 / attackSpeed;
        let hideTime = 12 / attackSpeed;

        // Fases do ataque
        switch (this.CurrentStage) {
            case 0:
                this.PrepareStrike(prepTime);
                break;
            case 1:
                this.ExecuteStrike(execTime);
                break;
            default:
                this.UnwindStrike(proj, hideTime);
                break;
        }

        this.SetSwordPosition(owner, proj);
        this.Timer++;
    }

    PrepareStrike(prepTime) {
        this.Progress =
            CarminSikleProj.WINDUP *
            CarminSikleProj.SWINGRANGE *
            (1 - this.Timer / prepTime);

        let t = this.Timer / prepTime;
        this.Size = t * t * (3 - 2 * t);

        if (this.Timer >= prepTime) {
            this.CurrentStage = 1;
            this.Timer = 0;
        }
    }

    ExecuteStrike(execTime) {
        if (this.CurrentAttack === 0) {
            let t = (1 - CarminSikleProj.UNWIND) * (this.Timer / execTime);
            this.Progress = t * t * (3 - 2 * t) * CarminSikleProj.SWINGRANGE;

            if (this.Timer >= execTime) {
                this.CurrentStage = 2;
                this.Timer = 0;
            }
        } else {
            let t =
                (1 - CarminSikleProj.UNWIND / 2) *
                (this.Timer / (execTime * CarminSikleProj.SPINTIME));
            this.Progress = t * t * (3 - 2 * t) * CarminSikleProj.SPINRANGE;

            if (this.Timer >= execTime * CarminSikleProj.SPINTIME) {
                this.CurrentStage = 2;
                this.Timer = 0;
            }
        }
    }

    UnwindStrike(projectile, hideTime) {
        if (this.CurrentAttack === 0) {
            let t =
                1 -
                CarminSikleProj.UNWIND +
                (CarminSikleProj.UNWIND * this.Timer) / hideTime;
            let smoothProgress = t * t * (3 - 2 * t);
            this.Progress = CarminSikleProj.SWINGRANGE * smoothProgress;

            let sizeT = this.Timer / hideTime;
            this.Size = 1 - sizeT * sizeT * (3 - 2 * sizeT);

            if (this.Timer >= hideTime) {
                projectile.Kill();
            }
        } else {
            let spinHideTime = (hideTime * CarminSikleProj.SPINTIME) / 2;
            let t =
                1 -
                CarminSikleProj.UNWIND / 2 +
                ((CarminSikleProj.UNWIND / 2) * this.Timer) / spinHideTime;
            let smoothProgress = t * t * (3 - 2 * t);
            this.Progress = CarminSikleProj.SPINRANGE * smoothProgress;

            let sizeT = this.Timer / spinHideTime;
            this.Size = 1 - sizeT * sizeT * (3 - 2 * sizeT);

            if (this.Timer >= spinHideTime) {
                projectile.Kill();
            }
        }
    }

    SetSwordPosition(owner, proj) {
        proj.rotation =
            this.InitialAngle + proj.spriteDirection * this.Progress;

        let armAngle = proj.rotation - Math.PI / 2;

        if (owner.SetCompositeArmFront) {
            owner.SetCompositeArmFront(
                true,
                Player.CompositeArmStretchAmount.Full,
                armAngle
            );
        }

        let armPosition = owner.GetFrontHandPosition(
            Player.CompositeArmStretchAmount.Full,
            armAngle
        );

        if (owner.gravDir === -1) {
            proj.rotation = -proj.rotation;
            armPosition.Y = owner.Bottom.Y + (owner.position.Y - armPosition.Y);
        }

        armPosition.Y += owner.gfxOffY;
        proj.Center = armPosition;
        proj.scale =
            this.Size * 0.7 * owner.GetAdjustedItemScale(owner.HeldItem);
        owner.heldProj = proj.whoAmI;
    }

    PreDraw(proj, lightColor) {
        let rect = Generic.getRect(this.TextureAsset);

        let origin;
        let rotationOffset;
        let effects;

        if (proj.spriteDirection > 0) {
            origin = Vector2.new(0, rect.Height);
            rotationOffset = (45 * Math.PI) / 180;
            effects = SpriteEffects.None;
        } else {
            origin = Vector2.new(rect.Width, rect.Height);
            rotationOffset = (135 * Math.PI) / 180;
            effects = SpriteEffects.FlipHorizontally;
        }

        let maxRange =
            this.CurrentAttack === 1
                ? CarminSikleProj.SPINRANGE
                : CarminSikleProj.SWINGRANGE;
        let progressFactor = Math.max(0, Math.min(1, this.Progress / maxRange));

        let fadeFactor = Math.pow(progressFactor, 4);
        let baseColor = Color.White;

        let stretchY = 1 - 0.2 * progressFactor;

        let scaleVector = Vector2.new(proj.scale, proj.scale * stretchY);

        Generic.EntityDraw(
            this.TextureAsset,
            Generic.toScreenPosition(proj.Center),
            rect,
            baseColor,
            proj.rotation + rotationOffset,
            origin,
            scaleVector,
            effects
        );

        return false;
    }

    ModifyDamageHitbox(proj, hitbox) {
        if (this.Size < 0.1 || this.CurrentStage !== 1) return;

        let rotationOffset =
            proj.spriteDirection > 0
                ? (45 * Math.PI) / 180
                : (135 * Math.PI) / 180;
        let visualAngle = proj.rotation + rotationOffset;

        let maxRange =
            this.CurrentAttack === 1
                ? CarminSikleProj.SPINRANGE
                : CarminSikleProj.SWINGRANGE;
        let progressFactor = Math.max(0, Math.min(1, this.Progress / maxRange));
        let stretchX = 1 + 0.3 * progressFactor;
        let textureLength = 132;
        let swordLength = textureLength * proj.scale * stretchX;

        let startX = proj.Center.X;
        let startY = proj.Center.Y;
        let endX = startX + Math.cos(visualAngle) * swordLength;
        let endY = startY + Math.sin(visualAngle) * swordLength;

        let padding = 24 * proj.scale;
        let minX = Math.min(startX, endX) - padding;
        let minY = Math.min(startY, endY) - padding;
        let maxX = Math.max(startX, endX) + padding;
        let maxY = Math.max(startY, endY) + padding;

        hitbox.X = Math.floor(minX);
        hitbox.Y = Math.floor(minY);
        hitbox.Width = Math.floor(maxX - minX);
        hitbox.Height = Math.floor(maxY - minY);
    }

    // Colisão personalizada de feixe (Raycast / Line Intersects AABB)
    Colliding(proj, projHitbox, targetHitbox) {
        // Apenas causa dano na fase de execução
        if (this.Size < 0.1 || this.CurrentStage !== 1) {
            return false;
        }

        let tipPosition = this.GetTipPosition(proj);
        let collisionWidth = 32 * proj.scale; // Espessura da lâmina
        let collisionPoint = { X: 0, Y: 0 };

        let hitsTarget = Collision.CheckAABBvLine1(
            targetHitbox.TopLeft,
            targetHitbox.Size(),
            proj.Center,
            tipPosition,
            collisionWidth,
            collisionPoint
        );

        if (hitsTarget) {
            if (canHit) {
                let owner = Main.player[proj.owner];
                let contactVector = Vector2.new(
                    collisionPoint.X,
                    collisionPoint.Y
                );

                if (!canHit(owner.Center, 1, 1, contactVector, 1, 1)) {
                    return false; // Parede bloqueia o golpe
                }
            }
            return true;
        }

        return false;
    }

    OnHitNPC(proj, target) {
for (let i=0;i<2;i++) {
        Harges.Graphics.UParticle.Spawn(
            Harges.Assets.Loader.Load("Assets/Adittive/Shine.png"),
            target.Center,
            Vector2.Zero,
            {
                life: 15,
                rot: (Math.random() - 0.5) * 2 * Math.PI,
                scaleTo: Vector2.new(0.04, 0.04),
                scaleFrom: Vector2.new(0.2, 0.4),
                colorFrom: Color.Purple,
                colorTo: Color.Blue,
                additive: true,
                layer: 1
            }
        );
}
    }

    OnKill(proj, timeLeft) {}
}

// Full copy by CarminSikleProj

export class CorruptionSikleProj extends ModProjectile {
    static SWINGRANGE = 1.67 * Math.PI;
    static FIRSTHALFSWING = 0.45;
    static SPINRANGE = 3.5 * Math.PI;
    static WINDUP = 0.15;
    static UNWIND = 0.4;
    static SPINTIME = 2.5;

    constructor() {
        super();
        this.Texture = "Projectiles/Weapons/Melee/" + this.constructor.name;
    }

    SetStaticDefaults() {
        this.TextureAsset =
            Terraria.GameContent.TextureAssets.Projectile[this.Type].Value;
    }

    SetDefaults() {
        let proj = this.Projectile;

        proj.width = 132 * 1.2;
        proj.height = 119 * 1.2;
        proj.friendly = true;
        proj.timeLeft = 10000;
        proj.penetrate = -1;
        proj.knockBack = Main.player[0].HeldItem.knockBack;

        // Propriedades para garantir que a parede não mate o projétil
        proj.tileCollide = false;
        proj.ignoreWater = true;

        this.Projectile.usesLocalNPCImmunity = true;
        this.Projectile.localNPCHitCooldown = 35;

        this.CurrentAttack = 0;
        this.CurrentStage = 0;
        this.InitialAngle = 0;
        this.Timer = 0;
        this.Progress = 0;
        this.Size = 0;
        this.PrevRotation = 0;
    }

    // Retornar false aqui força a engine a ignorar a colisão física com blocos
    OnTileCollide(proj, oldVelocity) {
        return false;
    }

    OnSpawn(source) {
        let proj = this.Projectile;
        let owner = Main.player[0];

        proj.spriteDirection =
            Main.MouseWorld.X > owner.MountedCenter.X ? 1 : -1;

        let targetAngle = Math.atan2(
            Main.MouseWorld.Y - owner.MountedCenter.Y,
            Main.MouseWorld.X - owner.MountedCenter.X
        );

        if (this.CurrentAttack === 1) {
            this.InitialAngle =
                -Math.PI / 2 - Math.PI * (1 / 3) * proj.spriteDirection;
        } else {
            if (proj.spriteDirection === 1) {
                targetAngle = Math.max(
                    -Math.PI * (1 / 3),
                    Math.min(Math.PI * (1 / 6), targetAngle)
                );
            } else {
                if (targetAngle < 0) {
                    targetAngle += 2 * Math.PI;
                }
                targetAngle = Math.max(
                    Math.PI * (5 / 6),
                    Math.min(Math.PI * (4 / 3), targetAngle)
                );
            }

            this.InitialAngle =
                targetAngle -
                CarminSikleProj.FIRSTHALFSWING *
                    CarminSikleProj.SWINGRANGE *
                    proj.spriteDirection;
        }
    }

    AI(proj) {
        let owner = Main.player[proj.owner];
        this.PrevRotation = proj.rotation;

        owner.itemAnimation = 2;
        owner.itemTime = 2;

        if (!owner.active || owner.dead || owner.noItems || owner.CCed) {
            proj.Kill();
            return;
        }

        let attackSpeed = owner.GetTotalAttackSpeed
            ? owner.GetTotalAttackSpeed(proj.DamageType)
            : 1;
        let prepTime = 12 / attackSpeed;
        let execTime = 12 / attackSpeed;
        let hideTime = 12 / attackSpeed;

        switch (this.CurrentStage) {
            case 0:
                this.PrepareStrike(prepTime);
                break;
            case 1:
                this.ExecuteStrike(execTime);
                break;
            default:
                this.UnwindStrike(proj, hideTime);
                break;
        }

        this.SetSwordPosition(owner, proj);
        this.Timer++;
    }

    PrepareStrike(prepTime) {
        this.Progress =
            CarminSikleProj.WINDUP *
            CarminSikleProj.SWINGRANGE *
            (1 - this.Timer / prepTime);

        let t = this.Timer / prepTime;
        this.Size = t * t * (3 - 2 * t);

        if (this.Timer >= prepTime) {
            this.CurrentStage = 1;
            this.Timer = 0;
        }
    }

    ExecuteStrike(execTime) {
        if (this.CurrentAttack === 0) {
            let t = (1 - CarminSikleProj.UNWIND) * (this.Timer / execTime);
            this.Progress = t * t * (3 - 2 * t) * CarminSikleProj.SWINGRANGE;

            if (this.Timer >= execTime) {
                this.CurrentStage = 2;
                this.Timer = 0;
            }
        } else {
            let t =
                (1 - CarminSikleProj.UNWIND / 2) *
                (this.Timer / (execTime * CarminSikleProj.SPINTIME));
            this.Progress = t * t * (3 - 2 * t) * CarminSikleProj.SPINRANGE;

            if (this.Timer >= execTime * CarminSikleProj.SPINTIME) {
                this.CurrentStage = 2;
                this.Timer = 0;
            }
        }
    }

    UnwindStrike(projectile, hideTime) {
        if (this.CurrentAttack === 0) {
            let t =
                1 -
                CarminSikleProj.UNWIND +
                (CarminSikleProj.UNWIND * this.Timer) / hideTime;
            let smoothProgress = t * t * (3 - 2 * t);
            this.Progress = CarminSikleProj.SWINGRANGE * smoothProgress;

            let sizeT = this.Timer / hideTime;
            this.Size = 1 - sizeT * sizeT * (3 - 2 * sizeT);

            if (this.Timer >= hideTime) {
                projectile.Kill();
            }
        } else {
            let spinHideTime = (hideTime * CarminSikleProj.SPINTIME) / 2;
            let t =
                1 -
                CarminSikleProj.UNWIND / 2 +
                ((CarminSikleProj.UNWIND / 2) * this.Timer) / spinHideTime;
            let smoothProgress = t * t * (3 - 2 * t);
            this.Progress = CarminSikleProj.SPINRANGE * smoothProgress;

            let sizeT = this.Timer / spinHideTime;
            this.Size = 1 - sizeT * sizeT * (3 - 2 * sizeT);

            if (this.Timer >= spinHideTime) {
                projectile.Kill();
            }
        }
    }

    SetSwordPosition(owner, proj) {
        proj.rotation =
            this.InitialAngle + proj.spriteDirection * this.Progress;

        let armAngle = proj.rotation - Math.PI / 2;

        if (owner.SetCompositeArmFront) {
            owner.SetCompositeArmFront(
                true,
                Player.CompositeArmStretchAmount.Full,
                armAngle
            );
        }

        let armPosition = owner.GetFrontHandPosition(
            Player.CompositeArmStretchAmount.Full,
            armAngle
        );

        if (owner.gravDir === -1) {
            proj.rotation = -proj.rotation;
            armPosition.Y = owner.Bottom.Y + (owner.position.Y - armPosition.Y);
        }

        armPosition.Y += owner.gfxOffY;
        proj.Center = armPosition;
        proj.scale =
            this.Size * 0.7 * owner.GetAdjustedItemScale(owner.HeldItem);
        owner.heldProj = proj.whoAmI;
    }

    PreDraw(proj, lightColor) {
        let rect = Generic.getRect(this.TextureAsset);

        let origin;
        let rotationOffset;
        let effects;

        if (proj.spriteDirection > 0) {
            origin = Vector2.new(0, rect.Height);
            rotationOffset = (45 * Math.PI) / 180;
            effects = SpriteEffects.None;
        } else {
            origin = Vector2.new(rect.Width, rect.Height);
            rotationOffset = (135 * Math.PI) / 180;
            effects = SpriteEffects.FlipHorizontally;
        }

        let maxRange =
            this.CurrentAttack === 1
                ? CarminSikleProj.SPINRANGE
                : CarminSikleProj.SWINGRANGE;
        let progressFactor = Math.max(0, Math.min(1, this.Progress / maxRange));

        let fadeFactor = Math.pow(progressFactor, 4);
        let baseColor = Color.White;
        let drawColor = Color.Lerp(baseColor, Color.Transparent, fadeFactor);

        let stretchX = 1 + 0.3 * progressFactor;
        let stretchY = 1 - 0.2 * progressFactor;

        let scaleVector = Vector2.new(proj.scale, proj.scale * stretchY);

        Generic.EntityDraw(
            this.TextureAsset,
            Generic.toScreenPosition(proj.Center),
            rect,
            baseColor,
            proj.rotation + rotationOffset,
            origin,
            scaleVector,
            effects
        );

        return false;
    }

    ModifyDamageHitbox(proj, hitbox) {
        // Erro de sintaxe corrigido nesta linha
        if (this.Size < 0.1 || this.CurrentStage !== 1) return;

        let rotationOffset =
            proj.spriteDirection > 0
                ? (45 * Math.PI) / 180
                : (135 * Math.PI) / 180;
        let visualAngle = proj.rotation + rotationOffset;

        let maxRange =
            this.CurrentAttack === 1
                ? CarminSikleProj.SPINRANGE
                : CarminSikleProj.SWINGRANGE;
        let progressFactor = Math.max(0, Math.min(1, this.Progress / maxRange));
        let stretchX = 1 + 0.3 * progressFactor;
        let textureLength = 132;
        let swordLength = textureLength * proj.scale * stretchX;

        let startX = proj.Center.X;
        let startY = proj.Center.Y;
        let endX = startX + Math.cos(visualAngle) * swordLength;
        let endY = startY + Math.sin(visualAngle) * swordLength;

        let padding = 24 * proj.scale;
        let minX = Math.min(startX, endX) - padding;
        let minY = Math.min(startY, endY) - padding;
        let maxX = Math.max(startX, endX) + padding;
        let maxY = Math.max(startY, endY) + padding;

        hitbox.X = Math.floor(minX);
        hitbox.Y = Math.floor(minY);
        hitbox.Width = Math.floor(maxX - minX);
        hitbox.Height = Math.floor(maxY - minY);
    }

    // Doesn't Working.
    /*Colliding(proj, projHitbox, targetHitbox) {
        if (this.Size < 0.1 || this.CurrentStage !== 1) return false;

        let rotationOffset = proj.spriteDirection > 0 ? (45 * Math.PI) / 180 : (135 * Math.PI) / 180;
        let visualAngle = proj.rotation + rotationOffset;
        let prevVisualAngle = this.PrevRotation + rotationOffset;

        let deltaAngle = visualAngle - prevVisualAngle;
        while (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
        while (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

        let maxRange = (this.CurrentAttack === 1) ? CarminSikleProj.SPINRANGE : CarminSikleProj.SWINGRANGE;
        let progressFactor = Math.max(0, Math.min(1, this.Progress / maxRange));
        let stretchX = 1 + 0.3 * progressFactor;
        let textureLength = 132;
        let swordLength = textureLength * proj.scale * stretchX;
        let bladeRadius = 24 * proj.scale;

        let startX = proj.Center.X;
        let startY = proj.Center.Y;

        let targetCenterX = targetHitbox.X + targetHitbox.Width / 2;
        let targetCenterY = targetHitbox.Y + targetHitbox.Height / 2;
        let targetRadius = Math.max(targetHitbox.Width, targetHitbox.Height) / 2;
        let collisionRadius = bladeRadius + targetRadius;

        const SAMPLES = 6;
        for (let i = 0; i <= SAMPLES; i++) {
            let angle = prevVisualAngle + deltaAngle * (i / SAMPLES);
            let cos = Math.cos(angle);
            let sin = Math.sin(angle);

            let dx = targetCenterX - startX;
            let dy = targetCenterY - startY;
            let projection = Math.min(Math.max(dx * cos + dy * sin, 0), swordLength);

            let closestX = startX + cos * projection;
            let closestY = startY + sin * projection;
            let diffX = targetCenterX - closestX;
            let diffY = targetCenterY - closestY;
            let distanceSquared = diffX * diffX + diffY * diffY;

            if (distanceSquared <= collisionRadius * collisionRadius) {
                if (canHit) {
                    let owner = Main.player[proj.owner];
                    let contactPoint = Vector2.new(closestX, closestY);
                    
                    // Verificação fina: Tenta traçar uma linha do jogador ao ponto da arma.
                    // Se a parede bloquear essa visão, o dano é negado, ignorando o inimigo.
                    if (!canHit(owner.Center, 1, 1, contactPoint, 1, 1)) {
                        continue;
                    }
                }
                return true;
            }
        }

        return false;
    }*/
    OnKill(proj, timeLeft) {}

    OnHitNPC(proj, target) {


for (let i=0;i<2;i++) {
        Harges.Graphics.UParticle.Spawn(
            Harges.Assets.Loader.Load("Assets/Adittive/Shine.png"),
            target.Center,
            Vector2.Zero,
            {
                life: 15,
                rot: (Math.random() - 0.5) * 2 * Math.PI,
                scaleTo: Vector2.new(0.04, 0.04),
                scaleFrom: Vector2.new(0.2, 0.4),
                colorFrom: Color.Purple,
                colorTo: Color.Blue,
                additive: true,
                layer: 1
            }
        );
}
        // target: () => Vector2.new(npc.Center.X, npc.Center.Y - 70) });
    }
}
