import { Subworld } from './../TL/Subworld.js';

import { ExampleSubworld } from './../Content/Subworlds/ExampleSubworld.js';

export function RegisterSubworlds() {
    Subworld.register(ExampleSubworld);
}