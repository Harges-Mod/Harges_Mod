import { SupremeRuby } from '../Content/Items/Accessories/MMode/SupremeRuby.js'

import { GoldShuriken } from '../Content/Items/Weapons/Ranged/GoldShuriken.js'

import { PlatinumShuriken } from '../Content/Items/Weapons/Ranged/PlatinumShuriken.js'

import { CarminSikle, CorruptionSikle } from '../Content/Items/Weapons/Melee/PreHardModeSikles.js'


import { AriesCry } from '../Content/Items/AriesCry.js'

import { BloodyCover } from '../Content/Items/Accessories/MMode/BloodyCover.js'


export function RegisterItems() {
    ModItem.register(SupremeRuby)
    ModItem.register(GoldShuriken)
    ModItem.register(PlatinumShuriken)
    ModItem.register(AriesCry)
    ModItem.register(BloodyCover)
    
    ModItem.register(CarminSikle)
    ModItem.register(CorruptionSikle)
    
}