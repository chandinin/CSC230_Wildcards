// bidder_register.js
// Attach a submit handler to our registration form
// Uses http://malsup.github.com/jquery.form.js for this, not vanilla jquery
$(document).ready(function() { 
    activateManageSubscriptions();
    console.log("Ready");

    $("#register-btn").click(function() { sendRegistration(); });
});

// reduce a form into key value pairs
// Use: objectifyForm( $("#registration-form").serializeArray() )
function objectifyForm(formArray) {//serialize data function

  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}




function activateManageSubscriptions()
{
    initializeManageSubscriptions();
}


function initializeManageSubscriptions()
{
    console.log()
    //get all categories
    var xhr = new XMLHttpRequest();
    xhr.open('GET','php/api/opportunity/getOppCategoryList.php',true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            populateManageSubscriptions(jsonArray);
        } else {
            alert("Error getting categories");
        }
    };
    xhr.send();
}


// Todo: how to use the form data effectively...
function populateManageSubscriptions(jsonArray)
{
    console.log("Calling populateManageSubscriptions");

    // Clear what we already have
    $('#subscriptions-form').empty();

    for(var i = jsonArray.Category.length-1; i >= 0 ; i--) {
        // Skip the None category
        if(jsonArray.Category[i].Name == "None")
            continue;

        div_form_check = $("<div>", {
            class: 'form-check'
        });

        input_checkbox = $('<input>', {
            class: 'form-check-input',
            type: 'checkbox',
            id: jsonArray.Category[i].CategoryID
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


function saveCategorySubscriptions()
{
    checked_category_ids = getCheckedCategorySubscriptions();

    // Ajax it to endpoint for updating subscriptions

    alert("Your subscriptions have been IGNORED, congrats :p" + String(checked_category_ids));

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

function sendRegistration()
{
    checked_category_ids = getCheckedCategorySubscriptions();
    form_data = objectifyForm( $("#registration-form").serializeArray() );

    console.log(JSON.stringify(form_data));
    console.log(checked_category_ids);

    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://athena.ecs.csus.edu/~wildcard/php/api/bidder/create.php', false);
    xhr.onload = function() {
        if(xhr.status == 200) {
            console.log('Account created' + xhr.response);
            alert("Account was succesfully created");
            window.location.replace("bidder_login.html")
        } else {
            alert('Error creating account' + xhr.response);
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(form_data));

    updateSubscriptions(form_data["id"], checked_category_ids);
}


// {
//  "id":"0","subscription":[ { "ID":"0", "CategoryID":"5" }, { "ID":"0", "CategoryID":"1" }]
// }
// Both as string
// Synchronous
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
        } else {
            alert('Error uploading file:' + xhr.response);
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(json_payload));
}