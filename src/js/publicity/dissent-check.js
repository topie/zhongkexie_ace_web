/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/disssentcheck/page": "dissentcheckPage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.dissentcheckPage = {
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
        var tree;
        var options = {
            url: App.href + "/api/dissent/info/list",
            contentType: "table",
            contentTypeItems: "table,card,list",
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "id",//id域指定
            headField: "title",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
			displaySearch:false,
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 15, 30, 50],
            columns: [
                {
                    title: "有异议的学会名称",
                    field: "dissentOrg"
                },  {
                    title: "有异议的指标项",
                    field: "dissentIndex"
                },  {
                    title: "提交学会",
                    field: "inputOrg"
                },  {
                    title: "已读状态",
                    field: "content",
					format:function(index,data){
						if(data.readStatus==1){return "已读"}
						return "未查看"
					}
                }
                
            ],
			actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
				{
                    text: "查看",
                    cls: "btn-primary btn-sm",
                    handle:function (index, data) {
						var modal = $.orangeModal({
                            id: "scorePaperView",
                            title: "查看",
                            destroy: true,
							buttons: [
                               {
                                    type: 'button',
                                    text: '关闭',
                                    cls: "btn",
                                    handle: function (m) {
                                        modal.hide();    
                                        
                                    }
                                }]
                        }).show();

						var form = modal.$body.orangeForm(formOpts);
						form.loadLocal(data);
						modal.show();
					}
				},
				{
                    text: "",
					textHandle:function(i,data){
						if(data.readStatus==1){
							return "标记为未读";
						}
						return "标记为已读";
						
					},
                    cls: "btn-primary btn-sm",
                    handle:function (index, data) {
						 bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
								var sta = data.readStatus==1?0:1;
                                var requestUrl = App.href + "/api/dissent/info/update";
                                $.ajax({
                                    type: "POST",
                                    dataType: "json",
                                    data: {
                                        id: data.id,
										readStatus:sta
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
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/dissent/info/delete";
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
            search: {
                rowEleNum: 4,
				hide:false,
                //搜索栏元素
                items: [
					{
                                    type: 'text',
                                    name: 'dissentOrg',
                                    id: 'dissentOrg',
                                    label: '有异议的学会名称:'
                                },{
                                    type: 'text',
                                    name: 'dissentIndex',
                                    id: 'dissentIndex',
                                    label: '有异议的指标项:'
                                },
                                {
                                    type: 'text',
                                    name: 'inputOrg',
                                    id: 'inputOrg',
                                    label: '提交学会:'
                                }/*,
                                {
                                    type: 'text',
                                    name: 'inputUser',
                                    id: 'inputUser',
                                    label: '提交人:'
                                }*/
                   
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
		var formOpts = {
				id: "add_dict_form",
				name: "add_dict_form",
				method: "POST",
				action: App.href + "/api/disst/info/insert",
				ajaxSubmit: true,
				rowEleNum: 1,
				ajaxSuccess: function (data) {
				},
				showSubmit:false,
				submitText: "提交",//保存按钮的文本
				showReset: false,//是否显示重置按钮
				resetText: "重置",//重置按钮文本
				isValidate: true,//开启验证
				buttonsAlign: "center",
				items:[{
                                    type: 'hidden',
                                    name: 'id',
                                    id: 'id'
                                },{
                                    type: 'display',
                                    name: 'dissentOrg',
                                    id: 'dissentOrg',
                                    label: '有异议的学会名称:'
                                }/*,
                                {
                                    type: 'text',
                                    name: 'dictSeq',
                                    id: 'dictSeq',
                                    label: '联系人',
                                    cls: 'input-xxlarge'
                                }*/,{
                                    type: 'display',
                                    name: 'dissentIndex',
                                    id: 'dissentIndex',
                                    label: '有异议的指标项:'
                                }/*,
                                {
                                    type: 'text',
                                    name: 'dictDesc',
                                    id: 'dictDesc',
                                    label: '联系电话',
                                    cls: 'input-xxlarge'
                                }*/, {
                                    type: 'display',
                                    name: 'content',
                                    id: 'content',
                                    label: '异议内容:'
                                },
                                {
                                    type: 'display',
                                    name: 'inputOrg',
                                    id: 'inputOrg',
                                    label: '提交学会:'
                                },
                                {
                                    type: 'display',
                                    name: 'inputUser',
                                    id: 'inputUser',
                                    label: '提交人:'
                                },
                                {
                                    type: 'display',
                                    name: 'phone',
                                    id: 'inputUser',
                                    label: '联系电话:'
                                },
                                {
                                    type: 'display',
                                    name: 'email',
                                    id: 'inputUser',
                                    label: '联系邮箱:'
                                }]
			};	

    };
})(jQuery, window, document);