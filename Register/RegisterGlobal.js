import { ModPlayer } from './../TL/ModPlayer.js';
import { GlobalNPC } from './../TL/GlobalNPC.js';
import { GlobalItem } from './../TL/GlobalItem.js';
import { GlobalLoot } from './../TL/GlobalLoot.js';
import { GlobalTile } from './../TL/GlobalTile.js';
import { GlobalHooks } from './../TL/GlobalHooks.js';
import { GlobalProjectile } from './../TL/GlobalProjectile.js';

import { gHooks } from './../Content/Global/gHooks.js';
import { gPlayer } from './../Content/Global/gPlayer.js';
import { ExampleDashPlayer } from './../Content/Global/ExampleDashPlayer.js';
import { ExampleLoot } from './../Content/Global/ExampleLoot.js';


import { EnvironmentalEffects } from './../Content/Player/EnvironmentalEffects.js';

import SlimeKing from '../Content/NPCs/Vanilla/Bosses/KingSlime/AI.js'

import Eoc from '../Content/NPCs/Vanilla/Bosses/Eoc/AI.js'


import { SlimesOverride } from './../Content/NPCs/Global/SlimesOverride.js'

import { VanillaLoot } from './../Content/NPCs/Vanilla/VanillaLoot.js'

import { MModeGlobalNPC } from './../Content/NPCs/MModeGlobalNPC.js'



import { HargesMMode } from './../Content/Player/HargesMMode.js';
import { HargesMModeProj } from './../Content/Player/HargesMMode.js';


export function RegisterGlobal() {
    ModPlayer.register(HargesMMode)
    GlobalProjectile.register(HargesMModeProj)
    
    ModPlayer.register(EnvironmentalEffects)
    
    GlobalNPC.register(MModeGlobalNPC)
    GlobalNPC.register(SlimeKing)
    GlobalNPC.register(Eoc)
    GlobalLoot.register(VanillaLoot)
    GlobalNPC.register(SlimesOverride)
}