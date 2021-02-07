var jQueryScript = document.createElement('script');
jQueryScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js');
document.head.appendChild(jQueryScript);

let map;
let censusMin = 2000;
let censusMax = 0;
let data_set_la;
var data_set_tot;
var pie1 = 0;
var pie2 = 0;
var keepscore = [];
var storemode = false;
var pies = false;
var markers = [];
var want_marker = true;



function initMap() {
    const myLatlng = { lat: 38.5, lng: -97 }; //{lat:20.5, lng:202}
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4.2,
        center: myLatlng,
        mapTypeControl: false,
        streetViewControl: false
    });
    statesLayer = new google.maps.Data({ map: map });
    createDefaultInfo();
    map.data.setStyle(styleFeature);

    map.data.addListener("click", onClick);
    map.data.addListener("mouseover", mouseInToRegion);
    map.data.addListener("mouseout", mouseOutOfRegion);
    document.getElementById("details").addEventListener("click", detChange)
    //  document.getElementById("donate").addEventListener("click", donChange)
    // document.getElementById("discourse").addEventListener("click", disChange)
    document.getElementById("introd").addEventListener("click", introChange)
    document.getElementById("data-caret").style.paddingLeft = "33%"
    document.getElementById("details").style.textDecoration = "none"

    const centerControlDiv_hawaii = document.createElement("div");
    Hawaii(centerControlDiv_hawaii, map);
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
        centerControlDiv_hawaii
    );
    const centerControlDiv_main = document.createElement("div");
    Mainland(centerControlDiv_main, map);
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
        centerControlDiv_main
    );
    const centerControlDiv_alaska = document.createElement("div");
    Alaska(centerControlDiv_alaska, map);
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
        centerControlDiv_alaska
    );


    const centerControlDiv_delete = document.createElement("div");
    DeleteMode(centerControlDiv_delete, map);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        centerControlDiv_delete
    );
    const centerControlDiv_clear = document.createElement("div");
    ClearMode(centerControlDiv_clear, map);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        centerControlDiv_clear
    );

    const centerControlDiv_store = document.createElement("div");
    StoreMode(centerControlDiv_store, map);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        centerControlDiv_store
    );


    pieCharts();
    loadMapShapes();

    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
            if (!place.geometry) {

                return;
            }
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

        })
        map.fitBounds(bounds);
    })

}

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}


function detChange() {
    document.getElementById("basic").style.display = "block";
    document.getElementById("charts").style.display = "flex";
    document.getElementById("pie_key").style.display = "block";
    document.getElementById("intro").style.display = "none";
    // document.getElementById("donate_tab").style.display = "none";
    //document.getElementById("discourse_tab").style.display = "none";

    document.getElementById("details").style.textDecoration = "underline"
    document.getElementById("introd").style.textDecoration = "none"
    // document.getElementById("donate").style.textDecoration = "none"
    // document.getElementById("discourse").style.textDecoration = "none"
}

function introChange() {
    document.getElementById("basic").style.display = "none";
    document.getElementById("charts").style.display = "none";
    document.getElementById("pie_key").style.display = "none";
    document.getElementById("intro").style.display = "block";
    // document.getElementById("donate_tab").style.display = "none";
    //document.getElementById("discourse_tab").style.display = "none";

    document.getElementById("details").style.textDecoration = "none"
    document.getElementById("introd").style.textDecoration = "underline"
    // document.getElementById("donate").style.textDecoration = "none"
    // document.getElementById("discourse").style.textDecoration = "none"
}

function Alaska(controlDiv, map) {
    // Set CSS for the control border.
    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.cursor = "pointer";

    controlUI.style.textAlign = "center";
    controlUI.style.marginLeft = "10px"

    controlUI.title = "Click to Center on Alaska";
    controlDiv.appendChild(controlUI);
    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Alaska";
    controlUI.appendChild(controlText);
    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
        map.setCenter({ lat: 64.2008, lng: 205.4937 });
        map.setZoom(4.1)
    });
}
function Hawaii(controlDiv, map) {
    // Set CSS for the control border.
    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.cursor = "pointer";


    controlUI.style.marginLeft = "10px"
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to Center on Hawaii";
    controlDiv.appendChild(controlUI);
    controlUI.style.marginBottom = "10px"
    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Hawaii";
    controlUI.appendChild(controlText);
    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
        map.setCenter({ lat: 20.5, lng: 202.5 });
        map.setZoom(7.3)
    });
}
function Mainland(controlDiv, map) {
    // Set CSS for the control border.
    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.cursor = "pointer";

    controlUI.style.maringLeft = "0px";
    controlUI.style.textAlign = "center";
    controlUI.style.marginLeft = "10px"
    controlUI.title = "Click to Center on Mainland";
    controlDiv.appendChild(controlUI);
    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Mainland";
    controlUI.appendChild(controlText);
    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
        map.setCenter({ lat: 38.5, lng: -97 });
        map.setZoom(4.2)
    });
}

function pieCharts(e, feature) {


    if (!pies) {
        var ctx = document.getElementById('pie1').getContext('2d');
        var ctx2 = document.getElementById('pie2').getContext('2d');


        the_info = createDefaultInfo()


        pie1 = new Chart(ctx, {
            type: 'pie',
            options: {
                title: {
                    display: true,
                    text: '% Population Low Access Based on Race'
                },
                legend: {
                    display: false,
                    position: 'bottom',
                    alignment: 'start'
                },
                responsive: false
            },
            data: {
                labels: [
                    'White',
                    'African American',
                    'Asian',
                    'American Indian and Alaska Native',
                    'Other/Multiple Race',
                    'Hispanic or Latino'
                ],
                datasets: [{
                    label: 'LA Race Distribution',
                    data: the_info[0],

                    backgroundColor: [
                        'rgb(121, 125, 98)',
                        'rgb(217, 174, 148)',
                        'rgb(155, 155, 122)',
                        'rgb(255, 203, 105)',
                        'rgb(208, 140, 96)',
                        'rgb(153, 123, 102)'
                    ]
                }]
            }
        })
        pie2 = new Chart(ctx2, {
            type: 'pie',
            options: {
                title: {
                    display: true,
                    text: '% Population Based on Race'
                },
                legend: {
                    display: false
                },
                responsive: false
            },
            data: {
                labels: [
                    'White',
                    'African American',
                    'Asian',
                    'American Indian and Alaska Native',
                    'Other/Multiple Race',
                    'Hispanic or Latino'
                ],
                datasets: [{
                    label: 'LA Race Distribution',
                    data: the_info[1],

                    backgroundColor: [
                        'rgb(121, 125, 98)',
                        'rgb(217, 174, 148)',
                        'rgb(155, 155, 122)',
                        'rgb(255, 203, 105)',
                        'rgb(208, 140, 96)',
                        'rgb(153, 123, 102)'
                    ]
                }]
            }
        })




        pies = true;
    }
    else if (feature != null) {

        set = ([feature.getProperty("white"), feature.getProperty("black"), feature.getProperty("asian"), feature.getProperty("nhna"),
        feature.getProperty("mult"), feature.getProperty("hisp")]);
        data_set_la_tot = set.reduce((a, b) => a + b, 0);
        data_set_la = set.map(function (x) { return Math.round(x / data_set_la_tot * 100 * 10) / 10 });

        data_set_tot = ([feature.getProperty("white_tot"), feature.getProperty("black_tot"), feature.getProperty("asian_tot"), feature.getProperty("nhna_tot"),
        feature.getProperty("mult_tot"), feature.getProperty("hisp_tot")].map(function (x) { return Math.round(x * 10) / 10 }));

        pie1.data.datasets[0].data = data_set_la;
        pie1.update();

        pie2.data.datasets[0].data = data_set_tot;
        pie2.update();

    }
    else {
        set = ([e.feature.getProperty("white"), e.feature.getProperty("black"), e.feature.getProperty("asian"), e.feature.getProperty("nhna"),
        e.feature.getProperty("mult"), e.feature.getProperty("hisp")]);
        data_set_la_tot = set.reduce((a, b) => a + b, 0);
        data_set_la = set.map(function (x) { return Math.round(x / data_set_la_tot * 100 * 10) / 10 });

        data_set_tot = ([e.feature.getProperty("white_tot"), e.feature.getProperty("black_tot"), e.feature.getProperty("asian_tot"), e.feature.getProperty("nhna_tot"),
        e.feature.getProperty("mult_tot"), e.feature.getProperty("hisp_tot")].map(function (x) { return Math.round(x * 10) / 10 }));

        pie1.data.datasets[0].data = data_set_la;
        pie1.update();

        pie2.data.datasets[0].data = data_set_tot;
        pie2.update();

    }

}

function StoreMode(controlDiv, map) {

    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";

    controlUI.style.cursor = "pointer";

    controlUI.style.textAlign = "center";
    controlUI.style.marginRight = "10px"

    controlUI.title = "Click to Visualize Supermarkets";
    controlDiv.appendChild(controlUI);
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Shop Mode";
    controlUI.appendChild(controlText);

    controlUI.addEventListener("click", () => {
        storemode = !storemode;
        controlUI.style.backgroundColor = storemode ? "#867E7E" : "#fff";
    });
}

function ClearMode(controlDiv, map) {

    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";

    controlUI.style.cursor = "pointer";

    controlUI.style.textAlign = "center";
    controlUI.style.marginRight = "10px"

    controlUI.title = "Click to Toggle All Markers";
    controlDiv.appendChild(controlUI);
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Toggle Markers";
    controlUI.appendChild(controlText);

    controlUI.addEventListener("click", () => {
        if (want_marker) {
            setMapOnAll(null);
        }
        else {
            setMapOnAll(map);
        }
        want_marker = !want_marker;
    });
}

function DeleteMode(controlDiv, map) {

    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";

    controlUI.style.cursor = "pointer";

    controlUI.style.textAlign = "center";
    controlUI.style.marginRight = "10px"

    controlUI.title = "Click to Delete All Markers";
    controlDiv.appendChild(controlUI);
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Delete All Markers";
    controlUI.appendChild(controlText);

    controlUI.addEventListener("click", () => {

        setMapOnAll(null);
        markers = [];

    });
}

function createDefaultInfo() {
    document.getElementById("state").textContent = "Country: United States of America";
    document.getElementById("county").textContent = "States: 50";
    document.getElementById("population").textContent = "Population: 328.2 Million";
    document.getElementById("la_score").textContent = "% of the Population that have Low Access: 18.4%";
    data_set_la = [46141453.851416856, 7089695.186951559, 2171380.4927133424, 719330.6703471893, 4032456.5625621667, 7266679.068240756].map(function (x) { return Math.round(x / 67420995.83223188 * 100 * 10) / 10 })
    data_set_tot = [60.1, 12.1, 5.4, 1.0, 3.0, 17.7];
    return [data_set_la, data_set_tot];
}

function onClick(e) {
    document.getElementById("state").textContent = null;
    document.getElementById("county").textContent = null;
    document.getElementById("impact").style.color = "white";
    document.getElementById("population").textContent = null;

    if (storemode) {
        e.feature.setProperty("clicked", true);

        var apple = {
            url: "https://i.ibb.co/0fdzRw4/appleicon.png",
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(30, 40)
        }
        const marker = new google.maps.Marker({
            position: e.latLng,
            map: map,
            icon: apple
        });
        markers.push(marker);
        console.log(markers);
        document.getElementById("impact").style.color = "black";
        document.getElementById("impact").textContent = "Each Store Will Positively Impact: " + Math.ceil(e.feature.getProperty("population") / e.feature.getProperty("area") * 10) + " low access people";
        keepscore.push(e.feature.getProperty("county"));
    }
    else {
        pieCharts(e, null);
    }

    document.getElementById("state").textContent = "State: " + e.feature.getProperty("state");
    document.getElementById("county").textContent = "County: " + e.feature.getProperty("county");
    document.getElementById("population").textContent = "Population: " + e.feature.getProperty("population_tot");

}

function mouseInToRegion(e) {
    e.feature.setProperty("hover", true);
    document.getElementById("state").textContent = "State: " + e.feature.getProperty("state");
    document.getElementById("county").textContent = "County: " + e.feature.getProperty("county");
    document.getElementById("population").textContent = "Population: " + e.feature.getProperty("population_tot");
    document.getElementById("data-caret").style.paddingLeft = 100 * ((e.feature.getProperty("LA_score") - censusMin) / (censusMax - censusMin)) + "%";
    document.getElementById("la_score").textContent = "% of the Population that have Low Access: " + Math.round((e.feature.getProperty("LA_score") * 10) / 10) + '%';
}

function mouseOutOfRegion(e) {
    e.feature.setProperty("hover", false);
}

function loadMapShapes() {
    map.data.loadGeoJson("https://gis.ers.usda.gov/arcgis/rest/services/fa_access/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=FIPSTXT&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson",
        { idPropertyName: "FIPSTXT" },
        function () {
            loadCensusData();
        }
    );
    statesLayer.loadGeoJson("https://storage.googleapis.com/mapsdevsite/json/states.js", { idPropertyName: "STATE" });
}

function loadCensusData() {

    link_la = "https://gis.ers.usda.gov/arcgis/rest/services/fa_access/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson";
    link_ppl = "https://gis.ers.usda.gov/arcgis/rest/services/ra_people/MapServer/13/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=FIPSTXT%2C+TotalPopEst2019%2C+WhiteNonHispanicPct2010%2C+BlackNonHispanicPct2010%2C+AsianNonHispanicPct2010%2C+NativeAmericanNonHispanicPct2010%2C+HispanicPct2010%2C+MultipleRacePct2010&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson"
    const xhr = new XMLHttpRequest();
    xhr.open("GET", link_la);
    xhr.onload = function () {
        const censusData = JSON.parse(xhr.responseText);
        censusData["features"].forEach((row) => {

            const objectid = row["attributes"]["FIPSTXT"];
            const population = row["attributes"]["LACCESS_POP15"];
            const la_score = row["attributes"]["PCT_LACCESS_POP15"] != null ? row["attributes"]["PCT_LACCESS_POP15"] : 50;

            const white = row["attributes"]["LACCESS_WHITE15"]
            const black = row["attributes"]["LACCESS_BLACK15"]
            const hisp = row["attributes"]["LACCESS_HISP15"]
            const asian = row["attributes"]["LACCESS_NHASIAN15"]
            const nhna = row["attributes"]["LACCESS_NHNA15"]
            const nhpi = row["attributes"]["LACCESS_NHPI15"]
            const mult = row["attributes"]["LACCESS_MULTIR15"]

            const state = row["attributes"]["State"]
            const county = row["attributes"]["County"]

            const area = row["attributes"]["Shape_Area"] * 3927;

            if (la_score < censusMin) {
                censusMin = la_score;
            }
            if (la_score > censusMax) {
                censusMax = la_score;
            }

            current_feature = map.data.getFeatureById(objectid);
            current_feature.setProperty("LA_score", la_score);
            current_feature.setProperty("area", area);
            current_feature.setProperty("white", white);
            current_feature.setProperty("black", black);
            current_feature.setProperty("hisp", hisp);
            current_feature.setProperty("asian", asian);
            current_feature.setProperty("nhna", nhna);
            current_feature.setProperty("nhpi", nhpi);
            current_feature.setProperty("mult", mult);

            current_feature.setProperty("population", population);
            current_feature.setProperty("state", state);
            current_feature.setProperty("county", county);

        });
        document.getElementById(
            "min"
        ).textContent = censusMin.toLocaleString() + '%';
        document.getElementById(
            "max"
        ).textContent = censusMax.toLocaleString() + '%';
    }

    const xhr2 = new XMLHttpRequest();
    xhr2.open("GET", link_ppl);
    xhr2.onload = function () {
        const ppl_data = JSON.parse(xhr2.responseText);
        ppl_data["features"].forEach((row) => {

            const objectid = row["attributes"]["FIPSTXT"];
            const population_tot = row["attributes"]["TotalPopEst2019"];
            const white_tot = row["attributes"]["WhiteNonHispanicPct2010"]
            const black_tot = row["attributes"]["BlackNonHispanicPct2010"]
            const hisp_tot = row["attributes"]["HispanicPct2010"]
            const asian_tot = row["attributes"]["AsianNonHispanicPct2010"]
            const nhna_tot = row["attributes"]["NativeAmericanNonHispanicPct2010"]
            const mult_tot = row["attributes"]["MultipleRacePct2010"]

            current_feature = map.data.getFeatureById(objectid);
            if (current_feature) {
                current_feature.setProperty("white_tot", white_tot);
                current_feature.setProperty("black_tot", black_tot);
                current_feature.setProperty("hisp_tot", hisp_tot);
                current_feature.setProperty("asian_tot", asian_tot);
                current_feature.setProperty("nhna_tot", nhna_tot);
                current_feature.setProperty("mult_tot", mult_tot);
                current_feature.setProperty("population_tot", population_tot);
            }
        });
    }
    xhr.send();
    xhr2.send();
}

function styleFeature(feature) {

    var low = [232, 50, 55];
    var high = [171, 99, 40];

    if (feature.getProperty("clicked")) {
        console.log("got style?")

        data_point = feature.getProperty('LA_score') - (feature.getProperty('LA_score') / feature.getProperty('area') * 100);
        feature.setProperty("LA_score", data_point);
        pieCharts(null, feature);
        document.getElementById("data-caret").style.paddingLeft = 100 * ((feature.getProperty("LA_score") - censusMin) / (censusMax - censusMin)) + "%";
        document.getElementById("la_score").textContent = "% of the Population that have Low Access: " + Math.round((feature.getProperty("LA_score") * 10) / 10) + '%';
        feature.setProperty('clicked', false);
    } else {
        data_point = feature.getProperty('LA_score');
    }

    if (feature.getProperty("hover")) {
        stroke = 2
    }
    else {
        stroke = 0;
    }

    var delta = (data_point - censusMin) / (censusMax - censusMin);
    var color = [];
    for (var i = 0; i < 3; i++) {
        color[i] = (high[i] - low[i]) * delta + low[i];
    }

    var showRow = true;
    if (feature.getProperty('LA_score') == null ||
        isNaN(feature.getProperty('LA_score'))) {
        showRow = false;
    }

    return {
        strokeWeight: stroke,
        strokeColor: '#fff',
        zIndex: 1,
        fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
        fillOpacity: 0.75,
        visible: showRow
    };
}