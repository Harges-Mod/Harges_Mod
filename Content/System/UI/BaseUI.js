// the UIs Loadings Buttons.

using("Microsoft.Xna.Framework", "Microsoft.Xna.Framework.Graphics");

const { Vector2 } = Modules;
const { Main } = Terraria;

export class UIEditor {
    constructor(ui) {
        this.ui = ui;
        this.enabled = false;
        this.draggedButton = null;
        this.selectedButton = null;
        this.dragOffset = Vector2.new(0, 0);
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) this.draggedButton = null;
    }

    Update() {
        if (!this.enabled || !this.ui.memory) return;

        const mousePos = Vector2.new(Main.mouseX, Main.mouseY);
        const isMouseDown = Main.mouseLeft;

        this.ui.memory.data.forEach((button) => {
            if (!button.texture) return;

            const scale = Harges.Math.getScreenScale();
            const currentOffsetY = button.currentOffsetY || 0;
            const currentPos = Harges.Math.getCalculatedPosition(button.positionX, button.positionY, currentOffsetY);

            const width = button.texture.Width * scale;
            const height = button.texture.Height * scale;

            const bounds = Microsoft.Xna.Framework.Rectangle.new();
            bounds.X = Math.round(currentPos.X - (width / 2));
            bounds.Y = Math.round(currentPos.Y - (height / 2));
            bounds.Width = Math.round(width);
            bounds.Height = Math.round(height);

            const isHovered = bounds['bool Contains(int x, int y)'](Math.round(mousePos.X), Math.round(mousePos.Y));

            if (isHovered && isMouseDown && !this.draggedButton) {
                this.draggedButton = button;
                this.selectedButton = button;

                this.dragOffset = Vector2.new(button.positionX - mousePos.X, button.positionY - mousePos.Y);
            }
        });

        if (this.draggedButton && isMouseDown) {
            const newX = Math.round(mousePos.X + this.dragOffset.X);
            const newY = Math.round(mousePos.Y + this.dragOffset.Y);

            this.draggedButton.positionX = newX;
            this.draggedButton.positionY = newY;

            if (this.ui.mainButton && this.draggedButton === this.ui.mainButton) {
                this.ui.memory.data.forEach((btn) => {
                    if (btn !== this.ui.mainButton) {
                        btn.positionX = newX;
                        btn.positionY = newY;
                    }
                });
            }
        } else if (!isMouseDown) {
            this.draggedButton = null;
        }
    }

    exportLayout() {
        let index = 0;
        if (this.ui.memory) {
            this.ui.memory.data.forEach((button) => {
                tl.log(`[Botão ${index}]: X = ${button.positionX}, Y = ${button.positionY}`);
                index++;
            });
        }
    }
}


export class BaseUI {
    constructor() {
        this.memory = Harges.System.Memory.Create('buttons_' + Math.random().toString(36).substring(7));
        this.Buttons = this.memory;
        this.editor = new UIEditor(this);
    }

    AddButton(button) {
        return this.memory.Add(button);
    }
    
    CallButton(method) {
    	return this.memory.Call(method);
    }
    
    AutoLoadContent() {
        this.memory.Call('AutoLoad');
    }

    Content() {}
    
    UpdateAndDraw() {
    	if (this.editor.enabled) this.editor.Update();
        
    	this.memory.Call('Update')
    }
}