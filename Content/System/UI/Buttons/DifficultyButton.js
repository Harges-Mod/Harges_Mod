using("Microsoft.Xna.Framework", "Microsoft.Xna.Framework.Graphics");

const { Vector2, Color } = Modules;
const { Main } = Terraria;

import { BaseButton } from './BaseButton.js';

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

    draw() {
        const currentPosition = Harges.Math.getCalculatedPosition(
            this.positionX,
            this.positionY
        );

        this.drawSprite(currentPosition, 1.0, 0.1);
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

        // Física da queda
        this.velocityY = 0;
        this.spring = 0.18;
        this.damping = 0.72;

        // Balanço
        this.rotation = 0;
        this.rotationVelocity = 0;
        this.swingStrength = 0.035;
    }

    animate(shouldOpen) {
        if (shouldOpen) {
            this.isVisible = true;

            const distance =
                this.targetOffsetY -
                this.currentOffsetY;

            this.velocityY +=
                distance * this.spring;

            this.velocityY *=
                this.damping;

            this.currentOffsetY +=
                this.velocityY;

            const targetRotation =
                -this.velocityY *
                this.swingStrength;

            this.rotationVelocity += (
                targetRotation -
                this.rotation
            ) * 0.2;

            this.rotationVelocity *= 0.72;

            this.rotation +=
                this.rotationVelocity;

            if (
                Math.abs(distance) < 0.05 &&
                Math.abs(this.velocityY) < 0.05
            ) {
                this.currentOffsetY =
                    this.targetOffsetY;

                this.velocityY = 0;

                this.rotation *= 0.8;
                this.rotationVelocity *= 0.8;
            }

            this.animationProgress =
                Harges.Math.Clamp(
                    this.currentOffsetY /
                    this.targetOffsetY
                );

            return;
        }

        // ==========================================
        // FECHAMENTO COM FÍSICA
        // ==========================================

        const distance =
            this.currentOffsetY;

        if (distance > 0.01) {
            // Quanto mais longe do ponto inicial,
            // maior a força de retorno.
            this.velocityY +=
                distance * 0.12;

            this.velocityY *= 0.82;

            this.currentOffsetY -=
                this.velocityY;

            if (this.currentOffsetY < 0) {
                this.currentOffsetY = 0;
            }

            // Desaceleração do balanço
            this.rotationVelocity *= 0.78;
            this.rotation *= 0.82;
        } else {
            this.currentOffsetY = 0;
            this.velocityY = 0;

            this.rotation = 0;
            this.rotationVelocity = 0;

            this.isVisible = false;
        }

        this.animationProgress =
            Harges.Math.Clamp(
                this.currentOffsetY /
                this.targetOffsetY
            );
    }

    swapModeWithParent() {
        if (!this.uiLoader) return;

        const parentButton =
            this.uiLoader.mainButton;

        if (!parentButton) return;

        if (parentButton.mode?.onDeactivated) {
            parentButton.mode.onDeactivated();
        }

        const previousParentMode =
            parentButton.mode;

        parentButton.mode =
            this.mode;

        this.mode =
            previousParentMode;

        parentButton.AutoLoad();
        this.AutoLoad();

        if (parentButton.mode?.onActivated) {
            parentButton.mode.onActivated();
        }

        // Fecha o menu.
        if (this.uiLoader.setDifficultyOpen) {
            this.uiLoader.setDifficultyOpen(false);
        }

        // O próximo clique precisa ser um novo clique real.
        this.waitForRelease = true;
    }

    Update(
        parentActive,
        parentX,
        parentY,
        isDisabledTemplate = false
    ) {
        this.positionX = parentX;
        this.positionY = parentY;

        this.animate(parentActive);

        // ==========================================
        // ESPERA O MOUSE SER SOLTO
        // ==========================================

        if (!Main.mouseLeft) {
            this.waitForRelease = false;
        }

        if (isDisabledTemplate) {
            this.isHovered = false;
            this.processCooldown();
            return;
        }

        if (
            !this.isVisible ||
            !parentActive
        ) {
            this.isHovered = false;
            this.processCooldown();
            return;
        }

        const currentPosition =
            Harges.Math.getCalculatedPosition(
                this.positionX,
                this.positionY,
                this.currentOffsetY
            );

        this.UpdateHoverState(
            currentPosition
        );

        // Somente aceita um clique novo.
        if (!this.waitForRelease) {
            if (this.checkInteraction()) {
                this.swapModeWithParent();
            }
        }

        this.processCooldown();
    }

    draw(isDisabledTemplate = false) {
        if (!this.isVisible) return;
        if (!this.preDraw()) return;

        const currentPosition =
            Harges.Math.getCalculatedPosition(
                this.positionX,
                this.positionY,
                this.currentOffsetY
            );

        const origin = Vector2.new(
            this.texture.Width / 2,
            this.texture.Height / 2
        );

        if (isDisabledTemplate) {
            const blockedColor =
                Color.Lerp(
                    Color.Transparent,
                    Color.Black,
                    this.animationProgress
                );

            Main.spriteBatch[
                "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
            ](
                this.texture,
                currentPosition,
                null,
                blockedColor,
                this.rotation,
                origin,
                Harges.Math.getScreenScale(),
                SpriteEffects.None,
                0.0
            );

            return;
        }

        const drawColor =
            Color.Lerp(
                Color.Transparent,
                Color.White,
                this.animationProgress
            );

        Main.spriteBatch[
            "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
        ](
            this.texture,
            currentPosition,
            null,
            drawColor,
            this.rotation,
            origin,
            Harges.Math.getScreenScale(),
            SpriteEffects.None,
            0.0
        );
    }
}