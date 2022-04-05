const background = "#03000a";
const dgrey = "#383867";
const grey = "#6060A9";
const white = "#F1EBFF";

const red = "#ff6666";
const dred = "#882222";
const yellow = "#CC9900";
const dyellow = "#7A5C00";
const green = "#29A37A";
const dgreen = "#196149";
const blue = "#6666ff";
const dblue = "#222288";
const pink = "#843DC6";
const dpink = "#3E1C5F";
// const cyan = "#66FFFF";
// const dcyan = "#228888";

const colors = [red, yellow, green, blue, pink];
const dcolors = [dred, dyellow, dgreen, dblue, dpink];

const pnames = ['<i class="icon-user"></i> ' + player_name, '<i class="icon-cog"></i> bot'];
var players_colors = [colors[player_color], grey];
var dplayers_colors = [dcolors[player_color], dgrey];

const this_device_player = 0;
const characters = "OZNS";
const width = 300/boardWidth;
const maxTime = time * 60000;
const directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]];

var playersArray = [];
var tilesArray = [];
var movesArray = [];
var premoves = [];
var stopTimer = true;
var ozns;
var turn;
var move;
var moves;
whoStarts = (whoStarts + 1 + this_device_player) % 2;

function Player(name, c, dc, al = characters.charAt(0), score = 0)
{
    this.name = name;
    this.c = c; //color
    this.dc = dc; //darker color
    this.al = al; //active letter
    this.score = score;
    this.time = maxTime;
    this.date_now = Date.now();
    this.turnLock = true;
}

function Tile(x, y, player = undefined, letter = undefined)
{
    this.x = x;
    this.y = y;
    this.p = player;
    this.l = letter;
}

function init()
{
    //TU W PRZYSZŁOŚCI MOŻE BYĆ INICJALIZACJA BOTA

    //ADDING PLAYERS
    for(let i = 0; i < 2; i++)
    {
        let index = (i + this_device_player) % 2;
        playersArray.push(new Player(pnames[index], players_colors[index], dplayers_colors[index]));
        $(".player" + i + " > .playerbox > .name").append(" " + pnames[index]);
    }

    //SETING THE BUTTONS
    for(let i = 0; i < 4; i++) 
    {
        let l = characters.charAt(i);
        $(".panelbox >> .flexbox").append('<div class="tile active letters" onclick="setLetter(`' + l + '`, 0, this)">' + l + '</div>')
    }
    
    //BUILDING THE BOARD
    let y = -1;
    let full = boardWidth * boardWidth
    for(let i = 0; i < full; i++)
    {
        let x = i % boardWidth;
        if(x == 0)  y++;
    
        var name =  "t_" + x + "_" + y;
        var tile = "<div class='tile " + name + "' onclick = 'playLetter(" + x + 
        ", " + y + ", 0)' style='width: " + width + "px; height: " + width +
        "px; line-height: " + (width - 5) + "px; font-size: " + (width - 10) +
        "px;'><div class='dot'></div><span class='letter_slot'></span></div>";
    
        $("#board > .flexbox").append(tile);
    }
    for(let i = 0; i < boardWidth; i++)
    {
        var descripiton = "<div class='description' style='left: " + ((width * (i + 1)) - 20) + 
        "px; bottom: 0'>" + (i + 10).toString(36).toUpperCase() + "</div>";
        descripiton += "<div class='description' style='bottom: " + ((width * (i + 0.5)) - 10) + 
        "px; left: -20px'>" + (i + 1) + "</div>";
        $("#board > .flexbox").append(descripiton);
    }

    $(".player1 > .playerbox").css("color", playersArray[1].c);
    $(".player0 > .playerbox").css("color", playersArray[0].c);

    $(".turnbox").css("color", playersArray[0].c);
    $('.letters').css('background-color', playersArray[0].c);
    $('.letters:first-child').css('background-color', playersArray[0].dc);

    newBoard();
}

function newBoard()
{
    tilesArray.length = 0;
    movesArray.length = 0;
    stopTimer = false;
    ozns = false;
    whoStarts = (whoStarts + 1) % 2;
    turn = whoStarts;
    move = 0;
    moves = 0;

    playersArray[0].time = maxTime;
    playersArray[1].time = maxTime;
    playersArray[0].date_now = Date.now();
    playersArray[1].date_now = Date.now();

    playersArray[turn].time += increment * 1000;
    var minutes = Math.floor(maxTime/60000);
    var seconds = minutes > 0 ? Math.floor((maxTime - minutes * 60000) / 1000) : Math.floor((maxTime - minutes * 60000) / 100) / 10;
    
    if(Number.isInteger(seconds) && minutes == 0) seconds += ".0";
    if(seconds < 10) seconds = "0" + seconds;
    minutes = minutes > 0 ? minutes + ":" : "";
    $(".playerbox > .timerbox").html(minutes + seconds);

    $(".timer > .bar").css("width", "100%");
    $(".player" + turn + ".bar").css("background-color", playersArray[turn].c);
    $(".player" + turn + " > .playerbox").addClass("active");

    $("#board > .flexbox > .tile > .letter_slot").empty();
    $("#board > .flexbox > .tile").addClass("active");
    $("#board > .flexbox > .tile").removeClass("dblue ready");
    
    $(".summary").addClass("hided").html();

    let y = -1;
    let full = boardWidth * boardWidth;
    for(let i = 0; i < full; i++){
        if((i % boardWidth) == 0) y++;
        tilesArray.push(new Tile(i % boardWidth, y));
    }

    if(turn == 1) bot(tilesArray);

    setLetter(playersArray[0].al, 0);
}

async function timer()
{
    setInterval(function()
    {
        $(".bar").css("background-color", white);
        if(!stopTimer)
        {
            playersArray[turn].time -= Date.now() - playersArray[turn].date_now;
            playersArray[turn].date_now = Date.now();
            if(playersArray[turn].time <= 0)
            {
                playersArray[turn].time = 0;
                playersArray[(turn + 1) % 2].score += 4;

                if(!score()) endBoard(playersArray[turn].name + " runned out of time", false);
            }
            showTime();
        }
    }, 100);
}

function setLetter(letter, eturn, e = undefined)
{
    if(letter == characters.charAt(0) || letter == characters.charAt(1) 
    || letter == characters.charAt(2) || letter == characters.charAt(3))
    {
        playersArray[eturn].al = letter;

        if(eturn == 0)
        {
            $("#board > .flexbox > .tile").removeClass("ready");
            
            let y = -1;
            let full = boardWidth * boardWidth
            for(let i = 0; i < full; i++)
            {
                let x = i % boardWidth;
                if(x == 0)  y++;
            
                if(legalCheck(tilesArray, x, y, letter)[0]) $(".t_" + x + "_" + y).addClass("ready");
            }
        }

        if(e)
        {
            $('.letters').css('background-color', playersArray[eturn].c);
            $(e).css('background-color', playersArray[eturn].dc);
        }
    }
}

function playLetter(x, y, eturn, letter = playersArray[eturn].al)
{
    if(!stopTimer)
    {
        var boardTile = $(".t_" + x + "_" + y);

        if(eturn == turn)
        {
            let legal_check_data = legalCheck(tilesArray, x, y, letter);

            if(legal_check_data[0])
            {
                tilesArray[y * boardWidth + x].l = letter;
                tilesArray[y * boardWidth + x].p = turn;

                movesArray.push((moves + 1) + "." + letter + (x + 10).toString(36) + (y + 1));
                boardTile.children(".letter_slot").html(letter);
                boardTile.css("color", playersArray[turn].c);
                boardTile.removeClass("active");
                $("#board > .flexbox > .tile").removeClass("dblue");
                boardTile.addClass("dblue");

                setLetter(playersArray[0].al, 0);

                data = pointsCheck(tilesArray, x, y, turn);
                playersArray[turn].score += data[0];
                if(data[0] > 0) score();
                move -= data[1];
                ozns = data[2];

                let v = data[3].length;
                for(let i = 0; i < v; i++) if(data[3][i] !== undefined) pulse("dgreen", ".t_" + data[3][i][0] + "_" + data[3][i][1]);

                move++;
                moves++;

                if(move >= 1)
                {
                    if(playersArray[turn].turnLock) nextTurn(turn);
                    else if(turn == 0) turn_button(true);
                }
            }
            else
            {
                let blocks = legal_check_data[1];
                let b = blocks.length;
                for(let i = 0; i < b; i++) if(blocks[i] !== undefined) pulse("dred", ".t_" + blocks[i][0] + "_" + blocks[i][1]);
            }
        }
        else if(tilesArray[y * boardWidth + x].l === undefined)
        {
            premove_clear();

            premoves.push([x, y, letter]);
            boardTile.children(".letter_slot").html(letter);
            boardTile.css("color", playersArray[eturn].dc);
        }
    }
}

function premove_clear()
{
    if(premoves.length > 0)
    {
        $(".t_" + premoves[0][0] + "_" + premoves[0][1]).children(".letter_slot").html("");
        premoves.length = 0;
    }
}

function nextTurn(eturn)
{
    if(eturn == turn && move >= 1)
    {
        if(turn == 0) turn_button(false);

        turn = (turn + 1) % 2;
        playersArray[turn].time += increment * 1000;
        playersArray[turn].date_now = Date.now();
        move = 0;

        if(turn == 0 && premoves.length > 0)
        {
            playLetter(premoves[0][0], premoves[0][1], 0, premoves[0][2]);
            premoves.length = 0;
            premove_clear();
        }

        showTime();

        $(".playerbox").removeClass("active");
        $(".player" + turn + " > .playerbox").addClass("active");

        if(ozns) endBoard("ozns", false);
        else if(moves == boardWidth * boardWidth) endBoard("full board", false);
        else if(turn == 1) bot(tilesArray);
    }
}

function endBoard(reason, endGame)
{
    let content = '<div class="tablerow">' + reason + '</div>';

    if(endGame) content += '<div class="tablerow"><button type="button"><a href="homepage.html" class="blur"><i class="icon-left action_icon"></i> return to menu</a></button></div>';
    else content += '<div class="tablerow"><button type="button"><a onclick="newBoard()" class="blur">next board <i class="icon-right action_icon"></i></a></button></div>';

    stopTimer = true;
    $(".playerbox").removeClass("active");
    $("#board > .flexbox > .tile").removeClass("active");

    $(".summary").removeClass("hided").html(content);
}

function score()
{
    let flag = false;

    for(let i = 0; i < 2; i++)
    {
        if(playersArray[i].score >= point_target)
        {
            endBoard("<span style='color: " + playersArray[i].c + ";'>" + playersArray[i].name + " wins <i class='icon-trophy action_icon'></i></span>", true);
            flag = true;
        }
        $(".player" + i + " > .playerbox > .score").html(playersArray[i].score);
    }

    return flag;
}

function showTime()
{
    var actualTime = playersArray[turn].time;
    var minutes = Math.floor(actualTime / 60000);
    var seconds = minutes > 0 ? Math.floor((actualTime - minutes * 60000) / 1000) : Math.floor((actualTime - minutes * 60000) / 100) / 10;
    
    if(Number.isInteger(seconds) && minutes == 0) seconds += ".0";
    if(seconds < 10) seconds = "0" + seconds;
    minutes = minutes > 0 ? minutes + ":" : "";
    $(".player" + turn + " > .playerbox > .timerbox").html(minutes + seconds);

    var proportion = actualTime / maxTime > 1 ? 100 : actualTime / maxTime * 100;
    $(".player" + turn + ".bar").css({"width": proportion + "%", "background-color": playersArray[turn].c});
}

function pulse(color, e)
{
    $(e).addClass(color);
    setTimeout(function(){
        $(e).removeClass(color);
    }, 200);
}

var confirm_resign = false;
$('.resign_button').click(function()
{
    if(confirm_resign)
    {
        $('.resign_button').addClass("clicked");
        endBoard(playersArray[0].name + " resigned <i class='icon-flag action_icon'></i>", true);
    }
    else
    {
        confirm_resign = true;
        $('.resign_button').removeClass("clicked");

        setTimeout(function(){
            confirm_resign = false;
            $('.resign_button').addClass("clicked");
        }, 2000)
    }
});

function turn_button(flag)
{
    if(flag)
    {
        $('.turn_button').addClass("active");
        $('.turn_button').removeClass("clicked");
    }
    else
    {
        $('.turn_button').removeClass("active");
        $('.turn_button').addClass("clicked");
    }
}

$('.turn_lock').click(function()
{
    playersArray[0].turnLock = !playersArray[0].turnLock;
    $('.turn_lock').toggleClass("clicked");
    $('.turn_lock > .icon').toggleClass("icon-lock icon-lock-open");
});

$('.turn_button').click(function()
{
    if(turn == 0 && move >= 1) nextTurn(0);
});

init();
timer();