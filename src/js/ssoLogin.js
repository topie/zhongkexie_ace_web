/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var vkey = "zhongkexie_" + new Date().getTime() + "_" + Math.floor(Math.random() * 10);
		//var returnUrl = 'http%3A%2F%2Fznxtptyyzx.cast.org.cn%3A8010%2Fsword%3Fctrl%3DYyInstallCtrl_processInstall%26yyuuid%3Dad812d65745b4f02a80a8367e1232b96%26yybbuuid%3D7d097322b58145589388042ea2968622';
		var returnUrl = GetQueryString("returnUrl");
		var userUUID = GetQueryString("zhnlpgxt_YYBDXX");
		if (returnUrl != undefined &&returnUrl != null && $.trim(returnUrl) != "") {
			returnUrl = decodeURIComponent(returnUrl);
		} else {
			if (userUUID != undefined &&userUUID !=null && $.trim(userUUID) != "") {
				var fields = JSON.stringify(
						{
							"username": "sso",
							"password": "pa",
							"vcode": userUUID,
							"vkey": vkey
						});
					$.ajax({
						type: 'POST',
						url: App.href + "/api/token/ssogenerate",
						contentType: "application/json",
						dataType: "json",
						data: fields,
						success: function (result) {
							if (result.code === 200) {
								$.cookie(App.token_key, result.token, {expires: 7});
								window.location.href = App.href + "/index.html";
							} else {
								alert("请求错误，请联系管理员，"+result.message);
							}
						}
					});
			} else {
				alert("returnUrl未定义！")
			}
		}
	function GetQueryString(name) {
	   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
	   var r = window.location.search.substr(1).match(reg);
	   if (r!=null) return (r[2]); return null;
	}
    function initLogin() {
        $("#captcha_img").attr("src", App.href + "/api/noneAuth/captcha?vkey=" + vkey);
        $("#captcha_a").on("click", function () {
            vkey = "zhongkexie_" + new Date().getTime() + "_" + Math.floor(Math.random() * 10);
            $("#captcha_img").attr("src", App.href + "/api/noneAuth/captcha?vkey=" + vkey + "&s=" + new Date().getTime());
        });
        $('#username,#password,#vcode').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                login();
            }
        });
        $("#login_btn").on("click", login);
    }

    /*function alertValidate(alertText) {
        var alertTmpl = '<div class="alert alert-${type_} alert-dismissable" role="alert">'
            + '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
            + '${alert_}</div>';
        var alertDiv = $.tmpl(alertTmpl, {
            "type_": 'warning',
            "alert_": alertText
        });
        $("#login-form").prepend(alertDiv);
        alertDiv.delay(5 * 1000).fadeOut();
        App.scrollTo(alertDiv, -200);
    }*/
	function alertValidate(alertText) {
		$(".widget-main h4").html(alertText);
	}
    var login = function () {
        if ($.trim($("#username").val()) == "") {
            alertValidate("登录名不能为空!");
            $("#captcha_a").trigger("click");
            return;
        }
        if ($.trim($("#password").val()) == "") {
            alertValidate("密码不能为空!");
            $("#captcha_a").trigger("click");
            return;
        }
        if ($.trim($("#vcode").val()) == "") {
            alertValidate('验证码不能为空!');
            $("#captcha_a").trigger("click");
            return;
        }
        var fields = JSON.stringify(
            {
                "username": $("#username").val(),
                "password": $("#password").val(),
                "vcode": $("#vcode").val(),
                "vkey": vkey
            });
		
        $.ajax({
            type: 'POST',
            url: App.href + "/api/token/generate",
            contentType: "application/json",
            dataType: "json",
            data: fields,
            success: function (result) {
                if (result.code === 200) {
                    $.cookie(App.token_key, result.token, {expires: 7});
					$.ajax({
								type: 'GET',
								url: App.href + "/api/index/loadCurrentUser",
								dataType: "json",
								success: function (result) {
									if (result.code === 200) {
										var code = result.data.userCode;
										var and = '?';
										if(returnUrl.indexOf("?")!=-1){
											and="&";
										}
										var href = returnUrl+and+'returnValue='+code;
										window.location.href = href;
									} else {
										alert("获取用户失败！")
									}
								}
							});
                } else {
                    alertValidate(result.message);
                    $("#captcha_a").trigger("click");
                }
            }
        });
    };
    $(document).ready(function () {
        initLogin();
    });
})(jQuery, window, document);
