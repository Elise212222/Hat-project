let hats = JSON.parse(localStorage.getItem("schoolHats")) || [];
let scanner = null;
let scannerRunning = false;
let worldMap = null;

function saveHats() {
    localStorage.setItem("schoolHats", JSON.stringify(hats));
}
if (hats.length === 0) {

    hats = [
        {
            id: "HAT-001",
            type: "Bucket Hat",
            size: "S",
            colour: "Navy",
            status: "Available",
            assignedTo: "",
            location: "School Office",
            notes: "",
            created: new Date().toLocaleDateString(),
            locationData: null
        },

        {
            id: "HAT-002",
            type: "Bucket Hat",
            size: "M",
            colour: "Navy",
            status: "Assigned",
            assignedTo: "",
            location: "Year 5 Classroom",
            notes: "",
            created: new Date().toLocaleDateString(),
            locationData: null
        },

        {
            id: "HAT-003",
            type: "Wide Brim Hat",
            size: "L",
            colour: "Blue",
            status: "Missing",
            assignedTo: "",
            location: "Unknown",
            notes: "Please return to the office.",
            created: new Date().toLocaleDateString(),
            locationData: null
        }
    ];

    saveHats();
}
function showPage(pageName) {

    document.querySelectorAll(".page").forEach(function(page) {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageName);

    if (!selectedPage) {
        console.error("Page not found:", pageName);
        return;
    }

    selectedPage.classList.add("active-page");


    document.querySelectorAll(".nav-button").forEach(function(button) {

        button.classList.remove("active");

        const onclickValue = button.getAttribute("onclick");

        if (
            onclickValue &&
            onclickValue.includes("'" + pageName + "'")
        ) {
            button.classList.add("active");
        }

    });


    if (pageName === "dashboard") {
        updateDashboard();
        displayHats();
    }


    if (pageName === "hats") {
        displayAllHats();
    }


    if (pageName === "print") {
        generatePrintLabels();
    }


    if (pageName === "scan") {
        startScanner();
    }


    if (pageName === "map-page") {

        setTimeout(function() {

            createWorldMap();

            if (worldMap) {
                worldMap.invalidateSize();
            }

            updateMapMarkers();

        }, 100);
    }
}




function updateDashboard() {

    const total = document.getElementById("total-hats");
    const available = document.getElementById("available-hats");
    const assigned = document.getElementById("assigned-hats");
    const missing = document.getElementById("missing-hats");
    const retired = document.getElementById("retired-hats");


    if (total) {
        total.textContent = hats.length;
    }


    if (available) {
        available.textContent = hats.filter(function(hat) {
            return hat.status === "Available";
        }).length;
    }


    if (assigned) {
        assigned.textContent = hats.filter(function(hat) {
            return hat.status === "Assigned";
        }).length;
    }


    if (missing) {
        missing.textContent = hats.filter(function(hat) {
            return hat.status === "Missing";
        }).length;
    }


    if (retired) {
        retired.textContent = hats.filter(function(hat) {
            return hat.status === "Retired";
        }).length;
    }
}
function statusHTML(status) {

    const className =
        "status-" + String(status).toLowerCase();

    return (
        '<span class="status ' +
        className +
        '">' +
        status +
        "</span>"
    );
}


function displayHats() {

    const table =
        document.getElementById("hat-table");


    if (!table) {
        return;
    }


    const searchInput =
        document.getElementById("dashboard-search");


    const filterInput =
        document.getElementById("dashboard-filter");


    const search =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";


    const filter =
        filterInput
            ? filterInput.value
            : "all";


    const filteredHats =
        hats.filter(function(hat) {

            const matchesSearch =
                String(hat.id).toLowerCase().includes(search) ||
                String(hat.size).toLowerCase().includes(search) ||
                String(hat.status).toLowerCase().includes(search);


            const matchesFilter =
                filter === "all" ||
                hat.status === filter;


            return matchesSearch && matchesFilter;

        });


    table.innerHTML = "";


    if (filteredHats.length === 0) {

        table.innerHTML =
            '<tr>' +
            '<td colspan="6" style="text-align:center;">' +
            "No hats found 🎩" +
            "</td>" +
            "</tr>";

        return;
    }


    filteredHats.forEach(function(hat) {

        const row =
            document.createElement("tr");


        row.innerHTML =
            "<td><strong>" +
            hat.id +
            "</strong></td>" +

            "<td>" +
            hat.size +
            "</td>" +

            "<td>" +
            statusHTML(hat.status) +
            "</td>" +

            "<td>" +
            (hat.assignedTo || "—") +
            "</td>" +

            "<td>" +
            (hat.location || "—") +
            "</td>" +

            '<td>' +
            '<button class="view-button" ' +
            'onclick="openHat(\'' +
            hat.id +
            "')\">" +
            "View" +
            "</button>" +
            "</td>";


        table.appendChild(row);

    });
}
function displayAllHats() {

    const grid =
        document.getElementById("all-hats-grid");


    if (!grid) {
        return;
    }


    const searchInput =
        document.getElementById("hat-search");


    const filterInput =
        document.getElementById("hat-status-filter");


    const search =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";


    const filter =
        filterInput
            ? filterInput.value
            : "all";


    const filteredHats =
        hats.filter(function(hat) {

            const matchesSearch =
                String(hat.id).toLowerCase().includes(search) ||
                String(hat.size).toLowerCase().includes(search) ||
                String(hat.colour).toLowerCase().includes(search) ||
                String(hat.type).toLowerCase().includes(search);


            const matchesFilter =
                filter === "all" ||
                hat.status === filter;


            return matchesSearch && matchesFilter;

        });


    grid.innerHTML = "";


    if (filteredHats.length === 0) {

        grid.innerHTML =
            "<p>No hats found 🎩</p>";

        return;
    }


    filteredHats.forEach(function(hat) {

        const card =
            document.createElement("div");


        card.className =
            "hat-card";


        card.innerHTML =
            '<div class="hat-emoji">🎩</div>' +

            "<h3>" +
            hat.id +
            "</h3>" +

            '<div style="text-align:center; margin-bottom:12px;">' +
            statusHTML(hat.status) +
            "</div>" +

            '<div class="hat-info">' +

            "<strong>Type:</strong> " +
            hat.type +
            "<br>" +

            "<strong>Size:</strong> " +
            hat.size +
            "<br>" +

            "<strong>Colour:</strong> " +
            hat.colour +
            "<br>" +

            "<strong>Location:</strong> " +
            (hat.location || "—") +

            "</div>" +

            "<br>" +

            '<button class="primary-button" ' +
            'style="width:100%;" ' +
            'onclick="openHat(\'' +
            hat.id +
            "')\">" +

            "View Hat" +

            "</button>";


        grid.appendChild(card);

    });
}

function openHat(id) {

    const hat =
        hats.find(function(item) {
            return item.id === id;
        });


    if (!hat) {
        return;
    }


    const modal =
        document.getElementById("modal");


    const content =
        document.getElementById("modal-content");


    if (!modal || !content) {
        return;
    }


    let gpsInformation = "";


    if (
        hat.locationData &&
        typeof hat.locationData.latitude === "number" &&
        typeof hat.locationData.longitude === "number"
    ) {

        const lastScan =
            new Date(
                hat.locationData.timestamp
            ).toLocaleString("en-AU");


        gpsInformation =
            '<div style="background:#f1efff; padding:15px; ' +
            'border-radius:12px; margin:15px 0;">' +

            "<strong>🌍 Last Known GPS Location</strong>" +

            "<br><br>" +

            "Latitude: " +
            hat.locationData.latitude.toFixed(5) +

            "<br>" +

            "Longitude: " +
            hat.locationData.longitude.toFixed(5) +

            "<br><br>" +

            "🕒 Last scanned: " +
            lastScan +

            "<br><br>" +

            '<button class="primary-button" ' +
            'onclick="closeModal(); showPage(\'map-page\');">' +

            "🌍 View on World Map" +

            "</button>" +

            "</div>";

    } else {

        gpsInformation =
            '<div style="background:#f5f3fa; padding:15px; ' +
            'border-radius:12px; margin:15px 0;">' +

            "📍 No GPS location recorded yet." +

            "</div>";
    }


    content.innerHTML =

        '<div style="text-align:center;">' +

        '<div style="font-size:70px;">🎩</div>' +

        "<h2>" +
        hat.id +
        "</h2>" +

        statusHTML(hat.status) +

        "</div>" +

        '<hr style="margin:20px 0; border:none; border-top:1px solid #eee;">' +

        "<p><strong>Hat Type:</strong> " +
        hat.type +
        "</p>" +

        "<p><strong>Size:</strong> " +
        hat.size +
        "</p>" +

        "<p><strong>Colour:</strong> " +
        hat.colour +
        "</p>" +

        "<p><strong>Assigned To:</strong> " +
        (hat.assignedTo || "Not assigned") +
        "</p>" +

        "<p><strong>Location:</strong> " +
        (hat.location || "—") +
        "</p>" +

        "<p><strong>Notes:</strong> " +
        (hat.notes || "—") +
        "</p>" +

        gpsInformation +

        "<label><strong>Status</strong></label>" +

        '<select id="edit-status" ' +
        'style="width:100%; padding:12px; margin:8px 0 15px;">' +

        '<option value="Available"' +
        (hat.status === "Available" ? " selected" : "") +
        ">" +
        "Available" +
        "</option>" +

        '<option value="Assigned"' +
        (hat.status === "Assigned" ? " selected" : "") +
        ">" +
        "Assigned" +
        "</option>" +

        '<option value="Missing"' +
        (hat.status === "Missing" ? " selected" : "") +
        ">" +
        "Missing" +
        "</option>" +

        '<option value="Retired"' +
        (hat.status === "Retired" ? " selected" : "") +
        ">" +
        "Retired" +
        "</option>" +

        "</select>" +

        "<label><strong>Assigned To</strong></label>" +

        '<input id="edit-assigned" ' +
        'value="' +
        (hat.assignedTo || "") +
        '" placeholder="Staff-only information" ' +
        'style="width:100%; padding:12px; margin:8px 0 15px;">' +

        '<button class="primary-button" ' +
        'style="width:100%;" ' +
        'onclick="saveHatChanges(\'' +
        hat.id +
        "')\">" +

        "💾 Save Changes" +

        "</button>";
        

    modal.classList.add("show");
}
function saveHatChanges(id) {

    const hat =
        hats.find(function(item) {
            return item.id === id;
        });


    if (!hat) {
        return;
    }


    const statusInput =
        document.getElementById("edit-status");


    const assignedInput =
        document.getElementById("edit-assigned");


    if (statusInput) {
        hat.status = statusInput.value;
    }


    if (assignedInput) {
        hat.assignedTo = assignedInput.value;
    }


    saveHats();

    closeModal();

    updateDashboard();

    displayHats();

    displayAllHats();

    updateMapMarkers();
}
function closeModal() {

    const modal =
        document.getElementById("modal");


    if (modal) {
        modal.classList.remove("show");
    }
}
const hatForm =
    document.getElementById("hat-form");


if (hatForm) {

    hatForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            let number = 1;

            let id;


            do {

                id =
                    "HAT-" +
                    String(number).padStart(3, "0");

                number++;

            } while (
                hats.some(function(hat) {
                    return hat.id === id;
                })
            );


            const newHat = {

                id: id,

                type:
                    document.getElementById("hat-type").value,

                size:
                    document.getElementById("hat-size").value,

                colour:
                    document.getElementById("hat-colour").value,

                status: "Available",

                assignedTo: "",

                location:
                    document.getElementById("hat-location").value ||
                    "School Office",

                notes:
                    document.getElementById("hat-notes").value,

                created:
                    new Date().toLocaleDateString(),

                locationData: null
            };


            hats.push(newHat);

            saveHats();


            const qrContainer =
                document.getElementById("new-qr");


            if (
                qrContainer &&
                typeof QRCode !== "undefined"
            ) {

                qrContainer.innerHTML = "";


               const hatURL =
    window.location.origin +
    window.location.pathname +
    "?hat=" +
    encodeURIComponent(hat.id);

new QRCode(
    qr,
    {
        text: hatURL,
        width: 130,
        height: 130
    }
);
            }


            const newHatId =
                document.getElementById("new-hat-id");


            if (newHatId) {
                newHatId.textContent = id;
            }


            const generated =
                document.getElementById("generated-hat");


            if (generated) {
                generated.classList.remove("hidden");
            }


            hatForm.reset();


            updateDashboard();

            displayHats();

            displayAllHats();

        }
    );
}
function startScanner() {

    if (scannerRunning) {
        return;
    }


    const reader =
        document.getElementById("reader");


    const result =
        document.getElementById("scan-result");


    if (!reader) {
        return;
    }


    if (typeof Html5Qrcode === "undefined") {

        if (result) {

            result.innerHTML =
                '<div class="scan-error">' +
                "❌ QR scanner library could not load." +
                "</div>";
        }

        return;
    }


    scanner =
        new Html5Qrcode("reader");


    scanner.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,

            qrbox: {
                width: 250,
                height: 250
            }
        },

        function(decodedText) {

            handleQRCode(decodedText);

        },

        function() {

            // Normal scanner messages are ignored.

        }

    ).then(function() {

        scannerRunning = true;

    }).catch(function(error) {

        console.error(
            "Camera error:",
            error
        );


        if (result) {

            result.innerHTML =
                '<div class="scan-error">' +

                "❌ Camera could not start." +

                "<br><br>" +

                "Please allow camera access " +
                "and try again." +

                "</div>";
        }

    });
}

function handleQRCode(code) {

    const hat =
        hats.find(function(item) {
            return item.id === code;
        });


    const result =
        document.getElementById("scan-result");


    if (!result) {
        return;
    }


    if (!hat) {

        result.innerHTML =
            '<div class="scan-error">' +

            "❌ Hat not found." +

            "<br><br>" +

            "QR code: " +

            "<strong>" +
            code +
            "</strong>" +

            "</div>";

        return;
    }


    result.innerHTML =

        '<div class="scan-success">' +

        "<h3>" +
        "🎩 " +
        hat.id +
        " found!" +
        "</h3>" +

        "<br>" +

        "<p>" +

        "This will record the location " +
        "of the device currently scanning " +
        "the QR code." +

        "</p>" +

        "<br>" +

        '<button class="primary-button" ' +

        'onclick="recordHatLocation(\'' +
        hat.id +
        "')\">" +

        "📍 Record This Location" +

        "</button>" +

        "</div>";
}

function recordHatLocation(hatId) {

    const hat =
        hats.find(function(item) {
            return item.id === hatId;
        });


    const result =
        document.getElementById("scan-result");


    if (!hat || !result) {
        return;
    }


    if (!navigator.geolocation) {

        result.innerHTML =
            '<div class="scan-error">' +

            "❌ This device does not support " +
            "location services." +

            "</div>";

        return;
    }


    result.innerHTML =
        '<div class="scan-success">' +

        "📍 Getting device location..." +

        "<br><br>" +

        "Please allow location access " +
        "if your browser asks." +

        "</div>";


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            const timestamp =
                new Date().toISOString();


            hat.locationData = {

                latitude: latitude,

                longitude: longitude,

                timestamp: timestamp

            };


            hat.location =
                latitude.toFixed(5) +
                ", " +
                longitude.toFixed(5);


            saveHats();


            result.innerHTML =

                '<div class="scan-success">' +

                "<h3>✅ Location Updated!</h3>" +

                "<br>" +

                "<strong>" +
                hat.id +
                "</strong>" +

                "<br><br>" +

                "📍 Last-known location:" +

                "<br>" +

                latitude.toFixed(5) +
                ", " +
                longitude.toFixed(5) +

                "<br><br>" +

                "🕒 " +

                new Date(timestamp)
                    .toLocaleString("en-AU") +

                "<br><br>" +

                '<button class="primary-button" ' +

                'onclick="showPage(\'map-page\')">' +

                "🌍 View on Map" +

                "</button>" +

                "</div>";


            updateDashboard();

            displayHats();

            displayAllHats();

            updateMapMarkers();

        },


        function(error) {

            let message =
                "Unable to get the device location.";


            if (error.code === 1) {

                message =
                    "Location permission was denied.";

            } else if (error.code === 2) {

                message =
                    "The device could not determine " +
                    "its location.";

            } else if (error.code === 3) {

                message =
                    "The location request timed out.";
            }


            result.innerHTML =
                '<div class="scan-error">' +

                "❌ " +
                message +

                "<br><br>" +

                "Please try again." +

                "</div>";
        },


        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0
        }

    );
}
function createWorldMap() {

    if (worldMap !== null) {
        return;
    }


    const mapElement =
        document.getElementById("world-map");


    if (!mapElement) {
        return;
    }


    if (typeof L === "undefined") {

        console.error(
            "Leaflet has not loaded."
        );

        return;
    }


    worldMap =
        L.map("world-map", {
            worldCopyJump: true
        }).setView(
            [20, 0],
            2
        );


    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {
            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"
        }

    ).addTo(worldMap);


    updateMapMarkers();
}
function updateMapMarkers() {

    if (!worldMap) {
        return;
    }


    worldMap.eachLayer(function(layer) {

        if (layer instanceof L.Marker) {

            worldMap.removeLayer(layer);

        }

    });


    let locatedHats = 0;


    hats.forEach(function(hat) {

        if (
            !hat.locationData ||
            typeof hat.locationData.latitude !== "number" ||
            typeof hat.locationData.longitude !== "number"
        ) {
            return;
        }


        locatedHats++;


        const latitude =
            hat.locationData.latitude;


        const longitude =
            hat.locationData.longitude;


        const marker =
            L.marker([
                latitude,
                longitude
            ]).addTo(worldMap);


        const scanTime =
            new Date(
                hat.locationData.timestamp
            ).toLocaleString("en-AU");


        marker.bindPopup(

            "<div>" +

            "<h3>🎩 " +
            hat.id +
            "</h3>" +

            "<p>" +

            "<strong>Status:</strong> " +
            hat.status +

            "</p>" +

            "<p>" +

            "<strong>Size:</strong> " +
            hat.size +

            "</p>" +

            "<p>" +

            "<strong>Last scanned:</strong>" +

            "<br>" +

            scanTime +

            "</p>" +

            "<p>" +

            "<strong>Coordinates:</strong>" +

            "<br>" +

            latitude.toFixed(5) +
            ", " +
            longitude.toFixed(5) +

            "</p>" +

            "</div>"
        );

    });


    const count =
        document.getElementById("map-count");


    if (count) {

        count.textContent =
            locatedHats +
            " hat" +
            (locatedHats === 1 ? "" : "s") +
            " located";
    }
}
function generatePrintLabels() {

    const area =
        document.getElementById("print-area");


    if (!area) {
        return;
    }


    area.innerHTML = "";


    hats.forEach(function(hat) {

        const label =
            document.createElement("div");


        label.className =
            "qr-label";


        const title =
            document.createElement("h3");


        title.textContent =
            "🎩 School Hat";


        label.appendChild(title);


        const qr =
            document.createElement("div");


        qr.className =
            "qr-label-code";


        label.appendChild(qr);


        const id =
            document.createElement("h3");


        id.textContent =
            hat.id;


        label.appendChild(id);


        const size =
            document.createElement("p");


        size.textContent =
            "Size: " +
            hat.size;


        label.appendChild(size);


        area.appendChild(label);


        if (typeof QRCode !== "undefined") {

         const hatURL =
    window.location.origin +
    window.location.pathname +
    "?hat=" +
    encodeURIComponent(hat.id);

new QRCode(
    qr,
    {
        text: hatURL,
        width: 130,
        height: 130
    }
);
        }

    });
}

function printQRLabels() {

    generatePrintLabels();


    setTimeout(function() {

        window.print();

    }, 300);
}

const todayElement =
    document.getElementById("today");


if (todayElement) {

    todayElement.textContent =
        new Date().toLocaleDateString(
            "en-AU",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
}
updateDashboard();

displayHats();

displayAllHats();
function checkForHatFromURL() {

    const params =
        new URLSearchParams(window.location.search);

    const hatID =
        params.get("hat");

    if (!hatID) {
        return;
    }

    const hat =
        hats.find(function(item) {
            return item.id === hatID;
        });

    if (!hat) {
        console.error("Hat not found:", hatID);
        return;
    }

    console.log("QR code opened for:", hatID);

    /*
       Automatically ask the device for its location.
    */

    recordHatLocation(hatID);
}


checkForHatFromURL();
