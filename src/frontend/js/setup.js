var $grid;
var $gridSmall;

document.addEventListener('iron-ajax-response', function(e) {
    var srcElement = e.srcElement.id;

    if (srcElement === "ajaxLogin") {
        window.sessionStorage.accessToken = e.detail.response.token;
        var ajaxPatients = document.querySelector('#ajaxPatients');
        ajaxPatients.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        ajaxPatients.generateRequest();
    } else if (srcElement === "ajaxPatients") {
        openPatientsDialog(e.detail.response);
    }
});

document.addEventListener('iron-ajax-error', function (e) {
    var srcElement = e.srcElement.id;

    if (srcElement === "ajaxLogin") {
        document.querySelector('#loginError').open();;
    } else if (srcElement === "ajaxPatients") {
        console.log("patients fail");
    }
    
});

function openPatientsDialog(patients) {
    var listbox = document.querySelector('#listbox');
    for (i in patients) {
        var paperItem = document.createElement("paper-item");
        paperItem.setAttribute("value", patients[i]._id);
        
        var paperBody = document.createElement("paper-item-body");
        var patientString = patients[i].lastName + " " + patients[i].firstName;
        paperBody.innerHTML = patientString;
        
        var paperButton = document.createElement("paper-icon-button");
        paperButton.classList.add("patientSelector");
        paperButton.setAttribute("icon", "arrow-forward");
        paperButton.addEventListener("click", function() {
            document.querySelector('#patientDialog').toggle();
            var patientId = this.parentElement.getAttribute("value");
            window.history.pushState("", "", "/"+patientId);

            loadPatientPage();
        });

        paperItem.appendChild(paperBody);
        paperItem.appendChild(paperButton);
        listbox.appendChild(paperItem);
    }

    document.querySelector('#patientDialog').open();
}

function loadPatientPage() {
    clearGrids();
    var userElement = document.createElement("user-element");
    userElement.setAttribute("id", "userElement");
    var refElement = document.querySelector('#smallGrid');
    document.querySelector('#drawer').insertBefore(userElement, refElement);
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

$(document).ready(function() {
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
        var parentDiv = document.createElement("div");
        parentDiv.classList.add("grid-item");
        if (size === "s") 
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
    }
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
        var parentDiv = document.createElement("div");
        parentDiv.classList.add("grid-item");
        parentDiv.style.width = "360px";

        var handlerDiv = document.createElement("div");
        handlerDiv.classList.add("handle");

        parentDiv.appendChild(handlerDiv);
        parentDiv.appendChild(newModule);

        $gridSmall.packery()
            .append(parentDiv)
            .packery('appended', parentDiv)
            .packery();

        var draggie = new Draggabilly(parentDiv, {
            handle: '.handle'
        });
        $gridSmall.packery('bindDraggabillyEvents', draggie);

        addSmallListeners(parentDiv, newModule);
    }
}

function addListeners(parent, mod) {
    mod.addEventListener('delete', function (e) {
        $grid.packery('remove', parent).packery('shiftLayout');
    });

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
    mod.addEventListener('delete', function (e) {
        $gridSmall.packery('remove', parent).packery('shiftLayout');
    });
}