<?php

if (empty($_SERVER['HTTP_REFERER']) || !filter_var($_SERVER['HTTP_REFERER'], FILTER_VALIDATE_URL)) {
    header('Location: ../index.php');
    exit;
}

define('aosw98e3398hdhb', true);
require "../xiconfig/config.php";
require "../xiconfig/init.php";

//if (!$user->LoggedIn($odb) || !$user->isAdmin($odb)) {
    //header("HTTP/1.0 404 Not Found");
    //exit();
//}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $draw = $_POST["draw"];
    $row = $_POST["start"];
    $rowperpage = $_POST["length"];
    $columnIndex = $_POST["order"][0]["column"];
    $columnName = $_POST["columns"][$columnIndex]["name"];
    $columnSortOrder = $_POST["order"][0]["dir"];
    $searchValue = htmlentities($_POST["search"]["value"]);

    $searchQuery = " ";
    if ($searchValue != "") {
        $searchQuery = " AND (username like '%" .$searchValue ."%') ";
    }

    $AllRecords = $odb->query(
        "SELECT COUNT(*) FROM `users` ORDER BY `id` DESC"
    );
    $totalRecords = $AllRecords->fetchColumn(0);

    $SelectFilter = $odb->query(
        "SELECT COUNT(*) FROM `users` WHERE 1 " . $searchQuery
    );
    $totalRecordwithFilter = $SelectFilter->fetchColumn(0);

    $SelectUsers = $odb->prepare(
        "SELECT * FROM `users` WHERE 1 " .
            $searchQuery .
            " ORDER BY " .
            $columnName .
            " " .
            $columnSortOrder .
            " LIMIT :limit,:offset"
    );
    $SelectUsers->execute([":limit" => $row, ":offset" => $rowperpage]);

    $data = [];
    while ($row = $SelectUsers->fetch(PDO::FETCH_ASSOC)) {

        $rank = $row["rank"] == 1 ? "Admin" : "Customer";

        $data[] = [
            "id" => htmlspecialchars($row["ID"]),
            "username" => htmlspecialchars($row["username"]),
            "rank" => $rank,
            "action" =>
                '<button class="btn btn-success"><a href="user?id=' .
                htmlspecialchars($row["ID"]) .
                '"><i class="fa fa-commenting-o"></i></a></button>',
        ];
    }

    $response = [
        "draw" => intval($draw),
        "iTotalRecords" => $totalRecords,
        "iTotalDisplayRecords" => $totalRecordwithFilter,
        "aaData" => $data,
    ];

    echo json_encode($response);
}

?>
