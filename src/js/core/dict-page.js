/**
 *
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/dict/page": "dictPage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.dictPage = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
					'<div class="col-md-4" >' +
						'<div class="panel panel-default" >' +
							'<div class="panel-heading">'+
								'<div class="row">' +
									'<div class="col-md-8"  style="padding: 6px 12px;">' +
										'<span>字典管理</span>' +
									'</div>' +	
									'<div class="col-md-4" >' +
										'<a id="add_node" title="添加字典" class="btn btn-primary btn-sm" href="javascript:void(0);">添加</a>'+
									'</div>' +
								'</div>' +
							'</div>' +
							'<ul id="tree" class="ztree pre-scrollable" style="max-height:600px"></ul>' +
						'</div>' +
					'</div>' +
					'<div class="col-md-8" >' +
						'<div id="grid"></div>' +
					'</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {
		var currentDictId='';
		var currentDictIdTitle='';
		var tree;
		var setting = {
            async: {
                enable: true,
                url: App.href + "/api/core/dict/treeNodes",
                autoParam: ["id", "name", "pId"]
            },
            edit: {
                enable: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                   // var zTree = $.fn.zTree.getZTreeObj(treeId);
                    tree.expandAll(true);
                },
				onClick:function(event, treeId, treeNode){
					currentDictId = treeNode.id;
					currentDictIdTitle = treeNode.name;
					var  url = App.href + "/api/core/dictItem/list?dictId="+currentDictId;
					grid.reload({url:url});
				}
            }
        };
		var $addBtn = $("#add_node");
		$addBtn.bind("click",function(){
			var modal = $.orangeModal({
                            id: "add_modal",
                            title: "添加字典",
                            destroy: true
                        }).show();
			var formOpts = {
				id: "add_dict_form",
				name: "add_dict_form",
				method: "POST",
				action: App.href + "/api/core/dict/insert",
				ajaxSubmit: true,
				rowEleNum: 1,
				ajaxSuccess: function () {
					modal.hide();
					tree.reAsyncChildNodes(null, "refresh");
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
					}
				}],
				buttonsAlign: "center",
				items:dictFormItems
			};
		   var form =  modal.$body.orangeForm(formOpts);
				
		});
        $.fn.zTree.init($("#tree"), setting);
        tree = $.fn.zTree.getZTreeObj("tree");

        var grid;
		var itemGrid;
        var options = {
            url: App.href + "/api/core/dictItem/list?dictId=0",
            contentType: "table",
            contentTypeItems: "table,card,list",
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "itemId",//id域指定
            headField: "title",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 15, 30, 50],
            columns: [
               /* {
                    title: "ID",
                    field: "itemId",
                    sort: true,
                    width: "5%"
                },*/ {
                    title: "名称",
                    field: "itemName",
                    sort: true
                }, {
                    title: "值",
                    field: "itemCode",
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
                            id: "dictItemForm",
                            title: "编辑",
                            destroy: true
                        });
                        var formOpts = {
                            id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/core/dictItem/update",
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
                            items:itemFormItems
                        };
                        var form = modal.$body.orangeForm(formOpts);
                        form.loadRemote(App.href + "/api/core/dictItem/load/" + data.itemId);
						form.loadLocal({indexTitle:currentDictIdTitle});
                        modal.show();
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/core/dictItem/delete";
                                $.ajax({
                                    type: "GET",
                                    dataType: "json",
                                    data: {
                                        id: data.itemId
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
                    text: " 添加",
                    cls: "btn btn-primary",
                    icon: "fa fa-plus",
                    handle: function (grid) {
						if(currentDictId){
							
						}else{
							bootbox.alert("请先选择指标!");
							return;
						}
                        var modal = $.orangeModal({
                            id: "add_modal",
                            title: "添加字典项",
                            destroy: true
                        }).show();
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/core/dictItem/insert",
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
                            items:itemFormItems
                        };
                       var form =  modal.$body.orangeForm(formOpts);
					   form.loadLocal({dictId:currentDictId,indexTitle:currentDictIdTitle});
                    }
                }
            ]
        };
		var dictFormItems = [{
                                    type: 'hidden',
                                    name: 'dictId',
                                    id: 'dictId'
                                },{
                                    type: 'text',
                                    name: 'dictName',
                                    id: 'dictName',
                                    label: '字典名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入字典名称"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'dictCode',
                                    id: 'dictCode',
                                    label: '字典编码',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入字典编码"
                                    }
                                },
                                {
                                    type: 'textarea',
                                    name: 'dictDesc',
                                    id: 'dictDesc',
                                    label: '描述',
                                    cls: 'input-xxlarge'
                                },
                                {
                                    type: 'number',
                                    name: 'dictSeq',
                                    id: 'dictSeq',
                                    label: '排序',
                                    cls: 'input-xxlarge'
                                }];
		var itemFormItems =  [
                                {
                                    type: 'hidden',
                                    name: 'itemId',
                                    id: 'itemId'
                                },{
                                    type: 'hidden',
                                    name: 'dictId',
									label: '字典ID',
                                    id: 'dictId'
                                },{
                                    type: 'display',
                                    name: 'indexTitle',
									label: '字典名称',
                                    id: 'indexTitle'
                                },{
                                    type: 'text',
                                    name: 'itemName',
                                    id: 'itemName',
                                    label: '名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入名称"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'itemCode',
                                    id: 'itemCode',
                                    label: '值',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入值"
                                    }
                                },
                                {
                                    type: 'textarea',
                                    name: 'itemDesc',
                                    id: 'itemDesc',
                                    label: '描述',
                                    cls: 'input-xxlarge'
                                },
                                {
                                    type: 'number',
                                    name: 'itemSeq',
                                    id: 'itemSeq',
                                    label: '排序',
                                    cls: 'input-xxlarge'
                                }
                            ];
        grid = window.App.content.find("#grid").orangeGrid(options);

    };
})(jQuery, window, document);