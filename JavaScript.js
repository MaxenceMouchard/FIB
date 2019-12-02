/* ------ HORTREE PLUGIN ------ */
// PUE SA MERE
!function (e, t, r, n) { "use strict"; function i(t) { var r = []; return r.push('<div class="hortree-branch">'), e(t).each(function () { r.push(o(this)) }), r.push("</div>"), r.join("\n") } function o(e) { l++; var t = []; return t.push('<div class="hortree-entry" data-entry-id="' + l + '">'), e.tooltip && "" !== e.tooltip.toString().trim() ? (t.push('<div class="hortree-label hortree-tooltip">'), t.push('<span class="hortree-tooltip-text">' + e.tooltip + "</span>"), t.push(e.description), t.push("</div>")) : t.push('<div class="hortree-label">' + e.description + "</div>"), e.children.length && t.push(i(e.children)), t.push("</div>"), t.join("\n") } function h() { var t = []; e(".hortree-entry").each(function () { var r = e(this).attr("data-entry-id"); t.push({ entryId: parseInt(r), entry: e(this) }) }); var r = t.slice(0); r.sort(function (e, t) { return e.entryId - t.entryId }), r.reverse(); for (var n = 0; n < r.length; n++) { var i = r[n].entry, o = i.children(".hortree-branch"); if (o.length) { var h = 0; o.each(function () { h += e(this).height() }), i.height(h) } } } function a(t) { function r(t) { for (var r = 0, n = 0; null !== t && (r += t.offsetLeft, n += t.offsetTop, t = t.offsetParent, !e(".hortree-wrapper").is(t));); return { x: r, y: n } } e(".hortree-wrapper").each(function () { var n = e(this), i = 0, o = 0; n.find(".hortree-label").each(function () { if (0 === o) { var h = e(this).offset().top; i = -1 * h + 20 } if (e(this).siblings(".hortree-branch").length) { var a = r(e(this).get(0)); e(this).siblings(".hortree-branch").children(".hortree-entry").children(".hortree-label").each(function () { var o = r(e(this).get(0)); n.line(a.x + e(this).width() - 10, a.y + i, o.x, o.y + i, { zindex: t.lineZindex, color: t.lineColor, stroke: t.lineStrokeWidth }) }) } o++ }) }) } function s() { e(".hortree-label").each(function () { var t = e(this).height(); e(this).parent(".hortree-entry").height(t) }) } var l = 0; e.fn.hortree = function (t) { t = t || {}; var r = { lineStrokeWidth: 2, lineZindex: 8, lineColor: "#4b86b7", data: [], onComplete: function () { } }, n = e.extend(r, t); if (!e.fn.line) throw new Error("You must load jquery.line.js library! Get it here: https://github.com/tbem/jquery.line"); if (!n.data) throw new Error("No data specified!"); if (!(n.data instanceof Array)) throw new Error("Data should be an array"); n.data.length || console.warn("Data is empty"); var o = []; o.push('<div class="hortree-wrapper">'), o.push(i(n.data)), o.push("</div>"), this.html(o.join("\n")), s(), h(), a(n), n.onComplete && "function" == typeof n.onComplete && n.onComplete.apply() } }(jQuery, window, document);

/* ------ LINE PLUGIN ------ */
//PUE SA MERE
!function (t) { var e = function (t, e, s, l, a) { var n = navigator.userAgent.indexOf("MSIE") > -1; if (s < t) { var r = t; t = s, s = r, r = e, e = l, l = r } var o = document.createElement("div"); o.className = a.class; var i = Math.sqrt((t - s) * (t - s) + (e - l) * (e - l)); if (o.style.width = i + "px", o.style.borderBottom = a.stroke + "px " + a.style, o.style.borderColor = a.color, o.style.position = "absolute", o.style.zIndex = a.zindex, n) { o.style.top = l > e ? e + "px" : l + "px", o.style.left = t + "px"; var c = (s - t) / i, f = (l - e) / i; o.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=" + c + ", M12=" + -1 * f + ", M21=" + f + ", M22=" + c + ")" } else { var d = Math.atan((l - e) / (s - t)); o.style.top = e + .5 * i * Math.sin(d) + "px", o.style.left = t - .5 * i * (1 - Math.cos(d)) + "px", o.style.transform = o.style.MozTransform = o.style.WebkitTransform = o.style.msTransform = o.style.OTransform = "rotate(" + d + "rad)" } return o }; t.fn.line = function (s, l, a, n, r, o) { return t(this).each(function () { t.isFunction(r) ? (callback = r, r = null) : callback = o, r = t.extend({}, t.fn.line.defaults, r), t(this).append(e(s, l, a, n, r)).promise().done(function () { t.isFunction(callback) && callback.call() }) }) }, t.fn.line.defaults = { zindex: 1e4, color: "#000000", stroke: "1", style: "solid", class: "line" } }(jQuery);

/* ------ CODE ------ */
let jsonLegalDataOne = [
    {
        description: "Propriété de Veolia",
        children: [
            {
                description: "Locataire n°1",
                children: [
                    {
                        description: "Bale 123",
                        children: []
                    },
                    {
                        description: "Sous-Location n°2",
                        children: []
                    }
                ]
            },
            {
                description: "Altran Services SA",
                children: [
                    {
                        description: "Bale 123",
                        children: []
                    },
                    {
                        description: "Bale 99",
                        children: []
                    }
                ]
            },
            {
                description: "Altran Services SA",
                children: []
            },
            {
                description: "Altran Services SA",
                children: []
            }
        ]
    }
];

let jsonLegalDataTwo = [
    {
        description: "FR69.P01 FR33.00001 - CMA CGM",
        children: [
            {
                description: "Altran Services SA",
                children: []
            },
            {
                description: "Altran Services SA",
                children: []
            }
        ]
    }
];

let identityMap = initFIBGoogleMap();
let identityMapMarkers = [];

document.addEventListener("DOMContentLoaded", () => {
    // Handle the site selection
    console.log(jsonAllOrganizations);
    console.log(jsonAllContacts);

    handleSiteSelectorFilter();

    // site paris pré-selectionné pour les tests : à supprimer
    document.getElementById("siteSelector").selectedIndex = 47;
    $("#searchFilterButton").trigger("click");

    // Add event when user click on openCloseIcon element :
    handleOpenCloseContainer();

    // Horizontal tree creation in Legal Section :
    createLegalHortree([{
        horTreeId: "#legalHorTreeOne",
        horTreeData: jsonLegalDataOne
    }, {
        horTreeId: "#legalHorTreeTwo",
        horTreeData: jsonLegalDataTwo
    }]);
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
    loadDataContact(selectedSite);
}

function loadDataContact(oSite) {
    let contactsReferenced = document.getElementById("contactsReferenced");
    let counter = 0;
    contactsReferenced.innerHTML = '';
    Array.from(jsonAllContacts).forEach( (item, index) => {
        if(item.OrganizationId === oSite.Id) {
            let separator = (counter > 0) ? '<hr class="contactSeparator"/>' : '';
            let contactFullName = (item.ContactFullName !== null) ? item.ContactFullName : '';
            let contactInitial = (contactFullName).split(/\s/).reduce((response,word)=> response += word.slice(0,1), '');
            let contactJob = (item.ContactJob !== null) ? item.ContactJob : 'Inconnu';
            let contactMobilePro = (item.ContactMobilePro !== null) ? item.ContactMobilePro : 'Inconnu';
            let contactLandlinePro = (item.ContactLandlinePro !== null) ? item.ContactLandlinePro : 'Inconnu';
            let contactEmail = (item.ContactEmail !== null) ? item.ContactEmail : 'Inconnu';
            let contactLastConnection = (item.ContactLastConnection !== null) ? item.ContactLastConnection : 'Inconnu';
            let contactConnectionsCounter = (item.ContactConnectionsCounter !== null) ? item.ContactConnectionsCounter : 'Inconnu';
            contactsReferenced.innerHTML +=
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
            counter++;
        };
    });

    if (counter === 0) {
        contactsReferenced.innerHTML = `<div style="font-weight: normal; padding-left: 50px;">Aucun contact n'est référencé</div>`;
    }
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
    if (oSite.AddressLine2 !== null && oSite.AddressLine2 !== undefined)
        document.getElementById("identityStreetLocation2").innerHTML = oSite.AddressLine2;
    if (oSite.AddressLine3 !== null && oSite.AddressLine3 !== undefined)
        document.getElementById("identityStreetLocation3").innerHTML = oSite.AddressLine3;
    document.getElementById("identityPostCodeLocation").innerHTML = oSite.PostCode;
    if (oSite.PostCode !== null && oSite.PostCode !== undefined)
        document.getElementById("identityPostCodeLocation").innerHTML += "&nbsp";
    document.getElementById("identityCityLocation").innerHTML = oSite.City;
    document.getElementById("identityCountryLocation").innerHTML = oSite.CountryName;

    // Main summary data of building :
    document.getElementById("identityLabel").innerHTML = (oSite.ERPTypesTypeName !== null && oSite.ERPTypesTypeName !== undefined) ? oSite.ERPTypesTypeName : "Inconnu";
    let nbOrgaLots = 0;
    for (let i = 0; i < jsonAllLots.length; i += 1) {
        if (oSite.Id == jsonAllLots[i].OrganizationId)
            nbOrgaLots += 1;
    }
    document.getElementById("identityFloorsNumberData").innerHTML = nbOrgaLots;
    document.getElementById("identityTotalSurfaceData").innerHTML = (oSite.M2 !== null && oSite.M2 !== undefined) ? oSite.M2 + "m²" : "0m²";

    // Add localisation marker on Google Map :
    placeMarkerOnFIBGoogleMap(oSite);
}

function placeMarkerOnFIBGoogleMap(oSite) {
    for (var i = 0; i < identityMapMarkers.length; i++) {
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

function createLegalHortree(arrayHorTreeObjects) {
    // Creation of the HorTrees
    arrayHorTreeObjects.forEach((object) => {
        $(object.horTreeId).hortree({
            data: object.horTreeData
        });
    });

    let horTreeContainers = document.getElementsByClassName("legalHorTreeContainer");

    // The marginTop of the lines of the new HorTree == marginTop of lines of previous HorTree +
    // height of previous HorTree + marginTop of previous HorTree
    Array.from(horTreeContainers).forEach((container, index) => {
        if (index < horTreeContainers.length - 1) {
            let horTreeLineMarginTop = parseInt(getComputedStyle(document.querySelector("#" + container.id + " .line")).marginTop);
            let horTreeHeight = parseInt(getComputedStyle(container).height);
            let horTreeMarginTop = parseInt(getComputedStyle(container).marginTop);
            let nextHorTreeLineMarginTop = horTreeLineMarginTop + horTreeHeight + horTreeMarginTop;

            Array.from(document.querySelectorAll("#" + horTreeContainers[index + 1].id + " .line")).forEach((line) => {
                line.style.marginTop = nextHorTreeLineMarginTop.toString() + "px";
            });
        }
    });

    // Text format of the labels
    Array.from(document.getElementsByClassName("hortree-label")).forEach((label) => {
        label.classList.add("simpleText");
    });

    // Managing background color of the labels (depending of their section) + the tooltips only for the first section
    $(".hortree-label").tooltip({
        html: true,
        title: "<div class='simpleText'>" +
            "Surface totale Propriétaire : <strong>1 000 m²</strong><br />" +
            "Montant d'acquisition : <strong>12 000 000 €</strong><br />" +
            "Date d'acquisition : <strong>07/05/2001</strong></div>",
        placement: "top",
        container: "body"
    })
    Array.from(horTreeContainers).forEach((container, index) => {
        container.querySelectorAll(".hortree-branch").forEach((branch, indexBis) => {
            if (indexBis === 0) {
                branch.querySelectorAll(".hortree-entry > .hortree-label").forEach((label) => {
                    if (index === 0)
                        label.style.backgroundColor = "#79D6CB";
                    else if (index === 1)
                        label.style.backgroundColor = "#7BD679";
                })
            } else if (indexBis === 1) {
                branch.querySelectorAll(".hortree-entry > .hortree-label").forEach((label) => {
                    $(label).tooltip("disable");
                    label.style.backgroundColor = "#76BA74";
                })
            } else if (indexBis > 1) {
                branch.querySelectorAll(".hortree-entry > .hortree-label").forEach((label) => {
                    $(label).tooltip("disable");
                    label.style.backgroundColor = "#548852";
                })
            }
        });
    });
}