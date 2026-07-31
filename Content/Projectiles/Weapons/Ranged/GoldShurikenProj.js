
GlobalImports.AllModules();

export class GoldShurikenProj extends ModProjectile {

    constructor() {
    super()
        this.Texture = 'Projectiles/Weapons/Ranged/' + this.constructor.name
    }
    
    SetDefaults() {  
      let proj = this.Projectile 
      proj.width = 22;
      proj.height = 22;
      proj.aiStyle = 2;
      proj.friendly = true;
      proj.penetrate = 5; // orig is 4
      proj.ranged = true;
    }
    
    AI(proj) {
        if (Rand.NextBool(3)) {
            Effects.NewDust(proj.Center, 0, 0, DustID.YellowTorch);
        }
        
    }
    
    OnKill(proj, timeLeft) {
    
        let i = 0 
        
        while(i < 5) {
            Effects.NewDust(proj.Center, 0, 0, DustID.YellowTorch);
            i++
        }
    }
    
}
