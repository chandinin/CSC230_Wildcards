function LoginAction() {

    if (document.forms["loginForm"]["username"].value == "") {
        alert("Please enter user name")
    }
    else if (document.forms["loginForm"]["password"].value == "") {
        alert("Please enter your password ")
    }
    var params = "UserName=" + document.forms["loginForm"]["username"].value +"chan&PASSWORD="+ document.forms["loginForm"]["password"].value;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://athena.ecs.csus.edu/~mackeys/php/api/bidder_authentication.php", true);
    xhttp.onreadystatechange = function () {
        if(JSON.parse(xhttp.responseText).authenticated == true){
            window.location.replace("http://athena.ecs.csus.edu/~mackeys/bidder_register.html")
        }
    }
    xhttp.send(params);


}