// Generic
export class DifficultyMode {
    constructor(id, texturePath, frameCount) {
        this.id = id;
        this.texturePath = texturePath;
        this.frameCount = frameCount
    }

    onActivated() {}
    onDeactivated() {}
}

// Normal / None
export class NormalModeConfig extends DifficultyMode {
    constructor() {
        super("N", "Textures/NModeIcon.png");
    }

    onActivated() {}
}

// MarcilessMode
export class MModeConfig extends DifficultyMode {
    constructor() {
        super("M", "Textures/MModeIcon.png", 8)
    }

    onActivated() {
        const modPlayer = ModPlayer.Get('HargesMMode');
        if (modPlayer) {
            modPlayer.MModeActive = true;
        }
    }

    onDeactivated() {
        const modPlayer = ModPlayer.Get('HargesMMode');
        if (modPlayer) {
            modPlayer.MModeActive = false;
        }
    }
}

// Eternal / Null Difficulty just another template.
export class TemplateModeConfig extends DifficultyMode {
    constructor() {
        super("N", "Textures/NModeIcon.png");
    }
}
