import { Terraria, Microsoft } from './../../TL/ModImports.js';
import { ModCloud } from './../../TL/ModCloud.js';

export class ExampleAdvancedCloud extends ModCloud {
    constructor() {
        super();
        this.Texture = 'Clouds/' + this.constructor.name;
    }
    
    RareCloud() {
        return true;
    }
    
    SpawnChance() {
        if (Terraria.Main.gameMenu) {
            return 10;
        }
        // Since this is a rare cloud, remember that this default spawn chance value is in relation to other rare clouds.
        // If you would like to force this cloud to be more common to see it in action, change RareCloud above to false.
        return 1.0;
    }
    
    OnSpawn(cloud) {
        // ExampleAdvancedCloud.png has text, so we need to force the cloud to not be flipped once spawned.
        cloud.spriteDir = Microsoft.Xna.Framework.Graphics.SpriteEffects.None;
    }
}