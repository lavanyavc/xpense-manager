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
      let respObj = await core.ajax("/xpense-manager/apis/register.php", request, "POST");
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

      let respObj = await core.ajax("/xpense-manager/apis/login.php", request, "POST");
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
function promptLogout() {
      let title = "Are you sure ?";
      let body = "<button class='btn btn-warning mr-3' type='button' onclick='core.closeDialogBox();'>Cancel</button><a class='btn btn-primary' onclick='logout();'>Confirm</a>";
      core.getDialogBox(title, body, "small", false);
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

// Display List of Groups
async function listGroups() {
      let searchKey = document.getElementById("searchKey").value;

      var request = JSON.stringify({
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
      let respObj = await core.ajax("/xpense-manager/apis/groups.php?request=" + request);
      try {
            let response = JSON.parse(respObj);
            let groups = response["data"];
            let items = "";
            let index = 0;
            for (let group of groups) {
                  let groupDesign = itemsDesign[index++ % itemsDesign.length];
                  let groupTemplate = "<div class='col-lg-4 mb-4'><div class='card bg-" + groupDesign + " text-white shadow'><div class='card-body' onclick='showGroupDetails(`" + group.id + "`,`" + group.name + "`)'>" + group.name + "<div class='text-white-50 small'>" + group.description + "</div></div></div></div>";
                  items += groupTemplate;
            }
            document.getElementById("listOfGroups").innerHTML = items;
      } catch {
            core.getFlashMsg("WARNING", "Something went wrong");
      } finally {
            core.atLoader(false);
      }
}

async function showGroupDetails(id, name) {
      let respObj = await core.ajax("/xpense-manager/apis/groupDetails.php?id=" + id);
      try {
            let response = JSON.parse(respObj);
            let expense = response.data.expense;
            if (response["code"] == 0) {
                  let name = response.data.group.groupName;
                  let title = response.data.group.description;
                  let createdBy = response.data.group.userName;
                  let createdOn = response.data.group.created_on;
                  let owner = response.data.group.ownerName;
                  let month = response.data.expense.month;
                  let year = response.data.expense.year;
                  let totalExpense = response.data.expense.total;
                  let count = response.data.members.count;
                  let latest = response.data.members.latest;
                  let body = "Group Name: " + name + "<br>" + "Title: " + title + "<br>" + "Created By: " + createdBy + " | " + "Created On " + createdOn + "<br>" + "Owner: " + owner + " | " + "Since: 2024-Feb-25 " + "<br>" + "Expenses: " + "<br>" + "Month: $" + month + "/-" + " | " + "year: $" + year + "/-" + " | " + "Total: $" + totalExpense + "/-" + "<br>" + "Members :" + count + " people | " + "Latest: " + latest;
                  // console.log(response.data);
                  // core.getDialogBox(body, response, "medium");
                  core.getDialogBox(name, body, "medium");
            }
      } catch {
            core.getFlashMsg("WARNING", "Something went wrong");
      } finally {
            core.atLoader(false);
      }



}

