/**
 * This file calls an api for Pokemon Sleep information,
 *  so we can build a pokedex with P.Sleep relevant stats.
 * More info on the api here: https://api.sleepapi.net/docs/#/pokemon/GetPokemonWithName
 */

import axios from "axios"
import { Pokemon } from "../assets/resources"

type PokemonSleepMonIngredient = {
  "amount": 0,
  "ingredient": {
    "name": string,
    "value": 0,
    "taxedValue": 0,
    "longName": string
  }
}

type PokemonSleepDexEntry = {
  "ingredient60": PokemonSleepMonIngredient[],
  "ingredient30": PokemonSleepMonIngredient[],
  "ingredient0": PokemonSleepMonIngredient[],
  "remainingEvolutions": 0,
  "previousEvolutions": 0,
  "carrySize": 0,
  "genders": {
    "male": 0,
    "female": 0
  },
  "berry": {
    "name": "string",
    "value": 0,
    "type": "string"
  },
  "skillPercentage": 0,
  "ingredientPercentage": 0,
  "frequency": 0,
  "specialty": "berry",
  "pokedexNumber": 0,
  "displayName": "string",
  "name": "string",
  "skill": {
    "RP": [
      0
    ],
    "image": "string",
    "name": "string",
    "description": "string",
    "activations": {}
  }
}

const parsePokemonIngredient = (ingredientArray: PokemonSleepMonIngredient[], ingredientsSeen: string[]) => {
  const filteredIngredients = ingredientArray.filter(i => !ingredientsSeen.includes(i.ingredient.name));
  // Common at level 60
  if (filteredIngredients.length === 0) return '0';
  // Normal case
  if (filteredIngredients.length === 1) {
    ingredientsSeen.push(filteredIngredients[0].ingredient.name);
    return filteredIngredients[0].ingredient.name;
  }
  // Darkrai
  if (filteredIngredients.filter(i => i.ingredient.name === 'Locked').length > 0)
    return 'Unknown';
  // No pokemon should reach this
  return 'Unknown';
}

const regions = [
    "PALDEAN",
    "ALOLAN",
    "GALARIAN",
    "HISUIAN",
]

const skip = [
    "HOLIDAY",
    "HALLOWEEN",
    "CHRISTMAS",
    "LOW_KEY"
]

export const getPokedex = async (pokedex: Pokemon[]) => {
  try {
    const pokemonList = await axios.get("https://api.sleepapi.net/api/pokemon") as {data: string[]};
    const updatedPokedex = [...pokedex];

    for(const pokemonName of pokemonList.data) {
      if (updatedPokedex.filter(p => p.name.toLocaleLowerCase() === pokemonName.toLocaleLowerCase()).length > 0
            || skip.filter(s => pokemonName.includes(s)).length > 0) continue
      try {
        const pokemonInfoRaw = await axios.get(`https://api.sleepapi.net/api/pokemon/${pokemonName}`) as {data: PokemonSleepDexEntry};
        const regionFormArr = regions.filter(r => pokemonInfoRaw.data.name.includes(r));

        const pokemonInfo = pokemonInfoRaw.data;

        // Dex number should be unique; mark regional variants
        //      (note - I could just add berry to dex number, but I do need to build variant strings for getting the url at some point, so might as well now)
        let dexNumber = pokemonInfo.pokedexNumber + "";
        let originalDexNumber = dexNumber;
        if (regionFormArr.length > 0) {
            const regionFormPieces = pokemonInfo.name.split('_')
            dexNumber = dexNumber + (`-${regionFormPieces[1] + regionFormPieces[0]}`).toLocaleLowerCase()
        }

        // Dex number should be unique; check if the pokemon is already in the DB
        if (updatedPokedex.filter(p => p.dexNumber === dexNumber).length > 0 
            && regionFormArr.length < 1) {
          continue;
        }
        

        const ingredients = [] as string[];
        const pokedexEntry = {
          berry: pokemonInfo.berry.name,
          dexNumber: dexNumber,
          originalDexNumber: originalDexNumber,
          ingredient_1: parsePokemonIngredient(pokemonInfo.ingredient0, ingredients),
          ingredient_2: parsePokemonIngredient(pokemonInfo.ingredient30, ingredients),
          ingredient_3: parsePokemonIngredient(pokemonInfo.ingredient60, ingredients),
          name: pokemonInfo.name,
        } as Pokemon;
        updatedPokedex.push(pokedexEntry);
      } catch (e) {
        console.log(e);
      }
    }
    return updatedPokedex;
  } catch (e) {
    console.log(e)
    return pokedex;
  }
}
