import { Terraria, Modules } from './../../TL/ModImports.js';
import { ModMenu } from './../../TL/ModMenu.js';
import { ModSurfaceBackground } from './../../TL/ModBackgrounds.js';

export class ExampleMenu extends ModMenu {
    constructor() {
        super();
        this.Logo = 'UI/MenuLogo';
        this.SunTexture = 'UI/Sun';
        this.MoonTexture = 'UI/Moon'
    }
    
    SetStaticDefaults() {
        // this.Background = ModSurfaceBackground.getByName('ExampleBiome_SurfaceBG');
    }
    
    ModifySkyColor(skyColor) {
       skyColor = Modules.Color.getByName('Cyan')
    }
    
}