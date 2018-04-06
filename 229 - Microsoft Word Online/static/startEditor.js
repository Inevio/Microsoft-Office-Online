var win = $(this)

var userAgent = navigator.userAgent.toLowerCase()
if (userAgent.indexOf(' electron/') === -1) {
   win.hide()
}
start()