import { ModHair } from './../TL/ModHair.js';

import { ExampleHair } from './../Content/Hairs/ExampleHair.js';

export function RegisterHairs() {
    ModHair.register(ExampleHair);
}