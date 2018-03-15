function EmployeeLoginAction(form) {
    //Check to see if user left username or password field blank
    if (form.username.value == "") {
        alert("Please enter user name")
    }
    else if (form.password.value == "") {
        alert("Please enter your password ")
    }
    else{
        //read username and password from the HTML form
        var params = {"UserName":form.username.value,
            "PASSWORD":form.password.value};

        //Convert HTML form value to json
        var myJSON = JSON.stringify(params);
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", "http://athena.ecs.csus.edu/~mackeys/php/api/employee/authentication.php", false);
        //Async call

        xhttp.onload  = function () {
            if (this.status == 200 && this.response.authenticated == true) {
                //IF the authentication successful go to the landing page, NOTE: Need to change to the correct URL
                window.location.replace("http://athena.ecs.csus.edu/~mackeys/bidder_register.html")
                alert("Login Successful!!")
            }
            else{
                alert("Incorrect username or password ")
            }
        }
        //Send POST request to server
        xhttp.send(myJSON);
    }
}