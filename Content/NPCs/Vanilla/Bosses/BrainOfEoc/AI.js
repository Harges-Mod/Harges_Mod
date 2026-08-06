const DustID = Terraria.ID;

using('Terraria');
GlobalImports.AllModules();

export default class BrainOfEoc extends GlobalNPC {
    constructor() {
        super();
        
        this.States = {
            Prepare: 0,
            Rotate: 1,
            WindUp: 2,
            Dashing: 3,
            Return: 4
        };

        this.initialized = false;
        this.stateEoc = this.States.Prepare;
        
        this.stateTimer = 0;
        this.angle = 0;
        this.dashVector = Vector2.new(0, 0);
        this.targetPosLock = Vector2.new(0, 0);
    }
    
    Init(npc) {
        if (this.initialized) return;

        this.stateTimer = Generic.toSec(2);
        this.angle = 0;
        this.stateEoc = this.States.Prepare;
        this.initialized = true;
    }
    
    // Trash AI
    
    LockVanillaTeleport(npc) {
        return npc.localA[1] = 0 // Max 60.
    }
    
    Prepare(npc, player) {
        this.stateTimer--;
        
        npc.velocity = Vector2.new(0, 0);
        
        let distanceOffset = 350;
        this.angle += 0.04;
        
        let targetX = player.Center.X + Math.cos(this.angle) * distanceOffset;
        let targetY = player.Center.Y + Math.sin(this.angle) * distanceOffset;
        let targetPos = Vector2.new(targetX, targetY);
        
        npc.Center = Vector2.Lerp(npc.Center, targetPos, 0.1);

        if (this.stateTimer <= 0) {
            this.stateEoc = this.States.Rotate;
            this.stateTimer = Generic.toSec(1);
        }
    }
    
    Rotate(npc, player) {
        this.stateTimer--;
        
        npc.velocity = Vector2.new(0, 0);
        
        let distanceOffset = 330;
        this.angle += 0.15;
        
        let targetX = player.Center.X + Math.cos(this.angle) * distanceOffset;
        let targetY = player.Center.Y + Math.sin(this.angle) * distanceOffset;
        let targetPos = Vector2.new(targetX, targetY);
        
        npc.Center = Vector2.Lerp(npc.Center, targetPos, 0.15);
        
        if (this.stateTimer <= 0) {
            this.targetPosLock = Vector2.new(player.Center.X, player.Center.Y);
            this.stateEoc = this.States.WindUp;
            this.stateTimer = Generic.toSec(0.35);
        }
    }

    WindUp(npc) {
    
        // Locks NPC

        this.stateTimer--;

        let dirToPlayer = Vector2.Subtract(this.targetPosLock, npc.Center);
        dirToPlayer = Vector2.Normalize(dirToPlayer);
        
        let windUpDir = Vector2.Multiply(dirToPlayer, -6);
        npc.velocity = Vector2.Lerp(npc.velocity, windUpDir, 0.2);

        if (this.stateTimer <= 0) {
            let direction = Vector2.Subtract(this.targetPosLock, npc.Center);
            direction = Vector2.Normalize(direction); 
            
            let dashSpeed = 16;
            this.dashVector = Vector2.Multiply(direction, dashSpeed);
            
            npc.velocity = this.dashVector;
            this.stateEoc = this.States.Dashing;
            this.stateTimer = Generic.toSec(0.45);
        }
    }
    
    Dashing(npc) {
        // npc.locaAI[1] = 0
        this.stateTimer--;
        
        npc.velocity = this.dashVector;
        
        if (this.stateTimer <= 0) {
            this.stateEoc = this.States.Return;
            this.stateTimer = Generic.toSec(0.8);
        }
    }
    
    Return(npc) {
        this.stateTimer--;
        
        npc.velocity = Vector2.Multiply(npc.velocity, 0.85);

        if (this.stateTimer <= 0) {
           // npc.locaAI[1] = 30
            this.stateTimer = Generic.toSec(1.5);
            this.stateEoc = this.States.Prepare;
        }
    }
    
    /*AI(npc) {
        if (npc.type === 266) {
            this.Init(npc);

            let player = Main.player[npc.target];
            if (!player || !player.active || player.dead) {
                npc.TargetClosest(true);
                player = Main.player[npc.target];
            }

            switch (this.stateEoc) {
                case this.States.Prepare:
                    this.Prepare(npc, player);
                    break;
                case this.States.Rotate:
                    this.Rotate(npc, player);
                    break;
                case this.States.WindUp:
                    this.WindUp(npc);
                    break;
                case this.States.Dashing:
                    this.Dashing(npc);
                    break;
                case this.States.Return:
                    this.Return(npc);
                    break;
            }
        }
    }*/
    
    OnTeleport() {}
}
