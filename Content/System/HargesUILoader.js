import { BaseUIButton, ExpandableUIButton } from './UI/BaseUIButton.js';
import { NormalModeConfig, MModeConfig, TemplateModeConfig } from './UI/Difficulty/Modes.js';

using(
    "Terraria", 
    "Terraria.GameContent", 
    "Microsoft.Xna.Framework", 
    "Microsoft.Xna.Framework.Graphics"
);

const { Vector2, Color } = Modules;

class DifficultyUI {

    static instance = new DifficultyUI()
    constructor() {
        this.mainButton = new BaseUIButton(390, 50, new NormalModeConfig());
        this.MModeButton = new ExpandableUIButton(390, 50, 40, this, new MModeConfig());
        this.templateButton = new ExpandableUIButton(390, 50, 80, this, new TemplateModeConfig());
        this.pixelTexture = null;
    }

    content() {
        this.mainButton.loadTexture();
        this.MModeButton.loadTexture();
        this.templateButton.loadTexture();
        this.pixelTexture = TextureAssets.MagicPixel;
    }

    drawConnectingLine() {
        if (!this.pixelTexture?.Value) return;

        const startPosition = this.mainButton.getCalculatedPosition();
        const endOffsetY = this.templateButton.currentOffsetY * this.mainButton.getScreenScale();

        if (endOffsetY <= 0) return;

        const lineOrigin = Vector2.new(0.1, 0.0);
        const baseThickness = 1 * this.mainButton.getScreenScale();
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

    updateAndDrawInterface() {
        if (
            Terraria.Main.gameMenu ||
            Terraria.Main.gamePaused ||
            Terraria.Main.playerInventory ||
            Terraria.Main.gameInactive
        ) return;

        const isWorldMMode = WorldDB.get('HargesMMode_Active') === true;

        // Ajustado para checar "M" que é o ID do MModeConfig
        if (isWorldMMode && this.mainButton.mode.id !== "M") {
            this.MModeButton.swapModeWithParent();
        } else if (!isWorldMMode && this.mainButton.mode.id === "M" && !this.mainButton.isActive) {
            if (this.MModeButton.mode.id === "N") {
                this.MModeButton.swapModeWithParent();
            } else if (this.templateButton.mode.id === "N") {
                this.templateButton.swapModeWithParent();
            }
        }

        this.mainButton.update();

        const isTemplateDisabled = true;

        this.MModeButton.update(this.mainButton.isActive, this.mainButton.positionX, this.mainButton.positionY, false);
        this.templateButton.update(this.mainButton.isActive, this.mainButton.positionX, this.mainButton.positionY, isTemplateDisabled);

        this.drawConnectingLine();

        this.mainButton.draw();
        this.MModeButton.draw(false);
        this.templateButton.draw(isTemplateDisabled);
    }
}

export class HargesUILoader extends ModSystem {
    constructor() {
        super();
        this.difficultyUI = DifficultyUI.instance;
    }

    SetupContent() {
        this.difficultyUI.content();
    }

    PostDrawInterface() {
        this.difficultyUI.updateAndDrawInterface();
    }
}
