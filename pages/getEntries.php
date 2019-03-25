<?php 
    header("Content-type: application/json");
    session_start();

    if(isset($_SESSION['User'])){

        $uID = $_SESSION['User']->UserID; 

        require_once "connection.php";

        $getQ = "SELECT Text, Heading, Entered, LastModified, Src, OldName, EntryID FROM entries WHERE UserID = ?";
        $query = $conn->prepare($getQ);
        $result = $query->execute(array($uID));

        $ent = $query->fetchAll();

        foreach($ent as $e){
            $e->Text = stripslashes($e->Text);
            $e->Heading = stripslashes($e->Heading);
            $e->Entered = mktime(strtotime($e->Entered));
            $e->LastModified = mktime(strtotime($e->LastModified));
        }

        echo json_encode($ent);
    }
?>