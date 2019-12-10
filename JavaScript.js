/* ------ HORTREE PLUGIN ------ */
!function (e, t, r, n) { "use strict"; function i(t) { var r = []; return r.push('<div class="hortree-branch">'), e(t).each(function () { r.push(o(this)) }), r.push("</div>"), r.join("\n") } function o(e) { l++; var t = []; return t.push('<div class="hortree-entry" data-entry-id="' + l + '">'), e.tooltip && "" !== e.tooltip.toString().trim() ? (t.push('<div class="hortree-label hortree-tooltip">'), t.push('<span class="hortree-tooltip-text">' + e.tooltip + "</span>"), t.push(e.description), t.push("</div>")) : t.push('<div class="hortree-label">' + e.description + "</div>"), e.children.length && t.push(i(e.children)), t.push("</div>"), t.join("\n") } function h() { var t = []; e(".hortree-entry").each(function () { var r = e(this).attr("data-entry-id"); t.push({ entryId: parseInt(r), entry: e(this) }) }); var r = t.slice(0); r.sort(function (e, t) { return e.entryId - t.entryId }), r.reverse(); for (var n = 0; n < r.length; n++) { var i = r[n].entry, o = i.children(".hortree-branch"); if (o.length) { var h = 0; o.each(function () { h += e(this).height() }), i.height(h) } } } function a(t) { function r(t) { for (var r = 0, n = 0; null !== t && (r += t.offsetLeft, n += t.offsetTop, t = t.offsetParent, !e(".hortree-wrapper").is(t));); return { x: r, y: n } } e(".hortree-wrapper").each(function () { var n = e(this), i = 0, o = 0; n.find(".hortree-label").each(function () { if (0 === o) { var h = e(this).offset().top; i = -1 * h + 20 } if (e(this).siblings(".hortree-branch").length) { var a = r(e(this).get(0)); e(this).siblings(".hortree-branch").children(".hortree-entry").children(".hortree-label").each(function () { var o = r(e(this).get(0)); n.line(a.x + e(this).width() - 10, a.y + i, o.x, o.y + i, { zindex: t.lineZindex, color: t.lineColor, stroke: t.lineStrokeWidth }) }) } o++ }) }) } function s() { e(".hortree-label").each(function () { var t = e(this).height(); e(this).parent(".hortree-entry").height(t) }) } var l = 0; e.fn.hortree = function (t) { t = t || {}; var r = { lineStrokeWidth: 2, lineZindex: 8, lineColor: "#4b86b7", data: [], onComplete: function () { } }, n = e.extend(r, t); if (!e.fn.line) throw new Error("You must load jquery.line.js library! Get it here: https://github.com/tbem/jquery.line"); if (!n.data) throw new Error("No data specified!"); if (!(n.data instanceof Array)) throw new Error("Data should be an array"); n.data.length || console.warn("Data is empty"); var o = []; o.push('<div class="hortree-wrapper">'), o.push(i(n.data)), o.push("</div>"), this.html(o.join("\n")), s(), h(), a(n), n.onComplete && "function" == typeof n.onComplete && n.onComplete.apply() } }(jQuery, window, document);

/* ------ LINE PLUGIN ------ */
!function (t) { var e = function (t, e, s, l, a) { var n = navigator.userAgent.indexOf("MSIE") > -1; if (s < t) { var r = t; t = s, s = r, r = e, e = l, l = r } var o = document.createElement("div"); o.className = a.class; var i = Math.sqrt((t - s) * (t - s) + (e - l) * (e - l)); if (o.style.width = i + "px", o.style.borderBottom = a.stroke + "px " + a.style, o.style.borderColor = a.color, o.style.position = "absolute", o.style.zIndex = a.zindex, n) { o.style.top = l > e ? e + "px" : l + "px", o.style.left = t + "px"; var c = (s - t) / i, f = (l - e) / i; o.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=" + c + ", M12=" + -1 * f + ", M21=" + f + ", M22=" + c + ")" } else { var d = Math.atan((l - e) / (s - t)); o.style.top = e + .5 * i * Math.sin(d) + "px", o.style.left = t - .5 * i * (1 - Math.cos(d)) + "px", o.style.transform = o.style.MozTransform = o.style.WebkitTransform = o.style.msTransform = o.style.OTransform = "rotate(" + d + "rad)" } return o }; t.fn.line = function (s, l, a, n, r, o) { return t(this).each(function () { t.isFunction(r) ? (callback = r, r = null) : callback = o, r = t.extend({}, t.fn.line.defaults, r), t(this).append(e(s, l, a, n, r)).promise().done(function () { t.isFunction(callback) && callback.call() }) }) }, t.fn.line.defaults = { zindex: 1e4, color: "#000000", stroke: "1", style: "solid", class: "line" } }(jQuery);

/* ------ CODE ------ */

let identityMap = initFIBGoogleMap();
let identityMapMarkers = [];

document.addEventListener("DOMContentLoaded", () => {
    // Handle the site selection
    handleSiteSelectorFilter();

    // Pre-selected site with the id of the site selected in the left filters :
    document.getElementById("siteSelector").value = firstOrgaId;
    $("#searchFilterButton").trigger("click");

    // Add event when user click on openCloseIcon element :
    handleOpenCloseContainer();
});

function handleSiteSelectorFilter() {
    let siteSelector = document.getElementById("siteSelector");

    // Adding all the sites in the selector :
    jsonAllOrganizations.forEach(element => {
        let option = document.createElement("option");
        option.value = element.Id;
        option.innerHTML = element.Name;
        siteSelector.appendChild(option);
    });

    // Event when the button for site selection is clicked, data must be updated :
    document.getElementById("searchFilterButton").addEventListener("click", () => {
        let selectedValue = document.getElementById("siteSelector").options[document.getElementById("siteSelector").selectedIndex].value;
        loadNewOrganization(selectedValue);
    });

    // Event when the button of reboot is clicked, input is cleared :
    document.getElementById("rebootFilterButton").addEventListener("click", () => {
        document.getElementById("siteSelector").selectedIndex = 0;
    });
}

function loadNewOrganization(siteId) {
    let selectedSite = {};

    // Finding the object of the selected site, to get all of his informations :
    for (let i = 0; i < jsonAllOrganizations.length; i += 1) {
        if (jsonAllOrganizations[i].Id == siteId) {
            selectedSite = jsonAllOrganizations[i];
            break;
        }
    }

    loadDataBatiment(selectedSite);
    loadDataContacts(selectedSite);
    loadDataPropertyTitles(selectedSite);
    loadDataCompliance(selectedSite);
    loadDataAudits(selectedSite);
    loadDataEquipments(selectedSite);
    loadDataDocuments(selectedSite);
}

function loadDataBatiment(oSite) {
    // Add all identity section attributes :

    // Name and type of building :
    Array.from(document.getElementsByClassName("batimentName")).forEach((label) => {
        label.innerHTML = oSite.Name;
    });
    document.getElementById("identityType").innerHTML = oSite.CollectionsLocalizedName;

    // Localisation of building :
    document.getElementById("identityStreetLocation1").innerHTML = oSite.AddressLine1;
    if (oSite.AddressLine2)
        document.getElementById("identityStreetLocation2").innerHTML = oSite.AddressLine2;
    if (oSite.AddressLine3)
        document.getElementById("identityStreetLocation3").innerHTML = oSite.AddressLine3;
    document.getElementById("identityPostCodeLocation").innerHTML = oSite.PostCode;
    if (oSite.PostCode)
        document.getElementById("identityPostCodeLocation").innerHTML += "&nbsp";
    document.getElementById("identityCityLocation").innerHTML = oSite.City;
    document.getElementById("identityCountryLocation").innerHTML = oSite.CountryName;

    // Main summary data of building :
    document.getElementById("identityLabel").innerHTML = (oSite.ERPTypesTypeName) ? oSite.ERPTypesTypeName : "-";
    let nbOrgaLots = 0;
    for (let i = 0; i < jsonAllLots.length; i += 1) {
        if (oSite.Id == jsonAllLots[i].OrganizationId)
            nbOrgaLots += 1;
    }
    document.getElementById("identityFloorsNumberData").innerHTML = nbOrgaLots;
    document.getElementById("identityTotalSurfaceData").innerHTML = (oSite.M2) ? oSite.M2.toLocaleString() + "m²" : "0m²";
    if (oSite.UrlBentley) {
        document.getElementById("identityLink3D").style.display = "inline-block";
        document.getElementById("identityLink3D").addEventListener("click", () => {
            let redirectWindow = window.open(oSite.UrlBentley, "_blank");
            redirectWindow.location;
        });
    } else
        document.getElementById("identityLink3D").style.display = "none";

    // Add localisation marker on Google Map :
    placeMarkerOnFIBGoogleMap(oSite);

    // Get image of site :
    $.ajax({
        url: appBaseURL + "/conf/Home/GetUrlOfFile",
        type: 'POST',            
        data: { id : oSite.ImageId },
        success: function (data) {
            $("#identityPicture").prop("src", data.Url);
        },
        error: function (xhr, txt, err) {
            swal("Error :" + txt);
        }
    });
}

function placeMarkerOnFIBGoogleMap(oSite) {
    let lat = (oSite.Lat) ? oSite.Lat : 0;
    let long = (oSite.Long) ? oSite.Long : 0;

    for (let i = 0; i < identityMapMarkers.length; i++) {
        identityMapMarkers[i].setMap(null);
    }

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        map: identityMap
    });

    identityMapMarkers.push(marker);
    identityMap.panTo(marker.position);
    identityMap.setZoom(9);
}

function loadDataContacts(oSite) {
    let contactsReferenced = document.getElementById("contactsReferenced");
    let counter = 0;
    let contactsReferencedBody = '';
    Array.from(jsonAllContacts).forEach( (item, index) => {
        if(item.OrganizationId === oSite.Id) {
            counter++;
            let separator = (counter > 0) ? '<hr class="contactSeparator"/>' : '';
            let contactFullName = (item.ContactFullName) ? item.ContactFullName : '';
            let contactInitial = (contactFullName).split(/\s/).reduce((response,word)=> response += word.slice(0,1), '');
            let contactJob = (item.ContactJob) ? item.ContactJob : '-';
            let contactMobilePro = (item.ContactMobilePro) ? item.ContactMobilePro : '-';
            let contactLandlinePro = (item.ContactLandlinePro) ? item.ContactLandlinePro : '-';
            let contactEmail = (item.ContactEmail) ? item.ContactEmail : '-';
            let contactLastConnection = (item.ContactLastConnection) ? new Date(item.ContactLastConnection).toLocaleDateString() : '-';
            let contactConnectionsCounter = (item.ContactConnectionsCounter) ? item.ContactConnectionsCounter : '-';
            contactsReferencedBody +=
            separator + '<div class="contactRow">' +
                '<div class="squareContact">' +
                    '<div class="contactInitial">' + contactInitial + '</div>' +
                '</div>' +
                '<div class="contactNameAndFunction">' +
                    '<div class="contactName">' + contactFullName + '</div>' +
                    '<div class="contactFunction">' + contactJob + '</div>' +
                '</div>' +
                '<div class="contactPhonesNumbers">' +
                    '<div><i class="fas fa-phone"></i>' + contactMobilePro + '</div>' +
                    '<div><i class="fas fa-phone"></i>' + contactLandlinePro + '</div>' +
                '</div>' +
                '<div class="contactEmail">' +
                    '<i class="fas fa-envelope"></i>' + contactEmail +
                '</div>' +
                '<div class="contactLog">' +
                    '<div>Dernière connexion le ' + contactLastConnection + '</div>' +
                    '<div>' + contactConnectionsCounter + ' connexions au total</div>' +
                '</div>' +
            '</div>';
        };
    });

    if (counter === 0)
        contactsReferencedBody = `<div style="font-weight: normal; padding-left: 50px;">Aucun contact n'est référencé</div>`;

    contactsReferenced.innerHTML = contactsReferencedBody;
    document.querySelector("#contactMainData .mainDataSubTitle").innerHTML = counter + ' contacts référencés';
}

function loadDataAudits(oSite) {
    let auditsAllData = document.getElementById("auditsAllData");

    let rowAuditsQuestionaryPending = "";
    let rowAuditsQuestionaryRevision = "";
    let counterAuditsQuestionaryPending = 0;
    let counterAuditsQuestionaryRevision = 0;
    let totalScoring = 0.00;
    let totalProgress = 0;
    Array.from(jsonAllAudits).forEach( audit => {
        if (audit.OrganizationId === oSite.Id) {
            let theme = (audit.ThemeLocalizedName) ? audit.ThemeLocalizedName : '-';
            let name = (audit.Name) ? audit.Name : '-';
            let startDate = (audit.StartDateString) ? audit.StartDateString : '-';
            let endDate = (audit.EndDateString) ? audit.EndDateString : '-';
            let scoring = (audit.Scoring) ? audit.Scoring : '-';
            let progress = (audit.QuestionsProgressionPercentage) ? audit.QuestionsProgressionPercentage + '%' : '-';

            if (audit.FormWorkflowStatusLocalizedName === "En attente") {
                if (scoring !== '-') {
                    totalScoring += parseFloat(scoring.replace(",","."));
                }
                if(progress !== '-') {
                    totalProgress += parseInt(progress);
                }
                counterAuditsQuestionaryPending++;
                rowAuditsQuestionaryPending += "<tr><td>"+ theme +"</td><td>"+ name +"</td><td>"+ startDate +"</td><td>"+ endDate +"</td><td>"+ scoring +"</td><td>"+ progress +"</td></td>";
            }
            else if (audit.FormWorkflowStatusLocalizedName === "En revision") {
                if (scoring !== '-') {
                    totalScoring += parseFloat(scoring.replace(",","."));
                }
                if(progress !== '-') {
                    totalProgress += parseInt(progress);
                }
                counterAuditsQuestionaryRevision++;
                rowAuditsQuestionaryRevision += "<tr><td>"+ theme +"</td><td>"+ name +"</td><td>"+ startDate +"</td><td>"+ endDate +"</td><td>"+ scoring +"</td><td>"+ progress +"</td></td>";
            }
        }
    });
    //Questionary Audit Tables
    auditsAllData.querySelector("#auditQuestionaryPendingTable > tbody").innerHTML = rowAuditsQuestionaryPending;
    auditsAllData.querySelector("#auditQuestionaryRevisionTable > tbody").innerHTML = rowAuditsQuestionaryRevision;
    auditsAllData.querySelector("#nbQuestionaryAuditsPending").innerHTML = counterAuditsQuestionaryPending;
    auditsAllData.querySelector("#nbQuestionaryAuditsRevision").innerHTML = counterAuditsQuestionaryRevision;
    //Audit SubTitle
    if (counterAuditsQuestionaryPending + counterAuditsQuestionaryRevision !== 0)
        document.querySelector("#auditMainData .mainDataSubTitle").innerHTML = (totalScoring/(counterAuditsQuestionaryPending + counterAuditsQuestionaryRevision)).toFixed(2) +' de scoring moyen &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp;'+ Math.round(totalProgress/(counterAuditsQuestionaryPending + counterAuditsQuestionaryRevision)) +'% de progres moyen';
    else
        document.querySelector("#auditMainData .mainDataSubTitle").innerHTML = '0.00 de scoring moyen &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp; 0% de progrès moyen';

    let rowAuditsActionToDo = "";
    let rowAuditsActionActual = "";
    let rowAuditsActionRealised = "";
    let counterAuditsActionsToDo = 0;
    let counterAuditsActionsActual = 0;
    let counterAuditsActionsRealised = 0;
    Array.from(jsonAllAuditsActions).forEach( action => {
        if (action.OrganizationId === oSite.Id) {
            let audit = (action.QuestionaryName) ? action.QuestionaryName : '-';
            let section = (action.SectionLocalizedName) ? action.SectionLocalizedName : '-';
            let question = (action.FormQuestionLocalizedLabel) ? action.FormQuestionLocalizedLabel : '-';
            let actionName = (action.Name) ? action.Name : '-';
            let priority = (action.PriorityName) ? action.PriorityName : '-';
            let endDate = (action.EndTimeString) ? action.EndTimeString : '-';
            let responsible = (action.ResponsibleFullName) ? action.ResponsibleFullName : '-';
            if (action.StatusLocalizedName === "A faire") {
                counterAuditsActionsToDo++;
                rowAuditsActionToDo += "<tr><td>"+ audit + "</td><td>"+ section +"</td><td>"+ question +"</td><td>"+ actionName +"</td><td>"+ priority +"</td><td>"+ endDate +"</td><td>"+ responsible +"</td></tr>";
            }
            else if (action.StatusLocalizedName === "En cours") {
                counterAuditsActionsActual++;
                rowAuditsActionActual += "<tr><td>"+ audit + "</td><td>"+ section +"</td><td>"+ question +"</td><td>"+ actionName +"</td><td>"+ priority +"</td><td>"+ endDate +"</td><td>"+ responsible +"</td></tr>";
            }
            else if(action.StatusLocalizedName === "Réalisée" || action.StatusLocalizedName === "R&#233;alis&#233;e") {
                counterAuditsActionsRealised++;
                rowAuditsActionRealised += "<tr><td>"+ audit + "</td><td>"+ section +"</td><td>"+ question +"</td><td>"+ actionName +"</td><td>"+ priority +"</td><td>"+ endDate +"</td><td>"+ responsible +"</td></tr>";
            }
        }
    });
    //Action Audit Tables
    auditsAllData.querySelector("#auditActionToDoTable > tbody").innerHTML = rowAuditsActionToDo;
    auditsAllData.querySelector("#auditActionActualTable > tbody").innerHTML = rowAuditsActionActual;
    auditsAllData.querySelector("#auditActionRealisedTable > tbody").innerHTML = rowAuditsActionRealised;
    auditsAllData.querySelector("#nbActionAuditsToDo").innerHTML = counterAuditsActionsToDo;
    auditsAllData.querySelector("#nbActionAuditsActual").innerHTML = counterAuditsActionsActual;
    auditsAllData.querySelector("#nbActionAuditsRealised").innerHTML = counterAuditsActionsRealised;

    let rowAuditNCToUp = "";
    let rowAuditActualNC = "";
    let rowAuditUpedNC = "";
    let counterAuditsNCToUp = 0;
    let counterAuditsNCActual = 0;
    let counterAuditsNCUped = 0;
    Array.from(jsonAllAuditsNC).forEach( NC => {
        if (NC.OrganizationId === oSite.Id) {
            let theme = (NC.ThemeLocalizedName) ? NC.ThemeLocalizedName : '-';
            let audit = (NC.QuestionaryName) ? NC.QuestionaryName : '-';
            let question = (NC.FormQuestionLocalizedLabel) ? NC.FormQuestionLocalizedLabel : '-';
            let details = (NC.ReserveText) ? NC.ReserveText : '-';
            let criticity = (NC.CritLevelLocalizedName) ? NC.CritLevelLocalizedName : '-';
            let toUpBefore = (NC.ExpectedDateString) ? NC.ExpectedDateString : '-';
            let responsible = (NC.ResponsibleFullName) ? NC.ResponsibleFullName : '-';

            if (NC.StatusOfReserveLocalizedName === "A lever") {
                counterAuditsNCToUp++;
                rowAuditNCToUp += "<tr><td>"+ theme +"</td><td>"+ audit +"</td><td>"+ question + "</td><td>"+ details +"</td><td>"+ criticity +"</td><td>"+ toUpBefore +"</td><td>"+ responsible +"</td></tr>";
            }
            else if (NC.StatusOfReserveLocalizedName === "En cours") {
                counterAuditsNCActual++;
                rowAuditActualNC += "<tr><td>"+ theme +"</td><td>"+ audit +"</td><td>"+ question + "</td><td>"+ details +"</td><td>"+ criticity +"</td><td>"+ toUpBefore +"</td><td>"+ responsible +"</td></tr>";
            }
            else if (NC.StatusOfReserveLocalizedName === "Levée" || NC.StatusOfReserveLocalizedName === "Lev&#233;e") {
                counterAuditsNCUped++;
                let uppedDate = (NC.ValidationDateString) ? NC.ValidationDateString : '-';
                rowAuditUpedNC += "<tr><td>"+ theme +"</td><td>"+ audit +"</td><td>"+ question + "</td><td>"+ details +"</td><td>"+ criticity +"</td><td>"+ uppedDate +"</td><td>"+ responsible +"</td></tr>";
            }
        }
    });
    //NC Audit Tables
    auditsAllData.querySelector("#auditNCToUpTable > tbody").innerHTML = rowAuditNCToUp;
    auditsAllData.querySelector("#auditNCActual > tbody").innerHTML = rowAuditActualNC;
    auditsAllData.querySelector("#auditNCUped > tbody").innerHTML = rowAuditUpedNC;
    auditsAllData.querySelector("#nbNCAuditsToUp").innerHTML = counterAuditsNCToUp;
    auditsAllData.querySelector("#nbNCAuditsActual").innerHTML = counterAuditsNCActual;
    auditsAllData.querySelector("#nbNCAuditsUped").innerHTML = counterAuditsNCUped;
}

function loadDataEquipments(oSite) {
    let equipmentsAllData = document.getElementById("equipmentsAllData");

    //Data on subTitle
    let counterFollowingPourcent = 0;
    let nbVisitedEquipment = 0;

    //Data on tab title
    let counterEquipment = 0;
    let counterTotalNcToLate = 0;
    let counterTotalActionToDo = 0;

    //Row forEach table (for each tab)
    let rowFirstTable = "";
    let rowSecondTable = "";
    let rowThirdTable = "";

    Array.from(jsonAllEquipments).forEach( equipment => {
        if (equipment.OrganizationId == oSite.Id) {
            counterEquipment++;

            //First Table
            let counterNcToUp = 0;
            let counterActualAction = 0;
            let visitDateString = "-";
            let visiteDateEN = new Date();
            
            Array.from(jsonAllEquipmentsNC).forEach( NC => {
                if (NC.OrganizationId == oSite.Id && NC.EquipmentsId == equipment.Id) {
                    if (NC.StatusOfReserveLocalizedName == "A lever") {
                        counterNcToUp++;
                    }
                    if (NC.VisitDateString !== "" && NC.visitDateString !== null && visiteDateEN <= new Date(NC.VisitDate)) {
                        visitDateString = NC.VisitDateString;
                        visiteDateEN = new Date(NC.VisitDate);
                    }
                    if (NC.IsLate) {
                        counterTotalNcToLate++;
                    }

                    rowSecondTable += "<tr><td>"+ equipment.Name +"</td><td>"+ NC.VisitObligation +"</td><td>"+ NC.UserProviderForReserveFullName +"</td><td>"+ NC.Location +"</td><td>"+ NC.RedundantString +"</td><td>"+ NC.ReserveText +"</td><td>"+ NC.CritLevelLocalizedName +"</td><td>"+ NC.ExpectedDateString +"</td><td>"+ NC.StatusOfReserveLocalizedName +"</td></tr>";
                }
            });

            Array.from(jsonAllEquipmentsActions).forEach( action => {
                if (action.OrganizationId == oSite.Id && action.EquipmentId == equipment.Id) {
                    if (action.StatusLocalizedName == "En cours") {
                        counterActualAction++;
                    }
                    if (action.StatusLocalizedName == "A faire") {
                        counterTotalActionToDo++;
                        rowThirdTable += "<tr><td>"+ equipment.Name +"</td><td>"+ action.Name +"</td><td>"+ action.BeginTimeString +"</td><td>"+ action.EndTimeString +"</td><td>"+ action.ResponsibleFullName +"</td><td>"+ action.PriorityName +"</td><td>"+ action.StatusLocalizedName +"</td></tr>";
                    }
                }
            });

            let endOfGuarantee = (equipment.EndOfGuarantee) ? new Date(equipment.EndOfGuarantee) : new Date();
            let monthBeforeEnd = monthDiff(new Date(), endOfGuarantee);
            let nextVisiteDate = monthDiff(new Date(), visiteDateEN);
            rowFirstTable += "<tr data-endOfGuarantee='"+ monthBeforeEnd +"' data-nextVisiteDate='"+ nextVisiteDate +"'><td>"+ equipment.ThemeLocalizedName +"</td><td>"+ equipment.Reference +"</td><td>"+ equipment.QRCode +"</td><td>"+ equipment.Brand +"</td><td>"+ equipment.EndOfGuaranteeString +"</td><td>"+ counterNcToUp +"</td><td>"+ visitDateString +"</td><td>"+ counterActualAction +"</td></tr>";

            let isVisitedEquipment = false;
            for (var i=0; i<jsonAllEquipmentsVisit.length; i++) {
                if (jsonAllEquipmentsVisit[i].OrganizationId == oSite.Id) {
                    let aVisitId = jsonAllEquipmentsVisit[i].EquipmentsId.split(',');
                    if (aVisitId.includes(equipment.Id)) {
                        isVisitedEquipment = true;
                        break;
                    }
                }
            };

            if (isVisitedEquipment) {
                nbVisitedEquipment++;
            }
        };
    });

	if (counterEquipment > 0) {
		counterFollowingPourcent = Math.round(nbVisitedEquipment * 100 / counterEquipment);
	}

    
    //First Table
    equipmentsAllData.querySelector("#equipmentFirstTable > tbody").innerHTML = rowFirstTable;
    //Second Table
    equipmentsAllData.querySelector("#equipmentSecondTable > tbody").innerHTML = rowSecondTable;
    //Third Table
    equipmentsAllData.querySelector("#equipmentThirdTable > tbody").innerHTML = rowThirdTable;

    //First tab
    equipmentsAllData.querySelector("#nbEquipments").innerHTML = counterEquipment;
    //SecondTab
    equipmentsAllData.querySelector("#nbNcToLate").innerHTML = counterTotalNcToLate;
    //Third Tab
    equipmentsAllData.querySelector("#nbActionToDo").innerHTML = counterTotalActionToDo;

    //SubTitle
    document.querySelector("#equipmentsMainData .mainDataSubTitle").innerHTML = counterFollowingPourcent + '% suivi';
}

function filterDataEquipments() {
    let garantieSelector = document.getElementById("garantieSelector");
    let visiteSelector = document.getElementById("visiteSelector");

    let selectedGarantieValue = parseInt(garantieSelector.options[garantieSelector.selectedIndex].value);
    let selectedVisiteValue = parseInt(visiteSelector.options[visiteSelector.selectedIndex].value);

    let allRow = document.querySelectorAll("#equipmentFirstTable > tbody tr");

    allRow.forEach( row => {
        let endOfGarantie = parseInt(row.getAttribute("data-endOfGuarantee"));
        let visiteDate = parseInt(row.getAttribute("data-nextVisiteDate"));

        if(selectedGarantieValue <= endOfGarantie && selectedVisiteValue <= visiteDate) {
            row.style.display = "table-row";
        } else {
            row.style.display = "none";
        }
    });
}

function monthDiff(d1, d2) {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

function loadDataDocuments(oSite) {
    let documentsAllData = document.getElementById("documentsAllData");

    let counterRequiredDocumentsAvailable = 0;
    let counterRenewableDocumens = 0;
    let counterDocumentToValidate = 0;

    let rowFirstTable = "";
    let rowSecondTable = "";
    let rowThirdTable = "";
    Array.from(jsonAllDocuments).forEach( document => {
        if (document.OrganizationId == oSite.Id) {
            counterRequiredDocumentsAvailable++;
            let createdDate = (document.CreatedDateString) ? document.CreatedDateString : "-";
            let updateOn = (document.ModifiedDateString) ? document.ModifiedDateString : createdDate;
            let owner = (document.AuditorOwnerFullName) ? document.AuditorOwnerFullName : "-";
            let name = (document.Name) ? document.Name : "-";
            let theme = (document.ThemeLocalizedName) ? document.ThemeLocalizedName : "-";
            let version = (document.Version) ? document.Version : "-";
            let expirationDate = (document.ExpirationDateString) ? new Date(document.ExpirationDateString) : new Date();

            if (expirationDate < new Date()) {
                counterRenewableDocumens++;
                rowSecondTable += "<tr><td>"+ theme +"</td><td>"+ name +"</td><td>"+ owner +"</td><td>"+ updateOn +"</td><td>"+ version +"</td></tr>";
            }
            if (document.FormWorkflowStatusLocalizedName === "Brouillon") {
                counterDocumentToValidate++;
                rowThirdTable += "<tr><td>"+ theme +"</td><td>"+ name +"</td><td>"+ owner +"</td><td>"+ updateOn +"</td><td>"+ version +"</td></tr>";
            }
            rowFirstTable += "<tr><td>"+ theme +"</td><td>"+ name +"</td><td>"+ owner +"</td><td>"+ updateOn +"</td><td>"+ version +"</td></tr>";
        }
    });

    let rowAttachmentTable = "";
    var moduleFilter = document.getElementById("moduleSelector");
    moduleFilter.options.length = 1;
    Array.from(jsonAllAttachedDocuments).forEach( attachment => {
        if(attachment.OrganizationId == oSite.Id) {
            let entity = (attachment.EntityName) ? attachment.EntityName : "-";
            let name = (attachment.Name) ? attachment.Name : "-";
            let description = (attachment.Description) ? attachment.Description : "-";
            let createdBy = (attachment.CreatedUserFullName) ? attachment.CreatedUserFullName : "-";

            //Add module into selector filter
            if(moduleFilter.querySelectorAll("option[value='"+ entity +"'").length === 0) {
                var option = document.createElement("option");
                option.text = decodeHtml(entity);
                option.value =  decodeHtml(entity);
                moduleFilter.add(option);
            }

            let createdSince = (attachment.CreatedDate) ? new Date(attachment.CreatedDate) : new Date();
            let monthSinceCreation = monthDiff(createdSince, new Date());
            rowAttachmentTable += "<tr data-entity='"+ entity +"' data-createdSince='"+ monthSinceCreation +"'><td>"+ entity +"</td><td>"+ name +"</td><td>"+ description +"</td><td>"+ createdBy +"</td></tr>";
        }
    });

    //First Table
    documentsAllData.querySelector("#documentFirstTable > tbody").innerHTML = rowFirstTable;

    //Second Table
    documentsAllData.querySelector("#documentSecondTable > tbody").innerHTML = rowSecondTable;

    //Third Table
    documentsAllData.querySelector("#documentThirdTable > tbody").innerHTML = rowThirdTable;

    //Attachment Table
    documentsAllData.querySelector("#attachedDocumentsTable > tbody").innerHTML = rowAttachmentTable;

    //First Tab
    documentsAllData.querySelector("#nbDocuments").innerHTML = counterRequiredDocumentsAvailable;
    //Second Tab
    documentsAllData.querySelector("#nbToRenew").innerHTML = counterRenewableDocumens;
    //Third Tab
    documentsAllData.querySelector("#nbToValidate").innerHTML = counterDocumentToValidate;

    //SubTitle
    document.querySelector("#documentsMainData .mainDataSubTitle").innerHTML = '';

}

function filterDataAttachedDocuments() {
    let moduleSelector = document.getElementById("moduleSelector");
    let createdSinceSelector = document.getElementById("createdSinceSelector");

    let selectedModuleValue = moduleSelector.options[moduleSelector.selectedIndex].value;
    let selectedCreatedSinceValue = parseInt(createdSinceSelector.options[createdSinceSelector.selectedIndex].value);

    let allRow = document.querySelectorAll("#attachedDocumentsTable > tbody tr");

    allRow.forEach( row => {
        let entity = row.getAttribute("data-entity");
        let createdSince = parseInt(row.getAttribute("data-createdSince"));

        if((selectedModuleValue == entity || selectedModuleValue === "all") && selectedCreatedSinceValue <= createdSince) {
            row.style.display = "table-row";
        } else {
            row.style.display = "none";
        }
    });
}

function loadDataPropertyTitles(oSite) {
    // LEGAL SUB-SECTION 1:
    let propertyTitles_owners = [];
    let leases = [];
    let subLeases = [];
    let indexId = 1;

    let nbPropertyTitles = 0;
    let nbInternalLeases = 0;
    let nbExternalLeases = 0;
    let nbSubLeases = 0;
    
    document.getElementById("legalHorTreeContainers").innerHTML = "";
    // Titres de propriété (type Interne)
    for (let i = 0; i < jsonAllPropertyTitles.length; i += 1) {
        if (oSite.Id == jsonAllPropertyTitles[i].OrganizationId) {
            for (let j = 0; j < jsonAllBaux.length; j += 1) {
                if (jsonAllBaux[j].PropertyTitleId == jsonAllPropertyTitles[i].Id && jsonAllBaux[j].OrganizationId == oSite.Id) {
                    for (let k = 0; k < jsonAllBaux.length; k += 1) {
                        if (jsonAllBaux[k].BailParentId == jsonAllBaux[j].Id && jsonAllBaux[k].OrganizationId == oSite.Id) {
                            subLeases.push({
                                description: jsonAllBaux[k].Reference,
                                children: []
                            });
                            nbSubLeases += 1;
                        }
                    }

                    leases.push({
                        description: jsonAllBaux[j].Reference,
                        children: subLeases
                    });
                    nbInternalLeases += 1;
                }
                subLeases = [];
            }

            // L'ID commence par 'P' pour les Property Titles
            propertyTitles_owners.push({
                horTreeId: "#P_legalHorTree" + indexId,
                horTreeData: [
                    {
                        description: jsonAllPropertyTitles[i].Reference,
                        children: leases
                    }
                ]
            });
            // Les data attributes serviront pour le tooltip :
            let surface = (jsonAllPropertyTitles[i].Surface) ? Math.round(jsonAllPropertyTitles[i].Surface.replace(",", ".")).toLocaleString() : "-";
            let cost = (jsonAllPropertyTitles[i].AcquisitionCost) ? Math.round(jsonAllPropertyTitles[i].AcquisitionCost.replace(",", ".")).toLocaleString() : "-";
            let date = (jsonAllPropertyTitles[i].AcquisitionDate) ? new Date(jsonAllPropertyTitles[i].AcquisitionDate).toLocaleDateString() : "-";
            
            document.getElementById("legalHorTreeContainers").innerHTML += "<div class='legalHorTreeContainer' id='P_legalHorTree" +
            indexId + "' data-surface='" + surface + " m²' data-cost='" + cost + " €' data-date='" + date + "'></div>";

            indexId += 1;
            nbPropertyTitles += 1
        }
    }

    leases = [];
    subLeases = [];

    // Propriétaires (type Externe)
    for (let i = 0; i < jsonAllOwners.length; i += 1) {
        if (oSite.Id == jsonAllOwners[i].OrganizationsId) {
            for (let j = 0; j < jsonAllBaux.length; j += 1) {
                if (jsonAllBaux[j].OwnerId == jsonAllOwners[i].Id && jsonAllBaux[j].OrganizationId == oSite.Id) {
                    for (let k = 0; k < jsonAllBaux.length; k += 1) {
                        if (jsonAllBaux[k].BailParentId == jsonAllBaux[j].Id && jsonAllBaux[k].OrganizationId == oSite.Id) {
                            subLeases.push({
                                description: jsonAllBaux[k].Reference,
                                children: []
                            });
                            nbSubLeases += 1;
                        }
                    }

                    leases.push({
                        description: jsonAllBaux[j].Reference,
                        children: subLeases
                    });
                    nbExternalLeases += 1;
                }
                subLeases = [];
            }

            // L'ID commence par 'O' pour les Owners
            propertyTitles_owners.push({
                horTreeId: "#O_legalHorTree" + indexId,
                horTreeData: [
                    {
                        description: jsonAllOwners[i].Denomination,
                        children: leases
                    }
                ]
            });
            document.getElementById("legalHorTreeContainers").innerHTML += "<div class='legalHorTreeContainer' id='O_legalHorTree" + indexId + "'></div>";
            indexId += 1;
        }
    }

    document.getElementById("legalNbPropTitles").innerHTML = (nbPropertyTitles > 1) ? nbPropertyTitles + " titres de propriété" : nbPropertyTitles + " titre de propriété";
    document.getElementById("legalNbInternalLeases").innerHTML = (nbInternalLeases > 1) ? nbInternalLeases + " baux internes" : nbInternalLeases + " bail interne";
    document.getElementById("legalNbExternalLeases").innerHTML = (nbExternalLeases > 1) ? nbExternalLeases + " baux externes" : nbExternalLeases + " bail externe";
    document.getElementById("legalNbSubLeases").innerHTML = (nbSubLeases > 1) ? nbSubLeases + " sous-baux" : nbSubLeases + " sous-bail";

    // Si il n'y avait aucun titre de propriété pour ce site :
    if (indexId === 1)
        document.getElementById("legalHorTreeContainers").innerHTML = "<div class='simpleText' style='margin-top:18px;text-align:center;'>Aucune titre de propriété n'est référencé</div>"

    // Horizontal tree creation in Legal Section :
    createLegalHortree(propertyTitles_owners);
    loadDataOccupation(oSite);
}

function createLegalHortree(arrayHorTreeObjects) {
    // Creation of the HorTrees
    arrayHorTreeObjects.forEach((object) => {
        $(object.horTreeId).hortree({
            data: object.horTreeData
        });
    });

    let horTreeContainers = document.getElementsByClassName("legalHorTreeContainer");

    // Text format of the labels
    Array.from(document.getElementsByClassName("hortree-label")).forEach((label) => {
        label.classList.add("simpleText");
    });
    
    // // Managing background color of the labels (depending of their section) :
    let offsetFirstLine = 0;
    Array.from(horTreeContainers).forEach((container) => {
        container.querySelectorAll(".hortree-branch").forEach((branch, branchIndex) => {
            if (branchIndex === 0) {
                branch.querySelectorAll(".hortree-entry > .hortree-label").forEach((label, labelIndex) => {
                    // Tooltip with data for the Property Titles :
                    if (container.id[0] == "P" && labelIndex === 0) {
                        $(label).tooltip({
                            html: true,
                            title: "<div class='simpleText'>" +
                                "Surface totale Propriétaire : <strong>" + container.dataset.surface + "</strong><br />" +
                                "Montant d'acquisition : <strong>" + container.dataset.cost + "</strong><br />" +
                                "Date d'acquisition : <strong>" + container.dataset.date + "</strong></div>",
                            boundary: 'viewport',
                            container: "body"
                        })
                        label.style.backgroundColor = "#7BD679";
                    } else if (container.id[0] == "O")
                        label.style.backgroundColor = "#79D6CB";
                })
            } else if (branchIndex === 1) {
                branch.querySelectorAll(".hortree-entry > .hortree-label").forEach((label, labelIndex) => {
                    if (labelIndex === 0 && offsetFirstLine === 0) {
                        // The offset of the lines of the container = the offset of the first lease :
                        offsetFirstLine = label.getBoundingClientRect().top - 2;
                        Array.from(container.getElementsByClassName("line")).forEach((line) => {
                            line.style.marginTop = offsetFirstLine;
                        });
                    }
                    label.style.backgroundColor = "#76BA74";
                })
            } else if (branchIndex > 1) {
                branch.querySelectorAll(".hortree-entry > .hortree-label").forEach((label) => {
                    label.style.backgroundColor = "#548852";
                })
            }
        });
    });
    
    // The marginTop of the lines of the new HorTree == marginTop of lines of previous HorTree +
    // height of previous HorTree + marginTop of previous HorTree
    Array.from(horTreeContainers).forEach((container, index) => {
        if (index < horTreeContainers.length - 1) {
            // Check to have the good offset :
            let offsetContainer = container.getBoundingClientRect().top - 2;
            let horTreeLineMarginTop = (offsetContainer < offsetFirstLine) ? offsetContainer : offsetFirstLine;
            let horTreeHeight = parseInt(getComputedStyle(container).height);
            let horTreeMarginTop = parseInt(getComputedStyle(container).marginTop);
            let nextHorTreeLineMarginTop = horTreeLineMarginTop + horTreeHeight + horTreeMarginTop;

            Array.from(document.querySelectorAll("#" + horTreeContainers[index + 1].id + " .line")).forEach((line) => {
                line.style.marginTop = nextHorTreeLineMarginTop.toString() + "px";
            });
        }
    });
}

function loadDataOccupation(oSite) {
    // LEGAL SUB-SECTION 2 :
    // Get all surfaces objects :
    let allSurfacesIds = [];
    let allSurfaces = [];

    for (let i = 0; i < jsonAllOccupations.length; i += 1) {
        if (jsonAllOccupations[i].OrganizationId == oSite.Id) {
            allSurfacesIds = allSurfacesIds.concat(jsonAllOccupations[i].SurfacesId.split(","));
        }
    }
    for (let j = 0; j < jsonAllSurfaces.length; j += 1) {
        if (allSurfacesIds.includes(jsonAllSurfaces[j].Id))
            allSurfaces.push(jsonAllSurfaces[j])
    }
    
    // Get data from the surfaces for the gauges :
    let maxCapacity = 0;
    let occupiedWorkstation = 0;
    let nbInternalOccupations = 0;
    let nbExternalOccupations = 0;
    let allSurfaceTypes = [];

    for (let k = 0; k < allSurfaces.length; k += 1) {
        maxCapacity += allSurfaces[k].MaxCapacity;
        occupiedWorkstation += allSurfaces[k].OccupiedWorkstationsNb;
        if (allSurfaces[k].Type == 0)
            nbInternalOccupations += 1;
        else if (allSurfaces[k].Type == 1)
            nbExternalOccupations += 1;
        allSurfaceTypes.push(allSurfaces[k].AreaTypologyLocalizedName);
    }

    // Occupation gauge :
    let percentageOccupation = maxCapacity > 0 ? Math.round(occupiedWorkstation / maxCapacity * 100) : 0;

    displayGauge("legalOccupationGauge", [{
        y: percentageOccupation,
        color: this.y < 50 ? "#FF0000" : this.y < 75 ? "#FFA500" : "#7BD679",
        radius: 100,
        innerRadius: 94,
        labela: percentageOccupation + "%",
        labelb: "d'occupation"
    }]);

    // Repatition gauge :
    let percentageInternalLease = (nbInternalOccupations + nbExternalOccupations) > 0 ? Math.round(nbInternalOccupations / (nbInternalOccupations + nbExternalOccupations) * 100) : 0;
    let percentageExternalLease = (nbInternalOccupations + nbExternalOccupations) > 0 ? Math.round(nbExternalOccupations / (nbInternalOccupations + nbExternalOccupations) * 100) : 0;

    document.getElementById("legalInternalData").innerHTML = percentageInternalLease;
    document.getElementById("legalExternalData").innerHTML = percentageExternalLease;
    displayGauge("legalRepartitionGauge", [{
        y: percentageInternalLease > 0 || percentageExternalLease > 0 ? 100 : 0,
        color: "#7BD679",
        radius: 100,
        innerRadius: 94,
        labela: "",
        labelb: "Répartition<br />d'occupation"
    }, {
        y: percentageExternalLease,
        color: "#7984D6",
        radius: 100,
        innerRadius: 94,
        labela: "",
        labelb: "Répartition<br />d'occupation"
    }]);

    // Surface type gauge :
    let surfaceGaugeData = [];
    let squareColors = ["#FC5858", "#7AD18E", "#FFAE6C", "#7AC7D1", "#887AD1", "#D17AB3", "#7AAED1", "#FFDA6C", "#333333"];

    // Nb of occurence by surface type :
    let occurencesSurfaceTypes = {};
    for (let i = 0; i < allSurfaceTypes.length; i++)
        occurencesSurfaceTypes[allSurfaceTypes[i]] = typeof occurencesSurfaceTypes[allSurfaceTypes[i]] == "undefined" ? 1 : occurencesSurfaceTypes[allSurfaceTypes[i]] + 1;
    
    document.getElementById("legalSurfaceData").innerHTML = "";
    // If there's no data :
    if (Object.keys(occurencesSurfaceTypes).length === 0) {
        document.getElementById("legalSurfaceData").innerHTML += "<div class='simpleText'>Aucune donnée disponible</div>"
    }

    // Construction of gauge :
    let totalPercentage = 0.0;
    Object.keys(occurencesSurfaceTypes).forEach((nbOccurences, index) => {
        let percentageSurfaceType = Math.round(occurencesSurfaceTypes[nbOccurences] / allSurfaceTypes.length * 100);

        document.getElementById("legalSurfaceData").innerHTML += "<div class='simpleText'><div class='legalGaugeSquare' style='background-color:" + squareColors[index] + "'></div>" +
        nbOccurences + " -&nbsp" + percentageSurfaceType + "%</div>";
        
        surfaceGaugeData.push({
            y: 100 - totalPercentage,
            color: squareColors[index],
            radius: 100,
            innerRadius: 94,
            labela: "",
            labelb: "Occupation par<br />type de surface"
        });
        totalPercentage += percentageSurfaceType;
    });

    displayGauge("legalSurfaceTypeGauge", surfaceGaugeData);

    // Gauge text style :
    Array.from(document.getElementsByClassName("gaugeDataText")).forEach((text) => {
        if (text.innerHTML)
            text.style.margin = 0;
    });

    // Fill occupation table :
    let minYear = new Date().getFullYear();
    allSurfaces.forEach((surface) => {
        if (surface.OccupationYear < minYear)
            minYear = surface.OccupationYear;
    });

    // Fill filters :
    let yearSelector = document.getElementById("legalYearSelector");
    yearSelector.options.length = 0;
    yearSelector.classList.add("simpleText");
    for (let year = new Date().getFullYear(); year >= minYear; year -= 1) {
        let newYearOption = document.createElement("option");
        newYearOption.innerHTML = "Année : " + year;
        newYearOption.value = year;
        yearSelector.add(newYearOption);
    }

    $("#legalYearSelector").change(function () {
        let filteredSurfaces = [];

        allSurfaces.forEach((surface) => {
            if (surface.OccupationYear == yearSelector.value)
                filteredSurfaces.push(surface);
        });
        
        let legalTable = "";
        filteredSurfaces.forEach((surface) => {
            legalTable += "<tr>";

            legalTable += surface.Type == 0 ? "<td>Interne</td>" : surface.Type == 1 ? "<td>Externe</td>" : "<td>-</td>";
            legalTable += (surface.RenterName) ? "<td>" + surface.RenterName + "</td>" : "<td>-</td>";
            legalTable += (surface.LegalAxeName) ? "<td>" + surface.LegalAxeName + "</td>" : "<td>-</td>";
            legalTable += (surface.AreaTypologyLocalizedName) ? "<td>" + surface.AreaTypologyLocalizedName + "</td>" : "<td>-</td>";
            legalTable += (surface.FloorLocalizedName) ? "<td>" + surface.FloorLocalizedName + "</td>" : "<td>-</td>";
            legalTable += (surface.NetArea) ? "<td>" + Math.round(parseInt(surface.NetArea)).toLocaleString() + "</td>" : "<td>-</td>";
            legalTable += (surface.Headcount) ? "<td>" + surface.Headcount.toLocaleString() + "</td>" : "<td>-</td>";
            legalTable += (surface.MaxCapacity) ? "<td>" + surface.MaxCapacity.toLocaleString() + "</td>" : "<td>-</td>";
            legalTable += (surface.OccupiedWorkstationsNb) ? "<td>" + surface.OccupiedWorkstationsNb.toLocaleString() + "</td>" : "<td>-</td>";
            legalTable += (surface.InstalledDesksNb) ? "<td>" + surface.InstalledDesksNb.toLocaleString() + "</td>" : "<td>-</td>";

            legalTable += "</tr>";
        });
        document.querySelector("#legalTable > tbody").innerHTML = legalTable;
    });
    $("#legalYearSelector").trigger("change");

    let occupationChartData = [];
    // Removing duplicates from allSurfaceTypes array :
    allSurfaceTypes.filter((item, index) => allSurfaceTypes.indexOf(item) === index).forEach((surfaceType) => {
        let occupationBySurfaceTypeByYear = [];

        allSurfaces.forEach((surface) => {
            if (surface.AreaTypologyLocalizedName == surfaceType) {
                occupationBySurfaceTypeByYear[surface.OccupationYear - minYear] = (occupationBySurfaceTypeByYear[surface.OccupationYear - minYear]) ?
                occupationBySurfaceTypeByYear[surface.OccupationYear - minYear] + surface.OccupiedWorkstationsNb : surface.OccupiedWorkstationsNb;
            }
        });
        occupationChartData.push({
            name: decodeHtml(surfaceType),
            data: occupationBySurfaceTypeByYear
        });
    });
    (occupationChartData.length) ? displayChart("legalOccupationChart", occupationChartData, minYear) :
    document.getElementById("legalOccupationChart").innerHTML = "<div class='simpleText' style='width:100%;margin-left:90px;'>Aucune donnéee disponible</div>";
}

function decodeHtml(htmlText) {
    let txt = document.createElement("textarea");

    txt.innerHTML = htmlText;
    return txt.value;
}

function displayGauge(divId, dataArray) {
    Highcharts.chart(divId, {
        chart: {
            type: "solidgauge",
        },
        title: {
            text: ""
        },
        credits: {
            enabled: false
        },
        pane: {
            name: "",
            startAngle: 0,
            endAngle: 360,
            background: [{
                outerRadius: "100%",
                innerRadius: "98%",
            }]
        },
        tooltip: {
            enabled: false
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: [],
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    enabled: true,
                    borderWidth: 0,
                    align: "center",
                    x: 0,
                    y: 0
                },
                linecap: "round",
                stickyTracking: false,
                rounded: true
            }
        },
        series: [{
            name: "",
            data: dataArray,
            dataLabels: {
                useHTML: true,
                format:
                  	"<div class='gaugeTextDisplay'>" +
                  		"<p class='gaugeDataText'>{point.labela}</p>" +
                  		"<p>{point.labelb}</p>" +
                  	"</div>"
            },
        }]
    });
}

function displayChart(divId, dataArray, minYear) {
    Highcharts.chart(divId, {
        title: {
            text: ""
        },
    
        yAxis: {
            title: ""
        },

        xAxis: {
            allowDecimals: false
        },
        
        legend: {
            layout: "horizontal",
            verticalAlign: "bottom"
        },
    
        plotOptions: {
            series: {
                pointStart: minYear,
                marker: {
                    enabled: false
                }
            }
        },
        
        exporting: {
                enabled: false
        },

        credits: {
            enabled: false
        },

        series: dataArray
    });
}

function loadDataCompliance(oSite) {
    let nbActiveObligations = 0;
    let nbObligations = 0;
    let nbFollowedObligations = 0;
    let nbLateVisits = 0;
    let nbNonCompliancesToDo = 0;
    let nbCriticalNonCompliancesToDo = 0;
    let nbNonCompliancesLate = 0;
    let nbActionsToDo = 0;

    // OBLIGATIONS ACtIVES :
    let tableActiveObligations = "";

    for (let i = 0; i < jsonObligations.length; i += 1) {
        if (jsonObligations[i].OrganizationId == oSite.Id) {
            nbObligations += 1;
            if (jsonObligations[i].CountVisit > 0)
                nbFollowedObligations += 1;
            if (jsonObligations[i].Active = "Yes") {
                nbActiveObligations += 1;

                tableActiveObligations += "<tr>";
                tableActiveObligations += (jsonObligations[i].ThemeLocalizedName) ? "<td>" + jsonObligations[i].ThemeLocalizedName + "</td>" : "<td>-</td>";
                tableActiveObligations += (jsonObligations[i].Obligation) ? "<td>" + jsonObligations[i].Obligation + "</td>" : "<td>-</td>";
                tableActiveObligations += (jsonObligations[i].UserProviderForVisitFullName) ? "<td>" + jsonObligations[i].UserProviderForVisitFullName + "</td>" : "<td>-</td>";
                tableActiveObligations += (jsonObligations[i].UserProviderForReserveFullName) ? "<td>" + jsonObligations[i].UserProviderForReserveFullName + "</td>" : "<td>-</td>";
                tableActiveObligations += (jsonObligations[i].PeriodicityLocalizedName) ? "<td>" + jsonObligations[i].PeriodicityLocalizedName + "</td>" : "<td>-</td>";
                tableActiveObligations += (jsonObligations[i].GravityLocalizedName) ? "<td>" + jsonObligations[i].GravityLocalizedName + "</td>" : "<td>-</td>";
                tableActiveObligations += "</tr>";
            }
        }
    }
    document.querySelector("#tableActiveObligations > tbody").innerHTML = tableActiveObligations;
    document.getElementById("nbActiveObligations").innerHTML = nbActiveObligations;

    // Calcul du pourcentage des obligations suivies pour le subtitle de la section :
    document.getElementById("complianceFollowedObligations").innerHTML = (nbObligations > 0) ? Math.round(nbFollowedObligations * 100 / nbObligations) + "% d'obligations suivies" : "0% d'obligations suivies";

    // VISITES EN RETARD :
    let tableLateVisits = "";

    for (let i = 0; i < jsonLateVisits.length; i += 1) {
        if (jsonLateVisits[i].OrganizationId == oSite.Id) {
            nbLateVisits += 1;

            tableLateVisits += "<tr>";
            tableLateVisits += (jsonLateVisits[i].ThemeLocalizedName) ? "<td>" + jsonLateVisits[i].ThemeLocalizedName + "</td>" : "<td>-</td>";
            tableLateVisits += (jsonLateVisits[i].Location) ? "<td>" + jsonLateVisits[i].Location + "</td>" : "<td>-</td>";
            tableLateVisits += (jsonLateVisits[i].ProvisionalDateString) ? "<td>" + jsonLateVisits[i].ProvisionalDateString + "</td>" : "<td>-</td>";
            tableLateVisits += (jsonLateVisits[i].UserProviderForVisitFullName) ? "<td>" + jsonLateVisits[i].UserProviderForVisitFullName + "</td>" : "<td>-</td>";
            tableLateVisits += "</tr>";
        }
    }
    document.querySelector("#tableLateVisits > tbody").innerHTML = tableLateVisits;
    document.getElementById("nbLateVisits").innerHTML = nbLateVisits;

    // Pour le subtitle de la section :
    document.getElementById("complianceLateVisits").innerHTML = (nbLateVisits > 1) ? nbLateVisits + " visites en retard" : nbLateVisits + " visite en retard";
    if (nbLateVisits > 0) {
        document.getElementById("complianceLateVisits").style.color = "red";
    }

    // NON-CONFORMITES A LEVER && NON-CONFORMITES EN RETARD :
    let tableNonCompliancesToDo = "";
    let tableNonCompliancesLate = "";

    for (let i = 0; i < jsonNonCompliances.length; i += 1) {
        if (jsonNonCompliances[i].OrganizationId == oSite.Id && jsonNonCompliances[i].ReserveStatus == 0) {
            nbNonCompliancesToDo += 1;

            tableNonCompliancesToDo += "<tr>";
            tableNonCompliancesToDo += (jsonNonCompliances[i].ThemeLocalizedName) ? "<td>" + jsonNonCompliances[i].ThemeLocalizedName + "</td>" : "<td>-</td>";
            tableNonCompliancesToDo += (jsonNonCompliances[i].VisitObligation) ? "<td>" + jsonNonCompliances[i].VisitObligation + "</td>" : "<td>-</td>";
            tableNonCompliancesToDo += (jsonNonCompliances[i].VisitDateString) ? "<td>" + jsonNonCompliances[i].VisitDateString + "</td>" : "<td>-</td>";
            tableNonCompliancesToDo += (jsonNonCompliances[i].Designation) ? "<td>" + jsonNonCompliances[i].Designation + "</td>" : "<td>-</td>";
            tableNonCompliancesToDo += (jsonNonCompliances[i].UserProviderForReserveFullName) ? "<td>" + jsonNonCompliances[i].UserProviderForReserveFullName + "</td>" : "<td>-</td>";
            tableNonCompliancesToDo += (jsonNonCompliances[i].Location) ? "<td>" + jsonNonCompliances[i].Location + "</td>" : "<td>-</td>";
            tableNonCompliancesToDo += (jsonNonCompliances[i].RedundantString) ? "<td>" + jsonNonCompliances[i].RedundantString + "</td>" : "<td>-</td>";
            tableNonCompliancesToDo += (jsonNonCompliances[i].ReserveText) ? "<td>" + jsonNonCompliances[i].ReserveText + "</td>" : "<td>-</td>";
            tableNonCompliancesToDo += (jsonNonCompliances[i].CritLevelLocalizedName) ? "<td>" + jsonNonCompliances[i].CritLevelLocalizedName + "</td>" : "<td>-</td>";
            tableNonCompliancesToDo += (jsonNonCompliances[i].ExpectedDateString) ? "<td>" + jsonNonCompliances[i].ExpectedDateString + "</td>" : "<td>-</td>";
            tableNonCompliancesToDo += "</tr>";

            if (jsonNonCompliances[i].CritLevelLocalizedName == "Critique")
            nbCriticalNonCompliancesToDo += 1;
        }
        if (jsonNonCompliances[i].OrganizationId == oSite.Id && jsonNonCompliances[i].IsLate == true) {
            nbNonCompliancesLate += 1;

            tableNonCompliancesLate += "<tr>";
            tableNonCompliancesLate += (jsonNonCompliances[i].ThemeLocalizedName) ? "<td>" + jsonNonCompliances[i].ThemeLocalizedName + "</td>" : "<td>-</td>";
            tableNonCompliancesLate += (jsonNonCompliances[i].VisitObligation) ? "<td>" + jsonNonCompliances[i].VisitObligation + "</td>" : "<td>-</td>";
            tableNonCompliancesLate += (jsonNonCompliances[i].VisitDateString) ? "<td>" + jsonNonCompliances[i].VisitDateString + "</td>" : "<td>-</td>";
            tableNonCompliancesLate += (jsonNonCompliances[i].Designation) ? "<td>" + jsonNonCompliances[i].Designation + "</td>" : "<td>-</td>";
            tableNonCompliancesLate += (jsonNonCompliances[i].UserProviderForReserveFullName) ? "<td>" + jsonNonCompliances[i].UserProviderForReserveFullName + "</td>" : "<td>-</td>";
            tableNonCompliancesLate += (jsonNonCompliances[i].Location) ? "<td>" + jsonNonCompliances[i].Location + "</td>" : "<td>-</td>";
            tableNonCompliancesLate += (jsonNonCompliances[i].RedundantString) ? "<td>" + jsonNonCompliances[i].RedundantString + "</td>" : "<td>-</td>";
            tableNonCompliancesLate += (jsonNonCompliances[i].ReserveText) ? "<td>" + jsonNonCompliances[i].ReserveText + "</td>" : "<td>-</td>";
            tableNonCompliancesLate += (jsonNonCompliances[i].CritLevelLocalizedName) ? "<td>" + jsonNonCompliances[i].CritLevelLocalizedName + "</td>" : "<td>-</td>";
            tableNonCompliancesLate += (jsonNonCompliances[i].ExpectedDateString) ? "<td>" + jsonNonCompliances[i].ExpectedDateString + "</td>" : "<td>-</td>";
            tableNonCompliancesLate += "</tr>";

        }
    }
    document.querySelector("#tableNonCompliancesToDo > tbody").innerHTML = tableNonCompliancesToDo;
    document.querySelector("#tableNonCompliancesLate > tbody").innerHTML = tableNonCompliancesLate;
    document.getElementById("nbNonCompliancesToDo").innerHTML = nbNonCompliancesToDo;
    document.getElementById("nbNonCompliancesLate").innerHTML = nbNonCompliancesLate;

    // Pour le subtitle de la section :
    document.getElementById("complianceNonCompliancesToDo").innerHTML = (nbCriticalNonCompliancesToDo) ? nbCriticalNonCompliancesToDo + " NC critiques à lever" : nbCriticalNonCompliancesToDo + " NC critique à lever";
    if (nbCriticalNonCompliancesToDo > 0) {
        document.getElementById("complianceNonCompliancesToDo").style.color = "red";
    }

    // ACTIONS A FAIRE :
    let tableActionsToDo = "";

    for (let i = 0; i < jsonActionsToDo.length; i += 1) {
        if (jsonActionsToDo[i].OrganizationId == oSite.Id) {
            nbActionsToDo += 1;

            tableActionsToDo += "<tr>";
            tableActionsToDo += (jsonActionsToDo[i].Code) ? "<td>" + jsonActionsToDo[i].Code + "</td>" : "<td>-</td>";
            tableActionsToDo += (jsonActionsToDo[i].ReserveUniqueName) ? "<td>" + jsonActionsToDo[i].ReserveUniqueName + "</td>" : "<td>-</td>";
            tableActionsToDo += (jsonActionsToDo[i].Name) ? "<td>" + jsonActionsToDo[i].Name + "</td>" : "<td>-</td>";
            tableActionsToDo += (jsonActionsToDo[i].Description) ? "<td>" + jsonActionsToDo[i].Description + "</td>" : "<td>-</td>";
            tableActionsToDo += (jsonActionsToDo[i].BeginTimeString) ? "<td>" + jsonActionsToDo[i].BeginTimeString + "</td>" : "<td>-</td>";
            tableActionsToDo += (jsonActionsToDo[i].EndTimeString) ? "<td>" + jsonActionsToDo[i].EndTimeString + "</td>" : "<td>-</td>";
            tableActionsToDo += (jsonActionsToDo[i].StatusLocalizedName) ? "<td>" + jsonActionsToDo[i].StatusLocalizedName + "</td>" : "<td>-</td>";
            tableActionsToDo += "</tr>";
        }
    }
    document.querySelector("#tableActionsToDo > tbody").innerHTML = tableActionsToDo;
    document.getElementById("nbActionsToDo").innerHTML = nbActionsToDo;
}

function handleOpenCloseContainer() {
    let iconOpenContainer = document.querySelectorAll(".openCloseIcon");

    iconOpenContainer.forEach(element => {
        element.addEventListener("click", () => {
            let nextPartContainer = element.parentNode.nextElementSibling;

            if (nextPartContainer.classList.contains("active")) {
                nextPartContainer.classList.remove("active");
                element.classList.replace('fa-window-minimize', 'fa-plus');
            } else {
                nextPartContainer.classList.add("active");
                element.classList.replace('fa-plus', 'fa-window-minimize');
            }
        });
    });
}