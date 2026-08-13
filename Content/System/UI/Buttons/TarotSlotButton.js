using("Microsoft.Xna.Framework");

const { Vector2 } = Modules;
import { BaseButton } from './BaseButton.js';

export class TarotBagButton extends BaseButton {
    static instance = new TarotBagButton(390 - 14 + 1, 50, 'Textures/UI/Bag.png');

    constructor(x = 390 - 14 + 1, y = 50, texturePath = 'Textures/UI/Bag.png') {
        super(x, y, texturePath);
        
        this.State = this.Mode.Disabled;
    }

    Mode = {
        Disabled: 0,
        Enabled: 1
    }

    UpdateState() {
        this.State = (this.State === this.Mode.Disabled) ? this.Mode.Enabled : this.Mode.Disabled;
        
        // uMain.hideUI = (this.State === this.Mode.Enabled);	

    }

    onClick() {
        this.UpdateState();
    }

    Update() {
        // Calcula a posição considerando a escala/resolução da tela
        const pos = Harges.Math ? Harges.Math.getCalculatedPosition(this.positionX, this.positionY) : Vector2.new(this.positionX, this.positionY);
        
        this.UpdateHoverState(pos);
        this.checkInteraction();
    }

	draw() {
	        if (!this.preDraw()) return;
	        
	        const pos = Harges.Math ? Harges.Math.getCalculatedPosition(this.positionX, this.positionY) : Vector2.new(this.positionX, this.positionY);
	        this.drawSprite(pos, 1.0, 0.05);
    }
}

export class TarotDragButton extends BaseButton {
    constructor() {
        super(0, 0, "Textures/UI/TarotLock.png");
        this.isLocked = true;
    }

    updatePosition(parentDrawPos, parentWidth, parentHeight) {
        this.positionX = parentDrawPos.X + (parentWidth / 2) - 6;
        this.positionY = parentDrawPos.Y - (parentHeight / 2) + 6;
    }
    
    Update() {
        const pos = Vector2.new(this.positionX, this.positionY);
        this.UpdateHoverState(pos);
        this.checkInteraction();
    }
    
    onClick() {
        this.isLocked = !this.isLocked;
        
        const allowDrag = !this.isLocked;
        TarotSlotButton.Slots.forEach(slot => {
            slot.isDraggable = allowDrag;
        });

        const newTexture = this.isLocked ? "Textures/UI/TarotLock.png" : this.texturePath;
        this.AutoLoad(newTexture);
    }

    draw() {
        if (!this.preDraw()) return;
        const pos = Vector2.new(this.positionX, this.positionY);
        this.drawSprite(pos, 1.0, 0.05);
    }
}

export class TarotSlotButton extends BaseButton {
    static Slots = [];
    static toggleButton = null;

    constructor(positionX, positionY, texturePath = null) {
        super(positionX, positionY, texturePath);
       
        TarotSlotButton.Slots.push(this);

        if (!TarotSlotButton.toggleButton) {
            TarotSlotButton.toggleButton = new TarotDragButton();
        }
    }

    Update() {
    
    
        const index = TarotSlotButton.Slots.indexOf(this);
        const offsetStepX = 60; 
        const offsetX = index * offsetStepX;

        const calculatedPos = Harges.Math.getCalculatedPosition(
            this.positionX + offsetX, 
            this.positionY
        );

        this.UpdateHoverState(calculatedPos);
        this.checkInteraction();
        
        const isLastSlot = index === TarotSlotButton.Slots.length - 1;
        if (isLastSlot && TarotSlotButton.toggleButton) {
            TarotSlotButton.toggleButton.Update();
        }
        // this.processTouchCooldown();
    }
    
    onClick() {
    	console.log('Clicando')
    }
    
    draw() {
    
        const index = TarotSlotButton.Slots.indexOf(this);
        const totalSlots = TarotSlotButton.Slots.length;
        
        const offsetStepX = 60; 
        const offsetX = index * offsetStepX;

        const calculatedPos = Harges.Math.getCalculatedPosition(
            this.positionX + offsetX, 
            this.positionY
        );

        this.drawSprite(calculatedPos, 1.0, 0.1);

        const isLastSlot = index === totalSlots - 1;
        if (isLastSlot && TarotSlotButton.toggleButton && this.texture) {
            const scale = Harges.Math.getScreenScale();
            const width = this.texture.Width * scale;
            const height = this.texture.Height * scale;

            TarotSlotButton.toggleButton.updatePosition(calculatedPos, width, height);
            TarotSlotButton.toggleButton.draw();
        }
    }
}
