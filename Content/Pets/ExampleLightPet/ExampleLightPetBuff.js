import { Terraria } from './../../../TL/ModImports.js';
import { ProjectileLoader } from './../../../TL/Loaders/ProjectileLoader.js';
import { ModBuff } from './../../../TL/ModBuff.js';

const NewProjectile = Terraria.Projectile['int NewProjectile(IEntitySource spawnSource, float X, float Y, float SpeedX, float SpeedY, int Type, int Damage, float KnockBack, int Owner, float ai0, float ai1, float ai2, NewProjectileModifier modifer)'];

export class ExampleLightPetBuff extends ModBuff {
    constructor() {
        super();
        this.Texture = 'Pets/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Terraria.Main.buffNoTimeDisplay[this.Type] = true;
        Terraria.Main.lightPet[this.Type] = true;
    }
    
    UpdatePlayer(player, buffIndex) {
        if (!this.petType) {
            this.petType = ProjectileLoader.getTypeByName('ExampleLightPetProjectile');
        }
        
        player.buffTime[buffIndex] = 18000;
        if (player.ownedProjectileCounts[this.petType] > 0 || player.whoAmI !== Terraria.Main.myPlayer)
            return;
        
        const proj = Terraria.Main.projectile[NewProjectile(
            player['IEntitySource GetProjectileSource_Buff(int buffIndex)'](buffIndex),
            player.position.X + player.width / 2,
            player.position.Y + player.height / 2,
            0, 0, this.petType, 0, 0.0, player.whoAmI, 0, 0, 0, null
        )];
        
        proj.timeLeft = 18000;
    }
}