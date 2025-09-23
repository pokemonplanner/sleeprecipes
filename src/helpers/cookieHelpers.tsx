import { Pokemon } from "../assets/resources";

export const cookieToBox = (pokemon: Pokemon, cookieState: number) => {
    var retPokemon: Pokemon = {
      dexNumber: pokemon.dexNumber,
      originalDexNumber: pokemon.originalDexNumber,
      name: pokemon.name,
      berry: pokemon.berry,
      ingredient_1: pokemon.ingredient_1,
      ingredient_2: pokemon.ingredient_2,
      ingredient_3: pokemon.ingredient_3
    }
    // It's possible the user clicked the pokemon before the cookie could load.  If so, maintain that state
    if (pokemon.ingredientLevel60 == true) {
      retPokemon.ingredientLevel60 = true;
    }
    // Else, check the cookie
    else if (cookieState >= 4) {  // 100
      cookieState -= 4;
      if (pokemon?.ingredient_3 !== "Unknown")
        retPokemon.ingredientLevel60 = true;
    }
    if (pokemon.ingredientLevel30 == true) {
      retPokemon.ingredientLevel30 = true;
    }
    else if (cookieState >= 2) {  // 010
      cookieState -= 2;
      if (pokemon?.ingredient_2 !== "Unknown")
        retPokemon.ingredientLevel30 = true;
    }
    if (pokemon.Perf == true) {
      retPokemon.Perf = true;
    }
    else if (cookieState >= 1) {  // 001
      cookieState -= 1;
      retPokemon.Perf = true;
    }
    return retPokemon;
}

export const getBoxCookie = (pokedex: Pokemon[]) => {
    var cookie = getCookie("pokemon");

    var cookies = cookie.split(",");

    var cookiePokemon = pokedex.map(p => {
      var currCookie = cookies.find(c => c.split("#")[0] == p.dexNumber)?.split("#")[1];
      if (currCookie == undefined) return p;
      return cookieToBox(p, +currCookie);
    })

    // setSelectedPokemon(cookiePokemon);
    return cookiePokemon;
}

export const boxToCookie = (pokemon: Pokemon) => {
    var cookieState = 0;
    if (pokemon.Perf) cookieState += 1;              // 001
    if (pokemon.ingredientLevel30) cookieState += 2; // 010
    if (pokemon.ingredientLevel60) cookieState += 4; // 100
    return cookieState;
}

export const setBoxCookie = (selectedPokemon: Pokemon[]) => {
    var cookie = selectedPokemon.map(p => p.dexNumber + "#" + boxToCookie(p)).join(',');

    document.cookie = "pokemon=" + cookie;
}

export const getCookie = (name: string) => {
    const cookie = "; " + document.cookie;
    const parts = cookie.split("; " + name + "=");
    if (parts.length == 2) return parts.pop()!.split(";").shift()!;
    else return "";
}