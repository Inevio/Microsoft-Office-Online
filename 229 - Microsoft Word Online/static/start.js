
if( params && params.command === 'openFile' ){

  if( params.mime === 'application/msword' ){
    api.app.createView( params, 'visor' )
  }else{
    api.app.createView( params, 'editor' )
  }

  return api.app.removeView( this )

}

start()
