<?php
    header("Content-type: application/json");
    session_start();

    if(isset($_SESSION['User'])){

        // Getting data from AJAX
        $info = $_POST['vals'];
        
        //User ID
        $uID = $_SESSION['User']->UserID; 

        //CHECKING IF ENTERED OLD PASSWORD IS THE SAME AS REAL PASWORD
        if(md5($info['opass']) == $_SESSION['User']->Password){
            $forUpdate = [];

            require_once "connection.php";

            //COLLECTING ALL INFORMATION THAT IS DIFFERENT FROM ORIGINAL
            if($info['name']){
                if($info['name'] != $_SESSION['User']->Username){
                    $usernameQuery = "SELECT Username FROM users WHERE Username = ?";
                    $userQ = $conn->prepare($usernameQuery);
                    $userQ->execute(array($info['name']));
                    
                    $userRC = $userQ->rowCount();

                    if($userRC == 0)
                        $forUpdate['name'] = $info['name'];
                    else{
                        echo json_encode(array('badUser'=>'Username alredy exists'));
                        die;
                    }
                }
            }

            if($info['mail']){
                if($info['mail'] != $_SESSION['User']->Email){
                    $emailQuery = "SELECT Email FROM users WHERE Email = ?";
                    $mailQ = $conn->prepare($emailQuery);
                    $mailQ->execute(array($info['mail']));
                    
                    $mailRC = $mailQ->rowCount();

                    if($mailRC == 0)
                        $forUpdate['mail'] = $info['mail'];
                    else{
                        echo json_encode(array('badMail'=>'E-mail alredy exists'));
                        die;
                    }
                }
            }

            if($info['npass']){
                if(md5($info['npass']) != $_SESSION['User']->Password)
                    $forUpdate['npass'] = md5($info['npass']);
            }

            //CREATING QUERY
            if(count($forUpdate)> 0){
                $upitt = 'UPDATE users SET ';
                $upittVals = [];
                    
                if(isset($forUpdate['name'])){
                    $upitt .= 'Username = ?, ';
                    $upittVals[] = $forUpdate['name'];
                };
                if(isset($forUpdate['mail'])){
                    $upitt .= 'Email = ?,';
                    $upittVals[] = $forUpdate['mail'];
                };
                if(isset($forUpdate['npass'])){
                    $upitt .= 'Password = ?, ';
                    $upittVals[] = $forUpdate['npass'];
                };

                //CUTTING OFF LAST COMMA
                $comma = strrpos($upitt, ',');
                $upitt = substr_replace($upitt, '', $comma, 1);

                $upitt .= 'WHERE UserID = ?';
                $upittVals[] = $uID;

                //EXECUTING QUERY
                $query = $conn->prepare($upitt);
                $query->execute($upittVals);

                echo json_encode(array('succ'=>'Good'));
            }
        }
        else
            echo json_encode(array('badPass'=>'Old password mismatch'));
    }