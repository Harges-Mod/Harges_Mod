import { Terraria, Modules } from './../../TL/ModImports.js';
import { ModPlayer } from './../../TL/ModPlayer.js';

const { Effects } = Modules;

// This class manages the ExampleShield dash
// see: 'Content/Items/Accessories/ExampleShield.js';
export class ExampleDashPlayer extends ModPlayer {
    constructor() {
        super();
    }
    
    DashCooldown = 50; // Time (frames) between starting dashes. If this is shorter than DashDuration you can start a new dash before an old one has finished
    DashDuration = 35; // Duration of the dash afterimage effect in frames
    DashVelocity = 10; // // The initial velocity.  10 velocity is about 37.5 tiles/second or 50 mph
    
    // The fields related to the dash accessory
    DashAccessoryEquipped = false;
    DashDir = -1;
    DashDelay = 0;
    DashTimer = 0;
    
    ResetEffects(player) {
        // Reset our equipped flag. If the accessory is equipped somewhere, ExampleShield.UpdateAccessory will be called and set the flag before UpdateMovement
        this.DashAccessoryEquipped = false;
        
        // ResetEffects is called not long after player.doubleTapCardinalTimer's values have been set
        // When a directional key is pressed and released, vanilla starts a 15 tick (1/4 second) timer during which a second press activates a dash
        // If the timers are set to 15, then this is the first press just processed by the vanilla logic. Otherwise, it's a double-tap
        if (player.controlDown && player.releaseDown && player.doubleTapCardinalTimer[0] < 15) {
            // Down
            this.DashDir = 0;
        } else if (player.controlUp && player.releaseUp && player.doubleTapCardinalTimer[1] < 15) {
            // Up
            this.DashDir = 1;
        } else if (player.controlRight && player.releaseRight && player.doubleTapCardinalTimer[2] < 15 && player.doubleTapCardinalTimer[3] == 0) {
            // Right
            this.DashDir = 2;
        } else if (player.controlLeft && player.releaseLeft && player.doubleTapCardinalTimer[3] < 15 && player.doubleTapCardinalTimer[2] == 0) {
            // Left
            this.DashDir = 3;
        } else {
            // None
            this.DashDir = -1;
        }
    }
    
    CanUseDash(player) {
        return this.DashAccessoryEquipped
        && player.dashType === Terraria.ID.DashID.None // player doesn't have Tabi or EoCShield equipped (give priority to those dashes)
        && !player.setSolar // player isn't wearing solar armor
        && !player.mount.Active; // player isn't mounted, since dashes on a mount look weird
    }
    
    OnStartDash(player, dashDir, dashTime) {
        // Here you'd be able to set an effect that happens when the dash first activates
        // Some examples include:  the larger smoke effect from the Master Ninja Gear and Tabi
        Effects.NewParticle(
            Effects.GetParticleByName('Excalibur'),
            player.Center
        );
    }
    
    UpdateDash(player, dashTime) {
        // This is where we set the afterimage effect. You can replace these two lines with whatever you want to happen during the dash
        // Some examples include: spawning dust where the player is, adding buffs, making the player immune, etc.
        // Here we take advantage of "player.eocDash" and "player.armorEffectDrawShadowEOCShield" to get the Shield of Cthulhu's afterimage effect
        player.eocDash = dashTime;
        player.armorEffectDrawShadowEOCShield = true;
    }
    
    ResetDash(player) {
        // Here you reset the previously defined visual effects
        player.eocDash = 0;
        player.armorEffectDrawShadowEOCShield = false;
    }
    
    // Dash Control
    UpdateMovement(player) {
        // if the player can use our dash, has double tapped in a direction, and our dash isn't currently on cooldown
        if (this.CanUseDash(player) && this.DashDir !== -1 && this.DashDelay === 0) {
            const newVelocity = player.velocity;
            // Only apply the dash velocity if our current speed in the wanted direction is less than DashVelocity
            if (this.DashDir === 1) {
                if (player.velocity.Y > -this.DashVelocity) {
                    newVelocity.Y = -1.3 * this.DashVelocity;
                }
            } else if (this.DashDir === 0) {
                if (player.velocity.Y < this.DashVelocity) {
                    newVelocity.Y = 1 * this.DashVelocity;
                }
            } else if (this.DashDir === 3) {
                if (player.velocity.X > -this.DashVelocity) {
                    newVelocity.X = -this.DashVelocity;
                }
            } else if (this.DashDir === 2) {
                if (player.velocity.X < this.DashVelocity) {
                    newVelocity.X = this.DashVelocity;
                }
            }
            this.DashDelay = this.DashCooldown;
            this.DashTimer = this.DashDuration;
            player.velocity = newVelocity;
            this.OnStartDash(player, this.DashDir, this.DashTimer);
        }
        
        if (this.DashDelay > 0) this.DashDelay--;
        
        if (this.DashTimer > 0) {
            this.UpdateDash(player, this.DashTimer);
            this.DashTimer--;
            if (this.DashTimer == 0) this.ResetDash(player);
        }
    }
}