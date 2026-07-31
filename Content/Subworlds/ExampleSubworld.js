import { Terraria } from './../../TL/ModImports.js';
import { Subworld } from './../../TL/Subworld.js';

export class ExampleSubworld extends Subworld {
    constructor() {
        super();
        this.WorldFilePath = 'Subworlds/' + this.constructor.name + '.wld';
    }
    
    OnEnter(player) {
        
    }
    
    OnLeave(player) {
        
    }
}