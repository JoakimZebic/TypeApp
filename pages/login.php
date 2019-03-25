<?php
	header("Content-type: application/json");
	session_start();

		$username = $_POST['user'];
		$password = $_POST['pass'];

		$userRe = "/^[A-z][a-z]{2}[\da-z]{0,7}$/";
		$passRe = "/[\w\d\W\D\s]{5,}/";

		$errorsRE = [];
		$errorsDB = [];
	
		//REGEX VALIDATION
		if(!preg_match($userRe,$username))
			$errorsRE['user'] = ["code"=>1, "msg"=>"Wrong format for username"]; 
		if(!preg_match($passRe,$password))
			$errorsRE['pass'] = ["code"=>1, "msg"=>"Wrong format for password"];

		if(count($errorsRE)==0){
			// IF REGEX ARE OK -> CREATE CONNECTION WITH DB
			require_once "connection.php";

			// IF PASSWORD IS OK -> TURN INTO MD5
			$password = md5($password);
	
			$Query = "SELECT * FROM users WHERE Username = ? AND Password = ?";
			$pQ = $conn->prepare($Query);
			$pQ->execute(array($username, $password));
			$result = $pQ->rowCount();
	
			if($result != 1)
				$errorsDB['error'] = ["code"=>1, "msg"=>"Wrong username or password"];
	
			if(count($errorsDB)>0)
				echo json_encode($errorsDB);
			else{
				//Fetchig only 1 user
				$user = $pQ->fetch();

				//Creating session
				$_SESSION['User'] = $user;

				echo json_encode(array('good'=>'Insert Successfull'));
			}
		}
		else 
			echo json_encode($errorsRE);