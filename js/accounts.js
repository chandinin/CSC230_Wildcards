$(document).ready(function() {
    $("#empNew").hide();
    $("#showNewEmp").click(function() {
        showNewEmp();
    });
    $("#saveNewEmp").click(function() {
        saveEmployee();
        showEmpList();
    });
    $("#exitNewEmp").click(function() {
        showEmpList();
    });
    $('#clearNewEmp').click(function() {
        $('#newEmpForm')[0].reset();
     });



    $('#bidTab').click(function() {
        makeEmpBreadcrumb(3);
        getBidderList();
        getCategories($('#selectBidBiddderCategory'));
    });

    $('#empTab').click(function() {
        showEmpList();
    });

    $("#selectBidderCategory").change(function () {
        //Storing the dropdown selection in category variable
        category= $('#selectBidderCategory option:selected').attr('id');
        //getOppListbyCategory(id);
    });

    $("#empTab").trigger('click');

});

function initAccountPage() {
    showEmpList();
}

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
                var roles = employee.Roles;
                var numroles = roles.length;
                var rolelist="";
                for (var x=0; x< numroles; x++) {
                    rolelist = rolelist + " -" + roles[x].Name;
                }
                var editlink = "'editEmployee("+employee.id + ")'";
                var row = "<tr><td>" + employee.UserName + "</td><td>" + employee.ID + "</td><td>" + employee.FirstName +  "</td><td>" + employee.LastName +
                    "</td><td>" + employee.Email + "</td><td>" + employee.Phone + "</td><td>" + rolelist + "</td></tr>";
                $('#employeeListTableBody').append(row);
                $("#employeeListTableBody").trigger("update");
            }
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

function saveEmployee() {
    //"Roles":[{"Role":"1"}, {"Role":"2"}, {"Role":"3"},{"Role":"5"}]
    var empId = $('#formEmpIdInput').val();
    var uname = $('#formEmpUNameInput').val();
    var fname = $('#formEmpFNameInput').val();
    var lname = $('#formEmpLNameInput').val();
    var email = $('#formEmpEmailInput').val();
    var pwd = $('#formEmpPwdInput').val();
    var phone = $('#formEmpPhoneInput').val();
    var roles = new Array();
    if ($('#Checkbox0').is(":checked"))
        roles.push({Role:0});
    if ($('#Checkbox1').is(":checked"))
        roles.push({Role:1});
    if ($('#Checkbox2').is(":checked"))
        roles.push({Role:2});
    if ($('#Checkbox3').is(":checked"))
        roles.push({Role:3});
    if ($('#Checkbox4').is(":checked"))
        roles.push({Role:4});
    if ($('#Checkbox5').is(":checked"))
        roles.push({Role:5});
    var rolesjson = JSON.parse(JSON.stringify(roles));
    var jsonRecord =
        {"ID": empId,
            "UserName":uname,
            "FirstName":fname,
            "LastName":lname,
            "Email": email,
            "Phone":phone,
            "Roles":rolesjson,
            "Password":pwd,
        };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://athena.ecs.csus.edu/~wildcard/php/api/employee/create.php', true);
    xhr.onload = function () {
        if (xhr.status == 200) {
            var retval = xhr.responseText;
            var failed = retval.includes("failed");
            if(failed) {
                alert("Failed to create new employee");
            }
            else
                alert("Employee account created!");
        } else {
            alert("500: Server error saving employee");
        }
    };
    var jsonString = JSON.stringify(jsonRecord);
    xhr.send(jsonString);
    console.log("Wrote Json: " + jsonString);
}

function makeBreadcrumb(type) {
    $('#breadcrumb').empty();
    $('#breadcrumb').append(staticBreadcrumb);
    switch (type) {
        case 1:
            $("#breadcrumb").append("<li><a onclick='showEmpList()'>List Employees</a></li>");
            $("#breadcrumb").append("<li class='active'>Create Employee Account</li>")
            break;
        case 2:
            $("#breadcrumb").append("<li><a onclick='showEmpList()'>List Employees</a></li>");
            $("#breadcrumb").append("<li class='active'>New Employee</li>")
            break;
        case 3:
            $("#breadcrumb").append("<li><a onclick='showEmpList()'>List Bidders</a></li>");

            break;
        case 4:
            break;
        default:
            $("#breadcrumb").append("<li class=\"active\">List Opportunities</li>");
            break;
    }
}

var staticBreadcrumb = " <li><a href=\"home_page.html\">Home</a></li>\n";