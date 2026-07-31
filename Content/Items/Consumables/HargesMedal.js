import { Terraria } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';
import { ModNPC } from './../../../TL/ModNPC.js';

const PlaySound = (id, position) => Terraria.Audio.SoundEngine['void PlaySound(int type, Vector2 position, int style, float pitchOffset)'](id, position, 1, 0);

export class ExampleBossSummonItem extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Consumables/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        //Terraria.ID.ItemID.Sets.SortingPriorityBossSpawns[this.Type] = 12;
    }
    
    SetDefaults() {
        this.Item.value = Terraria.Item.sellPrice(0, 0, 1, 0);
        this.Item.rare = Terraria.ID.ItemRarityID.Blue;
        this.Item.useAnimation = 30;
        this.Item.useTime = 30;
        this.Item.useStyle = Terraria.ID.ItemUseStyleID.HoldUp;
        this.Item.consumable = true;
    }
    
    PostSetupContent() {
        this.BossType = ModNPC.getTypeByName('ExampleBoss');
    }
    
    CanUseItem(item, player) {
        return !Terraria.Main.dayTime && !Terraria.NPC.AnyNPCs(this.BossType);
    }
    
    UseItem(item, player) {
        if (player.whoAmI === Terraria.Main.myPlayer) {
            PlaySound(Terraria.ID.SoundID.Roar, player.position);
            Terraria.NPC.SpawnOnPlayer(player.whoAmI, this.BossType, 0, 0, 0, 0);
        }
    }
}