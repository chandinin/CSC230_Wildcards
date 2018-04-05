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
            var jsonArray = JSON.parse(xhr.responseText);
            fillProposalTable(jsonArray);
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

function fillProposalTable(jsonArray){

    var start = 0;
    var elements_per_page = 7;
    var limit = elements_per_page;
    var size = jsonArray.proposal.length;
    fillOppTable(start, limit);

    function fillOppTable(start, limit){
        for(var i=0;i<size;i++) {
            var proposal = jsonArray.proposal[i];
            var row ="<tr>"+"</td><td>" + proposal.OpportunityID+ "</td><td>" + "<a href='javascript:showProposalDetails(\"" + proposal.ProposalID + "\")'>" +  proposal.ProposalID + "</a></td><td>"
                + proposal.Status + "</td>";
                "Complete</button></td>";
            $('#proposalListTableBody').append(row);
            $("#proposalListTableBody").trigger("update");
        }
    }
    $('#next').click(function(){
        var next = limit;
        if(size>next) {
            limit = limit + elements_per_page;
            $('#proposalListTableBody').empty();
            console.log(next +' -next- '+limit);
            fillOppTable(next,limit);
        }
    });

    $('#prev').click(function(){
        var pre = limit-(2*elements_per_page);
        if(pre >= 0) {
            limit = limit - elements_per_page;
            console.log(pre +' -pre- '+limit);
            $('#proposalListTableBody').empty();
            fillOppTable(pre,limit);
        }
    });
}

function showProposalDetails(id) {
    localStorage.setItem("storageName",id);
    window.location.replace("list_documents.html");
}
