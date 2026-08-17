import { BaseUI } from './BaseUI.js';

import {
    SlotsConfig,
    SlotGridManager,
    TarotBagButton
} from './Buttons/TarotSlotButton.js';

export class TarotUI extends BaseUI {

    constructor() {
        super();

        const inventorySpacingX = 26;
        const inventorySpacingY = 26;

        const equipSpacingX = 36;
        const equipSpacingY = 36;

        // ==========================================
        // INVENTÁRIO
        // 22 SLOTS
        //
        // 6 colunas × 4 linhas
        //
        // 01 02 03 04 05 06
        // 07 08 09 10 11 12
        // 13 14 15 16 17 18
        // 19 20 21 22
        // ==========================================

        const inventoryConfig = new SlotsConfig(
            0,
            40,
            6,
            4,
            inventorySpacingX,
            inventorySpacingY,
            22
        );

        this.inventory = new SlotGridManager(
            inventoryConfig,
            'Textures/UI/Slots.png',
            0.72
        );

        this.inventory.slots.forEach(slot => {
            this.AddButton(slot);
        });

        // ==========================================
        // SLOTS DE EQUIPAMENTO
        // ==========================================

        const equipConfig = new SlotsConfig(
            0,
            205,
            3,
            1,
            equipSpacingX,
            equipSpacingY,
            3
        );

        this.equipInventory = new SlotGridManager(
            equipConfig,
            'Textures/UI/Slots.png',
            1.0
        );

        this.equipInventory.slots.forEach(slot => {
            this.AddButton(slot);
        });

        // ==========================================
        // BAG
        // ==========================================

        this.bagButton = new TarotBagButton(
            357,
            50,
            'Textures/UI/Bag.png',
            [
                this.inventory,
                this.equipInventory
            ]
        );

        this.AddButton(this.bagButton);

        // ==========================================
        // RESOLUÇÃO
        // ==========================================

        this.lastScreenWidth = 0;
        this.lastScreenHeight = 0;
    }

    Content() {
    }

    UpdateAndDraw() {

        // ==========================================
        // RECALCULAR POSIÇÕES
        // QUANDO A RESOLUÇÃO MUDAR
        // ==========================================

        if (
            Main.screenWidth !== this.lastScreenWidth ||
            Main.screenHeight !== this.lastScreenHeight
        ) {

            this.lastScreenWidth = Main.screenWidth;
            this.lastScreenHeight = Main.screenHeight;

            const scale = Harges.Math.getScreenScale();
            const virtualWidth = Main.screenWidth / scale;

            // ==========================================
            // INVENTÁRIO
            // ==========================================

            const inventoryColumns =
                this.inventory.config.columns;

            const inventoryWidth =
                (inventoryColumns - 1) *
                this.inventory.config.spacingX;

            this.inventory.config.startX =
                (virtualWidth - inventoryWidth) / 2;

            this.inventory.slots.forEach((slot, i) => {

                const pos =
                    this.inventory.config
                        .getPositionForIndex(i);

                slot.positionX = pos.x;
                slot.positionY = pos.y;
            });

            // ==========================================
            // EQUIPAMENTO
            // ==========================================

            const equipColumns =
                this.equipInventory.config.columns;

            const equipWidth =
                (equipColumns - 1) *
                this.equipInventory.config.spacingX;

            this.equipInventory.config.startX =
                (virtualWidth - equipWidth) / 2;

            this.equipInventory.slots.forEach((slot, i) => {

                const pos =
                    this.equipInventory.config
                        .getPositionForIndex(i);

                slot.positionX = pos.x;
                slot.positionY = pos.y;
            });
        }

        // ==========================================
        // UPDATE
        // ==========================================

        this.CallButton('Update');

        // ==========================================
        // DRAW
        // ==========================================

        this.CallButton('draw');
    }
}