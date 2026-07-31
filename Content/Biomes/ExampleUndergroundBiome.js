import { Terraria } from './../../TL/ModImports.js';
import { ModBiome } from './../../TL/ModBiome.js';
import { ModUndergroundBackground } from './../../TL/ModBackgrounds.js';
import { SceneEffectPriority } from './../../TL/SceneEffectPriority.js';
import { Subworld } from './../../TL/Subworld.js';

export class ExampleUndergroundBiome extends ModBiome {
    constructor() {
        super();
        
        this.DropletTexture = 'Biomes/ExampleSurfaceBiome/ExampleDroplet';
        this.MapBackgroundTexture = 'Biomes/ExampleSurfaceBiome/ExampleSurfaceBiome_Background';
        this.WaterTexture = 'Biomes/ExampleSurfaceBiome/ExampleWaterStyle'; // autoload: _Block && _Slope
        this.WaterfallTexture = 'Biomes/ExampleSurfaceBiome/ExampleWaterfall';
    }
    
    // Set variables that will be used later
    SetStaticDefaults() {
        this.SpawnRateMultiplier = 1.15;
        
        this.Priority = SceneEffectPriority.BiomeLow;
        this.UndergroundBackground = ModUndergroundBackground.getByName('ExampleBiome_UndergroundBG');
    }
    
    // Check if the biome is active
    IsBiomeActive(player, tileCounts) {
        if (player.ZoneRockLayerHeight || player.ZoneDirtLayerHeight) {
            return Subworld.getByName('ExampleSubworld')?.IsActive() ?? false;
        }
        return false;
    }
    
    // Increase spawn rates while in the biome
    OnInBiome(player) {
        Terraria.NPC.spawnRate *= this.SpawnRateMultiplier;
        Terraria.NPC.maxSpawns *= this.SpawnRateMultiplier;
    }
    
    ModifySpawnPool(spawnInfo, pool) {
        // Disable vanilla spawn
        if (spawnInfo.CommonEnemy) {
            pool[0] = 0;
        }
    }
}