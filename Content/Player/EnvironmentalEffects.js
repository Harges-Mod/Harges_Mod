
GlobalImports.AllModules()
const { ProjectileID, BuffID, ItemID } = Terraria.ID;
const { Main, NPC, Player } = Terraria;


const Projectile = new NativeClass("Terraria", "Projectile");
const NewProjectile = Projectile['int NewProjectile(IEntitySource spawnSource, Vector2.new2 position, Vector2.new2 velocity, int Type, int Damage, float KnockBack, int Owner, float ai0, float ai1, float ai2, NewProjectileModifier modifer)'];

export class EnvironmentalEffects extends ModPlayer {
    constructor() {
        super();
    }
    
        get Wet() {
        if (!this.player) return
        let player = this.Player; 
        return player.wet && !player.lavaWet && !player.honeyWet && !player.shimmerWet;
    }

    ResetEffects(player) {
    }




    UpdateEquips(player) {
                
        this.PlayerDebuffBiomeLogic(player)
        if (!ModPlayer.Get('HargesMMode').mModeLocalActive) return
        
        this.InfinityBuffInventory(player, 30)
        this.PlayerImprovedBuffs(player)
       // this.SlimyRework(player)
    }
    
    
    HasBuff(type) {
        let player = Main.player[0];    
        for (let i = 0; i < player.MaxBuffs; i++) {
                let buff = player.bufType[I]
                if (buff > 0 && buff === type) {
                    return true;
                }
        }
        return false;
    }


    PlayerImprovedBuffs(player) {

        player.pickSpeed *= 0.50; // 50% - miner speed
        player.tileSpeed *= 0.70; // 20% miner speed
        player.wallSpeed *= 0.70; 
        player.moveSpeed += 0.10;

        if (player.fishingBiteDelay > 0) {
            player.fishingBiteDelay = Math.max(1, Math.floor(player.fishingBiteDelay * 0.40));
        }
    }
    
    SlimyRework(player) {
        if (this.HasBuff(BuffID.Slimy)) {
            player.moveSpeed -= 0.30;
        }
    }
    
    PlayerDebuffBiomeLogic(player) {
        if (!player || !player.active || player.dead) return;

        if (this.Wet) {
            if (player.ZoneSnow) {
                player.AddBuff(BuffID.Chilled, 2, false);
                player.AddBuff(BuffID.Frostburn, 2, false);
            }
            if (player.ZoneJungle) {
                player.AddBuff(BuffID.Poisoned, 2, false);
            }
            if (player.ZoneCrimson) {
                player.AddBuff(BuffID.Ichor, 300, false);
            }
            if (player.ZoneCorrupt) {
                player.AddBuff(BuffID.CursedInferno, 2, false);
            }
            if (player.ZoneHallow) {
                player.AddBuff(BuffID.Confused, 120, false);
            }
        }

     
        if (player.ZoneCrimson) {
            player.AddBuff(BuffID.Bleeding, 2, false);
        }
        if (player.ZoneCorrupt) {
            player.AddBuff(BuffID.Darkness, 2, false);
        }
        if (player.ZoneHallow) {
            player.AddBuff(BuffID.Confused, 90, false);
        }
        if (player.ZoneUnderworldHeight) {
            player.AddBuff(BuffID.OnFire, 2, false);
        }
        if (player.ZoneSkyHeight) {
            player.AddBuff(BuffID.Suffocation, 2, false);
        }   
        if (player.ZoneGranite) {
            player.AddBuff(BuffID.Electrified, 2, false);
        }

        if (player.ZoneMarble) {
            player.AddBuff(BuffID.Slow, 2, false);
            player.AddBuff(BuffID.Weak, 2, false);
        }
        
        if (Main.bloodMoon) {
            player.AddBuff(BuffID.WaterCandle, 2, false);
        }
    }

    InfinityBuffInventory(player, stack) {
        for (let i = 0; i < 58; i++) {
            let item = player.inventory[i];
            
            if (item.stack >= stack && item.buffType != 0) {
                player.AddBuff(item.buffType, 2, false);
            }
        }
    }
    
    
    OnHitNPCWithProj(player, target, proj) {}
}