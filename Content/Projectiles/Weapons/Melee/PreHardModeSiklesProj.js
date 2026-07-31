using('Terraria');

const { SpriteEffects } = Microsoft.Xna.Framework.Graphics;

// Atribuição correta da assinatura exata do método nativo do C#
let canHit = Collision['bool CanHit(Vector2 Position1, int Width1, int Height1, Vector2 Position2, int Width2, int Height2)'];

export class CarminSikleProj extends ModProjectile {

    static SWINGRANGE = 1.67 * Math.PI;
    static FIRSTHALFSWING = 0.45;
    static SPINRANGE = 3.5 * Math.PI;
    static WINDUP = 0.15;
    static UNWIND = 0.4;
    static SPINTIME = 2.5;

    constructor() {
        super();
        this.Texture = 'Projectiles/Weapons/Melee/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        this.TextureAsset = Terraria.GameContent.TextureAssets.Projectile[this.Type].Value;
    }
    
    SetDefaults() {  
        let proj = this.Projectile;
        
        proj.width = 132;
        proj.height = 119;
        proj.friendly = true;
        proj.timeLeft = 10000;
        proj.penetrate = -1;
        proj.tileCollide = false;
        proj.usesLocalNPCInterval = true;
        proj.localNPCHitCooldown = 120;
       
        this.CurrentAttack = 0;
        this.CurrentStage = 0;
        this.InitialAngle = 0;
        this.Timer = 0;
        this.Progress = 0;
        this.Size = 0;
    }

    OnSpawn(source) {
        let proj = this.Projectile;
        let owner = Main.player[0];

        proj.spriteDirection = Main.MouseWorld.X > owner.MountedCenter.X ? 1 : -1;
        
        let targetAngle = Math.atan2(
            Main.MouseWorld.Y - owner.MountedCenter.Y, 
            Main.MouseWorld.X - owner.MountedCenter.X
        );

        if (this.CurrentAttack === 1) {
            this.InitialAngle = -Math.PI / 2 - Math.PI * (1 / 3) * proj.spriteDirection;
        } else {
            if (proj.spriteDirection === 1) {
                targetAngle = Math.max(-Math.PI * (1 / 3), Math.min(Math.PI * (1 / 6), targetAngle));
            } else {
                if (targetAngle < 0) {
                    targetAngle += 2 * Math.PI;
                }
                targetAngle = Math.max(Math.PI * (5 / 6), Math.min(Math.PI * (4 / 3), targetAngle));
            }

            this.InitialAngle = targetAngle - CarminSikleProj.FIRSTHALFSWING * CarminSikleProj.SWINGRANGE * proj.spriteDirection;
        }
    }

    AI(proj) {
        let owner = Main.player[proj.owner];

        owner.itemAnimation = 2;
        owner.itemTime = 2;

        if (!owner.active || owner.dead || owner.noItems || owner.CCed) {
            proj.Kill();
            return;
        }

        let attackSpeed = owner.GetTotalAttackSpeed ? owner.GetTotalAttackSpeed(proj.DamageType) : 1;
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
        this.Progress = CarminSikleProj.WINDUP * CarminSikleProj.SWINGRANGE * (1 - this.Timer / prepTime);
        
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
            let t = (1 - CarminSikleProj.UNWIND / 2) * (this.Timer / (execTime * CarminSikleProj.SPINTIME));
            this.Progress = t * t * (3 - 2 * t) * CarminSikleProj.SPINRANGE;

            if (this.Timer >= execTime * CarminSikleProj.SPINTIME) {
                this.CurrentStage = 2;
                this.Timer = 0;
            }
        }
    }

    UnwindStrike(projectile, hideTime) {
        if (this.CurrentAttack === 0) {
            let t = (1 - CarminSikleProj.UNWIND) + (CarminSikleProj.UNWIND * this.Timer / hideTime);
            let smoothProgress = t * t * (3 - 2 * t);
            this.Progress = CarminSikleProj.SWINGRANGE * smoothProgress;

            let sizeT = this.Timer / hideTime;
            this.Size = 1 - (sizeT * sizeT * (3 - 2 * sizeT));

            if (this.Timer >= hideTime) {
                projectile.Kill();
            }
        } else {
            let spinHideTime = hideTime * CarminSikleProj.SPINTIME / 2;
            let t = (1 - CarminSikleProj.UNWIND / 2) + ((CarminSikleProj.UNWIND / 2) * this.Timer / spinHideTime);
            let smoothProgress = t * t * (3 - 2 * t);
            this.Progress = CarminSikleProj.SPINRANGE * smoothProgress;

            let sizeT = this.Timer / spinHideTime;
            this.Size = 1 - (sizeT * sizeT * (3 - 2 * sizeT));

            if (this.Timer >= spinHideTime) {
                projectile.Kill();
            }
        }
    }

    SetSwordPosition(owner, proj) {
        proj.rotation = this.InitialAngle + proj.spriteDirection * this.Progress;

        let armAngle = proj.rotation - (Math.PI / 2);
        
        if (owner.SetCompositeArmFront) {
            owner.SetCompositeArmFront(true, Player.CompositeArmStretchAmount.Full, armAngle);
        }

        let armPosition = owner.GetFrontHandPosition(Player.CompositeArmStretchAmount.Full, armAngle);

        if (owner.gravDir === -1) {
            proj.rotation = -proj.rotation;
            armPosition.Y = owner.Bottom.Y + (owner.position.Y - armPosition.Y);
        }

        armPosition.Y += owner.gfxOffY;
        proj.Center = armPosition;
        proj.scale = this.Size * 0.7 * owner.GetAdjustedItemScale(owner.HeldItem);
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

        let maxRange = (this.CurrentAttack === 1) ? CarminSikleProj.SPINRANGE : CarminSikleProj.SWINGRANGE;
        let progressFactor = Math.max(0, Math.min(1, this.Progress / maxRange));

        let fadeFactor = Math.pow(progressFactor, 4);
        let baseColor = Color.White;
        let drawColor = Color.Lerp(baseColor, Color.Transparent, fadeFactor);

        let stretchX = 1 + 0.3 * progressFactor;
        let stretchY = 1 - 0.2 * progressFactor;

        let scaleVector = Vector2.new(
            proj.scale * stretchX,
            proj.scale * stretchY
        );

        Generic.EntityDraw(
            this.TextureAsset,
            Generic.toScreenPosition(proj.Center),
            rect,
            drawColor,
            proj.rotation + rotationOffset,
            origin,
            scaleVector,
            effects
        );

        return false;
    }

    // --- COLISÃO CORRIGIDA E ALINHADA COM O PRE-DRAW ---

    Colliding(proj, projHitbox, targetHitbox) {
        // Ignora colisão fora do estágio ativo ou se a foice estiver muito pequena
        if (this.Size < 0.1 || this.CurrentStage !== 1) return false;

        let maxRange = (this.CurrentAttack === 1) ? CarminSikleProj.SPINRANGE : CarminSikleProj.SWINGRANGE;
        let progressFactor = Math.max(0, Math.min(1, this.Progress / maxRange));

        let stretchX = 1 + 0.3 * progressFactor;
        
        // Comprimento da lâmina alinhado ao tamanho da textura
        let textureLength = 132; // Comprimento real do cabo à ponta
        let swordLength = textureLength * proj.scale * stretchX;

        // Calcula o ângulo exato usado na renderização
        let rotationOffset = proj.spriteDirection > 0 ? (45 * Math.PI) / 180 : (135 * Math.PI) / 180;
        let visualAngle = proj.rotation + rotationOffset;

        // Vetor exato que aponta da mão para a ponta da foice
        let dirX = Math.cos(visualAngle);
        let dirY = Math.sin(visualAngle);

        // Pontos base para a colisão (Início na mão, Fim na ponta)
        let startPos = proj.Center;
        let tipPos = Vector2.new(
            startPos.X + dirX * swordLength,
            startPos.Y + dirY * swordLength
        );

        // 1. CHECAGEM DE PAREDE (TILES)
        if (canHit) {
            let isPathClear = canHit(startPos, 1, 1, tipPos, 1, 1);
            if (!isPathClear) {
                return false; // Bloqueado por blocos sólidos
            }
        }

        // 2. AABB QUE ENGLOBA A LÂMINA INTEIRA (E não apenas a ponta)
        // Isso impede que inimigos colados no jogador "passem" pela lâmina
        let minX = Math.min(startPos.X, tipPos.X);
        let maxX = Math.max(startPos.X, tipPos.X);
        let minY = Math.min(startPos.Y, tipPos.Y);
        let maxY = Math.max(startPos.Y, tipPos.Y);

        // Espessura do corte da lâmina
        let bladePadding = 24 * proj.scale;

        let bladeAABB = {
            X: minX - bladePadding,
            Y: minY - bladePadding,
            Width: (maxX - minX) + (bladePadding * 2),
            Height: (maxY - minY) + (bladePadding * 2)
        };

        // Teste de sobreposição AABB vs AABB (Hitbox do NPC)
        return (
            bladeAABB.X < targetHitbox.X + targetHitbox.Width &&
            bladeAABB.X + bladeAABB.Width > targetHitbox.X &&
            bladeAABB.Y < targetHitbox.Y + targetHitbox.Height &&
            bladeAABB.Y + bladeAABB.Height > targetHitbox.Y
        );
    }


    OnKill(proj, timeLeft) {}
}

export class CorruptionSikleProj extends ModProjectile {}
