
if( !cordova.getAppVersion ){
  navigator.notification.alert( lang.need115Version )
  return setTimeout( function(){ api.view.remove( false ) }, 10 )
}

if( !params || !params.command === 'openFile' ){
  navigator.notification.alert( lang.openFileError )
  return setTimeout( function(){ api.view.remove( false ) }, 10 )
}

// Variables
var win    = $( this )
var window = win.parents().slice( -1 )[ 0 ].parentNode.defaultView
var FORMAT = 'Word'
var IS_ANDROID = typeof device !== 'undefined' && device.platform.toLowerCase().indexOf('android') !== -1

// Start
api.fs( params.data, function( err, fsnode ){

  $('.file-name').text(fsnode.name);
  $('.loading').text(lang.loading);
  $('.opening-text').text(lang.opening);
  var image = new Image();
  image.src = fsnode.icons[512];
  $('.file-preview').css('background-image', 'url(' + fsnode.icons[512] + ')');

  $(image).load(function () {
      //console.log( (image.width + 'x' + image.height) );

      $('.file-preview').css({

        'width'  : (image.width/2),
        'height' : (image.height/2),
        'background-size' : (image.width/2) + 'px ' + (image.height/2) + 'px'

      })

      .transition({
        'opacity' : 1
      },200);

  });

  $.ajax( { url : 'https://wopi.horbito.com/discover/embedview/' + FORMAT + '/' + fsnode.id, xhrFields : { withCredentials : true } }).done( function( data, status ){

    if( status !== 'success' ){
      navigator.notification.alert( lang.openFileError )
      return setTimeout( function(){ api.view.remove( false ) }, 10 )
    }

    $.post( data.url, { access_token : data.token, access_token_ttl : data.expire } )
    .done( function( data ){

      var url   = $('<div></div>').html( data ).find('#FirstPageImage').attr('src')
      var query = {}

      url.split('?')[ 1 ].split('&').forEach( function( param ){
        param = param.split('=')
        query[ param[ 0 ] ] = param[ 1 ]
      })

      var pdfUrl  = 'https://word-view.officeapps.live.com/wv/WordViewer/request.pdf?'
      pdfUrl     += 'WOPIsrc=' + query.WOPIsrc
      pdfUrl     += '&access_token=' + query.access_token
      pdfUrl     += '&access_token_ttl=' + query.access_token_ttl
      pdfUrl     += '&z=' + query.z
      pdfUrl     += '&type=printpdf'

      window.resolveLocalFileSystemURL( IS_ANDROID ? cordova.file.externalCacheDirectory : cordova.file.dataDirectory, function( dirEntry ){

        dirEntry.getFile( Date.now() + '-' + fsnode.name, { create: true, exclusive: false }, function (fileEntry) {

          var fileTransfer = new FileTransfer()
          var fallbackExecuted = false
          var fallback = function( entry ){

            if( fallbackExecuted ){
              return
            }

            fallbackExecuted = true

            cordova.plugins.fileOpener2.open( IS_ANDROID ? decodeURI( entry.nativeURL ) : entry.nativeURL, 'application/pdf', {
              error : function(e) {
                console.log('Error status: ' + e.status + ' - Error message: ' + e.message)
              },
              success : function () {
                console.log('file opened successfully');
                api.view.remove( false );
              }
            })

          }

          var backWidth = $('.progress-bar').width();
          var percentage;

          fileTransfer.onprogress = function( progressEvent ){

            percentage = ( progressEvent.loaded / progressEvent.total );

            $('.progress-bar-loaded').width( backWidth * percentage );
            $('.progress-text').text( parseInt(percentage*100) + '%' );

          }

          fileTransfer.download( pdfUrl, fileEntry.nativeURL, function( entry ){

              cordova.plugins.SitewaertsDocumentViewer.viewDocument( entry.toURL(), 'application/pdf', {},
                function(){},
                function(){

                  $('.progress-bar-loaded').width( 0 );
                  $('.progress-text').text( '0%' );
                  api.view.remove( false );

                },
                function(){ fallback( entry ) },
                function(){ fallback( entry ) }
              )

            },
            function (error) {

              $('.progress-bar-loaded').width( 0 );
              $('.progress-text').text( '0%' );

              console.log("download error source " + error.source)
              console.log("download error target " + error.target)
              console.log("upload error code" + error.code)
              navigator.notification.alert( lang.openFileError )
              return setTimeout( function(){ api.view.remove( false ) }, 10 )
            },
            null,
            {}

          )

        })

      })

    })
    .fail( function( data ){
      console.log( 'fail', data )
    })

  })

})
