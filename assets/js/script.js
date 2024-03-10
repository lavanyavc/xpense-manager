let publicPaths = ["/xpense-manager/index.html", "/xpense-manager/register.html", "/xpense-manager/reset.html"]
let itemsDesign = ["primary", "success", "info", "danger", "warning"];

// Do Defaults on Document Ready
$(document).ready(async function () {
      let token = localStorage.getItem("authToken");
      if (!token && !publicPaths.includes(window.location.pathname)) {
            window.location.href = "/xpense-manager/index.html";
      }

      if (token && publicPaths.includes(window.location.pathname)) {
            window.location.href = "/xpense-manager/dashboard.html";
      }

      let name = localStorage.getItem("userName");
      if (name) {
            $("#profileName").html(name);
      }
});

// Open the Navigation Menu
function openNav() {
      document.getElementById("mySidenav").style.width = "200px";
      document.getElementById("main").style.marginLeft = "200px";
      document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

// Close the Navigation Menu
function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
      document.body.style.backgroundColor = "white";
}

// Logo Update in Login Screen
function updateLogo(input) {
      var mailId = document.getElementById("email");
      var displayLetter = document.getElementById("logo");
      var color = ["red", "blue", "yellow", "green", "orange", "cyan", "purple", "pink", "white"];
      displayLetter.innerHTML = "Hi";
      displayLetter.style.backgroundColor = "#eee";
      if (mailId.value.length > 0) {
            let i = Math.floor(Math.random() * color.length - 1);
            displayLetter.style.backgroundColor = color[i];
            displayLetter.innerHTML = mailId.value.charAt(0).toUpperCase();
      }
}

// Register an user
async function register() {
      let name = document.getElementById("name").value;
      if (name == "") {
            core.getFlashMsg("WARNING", "Enter valid Name");
            return false;
      }
      let arrName = name.toLowerCase().split(" ");
      name = "";
      arrName.forEach(element => {
            name += element[0].toUpperCase() + element.slice(1);
            name += " ";
      });
      document.getElementById("name").value = name.trim();

      let mobile = document.getElementById("mobile").value;
      let isMatch = mobile.match(MOBILE_PATTERN);
      if (isMatch == null) {
            core.getFlashMsg("WARNING", "Enter valid mobile number");
            return false;
      }

      let email = document.getElementById("email").value;
      isMatch = email.match(EMAIL_PATTERN);
      if (isMatch == null) {
            core.getFlashMsg("WARNING", "Enter valid EmailID");
            return false;
      }

      let password = document.getElementById("password").value;
      isMatch = password.match(PASSWORD_PATTERN);
      if (isMatch == null) {
            core.getFlashMsg("WARNING", "Strong and Valid Password is required");
            return false;
      }

      let confirmPassword = document.getElementById("c-password").value;
      if (password != confirmPassword) {
            core.getFlashMsg("WARNING", "Confirm Password must match to Password");
            return false;
      }

      var request = JSON.stringify({
            data: {
                  "name": name,
                  "mobile": mobile,
                  "email": email,
                  "password": password
            },
            pagination: {
                  pageSize: 10,
                  currentPage: 1,
                  sortBy: "id",
                  sortOrder: "ASC"
            }
      });

      core.atLoader(true);
      let respObj = await core.ajax("/xpense-manager/apis/user/register.php", request, "POST");
      try {
            let response = JSON.parse(respObj);
            core.getFlashMsg("WARNING", response['message']);
      } catch {
            core.getFlashMsg("WARNING", "Something went wrong");
      } finally {
            core.atLoader(false);
      }
}

// login an user
async function login() {
      let email = document.getElementById("email").value;
      if (email == "") {
            core.getFlashMsg("WARNING", "Enter valid EmailID");
            return false;
      }

      let password = document.getElementById("password").value;
      if (password == "") {
            core.getFlashMsg("WARNING", "Password is required");
            return false;
      }

      var request = JSON.stringify({
            data: {
                  "email": email,
                  "password": password
            }
      });

      let respObj = await core.ajax("/xpense-manager/apis/user/login.php", request, "POST");
      try {
            let response = JSON.parse(respObj);
            if (response["code"] == 0) {
                  localStorage.setItem("authToken", response.data.token);
                  localStorage.setItem("userName", response.data.name);
                  window.location.href = "/xpense-manager/dashboard.html";
            } else {
                  core.getFlashMsg("DANGER", (response['message']));
            }
      } catch {
            core.getFlashMsg("WARNING", "Something went wrong");
      }
}

// Logout Prompt
function logoutPrompt() {
      let title = "Logout";
      let body = "Are you sure to logout ?";
      let footer = "<button class='btn btn-outline-primary btn-sm' onclick='logout();'>Confirm</button>";
      footer += "<button class='btn btn-outline-danger btn-sm ml-2'  onclick='core.closeDialogBox();'>Cancel</button>";
      core.getDialogBox(title, body, footer, "sm");
}

// Logout an User
function logout() {
      core.closeDialogBox();
      core.atLoader(true);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      setTimeout(function () {
            core.atLoader(false);
            window.location.href = "/xpense-manager/index.html";
      }, 1000);
}

// Search Users
async function searchUsers() {
      let searchKey = document.getElementById('userSearch').value;

      var request = JSON.stringify({
            authorization: localStorage.getItem('authToken'),
            data: {
                  "searchKey": searchKey
            },
            pagination: {
                  pageSize: 10,
                  currentPage: 1,
                  sortBy: "name",
                  sortOrder: "ASC"
            }
      });

      core.atLoader(true);
      let respObj = await core.ajax("/xpense-manager/apis/user/search.php?request=" + request);
      try {
            let response = JSON.parse(respObj);
            if (response["code"] == 0) {
                  let users = response["data"];
                  let userTemplate = "<table class='table table-bordered'>";
                  for (let user of users) {
                        userTemplate += "<tr><td>" + user.name + "</td><td>" + user.email + "</td><td><i class='fas fa-plus-square' onclick='addUser(`" + user.id + "`);'></i></td><tr>";
                  }
                  userTemplate += "</table>";
                  document.getElementById('userData').innerHTML = userTemplate;
            }
      } catch {
            core.getFlashMsg("WARNING", "Something went wrong");
      } finally {
            core.atLoader(false);
      }
}

// Opens Add User Dialog
function addUserDialog(id, name) {
      core.closeDialogBox();
      let title = "Add User to " + name;
      let body = "<input type='hidden' id='groupId' value='" + id + "' readonly>";
      body += "<input type='text' class='form-control' placeholder='Search Users' id='userSearch' onkeyup='searchUsers();' autocomplete='off'><br>";
      body += "<table class='table table-bordered'>";
      body += "<tr><th>Name</th><th>Email</th><th>Action</th></tr>";
      body += "</table>";
      body += "<span id='userData'></span>";
      let footer = "<button class='btn btn-outline-danger btn-sm'  onclick='core.closeDialogBox();'>Cancel</button>";
      setTimeout(function () {
            core.getDialogBox(title, body, footer, "md");
      }, 500);
}

// Add user to Group
async function addUser(userID) {
      if (userID == "") {
            core.getFlashMsg("WARNING", "Invalid User details");
            return false;
      }
      let groupID = document.getElementById("groupId").value;
      if (groupID == "") {
            core.getFlashMsg("WARNING", "Invalid Group");
            return false;
      }
      var request = JSON.stringify({
            authorization: localStorage.getItem('authToken'),
            data: {
                  "groupID": groupID,
                  "userID": userID
            },
      });

      core.atLoader(true);
      let respObj = await core.ajax("/xpense-manager/apis/user/add.php", request, "POST");
      try {
            let response = JSON.parse(respObj);
            let alertClass;
            switch (response["code"]) {
                  case 0:
                        alertClass = "SUCCESS";
                        break;
                  case 1:
                        alertClass = "WARNING";
                        break;
                  default:
                        alertClass = "DANGER";
                        break;
            }
            core.getFlashMsg(alertClass, response['message']);
      } catch {
            core.getFlashMsg("WARNING", "Something went wrong");
      } finally {
            core.atLoader(false);
      }
}

// Display List of Groups
async function listGroups() {
      let searchKey = document.getElementById("searchKey").value;

      var request = JSON.stringify({
            authorization: localStorage.getItem('authToken'),
            data: {
                  "searchKey": searchKey
            },
            pagination: {
                  pageSize: 10,
                  currentPage: 1,
                  sortBy: "name",
                  sortOrder: "ASC"
            }
      });

      core.atLoader(true);
      let respObj = await core.ajax("/xpense-manager/apis/group/list.php?request=" + request);
      try {
            let response = JSON.parse(respObj);
            let groups = response["data"];
            let items = "";
            let index = 0;
            for (let group of groups) {
                  let groupDesign = itemsDesign[index++ % itemsDesign.length];
                  let groupTemplate = "<div class='col-lg-4 mb-4'><div class='card bg-" + groupDesign + " text-white shadow'><div class='card-body' onclick='groupDetailsDialog(`" + group.id + "`)'>" + group.name + "<div class='text-white-50 small'>" + group.description + "</div></div></div></div>";
                  items += groupTemplate;
            }
            document.getElementById("listOfGroups").innerHTML = items;
      } catch {
            core.getFlashMsg("WARNING", "Something went wrong");
      } finally {
            core.atLoader(false);
      }
}

// Group Details Dialog
async function groupDetailsDialog(id) {
      let respObj = await core.ajax("/xpense-manager/apis/group/detailsByID.php?id=" + id);
      try {
            let response = JSON.parse(respObj);
            if (response["code"] == 0) {
                  // Group Details
                  let id = response.data.group.id;
                  let name = response.data.group.groupName;
                  let description = response.data.group.description;
                  let owner = response.data.group.ownerName;
                  let createdOn = response.data.group.created_on;
                  // Group Expense Details
                  let month = response.data.expense.month;
                  let year = response.data.expense.year;
                  let totalExpense = response.data.expense.total;
                  // Group Member Details
                  let count = response.data.members.count;
                  let latest = response.data.members.latest;

                  let title = name;

                  let body = "<table class='table table-bordered'>";
                  body += "<tr><th> Description </th><td colspan='3'>" + description + "</td></tr>";
                  body += "<tr><th> Created By </th><td>" + owner + "</td><th> Created On </th><td>" + createdOn + "</td></tr>";
                  body += "<tr><th> Latest Member </th><td> " + latest + " </td><th> Total Members </th><td> " + count + " </td></tr>";
                  body += "</table>";

                  body += "<table class='table table-bordered mt-4'>";
                  body += "<tr><th> Current Month Expense </th><td> &#8377; " + month + " /-</td><th> Current Year Expense </th><td> &#8377; " + year + " /-</td></tr>";
                  body += "<tr><th colspan='2'> Overall Expenses (since : " + createdOn + ") </th><td colspan='2'> &#8377; " + totalExpense + " /-  </td></tr>";
                  body += "</table>";

                  let footer = "<button class='btn btn-outline-primary btn-sm' onclick='addUserDialog(`" + id + "`,`" + name + "`);'>Add User</button>";
                  footer += "<button class='btn btn-outline-danger btn-sm ml-2'  onclick='core.closeDialogBox();'>Cancel</button>";

                  core.getDialogBox(title, body, footer, "lg");
            }
      } catch {
            core.getFlashMsg("WARNING", "Something went wrong");
      } finally {
            core.atLoader(false);
      }
}

// Add Group Dialog
function addGroupDialog() {
      let title = "Create Group";
      let body = "<input type='text' class='form-control' id='groupName' placeholder='Group Name' onkeyup='core.transformCase(this,`UCWORDS`);' autocomplete='off'><br>";
      body += "<input type='text' class='form-control' id='groupDescription' placeholder='Group Description' autocomplete='off'><br>";
      let footer = "<button class='btn btn-outline-primary btn-sm' onclick='addGroup();'>Create</button>";
      footer += "<button class='btn btn-outline-danger btn-sm ml-2' onclick='core.closeDialogBox();'>Cancel</button>";
      core.getDialogBox(title, body, footer, "md");
}

// Add Group
async function addGroup() {
      let groupName = document.getElementById("groupName").value;
      if (groupName == "") {
            core.getFlashMsg("WARNING", "Enter valid group name");
            return false;
      }
      let groupDescription = document.getElementById("groupDescription").value;
      if (groupDescription == "") {
            core.getFlashMsg("WARNING", "Enter valid group description");
            return false;
      }
      core.closeDialogBox();
      var request = JSON.stringify({
            authorization: localStorage.getItem('authToken'),
            data: {
                  "groupName": groupName,
                  "groupDescription": groupDescription
            },
      });
      core.atLoader(true);
      let respObj = await core.ajax("/xpense-manager/apis/group/add.php", request, "POST");
      try {
            let response = JSON.parse(respObj);
            let alertClass;
            switch (response["code"]) {
                  case 0:
                        alertClass = "SUCCESS";
                        listGroups();
                        break;
                  default:
                        alertClass = "DANGER";
                        break;
            }
            core.getFlashMsg(alertClass, response['message']);
      } catch {
            core.getFlashMsg("WARNING", "Something went wrong");
      } finally {
            core.atLoader(false);
      }
}
