import { Terraria } from './ModImports.js';
import { ItemLoader } from './Loaders/ItemLoader.js';

const maxRequirements = 14;

export class ModRecipe {
    static MAX_RECIPES = 3600;
    static MAX_VANILLA_RECIPES = 3570;
    
    constructor() {
        this.numIngredients = 0;
        this.craftingStation = -1;
        this.customShimmerResults = [];
    }
    
    SetResult(itemId, stack = 1) {
        Terraria.Recipe.currentRecipe.createItem['void SetDefaults(int Type, ItemVariant variant)'](itemId, null);
        Terraria.Recipe.currentRecipe.createItem.stack = Math.max(1, Math.min(stack, Terraria.Recipe.currentRecipe.createItem?.maxStack ?? 9999));
        return this;
    }
    
    /**
     * These are all the available properties:
     *   needHoney
     *   needWater
     *   needLava
     *   needTorchGodsFavor
     *   alchemy (It is set automatically when using the TileID 13)
     *   needSnowBiome
     *   needGraveyardBiome
     *   needMechdusa
     *   notDecraftable
     *   crimson
     *   corruption
     */
    SetProperty(propertyName, value) {
        Terraria.Recipe.currentRecipe[propertyName] = value;
        return this;
    }
    
    AddCustomShimmerResult(type, stack = 1) {
        if (type > 0) this.customShimmerResults.push(Terraria.Recipe.currentRecipe['Item AddCustomShimmerResult(int itemType, int itemStack)'](type, stack));
        return this;
    }
    
    AddIngredient(itemId, stack = 1) {
        if (this.numIngredients >= maxRequirements) {
            tl.log(`Failed to add ingredient <type: ${itemId}, stack: ${stack}>. The maximum number of ingredients has been reached (${maxRequirements}).`);
            return this;
        }
        if (ItemLoader.isModType(itemId)) {
            ItemLoader.getModItem(itemId).Item.material = true;
        }
        Terraria.ID.ItemID.Sets.IsAMaterial[itemId] = true;
        Terraria.Recipe.currentRecipe.requiredItem[this.numIngredients]['void SetDefaults(int Type, ItemVariant variant)'](itemId, null);
        Terraria.Recipe.currentRecipe.requiredItem[this.numIngredients].stack = Math.max(1, Math.min(stack, Terraria.Recipe.currentRecipe.requiredItem[this.numIngredients]?.maxStack ?? 9999));
        this.numIngredients++;
        return this;
    }
    
    AddRecipeGroup(groupOrName) {
        if (typeof groupOrName === 'string') groupOrName = ModRecipe.GetGroupByName(groupOrName);
        Terraria.Recipe.currentRecipe['void RequireGroup(RecipeGroup group)'](groupOrName);
        return this;
    }
    
    AddTile(tileId) {
        if (this.craftingStation !== -1) {
            tl.log(`Failed to add tile <type: ${tileId}>. The recipe already has a defined tile: ${this.craftingStation}`);
            return this;
        }
        Terraria.Recipe.currentRecipe['void SetCraftingStation(int tileType)'](tileId);
        this.craftingStation = tileId;
        return this;
    }
    
    Register() {
        const nextSlot = ModRecipe.NextSlot();
        
        if (nextSlot >= ModRecipe.MAX_RECIPES) {
            if (ModRecipe.skipRecipeLoop === false) {
                ModRecipe.skipRecipeLoop = true;
                tl.log(`Recipe limit reached: ${ModRecipe.MAX_RECIPES - ModRecipe.MAX_VANILLA_RECIPES}. To see all recipes, use the Recipe Limit Fix mod.`);
            }
            
            const index1 = nextSlot;
            Terraria.Main.recipe = Terraria.Main.recipe.cloneResized(index1 + 1);
            Terraria.Main.recipe[index1] = Terraria.Recipe.currentRecipe;
            
            const index2 = Terraria.Main.availableRecipe.length;
            Terraria.Main.availableRecipe = Terraria.Main.availableRecipe.cloneResized(index2 + 1);
            
            const index3 = Terraria.Main.availableRecipeY.length;
            Terraria.Main.availableRecipeY = Terraria.Main.availableRecipeY.cloneResized(index3 + 1);
        }
        
        //tl.log('\n' + '  New Recipe - Slot: ' + nextSlot + '\n  ' + Terraria.Recipe.currentRecipe['string ToString()']());
        
        Terraria.Recipe.AddRecipe();
    }
    
    static NextSlot() {
        if (!ModRecipe.skipRecipeLoop) {
            const recipeArr = Terraria.Main.recipe;
            for (let i = this.MAX_VANILLA_RECIPES; i < ModRecipe.MAX_RECIPES; i++) {
                const rec = recipeArr[i];
                if (rec && rec.createItem?.type === 0) return i;
            }
        }
        return Terraria.Main.recipe.length;
    }
    
    static GetGroupByName(name) {
        return Terraria.ID.RecipeGroups[name];
    }
    
    static CreateRecipeGroup(name, itemTypes = []) {
        const group = Terraria.RecipeGroup.new();
        group['void .ctor(string groupDescriptorKey, int[] validItems)'](name, itemTypes.makeGeneric('int'));
        
        for (const type of itemTypes) {
            if (ItemLoader.isModType(type)) Terraria.ID.ItemID.Sets.IsAMaterial[type] = true;
        }
        
        return group.Register();
    }
}