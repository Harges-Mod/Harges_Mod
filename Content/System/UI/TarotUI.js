import { BaseUI } from './BaseUI.js';

import {
    TarotBagButton,
    TarotSlotButton
} from './Buttons/Tarot/Slots.js';

import {
    TarotInventory
} from './Buttons/Tarot/Inventory.js';

export class TarotUI
    extends BaseUI {

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

        this.AddButton(
            TarotBagButton.instance
        );

        this.inventory =
            TarotInventory.instance;
    }

    Content() {
        /*
         * BaseButton já carrega
         * automaticamente.
         */
    }

    UpdateAndDraw() {

        /*
         * 1. INPUT DOS BUTTONS PRINCIPAIS
         */
        this.CallButton(
            'Update'
        );


        /*
         * 2. INVENTORY
         *
         * Os botões internos do Inventory
         * usam o mesmo BaseButton.
         */
        if (
            TarotBagButton.instance.isOpen()
        ) {
            this.inventory.update();
        }


        /*
         * 3. BACKGROUND
         *
         * Tem que ser desenhado antes
         * dos elementos da UI.
         */
        if (
            TarotBagButton.instance.isOpen()
        ) {
            this.inventory.drawBackground();
        }


        /*
         * 4. BUTTONS PRINCIPAIS
         */
        this.CallButton(
            'draw'
        );


        /*
         * 5. INVENTORY
         */
        if (
            TarotBagButton.instance.isOpen()
        ) {
            this.inventory.draw();
        }
    }
}