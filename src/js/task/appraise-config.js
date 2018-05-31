/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/task/appraise/config": "appraiseconfig"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.appraiseconfig = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
				   // '<div class="panel panel-default" >' +
				  //  '<div class="panel-heading"></div>' +
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
        var tree;
        var options = {
            url: App.href + "/api/score/appraise/list",
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
                {
                    title: "部门用户",
                    field: "userId"
                },  {
                    title: "指标",
                    field: "itemId",
                }
               
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
				 {
					text: "编辑",
                    cls: "btn-sm btn-primary",
                    handle: function (index,data) {
						
                        var modal = $.orangeModal({
                            id: "add_modal",
                            title: "编辑",
                            destroy: true
                        }).show();
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/score/appraise/update",
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
                                    name: 'userId',
                                    id: 'userId',
                                    label: '部门用户',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                },
                                {
                                    type: 'text',
                                    name: 'itemId',
                                    id: 'itemId',
                                    label: '指标',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }
                                
                            ]
                        };
                       var form =  modal.$body.orangeForm(formOpts);
					   form.loadLocal(data);
                    }
				}, {
                    text: "启用",
                    cls: " btn-sm",
                    handle: function (index, data) {
                       
                    }
                }, {
                    text: "停止填报",
                    cls: " btn-sm",
                    handle: function (index, data) {
                       
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/score/appraise/delete";
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
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/score/appraise/insert",
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
                                    name: 'userId',
                                    id: 'userId',
                                    label: '部门用户',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                },
                                {
                                    type: 'text',
                                    name: 'itemId',
                                    id: 'itemId',
                                    label: '指标',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                },
                                {
                                    type: 'hidden',
                                    name: 'paperId',
                                    id: 'paperId'
                                }
                                
                            ]
                        };
                       var form =  modal.$body.orangeForm(formOpts);
					   var pid = $("#paperId_select").val();
					   form.loadLocal({paperId:pid});
                    }
				}
            ],
            search: {
                rowEleNum: 2,
				hide:false,
                //搜索栏元素
                items: [
                    {
                        type: "select",
                        label: "评估项目",
                        name: "paperId",
						id:"paperId_select",
						items:[],
						itemsUrl:App.href+"/api/core/scorePaper/getPaperSelect"
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
		
    }
})(jQuery, window, document);