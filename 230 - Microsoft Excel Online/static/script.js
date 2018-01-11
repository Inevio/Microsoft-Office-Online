
var FORMAT = 'Excel';
var win = $(this);

var _MIME_ = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
var _EXT_  = 'xlsx';
var _createFile = function( data, cb ){ wz.fs.create( data, cb ); };
var _close = function(){ wz.app.removeView(win); };
var _doTheJob = function( data, status ){

  if( status !== 'success' ){
    return alert(lang.openFileError, _close);
  }

  var frameholder = $('.frameholder')[ 0 ];
  var office_frame = $('<iframe></iframe>');

  office_frame.addClass('office_frame');
  office_frame.attr( 'name', 'office_frame_' + win.data('win') );
  office_frame.attr('allowfullscreen', 'true');
  frameholder.appendChild( office_frame[ 0 ] );

  $('[name="access_token"]').attr( 'value', data.token );
  $('[name="access_token_ttl"]').attr( 'value', data.expire );
  $('.office_form').attr( 'target', 'office_frame_' + win.data('win') );
  $('.office_form').attr( 'action', data.url );
  $('.office_form').submit();

}

if( params && params.command === 'openFile' ){

  $.ajax( { url : 'https://wopi.horbito.com/discover/edit/' + FORMAT + '/' + params.data, xhrFields : { withCredentials : true } }).done( _doTheJob );

}else{

  // Create file
  wz.fs.saveFile('root', { name : lang.newDocument, extension: _EXT_ }, function ( err, dstId, fileName ) {

    if( err ){
      return alert(lang.noFileError, _close);
    }

    var tmp = fileName.split('.');
    var ext = tmp.pop();
    var nme = tmp.join('.');
    //var data = ;
    var intent = 1;

    function work( err, node ) {

      if( err || !node ){
        if( err !== 'FILE NAME EXISTS ALREADY' ){
          return alert(lang.createFileError, _close);
        }else{
          //console.log('failed no node, file EXISTS', data);
          // data.name = data.name.split('.');
          // data.name.pop();
          // data.name = data.name.join('.');
          // data.name += ' (' + (intent++) + ')';
          return _createFile({
              name : nme + ' (' + (intent++) + ').' + ext,
              destiny : dstId,
              extension : ext,
              mime: _MIME_,
              data : ''
          }, work );
        }
      }

      $.ajax( { url : 'https://wopi.horbito.com/discover/editnew/' + FORMAT + '/' + node.id, xhrFields : { withCredentials : true } }).done( _doTheJob );

    }

    _createFile({
      name : nme + '.' + ext,
      destiny : dstId,
      extension : ext,
      mime: _MIME_,
      data : ''
    }, work );

  });

  // Generate file -> Get id
  //
  //   $.ajax( { url : 'https://wopi.horbito.com/discover/editnew/' + FORMAT + '/' + params.data, xhrFields : { withCredentials : true } }).done( function( data ){
  //alert('Microsoft Word Online para Inevio todavía no permite crear documentos nuevos');
}
