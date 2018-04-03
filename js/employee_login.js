var employeeRole;

$(document).ready(function () {
    $("#selectRole").change(function () {
        //Storing the dropdown selection in employeerole variable
        employeeRole= $('#selectRole option:selected').html();
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
                switch (employeeRole) {
                    case 'Author':
                        window.location.replace("Opportunity.html")
                        break;
                    case 'Evaluator 1':
                        window.location.replace("evaluator1_landing.html")
                        break;
                    case 'Evaluator 2':
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
