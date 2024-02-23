let publicPaths = ["/xpense-manager/index.html", "/xpense-manager/register.html", "/xpense-manager/reset.html"]
let itemsDesign = ["primary", "success", "info", "danger", "warning"];

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

/* Set the width of the side navigation to 200px and the left margin of the page content to 200px and add a black background color to body */
function openNav() {
      document.getElementById("mySidenav").style.width = "200px";
      document.getElementById("main").style.marginLeft = "200px";
      document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
      document.body.style.backgroundColor = "white";
}

// Register an user
function register() {
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
      let isMatch = mobile.match(/^[0-9]{10}$/);
      if (isMatch == null) {
            core.getFlashMsg("WARNING", "Enter valid mobile number");
            return false;
      }

      let email = document.getElementById("email").value;
      isMatch = email.match(/^\S+@\S+\.\S+$/);
      if (isMatch == null) {
            core.getFlashMsg("WARNING", "Enter valid EmailID");
            return false;
      }

      let password = document.getElementById("password").value;
      isMatch = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
      if (isMatch == null) {
            core.getFlashMsg("WARNING", "Strong and Valid Password is required");
            return false;
      }

      let confirmPassword = document.getElementById("c-password").value;
      if (password != confirmPassword) {
            core.getFlashMsg("WARNING", "Confirm Password must match to Password");
            return false;
      }

      var request = {
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
      }

      var XHRobj = core.createXHRObj(false);
      if (!XHRobj) {
            core.getFlashMsg("WARNING", "Incompatible to start AJAX Engine");
            return;
      }

      core.atLoader(true);
      XHRobj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                  var respObj = this.responseText;
                  try {
                        let response = JSON.parse(respObj);
                        core.getFlashMsg("WARNING", response['message']);
                  } catch {
                        core.getFlashMsg("WARNING", "Something went wrong");
                  } finally {
                        core.atLoader(false);
                  }
            }
      }

      XHRobj.open("POST", "/xpense-manager/apis/register.php", false);
      XHRobj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      XHRobj.send(JSON.stringify(request));
}

// login an user
function login() {
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

      var request = {
            data: {
                  "email": email,
                  "password": password
            }
      }

      var XHRobj = core.createXHRObj(false);
      if (!XHRobj) {
            core.getFlashMsg("WARNING", "Incompatible to start AJAX Engine");
            return;
      }

      core.atLoader(true);
      XHRobj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                  var respObj = this.responseText;
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
                  } finally {
                        core.atLoader(false);
                  }
            }
      }

      XHRobj.open("POST", "/xpense-manager/apis/login.php", false);
      XHRobj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      XHRobj.send(JSON.stringify(request));
}

// Logout an User
function logout() {
      core.atLoader(true);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      core.atLoader(false);
      window.location.href = "/xpense-manager/index.html";
}

// Display List of Groups
function listGroups() {
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
      var XHRobj = core.createXHRObj(false);
      if (!XHRobj) {
            core.getFlashMsg("WARNING", "Incompatible to start AJAX Engine");
            return;
      }

      core.atLoader(true);
      XHRobj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                  var respObj = this.responseText;
                  try {
                        let response = JSON.parse(respObj);
                        let groups = response["data"];
                        let items = "";
                        let index = 0;
                        for (let group of groups) {
                              let groupName = group.name;
                              let description = group.description;
                              index = index % itemsDesign.length;
                              let groupDesign = itemsDesign[index];
                              index++;
                              let groupTemplate = "<div class='col-lg-3 mb-4'><div class='card bg-" + groupDesign + " text-white shadow'><div class='card-body'>" + groupName + "<div class='text-white-50 small'>" + description + "</div></div></div></div>";
                              items += groupTemplate;
                        }
                        document.getElementById("listOfGroups").innerHTML = items;
                  } catch {
                        core.getFlashMsg("WARNING", "Something went wrong");
                  } finally {
                        core.atLoader(false);
                  }
            }
      }
      XHRobj.open("GET", "/xpense-manager/apis/groups.php?request=" + request, false);
      XHRobj.send();
}