using(
    "Microsoft.Xna.Framework",
    "Microsoft.Xna.Framework.Graphics"
);

const { Vector2, Color } = Modules;
const { Main } = Terraria;

const Draw = Generic.EntityDraw;

const GUIPanel =
    new NativeClass('', 'GUIPanel');

const PanelLayout =
    new NativeClass('', 'Panel_Layout');

const LayoutCalculator =
    new NativeClass('', 'LayoutCalculator');

const RegisterPickingRegion =
    GUIPanel[
        'bool RegisterPickingRegion(Panel_Layout layout)'
    ];

export class BaseButton {

    constructor(
        positionX,
        positionY,
        texturePath = null
    ) {
        this.positionX = positionX;
        this.positionY = positionY;

        this.texturePath =
            texturePath;

        this.texture = null;

        this.scale = 1.0;

        this.isHovered = false;
        this.isPressed = false;
        this.isActive = false;

        this.isTouched = false;
        this.touchCooldownFrames = 0;
        this.cooldownLimit = 15;

        this.wasMouseDown = false;

        this.panelLayout =
            PanelLayout.new();

        this.panelLayout.Anchor =
            LayoutCalculator.AnchorType.TopLeft;
    }

    AutoLoad(
        texturePath = null,
        frameCount = null
    ) {
        const path =
            texturePath ||
            this.texturePath;

        if (!path)
            return;

        if (frameCount) {
            this.texture =
                tl.texture.loadAnimation(
                    path,
                    frameCount,
                    30
                );
        }
        else {
            this.texture =
                tl.texture.load(path);
        }
    }

    registerPickingRegion(
        originX,
        originY,
        width,
        height
    ) {
        try {
            this.panelLayout.Location =
                Vector2.new(
                    Math.round(originX),
                    Math.round(originY)
                );

            this.panelLayout.Size =
                Vector2.new(
                    Math.round(width),
                    Math.round(height)
                );

            RegisterPickingRegion(
                this.panelLayout
            );
        }
        catch (_) {}
    }

    UpdateHoverState(drawPosition) {
        if (!this.texture)
            return false;

        const screenScale =
            Harges.Math.getScreenScale();

        const totalScale =
            this.scale *
            screenScale;

        const rect =
            Generic.getRect(
                this.texture
            );

        const frameWidth =
            rect
                ? rect.Width
                : this.texture.Width;

        const frameHeight =
            rect
                ? rect.Height
                : this.texture.Height;

        const scaledWidth =
            Math.ceil(
                frameWidth *
                totalScale
            );

        const scaledHeight =
            Math.ceil(
                frameHeight *
                totalScale
            );

        const topLeftX =
            drawPosition.X -
            scaledWidth / 2;

        const topLeftY =
            drawPosition.Y -
            scaledHeight / 2;

        this.registerPickingRegion(
            topLeftX,
            topLeftY,
            scaledWidth,
            scaledHeight
        );

        const bounds =
            Microsoft.Xna.Framework.Rectangle.new();

        bounds.X =
            Math.round(topLeftX);

        bounds.Y =
            Math.round(topLeftY);

        bounds.Width =
            Math.round(scaledWidth);

        bounds.Height =
            Math.round(scaledHeight);

        this.isHovered =
            bounds[
                'bool Contains(int x, int y)'
            ](
                Math.round(Main.mouseX),
                Math.round(Main.mouseY)
            );

        return this.isHovered;
    }

    processCooldown() {
        if (!this.isTouched)
            return;

        this.touchCooldownFrames++;

        if (
            this.touchCooldownFrames >
            this.cooldownLimit
        ) {
            this.isTouched = false;
            this.touchCooldownFrames = 0;
        }
    }

    checkInteraction() {
        const isMouseDown =
            Main.mouseLeft;

        const justPressed =
            isMouseDown &&
            !this.wasMouseDown;

        if (!isMouseDown) {
            this.isPressed = false;
        }

        if (
            justPressed &&
            this.isHovered
        ) {
            if (!this.isTouched) {

                this.isPressed = true;
                this.isTouched = true;

                this.touchCooldownFrames = 0;

                this.isActive =
                    !this.isActive;

                this.onClick();

                this.wasMouseDown =
                    isMouseDown;

                return true;
            }
        }

        this.wasMouseDown =
            isMouseDown;

        return false;
    }

    Update() {
        const currentPosition =
            Harges.Math.getCalculatedPosition(
                this.positionX,
                this.positionY
            );

        this.UpdateHoverState(
            currentPosition
        );

        this.checkInteraction();
        this.processCooldown();
    }

    onClick() {
    }

    preDraw() {
        return true;
    }

    drawSprite(
        drawPosition,
        {
            alpha = 1.0,
            scale = this.scale,
            color = Color.White,
            rotation = 0,
            layerDepth = 0.1
        } = {}
    ) {
        if (!this.texture)
            return;

        const origin =
            Vector2.new(
                this.texture.Width / 2,
                this.texture.Height / 2
            );

        const drawColor =
            Color.Lerp(
                Color.Transparent,
                color,
                alpha
            );

        const finalScale =
            scale *
            Harges.Math.getScreenScale();

        Draw(
            this.texture,
            drawPosition,
            Generic.getRect(
                this.texture
            ),
            drawColor,
            rotation,
            origin,
            Vector2.new(
                finalScale,
                finalScale
            ),
            SpriteEffects.None
        );
    }

    draw() {
        if (!this.preDraw())
            return;

        const currentPosition =
            Harges.Math.getCalculatedPosition(
                this.positionX,
                this.positionY
            );

        this.drawSprite(
            currentPosition,
            {
                alpha: 1.0
            }
        );
    }
}