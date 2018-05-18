var proposalID = localStorage.getItem("proposalID");

$(document).ready(
    function () {
        document.getElementById("proposal").innerHTML = proposalID;
        var oppName = localStorage.getItem("opportunityName");
        document.getElementById("opportunityName").innerHTML = oppName;
        getBidderDetails();
        getScoringCriteria();
    });

//get bidder details based on proposal id
function getBidderDetails() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/proposal/getBidder.php?ProposalID='+proposalID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var bidderDetails = JSON.parse(xhr.responseText);
            bidderName = bidderDetails.first_name +" " + bidderDetails.last_name;
            document.getElementById("bidderName").innerHTML = bidderName;
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

function getScoringCriteria(){
    var opportunityID = localStorage.getItem("opportunityID");
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/getScoringCriteria.php?OpportunityID='+opportunityID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var scoringCriteria = JSON.parse(xhr.responseText);
            document.getElementById("scorCriteriaDoc").innerHTML = scoringCriteria;
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

//Go back to reveal fee
//TODO get this endpoint to work
function submit(){
    var proposersFee = document.getElementById("feeProposal").value;
    var updateProposerFee = {"ProposalID":proposalID,"Fee":proposersFee};

    var updateProposal = JSON.stringify(updateProposerFee);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://athena.ecs.csus.edu/~wildcard/php/api/proposal/update.php",true);
    xhttp.onload = function () {
        if (xhttp.status == 200) {
            alert("Proposer's Fee updated!")
            window.location.replace("reveal_fee.html")
        } else {
            alert("Error updating fee!")
        }
    }
    xhttp.send(updateProposal);
}
