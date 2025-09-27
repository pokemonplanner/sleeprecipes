import { useEffect, useState } from 'react';
import './App.css'
import { Column } from './components/generic/Column'
import { MainPage } from './components/primary-widgets/main-page/MainPage'
import { CustomIngredientState, IngredientLevel, Pokemon, Recipe, Recipes, TypeGroup, TypeGroups, savedPokedex, savedRecipes, savedTypeGroups } from './assets/resources';
import { getBoxCookie, setBoxCookie } from './helpers/cookieHelpers';
import { loadAllTypeGroups } from './helpers/typeGroupLoader';
import { getPokedex } from './helpers/pokemonSleepLoader';
import { getRecipes } from './helpers/recipeLoader';

export type AppContext = {
  selectedPokemon: Pokemon[],
  togglePokemon: (source: Pokemon) => void,
  selectPokemon: (source: Pokemon) => void,
  selectPokemonIngredients: (source: Pokemon, lvl: IngredientLevel) => void,
  customIngredientSelectorState: CustomIngredientState,
  setCustomIngredientSelectorState: React.Dispatch<React.SetStateAction<CustomIngredientState>>,
  typeGroups: TypeGroup[] | undefined,
  typeGroupsLoaded: boolean | undefined,
  recipes: Recipe[],
  recipesLoaded: boolean | undefined
}

const getBoxInit = (pokedex: Pokemon[]) => {
  const cookie = getBoxCookie(pokedex);
  if (cookie.length > 0) return cookie
  return pokedex;
}

function App() {

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon[]>(getBoxInit(savedPokedex));
  const [typeGroups, setTypeGroups] = useState<TypeGroups>(savedTypeGroups);
  const [recipes, setRecipes] = useState<Recipes>(savedRecipes);
  const [customIngredientSelectorState, setCustomIngredientSelectorState] = useState<CustomIngredientState>({ isActive: false });

  useEffect(() => {
    // Only set cookie after cookie data is in play - in this app, that is after the selectedPokemon record has been updated
    if (typeGroups.loaded) {
      setBoxCookie(selectedPokemon);
    }
  }, [selectedPokemon])

  const loadPokemonData = async () => {
    const updatedPokedex    = await getPokedex(selectedPokemon);
    const updatedTypeGroups = await loadAllTypeGroups(updatedPokedex, typeGroups);
    setSelectedPokemon(getBoxInit(updatedPokedex))
    setTypeGroups     (updatedTypeGroups);
  }

  const loadRecipeData = async () => {
    setRecipes(await getRecipes());
  }

  useEffect(() => {
    loadPokemonData();
    loadRecipeData();
  }, []);

  const togglePokemon = (source: Pokemon) => {
      const index = selectedPokemon.findIndex(oP => oP.dexNumber == source.dexNumber);
      if (index == -1) {
        throw new Error("Pokemon not found!");
      }

      // Update the stored value
      var oP = selectedPokemon;
      // Only toggle this mon being considered in calculations - the user shouldn't have to reselect everything later.
      oP[index].Perf = !oP[index].Perf;
      setSelectedPokemon([...oP]);
  }

  const selectPokemon = (source: Pokemon) => {
      const index = selectedPokemon.findIndex(oP => oP.dexNumber == source.dexNumber);
      if (index == -1) {
        throw new Error("Pokemon not found!");
      }

      // Update the stored value
      var oP = selectedPokemon;
      // Only toggle this mon being considered in calculations - the user shouldn't have to reselect everything later.
      oP[index].Perf = true;
      setSelectedPokemon([...oP]);
  }

  const selectPokemonIngredients = (source: Pokemon, lvl: IngredientLevel) => {
      const index = selectedPokemon.findIndex(oP => oP.dexNumber == source.dexNumber);
      if (index == -1) {
        throw new Error("Pokemon not found!");
      }

      // Update the stored value
      var oP = selectedPokemon;

      // Make sure this selection is now considered too - saves an extra click for the user.
      oP[index].Perf = true;
      if      (lvl == IngredientLevel.Lvl0)  { }
      else if (lvl == IngredientLevel.Lvl30) { oP[index].ingredientLevel30 = !oP[index].ingredientLevel30}
      else if (lvl == IngredientLevel.Lvl60) { oP[index].ingredientLevel60 = !oP[index].ingredientLevel60;}
      setSelectedPokemon([...oP]);
  }

  return (
    <>
      <Column>
        <MainPage context={{
          selectedPokemon,
          togglePokemon,
          selectPokemon,
          selectPokemonIngredients,
          customIngredientSelectorState,
          setCustomIngredientSelectorState, 
          typeGroups: typeGroups.groups,
          typeGroupsLoaded: typeGroups.loaded,
          recipes: recipes.recipes,
          recipesLoaded: recipes.loaded
        }}/>
        {/* <PokemonList context={{selectedPokemon, togglePokemon, selectPokemon, selectPokemonIngredients}}/> */}
      </Column>
    </>
  )
}

export default App

/**
 * TODO:
 *  - Partial loads?
 */