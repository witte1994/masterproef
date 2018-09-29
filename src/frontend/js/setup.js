var $grid;
var $smallGrid;

var onMainGrid = true;

$(document).ready(function () {
    var elem = document.querySelector('.draggable');

    $grid = $('#mainGrid').packery({
        itemSelector: '.grid-item',
        columnWidth: 20,
        transitionDuration: 0
    });

    $smallGrid = $('#smallGrid').packery({
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
    } else if (srcElement === "ajaxGetLayout") {
        loadLayout(e.detail.response);
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
    var mainPositions = getMainElements();
    var smallPositions = getSmallElements();

    return {small: smallPositions, main: mainPositions};
}

function getMainElements() {
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

function getSmallElements() {
    var elements = $smallGrid.packery('getItemElements');

    var order = [];
    for (var i = 0; i < elements.length; i++) {
        order.push(elements[i].children[1].tagName.toLowerCase());
    }

    return order;
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

    loadLayoutProcess();
}

function loadLayoutProcess() {
    var ajaxGetLayout = document.querySelector('#ajaxGetLayout');
    ajaxGetLayout.url = "http://localhost:3000/user/" + window.sessionStorage.getItem('userId') + "/layout";
    ajaxGetLayout.generateRequest();
}

function loadLayout(elements) {
    var container = createModuleContainer("heart-element-small");
    addContainerToGrid(container);
}

function clearGrids() {
    var userElement = document.querySelector('#userElement');
    if (userElement != null)
        userElement.parentNode.removeChild(userElement);

    var elements = $grid.packery('getItemElements');
    $grid.packery('remove', elements);
    var elementsSmall = $smallGrid.packery('getItemElements');
    $smallGrid.packery('remove', elementsSmall);
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
    onMainGrid = true;
    var module = document.getElementById("moduleMenu").selectedItem.getAttribute("value");
    var size = document.getElementById("sizeMenu").selectedItem.getAttribute("value");

    var moduleName = module + size;

    var container = createModuleContainer(moduleName);
    addContainerToGrid(container);
}

function createModuleContainer(moduleName) {
    var newModule = document.createElement(moduleName);
    var parentDiv = document.createElement("div");
    parentDiv.classList.add("grid-item");

    parentDiv.style.width = getModuleSize(moduleName);

    var handlerDiv = document.createElement("div");
    handlerDiv.classList.add("handle");

    parentDiv.appendChild(handlerDiv);
    parentDiv.appendChild(newModule);

    addListeners(parentDiv, newModule);

    return parentDiv;
}

function addContainerToGrid(container) {
    var tarGrid;

    if (onMainGrid) tarGrid = $grid;
    else tarGrid = $smallGrid;

    tarGrid.packery()
        .append(container)
        .packery('appended', container)
        .packery();

    var draggie = new Draggabilly(container, {
        handle: '.handle'
    });
    tarGrid.packery('bindDraggabillyEvents', draggie);
}

function getModuleSize(moduleName) {
    if (moduleName.split('-').length == 3) {
        return "360px";
    } else {
        return "700px";
    }
}

function addSmall() {
    onMainGrid = false;
    var moduleName = document.getElementById("moduleMenuSmall").selectedItem.getAttribute("value");

    var container = createModuleContainer(moduleName);
    addContainerToGrid(container);
}

function addListeners(parent, mod) {
    addRemoveListener(parent, mod);

    if (onMainGrid) {
        addResizeListener(parent, mod);
    }
    
}

function addRemoveListener(parent, mod) {
    var tarGrid;

    if (onMainGrid) tarGrid = $grid;
    else tarGrid = $smallGrid;

    mod.addEventListener('delete', function (e) {
        tarGrid.packery('remove', parent).packery('shiftLayout');
    });
}

function addResizeListener(parent, mod) {
    mod.addEventListener('resize', function (e) {
        $grid.packery('remove', parent).packery('shiftLayout');

        onMainGrid = true;
        var resizeTo = e.detail.resizeTo;
        
        var parentDiv = createModuleContainer(resizeTo);
        addContainerToGrid(parentDiv);
    });
}