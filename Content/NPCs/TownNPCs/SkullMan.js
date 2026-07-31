const { Color, Effects, Vector2 } = Modules;
const { ItemDropRule } = Terraria.GameContent.ItemDropRules;
const { 
    BestiaryDatabaseNPCsPopulator,
    FlavorTextBestiaryInfoElement
} = Terraria.GameContent.Bestiary;

const NewProjectile = Terraria.Projectile['int NewProjectile(IEntitySource spawnSource, float X, float Y, float SpeedX, float SpeedY, int Type, int Damage, float KnockBack, int Owner, float ai0, float ai1, float ai2, NewProjectileModifier modifer)'];

export class SkullMan extends ModNPC {
    constructor() {
        super();
        this.Texture = 'NPCs/TownNPCs/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Terraria.Main.npcFrameCount[this.Type] = 25;
        
        Terraria.ID.NPCID.Sets.DangerDetectRange[this.Type] = 700;
        Terraria.ID.NPCID.Sets.ExtraFramesCount[this.Type] = 9;
        Terraria.ID.NPCID.Sets.AttackFrameCount[this.Type] = 4;
        Terraria.ID.NPCID.Sets.AttackType[this.Type] = 1;
        Terraria.ID.NPCID.Sets.AttackTime[this.Type] = 60;
        Terraria.ID.NPCID.Sets.AttackAverageChance[this.Type] = 35;
        Terraria.ID.NPCID.Sets.HatOffsetY[this.Type] = 4;
        Terraria.ID.NPCID.Sets.ShimmerTownTransform[this.Type] = true;
        
        Terraria.ID.NPCID.Sets.NPCBestiaryDrawOffset.Add(
            this.Type,
            Terraria.ID.NPCID.Sets.NPCBestiaryDrawOffset.get_Item(Terraria.ID.NPCID.Guide)
        );
        
        this.BestiaryRarityStars = 3;
        
        new NPCHappiness(this.Type)
        .SetNPCAffection(Terraria.ID.NPCID.Nurse, AffectionLevel.Hate)
        .SetNPCAffection(Terraria.ID.NPCID.Guide, AffectionLevel.Love)
        .SetNPCAffection(Terraria.ID.NPCID.Merchant, AffectionLevel.Dislike)
        .SetBiomeAffection(Terraria.ID.BiomeID.Desert, AffectionLevel.Hate);
    }
    
    SetDefaults() {
        this.NPC.townNPC = true;
        this.NPC.friendly = true;
        this.NPC.width = 18;
        this.NPC.height = 40;
        this.NPC.aiStyle = 7;
        this.NPC.damage = 10;
        this.NPC.defense = 15;
        this.NPC.lifeMax = 250;
        this.NPC.HitSound = Terraria.ID.SoundID.NPCHit1;
        this.NPC.DeathSound = Terraria.ID.SoundID.NPCDeath1;
        this.NPC.knockBackResist = 0.5;
        
        //this.AIType = Terraria.ID.NPCID.Guide;
        this.AnimationType = Terraria.ID.NPCID.Guide;
    }
    
    SetBestiary(database, bestiaryEntry) {
        // Surface Biome
        bestiaryEntry.Info.Add(BestiaryDatabaseNPCsPopulator.CommonTags.SpawnConditions.Biomes.Surface);
        
        // Sets the description of this NPC that is listed in the bestiary
        const FlavorText = FlavorTextBestiaryInfoElement.new();
        FlavorText._key = ModLocalization.Translate('Bestiary.SkullMan');
        bestiaryEntry.Info.Add(FlavorText);
    }
    
    // Sets the available names for this NPC
    SetNPCNameList() {
        const names = [
            'Jonan',
            'Luis',
            'David',
            'Jorge',
            'Matheus',
            'Luan'
        ];
        return names;
    }
    
    HitEffect(npc, hitDirection, damage) {
        if (Terraria.Main.netMode > 0) {
            return;
        }
        
        let numDust = npc.life > 0 ? 5 : 15;
        for (let k = 0; k < numDust; k++) {
            Effects.NewDustFromNPC(npc, Terraria.ID.DustID.Blood);
        }
        
        if (npc.life > 0) return;
        
        let variant = '';
       // if (npc.IsShimmerVariant)
            ///variant += '_Shimmer';
       // if (npc.altTexture == 1)
            //variant += '_Party';
        
      /*  let headGore = ModGore.getTypeByName(`${this.constructor.name}_Gore${variant}_Head`);
        let armGore = ModGore.getTypeByName(`${this.constructor.name}_Gore${variant}_Arm`);
        let legGore = ModGore.getTypeByName(`${this.constructor.name}_Gore${variant}_Leg`);
        
        Effects.NewGoreFromNPC(npc, headGore);
        Effects.NewGoreFromNPC(npc, armGore, true);
        Effects.NewGoreFromNPC(npc, armGore, true);
        Effects.NewGoreFromNPC(npc, legGore, true);
        Effects.NewGoreFromNPC(npc, legGore, true);*/
    }
    // Sets the conditions for this TownNPC to spawn
    CanTownNPCSpawn() {
        // Only spawns if there is a nurse in the world
        return Terraria.NPC.AnyNPCs(Terraria.ID.NPCID.Merchant);
    }
    
    // Sets special conditions for spawning
    CheckConditions(left, right, top, bottom) {
        // Only if the room is on the Surface or above
        return bottom <= Terraria.Main.worldSurface;
    }
    
    // Allows you to talk to the NPC
    GetChat(npc) {
        const keys = [
            'SkullMan_1',
            'SkullMan_2',
            'SkullMan_3',
            'SkullMan_4',
            'SkullMan_5'
            
        ];
        // Select a random key
        const key = keys[Math.floor(Math.random()*keys.length)];
        
        // Return the text the NPC will say
        return ModLocalization.Translate(`NPCChat.${key}`);
    }
    
    // Allows you to add buttons to your NPC's dialogue
    SetChatButtons(npc, player, button1, button2) {
        button1.text = Terraria.Localization.Language.GetText('LegacyInterface.28').Value;
        button1.texture = Terraria.GameContent.TextureAssets.NpcHead[this.NPCHeadSlot()].Value;
        button1.cost = 0;
    }
    
    // Open a shop by clicking the first button
    Option1Clicked(npc, player) {
        this.OpenShop(npc, player);
    }
    
    SetupShop(npc, player, npcShop) {
        // Remove all items to avoid duplicate items
        npcShop.Clear();
        
        // Fills the shop with 3 items at once
        npcShop.AddRange([
            ModItem.getTypeByName('GoldYoyo')
        ]);
        
        // ExampleYoyo (only at night)
        if (!Terraria.Main.dayTime) {
           // npcShop.Add(ModItem.getTypeByName('ExampleYoyo'));
        }
    }
    
    /*ModifyNPCHappiness(npc, player, PrimaryPlayerBiome, shopHelper, nearbyNPCsByType) {
        if (!Terraria.Main.dayTime) {
            // Increases the price of shop items if it's night time
            shopHelper._currentPriceAdjustment = 1000;
            // Displays special mood text
            shopHelper._currentHappiness = ModLocalization.Translate('TownNPCMood.SkullMan.ExampleSpecialMoodText');
        }
    }*/
    
    // Allows this NPC to be teleported to the King Statue
    // The 'toKingStatue' parameter will be false if it is a Queen Statue
    /*CanGoToStatue(npc, toKingStatue) {
        return toKingStatue;
    }*/
    
    TownNPCAttack(npc, justStarted, attackTime) {
        if (!justStarted) return;
        
        // Find the target
        let target = null;
        for (let i = 0; i < 200; i++) {
            let npc2 = Terraria.Main.npc[i];
            if (npc2.active && !npc2.friendly && npc2.damage > 0 && (npc2.noTileCollide || Terraria.Collision['bool CanHit(Vector2 Position1, int Width1, int Height1, Vector2 Position2, int Width2, int Height2)'](npc.Center, 0, 0, npc2.Center, 0, 0))) {
                target = npc2;
                break;
            }
        }
        if (!target) return;
        
        const speed = Vector2.Multiply(
            Vector2.Normalize(
                Vector2.Subtract(target.Center, npc.Center)
            ), 10
        );
        
        
        NewProjectile(
            Terraria.Projectile.GetNoneSource(),
            npc.Center.X, npc.Center.Y,
            speed.X, speed.Y,
            21,
            npc.damage, 3,
            Terraria.Main.myPlayer,
            0, 0, 0, null
        );
    }
}