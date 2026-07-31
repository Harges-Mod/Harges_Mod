import { ModCloud } from './../../TL/ModCloud.js';

export class ExampleCloud extends ModCloud {
    constructor() {
        super();
        this.Texture = 'Clouds/' + this.constructor.name;
    }
}