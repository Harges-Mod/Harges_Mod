import { ModSystem } from './../TL/ModSystem.js';

import { ExampleRecipes } from './../Content/Global/ExampleRecipes.js';


import { HargesUILoader } from '../Content/System/HargesUILoader.js';



export function RegisterSystems() {
    // ModSystem.register(ExampleRecipes);
     ModSystem.register(HargesUILoader);
}