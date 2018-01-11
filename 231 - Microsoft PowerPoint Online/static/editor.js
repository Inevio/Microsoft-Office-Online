
var VALID_MIMES  = ['application/vnd.openxmlformats-officedocument.presentationml.presentation'];
var dontWait     = false;
var win          = $(this);
var width        = api.tool.desktopWidth();
var height       = api.tool.desktopHeight() - 70;
var windowObject = api.popup( 'https://static.inevio.com/app/231/editor.html', width, height ).render();

var timer = setInterval( function(){

  if( windowObject.closed ){

    api.view.remove();
    clearInterval( timer );

  }

}, 500 );

var _close = function(){
  api.app.removeView( win );
};

// Events
win
.on( 'ui-view-focus', function(){
  windowObject.focus();
})

.on( 'ui-view-removed', function(){
  windowObject.close();
});

$( (function(){return this;})() ).on( 'beforeunload', function(){
  windowObject.close();
});

// Start
if( !params || params.command !== 'openFile' ){
  return api.app.removeView( win );
}

if( typeof params.data !== 'object' ){

  dontWait    = params.data;
  params.data = $.Deferred();

}

params.data.done( function( id ){

  api.fs( id, function( error, fsnode ){

    if( error ){
      return alert( lang.openFileError, _close );
    }

    fsnode.getFormats( function( error, formats ){

      if( error ){
        return alert( lang.openFileError, _close );
      }

      if( !formats.original || !formats.original.size ){
        windowObject.location.href = 'https://static.inevio.com/app/231/editor.html?id=' + id + '&empty=1';
      }else if( VALID_MIMES.indexOf( formats.original.mime ) !== -1 ){
        windowObject.location.href = 'https://static.inevio.com/app/231/editor.html?id=' + id + '&empty=0';
      }else{
        alert( lang.openFileError, _close );
      }

    })

  });

});

if( dontWait ){
  params.data.resolve( dontWait );
}
