import { ModRecipe } from './ModRecipe.js';

export class GlobalItem {
    static RegisteredItems = [];
    constructor() {}
    
    SetDefaults(item) {
        
    }
    
    AllowPrefix(item, pre) {
        return true;
    }
    
    /** @deprecated */
    ChoosePrefix(item, rolledPrefix, rollablePrefixes) {
        return -1;
    }
    
    CanUseItem(item, player) {
        return true;
    }
    
    CanAutoReuseItem(item, player) {
        return true;
    }
    
    UseStyle(item, player, mountOffset, heldItemFrame) {
        
    }
    
    HoldStyle(item, player, mountOffset, heldItemFrame) {
        
    }
    
    HoldItem(item, player) {
        
    }
    
    UseTimeMultiplier(item, player) {
        return 1.0;
    }
    
    UseAnimationMultiplier(item, player) {
        return 1.0;
    }
    
    UseSpeedMultiplier(item, player) {
        return 1.0;
    }
    
    UseItem(item, player) {
        return true;
    }
    
    UseAnimation(item, player) {
        
    }
    
    GetHealLife(item, player, healValue) {
        return healValue;
    }
    
    GetHealMana(item, player, healValue) {
        return healValue;
    }
    
    OnMissingMana(item, player, neededMana) {
        
    }
    
    OnConsumeMana(item, player, manaConsumed) {
        
    }
    
    ModifyManaCost(item, player, mana) {
        return mana;
    }
    
    ModifyWeaponDamage(item, player, damage) {
        return damage;
    }
    
    // Called only if the item can shoot
    ModifyWeaponKnockback(item, player, knockBack) {
        return knockBack;
    }
    
    CanShoot(item, player) {
        return true;
    }
    
    // stats = { position, velocity, type, damage, knockBack, scale };
    ModifyShootStats(item, player, stats) {
        
    }
    
    Shoot(item, player, position, velocity, type, damage, knockBack) {
        return true;
    }
    
    OnHitNPC(item, player, npc, damageDone, knockBack) {
        
    }
    
    CanAccessoryBeEquippedWith(incomingItem, equippedItem, player) {
        return null;
    }
    
    UpdateInventory(item, player) {
        
    }
    
    UpdateEquip(item, player) {
        
    }
    
    UpdateAccessory(item, player, vanity, hideVisual) {
        
    }
    
    UpdateArmorSet(item, player) {
        
    }
    
    UpdateVanitySet(item, player) {
        
    }
    
    WingMovement(item, player) {
        
    }
    
    CanPickup(item, player) {
        return true;
    }
    
    OnPickup(item, player) {
        
    }
    
    OnCraft(item, player, recipe) {
        
    }
    
    GetAlpha(item, color) {
        return color;
    }
    
    // only if Terraria.ID.ItemID.Sets.ExtractinatorMode[item.type] > 0
    // Return false to prevent vanilla behavior
    ExtractinatorUse(item, player, extractType, extractinatorBlockType) {
        return true;
    }
    
    IsAnglerQuestAvailable() {
        return true;
    }
    
    PreDrawInInventory(item, context, sb, position, scale, maxScale, color, itemFade, flip) {
        return true;
    }
    
    PostDrawInInventory(item, context, sb, position, scale, maxScale, color, itemFade, flip) {
        
    }
    
    AddRecipeGroups() {
        
    }
    
    AddRecipes() {
        
    }
    
    CreateRecipe(itemId, stack = 1) {
        return new ModRecipe().SetResult(itemId, stack);
    }
    
    static register(gItem) {
        this.RegisteredItems.push(new gItem());
    }
    static getByName(name) {
        return this.RegisteredItems.find(i => i.constructor.name === name);
    }
}