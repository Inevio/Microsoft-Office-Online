
var WIN = $(this)
var FORMAT = 'Word'

$.ajax( { url : 'https://wopi.horbito.com/discover/view/' + FORMAT + '/' + params.data, xhrFields : { withCredentials : true } }).done( function( data, status ){

  if( status !== 'success' ){
    return alert('Error opening the file');
  }

  var frameholder = $('.frameholder')[ 0 ]
  var office_frame = $('<iframe></iframe>')

  office_frame.addClass('office_frame')
  office_frame.attr( 'name', 'office_frame_' + WIN.data('win') )
  office_frame.attr('allowfullscreen', 'true')
  frameholder.appendChild( office_frame[ 0 ] )

  $('[name="access_token"]').attr( 'value', data.token )
  $('[name="access_token_ttl"]').attr( 'value', data.expire )
  $('.office_form').attr( 'target', 'office_frame_' + WIN.data('win') )
  $('.office_form').attr( 'action', data.url )
  $('.office_form').submit()

})
