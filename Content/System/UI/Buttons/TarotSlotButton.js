using(
    "Microsoft.Xna.Framework",
    "Microsoft.Xna.Framework.Graphics",
    "Terraria",
    "Terraria.GameContent"
);

const { TextureAssets } = Terraria.GameContent;
const { Vector2, Color } = Modules;

import { BaseButton } from './BaseButton.js';

const Draw = Generic.EntityDraw;

export class TarotBagButton extends BaseButton {
    static instance = new TarotBagButton(
        390 - 14 + 1,
        50,
        'Textures/UI/Bag.png'
    );

    constructor(
        x = 390 - 14 + 1,
        y = 50,
        texturePath = 'Textures/UI/Bag.png'
    ) {
        super(x, y, texturePath);

        this.State = this.Mode.Disabled;
    }

    Mode = {
        Disabled: 0,
        Enabled: 1
    };

    UpdateState() {
        this.State =
            this.State === this.Mode.Disabled
                ? this.Mode.Enabled
                : this.Mode.Disabled;

        Main.hideUI = !Main.hideUI;
    }

    onClick() {
        this.UpdateState();
    }

    draw() {
        if (!this.preDraw())
            return;

        const pos =
            Harges.Math.getCalculatedPosition(
                this.positionX,
                this.positionY
            );

        this.drawSprite(pos, {
            alpha: 1
        });
    }
}

export class TarotDragButton extends BaseButton {
    constructor() {
        super(
            0,
            0,
            'Textures/UI/TarotLock.png'
        );

        this.isLocked = true;
    }

    updatePosition(pos, width, height) {
        this.positionX =
            pos.X +
            width / 2 -
            6;

        this.positionY =
            pos.Y -
            height / 2 +
            6;
    }

    onClick() {
        this.isLocked = !this.isLocked;

        const allowDrag = !this.isLocked;

        TarotSlotButton.Slots.forEach(
            slot => {
                slot.isDraggable = allowDrag;
            }
        );

        this.AutoLoad(
            this.isLocked
                ? 'Textures/UI/TarotLock.png'
                : 'Textures/UI/TarotLockOpen.png'
        );
    }

    Update() {
        const pos =
            Vector2.new(
                this.positionX,
                this.positionY
            );

        this.UpdateHoverState(pos);
        this.checkInteraction();
        this.processCooldown();
    }

    draw() {
        if (!this.preDraw())
            return;

        const pos =
            Vector2.new(
                this.positionX,
                this.positionY
            );

        this.drawSprite(pos, {
            alpha: 1
        });
    }
}

export class TarotSlotButton extends BaseButton {
    static Slots = [];
    static toggleButton = null;

    static spacing = 48;
    static centerYOffset = 55;

    constructor(
        x,
        y,
        texturePath = 'Textures/UI/Slots.png'
    ) {
        super(
            x,
            y,
            texturePath
        );

        this.itemType = 0;
        this.isDraggable = false;

        TarotSlotButton.Slots.push(this);

        if (!TarotSlotButton.toggleButton) {
            TarotSlotButton.toggleButton =
                new TarotDragButton();
        }
    }

    getIndex() {
        return TarotSlotButton.Slots.indexOf(this);
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
            2 +
            TarotSlotButton.centerYOffset
        );
    }

    calculateCenteredBasePosition() {
        const index =
            this.getIndex();

        const total =
            TarotSlotButton.Slots.length;

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
            TarotBagButton.instance.State ===
            TarotBagButton.instance.Mode.Enabled
        )
            return;

        this.calculateCenteredBasePosition();

        const pos =
            Harges.Math.getCalculatedPosition(
                this.positionX,
                this.positionY
            );

        this.UpdateHoverState(pos);
        this.checkInteraction();
        this.processCooldown();

        const last =
            this.getIndex() ===
            TarotSlotButton.Slots.length - 1;

        if (
            last &&
            TarotSlotButton.toggleButton &&
            this.texture
        ) {
            const scale =
                Harges.Math.getScreenScale();

            const rect =
                Generic.getRect(this.texture);

            TarotSlotButton.toggleButton.updatePosition(
                pos,
                rect.Width * scale,
                rect.Height * scale
            );

            TarotSlotButton.toggleButton.Update();
        }
    }

    onClick() {
    }

    draw() {
        if (
            TarotBagButton.instance.State ===
            TarotBagButton.instance.Mode.Disabled
        )
            return;

        if (!this.preDraw())
            return;

        this.calculateCenteredBasePosition();

        const pos =
            Harges.Math.getCalculatedPosition(
                this.positionX,
                this.positionY
            );

        this.drawSprite(pos, {
            alpha: 1
        });

        if (this.itemType > 0) {
            TarotInventory.instance.drawItem(
                this.itemType,
                pos,
                0.9
            );
        }

        const last =
            this.getIndex() ===
            TarotSlotButton.Slots.length - 1;

        if (
            last &&
            TarotSlotButton.toggleButton
        ) {
            TarotSlotButton.toggleButton.draw();
        }
    }

    static getTypes() {
        return TarotSlotButton.Slots.map(
            slot => slot.itemType
        );
    }

    static getType(index) {
        const slot =
            TarotSlotButton.Slots[index];

        return slot
            ? slot.itemType
            : 0;
    }
}

export class TarotInventory {
    static instance =
        new TarotInventory();

    constructor() {
        this.columns = 5;
        this.rows = 5;

        this.page = 0;

        this.slotSize = 18;
        this.spacing = 2;

        this.positionX = 0;
        this.positionY = 0;

        this.hovered = -1;
        this.hoveredArrow = 0;
        this.hoveredRemove = false;

        this.wasMouseDown = false;
    }

    setPosition(x, y) {
        this.positionX = x;
        this.positionY = y;
    }

    getScale() {
        return Harges.Math.getScreenScale();
    }

    getPlayer() {
        return Main.player[0];
    }

    getHeldItemType() {
        const player =
            this.getPlayer();

        if (!player || !player.HeldItem)
            return 0;

        return player.HeldItem.type;
    }

    getItems() {
        const player =
            this.getPlayer();

        if (
            !player ||
            !player.inventory
        )
            return [];

        const result = [];

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
                result.push(item);
            }
        }

        return result;
    }

    getPageItems() {
        const items =
            this.getItems();

        return items.slice(
            this.page * 25,
            this.page * 25 + 25
        );
    }

    getPageCount() {
        return Math.max(
            1,
            Math.ceil(
                this.getItems().length / 25
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
            14;
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

    getArrowPosition(right) {
        return Harges.Math.getCalculatedPosition(
            right
                ? this.positionX +
                  this.getWidth() +
                  8
                : this.positionX -
                  8,

            this.positionY +
            this.getHeight() / 2
        );
    }

    getRemovePosition() {
        return Harges.Math.getCalculatedPosition(
            TarotSlotButton.getCenterX(),

            this.positionY +
            this.getHeight() +
            8
        );
    }

    contains(pos, size) {
        return (
            Main.mouseX >=
                pos.X - size / 2 &&
            Main.mouseX <=
                pos.X + size / 2 &&
            Main.mouseY >=
                pos.Y - size / 2 &&
            Main.mouseY <=
                pos.Y + size / 2
        );
    }

    isSelected(type) {
        return TarotSlotButton.Slots.some(
            slot =>
                slot.itemType === type
        );
    }

    addItem(item) {
        if (!item)
            return false;

        const type =
            item.type;

        if (
            type <= 0 ||
            this.isSelected(type)
        )
            return false;

        for (
            let i = 0;
            i < 3;
            i++
        ) {
            const slot =
                TarotSlotButton.Slots[i];

            if (
                slot &&
                !slot.hasItem()
            ) {
                slot.setItemType(type);
                return true;
            }
        }

        return false;
    }

    addHeldItem() {
        const type =
            this.getHeldItemType();

        if (type <= 0)
            return false;

        if (this.isSelected(type))
            return false;

        for (
            let i = 0;
            i < 3;
            i++
        ) {
            const slot =
                TarotSlotButton.Slots[i];

            if (
                slot &&
                !slot.hasItem()
            ) {
                slot.setItemType(type);
                return true;
            }
        }

        return false;
    }

    removeItem() {
        for (
            let i = 2;
            i >= 0;
            i--
        ) {
            const slot =
                TarotSlotButton.Slots[i];

            if (
                slot &&
                slot.hasItem()
            ) {
                slot.clearItem();
                return true;
            }
        }

        return false;
    }

    touch() {
        BaseButton.isScreenTouched = true;
        BaseButton.touchCooldownFrames = 0;
    }

    update() {
        if (
            TarotBagButton.instance.State !==
            TarotBagButton.instance.Mode.Enabled
        )
            return;

        this.calculatePosition();

        const mouseDown =
            Main.mouseLeft;

        const justPressed =
            mouseDown &&
            !this.wasMouseDown;

        this.hovered = -1;
        this.hoveredArrow = 0;
        this.hoveredRemove = false;

        const items =
            this.getPageItems();

        const scale =
            this.getScale();

        const hitSize =
            this.slotSize * scale;

        for (
            let i = 0;
            i < items.length;
            i++
        ) {
            if (
                this.contains(
                    this.getPosition(i),
                    hitSize
                )
            ) {
                this.hovered = i;
                break;
            }
        }

        if (
            this.contains(
                this.getArrowPosition(false),
                18 * scale
            )
        ) {
            this.hoveredArrow = -1;
        }

        if (
            this.contains(
                this.getArrowPosition(true),
                18 * scale
            )
        ) {
            this.hoveredArrow = 1;
        }

        if (
            this.contains(
                this.getRemovePosition(),
                18 * scale
            )
        ) {
            this.hoveredRemove = true;
        }

        if (
            justPressed &&
            !BaseButton.isScreenTouched
        ) {
            if (this.hovered !== -1) {
                if (
                    this.addItem(
                        items[this.hovered]
                    )
                ) {
                    this.touch();
                }
            }
            else if (
                this.hoveredArrow === -1
            ) {
                if (this.page > 0) {
                    this.page--;
                    this.touch();
                }
            }
            else if (
                this.hoveredArrow === 1
            ) {
                if (
                    this.page <
                    this.getPageCount() - 1
                ) {
                    this.page++;
                    this.touch();
                }
            }
            else if (
                this.hoveredRemove
            ) {
                if (this.removeItem()) {
                    this.touch();
                }
            }
        }

        this.wasMouseDown =
            mouseDown;
    }

    drawSlot(pos, item, hovered) {
        const texture =
            TextureAssets.InventoryBack?.Value;

        if (!texture)
            return;

        const rect =
            Generic.getRect(texture);

        const origin =
            Generic.getOrigin(texture);

        const scale =
            this.getScale() *
            (
                this.slotSize /
                rect.Width
            );

        Draw(
            texture,
            pos,
            rect,
            Color.White,
            0,
            origin,
            Vector2.new(
                scale,
                scale
            ),
            SpriteEffects.None
        );

        if (item) {
            this.drawItem(
                item.type,
                pos,
                0.7
            );
        }
    }

    drawItem(
        type,
        pos,
        multiplier = 1
    ) {
        if (
            !type ||
            type <= 0
        )
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

        const max =
            14 *
            this.getScale() *
            multiplier;

        const itemScale =
            Math.min(
                max / rect.Width,
                max / rect.Height
            );

        Draw(
            texture,
            pos,
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

        Draw(
            texture,
            a,
            Generic.getRect(texture),
            color,
            Math.atan2(dy, dx),
            Vector2.new(0, 0.5),
            Vector2.new(
                length,
                thickness
            ),
            SpriteEffects.None
        );
    }

    drawArrow(
        pos,
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
            4 * scale;

        const color =
            disabled
                ? Color.Lerp(
                    Color.Transparent,
                    Color.White,
                    0.25
                )
                : Color.White;

        const a =
            right
                ? Vector2.new(
                    pos.X - size,
                    pos.Y - size
                )
                : Vector2.new(
                    pos.X + size,
                    pos.Y - size
                );

        const b =
            Vector2.new(
                pos.X,
                pos.Y
            );

        const c =
            right
                ? Vector2.new(
                    pos.X - size,
                    pos.Y + size
                )
                : Vector2.new(
                    pos.X + size,
                    pos.Y + size
                );

        this.drawLine(
            texture,
            a,
            b,
            color,
            scale
        );

        this.drawLine(
            texture,
            b,
            c,
            color,
            scale
        );
    }

    drawRemove() {
        const texture =
            TextureAssets.MagicPixel?.Value;

        if (!texture)
            return;

        const hasItem =
            TarotSlotButton.Slots.some(
                slot => slot.hasItem()
            );

        if (!hasItem)
            return;

        const pos =
            this.getRemovePosition();

        const scale =
            this.getScale();

        const size =
            4 * scale;

        const color =
            this.hoveredRemove
                ? Color.Red
                : Color.White;

        this.drawLine(
            texture,
            Vector2.new(
                pos.X - size,
                pos.Y - size
            ),
            Vector2.new(
                pos.X + size,
                pos.Y + size
            ),
            color,
            scale
        );

        this.drawLine(
            texture,
            Vector2.new(
                pos.X + size,
                pos.Y - size
            ),
            Vector2.new(
                pos.X - size,
                pos.Y + size
            ),
            color,
            scale
        );
    }

    drawBackground() {
        if (
            TarotBagButton.instance.State !==
            TarotBagButton.instance.Mode.Enabled
        )
            return;

        const texture =
            TextureAssets.MagicPixel?.Value;

        if (!texture)
            return;

        const rect =
            Generic.getRect(texture);

        Draw(
            texture,
            Vector2.new(
                Main.screenWidth / 2,
                Main.screenHeight / 2
            ),
            rect,
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

    draw() {
        if (
            TarotBagButton.instance.State !==
            TarotBagButton.instance.Mode.Enabled
        )
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
                items[i] || null,
                this.hovered === i
            );
        }

        this.drawArrow(
            this.getArrowPosition(false),
            false,
            this.page === 0
        );

        this.drawArrow(
            this.getArrowPosition(true),
            true,
            this.page >=
                this.getPageCount() - 1
        );

        this.drawRemove();
    }
}