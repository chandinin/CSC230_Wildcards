$(document).ready(function() {
    $("#empNew").hide();
    $("#showNewEmp").click(function() {
        showNewEmp();
    });
    $('#bidTab').click(function() {
        makeEmpBreadcrumb(3);
        getBidderList();
        getCategories($('#selectBidBiddderCategory'));
    });

    $('#empTab').click(function() {
        showEmpList();
    });


    $('#empTab').click(function() {
        getEmployeeList();
    });
    $("#selectBidderCategory").change(function () {
        //Storing the dropdown selection in category variable
        category= $('#selectBidderCategory option:selected').attr('id');
        //getOppListbyCategory(id);
    });

});

function showNewEmp() {
   $('#empNew').show();
   $('#empList').hide();
   makeEmpBreadcrumb(2);
}

function showEmpList() {
    getEmployeeList();
    $('#empNew').hide();
    $('#empList').show();
    makeEmpBreadcrumb(1);
}

function showBidderList() {

}

function makeEmpBreadcrumb(type) {
    $('#breadcrumb_emp').empty();
    $('#breadcrumb_emp').append(staticBreadcrumb);
    switch (type) {
        case 1:
            $("#breadcrumb_emp").append("<li><a onclick='showEmpList()'>List Employee Accounts</a></li>");
            break;
        case 2:
            $("#breadcrumb_emp").append("<li><a onclick='showEmpList()'>List Employee Accounts</a></li>");
            $("#breadcrumb_emp").append("<li class='active'>Create Employee Account</li>")
            break;
        case 3:
            $("#breadcrumb_emp").append("<li><a onclick='showBidderList()'>List Bidder Accounts</a></li>");
            break;
        default:
            $("#breadcrumb_emp").append("<li class=\"active\">List Employee Accounts</li>");
            break;
    }
}

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
                var row = "<tr><td>" + employee.UserName + "</td><td>" + employee.ID + "</td><td>" + employee.FirstName +  "</td><td>" + employee.LastName +
                    "</td><td>" + employee.Email + "</td><td>" + employee.Phone + "</td><td>" + employee.Address + "</td><td>" +
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
