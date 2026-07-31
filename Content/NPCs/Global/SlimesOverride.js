using('Terraria');
using('Terraria.ID');

export class SlimesOverride extends GlobalNPC {
    IsSlime(npcType) {
        switch (npcType) {
            case NPCID.BlueSlime:
            case NPCID.BlackSlime:
            case NPCID.Pinky:
            case NPCID.SlimeRibbonGreen:
            case NPCID.SlimeRibbonRed:
            case NPCID.SlimeRibbonWhite:
            case NPCID.SlimeRibbonYellow:
            case NPCID.SlimeMasked:
            case NPCID.Slimeling:
            case NPCID.Slimer:
            case NPCID.Slimer2:
            case NPCID.SlimeSpiked:
            case NPCID.BabySlime:
            case NPCID.CorruptSlime:
            case NPCID.DungeonSlime:
            case NPCID.GoldenSlime:
            case NPCID.GreenSlime:
            case NPCID.IceSlime:
            case NPCID.JungleSlime:
            case NPCID.IlluminantSlime:
            case NPCID.LavaSlime:
            case NPCID.MotherSlime:
            case NPCID.PurpleSlime:
            case NPCID.QueenSlimeMinionPink:
            case NPCID.QueenSlimeMinionPurple:
            case NPCID.RainbowSlime:
            case NPCID.RedSlime:
            case NPCID.SandSlime:
            case NPCID.SpikedIceSlime:
            case NPCID.SpikedJungleSlime:
            case NPCID.UmbrellaSlime:
            case NPCID.YellowSlime:
            case NPCID.Crimslime:
            case NPCID.BigCrimslime:
            case NPCID.LittleCrimslime:
            case NPCID.ToxicSludge:
                return true;
            default:
                return false;
        }
    }
    
    OnHitPlayer(npc, player, damageSource, damage, hitDirection, pvp, quiet, crit, cooldownCounter, dodgeable) {
    
        // Removed
        /*if (npc.aiStyle === 1 || npc.type === NPCID.Slimer || npc.type === NPCID.ToxicSludge) {
            player.AddBuff(BuffID.Slimed, 120, true);
        }*/

    }
}
