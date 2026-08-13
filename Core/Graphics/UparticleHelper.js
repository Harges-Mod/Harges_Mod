import UParticle from './UParticle.js';

class MetaBallColor {
    constructor(borderColor = Color.Blue, coreColor = Color.Cyan) {
        this.borderColor = borderColor;
        this.coreColor = coreColor;
    }
}

export default class UParticleHelper {
    
    static BallColor = (borderColor, coreColor) => new MetaBallColor(borderColor, coreColor);
    
    // Simutaltes a Perfect MetaBall
    static SimulateMetaBall({
        color = new MetaBallColor(Color.Blue, Color.Cyan),
        count = 7,
        baseSizePx = 24,
        scaleMultiplier = 1.0,
        center = Vector2.Zero
    } = {}) {
        const TEXTURE_SIZE = 512;
        const baseScale = (baseSizePx / TEXTURE_SIZE) * scaleMultiplier;

        const borderStartColor = color.borderColor;
        const borderEndColor = Color.Lerp(borderStartColor, Color.Transparent, 1.0);

        const coreStartColor = color.coreColor;
        const coreEndColor = Color.Lerp(coreStartColor, Color.Transparent, 1.0);
        
        const normalizedCenter = (center.X !== 0 || center.Y !== 0) 
            ? Vector2.Normalize(center) 
            : Vector2.new(1, 0);

        for (let i = 0; i < count; i++) {
            const spawnPos = Vector2.new(
                center.X + (Math.random() * 8 - 4),
                center.Y + (Math.random() * 6 - 3)
            );

            const velocity = Vector2.new(
                Math.random() * 0.3 - 0.15,
                Math.random() * 0.3 - 0.15
            );

            const angle = (Math.abs(velocity.X) > 0.01 || Math.abs(velocity.Y) > 0.01)
                ? Math.atan2(velocity.Y, velocity.X)
                : 0;

            const lifeTime = Generic.toSec(Math.random() * 0.3 + 0.5);

            const stretchX = Math.abs(normalizedCenter.X) || 1.0; 
            const stretchY = 0.85;
            
            // Scale Stretched
            const startScaleX = baseScale * stretchX;
            const startScaleY = baseScale * stretchY;

            const endScaleX = baseScale * 0.3;
            const endScaleY = baseScale * 0.3;

            // Layer 0
            const borderStartScaleX = startScaleX * 1.35;
            const borderStartScaleY = startScaleY * 1.35;
            const borderEndScaleX = endScaleX * 1.35;
            const borderEndScaleY = endScaleY * 1.35;

            Harges.Graphics.UParticle.Spawn(
                Harges.Assets.Loader.Load("Assets/Adittive/dust2.png"),
                spawnPos,
                velocity,
                {
                    life: lifeTime,
                    scaleFrom: Vector2.new(borderStartScaleX, borderStartScaleY),
                    scaleTo: Vector2.new(borderEndScaleX, borderEndScaleY),
                    colorFrom: borderStartColor,
                    colorTo: borderEndColor,
                    rotation: angle,
                    rotVel: 0,
                    additive: false,
                    layer: 1 // 0 = crash
                }
            );
            
            // Layer 1
            Harges.Graphics.UParticle.Spawn(
                Harges.Assets.Loader.Load("Assets/Adittive/dust2.png"),
                spawnPos,
                velocity,
                {
                    life: lifeTime,
                    scaleFrom: Vector2.new(startScaleX, startScaleY),
                    scaleTo: Vector2.new(endScaleX, endScaleY),
                    colorFrom: coreStartColor,
                    colorTo: coreEndColor,
                    rotation: angle,
                    rotVel: 0,
                    additive: true,
                    layer: 1
                }
            );
        }
    }
}
