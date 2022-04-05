<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="Shortcut icon" href="img/oznsgame.jpg" />
    <title>OZNS | Game</title>
    <meta name="author" content="Piotr Karaś" />
    <meta http-equiv="X-Ua-Compatible" content="IE=edge,chrome=1" />
    <link rel="stylesheet" href="style/style.css" type="text/css" />
	<link rel="stylesheet" href="fontello/css/ozns.css" type="text/css"/>
    <script>
        <?php 
            if(!isset($_GET['time'])) header('homepage.html');
            else
            {
                $player_name = $_GET['player_name'];
                $player_color = $_GET['player_color'];

                $name = $_GET['who_starts'];
                if($name == "random") $who_starts = rand(0, 1);
                else if($name == 0) $who_starts = 0;
                else $name = 1;

                $time = $_GET['time'];
                $increment = $_GET['increment'];
                $board_width = $_GET['board_width'];
                $point_target = $_GET['point_target'];
                
                echo "const player_name = '$player_name';
                ";
                echo "const player_color = $player_color;
                ";
                echo "var whoStarts = $who_starts;
                ";
                echo "const time = $time;
                ";
                echo "const increment = $increment;
                ";
                echo "const boardWidth = $board_width;
                ";
                echo "const point_target = $point_target;
                ";
            }
        ?>
    </script>
</head>
<body>
    <div class="perspective">
        <div class="rotatebox">
            <div class="game container border">
                <div class="nav blur"><i class="icon-menu"></i></div>
                <div class="variants"></div>
                <div id="board" class="xcbox ycbox box300">
                    <div class="player1 xcbox box300">
                        <div class="playerbox">
                            <div class="score">0</div>
                            <div class="name"></div>
                            <div class="timerbox"></div>
                        </div>
                    </div>
                    <div class="summary hided xcbox ycbox box240"></div>
                    <div class="flexbox">
                        <div class="timer top">
                            <div class="player1 bar"></div>
                        </div>
                        <div class="timer bottom">
                            <div class="player0 bar"></div>
                        </div>
                    </div>
                    <div class="player0 xcbox box300">
                        <div class="playerbox">
                            <div class="score">0</div>
                            <div class="name"></div>
                            <div class="timerbox"></div>
                        </div>
                    </div>
                    <div class="turnbox">
                        <span class="button resign_button active clicked"><i class="icon icon-flag"></i></span>
                        <span class="button turn_lock active clicked"><i class="icon icon-lock-open"></i></span>
                        <span class="button turn_button clicked"><i class="icon-right"></i></span> <!-- bez active/ z clicked -->
                    </div>
                </div>
                <div class="panelbox">
                    <div class="xcbox ycbox box240">
                        <div class="flexbox"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flexbox sidenav box300">
            <div class="tablerow">
                <button type="button">
                    <a class="blur" href="homepage.html"><i class="icon-left action_icon"></i> return to menu</a>
                </button>
            </div>
            <?php
                echo<<<END
                <div class="tablerow half left">
                    who starts
                    <div class="flexbox_middle">
                        <div class="radio_tile disabled">
                            <div class="item_box">
                                <div class="checkbox"><i class="icon-bookmark"></i></div>
                                $name
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tablerow half">
                    minutes per side
                    <div class="flexbox_middle">
                        <div class="radio_tile disabled">
                            <div class="item_box">
                                <div class="checkbox"><i class="icon-bookmark"></i></div>
                                $time
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tablerow half left">
                    increment
                    <div class="flexbox_middle">
                        <div class="radio_tile disabled">
                            <div class="item_box">
                                <div class="checkbox"><i class="icon-bookmark"></i></div>
                                $increment
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tablerow half">
                    point target
                    <div class="flexbox_middle">
                        <div class="radio_tile disabled">
                            <div class="item_box">
                                <div class="checkbox"><i class="icon-bookmark"></i></div>
                                $point_target
                            </div>
                        </div>
                    </div>
                </div>
END;
            ?>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
	<script src="js/checks.js"></script>
    <script src="js/bot.js"></script>
    <script src="js/game.js"></script>
    <script src="js/rotate.js"></script>
</body>
</html>