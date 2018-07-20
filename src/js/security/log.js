/**
 * 日志管理.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/sys/log/page": "logPage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.logPage = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel-body" id="grid"></div>' +
              //  '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents();
        }
    };
	
    var initEvents = function () {


        var grid;
        var tree;
		var modal;

        var options = {
            url: App.href + "/api/sys/log/list",
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
                    title: "操作结果",
                    field: "title",
                    sort: true
                }, {
                    title: "操作用户",
                    field: "cuser",
                    sort: true
                }, {
                    title: "类型",
                    field: "ctype",
                    sort: true,
					format:function(index,data){
						if(data.ctype=='0'){
							return '登录';	
						}
						if(data.ctype=='1'){
							return '操作';	
						}
						return '--';
					}
                }, {
                    title: "操作时间",
                    field: "cdate",
                    sort: true
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [{
                text: "查看",
                cls: "btn-primary btn-sm",
                handle: function (index, data) {
                    var modal = $.orangeModal({
                        id: "roleForm",
                        title: "查看",
                        destroy: true
                    });
                    var formOpts = {
                        id: "index_form",//表单id
                        name: "index_form",//表单名
                        method: "POST",//表单method
                        action: "#",//表单action
                        ajaxSubmit: true,//是否使用ajax提交表单
                        ajaxSuccess: function () {
                            modal.hide();
                            grid.reload();
                        },
						showSubmit:false,
                       // submitText: "保存",//保存按钮的文本
                        showReset: false,//是否显示重置按钮
                        //resetText: "重置",//重置按钮文本
                        //isValidate: true,//开启验证
                        buttons: [{
                            type: 'button',
                            text: '关闭',
                            handle: function () {
                                modal.hide();
                            }
                        }],
                        buttonsAlign: "center",
                        items: [{
                            type: 'hidden',
                            name: 'id',
                            id: 'id'
                        }, {
                            type: 'display',//类型
                            name: 'title',//name
                            id: 'roleName',//id
                            label: '操作结果',//左边label
                            cls: 'input-large'
                        }, {
                            type: 'display',//类型
                            name: 'cuser',//name
                            id: 'cuser',//id
                            label: '操作用户',//左边label
                            cls: 'input-large'
                        }, {
                            type: 'display',//类型
                            name: 'cdate',
                            id: 'cdate',//id
                            label: '操作时间',//左边label
                        }, {
                            type: 'display',//类型
                            name: 'ip',
                            id: 'ip',//id
                            label: '操作IP',//左边label
                        }, {
                            type: 'display',//类型
                            name: 'content',
                            id: 'content',//id
                            label: '操作内容',//左边label
                        }]
                    };
                    var form = modal.$body.orangeForm(formOpts);
                    form.loadLocal(data);
                    modal.show();
                }
            }],
            search: {
                rowEleNum: 4,
                //搜索栏元素
                items: [
                    {
                        type: "text",
                        label: "操作结果",
                        name: "title",
                        placeholder: "操作结果"
                    },
						{
                        type: "select",
                        label: "类型",
                        name: "ctype",
						items:[{text:'全部',value:''},{text:'操作',value:"1"},{text:'登录',value:"0"}]
                    },
						{
                        type: "text",
                        label: "操作用户",
                        name: "cuser"
                    }
                ]
            }
        };
		var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/core/message/insert",
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
                                    name: 'mId',
                                    id: 'mId'
                                },{
                                    type: 'hidden',
                                    name: 'type',
									value:"message"
                                },{
                                    type: 'hidden',
                                    name: 'status',
									value:"0"
                                },
                                 {
                                    type: 'text',
                                    name: 'title',
                                    id: 'title',
                                    label: '通知标题',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入通知标题"
                                    }
                                }, {
                                    type: 'textarea',
                                    name: 'content',
                                    id: 'content',
                                    label: '通知内容',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入通知内容"
                                    }
                                }, {
                                    type: 'files',
                                    name: 'downloadFileId',
                                    id: 'downloadFileId',
                                    label: '附件',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
        grid = window.App.content.find("#grid").orangeGrid(options);

    };
})(jQuery, window, document);
