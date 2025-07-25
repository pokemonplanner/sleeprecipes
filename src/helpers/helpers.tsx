
export const formatIdForPng = (id: string) => {
    while (id.length < 3) id = "0" + id;
    // return "portraits/" + id + ".png";
    return "https://www.serebii.net/pokemonsleep/pokemon/icon/" + id + ".png";
}
