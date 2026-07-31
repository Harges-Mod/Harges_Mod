// Enums
import { BiomeID } from './Enums/BiomeID.js';
import { CloudID } from './Enums/CloudID.js';
import { DashID } from './Enums/DashID.js';
import { ItemRarityID } from './Enums/ItemRarityID.js';
import { MoonPhases } from './Enums/MoonPhases.js';
import { MusicID } from './Enums/MusicID.js';
import { ProjAIStyleID } from './Enums/ProjAIStyleID.js';
import { NPCAIStyleID } from './Enums/NPCAIStyleID.js';

// Modules
import { Color } from './Modules/Color.js';
import { Effects } from './Modules/Effects.js';
import { Camera, CameraShake } from './Modules/Camera.js';
import { MathHelper } from './Modules/MathHelper.js';
import { Point } from './Modules/Point.js';
import { Point16 } from './Modules/Point16.js';
import { Rand } from './Modules/Rand.js';
import { Rectangle } from './Modules/Rectangle.js';
import { TileData } from './Modules/TileData.js';
import { Vector2 } from './Modules/Vector2.js';
import { WorldGenRand } from './Modules/WorldGenRand.js';
// Modules.Utils
import { PrefixUtils } from './Modules/Utils/Prefix.js';
import { WorldUtils } from './Modules/Utils/World.js';
export const Modules = {
    Color,
    Effects,
    Camera,
    CameraShake,
    MathHelper,
    Point,
    Point16,
    Rand,
    Rectangle,
    TileData,
    Vector2,
    WorldGenRand,
    Utils: {
        PrefixUtils,
        WorldUtils
    }
}


export const Terraria = {
    Player: new NativeClass('Terraria', 'Player'),
    Item: new NativeClass('Terraria', 'Item'),
    Projectile: new NativeClass('Terraria', 'Projectile'),
    NPC: new NativeClass('Terraria', 'NPC'),
    Main: new NativeClass('Terraria', 'Main'),
    WorldGen: new NativeClass('Terraria', 'WorldGen'),
    Lang: new NativeClass('Terraria', 'Lang'),
    Lighting: new NativeClass('Terraria', 'Lighting'),
    Sign: new NativeClass('Terraria', 'Sign'),
    Recipe: new NativeClass('Terraria', 'Recipe'),
    RecipeGroup: new NativeClass('Terraria', 'RecipeGroup'),
    Tile: new NativeClass('Terraria', 'Tile'),
    TileData: new NativeClass('Terraria', 'TileData'),
    TileObject: new NativeClass('Terraria', 'TileObject'),
    Framing: new NativeClass('Terraria', 'Framing'),
    HitTile: new NativeClass('Terraria', 'HitTile'),
    Utils: new NativeClass('Terraria', 'Utils'),
    Mount: new NativeClass('Terraria', 'Mount'),
    GetItemSettings: new NativeClass('Terraria', 'GetItemSettings'),
    Chest: new NativeClass('Terraria', 'Chest'),
    ChestItem: new NativeClass('Terraria', 'ChestItem'),
    WorldItem: new NativeClass('Terraria', 'WorldItem'),
    InventoryStorage: new NativeClass('Terraria', 'InventoryStorage'),
    Dust: new NativeClass('Terraria', 'Dust'),
    Gore: new NativeClass('Terraria', 'Gore'),
    Cloud: new NativeClass('Terraria', 'Cloud'),
    CombatText: new NativeClass('Terraria', 'CombatText'),
    Collision: new NativeClass('Terraria', 'Collision'),
    GUIPlayerCreateMenu: new NativeClass('', 'GUIPlayerCreateMenu'),
    PlayerSpawnContext: new NativeClass('Terraria', 'PlayerSpawnContext'),
    DelegateMethods: new NativeClass('Terraria', 'DelegateMethods'),
    PopupText: new NativeClass('Terraria', 'PopupText'),
    Wiring: new NativeClass('Terraria', 'Wiring'),
    NetMessage: new NativeClass('Terraria', 'NetMessage'),
    Rain: new NativeClass('Terraria', 'Rain'),
    ShoppingSettings: new NativeClass('Terraria', 'ShoppingSettings'),
    WaterfallManager: new NativeClass('Terraria', 'WaterfallManager'),
    
    Enums: {
        TileObjectDirection: new NativeClass('Terraria.Enums', 'TileObjectDirection'),
        TownNPCSpawnResult: new NativeClass('Terraria.Enums', 'TownNPCSpawnResult')
    },
    
    ID: {
        AmmoID: new NativeClass('Terraria.ID', 'AmmoID'),
        ArmorIDs: new NativeClass('Terraria.ID', 'ArmorIDs'),
        BiomeID: BiomeID,
        BuffID: new NativeClass('Terraria.ID', 'BuffID'),
        CloudID: CloudID,
        ContentSamples: new NativeClass('Terraria.ID', 'ContentSamples'),
        CustomCurrencyID: new NativeClass('Terraria.ID', 'CustomCurrencyID'),
        DashID: DashID,
        DustID: new NativeClass('Terraria.ID', 'DustID'),
        GoreID: new NativeClass('Terraria.ID', 'GoreID'),
        ItemID: new NativeClass('Terraria.ID', 'ItemID'),
        ItemHoldStyleID: new NativeClass('Terraria.ID', 'ItemHoldStyleID'),
        ItemRarityID: ItemRarityID,
        ItemUseStyleID: new NativeClass('Terraria.ID', 'ItemUseStyleID'),
        MoonPhases: MoonPhases,
        MountID: new NativeClass('Terraria.ID', 'MountID'),
        MusicID: MusicID,
        NPCAIStyleID: NPCAIStyleID,
        NPCHeadID: new NativeClass('Terraria.ID', 'NPCHeadID'),
        NPCID: new NativeClass('Terraria.ID', 'NPCID'),
        PrefixID: new NativeClass('Terraria.ID', 'PrefixID'),
        ProjAIStyleID: ProjAIStyleID,
        ProjectileID: new NativeClass('Terraria.ID', 'ProjectileID'),
        ProjectileDrawLayerID: new NativeClass('Terraria.ID', 'ProjectileDrawLayerID'),
        RecipeGroups: new NativeClass('Terraria.ID', 'RecipeGroups'),
        SoundID: new NativeClass('Terraria.ID', 'SoundID'),
        TileID: new NativeClass('Terraria.ID', 'TileID'),
        WallID: new NativeClass('Terraria.ID', 'WallID')
    },

    Localization: {
        Language: new NativeClass('Terraria.Localization', 'Language'),
        LanguageManager: new NativeClass('Terraria.Localization', 'LanguageManager'),
        LocalizedText: new NativeClass('Terraria.Localization', 'LocalizedText'),
        NetworkText: new NativeClass('Terraria.Localization', 'NetworkText'),
        GameCulture: new NativeClass('Terraria.Localization', 'GameCulture'),
    },
    
    Map: {
        MapHelper: new NativeClass('Terraria.Map', 'MapHelper')
    },

    UI: {
        ItemSlot: new NativeClass('Terraria.UI', 'ItemSlot'),
        ItemTooltip: new NativeClass('Terraria.UI', 'ItemTooltip'),
        ItemSorting: new NativeClass('Terraria.UI', 'ItemSorting'),
        Chat: {
            ChatManager: new NativeClass('Terraria.UI.Chat', 'ChatManager')
        }
    },

    GameContent: {
        Achievements: {
            AchievementsHelper: new NativeClass('Terraria.GameContent.Achievements', 'AchievementsHelper'),
            ItemCraftCondition: new NativeClass('Terraria.GameContent.Achievements', 'ItemCraftCondition'),
            CustomFlagCondition: new NativeClass('Terraria.GameContent.Achievements', 'CustomFlagCondition'),
            CustomFloatCondition: new NativeClass('Terraria.GameContent.Achievements', 'CustomFloatCondition'),
            CustomIntCondition: new NativeClass('Terraria.GameContent.Achievements', 'CustomIntCondition'),
            ItemPickupCondition: new NativeClass('Terraria.GameContent.Achievements', 'ItemPickupCondition'),
            NPCKilledCondition: new NativeClass('Terraria.GameContent.Achievements', 'NPCKilledCondition'),
            TileDestroyedCondition: new NativeClass('Terraria.GameContent.Achievements', 'TileDestroyedCondition')
        },
        Bestiary: {
            BestiaryDatabase: new NativeClass('Terraria.GameContent.Bestiary', 'BestiaryDatabase'),
            BestiaryEntry: new NativeClass('Terraria.GameContent.Bestiary', 'BestiaryEntry'),
            BestiaryDatabaseNPCsPopulator: new NativeClass('Terraria.GameContent.Bestiary', 'BestiaryDatabaseNPCsPopulator'),
            FlavorTextBestiaryInfoElement: new NativeClass('Terraria.GameContent.Bestiary', 'FlavorTextBestiaryInfoElement'),
            MoonLordPortraitBackgroundProviderBestiaryInfoElement: new NativeClass('Terraria.GameContent.Bestiary', 'MoonLordPortraitBackgroundProviderBestiaryInfoElement'),
            NPCKillsTracker: new NativeClass('Terraria.GameContent.Bestiary', 'NPCKillsTracker')
        },
        Biomes: {
            CorruptionPitBiome: new NativeClass('Terraria.GameContent.Biomes', 'CorruptionPitBiome'),
            CaveHouseBiome: new NativeClass('Terraria.GameContent.Biomes', 'CaveHouseBiome'),
            CaveHouse: {
                HouseUtils: new NativeClass('Terraria.GameContent.Biomes.CaveHouse', 'HouseUtils')
            }
        },
        ChildSafety: new NativeClass('Terraria.GameContent', 'ChildSafety'),
        Creative: {
            CreativeItemSacrificesCatalog: new NativeClass('Terraria.GameContent.Creative', 'CreativeItemSacrificesCatalog'),
            ItemsSacrificedUnlocksTracker: new NativeClass('Terraria.GameContent.Creative', 'ItemsSacrificedUnlocksTracker')
        },
        Drawing: {
            ParticleOrchestraSettings: new NativeClass('Terraria.GameContent.Drawing', 'ParticleOrchestraSettings'),
            ParticleOrchestrator: new NativeClass('Terraria.GameContent.Drawing', 'ParticleOrchestrator'),
            ParticleOrchestraType: new NativeClass('Terraria.GameContent.Drawing', 'ParticleOrchestraType'),
            TileDrawing: new NativeClass('Terraria.GameContent.Drawing', 'TileDrawing'),
            WallDrawing: new NativeClass('Terraria.GameContent.Drawing', 'WallDrawing')
        },
        Events: {
            BirthdayParty: new NativeClass('Terraria.GameContent.Events', 'BirthdayParty'),
            DD2Event: new NativeClass('Terraria.GameContent.Events', 'DD2Event'),
            LanternNight: new NativeClass('Terraria.GameContent.Events', 'LanternNight'),
            Sandstorm: new NativeClass('Terraria.GameContent.Events', 'Sandstorm')
        },
        FontAssets: new NativeClass('Terraria.GameContent', 'FontAssets'),
        Items: {
            ItemVariant: new NativeClass('Terraria.GameContent.Items', 'ItemVariant'),
            ItemVariants: new NativeClass('Terraria.GameContent.Items', 'ItemVariants'),
            TagEffectState: new NativeClass('Terraria.GameContent.Items', 'TagEffectState'),
            UniqueTagEffect: new NativeClass('Terraria.GameContent.Items', 'UniqueTagEffect'),
            WhipTagEffect: new NativeClass('Terraria.GameContent.Items', 'WhipTagEffect')
        },
        ItemDropRules: {
            CommonCode: new NativeClass('Terraria.GameContent.ItemDropRules', 'CommonCode'),
            Conditions: new NativeClass('Terraria.GameContent.ItemDropRules', 'Conditions'),
            DropOneByOne: new NativeClass('Terraria.GameContent.ItemDropRules', 'DropOneByOne'),
            ItemDropDatabase: new NativeClass('Terraria.GameContent.ItemDropRules', 'ItemDropDatabase'),
            ItemDropRule: new NativeClass('Terraria.GameContent.ItemDropRules', 'ItemDropRule'),
            LeadingConditionRule: new NativeClass('Terraria.GameContent.ItemDropRules', 'LeadingConditionRule')
        },
        Liquid: {
            LiquidRenderer: new NativeClass('Terraria.GameContent.Liquid', 'LiquidRenderer')
        },
        Metadata: {
            TileMaterials: new NativeClass('Terraria.GameContent.Metadata', 'TileMaterials')
        },
        Personalities: {
            AllPersonalitiesModifier: new NativeClass('Terraria.GameContent.Personalities', 'AllPersonalitiesModifier'),
            HelperInfo: new NativeClass('Terraria.GameContent.Personalities', 'HelperInfo'),
            IShopPersonalityTrait: new NativeClass('Terraria.GameContent.Personalities', 'IShopPersonalityTrait'),
            PersonalityDatabase: new NativeClass('Terraria.GameContent.Personalities', 'PersonalityDatabase')
        },
        Prefixes: {
            PrefixLegacy: new NativeClass('Terraria.GameContent.Prefixes', 'PrefixLegacy')
        },
        HairstyleUnlocksHelper: new NativeClass('Terraria.GameContent', 'HairstyleUnlocksHelper'),
        PlayerSittingHelper: new NativeClass('Terraria.GameContent', 'PlayerSittingHelper'),
        ShopHelper: new NativeClass('Terraria.GameContent', 'ShopHelper'),
        TextureAssets: new NativeClass('Terraria.GameContent', 'TextureAssets'),
        NPCInteractions: new NativeClass('Terraria.GameContent', 'NPCInteractions'),
        QuickStacking: new NativeClass('Terraria.GameContent', 'QuickStacking'),
        ShimmerTransforms: new NativeClass('Terraria.GameContent', 'ShimmerTransforms'),
        TownNPCProfiles: new NativeClass('Terraria.GameContent', 'TownNPCProfiles'),
        TownRoomManager: new NativeClass('Terraria.GameContent', 'TownRoomManager'),
        UI: {
            EmoteBubble: new NativeClass('Terraria.GameContent.UI', 'EmoteBubble'),
            CustomCurrencyManager: new NativeClass('Terraria.GameContent.UI', 'CustomCurrencyManager'),
            WiresUI: new NativeClass('Terraria.GameContent.UI', 'WiresUI')
        }
    },
    
    ObjectData: {
        TileObjectData: new NativeClass('Terraria.ObjectData', 'TileObjectData')
    },

    DataStructures: {
        ArmorSetBonuses: new NativeClass('Terraria.DataStructures', 'ArmorSetBonuses'),
        ArmorSetBonus: new NativeClass('Terraria.DataStructures', 'ArmorSetBonus'),
        CachedProjectileCounterBuffTextHandler: new NativeClass('Terraria.DataStructures', 'CachedProjectileCounterBuffTextHandler'),
        DrawData: new NativeClass('Terraria.DataStructures', 'DrawData'),
        EntitySource_Gift: new NativeClass('Terraria.DataStructures', 'EntitySource_Gift'),
        GameDifficultyLevel: new NativeClass('Terraria.DataStructures', 'GameDifficultyLevel'),
        IBuffTextHandler: new NativeClass('Terraria.DataStructures', 'IBuffTextHandler'),
        Point16: new NativeClass('Terraria.DataStructures', 'Point16'),
        PlayerDrawSet: new NativeClass('Terraria.DataStructures', 'PlayerDrawSet'),
        PlayerDeathReason: new NativeClass('Terraria.DataStructures', 'PlayerDeathReason'),
        TileEntity: new NativeClass('Terraria.DataStructures', 'TileEntity'),
        WingStats: new NativeClass('Terraria.DataStructures', 'WingStats'),
        ItemCreationContext: new NativeClass('Terraria.DataStructures', 'ItemCreationContext'),
        NPCDebuffImmunityData: new NativeClass('Terraria.DataStructures', 'NPCDebuffImmunityData')
    },
    
    Achievements: {
        Achievement: new NativeClass ('Terraria.Achievements', 'Achievement'),
        AchievementManager: new NativeClass ('Terraria.Achievements', 'AchievementManager'),
        AchievementCategory: new NativeClass('Terraria.Achievements', 'AchievementCategory')
    },

    Audio: {
        SoundEngine : new NativeClass('Terraria.Audio', 'SoundEngine')
    },
    
    Chat: {
        ChatCommandProcessor: new NativeClass('Terraria.Chat', 'ChatCommandProcessor')
    },

    Graphics: {
        Capture: {
            CaptureManager: new NativeClass('Terraria.Graphics.Capture', 'CaptureManager')
        },
        Effects: {
            SkyManager: new NativeClass('Terraria.Graphics.Effects', 'SkyManager')
        },
        Shaders: {
            GameShaders: new NativeClass('Terraria.Graphics.Shaders', 'GameShaders')
        },
        
        Renderers: {
           PrettySparkleParticle: new NativeClass('Terraria.Graphics.Renderers', 'PrettySparkleParticle'),
           LegacyPlayerRenderer: new NativeClass("Terraria.Graphics.Renderers", "LegacyPlayerRenderer"),
        },
        
    },

    IO: {
        WorldFile: new NativeClass('Terraria.IO', 'WorldFile'),
    },

    Initializers: {
        AssetInitializer: new NativeClass('Terraria.Initializers', 'AssetInitializer'),
        //WingStatsInitializer: new NativeClass('Terraria.Initializers', 'WingStatsInitializer'),
    },

    Utilities: {
        UnifiedRandom: new NativeClass('Terraria.Utilities', 'UnifiedRandom')
    },
    
    WorldBuilding: {
        GenVars: new NativeClass('Terraria.WorldBuilding', 'GenVars'),
        WorldUtils: new NativeClass('Terraria.WorldBuilding', 'WorldUtils')
    }
}

export const Microsoft = {
    Xna: {
        Framework: {
            Vector2: new NativeClass('Microsoft.Xna.Framework', 'Vector2'),
            Vector3: new NativeClass('Microsoft.Xna.Framework', 'Vector3'),
            Vector4: new NativeClass('Microsoft.Xna.Framework', 'Vector4'),
            Rectangle: new NativeClass('Microsoft.Xna.Framework', 'Rectangle'),
            Point: new NativeClass('Microsoft.Xna.Framework', 'Point'),
            Matrix: new NativeClass('Microsoft.Xna.Framework', 'Matrix'),
            MathHelper: new NativeClass('Microsoft.Xna.Framework', 'MathHelper'),

            Graphics: {
                Texture2D: new NativeClass('Microsoft.Xna.Framework.Graphics', 'Texture2D'),
                Color: new NativeClass('Microsoft.Xna.Framework.Graphics', 'Color'),
                SpriteEffects: new NativeClass('Microsoft.Xna.Framework.Graphics', 'SpriteEffects'),
                SpriteBatch: new NativeClass('Microsoft.Xna.Framework.Graphics', 'SpriteBatch'),
                SpriteSortMode: new NativeClass('Microsoft.Xna.Framework.Graphics', 'SpriteSortMode'),
                BlendState: new NativeClass('Microsoft.Xna.Framework.Graphics', 'BlendState'),
                DepthStencilState: new NativeClass('Microsoft.Xna.Framework.Graphics', 'DepthStencilState'),
                SamplerState: new NativeClass('Microsoft.Xna.Framework.Graphics', 'SamplerState'),
                RasterizerState: new NativeClass('Microsoft.Xna.Framework.Graphics', 'RasterizerState')
            }
        }
    }
}

export const ReLogic = {
    Content: {
        Asset: new NativeClass('ReLogic.Content', 'Asset`1'),
        AssetRepository: new NativeClass('ReLogic.Content', 'AssetRepository'),
        AssetState: new NativeClass('ReLogic.Content', 'AssetState'),
        AssetRequestMode: new NativeClass('ReLogic.Content', 'AssetRequestMode'),
        AssetReaderCollection: new NativeClass('ReLogic.Content', 'AssetReaderCollection')
    }
}

export const System = {
    Nullable: new NativeClass('System', 'Nullable`1'),
    Enum: new NativeClass('System', 'Enum'),
    Boolean: new NativeClass('System', 'Boolean'),
    Byte: new NativeClass('System', 'Byte'),
    Int16: new NativeClass('System', 'Int16'),
    UInt16: new NativeClass('System', 'UInt16'),
    Int32: new NativeClass('System', 'Int32'),
    Int64: new NativeClass('System', 'Int64'),
    Single: new NativeClass('System', 'Single'),
    String: new NativeClass('System', 'String'),
    
    Convert: new NativeClass('System', 'Convert'),
    Math: new NativeClass('System', 'Math'),
    DateTime: new NativeClass('System', 'DateTime'),
    Array: new NativeClass('System', 'Array'),
    
    Collections: {
        Generic: {
            Dictionary: new NativeClass('System.Collections.Generic', 'Dictionary`2'),
            List: new NativeClass('System.Collections.Generic', 'List`1')
        }
    },
    
    IO: {
        File: new NativeClass('System.IO', 'File'),
        FileSystem: new NativeClass('System.IO', 'FileSystem'),
        Directory: new NativeClass('System.IO', 'Directory'),
        
        Path: new NativeClass('System.IO', 'Path'),
        
        BinaryWriter: new NativeClass('System.IO', 'BinaryWriter'),
        BinaryReader: new NativeClass('System.IO', 'BinaryReader'),
        
        Stream: new NativeClass('System.IO', 'Stream'),
        MemoryStream: new NativeClass('System.IO', 'MemoryStream'),
        
        SeekOrigin: new NativeClass('System.IO', 'SeekOrigin'),
        
        Compression: {
            CompressionMode: new NativeClass('System.IO.Compression', 'CompressionMode'),
            DeflateStream: new NativeClass('System.IO.Compression', 'DeflateStream')
        }
    }
}