function BidderLoginAction() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    //Check to see if user left username or password field blank
    if (username == "") {
        alert("Please enter user name")
    }
    else if (password == "") {
        alert("Please enter your password ")
    }
    else{
        //read username and password from the HTML form
        var params = {"UserName":username,
                    "PASSWORD":password};

        //Convert HTML form value to json
        var myJSON = JSON.stringify(params);
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", "http://athena.ecs.csus.edu/~mackeys/php/api/bidder/authentication.php", true);
        //Async call

        xhttp.onload = function () {
            var response = JSON.parse(xhttp.responseText);
            var status = JSON.parse(xhttp.status);
            if (status == 200 && response.authenticated) {
                localStorage.setItem("BidderID",response.ID);
                window.location.replace("bidder_landing.html")
            }
            else{
                alert("Incorrect username or password ")
            }
        }
        //Send POST request to server
        xhttp.send(myJSON);
    }
}