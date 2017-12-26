/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/message/page": "messagePage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.messagePage = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
               // '<div class="panel panel-default" >' +
               // '<div class="panel-heading">题库试卷管理</div>' +
                '<div class="panel-body" id="grid"></div>' +
              //  '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents();
        }
    };
	var modal;
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
                                }/**, {
                                    type: 'datepicker',
                                    name: 'begin',
                                    id: 'begin',
                                    label: '开始时间',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    },
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择开始时间"
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'end',
                                    id: 'end',
                                    label: '结束时间',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    },
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择结束时间"
                                    }
                                }*/
                            ]
                        };
    var initEvents = function () {


        var grid;
        var tree;
        var options = {
            url: App.href + "/api/core/message/list",
            contentType: "table",
            contentTypeItems: "table,card,list",
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "mId",//id域指定
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
                    title: "通知标题",
                    field: "title",
                    sort: true
                }, {
                    title: "发布时间",
                    field: "createTime",
                    sort: true
                }, {
                    title: "状态",
                    field: "status",
                    sort: true,
					format:function(index,data){
						if(data.status=='0'){
							return '新增';	
						}
						if(data.status=='1'){
							return '发布';	
						}
						if(data.status=='2'){
							return '撤回';	
						}
						return '- -';
					}
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
                            id: "messageForm",
                            title: "编辑",
                            destroy: true
                        });
						 formOpts.action = App.href + "/api/core/message/update";
                        
                        var form = modal.$body.orangeForm(formOpts);
                        form.loadRemote(App.href + "/api/core/message/load/" + data.mId);
                        modal.show();
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/core/message/delete";
                                $.ajax({
                                    type: "GET",
                                    dataType: "json",
                                    data: {
                                        id: data.mId
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
                }
            ],
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
                        formOpts.action =  App.href + "/api/core/message/insert";
                        modal.$body.orangeForm(formOpts);
                    }
                }
            ],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [
                    {
                        type: "text",
                        label: "试卷名称",
                        name: "title",
                        placeholder: "输入要搜索的试卷名称"
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);

    };
})(jQuery, window, document);
