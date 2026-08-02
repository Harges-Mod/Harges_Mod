using('Terraria');

import { HargesGraphics } from './Graphics/HargesGraphics.js';
import { HargesUtils } from './Utils/HargesUtils.js';

export class Harges {  
    static Graphics = new HargesGraphics();
    static Utils = new HargesUtils();
}

globalThis.Harges = Harges;