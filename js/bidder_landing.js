// TODO: Figure out a good way to pass bidder ID around the site
var bidder_id;

$(document).ready(function(){
    $("#show-list-btn").click(function() { router("#spa-opportunities-list"); });

    $("#proposals-tab").click(function() { activateProposalsList(); });
    $("#opportunities-tab").click(function() { activateOpportunitiesList(); }); 

    $("#opportunities-list-table").tablesorter();
    $("#proposals-list-table").tablesorter();

    bidder_id = "1";
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

// Removes all elements in tbody, preserving 'thead'
function removeAllTableElements(table)
{
    var tbody = null;
    for(i = 0; i < table.children.length; i++)
    {
        if(table.children[i].localName.toLowerCase() == "tbody") 
        {
            table.children[i].innerHTML = "";
        }
    }
}

// Blindly inserts rows into the specified table DOM node
// Each element in rows_array is an array of nodes to be inserted into a new TR element
function insertTableRows(rows_array, table_node)
{    
    var tbody = null;
    for(i = 0; i < table_node.children.length; i++)
    {
        if(table_node.children[i].localName.toLowerCase() == "tbody") 
        {
            tbody = table_node.children[i];
            break;
        }
    }

    if(tbody == null)
    {
        alert("There was an error inserting table_node rows, see logs");
        console.log(rows_array);
        console.log(table_node);
    }

    try
    {
        for(i = 0; i < rows_array.length; i++)
        {
            current_row = rows_array[i];
            var tr = document.createElement('TR');

            for(j = 0; j < current_row.length; j++)
            {
                var td = document.createElement('TD');
                td.appendChild(rows_array[i][j]);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }
    catch(error)
    {
        console.log(error);
        console.log(rows_array[i][j]);
        console.log(rows_array);
        console.log(table_node);
        return;
    }

    $("#"+table_node.id).trigger("update");
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
    // $.ajax({
    //     url: "php/api/opportunity/read.php", 
    //     success: populateOpportunitiesList
    // });

    $.ajax({
        url: "php/api/opportunity/read.php", 
        success: function(opportunities_json)
        {
            opportunities = opportunities_json["opportunity"];
            num_opportunity_callbacks_left = opportunities.length;

            opportunities.forEach(function(opportunity)
            {
                $.ajax({
                    url: "php/api/opportunity/categoryName.php?CategoryID="+opportunity.CategoryID, 
                    success: function(category_json)
                    {
                        opportunity.CategoryName = category_json.Name;
                        num_opportunity_callbacks_left--;

                        if(num_opportunity_callbacks_left == 0)
                        {
                            populateOpportunitiesList(opportunities_json);
                        }
                    }
                });
            });
        }
    });
}


function populateOpportunitiesList(opportunities_json) {
    opportunities = opportunities_json["opportunity"];
    console.log("Length of opportunity array: " + opportunities.length.toString());

    opportunities_table = document.getElementById("opportunities-list-table");
    removeAllTableElements(opportunities_table); // Clear what we might already have there

    table_array = [];

    for(var i = 0; i < opportunities.length; i++)
    {
        closingDate_textNode = document.createTextNode(opportunities[i].ClosingDate);
        category_textNode = document.createTextNode(opportunities[i].CategoryName);
        anchor   = document.createElement("a");

        anchor.appendChild(document.createTextNode(opportunities[i].Name));
        anchor.onclick = (function() { 
            var ID = opportunities[i].OpportunityID;
            return function() { activateOpportunityDetail(ID); };
        })();

        table_array.push([anchor, category_textNode, closingDate_textNode]);
    }

    insertTableRows(table_array, opportunities_table);
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
    // $.ajax({
    //     url: "php/api/opportunity/read.php", 
    //     type: "POST",
    //     data: {"OpportunityID": ID},
    //     success: parseOpportunity
    // });

    $.ajax({
        url: "php/api/opportunity/read.php", 
        type: "POST",
        data: {"OpportunityID": ID},
        success: function(opportunity)
        {
            $.ajax({
                url: "php/api/opportunity/categoryName.php?CategoryID="+opportunity.CategoryID, 
                success: function(category_json)
                {
                    opportunity.CategoryName = category_json.Name;
                    parseOpportunity(opportunity);
                }
            });
        }
    });
}

// Parse the JSON'd opportunity list and set the html of the 'results' div
function parseOpportunity(opportunity) {
    console.log("Parsing...");
    $("#Title").text(opportunity["Name"]);
    $("#ClosingDate").text(opportunity["ClosingDate"]);
    $("#Description").text(opportunity["Description"]);
    $("#Category").text(opportunity.CategoryName);

    $("#create-proposal-btn").off();
    $("#create-proposal-btn").click( function() { activateCreateProposal(opportunity["OpportunityID"]); } );


    /*************************************************
     * Populate associated documents for Opportunity *
     *************************************************/
     $.ajax({
        url: "php/api/opportunity/getDocTemplates.php?opportunityid="+opportunity.OpportunityID, 
        type: "GET",
        success: function(opp_doc_templates)
        {
            // TODO: Need more coverage on this URL, returning 3 byte files
            GET_FILE_URL_BASE = "php/api/doctemplate/getFile.php?doctemplateid=";
            doc_list = document.getElementById("opp-detail-doc-templates-list");
            doc_list.innerHTML = ""; // Clear what we may already have there


            if(!("doctemplate" in opp_doc_templates))
            {
                console.log("Got no doc templates, returning...");
                return;
            }

            doc_templates = opp_doc_templates["doctemplate"];
            console.log("Retrieved " + doc_templates.length.toString() + " doc templates");

            for(i = 0; i < doc_templates.length; i++)
            {
                list_item = document.createElement('li');

                // Create Template download anchor
                anchor = document.createElement("a");
                anchor.href = GET_FILE_URL_BASE+doc_templates[i].DocTemplateID;
                anchor.appendChild(document.createTextNode(doc_templates[i].DocTitle));

                // Attach all elements to the list_item
                list_item.appendChild(anchor);
                doc_list.appendChild(list_item);
            }

            console.log("Done..."); 
        }
    });

}


/***********************
 * spa-create-proposal *
 ***********************/

function activateCreateProposal(opportunity_id)
{
    initializeCreateProposal(opportunity_id);
    router("#spa-create-proposal");
}


function initializeCreateProposal(opportunity_id)
{
    // Probably want to make this synchronous, so that we can populate the doc list then do other things
    $.ajax({
        url: "php/api/opportunity/getDocTemplates.php?opportunityid="+opportunity_id, 
        type: "GET",
        success: populateOppDocTemplates
    });

    $.ajax({
        url: "php/api/opportunity/read.php", 
        type: "POST",
        data: {"OpportunityID": opportunity_id},
        success: populateOppTitle
    });

    $("#proposal-back-list-btn").off();
    $("#poposal-save-btn").off();

    $("#proposal-back-list-btn").click(function() { router("#spa-opportunities-list"); });
    $("#poposal-save-btn").click(function() { console.log("Pressed poposal-save-btn"); saveNewProposal(opportunity_id); });
}

function saveNewProposal(opportunity_id)
{
    console.log("In saveNewProposal");

    // Before we upload anything, create the new proposal record
    var proposal_create_success = false;
    var proposal_id = getUniqueProposalID();

    new_proposal_json = {
        "ProposalID": proposal_id,
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
        console.log("Attempting to upload...");

        var formData=new FormData();
        formData.append('filename', current_file, current_file.name);
        formData.append('ProposalID', proposal_id);
        formData.append("OpportunityID", opportunity_id);
        formData.append("DocTemplateID", current_child.dataset.DocTemplateID);
        formData.append('submit', "Lol this needs to be filled");

        var xhr = new XMLHttpRequest();
        xhr.open('POST','php/api/proposal/uploadDoc.php');
        xhr.onload = function() {
            if(xhr.status == 200) {
                console.log('File uploaded' + xhr.response);
            } else {
                alert('Error uploading file:' + xhr.response);
            }
        };
        xhr.send(formData);
    }

    alert("Your proposal was succesfully saved");
    activateOpportunitiesList();
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
    doc_list = document.getElementById("opp-doc-templates-list");
    doc_list.innerHTML = ""; // Clear what we may already have there

    if(!("doctemplate" in opp_doc_templates))
    {
        console.log("Got no doc templates, returning...");
        return;
    }

    doc_templates = opp_doc_templates["doctemplate"];
    console.log("Retrieved " + doc_templates.length.toString() + " doc templates");



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
    // Just gets all of the proposals, and then attaches the associated OpportunityName to it
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
    proposals_table = document.getElementById("proposals-list-table");
    removeAllTableElements(proposals_table);

    table_array = [];

    for(var i = 0; i < proposals_json.length; i++)
    {
        prop_status = document.createTextNode(proposals_json[i].Status);
        closingDate = document.createTextNode(proposals_json[i].ClosingDate);

        anchor = document.createElement("a");
        anchor.appendChild(document.createTextNode(proposals_json[i].OpportunityName));
        anchor.onclick = (function() { 

            var ID = proposals_json[i].ProposalID;
            return function() { activateEditProposal(ID); };
        })();

        table_array.push([anchor, closingDate, prop_status]);
    }

    insertTableRows(table_array, proposals_table);
}



/********************
 * spa-edit-proposal*
 ********************/
// Forgive me padre...

function activateEditProposal(proposal_id)
{
    initializeEditProposal(proposal_id);
    router("#spa-edit-proposal");
}


// Trying to use http://athena.ecs.csus.edu/~mackeys/php/api/opportunity/getDocTemplates.php
// Currently just kludge with getting all doctemplates
function initializeEditProposal(proposal_id)
{
    // Probably want to make this synchronous, so that we can populate the doc list then do other things
    $.ajax({
        url: "php/api/doctemplate/read.php", 
        type: "GET",
        success: populateProposalDocTemplates
    });

    $.ajax({
        url: "php/api/opportunity/read.php", 
        type: "POST",
        data: {"OpportunityID": opportunity_id},
        success: function(opportunity)
        {
            $("#edit-opportunity-title").text("Title: " + opportunity["Name"]);
            $("#edit-opportunity-countdown").text("Closing Date and Time: " + opportunity["ClosingDate"]);
        }
    });

    $("#edit-proposal-back-list-btn").off();
    $("#edit-poposal-save-btn").off();

    $("#edit-proposal-back-list-btn").click(function() { router("#spa-opportunities-list"); });
    $("#edit-poposal-save-btn").click(function() { saveProposal(opportunity_id); });
}

function saveProposal(opportunity_id)
{
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
        console.log("Attempting to upload...");

        var formData=new FormData();
        formData.append('filename', current_file, current_file.name);
        formData.append('ProposalID', proposal_id);
        formData.append("OpportunityID", opportunity_id);
        formData.append("DocTemplateID", current_child.dataset.DocTemplateID);
        formData.append('submit', "Lol this needs to be filled");

        var xhr = new XMLHttpRequest();
        xhr.open('POST','php/api/proposal/uploadDoc.php');
        xhr.onload = function() {
            if(xhr.status == 200) {
                console.log('File uploaded' + xhr.response);
            } else {
                alert('Error uploading file:' + xhr.response);
            }
        };
        xhr.send(formData);
    }

    alert("TODO: Go back to list of opportunities");
}

function populateProposalDocTemplates(opp_doc_templates)
{
    // TODO: Need more coverage on this URL, returning 3 byte files
    GET_FILE_URL_BASE = "php/api/doctemplate/getFile.php?doctemplateid=";

    doc_templates = opp_doc_templates["doctemplate"];

    console.log("Retrieved " + doc_templates.length.toString() + " doc templates");

    doc_list = document.getElementById("edit-opp-doc-templates-list");
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