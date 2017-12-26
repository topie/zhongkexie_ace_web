/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scoreItem/list": "scoreItem"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.scoreItem = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
               // '<div class="panel panel-default" >' +
              //  '<div class="panel-heading">题库题目管理</div>' +
                '<div class="panel-body" id="grid"></div>' +
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
		var itemGrid;
        var options = {
            url: App.href + "/api/core/scoreItem/list",
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
                    title: "题目名称",
                    field: "title",
                    sort: true
                }, {
                    title: "题目分值",
                    field: "score",
                    sort: true
                },{
					title:"类型",
					field:"type",
					format:function(index,data){
					 if(data.type==0)return '填空';
					 if(data.type==1)return '单选';
					 if(data.type==2)return '多选';
					 return '未识别';
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
                            id: "scoreItemForm",
                            title: "编辑",
                            destroy: true
                        });
                        var formOpts = {
                            id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/core/scoreItem/update",
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
                                    type: 'tree',
                                    name: 'indexId',
                                    id: 'indexId',
                                    label: '指标',
                                    url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc",
                                    expandAll: true,
                                    autoParam: ["id", "name", "pId"],
                                    chkStyle: "radio",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择指标"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'title',
                                    id: 'title',
                                    label: '题目名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入题目名称"
                                    }
                                }, {
                                    type: 'select',
                                    name: 'type',
                                    id: 'type',
                                    label: '选项类型',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入选项文本"
                                    },
                                    items: [
                                        {
                                            text: '填空',
                                            value: 0
                                        },
                                        {
                                            text: '单选',
                                            value: 1
                                        },
                                        {
                                            text: '多选',
                                            value: 2
                                        }
                                    ]
                                }, {
                                    type: 'textarea',
                                    name: 'optionLogic',
                                    id: 'optionLogic',
                                    label: '填空逻辑',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'text',
                                    name: 'score',
                                    id: 'score',
                                    label: '题目分值',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入分值"
                                    }
                                }, 
                                {
                                    type: 'select',
                                    name: 'responsibleDepartment',
                                    id: 'responsibleDepartment',
                                    label: '责任部门',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入选项文本"
                                    },
                                    items: [
                                        {
                                            text: '企业工作处',
                                            value: 0
                                        },
                                        {
                                            text: '财务处',
                                            value: 1
                                        },
                                        {
                                            text: '科技部',
                                            value: 2
                                        }
                                    ]
                                },
                                {
                                    type: 'select',
                                    name: 'relatedField',
                                    id: 'relatedField',
                                    label: '相关领域',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入选项文本"
                                    },
                                    items: [
                                        {
                                            text: '工程领域',
                                            value: 0
                                        },
                                        {
                                            text: '建筑领域',
                                            value: 1
                                        },
                                        {
                                            text: '信息领域',
                                            value: 2
                                        }
                                    ]
                                },
                                {
                                    type: 'text',
                                    name: 'sort',
                                    id: 'sort',
                                    label: '排序',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts);
                        form.loadRemote(App.href + "/api/core/scoreItem/load/" + data.id);
                        modal.show();
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/core/scoreItem/delete";
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
                }, {
                    text: "管理选项",
                    cls: "btn-info btn-sm",
					visible:function(index,data){
						if(data.type==1)return true;
						return false;
					},
                    handle: function (index, data, grid) {
                        var itemModal = $.orangeModal({
                            id: "scoreItemOptionGrid",
                            title: "管理选项-" + data.title,
                            destroy: true,
                            width: $(window).width()
                        }).show();
                        var itemId = data.id;
                        var requestUrl = App.href + "/api/core/scoreItemOption/list?itemId=" + itemId;
						 itemModal.$body.orangeForm({
                                            id: "static_item_edit_form",
                                            name: "static_item_edit_form",
                                            method: "POST",
                                            action: App.href + "/api/core/scoreItemOption/insert",
                                            ajaxSubmit: true,
											rowEleNum:3,
                                            ajaxSuccess: function () {
                                                document.getElementById("static_item_edit_form").reset();
                                                itemGrid.reload();
                                            },
                                            submitText: "添加",
                                            showReset: true,
                                            resetText: "重置",
                                            isValidate: true,
                                            
                                            buttonsAlign: "center",
                                            items: [
                                                {
                                                    type: 'hidden',
                                                    name: 'id',
                                                    id: 'id'
                                                }, {
                                                    type: 'hidden',
                                                    name: 'itemId',
                                                    id: 'itemId',
                                                    value: itemId
                                                }, {
                                                    type: 'text',
                                                    name: 'optionTitle',
                                                    id: 'optionTitle',
                                                    label: '选项文本',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入选项文本"
                                                    }
                                                }, {
                                                    type: 'text',
                                                    name: 'optionRate',
                                                    id: 'optionRate',
                                                    label: '系数',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入选项系数"
                                                    }
                                                }, {
                                                    type: 'text',
                                                    name: 'optionDesc',
                                                    id: 'optionDesc',
                                                    label: '选项描述',
                                                    cls: 'input-xxlarge'
                                                }
                                            ]
                                        }
							
						);
                        itemGrid = itemModal.$body.orangeGrid({
                            url: requestUrl,
                            contentType: "table",
                            contentTypeItems: "table,card,list",
                            pageNum: 1,//当前页码
                            pageSize: 15,//每页显示条数
                            idField: "id",//id域指定
                            headField: "name",
                            showCheck: true,//是否显示checkbox
                            checkboxWidth: "3%",
                            showIndexNum: false,
                            indexNumWidth: "5%",
                            pageSelect: [2, 15, 30, 50],
                            sort: "id_asc",
                            columns: [
                                {
                                    title: "选项文本",
                                    field: "optionTitle"
                                },
                                {
                                    title: "系数",
                                    field: "optionRate"
                                },
                                {
                                    title: "选项描述",
                                    field: "optionDesc"
                                }
                            ],
                            actionColumnText: "操作",//操作列文本
                            actionColumnWidth: "20%",
                            actionColumns: [
                                {
                                    text: "编辑",
                                    cls: "btn-primary btn-sm",
                                    handle: function (index, d, grid) {
                                        var modal = $.orangeModal({
                                            id: "scoreItemOptionForm",
                                            title: "编辑",
                                            destroy: true
                                        }).show();
                                        var formOpts = {
                                            id: "edit_form",
                                            name: "edit_form",
                                            method: "POST",
                                            action: App.href + "/api/core/scoreItemOption/update",
                                            ajaxSubmit: true,
                                            ajaxSuccess: function () {
                                                modal.hide();
                                                itemGrid.reload();
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
                                                    type: 'hidden',
                                                    name: 'itemId',
                                                    id: 'itemId'
                                                }, {
                                                    type: 'text',
                                                    name: 'optionTitle',
                                                    id: 'optionTitle',
                                                    label: '选项文本',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入选项文本"
                                                    }
                                                }, {
                                                    type: 'text',
                                                    name: 'optionRate',
                                                    id: 'optionRate',
                                                    label: '选项系数',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入选项系数"
                                                    }
                                                }, {
                                                    type: 'textarea',
                                                    name: 'optionDesc',
                                                    id: 'optionDesc',
                                                    label: '描述',
                                                    cls: 'input-xxlarge'
                                                }, {
                                                    type: 'text',
                                                    name: 'optionSort',
                                                    id: 'optionSort',
                                                    label: '排序',
                                                    cls: 'input-xxlarge'
                                                }
                                            ]
                                        };
                                        var form = modal.$body.orangeForm(formOpts);
                                        form.loadRemote(App.href + "/api/core/scoreItemOption/load/" + d.id);
                                        modal.show();
                                    }
                                },
                                {
                                    text: "删除",
                                    cls: "btn-danger btn-sm",
                                    handle: function (index, d, grid) {
                                        bootbox.confirm("确定该操作?", function (result) {
                                            if (result) {
                                                var requestUrl = App.href + "/api/core/scoreItemOption/delete";
                                                $.ajax({
                                                    type: "GET",
                                                    dataType: "json",
                                                    data: {
                                                        id: d.id
                                                    },
                                                    url: requestUrl,
                                                    success: function (data) {
                                                        if (data.code === 200) {
                                                            itemGrid.reload();
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
                           /* tools: [
                                {
                                    text: "添加选项",
                                    cls: "btn btn-primary",
                                    icon: "fa fa-plus",
                                    handle: function (grid) {
                                        var itemModal = $.orangeModal({
                                            id: "add_sub_modal",
                                            title: "添加选项",
                                            destroy: true
                                        }).show();
                                        var formOpts = {
                                            id: "add_form",
                                            name: "add_form",
                                            method: "POST",
                                            action: App.href + "/api/core/scoreItemOption/insert",
                                            ajaxSubmit: true,
                                            rowEleNum: 1,
                                            ajaxSuccess: function () {
                                                itemModal.hide();
                                                itemGrid.reload();
                                            },
                                            submitText: "保存",//保存按钮的文本
                                            showReset: true,//是否显示重置按钮
                                            resetText: "重置",//重置按钮文本
                                            isValidate: true,//开启验证
                                            buttons: [{
                                                type: 'button',
                                                text: '关闭',
                                                handle: function () {
                                                    itemModal.hide();
                                                    itemGrid.reload();
                                                }
                                            }],
                                            buttonsAlign: "center",
                                            items: [
                                                {
                                                    type: 'hidden',
                                                    name: 'itemId',
                                                    id: 'itemId',
                                                    value: itemId
                                                }, {
                                                    type: 'text',
                                                    name: 'optionTitle',
                                                    id: 'optionTitle',
                                                    label: '选项文本',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入选项文本"
                                                    }
                                                }, {
                                                    type: 'text',
                                                    name: 'optionRate',
                                                    id: 'optionRate',
                                                    label: '选项系数',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入选项系数"
                                                    }
                                                }, {
                                                    type: 'textarea',
                                                    name: 'optionDesc',
                                                    id: 'optionDesc',
                                                    label: '描述',
                                                    cls: 'input-xxlarge'
                                                }, {
                                                    type: 'text',
                                                    name: 'optionSort',
                                                    id: 'optionSort',
                                                    label: '排序',
                                                    cls: 'input-xxlarge'
                                                }
                                            ]
                                        };
                                        itemModal.$body.orangeForm(formOpts);
                                    }
                                }
                            ]*/
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
                            action: App.href + "/api/core/scoreItem/insert",
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
                                    type: 'tree',
                                    name: 'indexId',
                                    id: 'indexId',
                                    label: '指标',
                                    url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc",
                                    expandAll: true,
                                    autoParam: ["id", "name", "pId"],
                                    chkStyle: "radio",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择指标"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'title',
                                    id: 'title',
                                    label: '题目名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入题目名称"
                                    }
                                }, {
                                    type: 'select',
                                    name: 'type',
                                    id: 'type',
                                    label: '选项类型',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入选项文本"
                                    },
                                    items: [
                                        {
                                            text: '填空',
                                            value: 0
                                        },
                                        {
                                            text: '单选',
                                            value: 1
                                        },
                                        {
                                            text: '多选',
                                            value: 2
                                        }
                                    ]
                                }, {
                                    type: 'textarea',
                                    name: 'optionLogic',
                                    id: 'optionLogic',
                                    label: '填空逻辑',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'text',
                                    name: 'score',
                                    id: 'score',
                                    label: '题目分值',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入分值"
                                    }
                                }, 
                                {
                                    type: 'select',
                                    name: 'responsibleDepartment',
                                    id: 'responsibleDepartment',
                                    label: '责任部门',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入选项文本"
                                    },
                                    items: [
                                        {
                                            text: '企业工作处',
                                            value: 0
                                        },
                                        {
                                            text: '财务处',
                                            value: 1
                                        },
                                        {
                                            text: '科技部',
                                            value: 2
                                        }
                                    ]
                                },
                                {
                                    type: 'select',
                                    name: 'relatedField',
                                    id: 'relatedField',
                                    label: '相关领域',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入选项文本"
                                    },
                                    items: [
                                        {
                                            text: '工程领域',
                                            value: 0
                                        },
                                        {
                                            text: '建筑领域',
                                            value: 1
                                        },
                                        {
                                            text: '信息领域',
                                            value: 2
                                        }
                                    ]
                                },
                                {
                                    type: 'text',
                                    name: 'sort',
                                    id: 'sort',
                                    label: '排序',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
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
                        label: "题目名称",
                        name: "title",
                        placeholder: "输入要搜索的题目名称"
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);

    };
})(jQuery, window, document);