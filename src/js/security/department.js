/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
	  var mapping = {
        "/api/core/department/page": "departmentPage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.departmentPage = {
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
            url: App.href + "/api/department/info/list",
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
                    title: "学会部门",
                    field: "deptName",
                    sort: true
                },{
                    title: "学会登录名",
                    field: "loginName",
                    sort: true
                }, {
					title: "部门分类",
                    field: "deptType",
                    sort: true
                }, {
                    title: "部门联系人",
                    field: "linkMan",
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
                            id: "deptForm",
                            title: "编辑",
                            destroy: true
                        });
                        var formOpts = {
                            id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/department/info/update",
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
                                    type: 'text',
                                    name: 'deptName',
                                    id: 'deptName',
                                    label: '部门名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入名称"
                                    }
                                },{
                                    type: 'display',
                                    name: 'loginName',
                                    id: 'loginName',
                                    label: '登录名',
                                }, {
                                    type: 'select',
                                    name: 'deptType',
                                    id: 'deptType',
                                    label: '部门分类',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择分类"
                                    },
                                    items: [
                                        {
                                            text: '请选择',
                                            value: ''
                                        }
                                    ],
									itemsUrl:App.href +"/api/core/dict/getItems?code=ZZBM"
                                
                                },
                                {
                                    type: 'text',
                                    name: 'linkman',
                                    id: 'linkman',
                                    label: '联系人',
                                    cls: 'input-xxlarge'
                                },
                                {
                                    type: 'text',
                                    name: 'tellPhone',
                                    id: 'tellPhone',
                                    label: '联系电话',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'textarea',
                                    name: 'address',
                                    id: 'address',
                                    label: '联系地址',
                                    cls: 'input-xxlarge'
                                },
                                {
                                    type: 'text',
                                    name: 'seqNum',
                                    id: 'seqNum',
                                    label: '排序',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts);
                        form.loadRemote(App.href + "/api/department/info/load/" + data.id);
                        modal.show();
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/department/info/delete";
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
                            action: App.href + "/api/department/info/insert",
                            ajaxSubmit: true,
                            rowEleNum: 1,
                            ajaxSuccess: function () {
                                modal.hide();
                                grid.reload();
                            },
                            submitText: "保存",//保存按钮的文本
                            showReset: true,//是否显示重置按钮
                            resetText: "重置",//重置按钮文本
                            isValidate: true,//开启验证
                            buttons: [{
                                type: 'button',
                                text: '关闭',
                                handle: function () {
                                    modal.hide();
                                    grid.reload();
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
                                {
                                    type: 'hidden',
                                    name: 'id',
                                    id: 'id'
                                },{
                                    type: 'text',
                                    name: 'deptName',
                                    id: 'deptName',
                                    label: '部门名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入名称"
                                    }
                                },{
                                    type: 'text',
                                    name: 'loginName',
                                    id: 'loginName',
                                    label: '部门登录名',
                                    cls: 'input-xxlarge',
									rule: {
                                        required: true,
										remote: {
                                            type: "post",
                                            url: App.href + "/api/noneAuth/unique",
                                            data: {
                                                loginName: function () {
                                                    return $("#loginName").val();
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
                                }, {
                                    type: 'select',
                                    name: 'deptType',
                                    id: 'deptType',
                                    label: '部门分类',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择分类"
                                    },
                                    items: [
                                        {
                                            text: '请选择',
                                            value: ''
                                        }
                                    ],
									itemsUrl:App.href +"/api/core/dict/getItems?code=ZZBM"
                                
                                },
                                {
                                    type: 'text',
                                    name: 'linkman',
                                    id: 'linkman',
                                    label: '联系人',
                                    cls: 'input-xxlarge'
                                },
                                {
                                    type: 'text',
                                    name: 'tellPhone',
                                    id: 'tellPhone',
                                    label: '联系电话',
                                    cls: 'input-xxlarge'
                                },
                                {
                                    type: 'text',
                                    name: 'seqNum',
                                    id: 'seqNum',
                                    label: '排序',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
                       var form =  modal.$body.orangeForm(formOpts);
                    }
                }
            ],
            search: {
                rowEleNum: 4,
                //搜索栏元素
                items: [
                     {
                        type: "text",
                        label: "部门名称",
                        name: "deptName",
                        placeholder: "输入要搜索的部门名称"
                    }, {
                                    type: 'select',
                                    name: 'deptType',
                                    label: '部门分类',
                                    items: [
                                        {
                                            text: '请选择',
                                            value: ''
                                        }
                                    ],
									itemsUrl:App.href +"/api/core/dict/getItems?code=ZZBM"
                                
                     }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);

    };
})(jQuery, window, document);