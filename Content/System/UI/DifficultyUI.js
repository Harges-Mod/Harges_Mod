using(
    "Terraria",
    "Terraria.GameContent",
    "Microsoft.Xna.Framework",
    "Microsoft.Xna.Framework.Graphics"
);

import { BaseUI } from './BaseUI.js';
import { DifficultyButton, ExpandableDifficultyButton } from './Buttons/DifficultyButton.js';
import { NormalModeConfig, MModeConfig, TemplateModeConfig } from './Difficulty/Modes.js';

export class DifficultyUI extends BaseUI {
    constructor() {
        super();
        
        this.mainButton = this.AddButton(new DifficultyButton(390, 50, new NormalModeConfig()));
        this.MModeButton = this.AddButton(new ExpandableDifficultyButton(390, 50, 40, this, new MModeConfig()));
        this.templateButton = this.AddButton(new ExpandableDifficultyButton(390, 50, 80, this, new TemplateModeConfig()));

        this.pixelTexture = null;
    }
    
    Content() {
        this.AutoLoadContent();
        this.pixelTexture = TextureAssets.MagicPixel;
        // this.editor.toggle();
    }

    drawConnectingLine() {
        if (!this.pixelTexture?.Value) return;

        const startPosition = Harges.Math.getCalculatedPosition(this.mainButton.positionX, this.mainButton.positionY);
        const endOffsetY = this.templateButton.currentOffsetY * Harges.Math.getScreenScale();

        if (endOffsetY <= 0) return;

        const lineOrigin = Vector2.new(0.1, 0.0);
        const baseThickness = 1 * Harges.Math.getScreenScale();
        const lineScale = Vector2.new(baseThickness, endOffsetY);

        const sourceBounds = Microsoft.Xna.Framework.Rectangle.new();
        sourceBounds['void .ctor(int x, int y, int width, int height)'](0, 0, 1, 1);

        const lineColor = Color.Lerp(Color.Transparent, Color.White, this.templateButton.animationProgress);

        Main[
            "void EntitySpriteDraw(Texture2D texture, Vector2 position, Rectangle sourceRectangle, Color color, float rotation, Vector2 origin, Vector2 scale, SpriteEffects effects, float worthless)"
        ](
            this.pixelTexture.Value,
            startPosition,
            sourceBounds,
            lineColor,
            0.0,
            lineOrigin,
            lineScale,
            SpriteEffects.None,
            0.0
        );
    }

    UpdateAndDraw() {
        if (
            Terraria.Main.gameMenu ||
            Terraria.Main.gamePaused ||
            Terraria.Main.playerInventory ||
            Terraria.Main.gameInactive
        ) return;

        if (this.editor.enabled) {
            this.editor.Update();
        }

        const isWorldMMode = WorldDB.get('HargesMMode_Active') === true;

        if (isWorldMMode && this.mainButton.mode.id !== "M") {
            this.MModeButton.swapModeWithParent();
        } else if (!isWorldMMode && this.mainButton.mode.id === "M" && !this.mainButton.isActive) {
            if (this.MModeButton.mode.id === "N") {
                this.MModeButton.swapModeWithParent();
            } else if (this.templateButton.mode.id === "N") {
                this.templateButton.swapModeWithParent();
            }
        }

        if (!this.editor.draggedButton) {
            this.mainButton.Update();
        }

        const isTemplateDisabled = true;

        this.MModeButton.Update(this.mainButton.isActive, this.mainButton.positionX, this.mainButton.positionY, false);
        this.templateButton.Update(this.mainButton.isActive, this.mainButton.positionX, this.mainButton.positionY, isTemplateDisabled);

        this.drawConnectingLine();

        this.mainButton.draw();
        this.MModeButton.draw(false);
        this.templateButton.draw(isTemplateDisabled);
    }
}
