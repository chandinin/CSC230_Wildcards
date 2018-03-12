function LoginAction(form) {

    if (form.username.value == "") {
        alert("Please enter user name")
    }
    else if (form.password.value == "") {
        alert("Please enter your password ")
    }
    else{

        var params = {"UserName":form.username.value,
                    "PASSWORD":form.password.value};
        var myJSON = JSON.stringify(params);
        alert(myJSON);
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://athena.ecs.csus.edu/~mackeys/php/api/bidder/authentication.php", true);

        xhttp.onreadystatechange  = function () {
            var response = JSON.parse(xhttp.responseText);
            if(JSON.parse(xhttp.status) == 500){
                alert("Internal Server error!")
            }
            if (response.authenticated == true) {

                window.location.replace("http://athena.ecs.csus.edu/~mackeys/bidder_register.html")
            }
            else{
                alert("Incorrect username or password ")
            }
        }
        xhttp.send(myJSON);
    }
}