import { ModMount } from './../TL/ModMount.js';

import { ExampleMinecartMount } from './../Content/Mounts/ExampleMinecartMount.js';
import { ExampleMount } from './../Content/Mounts/ExampleMount.js';

export function RegisterMounts() {
    ModMount.register(ExampleMinecartMount);
    ModMount.register(ExampleMount);
}