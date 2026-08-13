using("Terraria");
using("Terraria.Graphics.CameraModifiers");
using("Microsoft.Xna.Framework");

class CameraFX {

    static Punch(startPosition, direction, strength, durationFrames = 15) {
            let modifier = PunchCameraModifier.new();
            modifier[
                "void .ctor(Vector2 startPosition, Vector2 direction, float strength, float vibrationCyclesPerSecond, int frames, float distanceFalloff, string uniqueIdentity)"
            ](
                startPosition,
                direction,
                parseFloat(strength),
                10.0,
                durationFrames,
                1.0,
                "Locks"
            );
            return modifier;
    }

	
	
    static Shake(intensity, duration) {
        Camera.Shake(intensity, duration);
    }

    static LocksOn(targetPos, lerpSpeed = 0.1) {
        let screenCenter = Vector2.new(
            targetPos.X - Main.screenWidth / 2,
            targetPos.Y - Main.screenHeight / 2
        );

        Main.screenPosition = Vector2.Lerp(
            Main.screenPosition,
            screenCenter,
            lerpSpeed
        );
    }
}

export default CameraFX;
