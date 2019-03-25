<?php
    header("Content-type: application/json");
    session_start();

    if(isset($_POST['subNew'])){
        
        //Getting data from submit
        $head = trim($_POST['newHead']);
        $text = trim($_POST['newText']);

        if( $head != '' || $text != ''){

            //Adding slashes to 'prevent' SQL Injection
            $head = addslashes($head);
            $text = addslashes($text);

            $uID = $_SESSION['User']->UserID;

            $date = date();

            require_once "connection.php";

            //Insert Entry data
            $insertQ = "INSERT INTO entries (Text, UserID, Heading, Entered, LastModified) VALUES (?, ?, ?, ?, ?)";
            $query = $conn->prepare($insertQ);
            $result = $query->execute(array($text, $uID, $head, $date, $date));

            //Getting last inser ID
            $lastId = $conn->lastInsertId();

            if($_FILES['imgFile']['name'] != ""){
                //Getting image information
                $fileName = $_FILES['imgFile']['name'];
                $tmpName = $_FILES['imgFile']['tmp_name'];
                $fileSize = $_FILES['imgFile']['size'];
                $fileType = $_FILES['imgFile']['type'];
                $fileError = $_FILES['imgFile']['error'];

                //In case we need it later for something
                $oldName = addslashes($fileName);

                //Creating new unique name for image
                $nameParts = explode(".", $fileName);
                $ext = end($nameParts);
                $newName = $lastId . $_SESSION['User']->Username . "." . $ext; 

                $uploadDir = '../images/uImg/';
                $filePath = $uploadDir . $newName;

                $result = move_uploaded_file($tmpName, $filePath);

                if (!$result){ 
                    header("Location: ../index.php?insert=2");
                }
                else{
                    $fileName = addslashes($newName);
                    $imgQ = "UPDATE entries SET Src = ?, OldName = ? WHERE EntryID = ?";
                    $imgQuery = $conn->prepare($imgQ);
                    $imgResult = $imgQuery->execute(array($filePath, $oldName, $lastId));
                    header("Location: ../index.php?insert=1");
                }
            }
            else{
                header("Location: ../index.php?insert=1");
            } 
        }
        else{
            header("Location: ../index.php?insert=0");
        }
    }
?>