function postData(url, formData, btnId, containerResponseId, errorMessageID, mode, doneAction) {
    hideError(errorMessageID);

    if ((btnId != null) && (btnId.constructor === Array)) {
        for (var indiceId in btnId) {
            DisableButtonAndAddLoader(btnId[indiceId]);
        }
    }
    else {
        DisableButtonAndAddLoader(btnId);
    }

    var jqxhr = $.post(url, formData, function () {
    }).done(function (data) {
        if (data.HasError) {
            displayError(data.Message, errorMessageID);
        } else {
            if (mode == "INSERT") {
                $("#" + containerResponseId).prepend(data.Message);
            } else if (mode == "APPEND") {
                $("#" + containerResponseId).append(data.Message);
            } else if (mode == "REPLACE") {
                $("#" + containerResponseId).html(data.Message);
            } else if (mode == "DELETE") {
                $("#" + containerResponseId).remove();
            }

            if (doneAction) {
                doneAction(data);
            }
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        displayError(ERROROCCUREDWHILESENDING + ": " + textStatus + " - " + errorThrown, errorMessageID)
    })
    .always(function () {
        if (btnId.constructor === Array) {
            for (var indiceId in btnId) {
                EnableButtonAndRemoveLoader(btnId[indiceId]);
            }
        }
        else {
            EnableButtonAndRemoveLoader(btnId);
        }
    });
}

function postDataHtml(url, formData, btnId, containerResponseId, errorMessageID, mode, doneAction, alwaysAction) {
    hideError(errorMessageID);
    if (btnId != null && btnId != "") {
        $("#" + btnId).attr("disabled", "disabled");
        $("#" + btnId).children("span").hide();
        $("#" + btnId).children("img").show();

        $("#" + btnId).prepend('<img  src="' + ROOT + 'Content/img/ajax-loader.gif" />')
    }
    var jqxhr = $.post(url, formData, function () {
    }).done(function (html) {
        if (mode == "INSERT") {
            $("#" + containerResponseId).prepend(html);
        } else if (mode == "APPEND") {
            $("#" + containerResponseId).append(html);
        } else if (mode == "REPLACE") {
            $("#" + containerResponseId).html(html);
        }

        if (doneAction) {
            doneAction();
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        displayError(ERROROCCUREDWHILESENDING + ": " + textStatus + " - " + errorThrown, errorMessageID)
    })
    .always(function () {
        if (btnId != null && btnId != "") {
            $("#" + btnId).children("span").show();
            $("#" + btnId).removeAttr("disabled");
            $("#" + btnId).children("img").remove();
        }

        if (alwaysAction)
            alwaysAction();
    });
}

function ShowModal(idModal, urlToload, doneAction) {
    $("#" + idModal).modal({
        backdrop: 'static',
        'show': true
    });

    $("#" + idModal + " .modal-content").html('<div class="modal-header">Loading...</div><div class="modal-body"><img style="text-align:center;" src="' + ROOT + 'Content/img/ajax-loader.gif" /></div>');
    //var d = new Date();
    //$("#" + idModal + " .modal-content").load(urlToload);
    $.ajax({
        url: urlToload,
        cache: false,
        dataType: "html",
        success: function (data) {
            $("#" + idModal + " .modal-content").html(data);
            if (doneAction)
                doneAction();
        },
        error: function (resultat, statut, erreur) {
            $("#" + idModal + " .modal-content").html(erreur);
        }
    });
}

function ShowInPanel(idPanel, urlToLoad) {
    $.ajax({
        url: urlToLoad,
        cache: false,
        dataType: "html",
        success: function (data) {
            $("#" + idPanel).html(data);
        },
        error: function (resultat, statut, erreur) {
            $("#" + idPanel).html(erreur);
        }
    });
}

function loadRemoteHtml(url, formData, containerResponseId, errorMessageID, doneAction) {
    hideError(errorMessageID);

    $("#" + containerResponseId).html("");

    AddLoader(containerResponseId);

    var jqxhr = $.post(url, formData, function () {
    }).done(function (data) {
        $("#" + containerResponseId).html(data);

        if (doneAction) {
            doneAction(data);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        RemoveLoader(containerResponseId);
        displayError("An error occured while sending the data to the server: " + textStatus + " - " + errorThrown, errorMessageID)
    })
    .always(function () {
    });
}

function postDataWithDomLoading(url, formData, domLoading, domError, doneAction) {
    $(domError).hide();
    $(domLoading).show();

    var jqxhr = $.post(url, formData, function () {
    }).done(function (data) {
        if (data == false) {
            $(domError).show();
        } else {
            doneAction(data);
        }
    })
        .fail(function (jqXHR, textStatus, errorThrown) {
            $(domError).show();
        })
        .always(function () {
            $(domLoading).hide();
        });
}

function displayError(message, errorMessageId) {
    if (!errorMessageId)
        errorMessageId = "globalErrorMessage";

    $("#" + errorMessageId).show();
    $("#" + errorMessageId).html(message);

    bootbox.alert(ERROROCCURED + ": " + message);
}

function hideError(errorMessageId) {
    if (!errorMessageId)
        errorMessageId = "globalErrorMessage";

    $("#" + errorMessageId).hide();
    $("#" + errorMessageId).html("");
}

function DisableButtonAndAddLoader(btnId) {
    if (btnId != null && btnId != "") {
        $("#" + btnId).attr("disabled", "disabled");
        $("#" + btnId).children("span").hide();

        $("#" + btnId).prepend('<img  src="' + ROOT + 'Content/img/ajax-loader.gif" />')
    }
}

function EnableButtonAndRemoveLoader(btnId) {
    if (btnId != null && btnId != "") {
        $("#" + btnId).children("span").show();
        $("#" + btnId).removeAttr("disabled");
        $("#" + btnId).children("img").remove();
    }
}

function AddLoader(btnId) {
    if (btnId != null && btnId != "") {
        $("#" + btnId).prepend('<img  src="' + ROOT + 'Content/img/ajax-loader.gif" />')
    }
}

function RemoveLoader(btnId) {
    if (btnId != null && btnId != "") {
        $("#" + btnId).children("img").remove();
    }
}