import UParticle from './UParticle.js'

export class HargesGraphics {
    
    UParticle = UParticle

    
    PrettySparkle(pos, velocity, color, scale, timeToLive = 60, rotation = 0) {
		const particle = Terraria.GameContent.Drawing.ParticleOrchestrator._poolPrettySparkle.RequestParticle();

		particle.LocalPosition = pos; 
		particle.Velocity = velocity ?? Vector2.Zero;
		particle.ColorTint = color ?? Color.White;
		particle.Rotation = rotation;
        
		if (typeof scale === 'number') {
			particle.Scale = Vector2.new(scale, scale);
		} else if (scale) {
			particle.Scale = scale;
		} else {
			particle.Scale = Vector2.One;
		}
        
		particle.TimeToLive = timeToLive;
        
		return particle;
	}
	
    // Lighting Particle
    SpawnLightning(pos, velocity, color, scale = 1.0) {
        let num1 = Math.random() * 6.28318548;
        let num2 = Math.floor(Math.random() * 2) + 1; // Next(1, 3)
        let num3 = 0.7;
        let i = 916;
    
        let color1 = Color.new(255, 40, 30, 0);
        let color2 = Color.new(120, 0, 10, 0);
    
        for (let num4 = 0.0; num4 < 1.0; num4 += 1.0 / num2) {
            let f = 6.2831854820251465 * num4 + num1 + (Math.random() - 0.5) * 0.25;
            let num5 = Math.random() * 4.0 + 0.10000000149011612;
    
            let angle = Math.random() * Math.PI * 2;
            let dist = Math.random() * 6;
            let initialLocalPosition = Vector2.Multiply(
                Vector2.new(Math.cos(angle) * dist, Math.sin(angle) * dist),
                num3
            );
    
            let color3 = Color.Lerp(color, color2, Math.random());
    
            let particle = Terraria.GameContent.Drawing.ParticleOrchestrator._poolRandomizedFrame.RequestParticle();
    
            particle.SetBasicInfo(
                Terraria.GameContent.TextureAssets.Projectile[i],
                null,
                Vector2.Zero,
                initialLocalPosition
            );
    
            particle.SetTypeInfo(Terraria.Main.projFrames[i], 2, 10.0);
    
            let rotationVector = Vector2.new(Math.cos(f), Math.sin(f));
            particle.Velocity = Vector2.Add(
                Vector2.Multiply(
                    Vector2.Multiply(rotationVector, num5),
                    Vector2.new(1.0, 0.5)
                ),
                velocity ?? Vector2.Zero
            );
    
            particle.ColorTint = color3;
            particle.LocalPosition = Vector2.Add(pos, initialLocalPosition);
            particle.Rotation = Vector2.ToRotation(particle.Velocity);
            particle.Scale = Vector2.Multiply(Vector2.One, scale);
            particle.FadeInNormalizedTime = 0.01;
            particle.FadeOutNormalizedTime = 0.5;
            particle.ScaleVelocity = Vector2.new(0.025, 0.025);
    
            Terraria.Main.ParticleSystem_World_OverPlayers.Add(particle);
        }
    }
        
        // Storm Particle
        SpawnStormLightning(pos, movement, color) {
            let finalColor = color ?? Color.White;
        
            // Body
            let lightningParticle = Terraria.GameContent.Drawing.ParticleOrchestrator.StormLightningParticles.RequestParticle();
            let duration = 45;
            let x = Math.floor(movement.X);
        
            lightningParticle.Prepare(x, pos, duration, finalColor);
            Terraria.Main.ParticleSystem_World_OverPlayers.Add(lightningParticle);
        
            let endPos = lightningParticle.EndPosition;
        
            /*
            // Flash de impacto (camada externa, colorida)
            let scaleBase1 = Vector2.new(1.1, 1.1);
            let scaleVel1 = Vector2.new(-0.9, -0.9);
            let i1 = 1091;
        
            let fadingParticle1 = Terraria.GameContent.Drawing.ParticleOrchestrator._poolFading.RequestParticle();
            fadingParticle1.SetBasicInfo(
                Terraria.GameContent.TextureAssets.Projectile[i1],
                null,
                Vector2.Zero,
                endPos
            );
            fadingParticle1.SetTypeInfo(parseFloat(duration));
            fadingParticle1.ColorTint = finalColor;
            fadingParticle1.ColorTint.A = 0;
            fadingParticle1.FadeInNormalizedTime = 0.01;
            fadingParticle1.FadeOutNormalizedTime = 0.6;
            fadingParticle1.Scale = scaleBase1;
            fadingParticle1.ScaleVelocity = Vector2.Multiply(scaleVel1, 1.0 / duration);
            fadingParticle1.ScaleAcceleration = Vector2.Multiply(fadingParticle1.ScaleVelocity, -1.0 / duration);
            Terraria.Main.ParticleSystem_World_OverPlayers.Add(fadingParticle1);
        
            // Flash de impacto (camada interna, branca)
            let fadingParticle2 = Terraria.GameContent.Drawing.ParticleOrchestrator._poolFading.RequestParticle();
            fadingParticle2.SetBasicInfo(
                Terraria.GameContent.TextureAssets.Projectile[i1],
                null,
                Vector2.Zero,
                endPos
            );
            fadingParticle2.SetTypeInfo(parseFloat(duration));
            fadingParticle2.ColorTint = Color.new(255, 255, 255, 255);
            fadingParticle2.FadeInNormalizedTime = 0.01;
            fadingParticle2.FadeOutNormalizedTime = 0.6;
            fadingParticle2.Scale = Vector2.Multiply(scaleBase1, 0.7);
            fadingParticle2.ScaleVelocity = Vector2.Multiply(Vector2.Multiply(scaleVel1, 0.7), 1.0 / duration);
            fadingParticle2.ScaleAcceleration = Vector2.Multiply(fadingParticle2.ScaleVelocity, -1.0 / duration);
            Terraria.Main.ParticleSystem_World_OverPlayers.Add(fadingParticle2);
        
            // Rajada de faíscas ao redor do impacto
            let sparkCount = 12;
            let i2 = 916;
        
            for (let num4 = 0.0; num4 < 1.0; num4 += 1.0 / sparkCount) {
                let timeToLive = Math.floor(Math.random() * (22 - 14)) + 14;
        
                let angle = Math.random() * Math.PI * 2;
                let dist = Math.random() * 6;
                let initialLocalPosition = Vector2.Multiply(
                    Vector2.new(Math.cos(angle) * dist, Math.sin(angle) * dist),
                    0.7
                );
        
                let velAngle = Math.random() * Math.PI * 2;
                let velDist = Math.random() * 6;
                let sparkVelocity = Vector2.new(Math.cos(velAngle) * velDist, Math.sin(velAngle) * velDist);
        
                let spark1 = Terraria.GameContent.Drawing.ParticleOrchestrator._poolRandomizedFrame.RequestParticle();
                spark1.SetBasicInfo(
                    Terraria.GameContent.TextureAssets.Projectile[i2],
                    null,
                    Vector2.Zero,
                    initialLocalPosition
                );
                spark1.SetTypeInfo(Terraria.Main.projFrames[i2], 3, parseFloat(timeToLive));
                spark1.Velocity = sparkVelocity;
                spark1.ColorTint = finalColor;
                spark1.LocalPosition = Vector2.Add(endPos, initialLocalPosition);
                spark1.Rotation = Vector2.ToRotation(spark1.Velocity);
                spark1.Scale = Vector2.Multiply(Vector2.new(1.5, 0.75), 0.85);
                spark1.FadeInNormalizedTime = 0.01;
                spark1.FadeOutNormalizedTime = 0.0;
                spark1.ScaleVelocity = Vector2.new(0.025, 0.025);
                Terraria.Main.ParticleSystem_World_OverPlayers.Add(spark1);
        
                let spark2 = Terraria.GameContent.Drawing.ParticleOrchestrator._poolRandomizedFrame.RequestParticle();
                spark2.SetBasicInfo(
                    Terraria.GameContent.TextureAssets.Projectile[i2],
                    null,
                    Vector2.Zero,
                    initialLocalPosition
                );
                spark2.SetTypeInfo(Terraria.Main.projFrames[i2], 3, parseFloat(timeToLive));
                spark2.Velocity = spark1.Velocity;
                spark2.ColorTint = Color.new(255, 255, 255, 0);
                spark2.LocalPosition = spark1.LocalPosition;
                spark2.Rotation = spark1.Rotation;
                spark2.Scale = Vector2.Multiply(spark1.Scale, 0.5);
                spark2.FadeInNormalizedTime = spark1.FadeInNormalizedTime;
                spark2.FadeOutNormalizedTime = spark1.FadeOutNormalizedTime;
                spark2.ScaleVelocity = Vector2.Multiply(spark1.ScaleVelocity, 0.5);
                Terraria.Main.ParticleSystem_World_OverPlayers.Add(spark2);
            }
            */
    }
}