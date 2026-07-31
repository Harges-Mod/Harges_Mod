import { ModSurfaceBackground, ModUndergroundBackground } from './../TL/ModBackgrounds.js';

import { ExampleBiome_SurfaceBG, ExampleBiome_UndergroundBG } from './../Content/Backgrounds/ExampleBiomeBackgrounds.js';

export function RegisterBackgrounds() {
    ModSurfaceBackground.register(ExampleBiome_SurfaceBG);
    ModUndergroundBackground.register(ExampleBiome_UndergroundBG);
}