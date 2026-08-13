import Ease from './Ease.js'

using("Terraria");
using("Microsoft.Xna.Framework");
const { Vector2, Color } = Modules;

export class HargesMath {
    Ease = Ease;
    
    getScreenScale() {
        return Main.screenHeight / 246;
    }

    getCalculatedPosition(x, y, offsetY = 0) {
        const scale = this.getScreenScale();
        return Vector2.new(x * scale, (y + offsetY) * scale);
    }
    
    Clamp(value, min = 0.0, max = 1.0) {
        return Math.max(min, Math.min(max, value));
    }

    Normalize(value, max, isCountdown = true) {
        if (max <= 0) return 1.0;
        let t = isCountdown ? (1.0 - value / max) : (value / max);
        return this.Clamp(t);
    }

    Lerp(start, end, t) {
        return start + (end - start) * this.Clamp(t);
    }

    LerpEase(start, end, t, easeFunc = Ease.Linear) {
        return this.Lerp(start, end, easeFunc(this.Clamp(t)));
    }
}
