import { BaseButton } from './Buttons/BaseButton.js'; 
import { BaseUI } from './BaseUI.js'
import { TarotSlotButton, TarotBagButton } from './Buttons/TarotSlotButton.js'

export class TarotUI extends BaseUI {
    constructor() {
    	super()
    	
    	this.AddButton(new TarotSlotButton(120, 50, 'Textures/UI/Slots.png'))
    	
    	this.AddButton(new TarotSlotButton(120, 50, 'Textures/UI/Slots.png'))
    	
    	this.AddButton(new TarotSlotButton(120, 50, 'Textures/UI/Slots.png'))
    	
    	this.AddButton(TarotBagButton.instance);	
    
    }
    
    Content() {
    }
    
    UpdateAndDraw() {
    	this.CallButton('draw')
    }
}