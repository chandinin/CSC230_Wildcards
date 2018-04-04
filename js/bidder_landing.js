$(document).ready(function(){
    $("#opportunity-detail").hide();
    $("#opportunities-results").show();
    $("#show-list-btn").click(function() {    $("#opportunity-detail").hide(); $("#opportunities-results").show();});
    $.ajax({
        url: "php/api/opportunity/read.php", 
        success: createOpportunitiesList
    });
});


// Parse the JSON'd opportunity list and set the html of the 'results' div
function createOpportunitiesList(opportunities_json) {
    opportunities = opportunities_json["opportunity"];
    console.log("Length of opportunity array: " + opportunities.length.toString());

    list = document.createElement('ul');
    document.getElementById("opportunities-results").appendChild(list);

    for(var i = 0; i < opportunities.length; i++)
    {
        list_item = document.createElement('li');
        anchor = document.createElement("a");
        anchor.appendChild(document.createTextNode(opportunities[i].Name + " - " + opportunities[i].ClosingDate));

        list_item.appendChild(anchor);
        list.appendChild(list_item);

        anchor.onclick = (function() { 

            var ID = opportunities[i].OpportunityID;
            return function() { activateDetailView(ID); };
        })();
    }
}

function activateDetailView(ID)
{
    populateOpportunityDetail(ID);
    $("#opportunities-results").hide();
    $("#opportunity-detail").show();

}


// Parse the JSON'd opportunity list and set the html of the 'results' div
function parseOpportunity(opportunity) {
    console.log("Parsing...");
    $("#Title").text(opportunity["Name"]);
    $("#ClosingDate").text(opportunity["ClosingDate"]);
    $("#Description").text(opportunity["Description"]);
    $("#Category").text("TODO: Category")
    console.log("Done...");

}


function populateOpportunityDetail(ID) {
    $.ajax({
        url: "php/api/opportunity/read.php", 
        type: "POST",
        data: {"OpportunityID": ID},
        success: parseOpportunity
    });
}