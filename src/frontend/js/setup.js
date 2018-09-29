var $grid;
var $gridSmall;

$(document).ready(function () {
    var elem = document.querySelector('.draggable');

    $grid = $('#mainGrid').packery({
        itemSelector: '.grid-item',
        columnWidth: 20,
        transitionDuration: 0
    });

    $gridSmall = $('#smallGrid').packery({
        itemSelector: '.grid-item',
        columnWidth: 20,
        transitionDuration: 0
    });
});

document.addEventListener('iron-ajax-response', function(e) {
    var srcElement = e.srcElement.id;

    if (srcElement === "ajaxLogin") {
        window.sessionStorage.accessToken = e.detail.response.token;

        var patientList = document.createElement("patient-list");
        var dialog = document.querySelector('#patientDialog');
        dialog.appendChild(patientList);
        dialog.toggle();
    }
});

document.addEventListener('iron-ajax-error', function (e) {
    var srcElement = e.srcElement.id;

    if (srcElement === "ajaxLogin") {
        document.querySelector('#loginError').open();;
    }    
});

document.addEventListener('patient-click', function (e) {
    var dialog = document.querySelector('#patientDialog');
    dialog.toggle();

    
    var split = document.URL.split("/");
    var param = split[split.length-1];
    window.sessionStorage.setItem('userId', param);

    loadPatientPage();
});

function saveLayout() {
    var positions = getElementPositions();

    savePositions(positions);
}

function getElementPositions() {
    var mainGrid = document.getElementById("mainGrid");
    var elements = $grid.packery('getItemElements');

    var posMain = getPosition(mainGrid);
    var positions = [];
    var offset = { x: 0, y: 0 };
    for (var i = 0; i < elements.length; i++) {
        var pos = getPosition(elements[i]);

        offset.x = pos.x - posMain.x;
        offset.y = pos.y - posMain.y;
        var savePos = {
            elementName: elements[i].children[1].tagName.toLowerCase(),
            x: offset.x,
            y: offset.y,
            width: elements[i].offsetWidth
        };
        positions.push(savePos);
    }

    return positions;
}

function savePositions(positions) {
    var ajaxSaveLayout = document.querySelector('#ajaxSaveLayout');

    ajaxSaveLayout.url = "http://localhost:3000/user/" + window.sessionStorage.getItem('userId') + "/layout";

    ajaxSaveLayout.body = {
        layout: positions
    };
    ajaxSaveLayout.generateRequest();
}

function getPosition(element) {
    var rect = element.getBoundingClientRect();
    return { x: rect.left, y: rect.top, xRight: rect.right, yBottom: rect.bottom };
}

function loadPatientPage() {
    clearGrids();
    var userElement = document.createElement("user-element");
    userElement.setAttribute("id", "userElement");
    var refElement = document.querySelector('#smallGrid');
    document.querySelector('#drawer').insertBefore(userElement, refElement);

    /*
    var testElement = document.createElement("test-element");
    addModuleToGrid(testElement, "s","large");

    var testElement2 = document.createElement("test-element");
    addModuleToGrid(testElement2, "s", "large");*/
}

function clearGrids() {
    var userElement = document.querySelector('#userElement');
    if (userElement != null)
        userElement.parentNode.removeChild(userElement);

    var elements = $grid.packery('getItemElements');
    $grid.packery('remove', elements);
    var elementsSmall = $gridSmall.packery('getItemElements');
    $gridSmall.packery('remove', elementsSmall);
}

function login() {
    var loginVal = document.querySelector('#login').value;
    var passwordVal = document.querySelector('#password').value;

    var ajaxLogin = document.querySelector('#ajaxLogin');
    ajaxLogin.body = {
        "login": loginVal,
        "password": passwordVal
    };
    ajaxLogin.generateRequest();
}

function add() {
    var module = document.getElementById("moduleMenu").selectedItem.getAttribute("value");
    var size = document.getElementById("sizeMenu").selectedItem.getAttribute("value");

    var newModule = null;
    if (module === "heart") {
        if (size === "s") newModule = document.createElement("heart-element-small");
        else if (size === "l") newModule = document.createElement("heart-element");
    } else if (module === "bp") {
        if (size === "s") newModule = document.createElement("bp-element-small");
        else if (size === "l") newModule = document.createElement("bp-element");
    } else if (module === "bs") {
        if (size === "s") newModule = document.createElement("bs-element-small");
        else if (size === "l") newModule = document.createElement("bs-element");
    } else if (module === "weight") {
        if (size === "s") newModule = document.createElement("weight-element-small");
        else if (size === "l") newModule = document.createElement("weight-element");
    } else if (module === "oxygen") {
        if (size === "s") newModule = document.createElement("oxygen-element-small");
        else if (size === "l") newModule = document.createElement("oxygen-element");
    } else if (module === "medication") {
        if (size === "s") newModule = document.createElement("medication-element-small");
        else if (size === "l") newModule = document.createElement("medication-element");
    }

    if (newModule != null) {
        addModuleToGrid(newModule, size, "large");
    }
}

function addModuleToGrid(newModule, size, gridStr) {
    var targetGrid;

    if (gridStr === "large")
        targetGrid = $grid;
    else
        targetGrid = $gridSmall;

    var parentDiv = document.createElement("div");
    parentDiv.classList.add("grid-item");
    //parentDiv.classList.add("resizeDiv");
    if (size === "s")
        parentDiv.style.width = "360px";
    else
        parentDiv.style.width = "700px";

    var handlerDiv = document.createElement("div");
    handlerDiv.classList.add("handle");

    parentDiv.appendChild(handlerDiv);
    parentDiv.appendChild(newModule);

    targetGrid.packery()
        .append(parentDiv)
        .packery('appended', parentDiv)
        .packery();

    var draggie = new Draggabilly(parentDiv, {
        handle: '.handle'
    });
    targetGrid.packery('bindDraggabillyEvents', draggie);

    if (gridStr === "large")
        addListeners(parentDiv, newModule);
    else
        addSmallListeners(parentDiv, newModule);
}

function addSmall() {
    var module = document.getElementById("moduleMenuSmall").selectedItem.getAttribute("value");

    var newModule = null;
    if (module === "heart") {
        newModule = document.createElement("heart-element-small");
    } else if (module === "bp") {
        newModule = document.createElement("bp-element-small");
    } else if (module === "bs") {
        newModule = document.createElement("bs-element-small");
    } else if (module === "weight") {
        newModule = document.createElement("weight-element-small");
    } else if (module === "oxygen") {
        newModule = document.createElement("oxygen-element-small");
    } else if (module === "medication") {
        newModule = document.createElement("medication-element-small");
    }

    if (newModule != null) {
        addModuleToGrid(newModule, "s", "small");
    }
}

function addListeners(parent, mod) {
    addRemoveListener(parent, mod, $grid);

    mod.addEventListener('resize', function (e) {
        $grid.packery('remove', parent).packery('shiftLayout');

        var resizeTo = e.detail.resizeTo;
        var newModule = document.createElement(resizeTo);

        var parentDiv = document.createElement("div");
        parentDiv.classList.add("grid-item");
        if (resizeTo.split('-').length == 3)
            parentDiv.style.width = "360px";
        else
            parentDiv.style.width = "700px";

        var handlerDiv = document.createElement("div");
        handlerDiv.classList.add("handle");

        parentDiv.appendChild(handlerDiv);
        parentDiv.appendChild(newModule);

        $grid.packery()
            .append(parentDiv)
            .packery('appended', parentDiv)
            .packery();

        var draggie = new Draggabilly(parentDiv, {
            handle: '.handle'
        });
        $grid.packery('bindDraggabillyEvents', draggie);

        addListeners(parentDiv, newModule);
    });
}

function addSmallListeners(parent, mod) {
    addRemoveListener(parent, mod, $gridSmall);
}

function addRemoveListener(parent, mod, grid) {
    mod.addEventListener('delete', function (e) {
        grid.packery('remove', parent).packery('shiftLayout');
    });
}