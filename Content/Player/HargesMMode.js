GlobalImports.AllModules();
const { ProjectileID, BuffID, ItemID, DustID } = Terraria.ID;
const { Main, NPC, Player, Item, DamageClass } = Terraria;
const { Effects, Rand } = Modules;

const Projectile = new NativeClass("Terraria", "Projectile");
const NewProjectile = Projectile['int NewProjectile(IEntitySource spawnSource, Vector2.new2 position, Vector2.new2 velocity, int Type, int Damage, float KnockBack, int Owner, float ai0, float ai1, float ai2, NewProjectileModifier modifer)'];
const NewDust = Terraria.Dust['int NewDust(Vector2 Position, int Width, int Height, int Type, float SpeedX, float SpeedY, int Alpha, Color newColor, float Scale)'];

const NewCombatText = CombatText["int NewText(Rectangle location, Color color, string text, bool dramatic, bool dot)"];


// Guardamos a chave única (owner + identity) para não ter colisão ao reusar slots de whoAmI
const scaledProjectiles = new Set();

export class HargesMMode extends ModPlayer {
    constructor() {
        super();
        this.mModeLocalActive = false;
        
        this.RubyFlame = false;
        this.EocCurse = false;
        
        this.SupremeRuby = false;
        this.SupremeRubyRadius = 300;
        this.SupremeRubyCD = 0;

        this.currentTarget = null;
        
        this.SlimeSlink = false; // Just testing
        this.SlimeSlinkBoostScaled = 1.5;
        this._originalItemScale = null;
        this._lastItemType = null;
        
        this.BloodyCover = false;
        this.BloodyCoverHealAmount = 3;
        this.BloodyCoverAbstinenceTimer = 0;
        this.BloodyCoverDamageTimer = 0;
        this.BloodyCoverHitCD = 0;
    }
    
    static get MModeActivated() {
        return WorldDB.get('HargesMMode_Active') === true;
    }
    
    set MModeActive(value) {
        const isTrue = !!value;
        if (isTrue) {
            this.OnFirstActivation();
        }
        WorldDB.set('HargesMMode_Active', isTrue);
        this.mModeLocalActive = isTrue;
    }
    
    ResetEffects(player) {
        if (Main.GameUpdateCount % 60 === 0) {
            this.mModeLocalActive = HargesMMode.MModeActivated;
        }
        
        this.EocCurse = false;
        this.RubyFlame = false;
        this.SupremeRuby = false;
        this.SupremeRubyRadius = 400;
        
        this.BloodyCover = false;
        //this.BloodyCoverAbstinenceTimer = 0;
        //this.BloodyCoverDamageTimer = 0;
        //this.BloodyCoverHitCD = 0;
    }
   
    DebuffDamage(modplayer, damage, affectLifeRegen = true) {
        if (modplayer.lifeRegen > 0) {
            modplayer.lifeRegen = 0;
        }

        if (affectLifeRegen && modplayer.lifeRegenCount > 0) {
            modplayer.lifeRegenCount = 0;
        } 
        
        modplayer.lifeRegenTime = 0;
        modplayer.lifeRegen -= damage;
    }
       
    UpdateLifeRegen(player) {
    }

    
    BloodCoverHit(player, entity) {
    
    if (this.BloodyCover) {
    if (this.BloodyCoverHitCD >= 30) {
    Generic.NewProjectile(
            Projectile.GetNoneSource(),
            entity.Center,
            Vector2.Zero, 
            ModProjectile.getTypeByName('BloodOrb'),
            15,
            1.5,
            player.whoAmI,
            0, 0, 0,
            null
        );
        
        this.BloodyCoverHitCD = 0
    }
    }
    }
    OnHitNPC(player, item, npc, damageDone, knockBack) {
        this.BloodCoverHit(player, npc);
    }
    
    OnHitNPCWithProj(player, npc, projectile) {
        this.BloodCoverHit(player, npc);
    }
    
    IsTargetValid(npc, center, radius) {
        if (!npc || !npc.active || npc.friendly || npc.lifeMax <= 5 || npc.dontTakeDamage) {
            return false;
        }
        return Vector2.DistanceSquared(center, npc.Center) <= radius * radius;
    }

    UpdateTargetCache(center, radius) {
        if (this.IsTargetValid(this.currentTarget, center, radius)) {
            return;
        }

        const cached = ModNPC._CachedForAI;
        if (this.IsTargetValid(cached, center, radius)) {
            this.currentTarget = cached;
        } else {
            this.currentTarget = null;
        }
    }
    
    ModCombatText(Name, Color) {
        
        let player = Main.player[Main.myPlayer]
        
        NewCombatText(
            player.getRect(),
            Color,
                `${Name}`,
                true, false
        );
        
    }
    
    ModHealEffect(healAmount, Color) {
        
        let player = Main.player[Main.myPlayer]
        
        player.statLife += healAmount;
        if (player.statLife > player.statLifeMax2) player.statLife = player.statLifeMax2;
        
        this.ModCombatText(healAmount, Color)
        
    }
    
    DrawRubyCircle(player, radius) {
        const totalPoints = 36;
        const step = (Math.PI * 2) / totalPoints;
        const playerCenter = player.Center;

        for (let i = 0; i < totalPoints; i++) {
            const angle = i * step;
            const dustX = playerCenter.X + Math.cos(angle) * radius;
            const dustY = playerCenter.Y + Math.sin(angle) * radius;
    
            const d = Effects.QuickDust(dustX, dustY, DustID.GemRuby);
            if (d) {
                Main.dust[d].noGravity = true;
                Main.dust[d].velocity = Vector2.Zero;
                Main.dust[d].noLight = true;
            }
        }
    }
    
    UseItem(player, item) {
        if (this.SlimeSlink && item && item.melee) {
            if (!this._originalItemScale || this._lastItemType !== item.type) {
                const tempItem = Item.new();
                tempItem.SetDefaults(item.type, null);
                
                this._originalItemScale = tempItem.scale;
                this._lastItemType = item.type;
            }
            item.scale = this._originalItemScale * this.SlimeSlinkBoostScaled;
        }

        return true;     
    }
    
    PostUpdate(player) {
        if (player.itemAnimation === 0 && this._originalItemScale && this._lastItemType) {
            const heldItem = player.HeldItem;
            if (heldItem && heldItem.type === this._lastItemType) {
                heldItem.scale = this._originalItemScale;
            }
            this._originalItemScale = null;
            this._lastItemType = null;
        }
    }
    
    UpdateEquips(player) {
        if (this.EocCurse) {
            this.DebuffDamage(player, 14, false);
            player.moveSpeed += 0.15;
        }
        
        if (this.RubyFlame && !this.SupremeRuby) {
            if (Rand.NextBool(3)) {
                Effects.NewDust(player.Center, 0, 0, DustID.GemRuby);
            }
            this.DebuffDamage(player, 8, false);
        }
        
        if (this.SupremeRuby) {
            this.SupremeRubyCD++;
            
            if (Main.GameUpdateCount % 12 === 0) {
                this.DrawRubyCircle(player, this.SupremeRubyRadius);
            }

            if (Main.GameUpdateCount % 6 === 0) {
                this.UpdateTargetCache(player.Center, this.SupremeRubyRadius);
            }
            
            if (this.SupremeRubyCD >= Generic.toSec(5)) {
                if (this.IsTargetValid(this.currentTarget, player.Center, this.SupremeRubyRadius)) {
                    let direction = Vector2.Subtract(this.currentTarget.Center, player.Center);
                    direction = Vector2.Normalize(direction);

                    Generic.NewProjectile(
                        Projectile.GetNoneSource(),
                        player.Center,
                        Vector2.Multiply(direction, 12), 
                        ModProjectile.getTypeByName('SupremeRubyLaser'),
                        15,
                        1.5,
                        player.whoAmI,
                        0, 0, 0,
                        null
                    );
                    
                    this.SupremeRubyCD = 0;
                    this.currentTarget = null;
                }
            }
        } else {
            this.currentTarget = null;
        }

        if (this.BloodyCover) {
                this.BloodyCoverAbstinenceTimer++;
                
                        if (player.lifeRegen > 0) player.lifeRegen = 0;
        if (this.BloodyCoverAbstinenceTimer++ >= Generic.toSec(5)) {
                this.DebuffDamage(player, 10, false);
                for (let i = 0; i < 3; i++) {
                    Effects.QuickDust(player.Center.X, player.Center.Y, DustID.Blood);
                }
                
        }
        
        this.BloodyCoverHitCD++
        }
    }
    
    OnFirstActivation() {
        const player = Main.player[0];
        const radius = 50.0;
        const DarkSmileSound = NativeSound.New('Assets/Sound/DarkSmile.mp3', 'DarkSmile');
        const step = (2 * Math.PI) / 15;
        
        for (let i = 0; i < 15; i++) {
            const angle = i * step;
            const spawnX = player.Center.X + Math.cos(angle) * radius;
            const spawnY = player.Center.Y + Math.sin(angle) * radius;
            
            Effects.QuickDust(spawnX, spawnY, DustID.BlueGreenElectricity);
        }
    }
}

export class HargesMModeProj extends GlobalProjectile {
    PreAI(proj) {
        if (!proj || !proj.active) return true;

        const projKey = `${proj.owner}_${proj.identity}`;

        if (!scaledProjectiles.has(projKey)) {
            if (proj.owner >= 0 && proj.owner < Main.maxPlayers) {
                const player = Main.player[proj.owner];

                if (player && player.active) {
                    const modPlayer = ModPlayer.Get('HargesMMode');

                    if (modPlayer) {
                        scaledProjectiles.add(projKey);

                        if (player.HeldItem.melee && modPlayer.SlimeSlink) {
                            proj.scale *= modPlayer.SlimeSlinkBoostScaled;
                        }

                        if (scaledProjectiles.size > 2000) {
                            // scaledProjectiles.clear();
                        }
                    }
                }
            }
        }

        return true;
    }
}
