<?php
ob_start();
define('aosw98e3398hdhb', true);
require_once "xiconfig/config.php";
require_once "xiconfig/init.php";

//if (!$user->isAdmin($odb)) {
   // header("Location: index.php");
   // exit();
//}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-88VFMZRZHX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-88VFMZRZHX');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="images/favicon.png">
    <title>Project Void - Admin Panel</title>
    <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/admin.css?v=<?php echo time(); ?>">
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="particles-js"></div>
    <?php include 'loading-screen.php'; ?>
<main>
<div class="admin-container">
<div class="admin-panel">
<h1>Users</h1>
          <div class="card-body">
            <div class="table-responsive mx-2">
              <table id="users-table" style="width:100%" class="mt-2 stripe display table bg-grayy-800 table-striped table-bordered border-gray">
                <thead>
                  <tr>
                    <th scope="col" class="text-start">#</th>
                    <th scope="col" class="text-center">Username</th>
                    <th scope="col" class="text-center">Rank</th>
                    <th scope="col" class="text-center">Action</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
</div>
</div>
<div class="admin-container">
<div class="admin-panel">
<h1>Create User</h1>
    <form class="login-form" id="createUserForm">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Create User</button>
        <div class="status-message" id="createUserStatus"></div>
    </form>
</div>
</div>
</main>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script>
GetUsers();
function GetUsers() {
    $("#users-table").DataTable({
        processing: true,
        serverSide: true,
        sPaginationType: "full_numbers",
        serverMethod: "post",
        responsive: true,
        language: {
            emptyTable: "No users"
        },
        ajax: {
            url: "server/getusers.php",
            type: "POST"
        },
        columnDefs: [{
            name: "id",
            targets: 0
        }, {
            name: "username",
            targets: 1
        }, {
            name: "rank",
            targets: 2
        }, {
            name: "action",
            targets: 3
        }, {
            targets: [1, 2, 3]
        }],
        order: [
            [0, "asc"]
        ],
        bDestroy: true,
        columns: [{
            data: "id"
        }, {
            data: "username"
        }, {
            data: "rank"
        }, {
            data: "action"
        }]
    });
}

document.getElementById('createUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    fetch('server/createuser.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const statusElement = document.getElementById('createUserStatus');
        statusElement.textContent = data.message;
        if (data.success) {
            this.reset();
            GetUsers(); // Refresh the users table
        }
    })
    .catch(error => {
        document.getElementById('createUserStatus').textContent = 'An error occurred';
    });
});
</script>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>