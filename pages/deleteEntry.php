<?php 
    header("Content-type: application/json");
    session_start();

    if(isset($_SESSION['User'])){
        
        $eid = $_POST['eid'];

        require_once "connection.php";

        $getQ = "SELECT Src FROM entries WHERE EntryID = ?";
        $query = $conn->prepare($getQ);
        $query->execute(array($eid));

        $res = $query->fetch();

        if(file_exists($res->Src)){
            unlink($res->Src);
        }

        $delE = "DELETE FROM entries WHERE EntryID = ?";
        $query = $conn->prepare($delE);
        $result = $query->execute(array($eid));

        echo json_encode(array('ok'=>1));
    }
?>