import { IngredientLevel, ingredients, Pokemon, TypeGroup } from "../../../assets/resources";
import { Row } from "../../generic/Row";
import { AppContext } from "../../../App";
import "./Selectors.less"
import { Column } from "../../generic/Column";
import { Pill } from "../../generic/Pill";
import { HoverHighlight } from "../../generic/HoverHighlight";
import { CloseButton } from "../../generic/CloseButton";
import { formatIdForPng } from "../../../helpers/helpers";

const getIngredientUri = (ingredientName: string, override?: string | undefined) => {
    const name = override || ingredientName;
    return ingredients.find(i => i.name == name)?.uri ?? "ingredients/unknown.png";
}

export const PokemonSelector = (props: 
    {typeGroup: TypeGroup, context: AppContext, excludeLevel60: boolean, 
        mainAction: (source: Pokemon) => void, ingredientAction: (source: Pokemon, lvl: IngredientLevel) => void, closeAction?: () => any}) => {

    const {typeGroup, context, excludeLevel60, mainAction, ingredientAction, closeAction} = props;
    
    var dexEntry = context.selectedPokemon.find(p => p.name == typeGroup.default)!;
    if (dexEntry == undefined) return null;

    const getIngredientPillState = (dexEntry: Pokemon | undefined, hasIngredient: boolean | undefined) => {
        if (dexEntry?.Perf && hasIngredient) return "down-1";
        else return "down-0"
    }

    const ingredientExcluded = (excludeLevel60: boolean, ingredient: string, ingredientSelected: boolean) => {
        return (excludeLevel60 && !ingredientSelected && ingredient !== "Unknown");
    }

    const getExcludePillState = (excludeLevel60: boolean, ingredient: string, ingredientSelected: boolean) => {
        if (ingredientExcluded(excludeLevel60, ingredient, ingredientSelected)) return "down-1";
        else return "down-0"
    }

    return (
        <Column
            key={typeGroup.key + "_berry_mon"} 
            className={"pokemon-selector " + (dexEntry?.Perf ? "can-use" : "cant-use")}
        >
            <div onClick={() => mainAction(dexEntry)}>
                <div className="main-icon">
                    <img
                        src={formatIdForPng(dexEntry.dexNumber)} 
                        className="img-m"
                    />
                    <Row className="sub-icon-group">
                        {typeGroup.pokemon.filter(subP => subP != dexEntry.name).map(subP => {
                            var subDexEntry = context.selectedPokemon.find(p => p.name == subP)!;
                            if (subDexEntry == undefined) return null;

                            return (
                                <img
                                    key={subDexEntry.dexNumber + "_sub-dex-entry"}
                                    className="img-xs"
                                    src={formatIdForPng(subDexEntry.dexNumber)}
                                />
                            )
                        })}
                    </Row>
                    {closeAction &&
                        <CloseButton action={closeAction}/>
                    }
                </div>
                <Row className="pokemon-ingredients">
                    <HoverHighlight className="img-xs">
                        <Pill vertical={true} className={"green " + getIngredientPillState(dexEntry, true)} />
                        <img 
                            src={getIngredientUri(dexEntry.ingredient_1)}
                            className="img-xs"
                            onClick={(event) => {
                                // TODO: decide if we want clicking the first ingredient to remove the others (maybe long click?)
                                ingredientAction(dexEntry, IngredientLevel.Lvl0); 
                                event.stopPropagation();
                            }}
                        />
                    </HoverHighlight>
                    {dexEntry.ingredient_2 && dexEntry.ingredient_2 != "0" ?
                        <HoverHighlight className="img-xs">
                            <Pill vertical={true} className={"green " + getIngredientPillState(dexEntry, dexEntry?.ingredientLevel30)} />
                            <img 
                                src={getIngredientUri(dexEntry.ingredient_2, dexEntry?.ingredientLevel30Override)}
                                className="img-xs"
                                onClick={(event) => {
                                    if (dexEntry.ingredient_2 === "Unknown") {
                                        if (!dexEntry?.ingredientLevel30) {
                                            context.setCustomIngredientSelectorState({ isActive: true, pokemonState: dexEntry, pokemon: dexEntry, slot: IngredientLevel.Lvl30 });
                                        } else {
                                            dexEntry.ingredientLevel30Override = undefined;
                                            ingredientAction(dexEntry, IngredientLevel.Lvl30);
                                        }
                                    }
                                    else { ingredientAction(dexEntry, IngredientLevel.Lvl30); }
                                    event.stopPropagation();
                                }}
                            />
                        </HoverHighlight>
                        :
                        <div className="img-xs"/>
                    }
                    {dexEntry.ingredient_3 && dexEntry.ingredient_3 != "0" ?
                        <HoverHighlight className="img-xs">
                            <Pill vertical={true} className={"grey " + getExcludePillState(excludeLevel60, dexEntry.ingredient_3, dexEntry?.ingredientLevel60 ?? false)} />
                            <Pill vertical={true} className={"green " + getIngredientPillState(dexEntry, dexEntry?.ingredientLevel60)} />
                            <img 
                                src={getIngredientUri(dexEntry.ingredient_3, dexEntry?.ingredientLevel60Override)}
                                className={"img-xs" + (ingredientExcluded(excludeLevel60, dexEntry.ingredient_3, dexEntry?.ingredientLevel60 ?? false) ? " fade" : "")}
                                onClick={(event) => {
                                    if (dexEntry.ingredient_3 === "Unknown") {
                                        if (!dexEntry?.ingredientLevel60) {
                                            context.setCustomIngredientSelectorState({ isActive: true, pokemonState: dexEntry, pokemon: dexEntry, slot: IngredientLevel.Lvl60 });
                                        } else {
                                            dexEntry.ingredientLevel60Override = undefined;
                                            ingredientAction(dexEntry, IngredientLevel.Lvl60);
                                        }
                                    }
                                    else { ingredientAction(dexEntry, IngredientLevel.Lvl60); }
                                    event.stopPropagation();
                                }}
                            />
                        </HoverHighlight>
                        :
                        <div className="img-xs"/>
                    }
                </Row>
            </div>
        </Column>
    )
}