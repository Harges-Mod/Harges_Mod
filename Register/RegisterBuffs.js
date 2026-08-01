import { ModBuff } from './../TL/ModBuff.js';

import { RubyFlame } from './../Content/Buffs/Debuffs/RubyFlame.js';

import { EocCurse } from './../Content/Buffs/Debuffs/EocCurse.js';


import { BloodAbstinence } from './../Content/Buffs/Debuffs/BloodAbstinence.js';


export function RegisterBuffs() {
    ModBuff.register(RubyFlame)
    ModBuff.register(EocCurse)
    ModBuff.register(BloodAbstinence)
}