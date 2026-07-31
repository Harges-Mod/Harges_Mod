import { Terraria } from './../../TL/ModImports.js';
import { ModSurfaceBackground, ModUndergroundBackground } from './../../TL/ModBackgrounds.js';
import { ModBiome } from './../../TL/ModBiome.js';

export class ExampleBiome_UndergroundBG extends ModUndergroundBackground {
    constructor() {
        super();
    }
    
    FillTextureArray(textureSlots) {
        textureSlots[0] = ModUndergroundBackground.getBackgroundSlot('ExampleBiomeUnderground0');
        textureSlots[1] = ModUndergroundBackground.getBackgroundSlot('ExampleBiomeUnderground1');
        textureSlots[2] = ModUndergroundBackground.getBackgroundSlot('ExampleBiomeUnderground2');
        textureSlots[3] = ModUndergroundBackground.getBackgroundSlot('ExampleBiomeUnderground3');
    }
}

export class ExampleBiome_SurfaceBG extends ModSurfaceBackground {
    constructor() {
        super();
        this.frame = 0;
        this.frameCounter = 0;
    }
    
    ModifyFarFades() {
        Terraria.Main.instance.DrawBG_ModifyBGFarBackLayerAlpha(this.Slot, null, null);
        Terraria.Main.instance.DrawBG_ModifyBGFarBackLayerAlpha(this.Slot, null, null);
    }
    
    ChooseFarTexture() {
        return ModSurfaceBackground.getBackgroundSlot('ExampleBiomeSurfaceFar');
    }
    
    ChooseMiddleTexture() {
        if (++this.frameCounter > 12) {
            this.frame = (this.frame + 1) % 4;
            this.frameCounter = 0;
        }
        return ModSurfaceBackground.getBackgroundSlot(`ExampleBiomeSurfaceMid${this.frame}`);
    }
    
    ChooseCloseTexture() {
        return ModSurfaceBackground.getBackgroundSlot('ExampleBiomeSurfaceClose');
    }
}