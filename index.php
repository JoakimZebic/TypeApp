<?php
    session_start();
?>

<!DOCTYPE html>
	<html>
		<head>
			<title>TYPE | Online Diary App</title>
			<link rel="icon" href="favicon.ico" />
			<meta charset="utf-8"/>
			<meta name="description" content="" />
			<meta name="keywords" content="" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
			<link rel="stylesheet" type="text/css" href="css/style.css" />
		</head>

		<body>
            <div id='preloader'>
                <svg id='gif' xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="100px" height="100px" viewBox="0 0 128 128" xml:space="preserve"><g><path d="M116.3 60.18a52.28 52.28 0 0 0-12.64-30.45l8.06-8.06a63.6 63.6 0 0 1 15.97 38.5h-11.4z" fill="#ffb100"/><path d="M116.3 60.18a52.28 52.28 0 0 0-12.64-30.45l8.06-8.06a63.6 63.6 0 0 1 15.97 38.5h-11.4z" fill="#ffe19c" transform="rotate(45, 64, 64)"/><path d="M116.3 60.18a52.28 52.28 0 0 0-12.64-30.45l8.06-8.06a63.6 63.6 0 0 1 15.97 38.5h-11.4z" fill="#ffe19c" transform="rotate(90, 64, 64)"/><path d="M116.3 60.18a52.28 52.28 0 0 0-12.64-30.45l8.06-8.06a63.6 63.6 0 0 1 15.97 38.5h-11.4z" fill="#ffe19c" transform="rotate(135, 64, 64)"/><path d="M116.3 60.18a52.28 52.28 0 0 0-12.64-30.45l8.06-8.06a63.6 63.6 0 0 1 15.97 38.5h-11.4z" fill="#ffe19c" transform="rotate(180, 64, 64)"/><path d="M116.3 60.18a52.28 52.28 0 0 0-12.64-30.45l8.06-8.06a63.6 63.6 0 0 1 15.97 38.5h-11.4z" fill="#ffe19c" transform="rotate(225, 64, 64)"/><path d="M116.3 60.18a52.28 52.28 0 0 0-12.64-30.45l8.06-8.06a63.6 63.6 0 0 1 15.97 38.5h-11.4z" fill="#ffe19c" transform="rotate(270, 64, 64)"/><path d="M116.3 60.18a52.28 52.28 0 0 0-12.64-30.45l8.06-8.06a63.6 63.6 0 0 1 15.97 38.5h-11.4z" fill="#ffff00" transform="rotate(315, 64, 64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;45 64 64;90 64 64;135 64 64;180 64 64;225 64 64;270 64 64;315 64 64" calcMode="discrete" dur="560ms" repeatCount="indefinite"></animateTransform></g></svg>
                <i class="kiwi gradientText noLink fas fa-kiwi-bird"></i>
            </div>

            <div id="wrapper">
            <!-- LINIJE -->
                <?php
                if(!isset($_SESSION['User'])){
                    for($i = 0; $i<8; $i++)
                        echo "<div class='line start'></div>";
                }
                else{
                    for($i = 0; $i<8; $i++)
                        echo "<div class='line'></div>";
                }
                ?>

            <!-- NAVIGACIJA -->
                <div id='menu' class='<?php if(!isset($_SESSION['User']))echo 'start' ?>'>
                    <?php
                        for($i = 0; $i<3; $i++)
                            echo "<div class='nav_line'></div>";
                    ?>
                </div>

            <!-- SESSION -->
                <?php 
                    if(!isset($_SESSION['User'])){
                        require_once "pages/Templates/startScreen.php";
                    }
                    else if($_SESSION['User']->RoleID == 2){
                            require_once "pages/Templates/User.php";
                        }
                        else{
                            require_once "pages/Templates/User.php";
                            require_once "pages/Templates/Admin.php";
                        }
                ?>

            <!-- INSERT SUCCESS -->
                <?php
                    if(isset($_GET['insert'])){
                       if($_GET['insert']==1){
                            echo "<p class='inserting insertS'>Saved entry</p>";
                       }
                       if($_GET['insert']==0){
                            echo "<p class='inserting insertF'>Error occured while submitting</p>";
                       }
                       if($_GET['insert']==2){
                        echo "<p class='inserting insertF'>Picture upload failed - file too big</p>";
                       } 
                    }

                    if(isset($_GET['update'])){
                        if($_GET['update']==1){
                             echo "<p class='inserting insertS'>Updated entry</p>";
                        }
                        if($_GET['update']==0){
                             echo "<p class='inserting insertF'>Error occured while updating</p>";
                        }
                        if($_GET['update']==2){
                         echo "<p class='inserting insertF'>Picture upload failed - file too big</p>";
                        } 
                     }

                    if(isset($_GET['delete'])){
                        if($_GET['delete']==1){
                            echo "<p class='inserting insertS'>Deleted</p>";
                        } 
                    }
                ?>

                <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                <script type="text/javascript" src="js/main.js"></script>
            </div>
        </body>
	</html>