import { Terraria, Modules } from './../../TL/ModImports.js';
import { ModBiome } from './../../TL/ModBiome.js';
import { ModSurfaceBackground } from './../../TL/ModBackgrounds.js';
import { SceneEffectPriority } from './../../TL/SceneEffectPriority.js';
import { Subworld } from './../../TL/Subworld.js';

const { Color } = Modules;

export class ExampleSurfaceBiome extends ModBiome {
    constructor() {
        super();
        this.RainTexture = 'Biomes/ExampleSurfaceBiome/ExampleRain';
        this.DropletTexture = 'Biomes/ExampleSurfaceBiome/ExampleDroplet';
        this.MapBackgroundTexture = 'Biomes/ExampleSurfaceBiome/ExampleSurfaceBiome_Background';
        this.WaterTexture = 'Biomes/ExampleSurfaceBiome/ExampleWaterStyle'; // autoload: _Block && _Slope
        this.WaterfallTexture = 'Biomes/ExampleSurfaceBiome/ExampleWaterfall';
    }
    
    // Set variables that will be used later
    SetStaticDefaults() {
        this.SpawnRateMultiplier = 1.15;
        
        this.Priority = SceneEffectPriority.BiomeLow;
        this.SurfaceBackground = ModSurfaceBackground.getByName('ExampleBiome_SurfaceBG');
        this.BiomeColor = Color.new(200, 255, 230);
    }
    
    // Check if the biome is active
    IsBiomeActive(player, tileCounts) {
        if (player.ZoneSkyHeight || player.ZoneOverworldHeight) {
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
    
    // The ID of the dust that is created when anything splashes in water.
    GetSplashDust(dustType) {
        return Terraria.ID.DustID.ShimmerSplash;
    }
}