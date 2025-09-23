/**
 * This file calls an api for Pokemon information,
 *  so we can organize Pokemon by type groups.
 * More info on the api here: https://pokeapi.co/docs/v2#evolution-section
 */

import axios from "axios"
import { Pokemon, TypeGroup, TypeGroups } from "../assets/resources"

type ChainLink = {
  "species": EvoInfo,
  "evolves_to": ChainLink[]
}

type EvoInfo = {
  "name": string,
  "url": string
}

// Primary response format from evolution line endpoint
type EvoApiCall = {
  "id": number,
  "chain": ChainLink
}

// Types for the information we gather while processing data from the api calls in this file
type Group = {ids: string[], parents?: string[]};
type Groups = {[key: string]: Group}

const POK_URL_PREFIX = "https://pokeapi.co/api/v2/pokemon-species/";

const addPokToGroup = (evoInfo: ChainLink, groups: Groups, pokedex: Pokemon[], processedIds: string[]) => {
  const dexNumber = evoInfo.species.url.split(POK_URL_PREFIX)[1].split("/")[0];
  const dexEntries = pokedex.filter(p => (p.originalDexNumber ?? p.dexNumber) === dexNumber);
  for (const dexEntry of dexEntries) {
    // Get existing values for this Pokemon's berry type to retain them when we add new ones
    const existingObj = groups[dexEntry.berry.toLocaleUpperCase()];
    const newObj = {} as Group;
    // Add the id of the pokemon
    newObj.ids = [...(existingObj?.ids ?? []), dexEntry.dexNumber]
    if (evoInfo.evolves_to.length < 1) {
      // Record this as a parent (if it is)
      newObj.parents = [...(existingObj?.parents ?? []), dexEntry.dexNumber]
    }
    // Overwrite the value for the group
    groups[dexEntry.berry.toLocaleUpperCase()] = newObj;
  };
  // Mark the current mon complete so we don't add it again later.
  processedIds.push(dexNumber);
  return groups;
}

const extractEvoInto = (evoInfo: ChainLink, groups: Groups, pokedex: Pokemon[], processedIds: string[]) => {
    // Process the current mon
    addPokToGroup(evoInfo, groups, pokedex, processedIds)
    for(const parentPok of evoInfo.evolves_to) {
        // Check for any parent pokemon
        extractEvoInto(parentPok, groups, pokedex, processedIds);
    }
}

const getTypeGroups = async (dexNumber: string, pokedex: Pokemon[], processedIds: string[]) => {
  try {
    const pokInfo = await axios.get(`${POK_URL_PREFIX}${dexNumber}/`);
    const evoInfo = await axios.get(pokInfo.data.evolution_chain.url) as {data: EvoApiCall};
    const groups = {} as Groups;

    extractEvoInto(evoInfo.data.chain, groups, pokedex, processedIds);

    const typeGroups = [] as TypeGroup[];

    const entries = Object.entries(groups)
    for (const e of entries) {
      const defaultId = e[1].parents?.length === 1 ? e[1].parents[0] : e[1].ids[0];
      typeGroups.push({
        key: `${evoInfo.data.id}_${e[0]}`,
        ids: e[1].ids,
        berry: e[0],
        defaultId
      })
    }

    return typeGroups;

  } catch (e) {
    console.log(e);
    return [];
  }

}

export const loadAllTypeGroups = async (pokedex: Pokemon[], existingTypeGroups: TypeGroups) => {
  let typeGroups = [...(existingTypeGroups?.groups ?? [])]
  let processedIds = [...(existingTypeGroups?.processedIds ?? [])]
  for(const p of pokedex) {
    // If we already have processed this mon, no need to call api again
    if (processedIds.includes(p.originalDexNumber ?? p.dexNumber)) continue;
    // Else; start process for this mon
    const tgs = await getTypeGroups(p.originalDexNumber ?? p.dexNumber, pokedex, processedIds)
    // Add the result to the collection
    typeGroups = [...typeGroups, ...tgs];
  }
  return {groups: typeGroups, processedIds: processedIds, loaded: true};
}