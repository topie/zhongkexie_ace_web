/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
	  var mapping = {
        "/api/core/dept/page": "deptPage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.deptPage = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
					'<div class="col-md-4" >' +
						'<div class="panel panel-default" >' +
							'<div class="panel-heading">'+
							'学会树'+
							'</div>' +
							'<ul id="tree" class="ztree pre-scrollable" style="max-height:600px"></ul>' +
						'</div>' +
					'</div>' +
					'<div class="col-md-8" >' +
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
		
		var currentDeptId='';
		var currentDeptIdTitle='';
		var tree;
		
		
		var setting = {
            async: {
                enable: true,
                url: App.href + "/api/core/dept/tree",
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
			view:{
				//addDiyDom: addDiyDom  
			},
            callback: {
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                   // var zTree = $.fn.zTree.getZTreeObj(treeId);
                   // zTree.expandAll(true);
                },
				onClick:function(event, treeId, treeNode){
					currentDeptId = treeNode.id;
					currentDeptIdTitle = treeNode.name;
					var  url = App.href + "/api/core/dept/list?pid="+currentDeptId;
					grid.reload({url:url});
				}
            }
        };
		function addDiyDom(treeId, treeNode) {  
			var spaceWidth = 5;  
			var switchObj = $("#" + treeNode.tId + "_switch"),  
			icoObj = $("#" + treeNode.tId + "_ico");  
			switchObj.remove();  
			icoObj.before(switchObj);  
			if (treeNode.level > 1) {  
				var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";  
				switchObj.before(spaceStr);  
			}  
			var spantxt=$("#" + treeNode.tId + "_span").html();  
			if(spantxt.length>17){  
				spantxt=spantxt.substring(0,17)+"...";  
				$("#" + treeNode.tId + "_span").html(spantxt);  
			}
		} ;

        $.fn.zTree.init($("#tree"), setting);
        tree = $.fn.zTree.getZTreeObj("tree");

        var grid;
        var tree;
		var itemGrid;
        var options = {
            url: App.href + "/api/core/dept/list?pid=-1",
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
                    title: "学会名称",
                    field: "name",
                    sort: true
                }, {
                    title: "学会分类",
                    field: "type",
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
                            action: App.href + "/api/core/dept/update",
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
                                    name: 'pid',
									label: '父级学会ID',
                                    id: 'pid'
                                },{
                                    type: 'display',
                                    name: 'parentName',
									label: '父级学会',
                                    id: 'parentName'
                                },{
                                    type: 'text',
                                    name: 'name',
                                    id: 'name',
                                    label: '学会名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入名称"
                                    }
                                },{
                                    type: 'text',
                                    name: 'code',
                                    id: 'code',
                                    label: '学会编码',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入编码"
                                    }
                                },{
                                    type: 'text',
                                    name: 'duty',
                                    id: 'duty',
                                    label: '学会职能',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'select',
                                    name: 'type',
                                    id: 'type',
                                    label: '学会分类',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择分类"
                                    },
                                    items: [
                                        {
                                            text: '理科',
                                            value: '理科'
                                        },
                                        {
                                            text: '工科',
                                            value: '工科'
                                        },
                                        {
                                            text: '农科',
                                            value: '农科'
                                        },
                                        {
                                            text: '医科',
                                            value: '医科'
                                        },
                                        {
                                            text: '交叉学科',
                                            value: '交叉学科'
                                        },
                                        {
                                            text: '其他',
                                            value: '其他'
                                        }
                                    ]
                                
                                }, {
                                    type: 'select',
                                    name: 'field',
                                    id: 'field',
                                    label: '相关领域',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择"
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
                                    name: 'linkman',
                                    id: 'linkman',
                                    label: '联系人',
                                    cls: 'input-xxlarge'
                                },
                                {
                                    type: 'text',
                                    name: 'tel',
                                    id: 'tel',
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
                                    name: 'seq',
                                    id: 'seq',
                                    label: '排序',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts);
                        form.loadRemote(App.href + "/api/core/dept/load/" + data.id);
						form.loadLocal({parentName:currentDeptIdTitle});
                        modal.show();
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/core/dept/delete";
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
						if(currentDeptId){
							
						}else{
							bootbox.alert("请先选择父级学会!");
							return;
						}
                        var modal = $.orangeModal({
                            id: "add_modal",
                            title: "添加",
                            destroy: true
                        }).show();
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/core/dept/insert",
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
                                    type: 'hidden',
                                    name: 'pid',
									label: '父级学会ID',
                                    id: 'pid'
                                },{
                                    type: 'display',
                                    name: 'parentName',
									label: '父级学会',
                                    id: 'parentName'
                                },{
                                    type: 'text',
                                    name: 'name',
                                    id: 'name',
                                    label: '学会名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入名称"
                                    }
                                },{
                                    type: 'text',
                                    name: 'code',
                                    id: 'code',
                                    label: '学会编码',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入编码"
                                    }
                                },{
                                    type: 'text',
                                    name: 'duty',
                                    id: 'duty',
                                    label: '学会职能',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'select',
                                    name: 'type',
                                    id: 'type',
                                    label: '学会分类',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择分类"
                                    },
                                    items: [
                                        {
                                            text: '理科',
                                            value: '理科'
                                        },
                                        {
                                            text: '工科',
                                            value: '工科'
                                        },
                                        {
                                            text: '农科',
                                            value: '农科'
                                        },
                                        {
                                            text: '医科',
                                            value: '医科'
                                        },
                                        {
                                            text: '交叉学科',
                                            value: '交叉学科'
                                        },
                                        {
                                            text: '其他',
                                            value: '其他'
                                        }
                                    ]
                                
                                }, {
                                    type: 'select',
                                    name: 'field',
                                    id: 'field',
                                    label: '相关领域',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择"
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
                                    name: 'linkman',
                                    id: 'linkman',
                                    label: '联系人',
                                    cls: 'input-xxlarge'
                                },
                                {
                                    type: 'text',
                                    name: 'tel',
                                    id: 'tel',
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
                                    name: 'seq',
                                    id: 'seq',
                                    label: '排序',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
                       var form =  modal.$body.orangeForm(formOpts);
					   form.loadLocal({pid:currentDeptId,parentName:currentDeptIdTitle});
                    }
                }
            ],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [
                     {
                        type: "text",
                        label: "学会名称",
                        name: "name",
                        placeholder: "输入要搜索的学会名称"
                    },
					 {
                                    type: 'select',
                                    name: 'type',
                                    id: 'type',
                                    label: '学会分类',
                                    items: [
                                        {
                                            text: '',
                                            value: ''
                                        }, {
                                            text: '理科',
                                            value: '理科'
                                        },
                                        {
                                            text: '工科',
                                            value: '工科'
                                        },
                                        {
                                            text: '农科',
                                            value: '农科'
                                        },
                                        {
                                            text: '医科',
                                            value: '医科'
                                        },
                                        {
                                            text: '交叉学科',
                                            value: '交叉学科'
                                        }
                                    ]
                                
                                }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);

    };
})(jQuery, window, document);