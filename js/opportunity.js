




function getBidderList() {
    $('#bidListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://athena.ecs.csus.edu/~wildcard/php/api/bidder/read.php', true);
    xhr.onload = function () {
        if (xhr.status == 200) {
            //var bidArray = fakedata;
            var bidArray = JSON.parse(xhr.responseText);
            var size = bidArray.bidder.length;
            for (var i = 0; i < size; i++) {
                var bidder = bidArray.bidder[i];
                var row = "<tr><td>" + bidder.user_name + "</td><td>" + bidder.bidopsid + "</td><td>" + bidder.first_name + " " + bidder.middle_init + "</td><td>" + bidder.last_name +
                    "</td><td>" + bidder.email + "</td><td>" + bidder.phone + "</td><td>" + bidder.address + "</td><td>" +
                "<button class='btn btn-primary btn-lg'><span class='glyphicon glyphicon-eye-open'" +
                "aria-hidden='true'></span> Details </button></td></tr>";
                $('#bidListTableBody').append(row);
                $("#bidListTableBody").trigger("update");

            }
        } else {
            alert("Error response");
        }
    };
    xhr.send();

}

function editEmployee(eid) {
    alert('Editing employee');
}

function getEmployeeList() {
    $('#employeeListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://athena.ecs.csus.edu/~wildcard/php/api/employee/read.php', true);
    xhr.onload = function () {
        if (xhr.status == 200) {
            //var bidArray = fakedata;
            var empArray = JSON.parse(xhr.responseText);
            var size = empArray.employee.length;
            for (var i = 0; i < size; i++) {
                var employee = empArray.employee[i];
                var editlink = "'editEmployee("+employee.id + ")'";
                var row = "<tr><td>" + employee.user_name + "</td><td>" + employee.id + "</td><td>" + employee.first_name +  "</td><td>" + employee.last_name +
                    "</td><td>" + employee.email + "</td><td>" + employee.phone + "</td><td>" + employee.address + "</td><td>" +
                    "<button onclick="+ editlink + " class='btn btn-success btn-lg'><span class='glyphicon glyphicon-pencil'" +
                    "aria-hidden='true'></span> Edit </button></td></tr>";
                $('#employeeListTableBody').append(row);
                $("#employeeListTableBody").trigger("update");

            }
        } else {
            alert("Error response");
        }
    };
    xhr.send();

}
