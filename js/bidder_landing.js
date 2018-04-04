// TODO: Figure out a good way to pass bidder ID around the site
var bidder_id;

$(document).ready(function(){
    $("#show-list-btn").click(function() { router("#spa-opportunities-list"); });

    $("#proposals-tab").click(function() { activateProposalsList(); });
    $("#opportunities-tab").click(function() { activateOpportunitiesList(); });

    bidder_id = "2";
});


// Handles hiding and unhiding the correct divs, based on the arg div_to_show
// Does not handle actually initializing those divs.
function router(div_to_show)
{
    div_list = [
                    "#spa-opportunities-list",
                    "#spa-opportunity-detail",
                    "#spa-create-proposal",
                    "#spa-proposals-list",
                    "#spa-edit-proposal"
               ];

    if(!(div_list.includes(div_to_show)))
    {
        alert(div_to_show + " is not a valid div!");
        return;
    }

    for(var i = 0; i < div_list.length; i++)
    {
        $(div_list[i]).hide();
    }

    $(div_to_show).show();
}


/**************************
 * spa-opportunities-list *
 **************************/
function activateOpportunitiesList()
{
    initializeOpportunitiesList();
    router("#spa-opportunities-list");
}



function initializeOpportunitiesList()
{
    $.ajax({
        url: "php/api/opportunity/read.php", 
        success: populateOpportunitiesList
    });
}


// Parse the JSON'd opportunity list and set the html of the 'results' div
function populateOpportunitiesList(opportunities_json) {
    opportunities = opportunities_json["opportunity"];
    console.log("Length of opportunity array: " + opportunities.length.toString());

    list = document.createElement('ul');
    document.getElementById("spa-opportunities-list").innerHTML = ""; // Clear what we may already have there
    document.getElementById("spa-opportunities-list").appendChild(list);


    for(var i = 0; i < opportunities.length; i++)
    {
        list_item = document.createElement('li');
        anchor = document.createElement("a");
        anchor.appendChild(document.createTextNode(opportunities[i].Name + " - " + opportunities[i].ClosingDate));

        list_item.appendChild(anchor);
        list.appendChild(list_item);

        anchor.onclick = (function() { 

            var ID = opportunities[i].OpportunityID;
            return function() { activateOpportunityDetail(ID); };
        })();
    }
}

/**************************
 * spa-opportunity-detail *
 **************************/

function activateOpportunityDetail(ID)
{
    initializeOpportunityDetail(ID);
    router("#spa-opportunity-detail");
}

function initializeOpportunityDetail(ID) {
    $.ajax({
        url: "php/api/opportunity/read.php", 
        type: "POST",
        data: {"OpportunityID": ID},
        success: parseOpportunity
    });
}

// Parse the JSON'd opportunity list and set the html of the 'results' div
function parseOpportunity(opportunity) {
    console.log("Parsing...");
    $("#Title").text(opportunity["Name"]);
    $("#ClosingDate").text(opportunity["ClosingDate"]);
    $("#Description").text(opportunity["Description"]);
    $("#Category").text("TODO: Category")
    $("#create-proposal-btn").click( function() { activateCreateProposal(opportunity["OpportunityID"]); } );
    console.log("Done...");
}


/***********************
 * spa-create-proposal *
 ***********************/

function activateCreateProposal(opportunity_id)
{
    initializeCreateProposal(opportunity_id);
    router("#spa-create-proposal");
}


// Trying to use http://athena.ecs.csus.edu/~mackeys/php/api/opportunity/getDocTemplates.php
// Currently just kludge with getting all doctemplates
function initializeCreateProposal(opportunity_id)
{
    // Probably want to make this synchronous, so that we can populate the doc list then do other things
    $.ajax({
        url: "php/api/doctemplate/read.php", 
        type: "GET",
        success: populateOppDocTemplates
    });

    $.ajax({
        url: "php/api/opportunity/read.php", 
        type: "POST",
        data: {"OpportunityID": opportunity_id},
        success: populateOppTitle
    });

    $("#proposal-back-list-btn").click(function() { router("#spa-opportunities-list"); });
    $("#poposal-save-btn").click(function() { saveNewProposal(opportunity_id); });
}

function saveNewProposal(opportunity_id)
{
    console.log("In saveNewProposal");

    // Before we upload anything, create the new proposal record
    var proposal_create_success = false;

    new_proposal_json = {
        "ProposalID": getUniqueProposalID(),
        "OpportunityID": opportunity_id,
        "BidderID": bidder_id,
        "Status": "saved, still open",
        "TechnicalScore": -1,
        "FeeScore": -1,
        "FinalTotalScore": -1
    }

    console.log(new_proposal_json);

    $.ajax({    
        url: "php/api/proposal/create.php", 
        type: "POST",
        data: new_proposal_json,
        success: function(resp) { console.log(resp); proposal_create_success = false; },
        error: function(resp) { console.log(resp); proposal_create_success = true; },
        async: false
    });

    if(!proposal_create_success)
    {
        alert("Proposal Creation unsuccesfull");
        return false;
    }


    /************************
     * Upload the documents *
     ************************/
    // First Calculate how many we have to upload.
    doc_list_children = document.getElementById("opp-doc-templates-list").childNodes;

    for(i = 0; i < doc_list_children.length; i++)
    {
        current_child = doc_list_children[i];
        current_input = null;

        // Search for just the input in each li via localName=input
        for(j = 0; j < current_child.children.length; j++)
        {
            if(current_child.children[j].localName.toLowerCase() == "input")
                current_input = current_child.children[j];
        }

        if(current_input == null)
        {
            alert("Something terribly wrong has ocurred when trying to get a lock on the input");
            return false;
        }

        // console.log(current_input);

        // Check if there is a file for our current input, if so get a reference
        current_file = current_input.files.length > 0 ? current_input.files[0] : null;

        if(current_file == null)
        {
            console.log("No file for " + current_child.dataset.DocTemplateID + ", but that's ok!");
            continue;
        }

        console.log(current_child.dataset.DocTemplateID + " got file with name: " + current_file.name);
        console.log("Atthempting to upload...");

        var formData=new FormData();
        formData.append('upload[]', current_file, current_file.name);

        var xhr = new XMLHttpRequest();
        xhr.open('POST','php/api/proposal/uploadDoc.php');
        xhr.onload = function() {
            if(xhr.status == 200) {
                alert('File uploaded');
            } else {
                alert('Error uploading file:' + xhr.response);
            }
        };
        xhr.send(formData);
    }

    alert("TODO: Go back to list of opportunities");

}



// TODO: Update backend for this
function getUniqueProposalID()
{
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    var used_IDs = [];

    // $.ajax({
    //     url: "php/api/opportunity/read.php", 
    //     type: "POST",
    //     data: {"OpportunityID": opportunity_id},
    //     success: function(results) {
    //         for(i = 0; i < results.proposal.length; i++)
    //         {
    //             used_IDs += results.proposal[i].
    //     ,
    //     async: false
    // });

    return getRandomInt(0,65325).toString();
}


function populateOppTitle(opportunity)
{
    $("#opportunity-title").text("Title: " + opportunity["Name"]);
    $("#opportunity-countdown").text("Closing Date and Time: " + opportunity["ClosingDate"]);
}


function populateOppDocTemplates(opp_doc_templates)
{
    // TODO: Need more coverage on this URL, returning 3 byte files
    GET_FILE_URL_BASE = "php/api/doctemplate/getFile.php?doctemplateid=";

    doc_templates = opp_doc_templates["doctemplate"];

    console.log("Retrieved " + doc_templates.length.toString() + " doc templates");

    doc_list = document.getElementById("opp-doc-templates-list");
    doc_list.innerHTML = ""; // Clear what we may already have there

    for(i = 0; i < doc_templates.length; i++)
    {
        list_item = document.createElement('li');
        // Attach the DocTemplateID to the li itself for access by other functions
        // Will undoubtedly bite me in the ass down the road...
        list_item.dataset.DocTemplateID = doc_templates[i].DocTemplateID;

        // Create Template download anchor
        anchor = document.createElement("a");
        anchor.href = GET_FILE_URL_BASE+doc_templates[i].DocTemplateID;
        anchor.appendChild(document.createTextNode(doc_templates[i].DocTitle));

        // Create file upload element
        file_upload = document.createElement("INPUT");
        file_upload.setAttribute("type", "file");
        
        // Create submit button
        // file_upload_button = document.createElement("a");
        // file_upload_button.classList.add('btn');
        // file_upload_button.appendChild(document.createTextNode("upload"))



        // Attach all elements to the list_item
        list_item.appendChild(anchor);
        list_item.appendChild(file_upload);
        // list_item.appendChild(file_upload_button);

        doc_list.appendChild(list_item);
    }
}



/*********************
 * spa-proposals-list*
 *********************/
function activateProposalsList()
{
    initializeProposalsList();
    router("#spa-proposals-list");
}

function initializeProposalsList()
{
    // Fuck yeah, take that, readability!
    // Just gets all of the proposals, and then attaches the associated opportunity title to it
    $.ajax({
        url: "php/api/proposal/read.php", 
        success: function(proposals_json) {
            // TODO: If time, learn about promises
            num_proposal_callbacks_left = proposals_json["proposal"].length;

            proposals_json["proposal"].forEach( function (proposal_json)
            {
                $.ajax({
                    url: "php/api/opportunity/read.php?opportunityid="+proposal_json["OpportunityID"], 
                    success: function(opportunity_json) {
                        proposal_json["OpportunityName"] = opportunity_json["Name"];
                        num_proposal_callbacks_left--;

                        if(num_proposal_callbacks_left == 0) 
                        {
                            // Filter down all proposals till we get just ours
                            populateProposalList(proposals_json["proposal"].filter(proposal => proposal["BidderID"] == bidder_id)); 
                        }
                    }
                });
            });
        }
    });
}

function populateProposalList(proposals_json)
{
    list = document.createElement('ul');
    document.getElementById("spa-proposals-list").innerHTML = ""; // Clear what we may already have there
    document.getElementById("spa-proposals-list").appendChild(list);

    for(var i = 0; i < proposals_json.length; i++)
    {
        list_item = document.createElement('li');
        anchor = document.createElement("a");
        anchor.appendChild(document.createTextNode(proposals_json[i].OpportunityName + " - " + proposals_json[i].Status));

        list_item.appendChild(anchor);
        list.appendChild(list_item);

        anchor.onclick = (function() { 

            var ID = proposals_json[i].ProposalID;
            return function() { activateEditProposal(ID); };
        })();
    }
}




