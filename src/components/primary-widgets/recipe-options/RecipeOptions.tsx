import { ingredients, Recipe, RecipePossibility } from "../../../assets/resources";
import "./Recipes.less";
import { Row } from "../../generic/Row";
import { RowColumnAdaptive } from "../../generic/RowColumnAdaptive";
import { Column } from "../../generic/Column";

export const RecipeOptions = (props: {recipes: Recipe[], title: string, titleIngredients: string[], possible?: RecipePossibility}) => {

    const {title, recipes, titleIngredients, possible} = props;


    const getIngredients = (recipe: Recipe) => {

        var currIngredients: any[] = [];
        ingredients.forEach(ingredient => {
            var iCount = recipe[ingredient.name as keyof typeof recipe];

            if (iCount != undefined && iCount != "0") {
                currIngredients.push(
                    <Row key={ingredient.name + "_ingredient-count"}>
                        <p className="ingredient-count">{iCount}</p>
                        <img className="img-xs" src={ingredient.uri} />
                    </Row>
                );
            }
        })

        return currIngredients;
    }
    
    return (
        <div className="recipe-list">
            <Column className="recipe-list-title">
                <h3>{title}</h3>
                <Row>
                    {ingredients.filter(i => titleIngredients.find(pI => pI == i.name)).map(i =>
                        <img key={i.name + "_ingredient-obtainable"} className="img-xs" src={i.uri} />
                    )}
                </Row>
            </Column>
            <Row className="recipe-entries">
                {recipes.map(recipe => 
                    <RowColumnAdaptive 
                        key={recipe.key + "_recipe-entry"} 
                        className={"recipe-entry" 
                            + (possible == RecipePossibility.Possible ? " possible-recipe" : "")
                            + (possible == RecipePossibility.Impossible ? " impossible-recipe" : "")}
                    >
                        <Row>
                            <div>
                                <img className="img-m" src={"./recipes/" + recipe.Recipe.toLowerCase().split(" ").join("") + ".png"} />
                            </div>
                        </Row>
                        <p className="recipe-name">{recipe.Recipe}</p>
                        <Row className="recipe-ingredient-list">
                            {getIngredients(recipe)}
                        </Row>
                    </RowColumnAdaptive>
                )}
            </Row>
            {/* {recipes.length > 0 &&
                (<Grid
                    cells={[
                        ...recipes.map(recipe => 
                            [
                                <div>
                                    <img src={"./recipes/" + recipe.Recipe.toLowerCase().split(" ").join("") + ".png"} />
                                </div>,
                                <p className="recipe-name">{recipe.Recipe}</p>,
                                <Row className="ingredient-list">
                                    {getIngredients(recipe)}
                                </Row>,
                            ]
                        ).reduce((acc, curr) => acc.concat(curr))
                    ]}
                />)
            } */}
        </div>
    )
}