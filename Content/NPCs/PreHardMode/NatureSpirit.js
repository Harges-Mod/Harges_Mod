const { Color, Vector2 } = Modules;
const { ItemDropRule } = Terraria.GameContent.ItemDropRules;
const { 
    BestiaryDatabaseNPCsPopulator,
    FlavorTextBestiaryInfoElement
} = Terraria.GameContent.Bestiary;

const NewDust = Terraria.Dust['int NewDust(Vector2 Position, int Width, int Height, int Type, float SpeedX, float SpeedY, int Alpha, Color newColor, float Scale)'];
// Função utilitária para aproximar linearmente (LERP) os canais de cor

function Lerp(start, end, amt) {
    return start + (end - start) * amt;
}

export class NatureSpirit extends ModNPC {
    constructor() {
        super();
        this.Texture = 'NPCs/PreHardMode/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Terraria.Main.npcFrameCount[this.Type] = 3;
        Terraria.ID.ProjectileID.Sets.TrailCacheLength[this.Type] = 8;
        Terraria.ID.ProjectileID.Sets.TrailingMode[this.Type] = 1;
    }
    
    SetDefaults() {
        this.NPC.width = 30;
        this.NPC.height = 30;
        this.NPC.damage = 14; 
        this.NPC.defense = 4;
        this.NPC.lifeMax = 40;
        
        // Cor base inicial (azulada)
        this.NPC.color = Color.new(40, 200, 255, 100);
        //this.NPC.alpha = 175;
        
        this.NPC.HitSound = Terraria.ID.SoundID.NPCHit5; 
        this.NPC.DeathSound = Terraria.ID.SoundID.NPCDeath6; 
        this.NPC.value = ModNPC.NPCValue(0, 0, 1, 50);   
        this.NPC.noGravity = true; 
        this.NPC.noTileCollide = false; 
        this.NPC.aiStyle -= 1;
    }
    
    AI(npc) {
        if (npc.ai[1] === 0) {
            npc.ai[1] = 1; 
        }
        
        this.FlyLogic(npc);
        this.UpdateColor(npc);    
        this.VisualEffects(npc);
        this.UpdateRotation(npc);
    }
    
    UpdateColor(npc) {
        const baseColor = Color.new(40, 200, 255, 100);
        const chargeColor = Color.new(255, 255, 255, 100);


        if (npc.ai[1] === 1 && npc.ai[2] > 210) {

            let progress = (npc.ai[2] - 210) / 90;
            progress = Math.min(1, Math.max(0, progress));


            const flashSpeed = 0.1 + (progress * 0.4); 
            const wave = Math.sin(Terraria.Main.GameUpdateCount * flashSpeed);

            let pulseFactor = ((wave + 1) * 0.5) * progress;
            

            pulseFactor = Math.pow(pulseFactor, 1.2);

            const r = Math.floor(Lerp(baseColor.R, chargeColor.R, pulseFactor));
            const g = Math.floor(Lerp(baseColor.G, chargeColor.G, pulseFactor));
            const b = Math.floor(Lerp(baseColor.B, chargeColor.B, pulseFactor));
            
            npc.color = Color.new(r, g, b, baseColor.A);
        } 

        // dash
        else if (npc.ai[1] === 2) {

            npc.color = chargeColor;
        } 
        else {
            npc.color = baseColor;
        }
    }
    
    FlyLogic(npc) {
        const targetPlayer = Terraria.Main.player[npc.target];
        
        if (!targetPlayer || !targetPlayer.active || targetPlayer.dead) {
            npc.velocity = Vector2.new(npc.velocity.X * 0.95, npc.velocity.Y - 0.2); 
            return;
        }
        
        const npcCenter = Vector2.new(npc.position.X + (npc.width * 0.5), npc.position.Y + (npc.height * 0.5));
        const playerCenter = Vector2.new(targetPlayer.position.X + (targetPlayer.width * 0.5), targetPlayer.position.Y + (targetPlayer.height * 0.5));
        
        npc.direction = (npcCenter.X < playerCenter.X) ? 1 : -1;

        npc.ai[2]++;
        

        if (npc.ai[1] === 1 && npc.ai[2] > 300) { 
            npc.ai[1] = 2; 
            npc.ai[2] = 0; 
            
            let dashDirection = Vector2.new(playerCenter.X - npcCenter.X, playerCenter.Y - npcCenter.Y);
            dashDirection = Vector2.Normalize(dashDirection);
            npc.velocity = Vector2.new(dashDirection.X * 6, dashDirection.Y * 6);
        } 

        else if (npc.ai[1] === 2 && npc.ai[2] > 45) { 
            npc.ai[1] = 1;
            npc.ai[2] = 0;
        }

        let newVelocityX = npc.velocity.X;
        let newVelocityY = npc.velocity.Y;

        if (npc.ai[1] === 1) {
            const maxSpeedX = 3.5;
            const accelerationX = 0.12;
            const distanceX = Math.abs(npcCenter.X - playerCenter.X);
            const targetDistanceX = 100; 

            if (distanceX > targetDistanceX + 20) {
                newVelocityX += npc.direction * accelerationX;
            } else if (distanceX < targetDistanceX - 20) {
                newVelocityX -= npc.direction * accelerationX;
            } else {
                newVelocityX *= 0.95; 
            }
            newVelocityX = Math.max(-maxSpeedX, Math.min(maxSpeedX, newVelocityX));

            const waveSpeed = 0.15;
            const waveAmplitude = 40; 
            const waveTime = (Terraria.Main.GameUpdateCount + (npc.whoAmI * 15)) * waveSpeed;
            const sineWave = Math.sin(waveTime) * waveAmplitude;

            const targetY = playerCenter.Y - 70 + sineWave;
            let differenceY = targetY - npcCenter.Y;
            
            newVelocityY = npc.velocity.Y + (differenceY * 0.03);
            newVelocityY = Math.max(-2.5, Math.min(2.5, newVelocityY));
        } else {
            newVelocityX *= 0.98;
            newVelocityY *= 0.98;
        }

        npc.velocity = Vector2.new(newVelocityX, newVelocityY);
    }
    
    UpdateRotation(npc) {
        if (npc.ai[1] === 2) {
            npc.rotation = npc.velocity.X * 0.08;
        } else {
            npc.rotation = npc.velocity.X * 0.05;
        }
    }
    
    VisualEffects(npc) {
        if (Math.random() < 0.15) {
            let dustType = 15; 
            if (npc.ai[1] === 2) dustType = 59; 

            NewDust(npc.position, npc.width, npc.height, dustType, npc.velocity.X * 0.2, npc.velocity.Y * 0.2, 100, npc.color, 0.9);
        }
    }

    FindFrame(npc, frameHeight) {
        npc.spriteDirection = npc.direction;
        let frame = npc.frame;

        npc.frameCounter += 1.0;
        if (npc.frameCounter >= 4.0) {
            frame.Y += frameHeight;
            npc.frameCounter = 0.0;
        }

        if (frame.Y >= frameHeight * 3) {
            frame.Y = 0;
        }

        npc.frame = frame;
    }
    
    SpawnChance(info) {
        let chance = 0;
        if (info.Day && info.Surface && !info.Water) {
            chance = 0.35;
            if (info.HardMode) chance += 0.10;
        }
        return chance;
    }
    
    ModifyNPCLoot(npcLoot) {
        npcLoot.Add(ItemDropRule.Common(Terraria.ID.ItemID.ManaCrystal, 20, 1, 1)); 
        npcLoot.Add(ItemDropRule.Common(Terraria.ID.ItemID.LivingWoodWand, 50, 1, 1)); 
    }

    HitEffect(npc, hitDirection, damage) {

        for (let i = 0; i < 7; i++) {
            NewDust(npc.position, npc.width, npc.height, 15, hitDirection * 2, -1, 100, npc.color, 0.8);
        }

        if (npc.life <= 0) {
            for (let i = 0; i < 20; i++) {
                NewDust(npc.position, npc.width, npc.height, 59, npc.velocity.X * 0.5, npc.velocity.Y * 0.5, 50, npc.color, 1.2);
            }
        }
    }
}
