function oAuth2AuthenticateDialog(id) {
    let uri = "/auth-module/oauth2?provider_id="+id;
    var oAuthDialog = window.open(uri, "oAuth2AuthenticateDialog", "width=700,height=500");
    window.callback = function (result) {
        console.log(result)
    }
}
function oAuthCloseDialog (res) {
    window.opener.callback(res);
    window.close();
}