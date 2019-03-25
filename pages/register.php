<?php
    header("Content-type: application/json");

    $username = $_POST['user'];
    $password = $_POST['pass'];
    $email = $_POST['mail'];

    $userRe = "/^[A-z][a-z]{2}[\da-z]{0,7}$/";
    $passRe = "/[\w\d\W\D\s]{5,}/";
    $mailRe = "/^[A-z\d]{2,}(\.?(\W\D)?[A-z\d]{2,})*\@\w{2,}(\.\w{2,})*$/";

    $errorsRE = [];
    $errorsDB = [];

    //REGEX VALIDATION
    if(!preg_match($userRe,$username))
        $errorsRE['user'] = ["code"=>1, "msg"=>"Wrong format for username"]; 
    if(!preg_match($passRe,$password))
        $errorsRE['pass'] = ["code"=>1, "msg"=>"Wrong format for password"];
    if(!preg_match($mailRe,$email))
        $errorsRE['mail'] = ["code"=>1, "msg"=>"Wrong format for e-mail"];
    
    //DB UNIQUE VALIDATION
    if(count($errorsRE)==0){
        // IF REGEX ARE OK -> CREATE CONNECTION WITH DB
        require_once "connection.php";

        // IF PASSWORD IS OK -> TURN INTO MD5
        $password = md5($password);

        $userQ = "SELECT Username FROM users WHERE Username = ?";
        $uQ = $conn->prepare($userQ);
        $uQ->execute(array($username));
        $resUser = $uQ->rowCount();

        $emailQ = "SELECT Email FROM users WHERE Email = ?";
        $eQ = $conn->prepare($emailQ);
        $eQ->execute(array($email));
        $resEmail = $eQ->rowCount();

        if($resUser == 1)
            $errorsDB['user'] = ["code"=>1, "msg"=>"Username alredy exists"];
        if($resEmail == 1)
            $errorsDB['mail'] = ["code"=>1, "msg"=>"E-mail alredy exists"];

        if(count($errorsDB)>0)
            echo json_encode($errorsDB);
        else{
            $insert = "INSERT INTO users (Username, Password, Email, RoleID) VALUES (?,  ?, ?, 2)";
            $query = $conn->prepare($insert);
            $result = $query->execute(array($username, $password, $email));
            
            http_response_code(201);
            echo json_encode(array('good'=>'Insert Successfull'));
        }
    }
    else 
        echo json_encode($errorsRE);



