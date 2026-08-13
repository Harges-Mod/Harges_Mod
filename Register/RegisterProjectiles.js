import { ModProjectile } from './../TL/ModProjectile.js';

import { SlimeRubyLaser } from './../Content/Projectiles/SlimeRubyLaser.js';

import { SupremeRubyLaser } from './../Content/Projectiles/SupremeRubyLaser.js';


import { EocArena } from '../Content/NPCs/Vanilla/Bosses/Eoc/EocArena.js'

import { BloodScythe } from '../Content/NPCs/Vanilla/Bosses/Eoc/BloodScythe.js'

// import { EocLightning } from '../Content/NPCs/Vanilla/Bosses/Eoc/EocLightning.js'
	
import { GoldShurikenProj } from '../Content/Projectiles/Weapons/Ranged/GoldShurikenProj.js'

import { PlatinumShurikenProj } from '../Content/Projectiles/Weapons/Ranged/PlatinumShurikenProj.js'

import { CarminSikleProj, CorruptionSikleProj } from '../Content/Projectiles/Weapons/Melee/PreHardModeSiklesProj.js'
import { BloodOrb } from '../Content/Projectiles/BloodOrb.js'

export function RegisterProjectiles() {
    
    ModProjectile.register(SlimeRubyLaser);
    ModProjectile.register(SupremeRubyLaser);
    
    // ModProjectile.register(EocLightning);
    
    ModProjectile.register(EocArena);
    ModProjectile.register(BloodScythe);
    ModProjectile.register(GoldShurikenProj);
    ModProjectile.register(PlatinumShurikenProj);
    
    ModProjectile.register(BloodOrb);
    ModProjectile.register(CarminSikleProj);
    ModProjectile.register(CorruptionSikleProj);
   
}
