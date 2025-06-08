import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IngredientLevel, ingredients, pokedex, Pokemon, TypeGroup, typeGroups } from "../../../assets/resources";
import { Row } from "../../generic/Row";
import { AppContext } from "../../../App";
import "./Selectors.less"
import { PokemonSelector } from "./PokemonSelector";
import { CloseButton } from "../../generic/CloseButton";
import { Column } from "../../generic/Column";
import { CloseBackground } from "../../generic/CloseBackground";

export const CustomIngredientSelector = (props: {context: AppContext}) => {

    const {context} = props;

    const ingredientSelectorState = context.customIngredientSelectorState;

    return (
        <Row className="custom-selector">
            {ingredientSelectorState?.isActive &&
                <div>
                    <CloseBackground
                        action={() => context.setCustomIngredientSelectorState({ isActive: false })}
                    />
                    <div 
                        className="custom-selector-window"
                    >
                        <Row className="custom-selector-window-inner">
                            {ingredients.map(i => {
                                return (
                                    <div key={i.name + "_custom-selector-entry"} className={"custom-ingredient-selector"}>
                                        <img
                                            className="img-m"
                                            src={i.uri}
                                            onClick={() => {
                                                if (ingredientSelectorState?.pokemonState && ingredientSelectorState?.slot === IngredientLevel.Lvl30) {
                                                    ingredientSelectorState.pokemonState.ingredientLevel30Override = i.name;
                                                }
                                                if (ingredientSelectorState?.pokemonState && ingredientSelectorState?.slot === IngredientLevel.Lvl60) {
                                                    ingredientSelectorState.pokemonState.ingredientLevel60Override = i.name;
                                                }
                                                context.setCustomIngredientSelectorState({ isActive: false })
                                                if (ingredientSelectorState.pokemon && ingredientSelectorState.slot) {
                                                    context.selectPokemonIngredients(ingredientSelectorState.pokemon, ingredientSelectorState.slot);
                                                }
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </Row>
                        <CloseButton
                            action={() => context.setCustomIngredientSelectorState({ isActive: false })}
                        />
                    </div>
                </div>
            }
        </Row>
    )
}