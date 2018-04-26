//proposal id passes from the previous page where a specific proposal is selected
var proposalID = localStorage.getItem("proposalId");


//On Start
$(document).ready(
    function () {

        document.getElementById("proposalid").innerHTML = proposalID;
    });

document.getElementById("proposalid").value= "New text!";

function SeekClarification() {
    var message = document.getElementById("clarificationRequest").value;
    var params = {"ProposalID":proposalID,
        "question":message};
    var updateProposalStatus = {"ProposalID":proposalID,"Status":20};

    var updateClarification = JSON.stringify(params);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://athena.ecs.csus.edu/~wildcard/php/api/proposal/AddClarification.php",true);
    xhttp.onload = function () {
        if (xhttp.status == 200) {
            alert("Clarification request sent!")
        } else {
            alert("Error seeking clarification!")
        }
    }
    xhttp.send(updateClarification);

    var updateProposal = JSON.stringify(updateProposalStatus);
    var xhttp2 = new XMLHttpRequest();
    xhttp2.open("POST", "http://athena.ecs.csus.edu/~wildcard/php/api/proposal/update.php",true);
    xhttp2.onload = function () {
        if (xhttp2.status == 200) {
            alert("Proposal updated!")
        } else {
            alert("Error seeking clarification!")
        }
    }
    xhttp2.send(updateProposal);
}

//Discard typed message in text box
function DiscardMessage(){
    var textarea = document.getElementById("clarificationRequest");
    textarea.value = "";
}

