/**
 * Created by chenguojun on 9/28/16.
 */
;
(function ($, window, document, undefined) {
    App.menu = {
        "initSideMenu": initSideMenu,
        "toggleMenu": toggleMenu,
        "initHMenu": initHMenu,
        "showUserInfo": showUserInfo,
        "showTaskInfo": showTaskInfo
    };
	var vkey = "zhongkexie_" + new Date().getTime() + "_" + Math.floor(Math.random() * 10);
	var userUUID = GetQueryString("zhnlpgxt_YYBDXX");
	document.getElementsByTagName('body')[0].style.zoom=0.85;
	function GetQueryString(name) {
	   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
	   var r = window.location.search.substr(1).match(reg);
	   if (r!=null) return (r[2]); return null;
	}
    App.menusMapping = {};
		String.prototype.endWith = function(str){
			 if(str==null || str=="" || this.length == 0 ||str.length > this.length){	
			   return false;
			 }
			 if(this.substring(this.length - str.length)==str){
				 return true;
			 }else{
				 return false;
			 }
			 return true;
		};
    function toggleMenu() {
        var toggle = $.cookie('spring-menu-toggle');
        if (toggle === undefined) {
            toggle = "s";
        }
        if (toggle === "s") {
            $.cookie('spring-menu-toggle', "v", {expires: 7, path: '/'});
        } else {
            $.cookie('spring-menu-toggle', "s", {expires: 7, path: '/'});
        }
    }
	function showUserInfo(title) {
        var modal = $.orangeModal({
            id: "userForm",
            title: "修改信息",
            destroy: true,
            buttons: [
                {
                    type: 'button',
                    cls: 'btn-default',
                    text: '关闭',
                    handle: function (m) {
                        m.hide();
                    }
                }
            ]
        }).show();
		if(title){
			modal.$body.append('<div class="alert alert-danger">'+title+'</div>');
		}
        App.menu.userOption.ajaxSuccess = function () {
            modal.hide();
			window.location.href = '../login.html';
        };
		var uoption = App.menu.userOptionNoLinkMan;
		if(App.currentUser.loginName.endWith("001")){
			uoption = App.menu.userOption;
		}
		if(App.currentUser.userType==4){
			uoption.items[1].label="姓名";
		}
        var form = modal.$body.orangeForm(uoption);
        form.loadRemote(App.href + "/api/index/loadCurrentUser");
    }
	function showTaskInfo() {
        var modal = $.orangeModal({
            id: "exportList",
            title: "导出任务列表",
            destroy: true,
            buttons: [
                {
                    type: 'button',
                    cls: 'btn-default',
                    text: '关闭',
                    handle: function (m) {
                        m.hide();
                    }
                }
            ]
        }).show().$body.orangeGrid(App.menu.taskGridOption);
    }
    function initHMenu() {
        var ul = "#h-menu";
        var sidebar = $('<div id="h-sidebar" class="sidebar h-sidebar navbar-collapse collapse ace-save-state">' +
            /**'<div class="sidebar-shortcuts" id="sidebar-shortcuts">' +
            '    <div class="sidebar-shortcuts-mini" id="sidebar-shortcuts-mini">' +
            '<span class="btn btn-success"></span>' +
            '<span class="btn btn-info"></span>' +
            '<span class="btn btn-warning"></span>' +
            '<span class="btn btn-danger"></span>' +
            '    </div>' +
            '</div>' +*/
            '<ul id="h-menu" class="nav nav-list">' +
            '</ul>' +
            '    </div>');
        $("#main-container").prepend(sidebar);
        $("#menu-toggler").attr("data-target", "#h-sidebar");
        $.ajax(
            {
                type: 'GET',
                url: App.href + "/api/index/current",
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        var menus = result.data.functionList;
                        var userInfo = result.data.user;
                        App.currentUser = userInfo;
                        $("#spring_login_user_name").text(userInfo.displayName);
						if(userInfo.lastPasswordReset==null ||userInfo.lastPasswordReset === undefined){
							App.menu.showUserInfo();
						}
                        $.each(menus, function (i, m) {
                            App.menusMapping[m.action] = m.functionName;
                        });
                        var topMenus = getTopMenu(menus);
                        $.each(topMenus, function (i, m) {
                            if (m.parentId == 0) {
                                var drop = '';
                                var b = '';
                                var subMenus = getSubMenu(menus, m.id);
                                if (subMenus.length > 0) {
                                    drop = 'class="dropdown-toggle" ';
                                    b = '<b class="arrow fa fa-angle-down"></b>';
                                }
                                var ele =
                                    '<li class="hover">'
                                    + '<a data-url="' + m.action
                                    + '" data-title="' + m.functionName
                                    + '" href="javascript:void(0);" ' + drop + '><i class="menu-icon '+m.icon+'"></i> '
                                    + '<span class="menu-text">' + m.functionName + '</span>' + b + '</a>';

                                if (subMenus.length > 0) {
                                    ele = secondHMenu(ele, menus, subMenus);
                                }
                                ele += '</li>';
                                var li = $(ele);
                                $(ul).append(li);
                            }
                        });
                        $(ul).find("a[data-url!=#]")
                            .each(function () {
                                    var url = $(this).attr("data-url");
                                    $(this).on("click", function () {
                                        window.location.href = App.href + '/index.html?u=' + url;
                                    });
                                }
                            );
                        refreshHref(ul);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    }
                },
                error: function (err) {
                }
            }
        );
    }

    function initSideMenu() {
        var ul = "#side-menu";
        var sidebar = $('<div id="sidebar" class="sidebar responsive ace-save-state">' +
            '<ul id="side-menu" class="nav nav-list">' +
            '</ul>' +
            '<div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">' +
            '<i id="sidebar-toggle-icon" class="ace-icon fa fa-angle-double-left ace-save-state" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>' +
            '</div>' +
            '</div>');
        $("#main-container").prepend(sidebar);
        $("#menu-toggler").attr("data-target", "#sidebar");
        $.ajax(
            {
                type: 'GET',
                url: App.href + "/api/index/current",
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        var menus = result.data.functionList;
                        var userInfo = result.data.user;
                        App.currentUser = userInfo;
                        $("#spring_login_user_name").text(userInfo.displayName);
						if(userInfo.lastPasswordReset==null ||userInfo.lastPasswordReset === undefined){
							App.menu.showUserInfo("初次登录请修改密码，并完善信息！");
						}
                        $.each(menus, function (i, m) {
                            App.menusMapping[m.action] = m.functionName;
                        });
                        var topMenus = getTopMenu(menus);
                        $.each(topMenus, function (i, m) {
                            if (m.parentId == 0) {
                                var drop = '';
                                var b = '';
                                var subMenus = getSubMenu(menus, m.id);
                                if (subMenus.length > 0) {
                                    drop = 'class="dropdown-toggle" ';
                                    b = '<b class="arrow fa fa-angle-down"></b>';
                                }
                                var ele =
                                    '<li class="">'
                                    + '<a data-url="' + m.action
                                    + '" data-title="' + m.functionName
                                    + '" href="javascript:void(0);" ' + drop + '><i class="menu-icon '+m.icon+'"></i> '
                                    + '<span class="menu-text">' + m.functionName + '</span>' + b + '</a>';

                                if (subMenus.length > 0) {
                                    ele = secondMenu(ele, menus, subMenus);
                                }
                                ele += '</li>';
                                var li = $(ele);
                                $(ul).append(li);
                            }
                        });
                        $(ul).find("a[data-url!=#]")
                            .each(function () {
                                    var url = $(this).attr("data-url");
                                    $(this).on("click", function () {
                                        window.location.href = App.href + '/index.html?u=' + url;
                                    });
                                }
                            );
                        refreshHref(ul);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    }
                },
                error: function (err) {
                }
            }
        );
    }


    function getSubMenu(menus, menuId) {
        var subMenus = [];
        $.each(menus, function (i, m) {
            if (m.parentId == menuId) {
                subMenus.push(m);
            }
        });
        return subMenus;
    }

    function getMenu(menus, menuId) {
        var subMenus = [];
        $.each(menus, function (i, m) {
            if (m.id == menuId) {
                subMenus.push(m);
            }
        });
        return subMenus;
    }

    function getTopMenu(menus) {
        var topMenus = [];
        $.each(menus, function (i, m) {
            if (m.parentId == 0) {
                topMenus.push(m);
            } else {
                var subMenus = getMenu(menus, m.parentId);
                if (subMenus.length == 0) {
                    topMenus.push(m);
                }
            }
        });
        return topMenus;
    }

    function secondMenu(ele, menus, subMenus) {
        if (subMenus.length > 0) {
            ele += "<ul class='submenu'>";
            $.each(subMenus, function (i, m) {
                var drop = '';
                var b = '';
                var sMenus = getSubMenu(menus, m.id);
                if (sMenus.length > 0) {
                    drop = 'class="dropdown-toggle" ';
                    b = '<b class="arrow fa fa-angle-down"></b>';
                }
                ele += ('<li class="" data-level="sub">'
                    + '<a ' + drop + ' data-url="' + m.action
                    + '" data-title="' + m.functionName
                    + '" href="javascript:void(0);"><i class="menu-icon '+m.icon+'"></i> '
                    + m.functionName) + b + '</a>';
                ele += '</li>';
            });
            ele += "</ul>";
        }
        return ele;
    }

    function secondHMenu(ele, menus, subMenus) {
        if (subMenus.length > 0) {
            ele += "<ul class='submenu'>";
            $.each(subMenus, function (i, m) {
                var drop = '';
                var b = '';
                var sMenus = getSubMenu(menus, m.id);
                if (sMenus.length > 0) {
                    drop = 'class="dropdown-toggle" ';
                    b = '<b class="arrow fa fa-angle-down"></b>';
                }
                ele += ('<li class="hover" data-level="sub">'
                    + '<a ' + drop + ' data-url="' + m.action
                    + '" data-title="' + m.functionName
                    + '" href="javascript:void(0);">'
                    + m.functionName) + b + '</a>';
                ele += '</li>';
            });
            ele += "</ul>";
        }
        return ele;
    }


    var refreshHref = function (ul) {
        var location = window.location.href;
        var url = location.substring(location.lastIndexOf("?u=") + 3);
        if (location.lastIndexOf("?u=") > 0 && url != undefined && $.trim(url) != "") {
           
        } else {
            //window.location.href = App.href + "/index.html?u=/api/index";
			url="/api/index";
        }
		 var title = App.menusMapping[url];
            var f = App.requestMapping[url];
            var a = $(ul).find("a[data-url='" + url + "']");
            var li1 = a.parent('li');
            var li2 = a.parent().parent().parent('li');
            var li3 = a.parent().parent().parent().parent().parent('li');
            $('#breadcrumb').empty();
            li1.addClass("active");
            $('#breadcrumb').prepend($('<li>' + li1.find('a:eq(0)').text() + '</li>'));
            if (li2.length > 0) {
                li2.addClass("active").addClass("open");
                $('#breadcrumb').prepend($('<li>' + li2.find('a:eq(0)').text() + '</li>'));
            }
            if (li3.length > 0) {
                li3.addClass("active").addClass("open");
                $('#breadcrumb').prepend($('<li>' + li3.find('a:eq(0)').text() + '</li>'));
            }
            if (f != undefined) {
                App[f].page(title);
            } else {
                loadCommonMenu(url, title);
            }

    };

    var loadCommonMenu = function (url, title) {
        $.ajax(
            {
                type: 'GET',
                url: App.href + url,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        App.content.empty();
                        var data = result.data;
                        App.title(title);
                        App.content.append(data.content);
                    } else {
                        alert(result.message);
                    }
                },
                error: function (e) {
                    alert("页面不存在");
                    window.location.href = App.href + "/index.html?u=/api/index";
                }
            }
        );
    };
App.menu.userOptionNoLinkMan = {
        id: "current_user_form",//表单id
        name: "current_user_form",//表单名
        method: "POST",//表单method
        action: App.href + "/api/index/updateUser",
        ajaxSubmit: true,//是否使用ajax提交表单
		ajaxSuccess:function(data){
			bootbox.alert("修改成功");
            window.location.href = App.href + "/index.html?u=/api/index";
		},

        submitText: "提交",//保存按钮的文本
        showReset: true,//是否显示重置按钮
        resetText: "重置",//重置按钮文本
        isValidate: true,//开启验证
        buttonsAlign: "center",
        items: [
            {
                type: 'hidden',
                name: 'id',
                id: 'id'
            }, {
                type: 'display',//类型
                name: 'displayName',//name
                id: 'displayName',//id
                label: '名称',//左边label
                cls: 'input-large'
            }, {
                type: 'password',//类型
                name: 'password',//name
                id: 'password',//id
                label: '旧密码',//左边label
                cls: 'input-xxlarge',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入旧密码"
                }
            }, {
                type: 'password',//类型
                name: 'newPassword',//name
                id: 'newPassword',//id
                label: '新密码',//左边label
                cls: 'input-xxlarge',
                rule: {
                    minlength: 6,
                    maxlength: 64
                },
                message: {
                    minlength: "至少{0}位",
                    maxlength: "做多{0}位"
                }
            }, {
                type: 'password',//类型
                name: 'newPassword2',//name
                id: 'newPassword2',//id
                label: '确认新密码',//左边label
                cls: 'input-xxlarge',
                rule: {
                    minlength: 6,
                    maxlength: 64,
					equalTo:"#newPassword"
                },
                message: {
                    minlength: "至少{0}位",
                    maxlength: "做多{0}位",
					equalTo:"两次输入密码不一致"
                }
            }, {
                type: 'text',//类型
                name: 'contactPhone',//name
                id: 'contactPhone',//id
                label: '手机号',
                cls: 'input-xxlarge',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入手机号"
                }
            }, {
                type: 'text',//类型
                name: 'email',//name
                id: 'email',//id
                label: '邮箱',
                cls: 'input-xxlarge',
                rule: {
                    email: true,
					required: true
                },
                message: {
                    email: "请输入正确的邮箱",
					required: "请输入邮箱"
                }
            }
        ]
    };

	App.menu.userOption = {
        id: "current_user_form",//表单id
        name: "current_user_form",//表单名
        method: "POST",//表单method
        action: App.href + "/api/index/updateUser",
		ajaxSuccess:function(data){
			bootbox.alert("修改成功");
            window.location.href = App.href + "/index.html?u=/api/index";
		},
        ajaxSubmit: true,//是否使用ajax提交表单
        submitText: "提交",//保存按钮的文本
        showReset: true,//是否显示重置按钮
        resetText: "重置",//重置按钮文本
        isValidate: true,//开启验证
        buttonsAlign: "center",
        items: [
            {
                type: 'hidden',
                name: 'id',
                id: 'id'
            }, {
                type: 'display',//类型
                name: 'displayName',//name
                id: 'displayName',//id
                label: '名称',//左边label
                cls: 'input-large'
            }, {
                type: 'text',//类型
                name: 'linkMan',//name
                id: 'linkMan',//id
                label: '学会负责人姓名',//左边label
                cls: 'input-xxlarge',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入学会负责人姓名"
                }
            }, {
                type: 'password',//类型
                name: 'password',//name
                id: 'password',//id
                label: '旧密码',//左边label
                cls: 'input-xxlarge',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入旧密码"
                }
            }, {
                type: 'password',//类型
                name: 'newPassword',//name
                id: 'newPassword',//id
                label: '新密码',//左边label
                cls: 'input-xxlarge',
                rule: {
                    minlength: 6,
                    maxlength: 64
                },
                message: {
                    minlength: "至少{0}位",
                    maxlength: "做多{0}位"
                }
            }, {
                type: 'password',//类型
                name: 'newPassword2',//name
                id: 'newPassword2',//id
                label: '确认新密码',//左边label
                cls: 'input-xxlarge',
                rule: {
                    minlength: 6,
                    maxlength: 64,
					equalTo:"#newPassword"
                },
                message: {
                    minlength: "至少{0}位",
                    maxlength: "做多{0}位",
					equalTo:"两次输入密码不一致"
                }
            }, {
                type: 'text',//类型
                name: 'contactPhone',//name
                id: 'contactPhone',//id
                label: '手机号',
                cls: 'input-xxlarge',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入手机号"
                }
            }, {
                type: 'text',//类型
                name: 'email',//name
                id: 'email',//id
                label: '邮箱',
                cls: 'input-xxlarge',
                rule: {
                    email: true,
					required: true
                },
                message: {
                    email: "请输入正确的邮箱",
					required: "请输入邮箱"
                }
            }
        ]
    };

    App.menu.taskGridOption = {
        url: App.href + "/api/core/exportTask/myList",
        pageNum: 1,//当前页码
        pageSize: 15,//每页显示条数
        idField: "id",//id域指定
        headField: "taskName",
        contentTypeItems: "table,card,list",
        showCheck: true,//是否显示checkbox
        checkboxWidth: "3%",
        showIndexNum: true,
        indexNumWidth: "5%",
        pageSelect: [2, 15, 30, 50],
        sort: "exportTime_desc",
        columns: [
            {
                title: "任务名称",
                align: "left",
                field: "taskName"
            }, {
                title: "导出时间",
                align: "left",
                field: "exportTime"
            }, {
                title: "完成时间",
                align: "left",
                field: "completeTime"
            }, {
                title: "耗时",
                align: "left",
                field: "costTime"
            }, {
                title: "状态",
                align: "left",
                field: "status",
                width: "10%",
                format: function (i, data) {
                    if (data.status == 2) {
                        return '<span class="label label-success">完成</span>'
                    } else if (data.status == 1) {
                        return '<span class="label label-warning">进行中</span>'
                    } else {
                        return '<span class="label label-danger">失败</span>'
                    }
                }
            },
            {
                title: "下载",
                field: "status",
                align: "left",
                format: function (index, data) {
                    if (data.status == 2) {
                        return '<a class="btn btn-danger btn-sm" href="' + data.attachmentUri + '">右键另存为</a>';
                    } else {
                        return '';
                    }
                }
            }
        ],
        tools: [
            {
                type: 'button',
                text: '刷新',
                cls: "btn btn-warning",
                handle: function (g) {
                    g.reload();
                }
            }
        ]
    };
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
				//async:false,
				contentType: "application/json",
				dataType: "json",
				data: fields,
				success: function (result) {
					if (result.code === 200) {
						$.cookie(App.token_key, result.token, {expires: 7});
						window.location.href = App.href + "/index.html";
					} else {
						alert("请求错误，请联系管理员，"+result.message);
						$.ajax(
								{
									type: 'GET',
									url: App.href + "/api/logout",
									contentType: "application/json",
									dataType: "json",
									success: function (result) {
										if (result.code === 200) {
											$.cookie(App.token_key, null);
											window.location.href = App.href + "/login.html";
										} else {
											alert(result.message);
										}
									}
								}
							);
					}
				}
			});
	}else{
	
		var toggle = App.toggle = ($.cookie('spring-menu-toggle') === undefined ? "s" : $.cookie('spring-menu-toggle'));
		if (toggle === undefined) {
			toggle = "s";
		}
		if (toggle === "s") {
			App.menu.initSideMenu();
		} else {
			App.menu.initHMenu();
		}
		$("#orange-settings-navbar").click(function () {
			App.menu.toggleMenu();
			setTimeout(function () {
				window.location.reload();
			}, 500);
		});
	}
 $("#user-info").click(function () {
            App.menu.showUserInfo();
        });
        $("#task-info").click(function () {
            App.menu.showTaskInfo();
        });

})(jQuery, window, document);
