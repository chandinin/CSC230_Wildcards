// TODO: Figure out a good way to pass bidder ID around the site
var bidder_id;

$(document).ready(function(){
    $("#show-list-btn").click(function() { router("#spa-opportunities-list"); });

    $("#proposals-tab").click(function() { activateProposalsList(); });
    $("#opportunities-tab").click(function() { activateOpportunitiesList(); }); 

    $("#opportunities-list-table").tablesorter();
    $("#proposals-list-table").tablesorter();

    // Set the tab to active, because I don't know what I'm doing...
    $('#opportunities-tab').trigger('click');

    // init the category picker
    getCategories();

    $("#selectCategory").change(function(change) { activateOpportunitiesList(); });

    bidder_id = "1";
    activateOpportunitiesList();
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

/******************
 * Date Utilities *
 ******************/
 
// returns string in format "YYYY-MM-DD HH:MM:SS"
function getCustomDateStringFromDate(date_object)
{
    date = date_object;
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    return str;
}

// returns string in format "YYYY-MM-DD HH:MM:SS"
function getFormattedCurrentDate() {
    var date = new Date();

    return getCustomDateStringFromDate(date);
}

// Returns standard Date object
function parseCustomDateStringToDate(date_string)
{
    reg = /(.{4})-(.{0,2})-(.{0,2}) (.{0,2}):(.{0,2}):(.{0,4})/g;
    match = reg.exec(date_string);

    year = match[1];
    month = match[2];
    day = match[3];
    hour = match[4];
    minute = match[5];
    second = match[6];

    date = new Date();

    date.setYear(year);
    date.setMonth(month-1); // Month is 0 based lol wtf
    date.setDate(day);
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(second);

    return date;
}


// Returns json with keys Days, hours, minutes, seconds
function millisecondsToReasonable(ms)
{
    floor = Math.floor;

    if(ms == undefined)
        ms = new Date() - new Date(1979,0);

    MS_PER_SECOND = 1000;
    SECONDS_PER_MINUTE = 60;
    MINUTES_PER_HOUR = 60;
    HOURS_PER_DAY = 24;

    seconds = floor(ms/MS_PER_SECOND);

    days = floor(seconds/(SECONDS_PER_MINUTE*MINUTES_PER_HOUR*HOURS_PER_DAY));
    seconds = seconds % (SECONDS_PER_MINUTE*MINUTES_PER_HOUR*HOURS_PER_DAY);

    hours = floor(seconds/(SECONDS_PER_MINUTE*MINUTES_PER_HOUR));
    seconds = seconds % (SECONDS_PER_MINUTE*MINUTES_PER_HOUR);

    minutes = floor(seconds/SECONDS_PER_MINUTE);
    seconds = seconds % SECONDS_PER_MINUTE;

    return {"days":days, "hours": hours, "minutes": minutes, "seconds": seconds};
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
        success: function(opportunities_json)
        {
            opportunities = opportunities_json["opportunity"];
            num_opportunity_callbacks_left = opportunities.length;

            // We need to get the category name for each opportunity, via the categoryID
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
    console.log(opportunities_json);

    opportunities = opportunities_json["opportunity"];
    console.log("Length of opportunity array: " + opportunities.length.toString());

    // Get which category we should be showing
    selected_categoryID = $('#selectCategory option:selected').attr('categoryID');
    console.log("selected categoryID: " + selected_categoryID + ", Name: " + $('#selectCategory option:selected').attr('Name'));

    opportunities_table = document.getElementById("opportunities-list-table");
    removeAllTableElements(opportunities_table); // Clear what we might already have there

    table_array = [];

    for(var i = 0; i < opportunities.length; i++)
    {
        // Skip and do not add any opportunities that don't match our selected category, if we have selected one
        if(selected_categoryID != undefined && opportunities[i].CategoryID != selected_categoryID)
        {
            continue;
        }
        opportunityID_textNode = document.createTextNode(opportunities[i].OpportunityID);
        closingDate_textNode = document.createTextNode(opportunities[i].ClosingDate);
        category_textNode = document.createTextNode(opportunities[i].CategoryName);
        anchor   = document.createElement("a");

        anchor.appendChild(document.createTextNode(opportunities[i].Name));
        anchor.onclick = (function() { 
            var ID = opportunities[i].OpportunityID;
            return function() { activateOpportunityDetail(ID); };
        })();

        table_array.push([opportunityID_textNode, anchor, category_textNode, closingDate_textNode]);
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
            console.log(opp_doc_templates);
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
                if(doc_templates[i].Url != null)
                    anchor.href = doc_templates[i].Url.replace("https://athena.ecs.csus.edu/~wildcard/", "");
                else
                    anchor.href = "google.com";

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
        success: populateOppDocTemplates,
        async: false
    });

    $.ajax({
        url: "php/api/opportunity/read.php", 
        type: "POST",
        data: {"OpportunityID": opportunity_id},
        success: populateOppTitle
    });

    $("#proposal-back-list-btn").off();
    $("#proposal-save-btn").off();

    $("#proposal-back-list-btn").click(function() { router("#spa-opportunities-list"); });
    $("#proposal-save-btn").click(function() { console.log("Pressed proposal-save-btn"); saveNewProposal(opportunity_id); });
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
        "FinalTotalScore": -1,
        "CreatedDate": getFormattedCurrentDate(),
        "LastEditDate": getFormattedCurrentDate()
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
        if(doc_templates[i].Url != null)
            anchor.href = doc_templates[i].Url.replace("https://athena.ecs.csus.edu/~wildcard/", "");
        else
            anchor.href = "google.com";
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
                        proposal_json["ClosingDate"] = opportunity_json["ClosingDate"];
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
// Gonna be a little sneaky and reuse the create-opportunity spa

function activateEditProposal(proposal_id)
{
    $.ajax({
        url: "php/api/proposal/read.php?proposalid="+proposal_id, 
        type: "GET",
        success: function(proposal_json)
        {
            initializeCreateProposal(proposal_json.OpportunityID);
            initializeEditProposal(proposal_json);
            router("#spa-create-proposal");    
        }
    });

}

function initializeEditProposal(proposal_json)
{
    console.log("In initializeEditProposal");
    $("#create-proposal-header").text("Edit proposal");
    $("#proposal-time-last-edit").text("Time last edit: " + proposal_json.LastEditDate);
    $("#proposal-back-list-btn").off();
    $("#proposal-save-btn").off();

    $("#proposal-back-list-btn").click(function() { router("#spa-proposals-list"); });
    $("#proposal-save-btn").click(function() { saveProposal(proposal_json); });


    doc_list = document.getElementById("opp-doc-templates-list");

    // If already have files, show them
    $.ajax({
        url: "php/api/proposal/getDocsList.php?proposalid="+proposal_json.ProposalID, 
        type: "GET",
        success: function(proposal_docs_json)
        {
            docs = proposal_docs_json.doc;
            doc_map = {}; // with DocTemplateID as the key

            // Fix the URLs for each doc, populate our DocTemplateID based doc_map
            docs.forEach(function(doc)
            {
                doc.Url = doc.Url.replace("https://athena.ecs.csus.edu/~wildcard/", "");
                console.log(doc.Url);
                doc_map[doc.DocTemplateID] = doc;
            });

            for(i = 0; i < doc_list.children.length; i++)
            {
                child = doc_list.children[i];

                if(doc_map[child.dataset.DocTemplateID] != null)
                {
                    prev_doc_anchor = document.createElement("a");
                    prev_doc_anchor.href = doc_map[child.dataset.DocTemplateID].Url;
                    prev_doc_anchor.appendChild(document.createTextNode("View what you uploaded"));
                    prev_doc_anchor.className += "old_doc_a";

                    child.dataset.DocID = doc_map[child.dataset.DocTemplateID].DocID;

                    doc_list.children[i].appendChild(prev_doc_anchor);
                    console.log(doc_list.children[i]);
                }

            } 

        }
    });
}

function saveProposal(proposal_json)
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

        // If we get here, we have an input element that has a file
        console.log(current_child.dataset.DocTemplateID + " got file with name: " + current_file.name);

        // Need to check if there is a doc already associated with this...
        if(current_child.dataset.DocID != null)
        {
            console.log("There is already a doc (" + current_child.dataset.DocID + ") associated with this DocTemplate");
            console.log("Attempting to delete old document...");

            // $.ajax({
            //     url: "",
            //     type: "GET",
            //     success: function() { console.log("Success deleting DocID"+current_child.dataset.DocID)}
            // });
            console.log("TODO: Endpoint for deleting a doc/ProposalDoc");
        }
        console.log("Attempting to upload...");

        var formData=new FormData();
        formData.append('filename', current_file, current_file.name);
        formData.append('ProposalID', proposal_json.ProposalID);
        formData.append("OpportunityID", proposal_json.OpportunityID);
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
    activateProposalsList();
}


/********************************
 * Category picker related code *
 ********************************/

//get all categories to populate dropdown
function getCategories(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/getOppCategoryList.php',true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            fillCategoryDropdown(jsonArray);
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

//Fill dropdown with categories
function fillCategoryDropdown(jsonArray){
    var start = 0;
    var select = document.getElementById("selectCategory")
    var size = jsonArray.Category.length;

    for(var i=start;i<size;i++) {
        var option = document.createElement("OPTION");
        txt = document.createTextNode(jsonArray.Category[i].Name);
        option.appendChild(txt);
        option.setAttribute("Name", jsonArray.Category[i].Name)
        option.setAttribute("categoryID", jsonArray.Category[i].CategoryID)
        select.insertBefore(option, select.lastChild);
    }
}