
if( !cordova.getAppVersion ){
  navigator.notification.alert( lang.need115Version )
  return setTimeout( function(){ api.view.remove( false ) }, 10 )
}

if( !params || !params.command === 'openFile' ){
  navigator.notification.alert( lang.openFileError )
  return setTimeout( function(){ api.view.remove( false ) }, 10 )
}

    var _doTheJob = function( data, status ){

      if( status !== 'success' ){
        alert('Error opening the file');
        return window.close();
      }

      var frameholder  = $('.frameholder')[ 0 ];
      var office_frame = $('<iframe></iframe>');

      office_frame.addClass('office_frame');
      office_frame.attr( 'name', 'office_frame' );
      office_frame.attr('allowfullscreen', 'true');
      frameholder.appendChild( office_frame[ 0 ] );

      $('title').text( data.name + ' - ' + $('title').text() );
      $('[name="access_token"]').attr( 'value', data.token );
      $('[name="access_token_ttl"]').attr( 'value', data.expire );
      $('.office_form').attr( 'target', 'office_frame' );
      $('.office_form').attr( 'action', data.url );
      $('.office_form').submit();

    };

/*  <style>
    body{
      background: #217346 url(https://static.inevio.com/app/230/logo.png) center center no-repeat;
      background-size: 172px 36px;
    }

    .office_frame {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
  </style>*/

// Variables
var win    = $( this )
var window = win.parents().slice( -1 )[ 0 ].parentNode.defaultView
var FORMAT = 'Excel'

// Start
api.fs( params.data, function( err, fsnode ){

  $('.file-name').text(fsnode.name);
  $('.file-preview').css('background-image', 'url(' + fsnode.icons[512] + ')');
  $('.loading').text(lang.loading);

  $.ajax( { url : 'https://wopi.horbito.com/discover/embedview/' + FORMAT + '/' + fsnode.id, xhrFields : { withCredentials : true } }).done( function( data, status ){

    if( status !== 'success' ){
      navigator.notification.alert( lang.openFileError )
      return setTimeout( function(){ api.view.remove( false ) }, 10 )
    }

    console.log( data.url )
    $.post( data.url, { access_token : data.token, access_token_ttl : data.expire } )
    .done( function( data ){

      //data = data.replace('</head>','<base href="http://www.w3schools.com/images/"></head>')

      var frameholder  = $('.frameholder')[ 0 ];
      var office_frame = $('<iframe></iframe>');

      office_frame.addClass('office_frame');
      office_frame.attr( 'name', 'office_frame' );
      office_frame.attr('allowfullscreen', 'true');
      frameholder.appendChild( office_frame[ 0 ] );

      var iframe = office_frame[ 0 ].contentWindow || ( office_frame[ 0 ].contentDocument.document || office_frame[ 0 ].contentDocument);

      iframe.document.open();
      iframe.document.write( data );
      iframe.document.close();

    })

  })

})
