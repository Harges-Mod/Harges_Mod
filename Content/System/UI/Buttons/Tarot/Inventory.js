using(
    "Microsoft.Xna.Framework",
    "Microsoft.Xna.Framework.Graphics",
    "Terraria",
    "Terraria.GameContent"
);

const { TextureAssets } =
    Terraria.GameContent;

const { Main } =
    Terraria;

const { Vector2, Color } =
    Modules;

import { BaseButton }
    from '../BaseButton.js';

import {
    TarotBagButton,
    TarotSlotButton
} from './Slots.js';

const Draw =
    Generic.EntityDraw;


class InventoryHitButton
    extends BaseButton {

    constructor(
        inventory,
        index,
        type
    ) {
        super(0, 0, null);

        this.inventory =
            inventory;

        this.index =
            index;

        this.type =
            type;
    }

    UpdateHoverState(position) {
        const scale =
            Harges.Math.getScreenScale();

        const size =
            this.type === 'slot'
                ? this.inventory.slotSize * scale
                : 14 * scale;

        const x =
            position.X -
            size / 2;

        const y =
            position.Y -
            size / 2;

        this.registerPickingRegion(
            x,
            y,
            size,
            size
        );

        const bounds =
            Microsoft.Xna.Framework.Rectangle.new();

        bounds.X =
            Math.round(x);

        bounds.Y =
            Math.round(y);

        bounds.Width =
            Math.round(size);

        bounds.Height =
            Math.round(size);

        this.isHovered =
            bounds[
                'bool Contains(int x, int y)'
            ](
                Math.round(Main.mouseX),
                Math.round(Main.mouseY)
            );

        return this.isHovered;
    }

    Update() {
        if (
            !this.inventory.isOpen()
        )
            return;

        const position =
            this.type === 'slot'
                ? this.inventory.getPosition(
                    this.index
                )
                : this.index < 0
                    ? this.inventory
                        .getPreviousPosition()
                    : this.inventory
                        .getNextPosition();

        this.UpdateHoverState(
            position
        );

        this.checkInteraction();
        this.processCooldown();
    }

    onClick() {
        if (this.type === 'slot') {
            this.inventory.clickItem(
                this.index
            );
            return;
        }

        if (this.index < 0) {
            this.inventory.previousPage();
        }
        else {
            this.inventory.nextPage();
        }
    }
}


export class TarotInventory {

    static instance =
        new TarotInventory();

    constructor() {
        this.columns = 5;
        this.rows = 5;

        this.slotSize = 18;
        this.spacing = 2;

        this.page = 0;

        this.positionX = 0;
        this.positionY = 0;

        this.items = [];

        this.slotButtons = [];

        for (
            let i = 0;
            i < 25;
            i++
        ) {
            this.slotButtons.push(
                new InventoryHitButton(
                    this,
                    i,
                    'slot'
                )
            );
        }

        this.previousButton =
            new InventoryHitButton(
                this,
                -1,
                'arrow'
            );

        this.nextButton =
            new InventoryHitButton(
                this,
                1,
                'arrow'
            );
    }

    getScale() {
        return Harges.Math.getScreenScale();
    }

    isOpen() {
        return TarotBagButton.instance.isOpen();
    }

    getPlayer() {
        return Main.player[0];
    }

    loadItems() {
        this.items.length = 0;

        const player =
            this.getPlayer();

        if (
            !player ||
            !player.inventory
        )
            return;

        for (
            let i = 0;
            i < player.inventory.length;
            i++
        ) {
            const item =
                player.inventory[i];

            if (
                item &&
                item.type > 0 &&
                item.stack > 0
            ) {
                this.items.push(item);
            }
        }

        const maxPage =
            this.getPageCount() - 1;

        if (this.page > maxPage)
            this.page = maxPage;

        if (this.page < 0)
            this.page = 0;
    }

    getPageItems() {
        return this.items.slice(
            this.page * 25,
            this.page * 25 + 25
        );
    }

    getPageCount() {
        return Math.max(
            1,
            Math.ceil(
                this.items.length / 25
            )
        );
    }

    getWidth() {
        return (
            this.columns *
            this.slotSize +
            (this.columns - 1) *
            this.spacing
        );
    }

    getHeight() {
        return (
            this.rows *
            this.slotSize +
            (this.rows - 1) *
            this.spacing
        );
    }

    calculatePosition() {
        const centerX =
            TarotSlotButton.getCenterX();

        const centerY =
            TarotSlotButton.getCenterY();

        this.positionX =
            centerX -
            this.getWidth() / 2;

        this.positionY =
            centerY -
            this.getHeight() -
            20;
    }

    getPosition(index) {
        const column =
            index % this.columns;

        const row =
            Math.floor(
                index / this.columns
            );

        return Harges.Math.getCalculatedPosition(
            this.positionX +
            column *
                (
                    this.slotSize +
                    this.spacing
                ),

            this.positionY +
            row *
                (
                    this.slotSize +
                    this.spacing
                )
        );
    }

    getPageButtonY() {
        return (
            this.positionY +
            this.getHeight() / 2
        );
    }

    getPreviousPosition() {
        return Harges.Math.getCalculatedPosition(
            this.positionX - 10,
            this.getPageButtonY()
        );
    }

    getNextPosition() {
        return Harges.Math.getCalculatedPosition(
            this.positionX +
            this.getWidth() +
            10,
            this.getPageButtonY()
        );
    }

    clickItem(index) {
        const items =
            this.getPageItems();

        const item =
            items[index];

        if (!item)
            return;

        const type =
            item.type;

		// Equiped
        if (
            TarotSlotButton.hasType(
                type
            )
        ) {
            TarotSlotButton.removeType(
                type
            );

            return;
        }

        // Not Equiped
        TarotSlotButton.addType(
            type
        );
    }

    previousPage() {
        if (this.page > 0)
            this.page--;
    }

    nextPage() {
        const maxPage =
            this.getPageCount() - 1;

        if (this.page < maxPage)
            this.page++;
    }

    update() {
        if (!this.isOpen())
            return;

        this.loadItems();
        this.calculatePosition();

        for (
            let i = 0;
            i < this.slotButtons.length;
            i++
        ) {
            this.slotButtons[i].Update();
        }

        this.previousButton.Update();
        this.nextButton.Update();
    }

    drawBackground() {
        if (!this.isOpen())
            return;

        const texture =
            TextureAssets.MagicPixel?.Value;

        if (!texture)
            return;

        Draw(
            texture,
            Vector2.new(
                Main.screenWidth / 2,
                Main.screenHeight / 2
            ),
            Generic.getRect(texture),
            Color.Black,
            0,
            Generic.getOrigin(texture),
            Vector2.new(
                Main.screenWidth,
                Main.screenHeight
            ),
            SpriteEffects.None
        );
    }

    drawItem(type, position) {
        if (type <= 0)
            return;

        const texture =
            TextureAssets.Item[type]?.Value;

        if (!texture)
            return;

        let rect =
            Generic.getRect(texture);

        try {
            const animation =
                Main.itemAnimations[type];

            if (animation) {
                rect =
                    texture.Frame(
                        1,
                        animation.FrameCount
                    );
            }
        }
        catch (_) {}

        if (
            rect.Width <= 0 ||
            rect.Height <= 0
        )
            return;

        const scale =
            this.getScale();

        const maxSize =
            14 * scale;

        const itemScale =
            Math.min(
                maxSize / rect.Width,
                maxSize / rect.Height
            );

        Draw(
            texture,
            position,
            rect,
            Color.White,
            0,
            Vector2.new(
                rect.Width / 2,
                rect.Height / 2
            ),
            Vector2.new(
                itemScale,
                itemScale
            ),
            SpriteEffects.None
        );
    }

    drawSlot(position, item) {
        const texture =
            TextureAssets.InventoryBack?.Value;

        if (!texture)
            return;

        const rect =
            Generic.getRect(texture);

        const scale =
            this.getScale() *
            (
                this.slotSize /
                rect.Width
            );

        Draw(
            texture,
            position,
            rect,
            Color.White,
            0,
            Generic.getOrigin(texture),
            Vector2.new(
                scale,
                scale
            ),
            SpriteEffects.None
        );

        if (item) {
            this.drawItem(
                item.type,
                position
            );
        }
    }

    drawLine(
        texture,
        a,
        b,
        color,
        thickness
    ) {
        const dx =
            b.X - a.X;

        const dy =
            b.Y - a.Y;

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (length <= 0)
            return;

        const angle =
            Math.atan2(
                dy,
                dx
            );

        Draw(
            texture,
            a,
            Generic.getRect(texture),
            color,
            angle,
            Vector2.new(0, 0.5),
            Vector2.new(
                length,
                thickness
            ),
            SpriteEffects.None
        );
    }

    drawArrow(
        position,
        right,
        disabled
    ) {
        const texture =
            TextureAssets.MagicPixel?.Value;

        if (!texture)
            return;

        const scale =
            this.getScale();

        const size =
            5 * scale;

        const color =
            disabled
                ? Color.Lerp(
                    Color.Transparent,
                    Color.White,
                    0.25
                )
                : Color.White;

        const direction =
            right ? -1 : 1;

        const top =
            Vector2.new(
                position.X +
                    direction * size,
                position.Y - size
            );

        const center =
            Vector2.new(
                position.X,
                position.Y
            );

        const bottom =
            Vector2.new(
                position.X +
                    direction * size,
                position.Y + size
            );

        this.drawLine(
            texture,
            top,
            center,
            color,
            scale
        );

        this.drawLine(
            texture,
            center,
            bottom,
            color,
            scale
        );
    }

    draw() {
        if (!this.isOpen())
            return;

        this.calculatePosition();

        const items =
            this.getPageItems();

        for (
            let i = 0;
            i < 25;
            i++
        ) {
            this.drawSlot(
                this.getPosition(i),
                items[i] || null
            );
        }

        this.drawArrow(
            this.getPreviousPosition(),
            false,
            this.page <= 0
        );

        this.drawArrow(
            this.getNextPosition(),
            true,
            this.page >=
                this.getPageCount() - 1
        );
    }

    reset() {
        this.page = 0;

        this.positionX = 0;
        this.positionY = 0;

        this.items.length = 0;

        for (
            let i = 0;
            i < this.slotButtons.length;
            i++
        ) {
            this.slotButtons[i].isHovered = false;
            this.slotButtons[i].isPressed = false;
            this.slotButtons[i].isTouched = false;
            this.slotButtons[i].wasMouseDown = false;
        }

        this.previousButton.isHovered = false;
        this.previousButton.isPressed = false;
        this.previousButton.isTouched = false;
        this.previousButton.wasMouseDown = false;

        this.nextButton.isHovered = false;
        this.nextButton.isPressed = false;
        this.nextButton.isTouched = false;
        this.nextButton.wasMouseDown = false;
    }

    Reset() {
        this.reset();
    }
}