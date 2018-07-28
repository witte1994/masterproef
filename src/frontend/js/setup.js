var $grid;

$(document).ready(function() {
    var elem = document.querySelector('.draggable');
    
    $grid = $('.grid').packery({
        itemSelector: '.grid-item',
        // columnWidth helps with drop positioning
        columnWidth: 100
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

    var newModule = document.createElement("user-element");
    newModule.classList.add("grid-item");
    $grid.packery()
        .append(newModule)
        .packery('appended', newModule)
        // layout
        .packery();

    var draggie = new Draggabilly(newModule);
    $grid.packery('bindDraggabillyEvents', draggie);
}