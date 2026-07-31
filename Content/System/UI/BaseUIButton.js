using("Microsoft.Xna.Framework", "Microsoft.Xna.Framework.Graphics");

const { Vector2, Color } = Modules;
const { Main } = Terraria;

export class BaseUIButton {
    static registry = new Set();
    static isScreenTouched = false;
    static touchCooldownFrames = 0;

    static register(button) {
        BaseUIButton.registry.add(button);
    }

    static processTouchCooldown() {
        if (!BaseUIButton.isScreenTouched) return;

        BaseUIButton.touchCooldownFrames++;
        if (BaseUIButton.touchCooldownFrames > 15) {
            BaseUIButton.isScreenTouched = false;
            BaseUIButton.touchCooldownFrames = 0;
        }
    }

    constructor(positionX, positionY, mode) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.mode = mode;
        this.texture = null;

        this.isHovered = false;
        this.isPressed = false;
        this.isActive = false;
    }

    loadTexture() {
        if (!this.mode?.texturePath) return;

        try {
            if (this.mode.frameCount) {
             this.texture = tl.texture.loadAnimation(this.mode.texturePath, this.mode.frameCount, 30)
            } else {
            this.texture = tl.texture.load(this.mode.texturePath);
            }
        } catch (error) {
            tl.log(`Failed to load texture for button: ${error}`);
        }
    }

    getScreenScale() {
        return Main.screenHeight / 246;
    }

    getCalculatedPosition(offsetY = 0) {
        const scale = this.getScreenScale();
        return Vector2.new(this.positionX * scale, (this.positionY + offsetY) * scale);
    }

    updateHoverState(drawPosition) {
        if (!this.texture) return false;

        const scale = this.getScreenScale();
        const width = this.texture.Width * scale;
        const height = this.texture.Height * scale;

        const originX = drawPosition.X - (width / 2);
        const originY = drawPosition.Y - (height / 2);

        const bounds = Microsoft.Xna.Framework.Rectangle.new();
        bounds['void .ctor(int x, int y, int width, int height)'](
            Math.round(originX),
            Math.round(originY),
            Math.round(width),
            Math.round(height)
        );

        this.isHovered = bounds['bool Contains(int x, int y)'](Main.worldMouseX, Main.worldMouseY);
        return this.isHovered;
    }

    checkInteraction() {
        if (this.isHovered) {
            if (!this.isPressed && !BaseUIButton.isScreenTouched) {
                this.isPressed = true;
                BaseUIButton.isScreenTouched = true;
                this.isActive = !this.isActive;
                this.onClick();
                return true;
            }
        } else {
            this.isPressed = false;
        }

        BaseUIButton.processTouchCooldown();
        return false;
    }

    onClick() {}

    drawSprite(drawPosition, alpha = 1.0, layerDepth = 0.0) {
        if (!this.texture) return;

        const origin = Vector2.new(this.texture.Width / 2, this.texture.Height / 2);
        const drawColor = Color.Lerp(Color.Transparent, Color.White, alpha);

        Main.spriteBatch[
            "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
        ](
            this.texture,
            drawPosition,
            null,
            drawColor,
            0,
            origin,
            this.getScreenScale(),
            SpriteEffects.None,
            layerDepth
        );
    }

    update() {
        const currentPosition = this.getCalculatedPosition();
        this.updateHoverState(currentPosition);
        this.checkInteraction();
    }

    draw() {
        const currentPosition = this.getCalculatedPosition();
        this.drawSprite(currentPosition, 1.0, 0.1);
    }
}

export class ExpandableUIButton extends BaseUIButton {
    constructor(baseX, baseY, targetOffsetY, uiLoader, mode) {
        super(baseX, baseY, mode);
        this.targetOffsetY = targetOffsetY;
        this.currentOffsetY = 0;
        this.animationProgress = 0.0;
        this.isVisible = false;
        this.uiLoader = uiLoader;
    }

    animate(shouldOpen) {
        if (shouldOpen) {
            this.isVisible = true;
            if (this.animationProgress < 1.0) this.animationProgress += 0.1;
        } else {
            if (this.animationProgress > 0.0) {
                this.animationProgress -= 0.1;
            } else {
                this.isVisible = false;
            }
        }

        this.animationProgress = Math.max(0.0, Math.min(1.0, this.animationProgress));
        this.currentOffsetY = this.targetOffsetY * this.animationProgress;
    }

    swapModeWithParent() {
        if (!this.uiLoader) return;

        const parentButton = this.uiLoader.mainButton;

        if (parentButton.mode?.onDeactivated) {
            parentButton.mode.onDeactivated();
        }

        const previousParentMode = parentButton.mode;
        parentButton.mode = this.mode;
        this.mode = previousParentMode;

        parentButton.loadTexture();
        this.loadTexture();

        if (parentButton.mode?.onActivated) {
            parentButton.mode.onActivated();
        }

        parentButton.isActive = false;
    }

    update(parentActive, parentX, parentY, isDisabledTemplate = false) {
        this.positionX = parentX;
        this.positionY = parentY;
        this.animate(parentActive);

        if (isDisabledTemplate) {
            this.isHovered = false;
            return;
        }

        if (this.isVisible && parentActive) {
            const currentPosition = this.getCalculatedPosition(this.currentOffsetY);
            this.updateHoverState(currentPosition);

            if (this.checkInteraction()) {
                this.swapModeWithParent();
            }
        } else {
            this.isHovered = false;
        }
    }

    draw(isDisabledTemplate = false) {
        if (!this.isVisible) return;

        const currentPosition = this.getCalculatedPosition(this.currentOffsetY);

        if (isDisabledTemplate) {
            const blockedColor = Color.Lerp(Color.Transparent, Color.Black, this.animationProgress);
            const origin = Vector2.new(this.texture.Width / 2, this.texture.Height / 2);

            Main.spriteBatch[
                "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
            ](
                this.texture,
                currentPosition,
                null,
                blockedColor,
                0,
                origin,
                this.getScreenScale(),
                SpriteEffects.None,
                0.0
            );
            return;
        }

        this.drawSprite(currentPosition, this.animationProgress, 0.0);
    }
}
