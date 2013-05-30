$(function () {

  var socket = io.connect(),
      pad = $('#pad'),
      thumb = $('#thumb');

  
  function move (horizontal, vertical) {
    console.log('move', horizontal, vertical);
    socket.emit('move', horizontal, vertical);
  }

  function light (enabled) {
    console.log('light', enabled);
    socket.emit('light', enabled);
  }

  thumb.draggable({
    containment: pad
  })
  .on('mousedown', function () {
    light(true);
  })
  .on('mouseup', function () {
    light(false);
  })
  .on('drag', function (event) {

    var padRect = pad[0].getBoundingClientRect(),
        padLeft = padRect.left,
        padTop = padRect.top,
        padWidth = padRect.width,
        padHeight = padRect.height,

        thumbRect = thumb[0].getBoundingClientRect(),
        thumbLeft = thumbRect.left,
        thumbTop = thumbRect.top,
        thumbWidth = thumbRect.width,
        thumbHeight = thumbRect.height,
        
        offsetLeft = thumbLeft - padLeft,
        offsetTop = thumbTop - padTop,
        
        rangeLeft = padWidth - thumbWidth,
        rangeTop = padHeight - thumbHeight,
        
        horizontal = offsetLeft / rangeLeft,
        vertical = offsetTop / rangeTop;
        
    move(1 - horizontal, vertical);
  });
  
});