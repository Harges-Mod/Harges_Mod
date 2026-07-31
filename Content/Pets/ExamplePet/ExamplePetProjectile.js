import { Terraria } from './../../../TL/ModImports.js';
import { ModBuff } from './../../../TL/ModBuff.js';
import { ModProjectile } from './../../../TL/ModProjectile.js';

export class ExamplePetProjectile extends ModProjectile {
    constructor() {
        super();
        this.Texture = 'Pets/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Terraria.Main.projFrames[this.Type] = 4;
        Terraria.Main.projPet[this.Type] = true;
        
        Terraria.ID.ProjectileID.Sets.CharacterPreviewAnimations[this.Type] = Terraria.ID.ProjectileID.Sets.SimpleLoop(
            0, Terraria.Main.projFrames[this.Type],
            12, false
        )['SettingsForCharacterPreview WithOffset(float x, float y)'](
            -5, -20
        ).WithSpriteDirection(-1);
    }
    
    SetDefaults() {
        this.Projectile.netImportant = true;
        this.Projectile.width = 40;
        this.Projectile.height = 32;
        this.Projectile.aiStyle = Terraria.ID.ProjAIStyleID.Pet;
        this.Projectile.friendly = true;
        this.Projectile.penetrate = -1;
        this.Projectile.timeLeft = 18000;
    }
    
    PreAI(proj) {
        Terraria.Main.player[proj.owner].zephyrfish = false;
        return true;
    }
    
    AI(proj) {
        if (!this.buffType)
            this.buffType = ModBuff.getTypeByName('ExamplePetBuff');
        
        const player = Terraria.Main.player[proj.owner];
        if (!player.dead && player.FindBuffIndex(this.buffType) >= 0) {
            proj.timeLeft = 2;
        }
        
        // Animation
        const frameSpeed = 12;
        const maxFrames = Terraria.Main.projFrames[this.Type];
        proj.frame = Math.floor((Terraria.Main.GameUpdateCount / frameSpeed) * maxFrames) % maxFrames;
    }
}