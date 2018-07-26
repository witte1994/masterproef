$(document).ready(function() {
    $("#demo").html("Hello, World!");
    var elem = document.querySelector('.draggable');
    
    var $grid = $('.grid').packery({
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