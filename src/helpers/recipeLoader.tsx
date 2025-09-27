import axios from "axios";
import { Recipe, savedRecipes } from "../assets/resources";

type PokemonSleepRecipeEntry = {
  "name": "string",
  "displayName": "string",
  "ingredients": [
    {
      "amount": 0,
      "ingredient": {
        "name": "string",
        "value": 0,
        "taxedValue": 0,
        "longName": "string"
      }
    }
  ],
  "value": 0,
  "valueMax": 0,
  "type": "curry",
  "bonus": 0,
  "nrOfIngredients": 0
}

export const getRecipes = async () => {
  try {
    const recipes = await axios.get("https://api.sleepapi.net/api/meal") as {data: string[]};
    let updatedRecipes = [...savedRecipes.recipes];

    for (const recipe of recipes.data) {
        if (updatedRecipes.filter(r => recipe === r.RecipeApiName).length > 0) continue;

        try {
            const recipeInfoRaw = await axios.get(`https://api.sleepapi.net/api/meal/${recipe}`) as {data: PokemonSleepRecipeEntry};
            const recipeInfo = recipeInfoRaw.data;
            
            const recipeEntry = {
                Recipe: recipeInfo.displayName,
                RecipeApiName: recipeInfo.name,
                Type: recipeInfo.type,
                Total_ingredients: recipeInfo.nrOfIngredients + "",
            } as Recipe;

            for (const ingredientInfo of recipeInfo.ingredients) {
              recipeEntry[ingredientInfo.ingredient.name as keyof Recipe] = ingredientInfo.amount + "";
            }

            updatedRecipes.push(recipeEntry);
        } catch (e) {
            console.log(e)
        }
    }
    return {recipes: updatedRecipes, loaded: true};
  } catch (e) {
    console.log(e)
    return {recipes: savedRecipes.recipes};
  }
}