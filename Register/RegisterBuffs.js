import { ModBuff } from './../TL/ModBuff.js';

import { ExampleDefenseBuff } from './../Content/Buffs/ExampleDefenseBuff.js'; 
import { ExampleDefenseDebuff } from './../Content/Buffs/ExampleDefenseDebuff.js';
import { ExamplePetBuff } from './../Content/Pets/ExamplePet/ExamplePetBuff.js';
import { ExampleLightPetBuff } from './../Content/Pets/ExampleLightPet/ExampleLightPetBuff.js';
import { ExampleMinionBuff } from './../Content/Buffs/ExampleMinionBuff.js';
import { ExampleMinecartBuff } from './../Content/Buffs/ExampleMinecartBuff.js';
import { ExampleMountBuff } from './../Content/Buffs/ExampleMountBuff.js';

import { RubyFlame } from './../Content/Buffs/Debuffs/RubyFlame.js';

import { EocCurse } from './../Content/Buffs/Debuffs/EocCurse.js';


export function RegisterBuffs() {
    ModBuff.register(RubyFlame)
    ModBuff.register(EocCurse)
}