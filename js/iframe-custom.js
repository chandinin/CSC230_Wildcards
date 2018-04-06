function getTitle() {
    return $(document).find("title").text();
}

function openNewWindow(strURL) {
    var strWindowFeatures = "location=yes,height=725,width=1099,resizable=1,scrollbars=yes,status=yes";
    var win = window.open(strURL, "_blank", strWindowFeatures);
}

var Appended = 0;

function getModalContent() {
    return "<div class=\"modal fade\" id=\"qtipModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"qtipModalLabel\" aria-hidden=\"true\">" +
        "<div class=\"modal-dialog\"> " +
        " <div class=\"modal-content\">" +
        "<div class=\"modal-header\">" +
        " <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>" +
        "<h4 class=\"modal-title\" id=\"qtipModalHeading\"> Heading here </h4>" +
        " </div>" +
        "  <div class=\"modal-body\" id=\"qtipcontent\"> This is where content goes. </div>" +
        " <div class=\"modal-footer\">" +
        " <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Close</button>" +
        "  </div></div></div></div>";
}

function showQTip(qtipURL) {

    if (Appended == 0) {
        $('#main').append(getModalContent());
        Appended = 1;
    }

    var baseurl = window.location.protocol + "//" + window.location.host + "/";
    $.ajax({
        url: baseurl + 'page/static&qtippg=' + qtipURL,
        type: "GET",
        success: function (data) {

            $('#qtipcontent').html(data);
            var heading = $('#qtipcontent').find(".qt-heading").html();
            console.log(heading);
            $('#qtipModalHeading').html(heading);
            $('#qtipcontent').find(".qt-heading").html("");

            $('#qtipModal').modal('show');

        }
    });
}

function hideTimeoutMsg() {
    var iFrameMessageElement = document.getElementById('iframe-alert-message');
    if (iFrameMessageElement != null) {
        document.getElementById('iframe-alert-message').style.display = 'none';

        var oldURL = window.location.href;
        var newURLwithoutTimeOutParam = oldURL.replace("&msg=timeout", "");
        window.history.pushState('page2', 'Title', newURLwithoutTimeOutParam);
    }
}


function displayFAQ(iframe, rsnPresent) {
    if (!$(iframe).contents().find('#accordion-faq').length) {
        if (rsnPresent === "no") {
            document.getElementById('rsn-bucket').style.display = 'none';
        } else {
            //document.getElementById('faq-widget').style.display = 'none';
            var x = document.getElementsByClassName("faq-widget");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].style.display = 'none';
            }

            var y = document.getElementsByClassName("view-all");
            var j;
            for (j = 0; j < y.length; j++) {
                if (y[j].id == "faq-widget") {
                    y[j].style.display = 'none';
                }
            }
        }
    }
    else {
        var AccordionHeight = iframe.contentWindow.document.getElementById('accordion-faq').offsetHeight;
        //window.parent.document.getElementById('myIFrame').style.height = AccordionHeight + 20 +'px';
        $(iframe).height(AccordionHeight);

        //iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";

    }
}

function validate() {
    email = document.getElementById("email").value;
    url = "/page/email-subscriptions&bnt_subscribe=1&email=" + email;
    window.parent.location.href = url;
    return false;
} 
