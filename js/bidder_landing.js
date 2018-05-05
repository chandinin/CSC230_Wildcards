// TODO: Figure out a good way to pass bidder ID around the site
var g_bidder_id;

$(document).ready(function(){
    $("#show-list-btn").click(function() { router("#spa-opportunities-list"); });

    $("#proposals-tab").click(function() { activateProposalsList(); });
    $("#opportunities-tab").click(function() { activateOpportunitiesList(); });
    $("#messages-tab").click(function() { activateMessageList(); });
    $("#subscriptions-tab").click(function() {activateManageSubscriptions(); });

    $("#opportunities-list-table").tablesorter();
    $("#proposals-list-table").tablesorter();
    $("#messages-list-table").tablesorter();

    // Set the tab to active, because I don't know what I'm doing...
    $('#opportunities-tab').trigger('click');

    // init the category picker
    getCategories();

    $("#selectCategory").change(function(change) { activateOpportunitiesList(); });

    // Init the save category subscriptions button
    $("#subscriptions-save-btn").click(function() { saveCategorySubscriptions(); });

    // TODO: Figure out a good way to pass bidder ID around the site
    g_bidder_id = localStorage.getItem("bidderId");
    if(g_bidder_id == null) // Our default test case
        g_bidder_id = "1337";
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
                    "#spa-edit-proposal",
                    "#spa-message-list",
                    "#spa-message-detail",
                    "#spa-manage-subscriptions"
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
    str =  (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return str;
}

function convert_db_date_to_custom(custom_date_str)
{
    return getCustomDateStringFromDate(parseCustomDateStringToDate(custom_date_str));
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

// Returns json with keys Days, hours, minutes, seconds
function reasonableTimeRemaining(target_date)
{
    remaining = target_date - new Date();
    return millisecondsToReasonable(remaining);
}

function isReasonableTimeNegative(reasonable_time)
{
    SECONDS_PER_MINUTE = 60;
    MINUTES_PER_HOUR = 60;
    HOURS_PER_DAY = 24;

    seconds = reasonable_time.seconds;
    seconds += reasonable_time.minutes * SECONDS_PER_MINUTE;
    seconds += reasonable_time.hours * MINUTES_PER_HOUR * SECONDS_PER_MINUTE;
    seconds += reasonable_time.days * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE;

    return seconds < 0;
}

// What have I done..
// start method requires a callback that will take a "reasonableTime" json, and a Date object for the target date
// - will then immediately start calling
// stop method will stop the chain...
// Only one callback can be running at a given time
function timeRemainingCallback(target_date)
{
    TIMEOUT_mSEC = 1000; 
    if(timeRemainingCallback.stop_flag)
        return;
    else 
    {
        timeRemainingCallback.callback(reasonableTimeRemaining(target_date));
        timeRemainingCallback.timeout =  window.setTimeout(timeRemainingCallback, TIMEOUT_mSEC, target_date);
    }
}

timeRemainingCallback.stop = function() { clearTimeout(timeRemainingCallback.timeout); timeRemainingCallback.stop_flag = true; };
timeRemainingCallback.start = function(cb, target_date)
{ 
    timeRemainingCallback.stop_flag = false; 
    timeRemainingCallback.callback = cb;
    timeRemainingCallback(target_date);
};

// Inline sorts the docs based on SortOrder
function sortOpportunityDocs(opportunities_json)
{
    function compare_docs(a,b) {
      if (a.SortOrder < b.SortOrder)
        return -1;
      if (a.SortOrder > b.SortOrder)
        return 1;
      return 0;
    }

    opportunities_json.doctemplate.sort(compare_docs)
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
        // Easy as fuck, change this to 3
        url: "php/api/opportunity/read.php?status=0", 
        success: function(opportunities_json)
        {
            opportunities = opportunities_json["opportunity"];
            num_opportunity_callbacks_left = opportunities.length;

            // We need to get the category name for each opportunity, via the categoryID
            categories = {}
            $.ajax({
                url: "php/api/opportunity/categoryName.php", 
                success: function(category_json)
                {
                    console.log(category_json);
                    for (i = 0; i < category_json.length; i++) {
                        categories[category_json[i].CategoryID] = category_json[i].Name;
                    }

                    console.log(categories);

                    for(i = 0; i < opportunities_json["opportunity"].length; i++)
                    {
                        opportunities_json["opportunity"][i].CategoryName = categories[opportunities_json["opportunity"][i].CategoryID];
                    }

                    populateOpportunitiesList(opportunities_json);
                },
                error: function(error)
                {
                    console.log(error);
                }
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
        if((selected_categoryID != undefined && opportunities[i].CategoryID != selected_categoryID ) || opportunities[i].StatusName != "New")
        {
            continue;
        }
        opportunityID_textNode = document.createTextNode(opportunities[i].OpportunityID);
        closingDate_textNode = document.createTextNode(convert_db_date_to_custom(opportunities[i].ClosingDate));
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
    $("#ClosingDate").text(convert_db_date_to_custom(opportunity["ClosingDate"]));
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
            sortOpportunityDocs(opp_doc_templates);
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
    $("#proposal-save-btn").show();
    // Probably want to make this synchronous, so that we can populate the doc list then do other things
    $.ajax({
        url: "php/api/opportunity/read.php", 
        type: "POST",
        data: {"OpportunityID": opportunity_id},
        success: populateOppTitle,
        async: false
    });
    $.ajax({
        url: "php/api/opportunity/getDocTemplates.php?opportunityid="+opportunity_id, 
        type: "GET",
        success: populateOppDocTemplates,
        async: false
    });



    $("#proposal-submit-btn").hide()

    $("#proposal-back-list-btn").off();
    $("#proposal-save-btn").off();

    $("#proposal-back-list-btn").click(function() { router("#spa-opportunities-list"); });
    $("#proposal-save-btn").click(function() { console.log("Pressed proposal-save-btn"); saveNewProposal(opportunity_id); });

    // Because edit-proposal can change this
    $("#proposal-instructions-span").text("Please download, fill out, and upload all requested forms. You can come back and edit your documents at any time before the deadline for submissions, just press 'save and come back later");


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
        "BidderID": g_bidder_id,
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
    g_current_opportunity_json = opportunity;
    $("#opportunity-title").text("Title: " + opportunity["Name"]);
    $("#opportunity-countdown").text("Closing Date and Time: " + convert_db_date_to_custom(opportunity["ClosingDate"]));

    // Setup our lovely countdown timer...
    //{"days":597,"hours":15,"minutes":44,"seconds":11}
    timeRemainingCallback.stop();
    timeRemainingCallback.start(
        function(reasonable_time_remaining) {
            if(isReasonableTimeNegative(reasonable_time_remaining))
            {
                timeRemainingCallback.stop();
                time_remaining_text = "Time Remaining: This opportunity has closed";
                $("#proposal-save-btn").hide();
                $("#proposal-time-remaining").text(time_remaining_text);
            }
            else
            {
                time_remaining_text = "Time Remaining on this opportunity";
                time_remaining_text += " Days: " + reasonable_time_remaining.days;
                time_remaining_text += " Hours: " + reasonable_time_remaining.hours;
                time_remaining_text += " Minutes: " + reasonable_time_remaining.minutes;
                time_remaining_text += " Seconds: " + reasonable_time_remaining.seconds;
                $("#proposal-time-remaining").text(time_remaining_text);
            }
        },
        parseCustomDateStringToDate(opportunity["ClosingDate"])
    );
}


function populateOppDocTemplates(opp_doc_templates)
{
    sortOpportunityDocs(opp_doc_templates);
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

    // Will be using these to calculate how many doc links need to have files in their inputs to allow a submit
    g_current_opportunity_json.num_opp_docs = doc_templates.length;
    g_current_opportunity_json.num_docs_uploaded = 0;
    g_current_opportunity_json.num_docs_pending = 0; // How many docs we have in the input bins, which don't already have docs

    for(i = 0; i < doc_templates.length; i++)
    {
        list_item = document.createElement('li');
        // Attach the DocTemplateID to the li itself for access by other functions
        // Will undoubtedly bite me in the ass down the road...
        list_item.dataset.DocTemplateID = doc_templates[i].DocTemplateID;
        list_item.dataset.hasDocUploaded = false;
        list_item.dataset.hasDocPending  = false;
        list_item.id = "doc_li_" + doc_templates[i].DocTemplateID;

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
        file_upload.dataset.parent_list_item_id = list_item.id;
        file_upload.addEventListener("change", allDocsSatisfied);
        
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

// Will be called whenever a file is selected to be uploaded in order to determine if we can show the submit button...
// Here we go!
function allDocsSatisfied(current_event)
{
    console.log("Setting this inputs parent as hasDocPending");
    console.log(current_event);
    document.getElementById(current_event.target.dataset.parent_list_item_id).dataset.hasDocPending = true;

    console.log("Checking if we have all docs potentially satisfied");
    doc_list = document.getElementById("opp-doc-templates-list");

    has_all_docs = true;

    for(i = 0; i < doc_list.children.length; i++)
    {
        li = doc_list.children[i];
        has_all_docs = has_all_docs & (li.dataset.hasDocUploaded == "true" || li.dataset.hasDocPending == "true");
    }

    console.log("Has all docs: " + String(has_all_docs));
    if(has_all_docs)
        $("#proposal-submit-btn").show();
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
    // Christ, this operates on every single proposal since there is no endpoint to specify bidderID...
    $.ajax({
        url: "php/api/proposal/read.php", 
        success: function(proposals_json) {
            proposals_json["proposal"] = proposals_json["proposal"].filter(proposal => proposal["BidderID"] == g_bidder_id)

            num_proposal_callbacks_left = proposals_json["proposal"].length * 3; // x3 because we have to get num docs for opportunity and prop

            // For each, get number of proposal docs
            proposals_json["proposal"].forEach( function (proposal_json)
            {
                $.ajax({
                    url: "php/api/proposal/getDocsList.php?proposalid="+proposal_json.ProposalID, 
                    type: "GET",
                    success: function(proposal_docs_json)
                    {
                        num_proposal_callbacks_left--; console.log("Remaining Callbacks: " +String(num_proposal_callbacks_left));
                        docs = proposal_docs_json.doc;
                        proposal_json.NumProposalDocs = (docs == null ? 0 : docs.length);

                        
                        if(num_proposal_callbacks_left == 0)
                        {
                            // Filter down all proposals till we get just ours
                            populateProposalList(proposals_json["proposal"].filter(proposal => proposal["BidderID"] == g_bidder_id)); 
                        }
                    }
                });
            });

            // For each, get number of opportunity docs
            proposals_json["proposal"].forEach( function (proposal_json)
            {
                $.ajax({
                    url: "php/api/opportunity/getDocTemplates.php?opportunityid="+proposal_json.OpportunityID, 
                    type: "GET",
                    success: function(opp_doc_templates)
                    {
                        sortOpportunityDocs(opp_doc_templates);
                        num_proposal_callbacks_left--; console.log("Remaining Callbacks: " +String(num_proposal_callbacks_left));
                        if(!("doctemplate" in opp_doc_templates))
                        {
                            console.log("Got no doc templates, returning...");
                            return;
                        }
                        doc_templates = opp_doc_templates["doctemplate"];
                        proposal_json.NumOpportunityDocs = doc_templates.length;
                        
                        if(num_proposal_callbacks_left == 0)
                        {
                            // Filter down all proposals till we get just ours
                            populateProposalList(proposals_json["proposal"].filter(proposal => proposal["BidderID"] == g_bidder_id)); 
                        }
                    }
                });
            });


            // For each, get OpportunityName
            proposals_json["proposal"].forEach( function (proposal_json)
            {
                $.ajax({
                    url: "php/api/opportunity/read.php?opportunityid="+proposal_json["OpportunityID"], 
                    success: function(opportunity_json) {
                        proposal_json["OpportunityName"] = opportunity_json["Name"];
                        proposal_json["ClosingDate"] = opportunity_json["ClosingDate"];
                        num_proposal_callbacks_left--; console.log("Remaining Callbacks: " +String(num_proposal_callbacks_left));

                        if(num_proposal_callbacks_left == 0)
                        {
                            // Filter down all proposals till we get just ours
                            populateProposalList(proposals_json["proposal"].filter(proposal => proposal["BidderID"] == g_bidder_id)); 
                        }
                    }
                });
            });
        }
    });
}


function populateProposalList(proposals_json)
{
    console.log(proposals_json);
    proposals_table = document.getElementById("proposals-list-table");
    removeAllTableElements(proposals_table);

    table_array = [];

    for(var i = 0; i < proposals_json.length; i++)
    {
        // Replace Status name with something appropriate for the frontend
        status_name = proposals_json[i].StatusName;
        if(status_name == "Evaluation 1 Rejected") { status_name = "Rejected"; }
        else if(status_name == "Evaluation 1 Accepted") { status_name = "Closed for edits, Under Evaluation"; }
        else if(status_name == "Seeking Clarification 1") { status_name = "clarification requested"; }
        else if(status_name == "Seeking Clarification 2") { status_name = "clarification requested"; }
        else if(status_name == "Clarification Received ") { status_name = "Closed for edits, Under Evaluation"; }
        else if(status_name == "Clarification Received ") { status_name = "Closed for edits, Under Evaluation"; }
        else if(status_name == "Evaluation 2 Rejected") { status_name = "Rejected"; }
        else if(status_name == "Evaluation 2 Accepted") { status_name = "Closed for edits, Under Evaluation"; }
        else if(status_name == "In Progress" || status_name == "Open") 
        { 
            status_name = proposals_json[i].NumProposalDocs >= proposals_json[i].NumOpportunityDocs ? 
                "Open For Edits, pending close date" : "Open For Edits, missing documents"; 
        }
        else {status_name = "UNKNOWN STATUS MAPPING: " + status_name; }
        

        prop_status = document.createTextNode(status_name);

        closingDate = document.createTextNode(convert_db_date_to_custom(proposals_json[i].ClosingDate));

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
// In the spirit of lazyness, this is set by create-opportunity, so that
// I don't have to fetch it again...
var g_current_opportunity_json = null;

// Gonna be a little sneaky and reuse the create-opportunity spa
function activateEditProposal(proposal_id)
{
    $.ajax({
        url: "php/api/proposal/read.php?proposalid="+proposal_id, 
        type: "GET",
        success: function(proposal_json)
        {
            $.ajax({
                url: "php/api/proposal/getClarifications.php?proposalID="+proposal_json.ProposalID, 
                type: "GET",
                success: function(clarifications)
                {
                    if(!("clarification" in clarifications))
                    {
                        console.log("Got no Clarifications, returning...");
                        return;
                    }

                    found_open_clarification = false; // flag to check after loop
                    clarifications.clarification.forEach( function(clarification)
                    {
                        // PUT Selection criteria for clarification here
                        if(clarification.answer == null && !found_open_clarification)
                        {
                            console.log(proposal_json.ProposalID + " has an open clarification: " + clarification.ClarificationID);
                            proposal_json.ClarificationClosingDate = clarification.ClosingDate;
                            found_open_clarification = true;
                        }
                    });

                    if(!found_open_clarification)
                    {
                        console.log("An open clarification was not found for " + proposal_json.ProposalID);
                    }

                    initializeCreateProposal(proposal_json.OpportunityID);
                    initializeEditProposal(proposal_json);
                    router("#spa-create-proposal"); // Sneaky! 
                }
            });
        }
    });
}

function initializeEditProposal(proposal_json)
{
    console.log("In initializeEditProposal");

    $("#create-proposal-header").text("Edit proposal");
    $("#proposal-time-last-edit").text("Time last edit: " + convert_db_date_to_custom(proposal_json.LastEditDate));
    $("#proposal-back-list-btn").off();
    $("#proposal-save-btn").off();

    $("#proposal-back-list-btn").click(function() { router("#spa-proposals-list"); });
    $("#proposal-save-btn").click(function() { saveProposal(proposal_json, false); }); // the false is that this is not a final submit


    $("#proposal-submit-btn").off();
    $("#proposal-submit-btn").click(function() { saveProposal(proposal_json, true); }); // True for this is a final submission

    if("ClarificationClosingDate" in proposal_json)
    {
        console.log("OK, we found a clarification...");
        console.log("But we're gonan ignore it");
    }

    // Setup our lovely countdown timer...
    //{"days":597,"hours":15,"minutes":44,"seconds":11}
    timeRemainingCallback.stop();
    timeRemainingCallback.start(
        function(reasonable_time_remaining) {
            if(isReasonableTimeNegative(reasonable_time_remaining))
            {
                timeRemainingCallback.stop();
                time_remaining_text = "Time Remaining: This opportunity has closed, your proposal will be evaluated soon";
                $("#proposal-save-btn").hide();
                $("#proposal-time-remaining").text(time_remaining_text);
            }
            else
            {
                time_remaining_text = "Time remaining on this opportunity: ";
                time_remaining_text += " Days: " + reasonable_time_remaining.days;
                time_remaining_text += " Hours: " + reasonable_time_remaining.hours;
                time_remaining_text += " Minutes: " + reasonable_time_remaining.minutes;
                time_remaining_text += " Seconds: " + reasonable_time_remaining.seconds;
                $("#proposal-time-remaining").text(time_remaining_text);
            }
        },
        parseCustomDateStringToDate(g_current_opportunity_json["ClosingDate"])
    );


    doc_list = document.getElementById("opp-doc-templates-list");

    // If already have files, show them, as well as the final submit button
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

            has_all_docs = true;

            for(i = 0; i < doc_list.children.length; i++)
            {
                child = doc_list.children[i]; // Child is the list item

                if(doc_map[child.dataset.DocTemplateID] != null)
                {
                    prev_doc_anchor = document.createElement("a");
                    prev_doc_anchor.href = doc_map[child.dataset.DocTemplateID].Url;
                    prev_doc_anchor.appendChild(document.createTextNode("View what you uploaded"));
                    prev_doc_anchor.className += "old_doc_a";

                    child.dataset.DocID = doc_map[child.dataset.DocTemplateID].DocID;
                    child.dataset.hasDocUploaded = true;

                    doc_list.children[i].appendChild(prev_doc_anchor);
                    console.log(doc_list.children[i]);
                }
                else
                {
                    has_all_docs = false;
                }

            }

            if(has_all_docs)
            {
                console.log("This proposal has all docs, showing submit button");
                $("#proposal-submit-btn").show();
            }
            else
            {
                console.log("This proposal does not have all docs, hiding submit button");
                $("#proposal-submit-btn").hide();
            }
        }
    });
}

function saveProposal(proposal_json, is_this_submit)
{

    if(is_this_submit)
        console.log("This is a final submission!");

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
        formData.append('final_submission', is_this_submit);

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



/********************
 * spa-message-list *
 ********************/
 // Caution: Super jank!

function activateMessageList()
{
    initializeMessageList();
    router("#spa-message-list");
}

function initializeMessageList()
{
    removeAllTableElements(document.getElementById("messages-list-table"));
    // Ajax call for messages associated with bidderID will go here
    populateMessageList();
}

m0 = {"type":"NewOpportunity", "time_received":getFormattedCurrentDate(), "status":"read",
"body":"Hello, this is an automated message. There is a new opportunity available"};

m1 = {"type":"Clarification", "time_received":getFormattedCurrentDate(), "status":"unread",
"body":"Hello, this is an official request for clarification on your proposal for AnOpportunity. Please re-upload your documents."};

demo_messages = [m0,m1];

function populateMessageList(messages_json)
{
    PREVIEW_LENGTH = 40; // Number of characters in the message preview
    messages_json = demo_messages;
    table_array = [];

    for(i = 0; i < messages_json.length; i++)
    {
        message_type = document.createElement("a");
        message_type.appendChild(document.createTextNode(messages_json[i].type));

        time_received = document.createElement("a");
        time_received.appendChild(document.createTextNode(messages_json[i].time_received) );

        // This will be clipped
        preview = document.createElement("a");
        preview.appendChild(document.createTextNode(messages_json[i].body.substring(0,PREVIEW_LENGTH)+"...") );


        message_status = document.createElement("a");
        message_status.appendChild(document.createTextNode(messages_json[i].status) );

        // Set onclick for each item in the table to activateMessageDetail for that item
        message_type.onclick = (function() {
            var ID = String(i);
            return function() { activateMessageDetail(ID); };
        })();

        time_received.onclick = (function() {
            var ID = String(i);
            return function() { activateMessageDetail(ID); };
        })();

        preview.onclick = (function() {
            var ID = String(i);
            return function() { activateMessageDetail(ID); };
        })();

        message_status.onclick = (function() {
            var ID = String(i);
            return function() { activateMessageDetail(ID); };
        })();

        // Stick it in the table message-list-table!
        table_array.push([message_type, time_received, preview, message_status]);
    }

    insertTableRows(table_array, document.getElementById("messages-list-table"));
}


/**********************
 * spa-message-detail *
 **********************/
function activateMessageDetail(message_id)
{
    initializeMessageDetail(message_id);
    router("#spa-message-detail");
}

function initializeMessageDetail(message_id)
{

    // Ajax to get the specific message
    populateMessageDetail(demo_messages[parseInt(message_id)]);
}

// <h2>Message Type: <span id="message-detail-type">Message type placeholder</span></h2>
// <h2>Time Received: <span id="message-detail-time-received">Message time received placeholder</span></h2>
// <h2 id="message-detail-time-responded-header" class="hidden">Time Responded: <span id="message-detail-time-responded">Message time response placeholder</span></h2>
// <a id="send-message-btn" class="btn btn-primary hidden">Send Message</a>
// <a id="discard-message-btn" class="btn btn-primary  hidden">Discard Message</a>
// <a id="message-detail-back-btn" class="btn btn-primary hidden" >Back to Messages</a>


function populateMessageDetail(message)
{

    
    $("#message-detail-body").text(message.body);

    if(message.status == "read")
    {
        // Hide these
        $("#send-message-btn").hide();
        $("#discard-message-btn").hide();

        //Unhide these
        $("#message-detail-time-responded-header").show();
        $("#message-detail-back-btn").show();

        // Set these
        // $("#message-response-editor").text("Enter you")
    }
    else
    {
        // Show these
        $("#send-message-btn").show();
        $("#discard-message-btn").show();

        // Hide these
        $("#message-detail-time-responded-header").hide();
        $("#message-detail-back-btn").hide();
    }

    if(message.type != "Clarification")
    {
        $("#message-detail-response").hide();
    }
    else
    {
        $("#message-detail-response").show();
    }

    // Populate all fields
    $("#message-detail-time-received").text(message.time_received);
    $("#message-detail-type").text(message.type);

}


/****************************
 * spa-manage-subscriptions *
 ****************************/ 



function activateManageSubscriptions()
{
    initializeManageSubscriptions();
    router("#spa-manage-subscriptions");
}


function initializeManageSubscriptions()
{
    //get all categories
    var xhr = new XMLHttpRequest();
    xhr.open('GET','php/api/opportunity/getOppCategoryList.php',true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            console.log("Attempting");

            var subscriptions_xhr = new XMLHttpRequest();
            subscriptions_xhr.open("POST", "php/api/bidder/getSubscriptions.php");
            subscriptions_xhr.onload = function() 
            {
                if(xhr.status == 200)
                {
                    console.log(subscriptions_xhr.responseText);
                    subscriptions = JSON.parse(subscriptions_xhr.responseText);
                    console.log(subscriptions);
                    for(i = 0; i < jsonArray.Category.length; i++)
                        jsonArray.Category[i].subscribed = false;

                    for(i = 0; i < jsonArray.Category.length; i++)
                    {
                        for(j = 0; j < subscriptions.subscription.length; j++)
                        {
                            console.log(subscriptions.subscription[j].CategoryID + " " + jsonArray.Category[i].CategoryID);

                            if(subscriptions.subscription[j].CategoryID == jsonArray.Category[i].CategoryID)
                            {
                                console.log(subscriptions.subscription[j].CategoryID + " is subscribed");
                                jsonArray.Category[i].subscribed = true;
                            }
                        }
                    }

                    for(i = 0; i < jsonArray.Category.length; i++)
                        console.log(jsonArray.Category[i].subscribed);

                    populateManageSubscriptions(jsonArray);
                }
                else
                {
                    console.log("There was an error getting your subscriptions: " + subscriptions_xhr.responseText);
                }
            }
            subscriptions_xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            subscriptions_xhr.send("bidderid="+g_bidder_id);

        } else {
            alert("Error getting categories");
        }
    };
    xhr.send();
}


// Todo: how to use the form data effectively...
function populateManageSubscriptions(jsonArray)
{
    console.log(jsonArray);
    // Clear what we already have
    $('#subscriptions-form').empty();

    for(var i = jsonArray.Category.length-1; i >= 0 ; i--) {
        if(jsonArray.Category[i].Name == "None")
            continue;

        div_form_check = $("<div>", {
            class: 'form-check'
        });

        input_checkbox = $('<input>', {
            class: 'form-check-input',
            type: 'checkbox',
            id: jsonArray.Category[i].CategoryID,
            checked: jsonArray.Category[i].subscribed
        });

        label = $("<label>", {
            class: "form-check-label",
            for: i,
            text: jsonArray.Category[i].Name
        });

        input_checkbox.appendTo(div_form_check);
        label.appendTo(div_form_check);
        div_form_check.prependTo($('#subscriptions-form'));

    }
}

function updateSubscriptions(bidder_id, category_id_array)
{
    json_payload = {"id":bidder_id};
    json_payload.subscription = [];

    for(i = 0; i < category_id_array.length; i++)
    {
        json_payload.subscription.push({"ID":bidder_id, "CategoryID":category_id_array[i]});
    }

    console.log("Sending the following json to category endpoint:");
    console.log(JSON.stringify(json_payload));



    var xhr = new XMLHttpRequest();
    xhr.open('POST','php/api/bidder/update.php', false);
    xhr.onload = function() {
        if(xhr.status == 200) {
            console.log('File uploaded' + xhr.response);
            alert("Your Subscriptions were succesfully updated");
        } else {
            alert('Error uploading file:' + xhr.response);
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(json_payload));
}

function saveCategorySubscriptions()
{
    checked_category_ids = getCheckedCategorySubscriptions();

    updateSubscriptions(g_bidder_id, checked_category_ids);
}


function getCheckedCategorySubscriptions()
{
    selected_categories = [];
    $('#subscriptions-form input').each( function(key, input)
    {
        if(input.checked)
            selected_categories.push(input.id);
    })

    return selected_categories;
}