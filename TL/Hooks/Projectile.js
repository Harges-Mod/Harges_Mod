import { Terraria, Microsoft, Modules } from './../ModImports.js';
import { ProjectileLoader } from './../Loaders/ProjectileLoader.js';
import { PlayerLoader } from './../Loaders/PlayerLoader.js';
import { CombinedLoader } from './../Loaders/CombinedLoader.js';

const { Vector2 } = Modules;

export class ProjectileHooks {
    static initialized = false;
    
    static tempProj = new Set();
    
    // Here you can disable the hooks that won't be used in your mod to avoid unnecessary processing
    static HookList = {
        All: (info) => true,
        SetDefaults: (info) => info.hasProjectiles || info.hasGlobalProjectiles,
        StatusNPC: (info) => info.hasProjectiles || info.hasGlobalProjectiles || info.hasPlayers,
        StatusPlayer: (info) => info.hasProjectiles || info.hasGlobalProjectiles,
        Colliding: (info) => info.hasProjectiles,
        CanCutTiles: (info) => info.hasProjectiles || info.hasGlobalProjectiles,
        CutTiles: (info) => info.hasProjectiles || info.hasGlobalProjectiles,
        AI_061_FishingBobber_GiveItemToPlayer: (info) => info.hasPlayers,
        AI: (info) => info.hasProjectiles || info.hasGlobalProjectiles,
        OnSpawn: (info) => info.hasProjectiles || info.hasGlobalProjectiles, // requires AI hook
        Kill: (info) => info.hasProjectiles || info.hasGlobalProjectiles,
        GetAlpha: (info) => info.hasProjectiles || info.hasGlobalProjectiles,
        Damage: (info) => info.hasProjectiles || info.hasGlobalProjectiles
    };
    
    static Initialize(info) {
        if (!this.HookList.All(info) || this.initialized) return;
        
        if (this.HookList.SetDefaults(info)) {
            Terraria.Projectile['void SetDefaults(int Type)'
            ].hook((original, self, type) => {
                original(self, type);
                if (ProjectileLoader.isModType(type)) {
                    self.active = true;
                    const proj = ProjectileLoader.getModProjectile(type);
                    if (proj) {
                        proj.SetDefaults(self);
                        try {
                            Object.assign(self, proj.Projectile);
                        } catch (error) {
                            throw new Error(`SetDefaults failed for projectile <${proj.constructor.name}>, error: ${error}`);
                        }
                    }
                    self.width = self.width * self.scale;
                    self.height = self.height * self.scale;
                    self.maxPenetrate = self.penetrate;
                }
                ProjectileLoader.SetDefaults(self);
            });
        }
        
        if (this.HookList.StatusNPC(info)) {
            Terraria.Projectile['void StatusNPC(int i)'
            ].hook((original, self, npcIndex) => {
                original(self, npcIndex);
                CombinedLoader.OnHitNPCWithProj(self, Terraria.Main.npc[npcIndex]);
            });
        }
        
        if (this.HookList.StatusPlayer(info)) {
            Terraria.Projectile['void StatusPlayer(Player player)'
            ].hook((original, self, player) => {
                original(self, player);
                ProjectileLoader.OnHitPlayer(self, player);
            });
        }
        
        if (this.HookList.Colliding(info)) {
            Terraria.Projectile['bool Colliding(Rectangle myRect, Rectangle targetRect)'
            ].hook((original, self, rect1, rect2) => {
                return ProjectileLoader.Colliding(self, rect1, rect2) ?? original(self, rect1, rect2);
            });
        }
        
        if (this.HookList.CanCutTiles(info)) {
            Terraria.Projectile['bool CanCutTiles()'
            ].hook((original, self) => {
                return ProjectileLoader.CanCutTiles(self) ?? original(self);
            });
        }
        
        if (this.HookList.CutTiles(info)) {
            Terraria.Projectile['void CutTiles()'
            ].hook((original, self) => {
                original(self);
                ProjectileLoader.CutTiles(self);
            });
        }
        
        if (this.HookList.AI_061_FishingBobber_GiveItemToPlayer(info)) {
            Terraria.Projectile['void AI_061_FishingBobber_GiveItemToPlayer(Player thePlayer, int itemType)'
            ].hook((original, self, player, itemType) => {
                original(self, player, PlayerLoader.ModifyCaughtFish(player, itemType));
            });
        }
        
        if (this.HookList.AI(info)) {
            const OnSpawnHook = this.HookList.OnSpawn(info);
            Terraria.Projectile['void AI()'
            ].hook((original, self) => {
                if (OnSpawnHook && !this.tempProj.has(self.whoAmI)) {
                    ProjectileLoader.OnSpawn(self);
                    this.tempProj.add(self.whoAmI);
                }
                if (ProjectileLoader.PreAI(self)) {
                    let oldType = 0;
                    const overrideAI = ProjectileLoader.getModProjectile(self.type)?.AIType ?? 0;
                    if (overrideAI > 0) {
                        oldType = self.type;
                        self.type = overrideAI;
                    }
                    original(self);
                    if (oldType > 0) self.type = oldType;
                    ProjectileLoader.AI(self);
                }
            });
        }
        
        if (this.HookList.Kill(info)) {
            Terraria.Projectile['void Kill()'
            ].hook((original, self) => {
                if (this.tempProj.has(self.whoAmI)) {
                    this.tempProj.delete(self.whoAmI);
                }
                const timeLeft = self.timeLeft;
                let flag = true;
                if (self.tileCollide) {
                    if (self.type >= Terraria.ID.ProjectileID.Count) {
                        const hitDirection = Vector2.Normalize(self.velocity);
                        if (Terraria.Collision['bool SolidTiles(Vector2 position, int width, int height)'](Vector2.Add(self.position, hitDirection), self.width, self.height)) {
                            flag = ProjectileLoader.OnTileCollide(self, hitDirection);
                        }
                    }
                }
                if (flag && ProjectileLoader.PreKill(self, timeLeft)) {
                    original(self);
                    ProjectileLoader.OnKill(self, timeLeft);
                }
            });
        }
        
        if (this.HookList.GetAlpha(info)) {
            Terraria.Projectile['Color GetAlpha(Color newColor)'
            ].hook((original, self, newColor) => {
                return original(self, ProjectileLoader.GetAlpha(self, newColor));
            });
        }
        
        if (this.HookList.Damage(info)) {
            Terraria.Projectile['void Damage()'
            ].hook((original, self) => {
                if (ProjectileLoader.CanDamage(self)) {
                    original(self);
                }
            });
            Terraria.Projectile['Rectangle Damage_GetHitbox()'
            ].hook((original, self) => {
                return ProjectileLoader.ModifyDamageHitbox(self, original(self));
            });
        }
        
        this.initialized = true;
    }
    
    static OnWorldUnload() {
        this.tempProj = new Set();
    }
}