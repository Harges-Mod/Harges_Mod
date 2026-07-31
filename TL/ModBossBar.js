import { Terraria } from './ModImports.js';
import { Modules } from './ModImports.js';

let { MathHelper, Vector2 } = Modules

import { ItemLoader } from './Loaders/ItemLoader.js';
import { ModRecipe } from './ModRecipe.js';
import { ModTexturedType } from './ModTexturedType.js';
import { ModLocalization } from './ModLocalization.js';


class ModBossBar extends ModTexturedType {
    constructor() {
        this.index = 0;
        this.life = 0;
        this.lifeMax = 0;
        this.shield = 0;
        this.shieldMax = 0;
    }
    
    get Life() { return this.life; }
    get LifeMax() { return this.lifeMax; }
    get Shield() { return this.shield; }
    get ShieldMax() { return this.shieldMax; }

    Register(bossBar) {
        BossBarLoader.AddBossBar(register new bossBar);
    }

    SetupContent() {
        this.SetStaticDefaults();
    }
    
    GetIconTexture(iconFrame) {
        return null;
    }

    ModifyInfo(info, lifeRef, lifeMaxRef, shieldRef, shieldMaxRef) {
        return null;
    }

    PreDraw(spriteBatch, npc, drawParams) {
        return true;
    }

    PostDraw(spriteBatch, npc, drawParams) {
    
    
    }

    ValidateAndCollectNecessaryInfo(info) {
        if (info.npcIndexToAimAt < 0 || info.npcIndexToAimAt > Main.maxNPCs) {
            return false;
        }

        let lifeRef = { val: this.life };
        let lifeMaxRef = { val: this.lifeMax };
        let shieldRef = { val: this.shield };
        let shieldMaxRef = { val: this.shieldMax };

        let modify = this.ModifyInfo(info, lifeRef, lifeMaxRef, shieldRef, shieldMaxRef);
        
        this.life = lifeRef.val;
        this.lifeMax = lifeMaxRef.val;
        this.shield = shieldRef.val;
        this.shieldMax = shieldMaxRef.val;

        if (modify === null || modify === undefined) {
            let npc = Main.npc[info.npcIndexToAimAt];

            if (!npc.active) {
                return false;
            }

            this.life = MathHelper.Clamp(npc.life, 0, npc.lifeMax);
            this.lifeMax = npc.lifeMax;

            return true;
        }

        return modify;
    }

    Draw(info, spriteBatch) {
        let iconFrameRef = { current: null };
        
        let iconTextureResult = this.GetIconTexture(iconFrameRef);
        let iconTexture = (iconTextureResult ?? TextureAssets.NpcHead[0]).Value;
        
        if (iconFrameRef.current === null) {
            iconFrameRef.current = iconTexture.Frame();
        }

        BigProgressBarHelper.DrawFancyBar(
            spriteBatch, 
            this.life, 
            this.lifeMax, 
            iconTexture, 
            iconFrameRef.current, 
            this.shield, 
            this.shieldMax
        );
    }
}
