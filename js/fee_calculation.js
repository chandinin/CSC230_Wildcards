function calculateFee(){
    var lowestFeeProposal = document.getElementById("lowestFee").value;
    var proposerFee = document.getElementById("feeProposal").value;
    var totalPossiblePoints = document.getElementById("totalPossiblePoints").value;

    if(lowestFeeProposal == "" || proposerFee == "" || totalPossiblePoints == ""){
        alert("Please enter all fields!");
    }
    else if(proposerFee < 1){
        alert("invalid Proposers Fee value!");
    }
    else{
        var feeProposalScore = (lowestFeeProposal/proposerFee)*totalPossiblePoints;
     document.getElementById("feeProposalScore").innerHTML = feeProposalScore;
     updateProposalTotalScore(feeProposalScore);
    }
}

function updateProposalTotalScore(feeProposalScore){
    var updateProposalScore = {"ProposalID":1,"FinalTotalScore":feeProposalScore};

    var updateProposal = JSON.stringify(updateProposalScore);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://athena.ecs.csus.edu/~wildcard/php/api/proposal/update.php",true);
    xhttp.onload = function () {
        if (xhttp.status == 200) {
            alert("Proposal Score updated!")
        } else {
            alert("Error seeking clarification!")
        }
    }
    xhttp.send(updateProposal);
}