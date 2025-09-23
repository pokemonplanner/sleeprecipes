
export const formatIdForPng = (fullId: string) => {
    const idParts = fullId.split("-");
    while (idParts[0].length < 3) idParts[0] = "0" + idParts[0];
    // return "portraits/" + id + ".png";
    return "https://www.serebii.net/pokemonsleep/pokemon/icon/" + idParts.join("-") + ".png";
}
