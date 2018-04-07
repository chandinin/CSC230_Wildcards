var employeeRoleid;

$(document).ready(
    function () {
        getRoles();
    });

//get all Roles to populate dropdown
function getRoles(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/employee/getRoles.php',true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            fillRolesDropdown(jsonArray);
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

//Fill dropdown with roles
function fillRolesDropdown(jsonArray){
    var start = 0;
    var select = document.getElementById("selectRole")
    var size = jsonArray.role.length;

    for(var i=start;i<size;i++) {
        var option = document.createElement("OPTION");
        txt = document.createTextNode(jsonArray.role[i].Name);
        option.appendChild(txt);
        option.setAttribute("value", jsonArray.role[i].Name)
        option.setAttribute("id", jsonArray.role[i].RoleID)
        select.insertBefore(option, select.lastChild);
    }
}

//Capture the role id of the selection from user
$(document).ready(function () {
    $("#selectRole").change(function () {
        //Storing the dropdown selection in category variable
        employeeRoleid = $('#selectRole option:selected').attr('id');
    });
});

function EmployeeLoginAction() {

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    //Check to see if user left username or password field blank
    if (username == "") {
        alert("Please enter user name")
    }
    else if (password == "") {
        alert("Please enter your password ")
    }
    else {
        //read username and password from the HTML form
        var params = {
            "UserName": username,
            "PASSWORD": password
        };

        //Convert HTML form value to json
        var myJSON = JSON.stringify(params);
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", "http://athena.ecs.csus.edu/~mackeys/php/api/employee/authentication.php", true);
        //Async call
        xhttp.onload = function () {
            var response = JSON.parse(xhttp.responseText);
            var status = JSON.parse(xhttp.status);
            if (status == 200 && response.authenticated == true) {
                //IF the authentication successful go to the landing page, NOTE: Need to change to the correct URL
                switch (employeeRoleid) {
                    case "0": //Author
                        window.location.replace("Opportunity.html")
                        break;
                    case "1": //Reviewer
                        window.location.replace("Opportunity.html")
                        break;
                    case "2": //Approver
                        alert("Opportunity.html");
                        break;
                    case "3": //Lead Evaluator
                        alert("Evaluator 2 is under construction, Coming soon!");
                        break;
                    case "4": // Preliminary Evaluator
                        window.location.replace("evaluator1_landing.html");
                        break;
                    case "5": // Secondary Evaluator
                        alert("Evaluator 2 is under construction, Coming soon!");
                        break;
                    default:
                        alert("Please pick a role!");
                }
            }
            else {
                alert("Incorrect username or password ");
            }
        }
        //Send POST request to server
        xhttp.send(myJSON);
    }
}
