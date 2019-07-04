
var VALID_MIMES = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
var ALIAS = api.system.workplace().alias
var dontWait = false;
var win = $(this);
var width = api.tool.desktopWidth();
var height = api.tool.desktopHeight() - 70;
var isElectron = false

var userAgent = navigator.userAgent.toLowerCase()
if (userAgent.indexOf(' electron/') > -1) {
  // Electron-specific code
  isElectron = true
}

if (!isElectron) {

  var windowObject = api.popup('https://cdn.horbito.com/app/230/editor.html', width, height).render();

  var timer = setInterval(function () {

    if (windowObject.closed) {

      api.view.remove();
      clearInterval(timer);

    }

  }, 500);

  var _close = function () {
    api.app.removeView(win);
  };

  // Events
  win
    .on('ui-view-focus', function () {
      windowObject.focus();
    })

    .on('ui-view-removed', function () {
      windowObject.close();
    });

  $((function () { return this; })()).on('beforeunload', function () {
    windowObject.close();
  });

  // Start
  if (!params || params.command !== 'openFile') {
    return api.app.removeView(win);
  }

}else{
  win.on('ui-view-focus', function (e) {
    if($('webview').length){
      $('webview').blur()
      $('webview')[0].focus()
      $('webview').focus()
      setTimeout(()=>{
        $('webview').blur()
        $('webview').focus()
        $('webview')[0].focus()
      },500)     
    }else{
      setTimeout(()=>{
        $('webview').blur()
        $('webview').focus()
        $('webview')[0].focus()
      },2000)
    }
  })
}

if (typeof params.data !== 'object') {

  dontWait = params.data;
  params.data = $.Deferred();

}

params.data.done(function (id) {

  console.log(params)

  if (params.gdrive) {

    api.integration.gdrive(params.gdrive, function (err, account) {

      if (err) {
        return alert(lang.openFileError, _close);
      }

      account.get(id, function (err, entry) {

        console.log(err)
        if (err) {
          return alert(lang.openFileError, _close);
        }

        if (isElectron) {
          let webviewDom = `<webview src="https://cdn.horbito.com/app/230/editor.html?id=${encodeURIComponent('gdrive:' + params.gdrive + ':' + id)}&empty=0&w=${ALIAS}" autosize plugins allowpopups></webview>`
          win.append(webviewDom)
        } else {
          windowObject.location.href = 'https://cdn.horbito.com/app/230/editor.html?id=' + encodeURIComponent('gdrive:' + params.gdrive + ':' + id) + `&empty=0&w=${ALIAS}`
        }

        // To Do -> Improve check like horbito's files

      })

    })

  } else if (params.dropbox) {

    api.integration.dropbox(params.dropbox, function (err, account) {

      console.log(err, account)

      if (err) {
        return alert(lang.openFileError, _close);
      }

      account.get(id, function (err, entry) {

        console.log(err)
        if (err) {
          return alert(lang.openFileError, _close);
        }

        if (isElectron) {
          let webviewDom = `<webview src="https://cdn.horbito.com/app/230/editor.html?id=${encodeURIComponent('dropbox:' + params.dropbox + ':' + id)}&empty=0&w=${ALIAS}" autosize plugins allowpopups></webview>`
          win.append(webviewDom)
        } else {
          windowObject.location.href = 'https://cdn.horbito.com/app/230/editor.html?id=' + encodeURIComponent('dropbox:' + params.dropbox + ':' + id) + `&empty=0&w=${ALIAS}`
        }

        // To Do -> Improve check like horbito's files

      })

    })

  } else if (params.onedrive) {

    api.integration.onedrive(params.onedrive, function (err, account) {

      account.get(id, function (err, entry) {

        if (err) {
          return alert(lang.openFileError, _close);
        }

        if (isElectron) {
          let webviewDom = `<webview src="https://cdn.horbito.com/app/230/editor.html?id=${encodeURIComponent('onedrive:' + params.onedrive + ':' + id)}&empty=0&w=${ALIAS}" autosize plugins allowpopups></webview>`
          win.append(webviewDom)
        } else {
          windowObject.location.href = 'https://cdn.horbito.com/app/230/editor.html?id=' + encodeURIComponent('onedrive:' + params.onedrive + ':' + id) + `&empty=0&w=${ALIAS}`
        }

        // To Do -> Improve check like horbito's files

      })

    })

  } else {

    api.fs(id, function (error, fsnode) {

      if (error) {
        return alert(lang.openFileError, _close);
      }

      fsnode.getFormats(function (error, formats) {

        if (error) {
          return alert(lang.openFileError, _close);
        }

        if (!formats.original || !formats.original.size) {

          if (isElectron) {
            let webviewDom = `<webview src="https://cdn.horbito.com/app/230/editor.html?id=${id}&empty=1&w=${ALIAS}" autosize plugins allowpopups></webview>`
            win.append(webviewDom)
          } else {
            windowObject.location.href = 'https://cdn.horbito.com/app/230/editor.html?id=' + id + `&empty=1&w=${ALIAS}`
          }

        } else if (VALID_MIMES.indexOf(formats.original.mime) !== -1) {

          if (isElectron) {
            let webviewDom = `<webview src="https://cdn.horbito.com/app/230/editor.html?id=${id}&empty=0&w=${ALIAS}" autosize plugins allowpopups></webview>`
            win.append(webviewDom)
          } else {
            windowObject.location.href = 'https://cdn.horbito.com/app/230/editor.html?id=' + id + `&empty=0&w=${ALIAS}`
          }

        } else {
          alert(lang.openFileError, _close);
        }

      })

    });

  }

});

if (dontWait) {
  params.data.resolve(dontWait);
}
