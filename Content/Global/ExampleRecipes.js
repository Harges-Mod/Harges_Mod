import { Terraria } from './../../TL/ModImports.js';
import { ModSystem } from './../../TL/ModSystem.js';
import { ModRecipe } from './../../TL/ModRecipe.js';
import { ModItem } from './../../TL/ModItem.js';

const { ItemID, TileID } = Terraria.ID;

/*
 * This is a complete example of adding recipes and recipe groups
 * See the vanilla RecipeGroups at Terraria.ID.RecipeGroups
 */
export class ExampleRecipes extends ModSystem {
    static CustomGroups = new Map();
    
    constructor() {
        super();
    }
    
    // Here we will create all our RecipeGroups, they are used so that a recipe accepts a group of items instead of a specific ingredient
    AddRecipeGroups() {
        // Create a group that accepts both ExampleItem and ExampleSoul
        const ExampleGroup = ModRecipe.CreateRecipeGroup(
            // The name of the group, the game will display it as "Any Example Item"
            'Example Item',
            // The list of items accepted in this group
            [
                ModItem.getTypeByName('ExampleItem'),
                ModItem.getTypeByName('ExampleSoul')
            ] 
        );
        
        // Here we will save our group in the class to use later
        ExampleRecipes.CustomGroups.set('ExampleGroup', ExampleGroup);
    }
    
    // In this method, we will add our recipes
    AddRecipes() {
        // First, create a new instance of ModRecipe
        let recipe = new ModRecipe();
        
        // Now determine the recipe result
        // In this example, we will make the Rod of Discord
        recipe.SetResult(ItemID.RodofDiscord, 1); // stack = 1
        
        // Now we will add the ingredients (max: 14)
        recipe.AddIngredient(ItemID.ChaosFish, 10);
        recipe.AddIngredient(ItemID.HallowedBar, 20);
        recipe.AddIngredient(ItemID.SoulofFright, 5);
        recipe.AddIngredient(ItemID.SoulofMight, 5);
        recipe.AddIngredient(ItemID.SoulofSight, 5);
        
        // Now we will define the crafting station
        recipe.AddTile(TileID.MythrilAnvil);
        
        // And finally, add the recipe
        recipe.Register();
        
        // ModRecipe methods return the instance, which allows for chaining calls
        new ModRecipe()
        .SetResult(ItemID.LifeCrystal)
        .AddIngredient(ItemID.LesserHealingPotion, 50)
        .AddTile(TileID.WorkBenches)
        .Register();
        
        // To use multiple ingredients, add Recipe Groups. For example, make the recipe work with both Iron Bar and Lead Bar
        recipe = new ModRecipe(); // We are assigning a new instance of ModRecipe to the recipe variable declared earlier
        recipe.SetResult(ItemID.SpikyBall, 50);
        recipe.AddIngredient(ItemID.IronBar, 1);
        recipe.AddRecipeGroup('IronBar'); // We'll add the IronBar group, and then the recipe will work with both iron and lead bars
        recipe.AddTile(TileID.Anvils);
        // You can also set special conditions for the recipe to become available
        recipe.SetProperty('needSnowBiome', true); // This recipe will only work in the snow biome
        recipe.Register();
        
        const exampleGroup = ExampleRecipes.CustomGroups.get('ExampleGroup');
        // Now we will create a recipe using our custom group created earlier
        new ModRecipe()
        .SetResult(ModItem.getTypeByName('ExampleMeleeWeapon'))
        .AddIngredient(ModItem.getTypeByName('ExampleItem'), 50)
        .AddRecipeGroup(exampleGroup)
        .Register();
    }
}