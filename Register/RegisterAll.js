import { ModSystem } from './../TL/ModSystem.js';
import { ModLoader } from './../TL/Core/ModLoader.js';

import { RegisterSystems } from './RegisterSystems.js';
import { RegisterBiomes } from './RegisterBiomes.js';
import { RegisterBuffs } from './RegisterBuffs.js';
import { RegisterNPCs } from './RegisterNPCs.js';
import { RegisterItems } from './RegisterItems.js';
import { RegisterProjectiles } from './RegisterProjectiles.js';
import { RegisterClouds } from './RegisterClouds.js';
import { RegisterBackgrounds } from './RegisterBackgrounds.js';
import { RegisterMenus } from './RegisterMenus.js';
import { RegisterSubworlds } from './RegisterSubworlds.js';
import { RegisterHairs } from './RegisterHairs.js';
import { RegisterMounts } from './RegisterMounts.js';
import { RegisterAchievements } from './RegisterAchievements.js';
import { RegisterGlobal } from './RegisterGlobal.js';

// Register all mod content
export function RegisterAll() {
    // This is the mod's main system
    ModSystem.register(ModLoader);
    
    // Here you register your other systems
    RegisterSystems();
    
    // And then the mod content, don't change the registration order
   // RegisterBackgrounds(); // 1
    //RegisterBiomes(); // 2
    RegisterBuffs(); // 3
    RegisterNPCs(); // 4
    RegisterProjectiles(); // 5
    RegisterItems(); // 6
    //RegisterClouds(); // 7
    //RegisterMenus(); // 8
    //RegisterSubworlds(); // 9
    //RegisterHairs(); // 10
   // RegisterMounts(); // 11
    RegisterAchievements(); // 12
    
    // Finally, register the global content
    RegisterGlobal();
}