import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TypeSelector } from "./TypeSelector";
import { Pokemon } from "../../../assets/resources";
import { AppContext } from "../../../App";
import { Row } from "../../generic/Row";
import { Column } from "../../generic/Column";
import { CustomSelector } from "./CustomSelector";
import { RecipeSelector } from "./RecipeSelector";

export const TypeSelectors = (props: {setWeeklyRecipe: Dispatch<SetStateAction<string>>, setWeeklyPokemon: Dispatch<SetStateAction<Pokemon[]>>, context: AppContext, excludeLevel60: boolean}) => {

    const {setWeeklyRecipe, setWeeklyPokemon, context, excludeLevel60} = props;
    const [pokemon1, setPokemon1] = useState<Pokemon[]>([]);
    const [pokemon2, setPokemon2] = useState<Pokemon[]>([]);
    const [pokemon3, setPokemon3] = useState<Pokemon[]>([]);
    const [customPokemon, setCustomPokemon] = useState<Pokemon[]>([]);

    useEffect(() => {
        setWeeklyPokemon(pokemon1.concat(pokemon2).concat(pokemon3).concat(customPokemon))
    }, [pokemon1, pokemon2, pokemon3, customPokemon])

    return (
        <Column>
            <Row className="selectors-header">
                {(window?.innerWidth > 900 &&
                    <div className="flex-1"/>
                )}
                <RecipeSelector setWeeklyRecipe={setWeeklyRecipe} />
                <CustomSelector setPokemon={setCustomPokemon} context={context} excludeLevel60={excludeLevel60}/>
            </Row>
            <Row className="type-selectors">
                <TypeSelector id="1" setPokemon={setPokemon1} context={context} excludeLevel60={excludeLevel60} />
                <TypeSelector id="2" setPokemon={setPokemon2} context={context} excludeLevel60={excludeLevel60} />
                <TypeSelector id="3" setPokemon={setPokemon3} context={context} excludeLevel60={excludeLevel60} />
            </Row>
        </Column>
    )
}