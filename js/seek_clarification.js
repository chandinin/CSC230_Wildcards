//proposal id passes from the previous page where a specific proposal is selected
var bidderName = localStorage.getItem("bidderName");
var proposalID = localStorage.getItem("proposalId");
var bidderEmail;


//On Start
$(document).ready(
    function () {
        getBidderDetails();
        var oppName = localStorage.getItem("opportunityName");
        document.getElementById("opportunityName").innerHTML = oppName;
        document.getElementById("bidderName").innerHTML = bidderName;
        document.getElementById("proposalid").innerHTML = proposalID;
        $('#summernote'); $('#summernote').summernote({
            height: 300,
            minHeight: 300,
            maxHeight: null,
            focus: true
        });
    });

//document.getElementById("proposalid").value= "New text!";

function SeekClarification() {
    var message = $('#summernote').summernote('code');
    var params = {"ProposalID":proposalID, "question":message};
    var updateProposalStatus = {"ProposalID":proposalID,"Status":20};
    var updateClarification = JSON.stringify(params);

    sendInboxNotification(updateClarification);
    updateProposalStat(updateProposalStatus);
    sendEmail(message);
}

function sendInboxNotification(updateClarification){
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
}

//update proposal status to seeking clarification 1
function updateProposalStat(updateProposalStatus){
    var updateProposal = JSON.stringify(updateProposalStatus);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://athena.ecs.csus.edu/~wildcard/php/api/proposal/update.php",true);
    xhttp.onload = function () {
        if (xhttp.status == 200) {
            alert("Proposal updated!")
        } else {
            alert("Error seeking clarification!")
        }
    }
    xhttp.send(updateProposal);
}

//send email
function sendEmail(message){
    var sendEmail = {"To":bidderEmail,
        "Subject":'Calpers Notification',"Body":message};
    var emailJson = JSON.stringify(sendEmail);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://athena.ecs.csus.edu/~wildcard/php/api/mail/mail.php",true);
    xhttp.onload = function () {
        if (xhttp.status == 200) {
            alert("Proposal updated!")
        } else {
            alert("Error seeking clarification!")
        }
    }
    xhttp.send(emailJson);
}

//Discard typed message in text box
function DiscardMessage(){
    var textarea = document.getElementById("clarificationRequest");
    textarea.value = "";
}

//get bidder details based on proposal id
function getBidderDetails() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/proposal/getBidder.php?ProposalID='+proposalID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var bidderDetails = JSON.parse(xhr.responseText);
            bidderEmail = bidderDetails.email;
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

function SecondarySeekClarification(){
    var message = $('#summernote').summernote('code');
    var params = {"ProposalID":proposalID, "question":message};
    var updateProposalStatus = {"ProposalID":proposalID,"Status":25};
    var updateClarification = JSON.stringify(params);

    sendInboxNotification(updateClarification);
    updateProposalStat(updateProposalStatus);
    sendEmail(message);
}