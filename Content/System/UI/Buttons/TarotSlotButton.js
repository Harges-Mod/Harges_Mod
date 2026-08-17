using("Microsoft.Xna.Framework");

const { Vector2 } = Modules;

import { BaseButton } from './BaseButton.js';

// ==========================================
// 1. CONFIGURAÇÃO DE GRID DE SLOTS
// ==========================================

export class SlotsConfig {

    constructor(
        startX,
        startY,
        columns,
        rows,
        spacingX = 60,
        spacingY = 60,
        totalSlots = null
    ) {
        this.startX = startX;
        this.startY = startY;

        this.columns = columns;
        this.rows = rows;

        this.spacingX = spacingX;
        this.spacingY = spacingY;

        // Quantidade real de slots.
        //
        // Se for null:
        // columns × rows
        //
        // Se definido:
        // usa exatamente essa quantidade.

        this.totalSlots = totalSlots;
    }

    getPositionForIndex(index) {

        const col = index % this.columns;
        const row = Math.floor(index / this.columns);

        return {
            x: this.startX +
                (col * this.spacingX),

            y: this.startY +
                (row * this.spacingY)
        };
    }
}


// ==========================================
// 2. COMPONENTE DE SLOT INDIVIDUAL
// ==========================================

export class TarotSlotButton extends BaseButton {

    constructor(
        index,
        positionX,
        positionY,
        texturePath = 'Textures/UI/Slots.png'
    ) {

        super(
            positionX,
            positionY,
            texturePath
        );

        this.index = index;

        // ==========================================
        // ITEM
        // ==========================================

        this.itemType = null;
        this.itemData = null;

        // ==========================================
        // VISIBILIDADE
        // ==========================================

        this.isVisible = true;

        // ==========================================
        // SCALE
        // ==========================================

        this.scale = 1.0;

        this.baseScale = 1.0;

        this.popScale = 1.18;

        // ==========================================
        // APPEAR ANIMATION
        // ==========================================

        this.appearScale = 1.0;

        this.animationSpeed = 0.12;

        this.isAppearing = false;
    }

    // ==========================================
    // SCALE
    // ==========================================

    setScale(scale) {

        this.scale = scale;

        this.baseScale = scale;
    }

    // ==========================================
    // APARECER
    // ==========================================

    playAppear() {

        this.appearScale = 0.0;

        this.scale = 0.0;

        this.isAppearing = true;
    }

    // ==========================================
    // POP
    // ==========================================

    playPop() {

        this.scale = this.popScale;

        this.appearScale = 1.0;

        this.isAppearing = false;
    }

    // ==========================================
    // ANIMAÇÃO
    // ==========================================

    updateAnimation() {

        // Aparecendo
        if (this.isAppearing) {

            this.appearScale +=
                this.animationSpeed;

            if (this.appearScale >= 1.0) {

                this.appearScale = 1.0;

                this.isAppearing = false;
            }

            this.scale =
                this.baseScale *
                this.appearScale;

            return;
        }

        // Voltando do POP
        if (this.scale > this.baseScale) {

            this.scale -=
                this.animationSpeed;

            if (this.scale <= this.baseScale) {

                this.scale =
                    this.baseScale;
            }
        }
    }

    // ==========================================
    // ITEM
    // ==========================================

    setItem(type, data = null) {

        this.itemType = type;

        this.itemData = data;

        this.playPop();
    }

    clear() {

        this.itemType = null;

        this.itemData = null;
    }

    isEmpty() {

        return this.itemType === null;
    }

    // ==========================================
    // UPDATE
    // ==========================================

    Update() {

        if (!this.isVisible)
            return;

        const calculatedPos =
            Harges.Math.getCalculatedPosition(
                this.positionX,
                this.positionY
            );

        this.UpdateHoverState(
            calculatedPos
        );

        this.checkInteraction();

        this.processCooldown();

        this.updateAnimation();
    }

    // ==========================================
    // CLICK
    // ==========================================

    onClick() {

        this.playPop();

        console.log(
            `Clicou no Slot #${this.index} | Tipo: ${this.itemType}`
        );
    }

    // ==========================================
    // DRAW
    // ==========================================

    draw() {

        if (
            !this.isVisible ||
            !this.preDraw()
        )
            return;

        const calculatedPos =
            Harges.Math.getCalculatedPosition(
                this.positionX,
                this.positionY
            );

        this.drawSprite(
            calculatedPos,
            1.0,
            0.1
        );
    }
}


// ==========================================
// 3. GERENCIADOR DE GRID
// ==========================================

export class SlotGridManager {

    constructor(
        config,
        texturePath = 'Textures/UI/Slots.png',
        scale = 1.0
    ) {

        this.config = config;

        this.slots = [];

        this.isVisible = true;

        this.texturePath =
            texturePath;

        this.scale = scale;

        this.init();
    }

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    init() {

        // Se totalSlots foi definido,
        // usa ele.

        // Caso contrário,
        // columns × rows.

        const totalSlots =
            this.config.totalSlots !== null
                ? this.config.totalSlots
                : (
                    this.config.columns *
                    this.config.rows
                );

        for (
            let i = 0;
            i < totalSlots;
            i++
        ) {

            const pos =
                this.config
                    .getPositionForIndex(i);

            const slot =
                new TarotSlotButton(
                    i,
                    pos.x,
                    pos.y,
                    this.texturePath
                );

            slot.setScale(
                this.scale
            );

            this.slots.push(slot);
        }
    }

    // ==========================================
    // VISIBILIDADE
    // ==========================================

    setVisible(state) {

        if (
            this.isVisible === state
        )
            return;

        this.isVisible = state;

        this.slots.forEach(slot => {

            slot.isVisible =
                state;

            if (state) {

                slot.playAppear();
            }
        });
    }
}


// ==========================================
// 4. BOTÃO BAG
// ==========================================

export class TarotBagButton extends BaseButton {

    static instance = null;

    constructor(
        x = 377,
        y = 50,
        texturePath = 'Textures/UI/Bag.png',
        managedGrids = []
    ) {

        super(
            x,
            y,
            texturePath
        );

        this.managedGrids =
            managedGrids;

        this.isOpen = true;

        if (!TarotBagButton.instance) {

            TarotBagButton.instance =
                this;
        }
    }

    // ==========================================
    // CLICK
    // ==========================================

    onClick() {

        this.isOpen =
            !this.isOpen;

        this.managedGrids.forEach(
            grid => {

                grid.setVisible(
                    this.isOpen
                );
            }
        );
    }

    // ==========================================
    // DRAW
    // ==========================================

    draw() {

        if (!this.preDraw())
            return;

        const pos =
            Harges.Math
                ? Harges.Math.getCalculatedPosition(
                    this.positionX,
                    this.positionY
                )
                : Vector2.new(
                    this.positionX,
                    this.positionY
                );

        this.drawSprite(
            pos,
            1.0,
            0.05
        );
    }
}