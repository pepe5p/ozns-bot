function neighboursCheck(newTilesArray, x, y, xdistance, ydistance)
{
    let tile;

    if(jQuery.inArray(newTilesArray[(y + ydistance) * boardWidth + x + xdistance], newTilesArray) != -1 && x + xdistance >= 0 && x + xdistance < boardWidth)
    {tile = newTilesArray[(y + ydistance) * boardWidth + x + xdistance];}
    else tile = new Tile(-1, -1);

    return tile;
}

function comboCheck(newTilesArray, x, y)
{
    var cbcheck = 0;
    checksArray = [];

    for(let i = 0; i < 4; i++) checksArray[i] = neighboursCheck(newTilesArray, x, y, directions[i][0], directions[i][1]);
    for(let i = 0; i < 4; i++)
    {
        if(checksArray[i].l == characters.charAt(0)) cbcheck += 1;
        else if(checksArray[i].l == characters.charAt(1)) cbcheck += 10;
        else if(checksArray[i].l == characters.charAt(2)) cbcheck += 100;
        else if(checksArray[i].l == characters.charAt(3)) cbcheck += 1000;
    }
    
    if(cbcheck == 1111) return [true, checksArray];
    else return [false, checksArray];
}

function legalCheck(newTilesArray, x, y, letter)
{
    //GENERATING CHECKS
    var neighbours = [];
    for(let i = 0; i < 4; i++) neighbours[i] = neighboursCheck(newTilesArray, x, y, directions[i][0], directions[i][1]);

    var blocks = [];
    var everythingOK = false;
    var tile = newTilesArray[y * boardWidth + x];

    //FULL TILE BLOCK & MOVE BLOCK
    if(tile.l === undefined && move < 1)
    {
        everythingOK = true;

        //BLOCK CHECK
        for(let i = 0; i < 4; i++) if(neighbours[i].l == letter)
        {
            blocks.push([neighbours[i].x, neighbours[i].y]);
            everythingOK = false;
        }

        //COMBO CHECK
        if(comboCheck(newTilesArray, x, y)[0]) everythingOK = true;
    }
    else blocks.push([x, y]);
    
    return [everythingOK, blocks];
}

function pointsCheck(newTilesArray, x, y, turn)
{
    var value_tiles = [];
    var letter = newTilesArray[y * boardWidth + x].l;

    //GENERATING CHECKS
    var check = [];
    let radius = 0;
    for(let i = 0; i < 24; i++)
    {
        let direction = i % 8;
        if(direction == 0) radius++;
        check[i] = neighboursCheck(newTilesArray, x, y, directions[direction][0]*radius, directions[direction][1]*radius);
    }

    var points = 0;
    var combo = 0;
    var ozns = false;

    //GIVING MOVES FOR COMBOS
    for(let i = 0; i < 4; i++)
    {
        let data = comboCheck(newTilesArray, check[i].x, check[i].y);
        if(data[0] && moves + 1 < boardWidth * boardWidth)
        {
            let c = data[1].length;
            for(let j = 0; j < c; j++) value_tiles.push([data[1][j].x, data[1][j].y]);
            combo++;
        }
    }

    //CHECKING COLOR
    for(let i = 0; i < 6; i++)
    {
        let potential_value_tiles = [[x, y]]
        let color = 1;

        if(check[i].p == turn) 
        {
            potential_value_tiles.push([check[i].x, check[i].y]);
            color++;
            if(check[i + 8].p == turn)
            {
                potential_value_tiles.push([check[i + 8].x, check[i + 8].y]);
                color++;
                if(check[i + 16].p == turn)
                {
                    color++;
                    potential_value_tiles.push([check[i + 16].x, check[i + 16].y]);
                }        
            }
        }
        if(check[i + 2].p == turn) 
        {
            potential_value_tiles.push([check[i + 2].x, check[i + 2].y]);
            color++;
            if(check[i + 10].p == turn)
            {
                potential_value_tiles.push([check[i + 10].x, check[i + 10].y]);
                color++;
                if(check[i + 18].p == turn)
                {
                    potential_value_tiles.push([check[i + 18].x, check[i + 18].y]);
                    color++;
                }
            }
        }

        if(color >= 4)
        {
            points += color - 3;
            value_tiles = value_tiles.concat(potential_value_tiles);
        }

        if(i == 1) i = 3;
    }

    if(letter == characters.charAt(0))
    {
        //CHECKING ONZ
        for(let i = 0; i < 8; i++) 
        if(check[i].l == characters.charAt(2) && check[i + 8].l == characters.charAt(1))
        {
            value_tiles.push([x, y]);
            value_tiles.push([check[i].x, check[i].y]);
            value_tiles.push([check[i + 8].x, check[i + 8].y]);

            points++;
        }
        //CHECKING OZNS
        for(let i = 0; i < 8; i++) 
        if(check[i].l == characters.charAt(1) && check[i + 8].l == characters.charAt(2) && check[i + 16].l == characters.charAt(3))
        {
            value_tiles.push([x, y]);
            value_tiles.push([check[i].x, check[i].y]);
            value_tiles.push([check[i + 2].x, check[i + 2].y]);
            value_tiles.push([check[i + 16].x, check[i + 16].y]);

            points = points + 2;
            if(check[i].p == turn) points++;
            if(check[i + 8].p == turn) points++;
            if(check[i + 16].p == turn) points++;
            ozns = true;
        }
    }
    else if(letter == characters.charAt(1)) 
    {
        //CHECKING ONZ
        for(let i = 0; i < 8; i++) 
        if(check[i].l == characters.charAt(2) && check[i + 8].l == characters.charAt(0))
        {
            value_tiles.push([x, y]);
            value_tiles.push([check[i].x, check[i].y]);
            value_tiles.push([check[i + 8].x, check[i + 8].y]);

            points++;
        }
        //CHECKING OZNS
        for(let i = 0; i < 6; i++)
        {
            if(check[i].l == characters.charAt(0) && check[i + 2].l == characters.charAt(2) && check[i + 10].l == characters.charAt(3))
            {
                value_tiles.push([x, y]);
                value_tiles.push([check[i].x, check[i].y]);
                value_tiles.push([check[i + 2].x, check[i + 2].y]);
                value_tiles.push([check[i + 10].x, check[i + 10].y]);

                points = points + 2;
                if(check[i].p == turn) points++;
                if(check[i + 2].p == turn) points++;
                if(check[i + 10].p == turn) points++;
                ozns = true;
            }
            if(check[i + 8].l == characters.charAt(3) && check[i].l == characters.charAt(2) && check[i + 2].l == characters.charAt(0))
            {
                value_tiles.push([x, y]);
                value_tiles.push([check[i].x, check[i].y]);
                value_tiles.push([check[i + 2].x, check[i + 2].y]);
                value_tiles.push([check[i + 8].x, check[i + 8].y]);
    
                points = points + 2;
                if(check[i].p == turn) points++;
                if(check[i + 2].p == turn) points++;
                if(check[i + 8].p == turn) points++;
                ozns = true;
            }
            if(i == 1) i = 3;
        }
    }
    else if(letter == characters.charAt(2))
    {
        //CHECKING ONZ
        for(let i = 0; i < 6; i++)
        {
            if((check[i].l == characters.charAt(0) && check[i + 2].l == characters.charAt(1)) 
            || (check[i].l == characters.charAt(1) && check[i + 2].l == characters.charAt(0)))
            {
                value_tiles.push([x, y]);
                value_tiles.push([check[i].x, check[i].y]);
                value_tiles.push([check[i + 2].x, check[i + 2].y]);
    
                points++;
            }
            if(i == 1) i = 3;
        }
        //CHECKING OZNS
        for(let i = 0; i < 6; i++)
        {
            if(check[i].l == characters.charAt(3) && check[i + 2].l == characters.charAt(1) && check[i + 10].l == characters.charAt(0))
            {
                value_tiles.push([x, y]);
                value_tiles.push([check[i].x, check[i].y]);
                value_tiles.push([check[i + 2].x, check[i + 2].y]);
                value_tiles.push([check[i + 10].x, check[i + 10].y]);
    
                points = points + 2;
                if(check[i].p == turn) points++;
                if(check[i + 2].p == turn) points++;
                if(check[i + 10].p == turn) points++;
                ozns = true;
            }
            if(check[i + 8].l == characters.charAt(0) && check[i].l == characters.charAt(1) && check[i + 2].l == characters.charAt(3))
            {
                value_tiles.push([x, y]);
                value_tiles.push([check[i].x, check[i].y]);
                value_tiles.push([check[i + 2].x, check[i + 2].y]);
                value_tiles.push([check[i + 8].x, check[i + 8].y]);
    
                points = points + 2;
                if(check[i].p == turn) points++;
                if(check[i + 2].p == turn) points++;
                if(check[i + 8].p == turn) points++;
                ozns = true;
            }
            if(i == 1) i = 3;
        }
    }
    else if(letter == characters.charAt(3))
    {
        //CHECKING OZNS
        for(let i = 0; i < 8; i++) 
        if(check[i].l == characters.charAt(2) && check[i + 8].l == characters.charAt(1) && check[i + 16].l == characters.charAt(0))
        {
            value_tiles.push([x, y]);
            value_tiles.push([check[i].x, check[i].y]);
            value_tiles.push([check[i + 8].x, check[i + 8].y]);
            value_tiles.push([check[i + 16].x, check[i + 16].y]);

            points = points + 2;
            if(check[i].p == turn) points++;
            if(check[i + 8].p == turn) points++;
            if(check[i + 16].p == turn) points++;
            ozns = true;
        }
    }
    return [points, combo, ozns, value_tiles];
}