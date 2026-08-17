using(
    "Microsoft.Xna.Framework.Graphics",
    "Terraria",
    "Terraria.GameContent"
);

const { Main } = Terraria;
const { Vector2, Color } = Modules;

import { BaseUI } from '../BaseUI.js';
import {
    TarotBagButton,
    TarotSlotButton
} from './Slots.js';
import { TarotInventory } from './Inventory.js';

export class TarotUI extends BaseUI {
    constructor() {
        super();

        this.AddButton(
            new TarotSlotButton(
                120,
                50,
                'Textures/UI/Slots.png'
            )
        );

        this.AddButton(
            new TarotSlotButton(
                120,
                50,
                'Textures/UI/Slots.png'
            )
        );

        this.AddButton(
            new TarotSlotButton(
                120,
                50,
                'Textures/UI/Slots.png'
            )
        );

        this.AddButton(TarotBagButton.instance);

        this.inventory = TarotInventory.instance;
        this.inventory.setPosition(0, 0);
    }

    Content() {
        TarotBagButton.instance.AutoLoad();
        
        TarotSlotButton.Slots.forEach(slot => {
            slot.AutoLoad();
        });

        TarotSlotButton.toggleButton?.AutoLoad();
    }

    UpdateAndDraw() {
        this.CallButton('Update');

        this.inventory.update();

        if (
            TarotBagButton.instance.State ===
            TarotBagButton.instance.Mode.Enabled
        ) {
            this.inventory.calculatePosition();
            this.inventory.drawBackground();
            this.inventory.draw();
        }

        this.CallButton('draw');
    }
}