var $grid;

$(document).ready(function() {
    var elem = document.querySelector('.draggable');
    
    $grid = $('.grid').packery({
        itemSelector: '.grid-item',
        // columnWidth helps with drop positioning
        columnWidth: 20
    });

    // make all grid-items draggable
    $grid.find('.grid-item').each(function (i, gridItem) {
        var draggie = new Draggabilly(gridItem);
        // bind drag events to Packery
        $grid.packery('bindDraggabillyEvents', draggie);
    });
});

function add() {
    var module = document.getElementById("moduleMenu").selectedItem.getAttribute("value");
    var size = document.getElementById("sizeMenu").selectedItem.getAttribute("value");

    var mainGrid = document.getElementById("mainGrid");

    var newModule = null;
    if (module === "heart") {
        if (size === "s") newModule = document.createElement("heart-element-small");
    }

    if (newModule != null) {
        newModule.classList.add("grid-item");
        $grid.packery()
            .append(newModule)
            .packery('appended', newModule)
            .packery();

        var draggie = new Draggabilly(newModule);
        $grid.packery('bindDraggabillyEvents', draggie);
    }
}