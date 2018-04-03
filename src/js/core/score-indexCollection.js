/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scorePaper/indexCollection": "indexCollection"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.indexCollection = {
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
            url: App.href + "/api/core/scoreIndexCollection/list",
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
                    title: "指标组名称",
                    field: "name"
                },
					{
                    title: "指标组描述",
                    field: "description"
                },
                
                
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
				{
                    text: "查看",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var paper = {};
                        var modal = $.orangeModal({
                            id: "scorePaperView",
                            title: "查看-"+data.userName,
                            destroy: true
                        }).show();
                        var js = JSON.parse(data.contentJson);
						js.showSocre=true;
                        paper = modal.$body.orangePaperView(js);
                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            data: {
                                paperId: data.id,
								userId:data.userId
                            },
                            url: App.href + "/api/core/scorePaper/getAnswer",
                            success: function (data) {
                                if (data.code === 200) {
                                    paper.loadAnswer(data.data);
									modal.$body.find('input').each(function(){
										if($(this).attr('name')!='button')
											$(this).attr("disabled","true");
									});
									paper.loadReals(data.data,"虚假");
									paper.loadScores(data.data);
                                } else {
                                    alert(data.message);
                                }
                            },
                            error: function (e) {
                                alert("请求异常。");
                            }
                        });
                    }
                },{
                    text: "编辑",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                      {	
						var currentPaper = data.paperId;
						var modal = $.orangeModal({
                            id: "scorePaperViewF",
                            title: "编辑",
                            destroy: true
                        }).show();
                       var formOpt={
							id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/core/scoreIndexCollection/update",
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
                                    name: 'paperId',
                                    id: 'paperId',
									value:currentPaper
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
                                        required: "请输入"
                                    }
                                }, {
                                    type: 'textarea',
                                    name: 'description',
                                    id: 'description',
                                    label: '描述',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, {
                                    type: 'select2',
                                    name: 'tags',
                                    id: 'tags',
                                    label: '标签',
                                    cls: 'input-xxlarge',
                                    items:[],
                                    itemsUrl: App.href +"/api/core/dict/getItems?code=ZYBQ"
                                },{
									type: 'tree',//类型
									name: 'indexCollection',
									id: 'indexCollection',//id
									label: '指标',//左边label
									url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper,
									expandAll: true,
									autoParam: ["id", "name", "pId"],
									chkStyle: "checkbox",
									chkboxType:{"Y": "ps", "N": "s"},
									expandAll:false,
									onAsyncSuccess:function(treeObj){
										$.ajax({
											url:App.href + "/api/core/scoreIndexCollection/getSelectedNodesId?id="+data.id+"&sort_=sort_asc&paperId="+currentPaper,
											type:"GET",
											success:function(res){
												if(res.code==200){
													var ids = res.data;
													for (var i=0, l=ids.length; i < l; i++) {
														var node = treeObj.getNodeByParam("id",ids[i]);
														treeObj.setChkDisabled(node,true);
													}
												}else{
													alert("加载失败");
												}
											}
										});
									}
								}
                            ]
                        };
						var form = modal.$body.orangeForm(formOpt);
						form.loadLocal(data);
                        modal.show();

                    }
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
						bootbox.confirm("确定删除？",function(res){
							if(res){
								var requestUrl = App.href + "/api/core/scoreIndexCollection/delete";
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
											bootbox.alert("错误："+data.message);
										}
									},
									error: function (e) {
										alert("请求异常。");
									}
								});
							}
							return;
						})
                    	
                    }
                }
				
            ],
            tools: [
				
				{	
					text: "  添加",
					cls: "btn btn-primary",
					icon: "fa fa-add",
					handle: function (grid) {
						var currentPaper = $("select[name='paperId']").val();
						var modal = $.orangeModal({
                            id: "scorePaperViewF",
                            title: "添加",
                            destroy: true
                        }).show();
                       var formOpt={
							id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/core/scoreIndexCollection/insert",
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
                                    name: 'paperId',
                                    id: 'paperId',
									value:currentPaper
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
                                        required: "请输入"
                                    }
                                }, {
                                    type: 'textarea',
                                    name: 'description',
                                    id: 'description',
                                    label: '描述',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, {
                                    type: 'select2',
                                    name: 'tags',
                                    id: 'tags',
                                    label: '标签',
                                    cls: 'input-xxlarge',
                                    items:[],
                                    itemsUrl: App.href +"/api/core/dict/getItems?code=ZYBQ"
                                },{
									type: 'tree',//类型
									name: 'indexCollection',
									id: 'indexCollection',//id
									label: '指标',//左边label
									url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper,
									expandAll: true,
									autoParam: ["id", "name", "pId"],
									chkStyle: "checkbox",
									chkboxType:{"Y": "ps", "N": "s"},
									expandAll:false,
									onAsyncSuccess:function(treeObj){
										$.ajax({
											url:App.href + "/api/core/scoreIndexCollection/getSelectedNodesId?&sort_=sort_asc&paperId="+currentPaper,
											type:"GET",
											success:function(res){
												if(res.code==200){
													var ids = res.data;
													for (var i=0, l=ids.length; i < l; i++) {
														var node = treeObj.getNodeByParam("id",ids[i]);
														treeObj.setChkDisabled(node,true);
													}
												}else{
													alert("加载失败");
												}
											}
										});
									}
								},
                            ]
                        };
						var form = modal.$body.orangeForm(formOpt);
						form.loadLocal({tags:"财务,行政"});
                        modal.show();

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
                        label: "试卷名称",
                        name: "paperId",
						items:[],
						itemsUrl:App.href+"/api/core/scorePaper/getPaperSelect"
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
				

    };
})(jQuery, window, document);