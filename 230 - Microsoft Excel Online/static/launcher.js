
var _FORMAT_    = 'Excel';
var _MIME_      = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
var _EXT_       = 'xlsx';
var win         = $(this);
var _createFile = function( data, cb ){ api.fs.create( data, cb ); };
var _handleOpen = function( id ){

  api.app.createView( { command : 'openFile', data : id }, 'editor' );
  api.app.removeView( win );

};

$('.welcome').text( lang.welcome );
$('.welcome-text').text( lang.welcomeText );
$('.new span').text( lang.newDocument );
$('.open span').text( lang.openDocument );

$('.new').on( 'click', function(){

  // Create file
  api.fs.selectDestiny( { path : 'root', name : lang.newDocument, extension: _EXT_ }, function ( err, info ) {

    if( err ){
      return;
    }

    var tmp     = info.name.split('.');
    var ext     = tmp.pop();
    var nme     = tmp.join('.');
    var intent  = 1;
    var promise = $.Deferred();
    var work    = function( err, node ) {

      if( err || !node ){

        if( err !== 'FILE NAME EXISTS ALREADY' ){
          return alert( lang.createFileError );
        }

        return _createFile({
          name : nme + ' (' + (intent++) + ').' + ext,
          destiny : info.destiny,
          extension : ext,
          mime: _MIME_,
          data : ''
        }, work );

      }

      promise.resolve( node.id );

    };

    _createFile({
      name : nme + '.' + ext,
      destiny : info.destiny,
      extension : ext,
      mime: _MIME_,
      data : ''
    }, work );

    _handleOpen( promise );

  });

});

$('.open').on( 'click', function(){

  api.fs.selectSource( { path : 'root', title : 'Select file' }, function( err, files ){

    if( err ){
      return;
    }

    _handleOpen( files[ 0 ] );

  });

});
