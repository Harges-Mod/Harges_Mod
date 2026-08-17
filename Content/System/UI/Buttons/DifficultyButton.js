using("Microsoft.Xna.Framework", "Microsoft.Xna.Framework.Graphics");

const { Vector2, Color } = Modules;
import { BaseButton } from './BaseButton.js'

export class DifficultyButton extends BaseButton {
    constructor(positionX, positionY, mode) {
        super(positionX, positionY, mode?.texturePath);
        this.mode = mode;
    }
    

    AutoLoad(texturePath = null, frameCount = null) {
        const path = texturePath || this.mode?.texturePath || this.texturePath;
        const frames = frameCount || this.mode?.frameCount || null;

        super.AutoLoad(path, frames);
    }
    
    onClick() {
    	
    }
    
    draw() {
        if (!this.preDraw()) return;

        const currentPosition = Harges.Math.getCalculatedPosition(this.positionX, this.positionY);
        this.drawSprite(currentPosition, {
            alpha: 1.0
        });
    }

}


export class ExpandableDifficultyButton extends DifficultyButton {
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

        parentButton.AutoLoad();
        this.AutoLoad();

        if (parentButton.mode?.onActivated) {
            parentButton.mode.onActivated();
        }

        parentButton.isActive = false;
    }

    Update(parentActive, parentX, parentY, isDisabledTemplate = false) {
        this.positionX = parentX;
        this.positionY = parentY;
        this.animate(parentActive);

        if (isDisabledTemplate) {
            this.isHovered = false;
            return;
        }

        if (this.isVisible && parentActive) {
            const currentPosition = Harges.Math.getCalculatedPosition(this.positionX, this.positionY, this.currentOffsetY);
            this.UpdateHoverState(currentPosition);

            if (this.checkInteraction()) {
                this.swapModeWithParent();
            }
        } else {
            this.isHovered = false;
        }
        this.processCooldown(); 
    }
    
    onClick() {
    	console.log('Chamando')
    }
    
    draw(isDisabledTemplate = false) {
        if (!this.isVisible) return;
        if (!this.preDraw()) return;

        const currentPosition = Harges.Math.getCalculatedPosition(this.positionX, this.positionY, this.currentOffsetY);

        if (isDisabledTemplate) {
            if (!this.texture) return;

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
                Harges.Math.getScreenScale() * this.scale,
                SpriteEffects.None,
                0.0
            );
            return;
        }

        this.drawSprite(currentPosition, {
            alpha: this.animationProgress
        });
    }
}
