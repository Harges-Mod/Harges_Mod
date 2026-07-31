const NewCombatText = CombatText["int NewText(Rectangle location, Color color, string text, bool dramatic, bool dot)"];

export class BloodOrb extends ModProjectile {

    constructor() {
        super();
        this.Texture = 'Projectiles/' + this.constructor.name;
        
        // Histórico de posições/rotações para o rastro fluido
        this.oldPos = [];
        this.oldRot = [];
        this.maxTrailLength = 8; // Mantém o rastro denso e leve
        
        this.basePosition = null; 
        this.targetPlayer = null; // Guarda a referência do jogador focado
        this.detectionRange = 180; // Raio em pixels para o orbe notar o jogador
    }
    
    SetStaticDefaults() {
        this.Orb = tl.texture.load("Textures/Projectiles/BloodOrb.png");  
    }
    
    SetDefaults() {  
        let proj = this.Projectile;
        
        proj.width = 22;
        proj.height = 22;
        proj.scale = 1;
        proj.aiStyle = -1;
        proj.friendly = false;
        proj.tileCollide = false;
        proj.penetrate = 1;
        proj.ranged = true;
    }

    static Intersects(rectA, rectB) {
        if (!rectA || !rectB) return false;

        return (
            rectA.X < rectB.X + rectB.Width &&
            rectA.X + rectA.Width > rectB.X &&
            rectA.Y < rectB.Y + rectB.Height &&
            rectA.Y + rectA.Height > rectB.Y
        );
    }
    
    AI(proj) {
        let ai = new ProjAI(proj);
        ai[0]++; // Timer geral para rotação e seno
        ai[1]++; // Timer de otimização (escaneamento)

        // Salva a posição inicial estática
        if (!this.basePosition) {
            this.basePosition = Vector2.new(proj.Center.X, proj.Center.Y);
        }

        // --- 1. PROCURA O JOGADOR A CADA 30 TICKS (OTIMIZAÇÃO) ---
        if (!this.targetPlayer && ai[1] >= 30) {
            ai[1] = 0; // Reseta o contador de escaneamento

            let projCenter = proj.Center;
            let closestDistSq = this.detectionRange * this.detectionRange;
            let foundPlayer = null;

            for (let i = 0; i < Main.player.length; i++) {
                let player = Main.player[i];
                if (player && player.active && !player.dead) {
                    let distSq = Vector2.DistanceSquared(projCenter, player.Center);
                    if (distSq < closestDistSq) {
                        closestDistSq = distSq;
                        foundPlayer = player;
                    }
                }
            }

            if (foundPlayer) {
                this.targetPlayer = foundPlayer;
            }
        }

        // --- 2. LÓGICA DE COMPORTAMENTO (ATRAÇÃO OU FLUTUAÇÃO) ---
        if (this.targetPlayer) {
            // Se o jogador foco morreu ou deslogou, perde o alvo
            if (!this.targetPlayer.active || this.targetPlayer.dead) {
                this.targetPlayer = null;
                this.basePosition = Vector2.new(proj.Center.X, proj.Center.Y); // Atualiza base para onde parou
            } else {
                // Persegue o jogador ativamente
                let direction = Vector2.Subtract(this.targetPlayer.Center, proj.Center);
                direction = Vector2.Normalize(direction);

                let speed = 12;
                // Suaviza a transição de aceleração (Inércia)
                proj.velocity = Vector2.Lerp(proj.velocity, Vector2.Multiply(direction, speed), 0.15);
                
                // Checa colisão enquanto persegue
                if (BloodOrb.Intersects(proj.Hitbox, this.targetPlayer.Hitbox)) {
                    proj.Kill();
                    return;
                }
            }
        } else {
            // Não há jogador perto -> Flutua no ar suavemente
            proj.velocity = Vector2.new(0, 0);

            let floatAmplitude = 5;
            let floatSpeed = 0.06;
            let offsetY = Math.sin(ai[0] * floatSpeed) * floatAmplitude;

            proj.position.X = this.basePosition.X - (proj.width / 2);
            proj.position.Y = (this.basePosition.Y - (proj.height / 2)) + offsetY;
        }

        proj.rotation += 0.08;

        // --- 3. ATUALIZAÇÃO DO RASTRO FLUIDO ---
        // Só registra novo ponto se se moveu pelo menos 3.5 pixels para economizar chamadas
        let currentCenter = Vector2.new(proj.Center.X, proj.Center.Y);
        if (this.oldPos.length === 0 || Vector2.DistanceSquared(this.oldPos[0], currentCenter) > 12) {
            this.oldPos.unshift(currentCenter);
            this.oldRot.unshift(proj.rotation);

            if (this.oldPos.length > this.maxTrailLength) {
                this.oldPos.pop();
                this.oldRot.pop();
            }
        }
    }

    PreDraw(proj, lightColor) {
        let baseScale = 0.1;
        let origin = Generic.getOrigin(this.Orb);
        let rect = Generic.getRect(this.Orb);

        let points = [Vector2.new(proj.Center.X, proj.Center.Y), ...this.oldPos];
        if (points.length < 2) return false;

        // Calcula a velocidade para aplicar deformação de fluido
        let speed = proj.velocity.Length();
        let stretch = Math.min(speed * 0.04, 0.45); // Tensão superficial ao mover

        // --- 1. RASTRO FLUIDO INTERPOLADO (SEM BUG/LAG) ---
        for (let i = points.length - 1; i > 0; i--) {
            let pA = points[i];
            let pB = points[i - 1];
            let progress = (points.length - i) / points.length;

            // 2 passos intermediários são o suficiente devido ao filtro de distância na AI
            let steps = 2;

            for (let j = 0; j < steps; j++) {
                let t = j / steps;
                let drawPos = Vector2.Lerp(pA, pB, t);

                // A gota afina na transição e alarga nos nós (viscosidade)
                let taper = Math.sin((progress + (t / points.length)) * Math.PI * 0.5);
                let dropShape = 1.0 - (Math.sin(t * Math.PI) * stretch);

                let scaleFactor = baseScale * taper * dropShape;
                if (scaleFactor < 0.01) continue; // Descarte de segurança para a GPU

                let scaleVector = Vector2.new(scaleFactor, scaleFactor);

                Generic.EntityDraw(
                    this.Orb,
                    Generic.toScreenPosition(drawPos),
                    rect,
                    Color.Red,
                    proj.rotation,
                    origin,
                    scaleVector,
                    SpriteEffects.None
                );
            }
        }

        // --- 2. NÚCLEO PRINCIPAL (CABEÇA DA GOTA) ---
        // Deforma o núcleo com base na velocidade de deslocamento
        let headScaleX = baseScale * (1.1 + stretch);
        let headScaleY = baseScale * (1.1 - stretch * 0.4);
        let headScale = Vector2.new(headScaleX, headScaleY);

        let moveRotation = speed > 0.1 ? Math.atan2(proj.velocity.Y, proj.velocity.X) + Math.PI / 2 : proj.rotation;

        Generic.EntityDraw(
            this.Orb,
            Generic.toScreenPosition(proj.Center),
            rect,
            Color.Red,
            moveRotation,
            origin,
            headScale,
            SpriteEffects.None
        );

        return false;
    }

    OnKill(proj, timeLeft) {
        let modPlayer = ModPlayer.getByName('HargesMMode');
       
        if (modPlayer) {
            modPlayer.BloodyCoverAbstinenceTimer = 0;
            modPlayer.ModHealEffect(4, Color.Red);
        }
    }
}
