import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { berryTypes, IngredientLevel, Pokemon, TypeGroup } from "../../../assets/resources";
import { Row } from "../../generic/Row";
import { AppContext } from "../../../App";
import "./Selectors.less"
import { PokemonSelector } from "./PokemonSelector";
import { getCookie } from "../../../helpers/cookieHelpers";
import ReactSelect from "react-select";
import { Column } from "../../generic/Column";
import LoadingSpinner from "../../generic/LoadingSpinner";

const initTitleDeprecated = "Select a Berry";
const initTitle = "Select a Berry...";
const initTitleXS = "...";

const getTitleInit = (id: string) => {
    const cookie = getCookie("t" + id);
    if (cookie.length > 0) return cookie
    return initTitle;
}

export const TypeSelector = (props: {id: string, setPokemon: Dispatch<SetStateAction<Pokemon[]>>, context: AppContext, excludeLevel60: boolean}) => {

    const {id, setPokemon, context, excludeLevel60} = props;
    const [title, setTitle] = useState(getTitleInit(id));
    const [activeTypeGroups, setActiveTypeGroups] = useState<TypeGroup[]>([]);

    useEffect(() => {
        var typeGroupSubsets = context.typeGroups?.filter(g => g.berry.toLocaleUpperCase() == title.toLocaleUpperCase()) ?? [];
        var pokemon = context.selectedPokemon.filter(p => p.berry.toLocaleUpperCase() == title.toLocaleUpperCase()).filter(p => typeGroupSubsets.find(tGS => tGS.defaultId == p.dexNumber) != undefined);
        setPokemon(pokemon);
        setActiveTypeGroups(typeGroupSubsets);
        document.cookie = "t" + id + "=" + title;
    }, [title, context.typeGroups])

    return (
        <Column className={`type-selector mobile-width-90 ${title}-background`}>
            <ReactSelect
                className="mobile-width-90 react-select-dropdown"
                placeholder={(window?.innerWidth > 900 ? initTitle : initTitleXS)}
                defaultValue={berryTypes.find(bT => bT.berryName == title) || undefined}
                isClearable={true}
                options={berryTypes.map(bT => { return{value: bT.berryName, label: bT.berryName, ...bT}})}
                onChange={(berryType) => {setTitle(berryType?.berryName ?? "");}}
                formatOptionLabel={berryType => (
                    <div key={berryType.index + "_berry_type"} className="react-select-option">
                        <Row>
                            <img className="img-xs" src={berryType.berryImageUri} />
                            {/* <p className="flex-1">{berryType.typeName}</p> */}
                            {(window?.innerWidth > 900 &&
                                <>
                                    <p className="flex-1">{berryType.berryName}</p>
                                    <img className="img-xs" src={berryType.typeImageUri} />
                                </>
                            )}
                        </Row>
                    </div>
                )}
            />
            <Row className={`type-selector-result-list`}>
                <Row className={`background-container ${title}-background`}>
                    {activeTypeGroups.map(tG => {
                        return (
                            <div key={tG.key + "_active-type-group"}>
                                <PokemonSelector
                                    context={context}
                                    typeGroup={tG}
                                    excludeLevel60={excludeLevel60}
                                    mainAction={(dexEntry: Pokemon) => context.togglePokemon(dexEntry)}
                                    ingredientAction={(dexEntry: Pokemon, ingredientLevel: IngredientLevel) => context.selectPokemonIngredients(dexEntry, ingredientLevel)}
                                />
                            </div>
                        )
                    })}
                </Row>
                {title && title !== initTitleDeprecated && title !== initTitle && title !== initTitleXS && !context.typeGroupsLoaded &&
                    <LoadingSpinner />
                }
            </Row>
        </Column>
    )
}