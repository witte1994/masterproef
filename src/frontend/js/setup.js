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

        var patientList = document.createElement("patient-list-element");
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
            width: elements[i].offsetWidth,
            height: elements[i].offsetHeight
        };
        positions.push(savePos);
    }

    return positions;
}

function getSmallElements() {
    var elements = $smallGrid.packery('getItemElements');

    var order = [];
    for (var i = 0; i < elements.length; i++) {
        var pos = {
            elementName: elements[i].children[1].tagName.toLowerCase(),
            height: elements[i].offsetHeight
        };

        order.push(pos);
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

    addUserElement();

    loadLayoutProcess();
}

function addUserElement() {
    var userElement = document.createElement("user-element");
    userElement.setAttribute("id", "userElement");
    var refElement = document.querySelector('#smallGrid');
    document.querySelector('#drawerLayout').insertBefore(userElement, refElement);
}

function loadLayoutProcess() {
    var ajaxGetLayout = document.querySelector('#ajaxGetLayout');
    ajaxGetLayout.url = "http://localhost:3000/user/" + window.sessionStorage.getItem('userId') + "/layout";
    ajaxGetLayout.generateRequest();
}

function loadLayout(elements) {
    if (elements == null)
        return;

    loadSmallLayout(elements.small);
    loadMainLayout(elements.main);
}

function loadSmallLayout(elements) {
    onMainGrid = false;
    for (var i = 0; i < elements.length; i++) {
        var container = createModuleContainer(elements[i].elementName);
        container.style.height = elements[i].height + "px";
        addContainerToGrid(container);
    }
}

function loadMainLayout(elements) {
    onMainGrid = true;

    for (var i = 0; i < elements.length; i++) {
        var container = createModuleContainer(elements[i].elementName);
        container.style.width = elements[i].width + "px";
        container.style.height = elements[i].height + "px";
        addContainerToGrid(container);
        $grid.packery('fit', container, elements[i].x, elements[i].y);
    }
}

function clearGrids() {
    var userElement = document.querySelector('#userElement');
    if (userElement != null)
        userElement.parentNode.removeChild(userElement);

    var userElementSmall = document.querySelector('#userElementSmall');
    if (userElementSmall != null)
        userElementSmall.parentNode.removeChild(userElementSmall);

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
    var moduleName = document.getElementById("moduleMenu").selectedItem.getAttribute("value");

    var container = createModuleContainer(moduleName);
    addContainerToGrid(container);
}

function createModuleContainer(moduleName) {
    var newModule = document.createElement(moduleName);
    newModule.setAttribute("update", false);

    var parentDiv = document.createElement("div");
    parentDiv.classList.add("grid-item");
    parentDiv.classList.add("containerGrid");

    if (!onMainGrid) {
        parentDiv.classList.add("resizeDivVert");
        parentDiv.style.minWidth = "100%";
        parentDiv.addEventListener("sizeSmall", function (e) {
            parentDiv.style.minHeight = e.detail;
        });
    } else {
        parentDiv.classList.add("resizeDiv");
        parentDiv.addEventListener("size", function (e) {
            parentDiv.style.minWidth = e.detail.width;
            parentDiv.style.minHeight = e.detail.height;
        });
    }
    
    var handlerDiv = document.createElement("div");
    handlerDiv.classList.add("handle");

    parentDiv.appendChild(handlerDiv);
    parentDiv.appendChild(newModule);

    addListeners(parentDiv, newModule);

    return parentDiv;
}

function addContainerToGrid(container) {
    var tarGrid = getTargetGrid();

    tarGrid.packery()
        .append(container)
        .packery('appended', container)
        .packery();

    var draggie = new Draggabilly(container, {
        handle: '.handle'
    });
    tarGrid.packery('bindDraggabillyEvents', draggie);
}

function addSmall() {
    onMainGrid = false;
    var moduleName = document.getElementById("moduleMenuSmall").selectedItem.getAttribute("value");

    var container = createModuleContainer(moduleName);
    addContainerToGrid(container);
}

function addListeners(parent, mod) {
    addRemoveListener(parent, mod);

    var updateStr = mod.tagName.split("-")[0].toLowerCase();
    mod.addEventListener(updateStr, function (e) {
        sendUpdateSignal(updateStr);
    });

    if (onMainGrid) {
        addResizeListener(parent, mod);
        new ResizeSensor(parent, function () {
            $grid.packery('shiftLayout');
        });
    } else {
        new ResizeSensor(parent, function () {
            $smallGrid.packery('shiftLayout');
        });
    }
}

function sendUpdateSignal(updateStr) {
    var elements = $grid.packery('getItemElements');

    for (var i = 0; i < elements.length; i++) {
        var curElement = elements[i].children[1];
        var curName = curElement.tagName.split("-")[0].toLowerCase();

        if (curName === updateStr) {
            curElement.update();
        }
    }

    var elements = $smallGrid.packery('getItemElements');
    for (var i = 0; i < elements.length; i++) {
        var curElement = elements[i].children[1];
        var curName = curElement.tagName.split("-")[0].toLowerCase();

        if (curName === updateStr) {
            curElement.update();
        }
    }
}

function addRemoveListener(parent, mod) {
    var tarGrid = getTargetGrid();

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

function getTargetGrid() {
    if (onMainGrid)
        return $grid;
    else
        return $smallGrid;
}