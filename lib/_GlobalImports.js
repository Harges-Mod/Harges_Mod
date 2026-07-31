import { Modules, Terraria, Microsoft, ReLogic, System } from "../TL/ModImports.js";

import { GlobalHooks } from "../TL/GlobalHooks.js";
import { GlobalItem } from "../TL/GlobalItem.js";
import { GlobalLoot } from "../TL/GlobalLoot.js";
import { GlobalNPC } from "../TL/GlobalNPC.js";
import { GlobalProjectile } from "../TL/GlobalProjectile.js";
import { GlobalTile } from "../TL/GlobalTile.js";
import { ModAchievement } from "../TL/ModAchievement.js";
import { ModAsset } from "../TL/ModAsset.js";
// import { ModBackgrounds } from "../TL/ModBackgrounds.js";
import { ModBiome } from "../TL/ModBiome.js";
import { ModBuff } from "../TL/ModBuff.js";
import { ModCloud } from "../TL/ModCloud.js";
import { ModGore } from "../TL/ModGore.js";
import { ModHair } from "../TL/ModHair.js";
// import { ModHooks } from "../TL/ModHooks.js";
import { ModItem } from "../TL/ModItem.js";
import { ModLocalization } from "../TL/ModLocalization.js";
import { ModMenu } from "../TL/ModMenu.js";
import { ModMount } from "../TL/ModMount.js";
import { ModNPC } from "../TL/ModNPC.js";
import { ModPlayer } from "../TL/ModPlayer.js";
import { ModProjectile } from "../TL/ModProjectile.js";
import { ModRecipe } from "../TL/ModRecipe.js";
import { ModSystem } from "../TL/ModSystem.js";
import { ModTexture } from "../TL/ModTexture.js";
import { ModTexturedType } from "../TL/ModTexturedType.js";
import { NPCHappiness, AffectionLevel } from "../TL/NPCHappiness.js";
import { NPCLoot } from "../TL/NPCLoot.js";
import { NPCShop } from "../TL/NPCShop.js";
import { NPCSpawnInfo } from "../TL/NPCSpawnInfo.js";
import { PlayerDB } from "../TL/PlayerDB.js";
import { ProjAI } from "../TL/ProjAI.js";
import { SceneEffectPriority } from "../TL/SceneEffectPriority.js";
import { Subworld } from "../TL/Subworld.js";
import { WorldDB } from "../TL/WorldDB.js";
//import { ModBossBar } from "../TL/ModBossBar.js";
import { Generic } from '../TL/Modules/Harges/Generic.js'

const GlobalImports = {
    Modules, Terraria, Microsoft, ReLogic, System,
    GlobalHooks, GlobalItem, GlobalLoot, GlobalNPC, GlobalProjectile, GlobalTile,
    ModAchievement, ModAsset, ModBiome, ModBuff, ModCloud,
    ModGore, ModHair, ModItem, ModLocalization, ModMenu,
    ModMount, ModNPC, ModPlayer, ModProjectile, ModRecipe, ModSystem,
    ModTexture, ModTexturedType, NPCHappiness, NPCLoot, NPCShop, NPCSpawnInfo,
    PlayerDB, ProjAI, SceneEffectPriority, Subworld, WorldDB, AffectionLevel, Generic
};


globalThis.GlobalImports = GlobalImports;
globalThis.GlobalImports.AllModules = function () {
    Object.assign(globalThis, Modules);
    Object.assign(globalThis, Modules.Utils);
};


Object.assign(globalThis, GlobalImports);
