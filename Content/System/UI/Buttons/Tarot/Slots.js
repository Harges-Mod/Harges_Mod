using(
    "Microsoft.Xna.Framework",
    "Microsoft.Xna.Framework.Graphics",
    "Terraria"
);

const { Main } = Terraria;

import { BaseButton }
    from '../BaseButton.js';

export class TarotSlotButton
    extends BaseButton {

    static Slots = [];

    static spacing = 48;
    static yOffset = 65;

    constructor(
        x = 120,
        y = 50,
        texturePath =
            'Textures/UI/Slots.png'
    ) {
        super(
            x,
            y,
            texturePath
        );

        this.itemType = 0;
        this.isDraggable = false;

        TarotSlotButton.Slots.push(
            this
        );
    }

    getIndex() {
        return TarotSlotButton.Slots.indexOf(
            this
        );
    }

    getItemType() {
        return this.itemType;
    }

    setItemType(type) {
        this.itemType =
            type > 0
                ? type
                : 0;
    }

    clearItem() {
        this.itemType = 0;
    }

    hasItem() {
        return this.itemType > 0;
    }

    static addType(type) {
        if (type <= 0)
            return false;

        for (
            let i = 0;
            i < TarotSlotButton.Slots.length;
            i++
        ) {
            if (
                TarotSlotButton.Slots[i]
                    .itemType === type
            ) {
                return false;
            }
        }

        for (
            let i = 0;
            i < TarotSlotButton.Slots.length;
            i++
        ) {
            const slot =
                TarotSlotButton.Slots[i];

            if (!slot.hasItem()) {
                slot.setItemType(type);
                return true;
            }
        }

        return false;
    }

    static removeType(type) {
        for (
            let i =
                TarotSlotButton.Slots.length - 1;
            i >= 0;
            i--
        ) {
            const slot =
                TarotSlotButton.Slots[i];

            if (
                slot.itemType === type
            ) {
                slot.clearItem();
                return true;
            }
        }

        return false;
    }

    static hasType(type) {
        for (
            let i = 0;
            i < TarotSlotButton.Slots.length;
            i++
        ) {
            if (
                TarotSlotButton.Slots[i]
                    .itemType === type
            ) {
                return true;
            }
        }

        return false;
    }

    static removeLast() {
        for (
            let i =
                TarotSlotButton.Slots.length - 1;
            i >= 0;
            i--
        ) {
            if (
                TarotSlotButton.Slots[i]
                    .hasItem()
            ) {
                TarotSlotButton.Slots[i]
                    .clearItem();

                return true;
            }
        }

        return false;
    }

    static getType(index) {
        const slot =
            TarotSlotButton.Slots[index];

        return slot
            ? slot.itemType
            : 0;
    }

    static getTypes() {
        return TarotSlotButton.Slots.map(
            slot => slot.itemType
        );
    }

    static setType(index, type) {
        const slot =
            TarotSlotButton.Slots[index];

        if (slot)
            slot.setItemType(type);
    }

    static clear(index) {
        const slot =
            TarotSlotButton.Slots[index];

        if (slot)
            slot.clearItem();
    }

    static getCenterX() {
        const scale =
            Harges.Math.getScreenScale();

        return (
            Main.screenWidth /
            scale /
            2
        );
    }

    static getCenterY() {
        const scale =
            Harges.Math.getScreenScale();

        return (
            Main.screenHeight /
            scale /
            2
        ) +
        TarotSlotButton.yOffset;
    }

    calculatePosition() {
        const index =
            this.getIndex();

        const total =
            TarotSlotButton.Slots.length;

        if (
            index < 0 ||
            total <= 0
        )
            return;

        const totalWidth =
            (total - 1) *
            TarotSlotButton.spacing;

        this.positionX =
            TarotSlotButton.getCenterX() -
            totalWidth / 2 +
            index *
            TarotSlotButton.spacing;

        this.positionY =
            TarotSlotButton.getCenterY();
    }

    Update() {
        if (
            !TarotBagButton.instance.isOpen()
        )
            return;

        this.calculatePosition();

        const position =
            Harges.Math.getCalculatedPosition(
                this.positionX,
                this.positionY
            );

        this.UpdateHoverState(
            position
        );

        this.checkInteraction();
        this.processCooldown();
    }

    onClick() {
        if (this.hasItem())
            this.clearItem();
    }

    draw() {
        if (
            !TarotBagButton.instance.isOpen()
        )
            return;

        if (!this.preDraw())
            return;

        this.calculatePosition();

        const position =
            Harges.Math.getCalculatedPosition(
                this.positionX,
                this.positionY
            );

        this.drawSprite(
            position,
            {
                alpha: 1.0
            }
        );
    }

    getIndexItem() {
        return this.getIndex();
    }
}


export class TarotBagButton
    extends BaseButton {

    static instance =
        new TarotBagButton(
            390 - 14 + 1,
            50,
            'Textures/UI/Bag.png'
        );

    constructor(
        x = 390 - 14 + 1,
        y = 50,
        texturePath =
            'Textures/UI/Bag.png'
    ) {
        super(
            x,
            y,
            texturePath
        );

        this.isDraggable = false;
        this.isOpenState = false;
    }

    onClick() {
        this.toggle();
    }

    toggle() {
        this.isOpenState =
            !this.isOpenState;
    }

    isOpen() {
        return this.isOpenState;
    }

    draw() {
        if (!this.preDraw())
            return;

        const position =
            Harges.Math.getCalculatedPosition(
                this.positionX,
                this.positionY
            );

        this.drawSprite(
            position,
            {
                alpha: 1.0
            }
        );
    }
}