/* ------ HORTREE PLUGIN ------ */
!function (e, t, r, n) { "use strict"; function i(t) { var r = []; return r.push('<div class="hortree-branch">'), e(t).each(function () { r.push(o(this)) }), r.push("</div>"), r.join("\n") } function o(e) { l++; var t = []; return t.push('<div class="hortree-entry" data-entry-id="' + l + '">'), e.tooltip && "" !== e.tooltip.toString().trim() ? (t.push('<div class="hortree-label hortree-tooltip">'), t.push('<span class="hortree-tooltip-text">' + e.tooltip + "</span>"), t.push(e.description), t.push("</div>")) : t.push('<div class="hortree-label">' + e.description + "</div>"), e.children.length && t.push(i(e.children)), t.push("</div>"), t.join("\n") } function h() { var t = []; e(".hortree-entry").each(function () { var r = e(this).attr("data-entry-id"); t.push({ entryId: parseInt(r), entry: e(this) }) }); var r = t.slice(0); r.sort(function (e, t) { return e.entryId - t.entryId }), r.reverse(); for (var n = 0; n < r.length; n++) { var i = r[n].entry, o = i.children(".hortree-branch"); if (o.length) { var h = 0; o.each(function () { h += e(this).height() }), i.height(h) } } } function a(t) { function r(t) { for (var r = 0, n = 0; null !== t && (r += t.offsetLeft, n += t.offsetTop, t = t.offsetParent, !e(".hortree-wrapper").is(t));); return { x: r, y: n } } e(".hortree-wrapper").each(function () { var n = e(this), i = 0, o = 0; n.find(".hortree-label").each(function () { if (0 === o) { var h = e(this).offset().top; i = -1 * h + 20 } if (e(this).siblings(".hortree-branch").length) { var a = r(e(this).get(0)); e(this).siblings(".hortree-branch").children(".hortree-entry").children(".hortree-label").each(function () { var o = r(e(this).get(0)); n.line(a.x + e(this).width() - 10, a.y + i, o.x, o.y + i, { zindex: t.lineZindex, color: t.lineColor, stroke: t.lineStrokeWidth }) }) } o++ }) }) } function s() { e(".hortree-label").each(function () { var t = e(this).height(); e(this).parent(".hortree-entry").height(t) }) } var l = 0; e.fn.hortree = function (t) { t = t || {}; var r = { lineStrokeWidth: 2, lineZindex: 8, lineColor: "#4b86b7", data: [], onComplete: function () { } }, n = e.extend(r, t); if (!e.fn.line) throw new Error("You must load jquery.line.js library! Get it here: https://github.com/tbem/jquery.line"); if (!n.data) throw new Error("No data specified!"); if (!(n.data instanceof Array)) throw new Error("Data should be an array"); n.data.length || console.warn("Data is empty"); var o = []; o.push('<div class="hortree-wrapper">'), o.push(i(n.data)), o.push("</div>"), this.html(o.join("\n")), s(), h(), a(n), n.onComplete && "function" == typeof n.onComplete && n.onComplete.apply() } }(jQuery, window, document);

/* ------ LINE PLUGIN ------ */
!function (t) { var e = function (t, e, s, l, a) { var n = navigator.userAgent.indexOf("MSIE") > -1; if (s < t) { var r = t; t = s, s = r, r = e, e = l, l = r } var o = document.createElement("div"); o.className = a.class; var i = Math.sqrt((t - s) * (t - s) + (e - l) * (e - l)); if (o.style.width = i + "px", o.style.borderBottom = a.stroke + "px " + a.style, o.style.borderColor = a.color, o.style.position = "absolute", o.style.zIndex = a.zindex, n) { o.style.top = l > e ? e + "px" : l + "px", o.style.left = t + "px"; var c = (s - t) / i, f = (l - e) / i; o.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=" + c + ", M12=" + -1 * f + ", M21=" + f + ", M22=" + c + ")" } else { var d = Math.atan((l - e) / (s - t)); o.style.top = e + .5 * i * Math.sin(d) + "px", o.style.left = t - .5 * i * (1 - Math.cos(d)) + "px", o.style.transform = o.style.MozTransform = o.style.WebkitTransform = o.style.msTransform = o.style.OTransform = "rotate(" + d + "rad)" } return o }; t.fn.line = function (s, l, a, n, r, o) { return t(this).each(function () { t.isFunction(r) ? (callback = r, r = null) : callback = o, r = t.extend({}, t.fn.line.defaults, r), t(this).append(e(s, l, a, n, r)).promise().done(function () { t.isFunction(callback) && callback.call() }) }) }, t.fn.line.defaults = { zindex: 1e4, color: "#000000", stroke: "1", style: "solid", class: "line" } }(jQuery);

/* ------ CODE ------ */

let identityMap = initFIBGoogleMap();
let identityMapMarkers = [];

document.addEventListener("DOMContentLoaded", () => {
    console.log(jsonAllOrganizations)
    console.log("ici")
    console.log(jsonAllDocuments)

    // Handle the site selection
    handleSiteSelectorFilter();

    // site pré-selectionné pour les tests : à supprimer
    document.getElementById("siteSelector").selectedIndex = 9;
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
    document.getElementById("identityLabel").innerHTML = (oSite.ERPTypesTypeName) ? oSite.ERPTypesTypeName : "Inconnu";
    let nbOrgaLots = 0;
    for (let i = 0; i < jsonAllLots.length; i += 1) {
        if (oSite.Id == jsonAllLots[i].OrganizationId)
            nbOrgaLots += 1;
    }
    document.getElementById("identityFloorsNumberData").innerHTML = nbOrgaLots;
    document.getElementById("identityTotalSurfaceData").innerHTML = (oSite.M2) ? oSite.M2 + "m²" : "0m²";

    // Add localisation marker on Google Map :
    placeMarkerOnFIBGoogleMap(oSite);
}

function placeMarkerOnFIBGoogleMap(oSite) {
    for (let i = 0; i < identityMapMarkers.length; i++) {
        identityMapMarkers[i].setMap(null);
    }

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(oSite.Lat, oSite.Long),
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
            let contactJob = (item.ContactJob) ? item.ContactJob : 'Inconnu';
            let contactMobilePro = (item.ContactMobilePro) ? item.ContactMobilePro : 'Inconnu';
            let contactLandlinePro = (item.ContactLandlinePro) ? item.ContactLandlinePro : 'Inconnu';
            let contactEmail = (item.ContactEmail) ? item.ContactEmail : 'Inconnu';
            let contactLastConnection = (item.ContactLastConnection) ? new Date(item.ContactLastConnection).toLocaleDateString() : 'Inconnu';
            let contactConnectionsCounter = (item.ContactConnectionsCounter) ? item.ContactConnectionsCounter : 'Inconnu';
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

function loadDataEquipments(oSite) {
    let equipmentsAllData = document.getElementById("equipmentsAllData");

    //Data on subTitle
    let counterFollowingPourcent = 0;

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
            let visitDateString = "Inconnu";
            let visiteDateEN = new Date();
            
            Array.from(jsonAllEquipmentsNC).forEach( NC => {
                if (NC.OrganizationId == oSite.Id && NC.EquipmentsId == equipment.Id) {
                    if (NC.StatusOfReserveLocalizedName == "A lever") {
                        counterNcToUp++;
                    }
                    if (NC.VisitDateString !== "" && NC.visitDateString !== null && visiteDateEN <= new Date(NC.VisitDate)) {
                        visitDateString = NC.VisitDateString;
                        visiteDateEN = NC.VisitDate;
                    }
                    if (NC.IsLate) {
                        counterTotalNcToLate++;
                    }

                    rowSecondTable += "<tr><td>"+ equipment.Name +"</td><td>"+ NC.VisitObligation +"</td><td>"+ NC.UserProviderForReserveFullName +"</td><td>"+ NC.Location +"</td><td>"+ NC.RedundantString +"</td><td>"+ NC.ReserveText +"</td><td>"+ NC.CritLevelLocalizedName +"</td><td>"+ NC.ExpectedDateString +"</td><td>"+ NC.StatusOfReserveLocalizedName +"</td></tr>";
                }
            });

            Array.from(jsonAllEquipmentsActions).forEach( action => {
                if (action.OrganizationId == oSite.Id && action.EquipmentsId == equipment.Id) {
                    if (action.StatusLocalizedName == "En cours") {
                        counterActualAction++;
                    }
                    if (action.StatusLocalizedName == "A faire") {
                        counterTotalActionToDo++;
                        rowThirdTable += "<tr><td>"+ equipment.Name +"</td><td>"+ action.Name +"</td><td>"+ action.BeginTimeString +"</td><td>"+ action.EndTimeString +"</td><td>"+ action.ResponsibleFullName +"</td><td>"+ action.PriorityName +"</td><td>"+ action.StatusLocalizedName +"</td></tr>";
                    }
                }
            });

            let enOfGuarantee = monthDiff(new Date(), new Date(equipment.EndOfGuarantee));
            let nextVisiteDate = monthDiff(new Date(), new Date(visiteDateEN));
            rowFirstTable += "<tr data-endOfGuarantee='"+ enOfGuarantee +"' data-nextVisiteDate='"+ nextVisiteDate +"'><td>"+ equipment.ThemeLocalizedName +"</td><td>"+ equipment.Reference +"</td><td>"+ equipment.QRCode +"</td><td>"+ equipment.Brand +"</td><td>"+ equipment.EndOfGuaranteeString +"</td><td>"+ counterNcToUp +"</td><td>"+ visitDateString +"</td><td>"+ counterActualAction +"</td></tr>";

        };
    });

    let nbVisits = 0;
    Array.from(jsonAllEquipmentsVisit).forEach( visit => {
        if (visit.OrganizationId == oSite.Id)
            nbVisits += visit.EquipmentsId.split(',').length;
    });

	if (counterEquipment > 0) {
		counterFollowingPourcent = Math.round(nbVisits * 100 / counterEquipment);
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
    var months;
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
            let createdDate = (document.CreatedDateString) ? document.CreatedDateString : "Inconnue";
            let updateOn = (document.ModifiedDateString) ? document.ModifiedDateString : createdDate;
            var owner = (document.AuditorOwnerFullName) ? document.AuditorOwnerFullName : "Inconnu";
            let name = (document.Name) ? document.Name : "Inconnu";
            let theme = (document.ThemeLocalizedName) ? document.ThemeLocalizedName : "Inconnu";
            let version = (document.Version) ? document.Version : "Inconnue";
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

    //First Table
    documentsAllData.querySelector("#documentFirstTable > tbody").innerHTML = rowFirstTable;

    //Second Table
    documentsAllData.querySelector("#documentSecondTable > tbody").innerHTML = rowSecondTable;

    //Third Table
    documentsAllData.querySelector("#documentThirdTable > tbody").innerHTML = rowThirdTable;

    //First Tab
    documentsAllData.querySelector("#nbDocuments").innerHTML = counterRequiredDocumentsAvailable;
    //Second Tab
    documentsAllData.querySelector("#nbToRenew").innerHTML = counterRenewableDocumens;
    //Third Tab
    documentsAllData.querySelector("#nbToValidate").innerHTML = counterDocumentToValidate;
}

function loadDataPropertyTitles(oSite) {
    // SUB-SECTION 1:
    let propertyTitles_owners = [];
    let leases = [];
    let subLeases = [];
    let indexId = 1;

    let nbPropertyTitles = 0;
    let nbInternalLeases = 0;
    let nbExternalLeases = 0;
    let nbSubLeases = 0;
    
    let maxCapacity = 0;
    let occupiedWorkstation = 0;
    
    document.getElementById("legalHorTreeContainers").innerHTML = "";

    // Titres de propriété (type Interne)
    for (let i = 0; i < jsonAllPropertyTitles.length; i += 1) {
        if (oSite.Id == jsonAllPropertyTitles[i].OrganizationId) {
            for (let j = 0; j < jsonAllBaux.length; j += 1) {
                if (jsonAllBaux[j].PropertyTitleId == jsonAllPropertyTitles[i].Id) {
                    for (let k = 0; k < jsonAllBaux.length; k += 1) {
                        if (jsonAllBaux[k].BailParentId == jsonAllBaux[j].Id) {
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
                    maxCapacity += jsonAllBaux[j].MaxCapacity;
                    occupiedWorkstation += jsonAllBaux[j].OccupiedWorkstationsNb;
                    nbInternalLeases += 1;
                }
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
            let surface = (jsonAllPropertyTitles[i].Surface) ? Math.round(jsonAllPropertyTitles[i].Surface.replace(",", ".")).toLocaleString() : "Inconnue";
            let cost = (jsonAllPropertyTitles[i].AcquisitionCost) ? Math.round(jsonAllPropertyTitles[i].AcquisitionCost.replace(",", ".")).toLocaleString() : "Inconnu";
            let date = (jsonAllPropertyTitles[i].AcquisitionDate) ? new Date(jsonAllPropertyTitles[i].AcquisitionDate).toLocaleDateString() : "Inconnue";
            
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
                if (jsonAllBaux[j].OwnerId == jsonAllOwners[i].Id) {
                    for (let k = 0; k < jsonAllBaux.length; k += 1) {
                        if (jsonAllBaux[k].BailParentId == jsonAllBaux[j].Id) {
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
                    maxCapacity += jsonAllBaux[j].MaxCapacity;
                    occupiedWorkstation += jsonAllBaux[j].OccupiedWorkstationsNb;
                    nbExternalLeases += 1;
                }
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

    // SUB-SECTION 2 :
    let percentageOccupation = maxCapacity > 0 ? Math.round(occupiedWorkstation / maxCapacity * 100) : 0;
    let percentageInternalLease = (nbInternalLeases + nbExternalLeases) > 0 ? Math.round(nbInternalLeases / (nbInternalLeases + nbExternalLeases) * 100) : 0;
    let percentageExternalLease = (nbInternalLeases + nbExternalLeases) > 0 ? Math.round(nbExternalLeases / (nbInternalLeases + nbExternalLeases) * 100) : 0;

console.log(jsonAllBaux)

    document.getElementById("legalInternalData").innerHTML = percentageInternalLease;
    document.getElementById("legalExternalData").innerHTML = percentageExternalLease;
    displayGauge("legalOccupationGauge", [{
        y: percentageOccupation,
        color: this.y < 50 ? "#FF0000" : this.y < 75 ? "#FFA500" : "#7BD679",
        radius: 100,
        innerRadius: 94,
        labela: percentageOccupation + "%",
        labelb: "d'occupation"
    }]);

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
    
    displayGauge("legalSurfaceTypeGauge", [{
        y: 100,
        color: "#7BD679",
        radius: 100,
        innerRadius: 94,
        labela: "",
        labelb: "Occupation par<br />type de surface"
    }, {
        y: 70,
        color: "#7984D6",
        radius: 100,
        innerRadius: 94,
        labela: "",
        labelb: "Occupation par<br />type de surface"
    }, {
        y: 40,
        color: "#FFE22B",
        radius: 100,
        innerRadius: 94,
        labela: "",
        labelb: "Occupation par<br />type de surface"
    }, {
        y: 15,
        color: "#FF5858",
        radius: 100,
        innerRadius: 94,
        labela: "",
        labelb: "Occupation par<br />type de surface"
    }]);

    Array.from(document.getElementsByClassName("gaugeDataText")).forEach((text) => {
        if (text.innerHTML)
            text.style.margin = 0;
    });
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
                        // The offset of the first line = the offset of the first lease :
                        offsetFirstLine = label.getBoundingClientRect().top - 2;
                        document.querySelector("#" + container.id + " .line").style.marginTop = offsetFirstLine;
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

function displayGauge(divId, dataArray) {
    Highcharts.chart(divId, {
        chart: {
            type: "solidgauge",
        },
        title: {
            text: '',
            style: {
                fontSize: "12px"
            }
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