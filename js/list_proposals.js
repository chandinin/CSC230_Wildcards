$(document).ready(
    function () {
        initNewOppForm();
        $('#listOppPanel').show();

        $('#exitNewOpp').click(function() {
            $("#listOppPanel").show();
        });

        $('#clearNewOpp').click(function() {
            $('#newOppForm')[0].reset();
        });

        $('#proposalListTable tr').click(function() {
            showOpp();
        });

        $('#exitNewOpp').click(function() {
            $('#newOppPanel').hide();
        });

    });

function showOppList() {
    $('#listOppPanel').show();
};

function getOppList() {

    $('#proposalListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/proposal/read.php',true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            // var jsonArray = fakedata;
            var jsonArray = JSON.parse(xhr.responseText);
            var size = jsonArray.proposal.length;
            for(var i=0;i<size;i++) {
                var proposal = jsonArray.proposal[i];
                var row ="<tr>"+"</td><td>" + proposal.OpportunityID+ "</td><td>" + "<a href='javascript:showOpp()'>" +  proposal.BidderID + "</a></td><td>"
                    + proposal.Status + "</td>";
                $('#proposalListTableBody').append(row);
                $("#proposalListTableBody").trigger("update");
            }
        } else {
            alert("Error response");
        }
    };
    xhr.send();

}

function initNewOppForm() {
    getOppList();
}

function showOpp() {
    window.location.replace("Opportunity_new.html")
}


//TODO Logic for pagination
function fillProposalTable(jsonArray){

    var size = jsonArray.opportunity.length;
        for(var i=start;i<size;i++) {
            fillOppTable(jsonArray);
            var opp = jsonArray.opportunity[i];
            var row ="<tr>"+"</td><td>" + opp.OpportunityID+ "</td><td>" + "<a href='javascript:showOpp()'>" +  opp.Name + "</a></td><td>"
                +  opp.Status + " </td>";
            $('#oppListTableBody').append(row);
            $("#oppListTableBody").trigger("update");
        }
}
