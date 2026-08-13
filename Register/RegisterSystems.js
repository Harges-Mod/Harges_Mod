import { ModSystem } from './../TL/ModSystem.js';
import { SystemLoader } from './../TL/Loaders/SystemLoader.js';

import { ExampleRecipes } from './../Content/Global/ExampleRecipes.js';

import { Harges } from '../Core/Harges.js';
import { HargesUILoader } from '../Content/System/HargesUILoader.js';

export function RegisterSystems() {
     ModSystem.register(Harges)
     ModSystem.register(HargesUILoader);
}