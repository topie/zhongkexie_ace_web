/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/expert/info/page": "expertInfo"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.expertInfo = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
				   // '<div class="panel panel-default" >' +
				  //  '<div class="panel-heading">题库题目管理</div>' +
						'<div id="grid"></div>' +
				   // '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {
		
        var grid;
        var options = {
            url: App.href + "/api/expert/info/list",
            contentType: "table",
            contentTypeItems: "table,card,list",
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "id",//id域指定
            headField: "title",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 15, 30, 50],
            columns: [
               /* {
                    title: "ID",
                    field: "id",
                    sort: true,
                    width: "5%"
                },*/ {
                    title: "专家姓名",
                    field: "realName",
                    sort: true
                },{
                    title: "登录名",
                    field: "loginName",
                    sort: true
                },{
					title:"相关领域",
					field:"relatedField",
					sort:true
				}, {
                    title: "电话",
                    field: "telPhone",
                    sort: true
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                {
                    text: "编辑",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "scoreItemForm",
                            title: "编辑",
                            destroy: true
                        });
                        var formOpts = {
                            id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/expert/info/update",
                            ajaxSubmit: true,
                            ajaxSuccess: function () {
                                modal.hide();
                                grid.reload();
                            },
                            submitText: "保存",
                            showReset: true,
                            resetText: "重置",
                            isValidate: true,
                            buttons: [{
                                type: 'button',
                                text: '关闭',
                                handle: function () {
                                    modal.hide();
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
                                {
                                    type: 'hidden',
                                    name: 'id',
                                    id: 'id'
                                },{
                                    type: 'hidden',
                                    name: 'userId',
                                    id: 'userId'
                                }, {
                                    type: 'text',
                                    name: 'realName',
                                    id: 'realName',
									readonly:true,
                                    label: '姓名',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入姓名"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'loginName',
                                    id: 'loginName',
									readonly:true,
                                    label: '登录名',
                                    cls: 'input-xxlarge'
                                }/*, {
                                    type: 'select',
                                    name: 'fieldType',
                                    id: 'fieldType',
                                    label: '专业分类',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择"
                                    },
                                    itemsUrl: App.href +"/api/core/dict/getItems?code=ZYFL"
                                }*/,
                                {
                                    type: 'select',
                                    name: 'relatedField',
                                    id: 'relatedField',
                                    label: '相关领域',
                                    cls: 'input-xxlarge',
                                    itemsUrl: App.href +"/api/core/dict/getItems?code=ZYLY",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, 
                                {
                                    type: 'text',
                                    name: 'title',
                                    id: 'title',
                                    label: '相关职称',
                                    cls: 'input-xxlarge'
                                    //itemsUrl: App.href +"/api/core/dict/getItems?code=XGZC"
                                }, {
                                    type: 'text',
                                    name: 'workUnits',
                                    id: 'workUnits',
                                    label: '工作单位',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'text',
                                    name: 'telPhone',
                                    id: 'telPhone',
                                    label: '工作电话',
                                    cls: 'input-xxlarge'
                                },{
                                    type: 'text',
                                    name: 'phone',
                                    id: 'phone',
                                    label: '联系电话',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'text',
                                    name: 'email',
                                    id: 'email',
                                    label: '邮箱',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'textarea',
                                    name: 'address',
                                    id: 'address',
                                    label: '通信地址',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts);
						form.loadLocal(data);
                        modal.show();
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/expert/info/delete";
                                $.ajax({
                                    type: "GET",
                                    dataType: "json",
                                    data: {
                                        id: data.id
                                    },
                                    url: requestUrl,
                                    success: function (data) {
                                        if (data.code === 200) {
                                            grid.reload();
                                        } else {
                                            alert(data.message);
                                        }
                                    },
                                    error: function (e) {
                                        alert("请求异常。");
                                    }
                                });
                            }
                        });
                    }
                }],
            tools: [
                {
                    text: " 添 加",
                    cls: "btn btn-primary",
                    icon: "fa fa-plus",
                    handle: function (grid) {
						
                        var modal = $.orangeModal({
                            id: "add_modal",
                            title: "添加",
                            destroy: true
                        }).show();
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/expert/info/insert",
                            ajaxSubmit: true,
                            ajaxSuccess: function () {
                                modal.hide();
                                grid.reload();
                            },
                            submitText: "保存",
                            showReset: true,
                            resetText: "重置",
                            isValidate: true,
                            buttons: [{
                                type: 'button',
                                text: '关闭',
                                handle: function () {
                                    modal.hide();
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
                                {
                                    type: 'hidden',
                                    name: 'id',
                                    id: 'id'
                                }, {
                                    type: 'text',
                                    name: 'realName',
                                    id: 'realName',
                                    label: '姓名',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入姓名"
                                    }
                                },{
                                    type: 'text',
                                    name: 'loginName',
                                    id: 'loginName',
                                    label: '登录名',
                                    cls: 'input-xxlarge',
									rule: {
                                        required: true,
										remote: {
                                            type: "post",
                                            url: App.href + "/api/noneAuth/unique",
                                            data: {
                                                loginName: function () {
                                                    return $("#loginname").val();
                                                }
                                            },
                                            dataType: "json",
                                            dataFilter: function (data, type) {
                                                return data;
                                            }
                                        }
                                    },
                                    message: {//对应验证提示信息
                                        required: "请输入登录名",
                                        remote: "登录名被占用"
                                    }
                                }, {
                                    type: 'password',
                                    name: 'password',
                                    id: 'password',
                                    span: 2,
                                    label: '密码',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true,
                                        minlength: 8,
                                        maxlength: 64
                                    },
                                    message: {
                                        required: "请输入密码",
                                        minlength: "至少{0}位",
                                        maxlength: "做多{0}位"
                                    }
                                }, {
                                    type: 'password',
                                    name: 'password2',
                                    span: 2,
                                    id: 'password2',
                                    label: '确认密码',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true,
                                        equalTo: "#password"
                                    },
                                    message: {
                                        required: "请输入确认密码密码",
                                        equalTo: "与密码不一致"
                                    }
                                }/*, {
                                    type: 'select',
                                    name: 'fieldType',
                                    id: 'fieldType',
                                    label: '专业分类',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择"
                                    },
                                    itemsUrl: App.href +"/api/core/dict/getItems?code=ZYFL"
                                }*/,
                                {
                                    type: 'select',
                                    name: 'relatedField',
                                    id: 'relatedField',
                                    label: '专业领域',
                                    cls: 'input-xxlarge',
                                    itemsUrl: App.href +"/api/core/dict/getItems?code=ZYLY",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                },
                                {
                                    type: 'text',
                                    name: 'title',
                                    id: 'title',
                                    label: '相关职称',
                                    cls: 'input-xxlarge'//,
                                    //itemsUrl: App.href +"/api/core/dict/getItems?code=XGZC"
                                }, {
                                    type: 'text',
                                    name: 'workUnits',
                                    id: 'workUnits',
                                    label: '工作单位',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'text',
                                    name: 'telPhone',
                                    id: 'telPhone',
                                    label: '工作电话',
                                    cls: 'input-xxlarge'
                                },{
                                    type: 'text',
                                    name: 'phone',
                                    id: 'phone',
                                    label: '联系电话',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'text',
                                    name: 'email',
                                    id: 'email',
                                    label: '邮箱',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'textarea',
                                    name: 'address',
                                    id: 'address',
                                    label: '通信地址',
                                    cls: 'input-xxlarge'
                                }
                                
                            ]
                        };
                       var form =  modal.$body.orangeForm(formOpts);
                    }
                }
				, {
                    text: " 导出",
                    cls: "btn btn-primary",
                    icon: "fa fa-download",
                    handle: function (grid) {
						var param = grid.$searchForm == undefined ? "" : grid.$searchForm
                        .serialize();
						App.download(App.href+"/api/expert/info/export?"+param);
					}
				}
            ],
            search: {
                rowEleNum: 4,
                //搜索栏元素
                items: [
                    {
                        type: "text",
                        label: "姓名",
                        name: "realName",
                        placeholder: "姓名"
                    },{
                        type: "text",
                        label: "登录名",
                        name: "loginName",
                        placeholder: "登录名"
                    }, {
							type: 'select',
							name: 'relatedField',
							id: 'relatedField',
							label: '专业领域',
							cls: 'input-xxlarge',
							items:[{text:'全部',value:''}],
							itemsUrl: App.href +"/api/core/dict/getItems?code=ZYLY",
						   
						}
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);

    };
})(jQuery, window, document);