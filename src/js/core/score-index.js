/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scoreIndex/list": "scoreIndex"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.scoreIndex = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-5" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">' +
				'<div class="row">'+
				'<div class="col-md-9">'+
				'<select class="form-control input-sm" id="paperSelect">'+
					/*'<option>TODO 动态加载考评表</option>'+
					'<option>2018全国学会综合能力指标体系考评表</option>'+
					'<option>2017全国学会综合能力指标体系考评表</option>'+*/
				'</select>'+
                /*'<div class="pull-right">' +
                '<div class="btn-group">' +
                '<button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' +
                '操作' +
                '<span class="caret"></span>' +
                '</button>' +
                '<ul class="dropdown-menu pull-right" role="menu">' +
                '<li><a id="add_node" href="javascript:void(0);">添加</a>' +
                '</li>' +
                '</ul>' +*/
                '</div>' +
					'<div class="col-md-3">'+
					'<a id="add_node" class="btn btn-primary btn-sm" href="javascript:void(0);">添加</a>'+
					'</div>'+
                '</div>' +
                '</div>' +
                '<div class="panel-body">' +
                '<ul id="tree" class="ztree"></ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-7" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">评价指标管理</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {
		var $paper = $("#paperSelect");
		$paper.bind("change",function(){
			currentPaper = $(this).val();
			//tree.reAsyncChildNodes(null, "refresh");
			setting.async.url= App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper;
			tree.destroy();
			 $.fn.zTree.init($("#tree"), setting);
			tree = $.fn.zTree.getZTreeObj("tree");
			var url = App.href + "/api/core/scoreIndex/list?paperId="+currentPaper;
			grid.reload({url:url});
		});
		var currentPaper = '';
		$.ajax({
			url:App.href+"/api/core/scorePaper/getPaperOptions",
			type:"GET",
			async:false,
			success:function(data){
				if(data.code==200){
					if(data.data.length<=0){
						bootbox.alert("没有评价表，请先添加评价表！");
					}else{
						for(var i=0;i<data.data.length;i++){
							var item = data.data[i];
							if(i==0){currentPaper=item.id;}
							var option = '<option value="'+item.id+'">'+item.name+'</option>';
							$paper.append(option);
						}
					}
				}else{
					bootbox.alert(data.message);
				}
			}
		});
        var grid;
        var tree;
        var options = {
            url: App.href + "/api/core/scoreIndex/list?paperId="+currentPaper,
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
            pageSelect: [2, 15, 30, 50],
            columns: [
               /* {
                    title: "节点id",
                    field: "id",
                    sort: true,
                    width: "5%"
                }, {
                    title: "父节点id",
                    field: "parentId",
                    sort: true,
                    width: "5%"
                },*/ {
                    title: "指标名称",
                    field: "name",
                    sort: true
                }, {
                    title: "指标分值",
                    field: "score",
                    sort: true
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [{
                text: "编辑",
                cls: "btn-primary btn-sm",
                handle: function (index, data) {
                    var modal = $.orangeModal({
                        id: "scoreIndexForm",
                        title: "编辑",
                        destroy: true
                    });
                    var formOpts = {
                        id: "edit_form",
                        name: "edit_form",
                        method: "POST",
                        action: App.href + "/api/core/scoreIndex/update",
                        ajaxSubmit: true,
                        ajaxSuccess: function () {
                            modal.hide();
                            grid.reload();
                            tree.reAsyncChildNodes(null, "refresh");
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
                                name: 'parentId',
                                id: 'parentId',
                                label: '父节点',
                                url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper,
                                expandAll: true,
                                autoParam: ["id", "name", "pId"],
                                chkStyle: "radio"
                            }, {
								type:'hidden',
								name:'paperId',
								label: '评价表ID',
								value:currentPaper
							}, {
                                type: 'text',
                                name: 'name',
                                id: 'name',
                                label: '指标名称',
                                cls: 'input-xxlarge',
                                rule: {
                                    required: true
                                },
                                message: {
                                    required: "请输入指标名称"
                                }
                            }, {
                                type: 'text',
                                name: 'score',
                                id: 'score',
                                label: '指标分值',
                                cls: 'input-xxlarge',
                                rule: {
                                    required: true
                                },
                                message: {
                                    required: "请输入分值"
                                }
                            }, {
                                type: 'text',
                                name: 'sort',
                                id: 'sort',
                                label: '排序',
                                cls: 'input-xxlarge'
                            }
                        ]
                    };
                    var form = modal.$body.orangeForm(formOpts);
                    form.loadRemote(App.href + "/api/core/scoreIndex/load/" + data.id);
                    modal.show();
                }
            }, {
                text: "删除",
                cls: "btn-danger btn-sm",
                handle: function (index, data) {
                    bootbox.confirm("确定该操作?", function (result) {
                        if (result) {
                            var requestUrl = App.href + "/api/core/scoreIndex/delete";
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
                        });
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/core/scoreIndex/insert",
                            ajaxSubmit: true,
                            rowEleNum: 1,
                            ajaxSuccess: function () {
                                modal.hide();
                                grid.reload();
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
                                    grid.reload();
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
                                {
                                    type: 'tree',
                                    name: 'parentId',
                                    id: 'parentId',
                                    label: '父节点',
                                    url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper,
                                    expandAll: true,
                                    autoParam: ["id", "name", "pId"],
                                    chkStyle: "radio"
                                }, {
									type:'hidden',
									name:'paperId',
									label: '评价表ID',
									value:currentPaper
								}, {
                                    type: 'text',
                                    name: 'name',
                                    id: 'name',
                                    label: '指标名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入指标名称"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'score',
                                    id: 'score',
                                    label: '指标分值',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入指标分值"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'sort',
                                    id: 'sort',
                                    label: '排序',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
                        modal.show().$body.orangeForm(formOpts);
                    }
                }
            ],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [
                    {
                        type: "text",
                        label: "指标名称",
                        name: "name",
                        placeholder: "输入要搜索的指标名称"
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);


        var setting = {
            async: {
                enable: true,
                url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper,
                autoParam: ["id", "name", "pId"]
            },
            edit: {
                enable: true,
				drag:{
					isMove:false,
					isCopy:false
				}
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                    var zTree = $.fn.zTree.getZTreeObj(treeId);
                    zTree.expandAll(true);
                },
                onRename: function (e, treeId, treeNode, isCancel) {
                    var zTree = $.fn.zTree.getZTreeObj(treeId);
                    zTree.refresh();
                },
                beforeRename: beforeRename,
                beforeRemove: beforeRemove
            }
        };

        $.fn.zTree.init($("#tree"), setting);
        tree = $.fn.zTree.getZTreeObj("tree");

        function beforeRename(treeId, treeNode, newName, isCancel) {
            if (newName.length == 0) {
                return false;
            }
            if (!isCancel) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    data: {
                        id: treeNode.id,
                        parentId: treeNode.getParentNode() == undefined ? 0 : treeNode.getParentNode().id,
                        name: newName
                    },
                    url: App.href + "/api/core/scoreIndex/update",
                    success: function (data) {
                        if (data.code === 200) {
                            tree.reAsyncChildNodes(null, "refresh");
                        } else {
                            alert(data.message);
                        }
                    },
                    error: function (e) {
                        alert("请求异常。");
                    }
                });
            }
            return true;
        }

        function beforeRemove(treeId, treeNode) {
            var requestUrl = App.href + "/api/core/scoreIndex/delete";
            bootbox.confirm("确定该操作?", function (result) {
                if (result) {
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        data: {
                            id: treeNode.id
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
                    return true;
                } else {
                    return false;
                }
            });

        }


        $("#add_node").on("click", function (e) {
            var modal = $.orangeModal({
                id: "add_modal",
                title: "添加节点",
                destroy: true
            }).show();
            var form = modal.$body.orangeForm({
                id: "add_form",
                name: "add_form",
                method: "POST",
                action: App.href + "/api/core/scoreIndex/insert",
                ajaxSubmit: true,
                rowEleNum: 1,
                ajaxSuccess: function () {
                    modal.hide();
                    grid.reload();
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
                        grid.reload();
                    }
                }],
                buttonsAlign: "center",
                items: [
                    /*{
                        type: 'tree',
                        name: 'parentId',
                        id: 'parentId',
                        label: '父节点',
                        url: App.href + "/api/core/scoreIndex/treeNodes",
                        expandAll: true,
                        autoParam: ["id", "name", "pId"],
                        chkStyle: "radio"
                    },*/ {
						type:'hidden',
						name:'paperId',
						label: '评价表ID',
						value:currentPaper
					},{
                        type: 'text',
                        name: 'name',
                        id: 'name',
                        label: '指标名称',
                        cls: 'input-xxlarge',
                        rule: {
                            required: true
                        },
                        message: {
                            required: "请输入指标名称"
                        }
                    }, {
                        type: 'text',
                        name: 'score',
                        id: 'score',
                        label: '指标分值',
                        cls: 'input-xxlarge',
                        rule: {
                            required: true
                        },
                        message: {
                            required: "请输入指标分值"
                        }
                    }
                ]
            });
        });

    };
})(jQuery, window, document);