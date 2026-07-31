import { ModMenu } from './../TL/ModMenu.js';

import { ExampleMenu } from './../Content/Menus/ExampleMenu.js';

export function RegisterMenus() {
    ModMenu.register(ExampleMenu);
}