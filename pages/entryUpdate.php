<?php
    header("Content-type: application/json");
    session_start();

    if(isset($_POST['subUp'])){
        
        //Getting data from submit
        $head = trim($_POST['upHead']);
        $text = trim($_POST['upText']);
        $eid = $_POST['hiddenId'];

        if( $head != '' || $text != ''){

            //Adding slashes to 'prevent' SQL Injection
            $head = addslashes($head);
            $text = addslashes($text);

            $uID = $_SESSION['User']->UserID;

            $lm = date();

            require_once "connection.php";

            //Update Entry data
            $updateQ = "UPDATE entries SET Text = ?, Heading = ?, LastModified = ? WHERE EntryID = ?";
            $query = $conn->prepare($updateQ);
            $result = $query->execute(array($text, $head, $lm, $eid));

            if($_FILES['imgFile']['name'] != ""){
                
                //Deleting old image if exists
                $getImg = "SELECT Src FROM entries WHERE EntryID = ?";
                $getImgQuery = $conn->prepare($getImg);
                $getImgQuery->execute(array($eid));

                $res = $getImgQuery->fetch();

                if(file_exists($res->Src)){
                    unlink($res->Src);
                }

                //Getting new image information
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
                $newName = $eid . $_SESSION['User']->Username . "." . $ext; 

                $uploadDir = '../images/uImg/';
                $filePath = $uploadDir . $newName;

                $result = move_uploaded_file($tmpName, $filePath);

                if (!$result){ 
                    header("Location: ../index.php?update=2");
                }
                else{
                    $fileName = addslashes($newName);
                    $imgQ = "UPDATE entries SET Src = ?, OldName = ? WHERE EntryID = ?";
                    $imgQuery = $conn->prepare($imgQ);
                    $imgResult = $imgQuery->execute(array($filePath, $oldName, $eid));
                    header("Location: ../index.php?update=1");
                }
            }
            else{
                header("Location: ../index.php?update=1");
            } 
        }
        else{
            header("Location: ../index.php?update=0");
        }
    }
?>