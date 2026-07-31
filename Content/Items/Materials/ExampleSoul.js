import { Terraria, Modules } from './../../../TL/ModImports.js';
import { ModItem } from './../../../TL/ModItem.js';

const { Item, Lighting, Main } = Terraria;
const { ItemID, ItemRarityID } = Terraria.ID;
const { Color } = Modules;

const DrawAnimationVertical = new NativeClass('Terraria.DataStructures', 'DrawAnimationVertical');
const Vector3 = new NativeClass('Microsoft.Xna.Framework', 'Vector3');
const AddLight = Lighting['void AddLight(Vector2 position, Vector3 rgb)'];
const Multiply = Vector3['Vector3 Multiply(Vector3 value1, float scaleFactor)'];

export class ExampleSoul extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Materials/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        const anim = DrawAnimationVertical.new();
        anim.Frame = 0;
        anim.FrameCounter = 0;
        anim.FrameCount = 4;
        anim.TicksPerFrame = 6;
        anim.PingPong = false;
        Main.RegisterItemAnimation(this.Type, anim);
        
        ItemID.Sets.AnimatesAsSoul[this.Type] = true;
        ItemID.Sets.ItemIconPulse[this.Type] = true;
        ItemID.Sets.ItemNoGravity[this.Type] = true;
        
        this.CloneDefaults(ItemID.SoulofSight);
        
        this.SoulColor = Color.SkyBlue.ToVector3();
    }
    
    SetDefaults() {
        this.Item.rare = ItemRarityID.Pink;
        this.Item.value = Item.buyPrice(0, 1, 0, 0);
        this.Item.maxStack = ModItem.CommonMaxStack;
    }
    
    GetAlpha(item, color) {
        if (item.active) {
            AddLight(item.Center, Multiply(this.SoulColor, 0.45 * Main.essScale));
        }
        return Color.White;
    }
}