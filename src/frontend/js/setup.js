var $grid;

$(document).ready(function() {
    var elem = document.querySelector('.draggable');
    
    $grid = $('.grid').packery({
        itemSelector: '.grid-item',
        columnWidth: 20,
        transitionDuration: 0
    });

    // make all grid-items draggable
    $grid.find('.grid-item').each(function (i, gridItem) {
        var draggie = new Draggabilly(gridItem);

        // bind drag events to Packery
        $grid.packery('bindDraggabillyEvents', draggie);
        addListeners(gridItem);
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
    }

    if (newModule != null) {
        newModule.classList.add("grid-item");
        $grid.packery()
            .append(newModule)
            .packery('appended', newModule)
            .packery();

        var draggie = new Draggabilly(newModule);
        $grid.packery('bindDraggabillyEvents', draggie);

        addListeners(newModule);
    }
}

function addListeners(module) {
    module.addEventListener('delete', function (e) {
        $grid.packery('remove', module).packery('shiftLayout');
    });

    module.addEventListener('resize', function (e) {
        $grid.packery('remove', module).packery('shiftLayout');

        var resizeTo = e.detail.resizeTo;
        var newModule = document.createElement(resizeTo);

        newModule.classList.add("grid-item");
        $grid.packery()
            .append(newModule)
            .packery('appended', newModule)
            .packery();

        var draggie = new Draggabilly(newModule);
        $grid.packery('bindDraggabillyEvents', draggie);

        addListeners(newModule);
    });
}