using("Microsoft.Xna.Framework", "Microsoft.Xna.Framework.Graphics");

const { Vector2, Color } = Modules;
const { Main } = Terraria;

const GUIPanel = new NativeClass('', 'GUIPanel');
const PanelLayout = new NativeClass('', 'Panel_Layout');
const LayoutCalculator = new NativeClass('', 'LayoutCalculator');
const RegisterPickingRegion = GUIPanel['bool RegisterPickingRegion(Panel_Layout layout)'];

export class BaseButton {
    constructor(positionX, positionY, texturePath = null) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.texturePath = texturePath;
        this.texture = null;

        this.scale = 1.0;

        this.isHovered = false;
        this.isPressed = false;
        this.isActive = false;

        this.isTouched = false;
        this.touchCooldownFrames = 0;
        this.cooldownLimit = 15;

        this.panelLayout = PanelLayout.new();
        this.panelLayout.Anchor = LayoutCalculator.AnchorType.TopLeft;
    }

    AutoLoad(texturePath, frameCount = null) {
        const path = texturePath || this.texturePath;
        if (!path) return;

        if (frameCount) {
            this.texture = tl.texture.loadAnimation(path, frameCount, 30);
        } else {
            this.texture = tl.texture.load(path);
        }
    }

    registerPickingRegion(originX, originY, width, height) {
        try {
            this.panelLayout.Location = Vector2.new(Math.round(originX), Math.round(originY));
            this.panelLayout.Size = Vector2.new(Math.round(width), Math.round(height));
            RegisterPickingRegion(this.panelLayout);
        } catch (_) {}
    }

    UpdateHoverState(drawPosition) {
        if (!this.texture) return false;

        const screenScale = Harges.Math.getScreenScale();
        const scale = screenScale * this.scale;

        const width = this.texture.Width * scale;
        const height = this.texture.Height * scale;

        const originX = drawPosition.X - (width / 2);
        const originY = drawPosition.Y - (height / 2);

        const bounds = Microsoft.Xna.Framework.Rectangle.new();
        bounds.X = Math.round(originX);
        bounds.Y = Math.round(originY);
        bounds.Width = Math.round(width);
        bounds.Height = Math.round(height);

        this.registerPickingRegion(originX, originY, width, height);

        this.isHovered = bounds['bool Contains(int x, int y)'](
            Math.round(Main.mouseX),
            Math.round(Main.mouseY)
        );

        return this.isHovered;
    }

    processCooldown() {
        if (!this.isTouched) return;

        this.touchCooldownFrames++;

        if (this.touchCooldownFrames > this.cooldownLimit) {
            this.isTouched = false;
            this.touchCooldownFrames = 0;
        }
    }

    checkInteraction() {
        const isMouseDown = Main.mouseLeft;

        if (this.isHovered && isMouseDown) {
            if (!this.isPressed && !this.isTouched) {
                this.isPressed = true;
                this.isTouched = true;
                this.touchCooldownFrames = 0;
                this.isActive = !this.isActive;

                this.onClick();
                return true;
            }
        } else if (!isMouseDown) {
            this.isPressed = false;
        }

        return false;
    }

    Update() {
        const currentPosition = Harges.Math.getCalculatedPosition(
            this.positionX,
            this.positionY
        );

        this.UpdateHoverState(currentPosition);
        this.checkInteraction();
        this.processCooldown();
    }

    onClick() {
    }

    preDraw() {
        return true;
    }

    drawSprite(drawPosition, alpha = 1.0, layerDepth = 0.0) {
        if (!this.texture) return;

        const origin = Vector2.new(
            this.texture.Width / 2,
            this.texture.Height / 2
        );

        const drawColor = Color.Lerp(
            Color.Transparent,
            Color.White,
            alpha
        );

        Main.spriteBatch[
            "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
        ](
            this.texture,
            drawPosition,
            null,
            drawColor,
            0,
            origin,
            Harges.Math.getScreenScale() * this.scale,
            SpriteEffects.None,
            layerDepth
        );
    }

    draw() {
        if (!this.preDraw()) return;

        const currentPosition = Harges.Math.getCalculatedPosition(
            this.positionX,
            this.positionY
        );

        this.drawSprite(currentPosition, 1.0, 0.1);
    }
}