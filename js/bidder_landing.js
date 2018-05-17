// TODO: Figure out a good way to pass bidder ID around the site
var g_bidder_id;
var g_bread;
var g_mc;


$(document).ready(function(){
    // init breadcrumb
    g_bread = new BreadCrumb("Home", function() {window.location = "home_page.html";}, "the-breadcrumb");

    $("#show-list-btn").click(function() { router("#spa-opportunities-list"); });

    $("#proposals-tab").click(function() { activateProposalsList(); });
    $("#opportunities-tab").click(function() { activateOpportunitiesList(); });
    $("#messages-tab").click(function() { activateMessageList(); });
    $("#subscriptions-tab").click(function() {activateManageSubscriptions(); });

    $("#opportunities-list-table").tablesorter();
    $("#proposals-list-table").tablesorter();
    $("#messages-list-table").tablesorter();

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

    // init message center
    // g_mc = new MessageCenter();
    // g_mc.updateServer(); // Will report the messages we generated as well as the login time right
    // $("#num-unread-messages").text(g_mc.numUnread);

    // Init the fee doc listener
    document.getElementById("fee-input").addEventListener("change", allDocsSatisfied);

    // Set the tab to active, because I don't know what I'm doing...
    $('#messages-tab').trigger('click');
});

class BreadCrumb
{
    // Home item never changes
    constructor(home_text, home_onClick, target_ol_id)
    {
        this.home_text = home_text;
        this.home_onClick = home_onClick;
        this.li_array = [];
        this.target_id = target_ol_id;
    }

    gen_anchor(text, onClick){
        var anchor = document.createElement("a");
        anchor.appendChild(document.createTextNode(text));
        anchor.onclick = onClick;

        var li = document.createElement("li");
        li.appendChild(anchor);

        return li;
    }

    gen_text(text)
    {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(text));

        return li;
    }

    add(text, onClick)
    {
        if(onClick != null)
            this.li_array.push(this.gen_anchor(text, onClick));
        else
            this.li_array.push(this.gen_text(text));
    }

    render()
    {
        var self = this;
        var target = document.getElementById(this.target_id);

        if(target == null)
            alert("Breadcrumb is messed up!");

        
        // Clear what we already have in breadcrumb
        target.innerHTML = "";

        target.appendChild(this.gen_anchor(this.home_text, this.home_onClick));
        this.li_array.forEach(function(li)
        {
            target.appendChild(li);
        });
    }

    clear()
    {
        this.li_array = [];
    }


}

// Handles hiding and unhiding the correct divs, based on the arg div_to_show
// Does not handle actually initializing those divs.
function router(div_to_show, spa_edit_proposal_shitty_workaround_flag)
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


    // Build and render breadcrumb
    // Probably an easier way to do this but....
    g_bread.clear();

    if(spa_edit_proposal_shitty_workaround_flag)
    {
        g_bread.add("Your Proposals", function() {$("proposals-tab").trigger("click"); } );
        g_bread.add("Edit Your Proposal");
    }
    else if(div_to_show == "#spa-opportunities-list")
    {
        g_bread.add("Opportunities List");
    }
    else if(div_to_show == "#spa-opportunity-detail")
    {
        g_bread.add("Opportunity Detail");
    }
    else if(div_to_show == "#spa-create-proposal")
    {
        g_bread.add("Create Proposal");
    }
    else if(div_to_show == "#spa-proposals-list")
    {
        g_bread.add("Your Proposals");
    }
    else if(div_to_show == "#spa-edit-proposal")
    {
        // Have to use the shitty workaround flag, god damnit
    }
    else if(div_to_show == "#spa-message-list")
    {
        g_bread.add("Message List");
    }
    else if(div_to_show == "#spa-message-detail")
    {
        g_bread.add("Message List", function() {$("messages-tab").trigger("click"); activateMessageList(); });
        g_bread.add("View Message");
    }
    else if(div_to_show == "#spa-manage-subscriptions")
    {
        g_bread.add("Manage Subscriptions");
    }

    // Done building, now render
    g_bread.render();

    // Update our messages...
    if(g_mc != null)
    {
        g_mc.updateServer(); // Will report the messages we generated as well as the login time right
        $("#num-unread-messages").text(g_mc.numUnread);
   }
}

/*******************************************************
 * Helper functions I should have made in the begining *
 *******************************************************/

function uploadFeeDocument(file, filename, ProposalID, OpportunityID, DocTemplateID)
{
        var formData=new FormData();
        formData.append('filename', file, filename);
        formData.append('ProposalID', ProposalID);
        formData.append("OpportunityID", OpportunityID);
        formData.append("DocTemplateID", DocTemplateID);
        formData.append('submit', "Lol this needs to be filled");

        var xhr = new XMLHttpRequest();
        xhr.open('POST','php/api/proposal/uploadFeeDoc.php', false);
        xhr.onload = function() {
            if(xhr.status == 200) {
                console.log('File uploaded' + xhr.response);
            } else {
                alert('Error uploading file:' + xhr.response);
            }
        };
        xhr.send(formData);
}

function getFeeDocument(ProposalID)
{
    response = null;
    var xhr = new XMLHttpRequest();
    xhr.open('GET','php/api/proposal/getFeeDoc.php?proposalid='+ProposalID, false);
    xhr.onload = function() {
        if(xhr.status == 200) {
            json = JSON.parse(xhr.response);
            if(json.doc == null)
            {
                console.log("No fee doc found for " + ProposalID);
                response = false;
            }
            else
            {
                response = json.doc[0];
            }
        } else {
            alert(xhr.response);
        }
    };
    xhr.send();

    return response;
}



function getDocUrlFromID(DocID)
{
//{"DocID":"87","DocTitle":"linker.py","Path":"..\/..\/..\/data\/files\/35587_87_linker.py","Blob":null,"Url":"http:\/\/athena.ecs.csus.edu\/~mackeys\/data\/files\/35587_87_linker.py","Description":"linker.py","CreatedDate":"2018-05-06 12:56:02","LastEditDate":"2018-05-06 12:56:02","SortOrder":"0"}
    var DocURL = null;
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/docs/read.php?DocID='+DocID,false);
    xhr.onload = function() {
        if (xhr.status == 200) {
            DocJson = JSON.parse(xhr.response);
            if(DocJson.Url == null)
            {
                console.log("Error getting doc url");
                console.log(DocJson);
                alert("Error getting doc url");
                return;
            }       

            DocURL = DocJson.Url.replace("https://athena.ecs.csus.edu/~wildcard/", "");

        }
        else {
            alert("Error getting Document URL with ID: " + DocID);
        }
    };
    xhr.send();

    return DocURL;
}

function updateProposal(ProposalID, proposal_json)
{
    success_flag = null;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/api/proposal/update.php', false);
    xhr.onload = function()
    {
        if(xhr.status == 200)
        {
            success_flag = true;
        }
        else
        {
            console.log("Error updating proposal:");
            console.log(xhr.response);
            alert("There was an error updating the proposal");
            success_flag = false;
        }
    }
    xhr.setRequestHeader("Content-type", "application/json");
    proposal_json.ProposalID = ProposalID;
    xhr.send(JSON.stringify(proposal_json));

    return success_flag;
}

/*****************
 * Table Helpers *
 *****************/


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

function getDatabaseDateStringFromDate(date_object)
{
    date = date_object;
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    // str =  (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
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
function sortOpportunityDocs(doctemplate)
{
    console.log(doctemplate)
    function compare_docs(a,b) {
      if (a.SortOrder < b.SortOrder)
        return -1;
      if (a.SortOrder > b.SortOrder)
        return 1;
      return 0;
    }

    if(doctemplate != null)
        doctemplate.sort(compare_docs);
    else
    {
        console.log("The doc Template was null:");
        console.log(doctemplate);
    }
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
        url: "php/api/opportunity/read.php?status=3", 
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
        if((selected_categoryID != undefined && opportunities[i].CategoryID != selected_categoryID ) || opportunities[i].StatusName != "Published")
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
    document.getElementById("Description").innerHTML = opportunity["Description"];
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

            sortOpportunityDocs(opp_doc_templates.doctemplate);
            doc_templates = opp_doc_templates["doctemplate"];
            console.log("Retrieved " + doc_templates.length.toString() + " doc templates");

            for(i = 0; i < doc_templates.length; i++)
            {
                list_item = document.createElement('li');

                // Create Template download anchor
                anchor = document.createElement("a");
                if(doc_templates[i].Url != null)
                    anchor.href = doc_templates[i].Url;
//                     anchor.href = doc_templates[i].Url.replace("https://athena.ecs.csus.edu/~wildcard/", "");
                else
                    anchor.href = "google.com";

                if(doc_templates[i].DisplayTitle == null)
                    anchor.appendChild(document.createTextNode(doc_templates[i].DocTitle));
                else
                    anchor.appendChild(document.createTextNode(doc_templates[i].DisplayTitle));
              
                anchor.target = "_blank";
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

    $("#time-remaining-div").show();

    $("#fee-input").show();
    $("#proposal-submit-btn").hide()

    $("#proposal-back-list-btn").off();
    $("#proposal-save-btn").off();

    $("#proposal-back-list-btn").click(function() { router("#spa-opportunities-list"); });
    $("#proposal-save-btn").click(function() { console.log("Pressed proposal-save-btn"); saveNewProposal(opportunity_id); });

    $("#prev-fee-doc").hide();

    // Because edit-proposal can change this
    $("#proposal-instructions-span").text('Please download, fill out, and upload all requested forms. You can come back and edit your documents at any time before the deadline for submissions, just press "Save For Later". You may submit your Proposal once you have satsifed all required documents');

    document.getElementById("fee-input").value = "";


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
        "Status": "40",
        "StatusName": "Open",
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

    fee_input = document.getElementById("fee-input");
    current_file = fee_input.files.length > 0 ? fee_input.files[0] : null;
    if(current_file != null)
    {
        uploadFeeDocument(current_file, current_file.name, proposal_id, opportunity_id, 0);
    }
    else
    {
        console.log("No fee doc to upload");
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

    return getRandomInt(1,65325).toString();
}


function populateOppTitle(opportunity)
{
    g_current_opportunity_json = opportunity;
    $("#opportunity-title").text(opportunity["Name"]);
    $("#opportunity-countdown").text(convert_db_date_to_custom(opportunity["ClosingDate"]));
    document.getElementById("proposal-opportunity-detail").innerHTML = opportunity.Description;

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
    console.log("populateOppDocTemplates: " + String(opp_doc_templates));
    sortOpportunityDocs(opp_doc_templates.doctemplate);

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
        {
            anchor.href = doc_templates[i].Url.replace("https://athena.ecs.csus.edu/~wildcard/", "");
//             anchor.href = doc_templates[i].Url;
        }
        else
            anchor.href = "google.com";

        // Use DocTitle if DisplayTitle was not set
        if(doc_templates[i].DisplayTitle == null)
            anchor.appendChild(document.createTextNode(doc_templates[i].DocTitle));
        else
            anchor.appendChild(document.createTextNode(doc_templates[i].DisplayTitle));

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
    if(current_event.target.id != "fee-input")
        document.getElementById(current_event.target.dataset.parent_list_item_id).dataset.hasDocPending = true;
    else
        console.log("This is the fee-input event");

    console.log("Checking if we have all docs potentially satisfied");
    doc_list = document.getElementById("opp-doc-templates-list");

    has_all_docs = true;

    for(i = 0; i < doc_list.children.length; i++)
    {
        li = doc_list.children[i];
        has_all_docs = has_all_docs & (li.dataset.hasDocUploaded == "true" || li.dataset.hasDocPending == "true");
    }

    fee_input = document.getElementById("fee-input");
    if(fee_input.files.length == 0 && !($("#prev-fee-doc").is(":visible"))) // Hacky piece of shit!
    {

        has_all_docs = false;
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
                        num_proposal_callbacks_left--; console.log("Remaining Callbacks: " +String(num_proposal_callbacks_left));
                        if(!("doctemplate" in opp_doc_templates))
                        {
                            console.log("Got no doc templates, returning...");
                            return;
                        }
                        sortOpportunityDocs(opp_doc_templates.doctemplate);
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
        else if(status_name == "Seeking Clarification 1") { status_name = "Clarification Requested"; }
        else if(status_name == "Seeking Clarification 2") { status_name = "Clarification Requested"; }
        else if(status_name == "Clarification Received 1") { status_name = "Clarification Received, Under Evaluation"; }
        else if(status_name == "Clarification Received 2") { status_name = "Clarification Received, Under Evaluation"; }
        else if(status_name == "Evaluation 2 Rejected") { status_name = "Rejected"; }
        else if(status_name == "Evaluation 2 Accepted") { status_name = "Closed for edits, Under Evaluation"; }
        else if(status_name == "In Progress") { status_name = "Submitted, Under Evaluation"; }
        else if(status_name == "Open") { status_name = "Open"; }
        else if(status_name == "Expired") { status_name = "Expired"; }
        else {status_name = "UNKNOWN STATUS MAPPING: " + status_name; }
        
        prop_id = document.createTextNode(proposals_json[i].ProposalID);
        prop_status = document.createTextNode(status_name);

        closingDate = document.createTextNode(convert_db_date_to_custom(proposals_json[i].ClosingDate));

        anchor = document.createElement("a");
        anchor.appendChild(document.createTextNode(proposals_json[i].OpportunityName));
        anchor.onclick = (function() { 

            var ID = proposals_json[i].ProposalID;
            return function() { activateEditProposal(ID); };
        })();

        table_array.push([prop_id, anchor, closingDate, prop_status]);
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
                    router("#spa-create-proposal", true); // Sneaky! 
                }
            });
        }
    });
}

function shutdownProposal(instructions_text)
{
    console.log("shutdownProposal called");
    console.log(instructions_text);
    $("#proposal-instructions-span").text(instructions_text);

    $("#proposal-save-btn").hide();
    $("#proposal-submit-btn").hide();
    $("#proposal-time-remaining").hide();
    $("#fee-input").hide();
    $("#time-remaining-div").hide();

    // Gonna use this to hide all the file inputs, since the proposal is now closed
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
            alert("Encountering weirdness with hiding the inputs");

        current_input.style.display = "none";
    }
}

function initializeEditProposal(proposal_json)
{
    console.log("In initializeEditProposal");

    $("#create-proposal-header").text("Edit Proposal");
    $("#proposal-time-last-edit").text(convert_db_date_to_custom(proposal_json.LastEditDate));
    $("#proposal-back-list-btn").off();
    $("#proposal-save-btn").off();
    $("#proposal-time-remaining").show();

    $("#proposal-back-list-btn").click(function() { router("#spa-proposals-list"); });
    $("#proposal-save-btn").click(function() { saveProposal(proposal_json, false); }); // the false is that this is not a final submit


    $("#proposal-submit-btn").off();
    $("#proposal-submit-btn").click(function() { saveProposal(proposal_json, true); }); // True for this is a final submission


    timeRemainingCallback.stop(); // Don't want this shit lingering

    // Clarification state
    console.log("Proposal status: " + proposal_json.StatusName);
    if(proposal_json.StatusName == "Seeking Clarification 1" || proposal_json.StatusName == "Seeking Clarification 2")
    {
        console.log("OK, we found a clarification...");
        shutdownProposal("There is an open clarification request for this proposal, please respond in 'View Your Messages'");
    }
    else if(proposal_json.StatusName == "Expired")
    {
        shutdownProposal("Your proposal expired, next time upload all your docs and submit on time");
    }
    else if(proposal_json.StatusName == "Open")
    {
        // Setup our lovely countdown timer...
        
        timeRemainingCallback.start(
            function(reasonable_time_remaining) {
                if(isReasonableTimeNegative(reasonable_time_remaining))
                {
                    timeRemainingCallback.stop();
                    console.log("This fuckin guy being called");
                    shutdownProposal("This opportunity has closed, your proposal will be evaluated soon");

                }
                else
                {
                    time_remaining_text = "";
                    time_remaining_text += "Days: " + reasonable_time_remaining.days;
                    time_remaining_text += " Hours: " + reasonable_time_remaining.hours;
                    time_remaining_text += " Minutes: " + reasonable_time_remaining.minutes;
                    time_remaining_text += " Seconds: " + reasonable_time_remaining.seconds;
                    $("#proposal-time-remaining").text(time_remaining_text);
                }
            },
            parseCustomDateStringToDate(g_current_opportunity_json["ClosingDate"])
        );
    }
    else
    {
        console.log("proposal-edit: " + proposal_json.StatusName);
        shutdownProposal("Your Proposal has been submitted and is under evaluation");
    }


    doc_list = document.getElementById("opp-doc-templates-list");

    // If already have files, show them, as well as the final submit button
    $.ajax({
        url: "php/api/proposal/getDocsList.php?proposalid="+proposal_json.ProposalID, 
        type: "GET",
        success: function(proposal_docs_json)
        {
            // Do fee doc first cuz the rest of this shit might error out
            fee_doc = getFeeDocument(proposal_json.ProposalID);
            if(fee_doc)
            {
                // Set attribute
                $("#prev-fee-doc").attr("href", fee_doc.Url);
                $("#prev-fee-doc").show();
            }
            else
            {
                has_all_docs = false;
            }

            // Do the fuckin rest
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
                    prev_doc_anchor.target = "_blank";

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

            // Logic to show submit button
            if(has_all_docs)
            {
                if(proposal_json.StatusName == "Open")
                {
                    console.log("This proposal has all docs, showing submit button");
                    $("#proposal-submit-btn").show();
                }
                else
                {
                    console.log("this proposal is not open, not touching submit");
                }

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
    console.log("In saveProposal")

    if(is_this_submit)
        console.log("saveProposal: This is a final submission!");

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
            alert("saveProposal: Something terribly wrong has ocurred when trying to get a lock on the input");
            return false;
        }

        // console.log(current_input);

        // Check if there is a file for our current input, if so get a reference
        current_file = current_input.files.length > 0 ? current_input.files[0] : null;

        if(current_file == null)
        {
            console.log("saveProposal: No file for " + current_child.dataset.DocTemplateID + ", but that's ok!");
            continue;
        }

        // If we get here, we have an input element that has a file
        console.log("saveProposal: " + current_child.dataset.DocTemplateID + " got file with name: " + current_file.name);

        // Need to check if there is a doc already associated with this...
        if(current_child.dataset.DocID != null)
        {
            console.log("saveProposal: There is already a doc (" + current_child.dataset.DocID + ") associated with this DocTemplate");
            console.log("saveProposal: Attempting to delete old document...");

            // $.ajax({
            //     url: "",
            //     type: "GET",
            //     success: function() { console.log("Success deleting DocID"+current_child.dataset.DocID)}
            // });
            console.log("saveProposal: TODO: Endpoint for deleting a doc/ProposalDoc");
        }
        console.log("saveProposal: Attempting to upload...");

        var formData=new FormData();
        formData.append('filename', current_file, current_file.name);
        formData.append('ProposalID', proposal_json.ProposalID);
        formData.append("OpportunityID", proposal_json.OpportunityID);
        formData.append("DocTemplateID", current_child.dataset.DocTemplateID);
        formData.append('submit', "Lol this needs to be filled");
        formData.append('final_submission', is_this_submit); // Needs something in endpoint

        var xhr = new XMLHttpRequest();
        xhr.open('POST','php/api/proposal/uploadDoc.php', false); // We're gonna make this synchronous
        xhr.onload = function() {
            if(xhr.status == 200) {
                console.log('saveProposal: File uploaded' + xhr.response);
            } else {
                alert('saveProposal: Error uploading file:' + xhr.response);
                console.log("saveProposal: There was an error, dumping what was sent:");
                console.log("saveProposal: " + String(xhr));
            }
        };
        xhr.send(formData);
    }

    fee_input = document.getElementById("fee-input");
    current_file = fee_input.files.length > 0 ? fee_input.files[0] : null;
    if(current_file != null)
    {
        uploadFeeDocument(current_file, current_file.name, proposal_json.ProposalID, proposal_json.OpportunityID, 0);
    }
    else
    {
        console.log("No fee doc to upload");
    }

    if(is_this_submit)
    {
        console.log("Setting proposal to In Progress");
        updateProposal(proposal_json.ProposalID, {"Status":"30"});
        alert("Your proposal was succesfully submitted");
    }
    else
    {
       alert("Your proposal was succesfully saved"); 
    }


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

function activateMessageList()
{
    initializeMessageList();
    var sorting = [[1,1]]; 
    // sort on the second column 
    
    // setTimeout(function(){ 
    //     $("#messages-list-table").trigger("sorton",[sorting]);
    // }, 500);
    router("#spa-message-list");
}

function initializeMessageList()
{
    removeAllTableElements(document.getElementById("messages-list-table"));

    // Force the message center to update
    if(g_mc == null)
    {
        // g_mc = new MessageCenter();
        g_mc = new MessageCenter(populateMessageList);
        g_mc.updateServer();
    }
    else
    {
        g_mc.updateServer();
        g_mc = new MessageCenter(populateMessageList);
    }
}


function populateMessageList(messages_json)
{
    $("#num-unread-messages").text(g_mc.numUnread);

    PREVIEW_LENGTH = 90; // Number of characters in the message preview
    messages_json = g_mc.messages;
    table_array = [];

    for(i = 0; i < messages_json.length; i++)
    {
        message_type = document.createElement("a");
        message_type.appendChild(document.createTextNode(messages_json[i].Type));

        time_received = document.createElement("a");
        time_received.appendChild(document.createTextNode(convert_db_date_to_custom(messages_json[i].TimeReceived)) );

        // This will be clipped
        preview = document.createElement("a");
        preview_text = ""
        if(messages_json[i].Body.length > PREVIEW_LENGTH)
            preview_text = messages_json[i].Body.substring(0,PREVIEW_LENGTH)+"...";
        else
            preview_text = messages_json[i].Body;
        
        preview.appendChild(document.createTextNode(preview_text) );


        message_status = document.createElement("a");
        message_status.appendChild(document.createTextNode(messages_json[i].Status) );

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

    message = g_mc.messages[parseInt(message_id)];
    if(message.Type == "ClarificationNotification")
        g_mc.markRead("ClarificationNotification", message.ClarificationID);
    else if(message.Type == "OpportunityNotification")
        g_mc.markRead("OpportunityNotification", message.OpportunityID);
    else
        alert("Error marking message as read!");

    $("#num-unread-messages").text(g_mc.numUnread);

    router("#spa-message-detail");
}

function initializeMessageDetail(message_id)
{

    // Ajax to get the specific message
    populateMessageDetail(g_mc.messages[parseInt(message_id)]);
}

// <h2>Message Type: <span id="message-detail-type">Message type placeholder</span></h2>
// <h2>Time Received: <span id="message-detail-time-received">Message time received placeholder</span></h2>
// <h2 id="message-detail-time-responded-header" class="hidden">Time Responded: <span id="message-detail-time-responded">Message time response placeholder</span></h2>
// <a id="send-message-btn" class="btn btn-primary hidden">Send Message</a>
// <a id="discard-message-btn" class="btn btn-primary  hidden">Discard Message</a>
// <a id="message-detail-back-btn" class="btn btn-primary hidden" >Back to Messages</a>

function phony_message()
{
    demo_message = {};
    demo_message.Type = "ClarificationNotification";
    demo_message.ClarificationID = "12345";
    demo_message.ProposalID = "18650";
    demo_message.OpportunityName  = "God fucking damnit";
    demo_message.LastEditDate = "2018-05-16 02:13:49";
    demo_message.ClosingDate = "2018-05-20 02:13:49";
    demo_message.TimeReceived = "2018-05-20 02:13:49";
    demo_message.Body  = "Omfg <b>please</b> work";
    demo_message.Answer = "<b>No!</b>";
    demo_message.DocID  = 139;

    populateMessageDetail(demo_message);
    router("#spa-message-detail");
}

function populateMessageDetail(message)
{

    // Populate all fields
    $("#message-detail-time-received").text(convert_db_date_to_custom(message.TimeReceived));
    $("#message-detail-type").text(message.Type);
    document.getElementById("message-detail-body").innerHTML = message.Body;


    // Hide non-essential, leave these to be shown by subroutines
    $("#send-message-btn").hide();
    $("#discard-message-btn").hide();
    $("#message-detail-time-responded-header").hide();
    $("#send-message-btn").hide();
    $("#discard-message-btn").hide();
    $("#message-detail-response").hide();
    $("#message-detail-due-by-header").hide();
    $("#message-detail-upload").hide();
    $("message-detail-opportunity-name-header").hide();
    $("#message-detail-download-link").hide();
    $("send-message-div").hide();

    // Make sure this guys fucking dead
    $('#summernote').summernote('destroy'); $('#summernote').hide();
    $("#message-response-editor").hide();


    if(message.Type == "ClarificationNotification")
        populateClarificationRequestDetail(message);
    else if(message.Type == "OpportunityNotification")
        populateOpportunityNotificationDetail(message);
    else
        alert("error");

    $("#send-message-btn").off();
    $("#send-message-btn").click(function() 
    {
        sendClarificationResponse(message.ProposalID, message.ClarificationID);
        alert("Response sent successfully");
        activateMessageList();
    });

}



function populateClarificationRequestDetail(message)
{
    // Show these always
    $("#message-detail-opportunity-name").text(message.OpportunityName);
    $("#message-detail-opportunity-name-header").show();

    $("send-message-div").show();


    if(message.Answer != null && message.Answer != "")
    {
        console.log("There is an answer associated with this Clarification");
        console.log(message);
        // Hide these
        $("#send-message-btn").hide();
        $("#discard-message-btn").hide();
        $("#message-detail-back-btn").text("Back to Messages");
        

        //Unhide these
        $("#message-detail-time-responded-header").show();
        $("#message-detail-time-responded").show();
        $("#message-detail-time-responded").text(message.LastEditDate)
        $("#message-detail-back-btn").show();
        $("#message-detail-response").show();
        $("#message-response-editor").show();

        // Set these
        document.getElementById("message-response-editor").innerHTML = (message.Answer);

        document.getElementById("message-response-editor").readOnly = true;

        if(message.DocID != null)
        {
            $("#message-detail-download-link").show();
            $("#message-detail-download-link").attr("href", getDocUrlFromID(message.DocID));
        }


    }
    else // There is no answer, will need one if closing date has not passed
    {
        // Check if expired
        if(message.ClosingDate != null)
        {
            closing_date = parseCustomDateStringToDate(message.ClosingDate);
            if(closing_date < new Date()) // Shits expired
            {
                console.log("This clarification has expired!");
                $("#send-message-btn").hide();
                $("#discard-message-btn").hide();
                $("#message-detail-due-by-header").show();
                $("#message-detail-due-by").text(convert_db_date_to_custom(message.ClosingDate));
                document.getElementById("message-detail-due-by").style.color = "red";
                document.getElementById("message-response-editor").readOnly = true;
                $("#message-detail-response").show();
                document.getElementById("message-response-editor").innerHTML = "THIS CLARIFICATION HAS EXPIRED";

                return;
            }
        }
        
        // Not expired
        $("#message-detail-back-btn").text("Discard Message");

        $('#summernote').show(); $('#summernote').summernote({
            height: 300,
            minHeight: 300,
            maxHeight: null,
            focus: true
        });

        if(message.ClosingDate != null)
            $("#message-detail-due-by").text(convert_db_date_to_custom(message.ClosingDate));
        else
            $("#message-detail-due-by").text("None");
        document.getElementById("message-detail-due-by").style.color = "rgb(51, 51, 51)";
        $("#message-detail-due-by-header").show();

        // Have to reset for some reason
        document.getElementById("message-response-editor").innerHTML = ""; 
        clarification_input = document.getElementById("clarification-file-input");
        clarification_input.value = "";
        document.getElementById("message-response-editor").readOnly = false; 

        // Show these
        $("#send-message-btn").show();
        $("#discard-message-btn").show();
        $("#message-detail-response").show();
        $("#message-detail-upload").show();
    }
}

function populateOpportunityNotificationDetail(message)
{
    $("#message-detail-back-btn").text("Back to Messages");
    $("#message-detail-opportunity-name").text(message.OpportunityName);
    $("#send-message-btn").hide();
    $("#discard-message-btn").hide();
    $("#message-detail-response").hide();
    $("#message-detail-time-responded-header").hide();
}





function sendClarificationResponse(ProposalID, ClarificationID)
{


    doc_id = -1;
    clarification_input = document.getElementById("clarification-file-input");
    if(clarification_input.files.length == 1)
    {
        var formData=new FormData();
        formData.append('filename', clarification_input.files[0], clarification_input.files[0].name);
        formData.append('ProposalID', ProposalID);
        formData.append("OpportunityID", "-1");
        formData.append("DocTemplateID", "-1");
        formData.append('submit', "Lol this needs to be filled");
        formData.append('final_submission', false); // Needs something in endpoint

        var xhr = new XMLHttpRequest();
        xhr.open('POST','php/api/proposal/uploadDoc.php', false); // We're gonna make this synchronous
        xhr.onload = function() {
            if(xhr.status == 200) {
                console.log('saveProposal: File uploaded' + xhr.response);
                console.log(JSON.parse(xhr.response));
                doc_id = JSON.parse(xhr.response).DocID;
            } else {
                alert('saveProposal: Error uploading file:' + xhr.response);
                console.log("saveProposal: There was an error, dumping what was sent:");
                console.log("saveProposal: " + String(xhr));
            }
        };
        xhr.send(formData);
    }



    var xhr = new XMLHttpRequest();
    xhr.open("POST", "php/api/proposal/updateClarification.php");
    xhr.onload = function(response)
    {
        if(xhr.status == 200)
        {
            console.log("succesfully sent clarification response");
            console.log(xhr.response);
        }
        else
        {
            console.log("Error sendClarificationResponse");
            console.log(xhr.response);
        }
    }
    xhr.setRequestHeader("Content-type", "application/json");
    answer = $('#summernote').summernote('code');
    request_json = {"ProposalID":ProposalID, "ClarificationID":ClarificationID, "answer":answer, "DocID":String(doc_id)};
    xhr.send(JSON.stringify(request_json));

    // This is kind of fucked up, but we have to update the proposal based on what phase its in right now
    proposal = getProposalByID(ProposalID);
    if(proposal.StatusName == "Seeking Clarification 1")
    {
        console.log("We are in Clarification 1 currently, updating to status 50")
        updateProposal(ProposalID, {"Status":"50"});
    }
    else if(proposal.StatusName == "Seeking Clarification 2")
    {
        console.log("We are in Clarification 2 currently, updating to status 55");
        updateProposal(proposalID, {"Status":"55"});
    }

    
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
                if(subscriptions_xhr.status == 200)
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

// Christ why isn't this included
function isValidJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function getProposalByID(ProposalID)
{
    proposal_json = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://athena.ecs.csus.edu/~wildcard/php/api/proposal/read.php?ProposalID="+ProposalID, false);
    xhr.onload = function(response)
    {
        if(xhr.status == 200)
        {
            proposal_json = JSON.parse(xhr.response);
            
            if(proposal_json.ProposalID == null)
            {
                console.log("Error getting proposal by ID");
                console.log(xhr.response);
                proposals_json = null;
            }
        }
        else
        {
            console.log("Error getting proposal by ID");
            console.log(xhr.response);
        }
    }

    xhr.send();

    return proposal_json;
}

// Messages are not saves on backend, it is the notifications that are saved. Messages are generated on the fly
DEFAULT_NOTIFICATION_BODY = "There is a new Opportunity available"; // TODO: better
class MessageCenter
{

    constructor(done_callback)
    {
        console.log("MessageCenter: Beginig Construction");
        var self = this;
        this.bidder_id = g_bidder_id;
        this.internal_json = {};
        this.fetchJSON();

        this.clarifications = [];
        this.opportunities = [];
        this.all_opportunities = [];

        console.log(this.internal_json);
        this.time_of_last_login = parseCustomDateStringToDate(this.internal_json.time_of_last_login);

        var num_callbacks_left = 2;
        this.fetchClarifications(function()
        {
            console.log("Clarifications fetch done");
            self.updateClarifications();

            num_callbacks_left--;
            if(num_callbacks_left == 0 && done_callback != null)
            {
                console.log("MessageCenter: Executing done_callback from fetchClarifications");
                console.log("MessageCenter: " + String(opportunities.length) + " Opportunities");
                done_callback();
            }
        });


        this.fetchOpportunities(function()
        {
            console.log("Opportunities fetch done");
            self.updateNotifications();

            num_callbacks_left--;
            if(num_callbacks_left == 0 && done_callback != null){
                console.log("MessageCenter: Executing done_callback from fetchOpportunities");
                console.log("MessageCenter: " + String(opportunities.length) + " Opportunities");
                done_callback();
            }
        });
        // Fetch internal_json from backend
        // using session var for now
    }

    fetchJSON()
    {
        var self = this;
        console.log("fetching json");

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://athena.ecs.csus.edu/~wildcard/php/api/bidder/readSessionData.php?bidderid="+this.bidder_id, false);
        xhr.onload = function(response)
        {
            if(xhr.status == 200)
            {
                console.log("Success getting json payload");
                var json_payload = xhr.response;
                try {
                    var j = JSON.parse(json_payload);

                    j = JSON.parse(j.SessionData);
                    console.log(j);

                    self.internal_json = j;
                    console.log("succesfully parsed JSON");
                } catch (e) {
                    console.log("UNsuccesfully parsed JSON")
                    self.internal_json = null;
                }
            }
            else
            {
                alert("Error posting json data");
                console.log(xhr.response);
            }
        }
        xhr.send();

        if(self.internal_json == null)
        {
            console.log("MessageCenter: Internal json was null, seeding");
            self.seedInternalJSON();
        }
        else
        {
            console.log("Got internal json");
        }
    }

    seedInternalJSON()
    {
        console.log("seeding internal json");

        var last_login = new Date();
        last_login.setYear(1994);

        this.internal_json = {
            "time_of_last_login": getDatabaseDateStringFromDate(last_login),
            "OpportunityNotifications": [],
            "ClarificationNotifications": []
        }

        console.log("Done seeding");
    }

    // Need to filter based on subscribed categories, attach OpportunityName and CategoryName
    updateNotifications()
    {
        console.log("MessageCenter: updateNotifications");
        var self = this;
        console.log("updating notifications");
        var counter = 0;
        this.opportunities.forEach(function(opportunity)
        {
            var opp_last_edit_date = parseCustomDateStringToDate(opportunity.LastEditDate);
            counter++;

            if(opp_last_edit_date > self.time_of_last_login)
            {
                console.log("MessageCenter: Found a new notification thanks to time");
                var new_opportunity_notification = {};
                new_opportunity_notification.TimeReceived = opportunity.LastEditDate;
                new_opportunity_notification.Body = "There is a new Opportunity, " + "'" + opportunity.Name + "'" + " in Category: " + opportunity.CategoryName;
                new_opportunity_notification.Status = "unread";
                new_opportunity_notification.OpportunityID = opportunity.OpportunityID;
                new_opportunity_notification.OpportunityName = opportunity.Name;
                new_opportunity_notification.CategoryName    = opportunity.CategoryName;

                self.internal_json.OpportunityNotifications.push(new_opportunity_notification);
            }
            else
            {
                console.log("MessageCenter: Rejected due to time");
            }
            console.log("   MessageCenter: Time Opp Edit: " + String(opp_last_edit_date));
            console.log("   MessageCenter: Time of last login: " + String(self.time_of_last_login));
            
        });

        console.log("MessageCenter: Exiting updateNotifications after processing: " + String(counter));
    }

    updateClarifications()
    {
        console.log("MessageCenter: updateClarifications");
        var self = this;

        this.clarifications.forEach(function(clarification)
        {
            if(!(clarification.ClarificationID in self.internal_json.ClarificationNotifications))
            {
                console.log(clarification.ClarificationID + " is not in existing notifications, creating");
                self.internal_json.ClarificationNotifications[clarification.ClarificationID] = {};
                self.internal_json.ClarificationNotifications[clarification.ClarificationID].Status = "unread";

                // This is redundant, but makes it easier
                self.internal_json.ClarificationNotifications[clarification.ClarificationID].ClarificationID = clarification.ClarificationID;
            }
        });
    }


    fetchClarifications(finished_cb)
    {
        console.log("MessageCenter: fetchClarifications");
        var self = this; // omfg are you serious, need this for callbacks

        $.ajax({
            url: "php/api/proposal/read.php", 
            success: function(proposals_json) {
                proposals_json["proposal"] = proposals_json["proposal"].filter(proposal => proposal["BidderID"] == g_bidder_id)
                var num_proposal_callbacks_left = proposals_json["proposal"].length;

                // For each proposal, get all requests for clarification, then select the only valid one for each proposal
                proposals_json["proposal"].forEach( function (proposal_json)
                {
                    $.ajax({
                        url: "php/api/proposal/getClarifications.php?proposalID="+proposal_json.ProposalID, 
                        type: "GET",
                        success: function(clarifications_json)
                        {
                            console.log(clarifications_json);
                            num_proposal_callbacks_left--; console.log("Remaining Callbacks: " +String(num_proposal_callbacks_left));
                            if(clarifications_json.clarification.length == 0)
                            {
                                console.log("Got no Clarifications for " + proposal_json.ProposalID);
                            }
                            else
                            {
                                console.log(clarifications_json.clarification);
                                clarifications_json.clarification.forEach(function(c)
                                {
                                    c.ProposalID = proposal_json.ProposalID;
                                    c.OpportunityID = proposal_json.OpportunityID;
                                    self.clarifications.push(c);
                                });
                            }

                            if(num_proposal_callbacks_left == 0)
                            {
                                finished_cb();
                            }
                        }
                    });
                });
            }
        });
    }

    // Will get all opportunities, need to change status ID to someting appropriate
    // Also fetch CategoryNames and subscriptions
    fetchOpportunities(finished_cb)
    {
        console.log("MessageCenter: fetchOpportunities");
        var self = this;
        var internal_opportunities = []; // Push here until we can filter, then push to this.opportunities
        var internal_subscriptions = [];

        function filterOpportunities()
        {
            console.log(internal_subscriptions);
            console.log(internal_opportunities);
            internal_opportunities.forEach(function(opportunity)
            {

                if(internal_subscriptions.includes(opportunity.CategoryID))
                {
                    console.log("Category " + opportunity.CategoryID + " matches, adding");
                    self.opportunities.push(opportunity);
                }
            });

            self.all_opportunities = internal_opportunities;
            finished_cb();
        }


        var self = this;
        var num_callbacks_left = 2;


        $.ajax({
            url: "php/api/opportunity/read.php?status=3", 
            success: function(opportunities_json)
            {
                // We need to get the category name for each opportunity, via the categoryID
                var categories = {}
                $.ajax({
                    url: "php/api/opportunity/categoryName.php", 
                    success: function(category_json)
                    {
                        console.log(category_json);
                        for (var i = 0; i < category_json.length; i++) {
                            categories[category_json[i].CategoryID] = category_json[i].Name;
                        }

                        console.log(categories);

                        for(i = 0; i < opportunities_json["opportunity"].length; i++)
                        {
                            opportunities_json["opportunity"][i].CategoryName = categories[opportunities_json["opportunity"][i].CategoryID];
                        }

                        var opportunities = opportunities_json["opportunity"];

                        opportunities.forEach(function(opportunity)
                        {
                            internal_opportunities.push(opportunity);
                        });

                        num_callbacks_left--;
                        if(num_callbacks_left == 0)
                        {
                            filterOpportunities();
                        }
                    },
                    error: function(error)
                    {
                        console.log(error);
                    }
                });
            }
        });

        var subscriptions_xhr = new XMLHttpRequest();
        subscriptions_xhr.open("POST", "php/api/bidder/getSubscriptions.php");
        subscriptions_xhr.onload = function() 
        {
            if(subscriptions_xhr.status == 200)
            {
                console.log(subscriptions_xhr.responseText);
                var subscriptions_json = JSON.parse(subscriptions_xhr.responseText);
                
                subscriptions_json.subscription.forEach(function(sub)
                {
                    internal_subscriptions.push(sub.CategoryID);
                });
                console.log(internal_subscriptions);

            }
            else
            {
            }

            num_callbacks_left--;
            if(num_callbacks_left == 0)
            {
                console.log("HERE");
                filterOpportunities();
            }
        }
        subscriptions_xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        subscriptions_xhr.send("bidderid="+g_bidder_id);
    }

    get messages()
    {
        var self = this;
        var _messages = [];

        self.internal_json.OpportunityNotifications.forEach(function(opportunity_notification)
        {
            var new_message = {};
            new_message.Type = "OpportunityNotification";
            new_message.TimeReceived = opportunity_notification.TimeReceived;
            new_message.Body = opportunity_notification.Body;
            new_message.Status = opportunity_notification.Status;
            new_message.OpportunityID = opportunity_notification.OpportunityID;
            new_message.OpportunityName = opportunity_notification.OpportunityName;
            new_message.CategoryName    = opportunity_notification.CategoryName;

            _messages.push(new_message);
        });

        // The clarification messages will be interesting because they are derived from the clarifications that we got from server
        self.internal_json.ClarificationNotifications.forEach(function(clarification_notification)
        {
            var new_message = {};
            

            console.log(clarification_notification);

            var clarification = null;
            var opportunity = null;
            self.clarifications.forEach(function(c)
            {
                if(c.ClarificationID == clarification_notification.ClarificationID)
                {
                    console.log("Setting clarification: " + c.ClarificationID);
                    clarification = c;
                }
            });

            self.all_opportunities.forEach(function(o)
            {
                if(clarification.OpportunityID == o.OpportunityID)
                {
                    console.log("Setting Opportunity");
                    opportunity = o;
                }
            });

            if(clarification == null)
            {
                console.log("Error matching clarification");
                console.log(self.clarifications);
                console.log(clarification_notification);
                alert("There was an issue matching this message to a clarification");
            }
            if(opportunity == null)
            {
                console.log(clarification_notification);
                console.log(self.all_opportunities);
                console.log(clarification.OpportunityID);
                alert("There was an error matching this message to an opportunity");
            }
            else
            {
                console.log("Matched an opportunity:" + opportunity.Name);
                console.log(opportunity);
            }

            var proposal = getProposalByID(clarification.ProposalID);
            if(proposal == null)
            {
                console.log("Proposal was null");
                alert("Error generating message");
            }

            
            new_message.Type = "ClarificationNotification";
            new_message.TimeReceived = clarification.CreatedDate;
            new_message.Body = clarification.question;
            new_message.Status = clarification_notification.Status;
            new_message.Answer = clarification.answer;
            new_message.ClarificationID = clarification.ClarificationID;
            new_message.ProposalID = clarification.ProposalID;
            new_message.LastEditDate = clarification.LastEditDate;
            new_message.ClosingDate = clarification.ClosingDate;
            new_message.OpportunityName = opportunity.Name;
            new_message.DocID = clarification.DocID;
            new_message.Proposal = proposal;

            _messages.push(new_message);
        });

        console.log("MessageCenter: Returning " + String(_messages.length) + " messages")


        return _messages;
    }

    get numUnread()
    {
        var unread = 0;

        this.internal_json.ClarificationNotifications.forEach(function(target)
        {
            if(target.Status == "unread")
                unread++;
        });

        this.internal_json.OpportunityNotifications.forEach(function(target)
        {
            if(target.Status == "unread")
                unread++;
        });

        return unread;
    }

    updateServer()
    {
        console.log("MessageCenter: Updating server");
        console.log("MessageCenter: "  + String(JSON.stringify(this.internal_json)));

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://athena.ecs.csus.edu/~wildcard/php/api/bidder/createSessionData.php", false);
        xhr.onload = function(response)
        {
            if(xhr.status == 200)
            {
                console.log("Success posting: "+ xhr.response)
            }
            else
            {
                alert("Error posting json data");
                console.log(xhr.response);
            }
        };
        xhr.setRequestHeader("Content-type", "application/json");

        // var formData=new FormData();
        // formData.append('bidderid', this.bidder_id);
        // formData.append('sessiondata', JSON.stringify(this.internal_json));

        this.internal_json.time_of_last_login = getDatabaseDateStringFromDate(new Date());
        console.log("Setting time of last login as: " + this.internal_json.time_of_last_login);

        var stringified_internal_json = JSON.stringify(this.internal_json);
        var payload = {"BidderID": this.bidder_id, "SessionData":stringified_internal_json};
        var stringified_payload = JSON.stringify(payload);

        xhr.send(stringified_payload);
        console.log("MessageCenter: " + stringified_payload);
    }

    // Type being "ClarificationNotification" or "OpportunityNotification"
    // ID being either the opportunity ID or the clarification ID in the message
    markRead(message_type, id)
    {
        var target_array = null;
        if(message_type == "ClarificationNotification")
            target_array = this.internal_json.ClarificationNotifications;
        else if(message_type == "OpportunityNotification")
            target_array = this.internal_json.OpportunityNotifications;
        else
            alert("Incorrect message_type supplied: " + message_type);

        target_array.forEach(function(target)
        {
            console.log("Checking");
            var current_id = null;
            if(message_type == "ClarificationNotification")
                current_id = target.ClarificationID;
            else if(message_type == "OpportunityNotification")
                current_id = target.OpportunityID;

            if(current_id == id)
            {
                console.log("Marking " + id + " as read");
                target.Status = "read";
                console.log(target_array);
            }
        });

        this.updateServer();
    }
}