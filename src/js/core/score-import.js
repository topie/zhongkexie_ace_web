/**
 * .
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/importConf/list": "scoreImportConf"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.scoreImportConf = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
			
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel-body" id="grid"></div>' +
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
            url: App.href + "/api/core/importConf/list",
            contentType: "table",
            contentTypeItems: "table,card,list",
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "id",//id域指定
            headField: "name",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 10, 30, 50],
            columns: [
                /* {
                     title: "ID",
                     field: "id",
                     sort: true,
                     width: "5%"
                 }, */{
                    title: "配置名称",
                    field: "name",
                    sort: true
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [ {
                    text: "编辑",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        modal = $.orangeModal({
                            id: "scoreItemForm",
                            title: "编辑",
                            destroy: true
                        });
						formOpts.action=App.href + "/api/core/importConf/update";
                        var form = modal.$body.orangeForm(formOpts);
                        //form.loadRemote(App.href + "/api/core/importConf/load/" + data.id);
						form.loadLocal(data);
                        modal.show();
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/core/importConf/delete";
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
			tools:[{
                    text: "添加",
                    cls: "btn btn-primary",
                    icon: "fa fa-plus",
                    handle: function () {
                         modal = $.orangeModal({
                            id: "scoreItemForm",
                            title: "添加",
                            destroy: true
                        });
						formOpts.action=App.href + "/api/core/importConf/insert";
                        var form = modal.$body.orangeForm(formOpts);
                        modal.show();
                    }
                }],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [
                    {
                        type: "text",
                        label: "名称",
                        name: "name",
                        placeholder: "输入要搜索的评估项目"
                    }
                ]
            }
        };
	var modal;
		 var formOpts = {
                            id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/core/importConf/update",
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
                                    name: 'name',
                                    id: 'name',
                                    label: '名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入名称"
                                    }
                                },  {
                                    type: 'text',
                                    name: 'start',
                                    id: 'start',
                                    label: '开始行',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                },  {
                                    type: 'text',
                                    name: 'end',
                                    id: 'end',
                                    label: '结束行',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, 
                                {
                                    type: 'textarea',
                                    name: 'jsonIndex',
                                    id: 'jsonIndex',
                                    label: '指标列Arr',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, 
                                {
                                    type: 'textarea',
                                    name: 'jsonItem',
                                    id: 'jsonItem',
                                    label: '题目列Obj',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, 
                                {
                                    type: 'textarea',
                                    name: 'deptMapping',
                                    id: 'deptMapping',
                                    label: '责任部门Mapping',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, 
                                {
                                    type: 'textarea',
                                    name: 'fieldMapping',
                                    id: 'fieldMapping',
                                    label: '领域Mapping',
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
        grid = window.App.content.find("#grid").orangeGrid(options);

    };

})(jQuery, window, document);
