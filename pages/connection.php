<?php
    //Getting PDO information
    require_once "config.php";

    try {
        //Creating connection
        $conn = new PDO("mysql:host=".MYSQL_HOST.";dbname=".MYSQL_DBNAME.";charset=utf8", MYSQL_USERNAME, MYSQL_PASSWORD);
        
        //Setting fetch mode to OBJECT
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);

        //Setting error mode
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    }
    catch(PDOException $e){
        echo $e->getMessage();
    }


