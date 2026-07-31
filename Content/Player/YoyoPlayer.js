
GlobalImports.AllModules()
const { ProjectileID, BuffID, ItemID } = Terraria.ID;
const { Main, NPC, Player } = Terraria;


const Projectile = new NativeClass("Terraria", "Projectile");
const NewProjectile = Projectile['int NewProjectile(IEntitySource spawnSource, Vector2.new2 position, Vector2.new2 velocity, int Type, int Damage, float KnockBack, int Owner, float ai0, float ai1, float ai2, NewProjectileModifier modifer)'];

export class YoyoPlayer extends ModPlayer {
    constructor() {
        super();
        // Variáveis de instância (não estáticas) para que funcionem individualmente por jogador
        this.FrostPouch = false;
        this.MasterYoyoPouch = false;
        this.ProfessionalString = false;
        this.SandStormPouch = false;
        this.SlimyString = false;
        this.YoyoBag = false;

        this.SandStormPouchCD = 0;
        this.ExtraYoyo = false;
        this.MaxYoyoCount = 0;
        this.YoyoCount = 0;
    }

    ResetEffects(player) {
        this.FrostPouch = false;
        this.MasterYoyoPouch = false;
        this.ProfessionalString = false;
        this.SandStormPouch = false;
        this.SlimyString = false;
        this.YoyoBag = false;
        this.ExtraYoyo = false;
    }

    UpdateEquips(player) {
        if (this.MasterYoyoPouch) {
            this.ExtraYoyo = true;
            this.MaxYoyoCount = 1;
            if (!player.channel) {
                this.YoyoCount = 0; // Reseta o contador quando solta o botão de ataque
            }
        }

        if (this.ProfessionalString) {
            player.meleeDamage += 0.05;
            player.yoyoString = true;
            player.stringColor = 13;
        }

        if (this.YoyoBag) {
            player.yoyoGlove = true;
            player.counterWeight = 556 + Math.floor(Math.random() * 6);
            player.yoyoString = true;
            player.stringColor = 0;
        }

        if (this.SandStormPouch) {
            this.SandStormPouchCD++;
        }
    }
    
    OnHitNPCWithProj(player, target, proj) {
        // Correção: Pega o item do player que está executando a ação, não do Main.player[0]
        const item = player.HeldItem; 
        const heldYoyo = Terraria.ID.ItemID.Sets.Yoyo[item.type];

        // Só gera o segundo ioiô se o projétil que bateu NÃO for o segundo ioiô (evita loop infinito
        
        let ai = new ProjAI(proj)
        
        if (this.ExtraYoyo && heldYoyo && ai[0] !== -1.0) {
            if (this.YoyoCount < this.MaxYoyoCount) {
                this.YoyoCount++;
                
                // Calcula uma velocidade inicial na direção do cursor ou do alvo para o ioiô se mover
                const heading = Vector2.new(target.Center.X - player.Center.X, target.Center.Y - player.Center.Y);
                Vector2.Normalize(heading);
                
                const launchVelocity = Vector2.new(heading.X * 16.0, heading.Y * 16.0); // Velocidade padrão de disparo

                // Dispara o segundo ioiô. Passamos -1.0 na ai0 para podermos identificar que ele é o ioiô extra
                const SecondYoyo = NewProjectile(
                    Projectile.GetNoneSource(), 
                    player.Center, 
                    launchVelocity, 
                    item.shoot, 
                    item.damage, 
                    0.0, 
                    player.whoAmI, // Usa o ID correto do player local
                    -1.0, 
                    0.0, 
                    0.0, 
                    null
                );
            }
        }

        if (this.SlimyString && heldYoyo) {
            target.AddBuff(137, 120, false);
        }

        if (this.FrostPouch) {
            target.AddBuff(324, 90, false);
        }

        if (this.SandStormPouch && heldYoyo) {
            if (this.SandStormPouchCD >= 600) {
                const ProjPosition = Vector2.new(target.Center.X, target.Center.Y);
                const SandStormPouchProj = NewProjectile(
                    Projectile.GetNoneSource(), 
                    ProjPosition, 
                    Vector2.new(0, 0), 
                    ProjectileID.SandnadoFriendly, 
                    Math.floor(item.damage * 0.2), 
                    0.0, 
                    player.whoAmI, 
                    0.0, 
                    0.0, 
                    0.0, 
                    null
                );
                Main.projectile[SandStormPouchProj].timeLeft = 60 * 5;
                this.SandStormPouchCD = 0;
            }
        }
    }
}
