import { ModCloud } from './../TL/ModCloud.js';

import { ExampleCloud } from './../Content/Clouds/ExampleCloud.js';
import { ExampleAdvancedCloud } from './../Content/Clouds/ExampleAdvancedCloud.js';

export function RegisterClouds() {
    ModCloud.register(ExampleCloud);
    ModCloud.register(ExampleAdvancedCloud);
}