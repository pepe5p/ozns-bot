function Variant(name, turn, points, combo, x, y, letter, newTilesArray)
{
    this.name = name;
    this.turn = turn;
    this.points = points;
    this.combo = combo;
    this.x = x;
    this.y = y;
    this.l = letter;
    this.children = [];
    this.tilesArray = newTilesArray;
}

async function bot(tilesArray)
{
    console.log("ruch se robie");

    let moves = 0;
    let length = tilesArray.length;
    for(let i = 0; i < length; i++) if(tilesArray[i].l !== undefined) moves++;

    let depth = moves == 0 ? 1 : 2;

    let how_much_moves_to_end = boardWidth * boardWidth - moves;
    if(how_much_moves_to_end <= 10) depth++;
    if(how_much_moves_to_end <= 6) depth++;

    let newTilesArray = JSON.parse(JSON.stringify(tilesArray));
    let position = new Variant("", (turn + 1) % 2, 0, 0, undefined, undefined, undefined, newTilesArray);
    
    await variantsCheck(position, depth, false, -100, 100);
    
    //SHOWING VARIANTS
    show_variants(position);

    //PLAYING LETTER
    setLetter(position.children[0].l, 1);
    playLetter(position.children[0].x, position.children[0].y, 1);

    //IF COMBO => PLAY NEXT MOVE
    if(position.children[0].combo >= 1) /////////////////////UWAGA JAK BĘDZIE WIĘCEJ NIŻ JEDNO COMBO
    {
        // setLetter(position.children[0].children[0].l, 1);
        // playLetter(position.children[0].children[0].x, position.children[0].children[0].y, 1);
        bot(position.children[0].tilesArray);
    }

    // console.log(position);
}

async function variantsCheck(position, depth, combo, alpha, beta)
{
    if(depth == 0) return false;

    await childrenCheck(position, depth, combo, alpha, beta);
    
    if(position.children.length > 1)
    {
        position.children.sort((a, b) => {return b.points - a.points});
        position.points += position.turn == position.children[0].turn ? position.children[0].points : -position.children[0].points;
        position.points = Math.floor(position.points * 100) / 100;
    }
}

async function childrenCheck(position, depth, combo, alpha, beta)
{
    // let maxEval0 = -Infinity;
    // let maxEval1 = -Infinity;
    let y = -1;
    let full = boardWidth * boardWidth;
    for(let i = 0; i < full; i++)
    {
        let x = i % boardWidth;
        if(x == 0)  y++;

        for(let l = 0; l < 4; l++)
        {
            let letter = characters.charAt(l);

            if(legalCheck(position.tilesArray, x, y, letter)[0])
            {
                let eturn = (position.turn + 1) % 2;
                let newTilesArray = JSON.parse(JSON.stringify(position.tilesArray));
                let tile = newTilesArray[y * boardWidth + x];
                tile.p = eturn;
                tile.l = letter;

                data = pointsCheck(newTilesArray, x, y, eturn);

                let points = (Math.random() - 1) / 10;
                points -= (x - (boardWidth - 1) / 2) * (x - (boardWidth - 1) / 2) * .05;
                points -= (y - (boardWidth - 1) / 2) * (y - (boardWidth - 1) / 2) * .05;
                points += data[0];
                points += data[1] * .4;
                points = Math.floor(points * 100) / 100;

                let nextTurn = combo ? (eturn + 1) % 2 : eturn;
                let nextCombo = data[1] % 2 == 1 ? true: false;

                // let new_depth = data[0] > 0.75 || data[1] > 0 ? depth : depth - 1;
                let new_depth = data[1] > 0 ? depth : depth - 1;

                // if(eturn == 0)
                // {
                //     maxEval0 = Math.max(maxEval0, points);
                //     alpha = Math.max(alpha, points);
                //     if(beta <= alpha) break;
                // }
                // else if(eturn == 1)
                // {
                //     maxEval1 = Math.max(maxEval1, points);
                //     beta = Math.max(beta, points);
                //     if(beta <= alpha) break;
                // }

                let moves = 0;
                let length = newTilesArray.length;
                for(let i = 0; i < length; i++) if(newTilesArray[i].l !== undefined) moves++;
                let name = moves + "." + letter + (x + 10).toString(36) + (y + 1);

                let newVariant = new Variant(name, nextTurn, points, data[1], x, y, letter, newTilesArray);
                position.children.push(newVariant);

                if(!data[2]) await variantsCheck(newVariant, new_depth, nextCombo, alpha, beta);
            }
        }
    }
    await oneMoment();
}

function oneMoment(){
    return new Promise(resolve => setTimeout(resolve));
}

function show_variants(position)
{
    $(".variants").html("");

    for(let i = 0; i < 3; i++)
    {
        if(position.children[i] !== undefined)
        {
            let variant_row = "<div class='points'>" + position.children[i].points + "</div>";

            variant_row += children_names(position.children[i]);
  
            $(".variants").append("<div class='variant_row'>" + variant_row + "</div>");
        }
    }
}

function children_names(position)
{
    let variants_tiles = "";

    let variant_tile = "<div class='variant_tile' style='color: " + playersArray[position.turn].c + "'>" + position.name + "</div>";
    variants_tiles += variant_tile;

    if(position.children.length > 0) variants_tiles += children_names(position.children[0]);

    return variants_tiles;
}