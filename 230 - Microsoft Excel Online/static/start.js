
if( params && params.command === 'openFile' ){

  if( params.mime === 'application/vnd.ms-excel' ){
    api.app.createView( params, 'visor' )
  }else{
    api.app.createView( params, 'editor' )
  }

  return api.app.removeView( this )

}

start()
