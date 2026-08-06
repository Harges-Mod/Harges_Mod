using('Terraria');

import { HargesGraphics } from './Graphics/HargesGraphics.js';
import { HargesUtils } from './Utils/HargesUtils.js';
import { HargesAssets } from './Assets/HargesAssets.js';

// Extends ModSystem.
export class Harges extends ModSystem {  
    
    constructor() {
        super()
    }
    
    static Graphics = new HargesGraphics();
    static Utils = new HargesUtils();
    static Assets = new HargesAssets();
    
    PostSetupContent() {
      // Harges.Graphics.UParticle.UpdateAll()
    }
    
    PostUpdateTime() {
        // fix Ever Update
        Harges.Graphics.UParticle.Update()
    }
    
    DrawPostEntity() {
    
      //  tl.log('DrawPostEntity')
        Harges.Graphics.UParticle.Draw(true)
    }
    
    DrawBehindEntity() {
       // tl.log('BedindEntity')
        Harges.Graphics.UParticle.Draw(false)
    }
   
}

globalThis.Harges = Harges;