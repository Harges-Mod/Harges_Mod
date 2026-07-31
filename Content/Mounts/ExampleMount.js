import { Terraria, Modules } from './../../TL/ModImports.js';
import { ModMount } from './../../TL/ModMount.js';
import { ModBuff } from './../../TL/ModBuff.js';

const { Color, Vector2 } = Modules;

export class ExampleMount extends ModMount {
    constructor() {
        super();
        this.Texture = 'Mounts/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        this.Data.jumpHeight = 5; // How high the mount can jump.
        this.Data.acceleration = 0.19; // The rate at which the mount speeds up.
        this.Data.jumpSpeed = 4; // The rate at which the player and mount ascend towards (negative y velocity) the jump height when the jump button is pressed.
        this.Data.blockExtraJumps = false; // Determines whether or not you can use a double jump (like cloud in a bottle) while in the mount.
        this.Data.constantJump = true; // Allows you to hold the jump button down.
        this.Data.heightBoost = 20; // Height between the mount and the ground
        this.Data.fallDamage = 0.5; // Fall damage multiplier.
        this.Data.runSpeed = 11; // The speed of the mount
        this.Data.dashSpeed = 8; // The speed the mount moves when in the state of dashing.
        this.Data.flightTimeMax = 0; // The amount of time in frames a mount can be in the state of flying.
        
        // Misc
        this.Data.fatigueMax = 0;
        this.Data.buff = ModBuff.getTypeByName('ExampleMountBuff'); // The ID number of the buff assigned to the mount.
        
        // Effects
        this.Data.spawnDust = 60;
        
        // Frame data and player offsets
        this.Data.totalFrames = 4; // Amount of animation frames for the mount
        const yOffset = 10;
        this.Data.playerYOffsets = new Array(20).fill(yOffset).makeGeneric('int'); // Fills an array with values for less repeating code
        this.Data.xOffset = 13;
        this.Data.yOffset = -12;
        this.Data.playerHeadOffset = 22;
        this.Data.bodyFrame = 3;
        
        // Standing
        this.Data.standingFrameCount = 4;
        this.Data.standingFrameDelay = 12;
        this.Data.standingFrameStart = 0;
        // Running
        this.Data.runningFrameCount = 4;
        this.Data.runningFrameDelay = 12;
        this.Data.runningFrameStart = 0;
        // Flying
        this.Data.flyingFrameCount = 0;
        this.Data.flyingFrameDelay = 0;
        this.Data.flyingFrameStart = 0;
        // In-air
        this.Data.inAirFrameCount = 1;
        this.Data.inAirFrameDelay = 12;
        this.Data.inAirFrameStart = 0;
        // Idle
        this.Data.idleFrameCount = 4;
        this.Data.idleFrameDelay = 12;
        this.Data.idleFrameStart = 0;
        this.Data.idleFrameLoop = true;
        // Swim
        this.Data.swimFrameCount = this.Data.inAirFrameCount;
        this.Data.swimFrameDelay = this.Data.inAirFrameDelay;
        this.Data.swimFrameStart = this.Data.inAirFrameStart;
        
        if (!Terraria.Main.dedServ) {
            this.Data.textureWidth = this.Data.backTexture.Value.Width + 20;
            this.Data.textureHeight = this.Data.backTexture.Value.Height;
        }
    }
    
    SetMount(mount, player) {
        
        // This code bypasses the normal mount spawning dust and replaces it with our own visual.
        for (let i = 0; i < 16; i++) {
            const dust = Terraria.Dust.NewDustPerfect(
                Vector2.Add(
                    player.Center,
                    Vector2.RotatedBy(
                        Vector2.new(80, 0),
                        i + Math.PI * 2 / 16
                    )
                ),
                mount._data.spawnDust,
                null, 0, null, 1.0
            );
            dust.noGravity = true;
        }
        return false;
    }
}