
var WIN = $(this)
var FORMAT = 'PowerPoint'

api.app.maximizeView( WIN )

$.ajax({ url : 'https://wopi.horbito.com/linkpreview/' + FORMAT + location.pathname, xhrFields : { withCredentials : true } }).done( function( data, status ){

  var frameholder  = $('.frameholder')[ 0 ]
  var office_frame = $('<iframe></iframe>')

  office_frame.addClass('office_frame')
  office_frame.attr( 'name', 'office_frame' )
  office_frame.attr('allowfullscreen', 'true')
  frameholder.appendChild( office_frame[ 0 ] )

  $('title').text( data.name + ' - ' + $('title').text() )
  $('[name="access_token"]').attr( 'value', data.token )
  $('[name="access_token_ttl"]').attr( 'value', data.expire )
  $('.office_form').attr( 'target', 'office_frame' )
  $('.office_form').attr( 'action', data.url )
  $('.office_form').submit()

})
