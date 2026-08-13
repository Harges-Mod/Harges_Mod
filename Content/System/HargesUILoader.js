import { DifficultyUI } from './UI/DifficultyUI.js'
import { TarotUI } from './UI/TarotUI.js'

export class HargesUILoader extends ModSystem {
    static UIs = Harges.System.Memory.Create('UIs');
    
    SetupContent() {
    	HargesUILoader.UIs.Call('AutoLoadContent');
        HargesUILoader.UIs.Call('Content');
    }

    PostDrawInterface() {
        HargesUILoader.UIs.Call('UpdateAndDraw');
    }
}

HargesUILoader.UIs.Add(new DifficultyUI());
// HargesUILoader.UIs.Add(new TarotUI());
