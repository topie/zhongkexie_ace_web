/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/task/task/config": "taskconfig"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.taskconfig = {
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
		var deptDict,indexDict;
		var grid;
        var tree,mapData;
        var options = {
            url: App.href + "/api/task/task/list?parentId=0",
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
                    title: "任务编号",
                    field: "taskCode"
					
                },
                {
                    title: "任务名称",
                    field: "taskName"
					
                },
                {
                    title: "所属类别",
                    field: "indexId",
					format:function(index,data){
						if(index==1){
							var paperId_select = $('#paperId_select').val();
							$.ajax({
								async:false,
								url:App.href + "/api/core/scoreIndex/list?parentId=0&paperId="+paperId_select,
								success:function(res){
									indexDict=res.data.data;
								}
							})
						}
							var s = '- -';
						for(var i=0;i<indexDict.length;i++){
							if(indexDict[i].id==data.indexId){
								s= indexDict[i].name;
							}
						}
						return s;
						
					}
                },  {
                    title: "牵头部门",
                    field: "taskDept",
					format:function(index,data){
						if(deptDict==undefined){
							$.ajax({
								async:false,
								url:App.href + "/api/sys/user/pageList?userType=2",
								success:function(res){
									deptDict=res.data.data;
								}
							})
						}
							var s = '- -';
						for(var i=0;i<deptDict.length;i++){
							if(deptDict[i].id==data.taskDept){
								s= deptDict[i].displayName;
							}
						}
						return s;
						
					}
                },  {
                    title: "权重",
                    field: "taskWeight",
                },  {
                    title: "分数",
                    field: "taskScore",
                }
               
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
				 {
					text: "编辑",
                    cls: "btn-sm btn-primary",
                    handle: function (index,data) {

						var paperId_select = $('#paperId_select').val();
                        var modal = $.orangeModal({
                            id: "add_modal",
                            title: "编辑",
                            destroy: true
                        }).show();
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/task/task/update",
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
                                    id: 'paperId'
                                },{
                                    type: 'hidden',
                                    name: 'parentId',
                                    id: 'parentId'
                                },
                                {
                                    type: 'text',
                                    name: 'taskCode',
                                    id: 'taskCode',
                                    label: '任务编号',
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
                                    name: 'taskName',
                                    id: 'taskName',
                                    label: '任务名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, {
                                    type: 'select',
                                    name: 'indexId',
                                    id: 'indexId',
                                    label: '所属分类',
                                    cls: 'input-xxlarge',
									itemsUrl:App.href + "/api/core/scoreIndex/list?parentId=0&paperId="+paperId_select,
									autoParam:["id","name","data","data"],
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, {
                                    type: 'select',
                                    name: 'taskDept',
                                    id: 'taskDept',
                                    label: '牵头部门',
                                    cls: 'input-xxlarge',
									itemsUrl:App.href + "/api/sys/user/pageList?userType=2",
									autoParam:["id","displayName","data","data"],
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                },
                                {
                                    type: 'radioGroup',
                                    name: 'hasChild',
                                    id: 'hasChild',
                                    label: '是否有子任务',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    },
									items:[{text:"是",value:true},{text:'否',value:false}]
                                },
                                {
                                    type: 'text',
                                    name: 'taskWeight',
                                    id: 'taskWeight',
                                    label: '权重',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                },
                                 {
                                    type: 'select2',
                                    name: 'linkDept',
                                    id: 'linkDept',
                                    label: '考核部门',
                                    cls: 'input-xxlarge',
                                    items:[],
                                    itemsUrl: App.href +"/api/core/dict/getItems?code=ZZBM",
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
				},{
					visible:function(index,data){
						if(data.parentId==0 && data.hasChild){
							return true;
						}
						return false;
					},
					text: "子任务管理",
                    cls: "btn-sm btn-primary",
                    handle: function (index,parentData) {
						var itemModal = $.orangeModal({
                            id: "scoreItemOptionGrid",
                            title: "子任务-" + parentData.taskName,
                            destroy: true,
                            width: $(window).width()
                        }).show();
                        var parentId = parentData.id;
                        var requestUrl = App.href + "/api/task/task/list?parentId=" + parentId;
						 itemModal.$body.orangeForm({
                                            id: "static_item_edit_form",
                                            name: "static_item_edit_form",
                                            method: "POST",
											action: App.href + "/api/task/task/insert",
                                            ajaxSubmit: true,
											rowEleNum:2,
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
                                                    name: 'parentId',
                                                    id: 'parentId',
                                                    value: parentId
                                                }, {
                                                    type: 'hidden',
                                                    name: 'paperId',
                                                    id: 'paperId',
                                                    value: parentData.paperId
                                                }, {
                                                    type: 'hidden',
                                                    name: 'indexId',
                                                    id: 'indexId',
                                                    value: parentData.indexId
                                                }, {
                                                    type: 'hidden',
                                                    name: 'hasChild',
                                                    id: 'hasChild',
                                                    value: 'false'
                                                },
												 {
													type: 'hidden',
													name: 'linkDept',
													id: 'linkDept',
													label: '考核部门',
													cls: 'input-xxlarge',
                                                    value: parentData.linkDept
												}, {
													type: 'hidden',
													name: 'taskDept',
													id: 'taskDept',
													label: '牵头部门',
													cls: 'input-xxlarge',
                                                    value: parentData.taskDept
												},{
													type: 'text',
													name: 'taskCode',
													id: 'taskCode',
													label: '子任务编号',
													cls: 'input-xxlarge',
													rule: {
														required: true
													},
													message: {
														required: "请输入"
													}
												}, {
                                                    type: 'text',
                                                    name: 'taskName',
                                                    id: 'taskName',
                                                    label: '子任务名称',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入文本"
                                                    }
                                                }, {
                                                    type: 'text',
                                                    name: 'taskWeight',
                                                    id: 'taskWeight',
                                                    label: '权重',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入权重"
                                                    }
                                                }, {
                                                    type: 'text',
                                                    name: 'taskDesc',
                                                    id: 'taskDesc',
                                                    label: '描述',
                                                    cls: 'input-xxlarge'
                                                }
                                            ]
                                        }
							
						);
                        itemGrid = itemModal.$body.orangeGrid({
                            url: requestUrl,
                            contentType: "table",
                            contentTypeItems: "table,card,list",
							replate2B:false,
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
									title: "任务编号",
									field: "taskCode"
									
								},
								{
									title: "任务名称",
									field: "taskName"
									
								},  {
									title: "牵头部门",
									field: "taskDept",
									format:function(index,data){
										if(deptDict==undefined){
											$.ajax({
												async:false,
												url:App.href + "/api/sys/user/pageList?userType=2",
												success:function(res){
													deptDict=res.data.data;
												}
											})
										}
											var s = '- -';
										for(var i=0;i<deptDict.length;i++){
											if(deptDict[i].id==data.taskDept){
												s= deptDict[i].displayName;
											}
										}
										return s;
										
									}
								},  {
									title: "权重",
									field: "taskWeight",
								},  {
									title: "分数",
									field: "taskScore",
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
											id: "add_modal",
											title: "编辑",
											destroy: true
										}).show();
										var formOpts = {
											id: "add_form",
											name: "add_form",
											method: "POST",
											action: App.href + "/api/task/task/update",
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
													id: 'paperId'
												},{
													type: 'hidden',
													name: 'parentId',
													id: 'parentId'
												},
												{
													type: 'text',
													name: 'taskCode',
													id: 'taskCode',
													label: '任务编号',
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
													name: 'taskName',
													id: 'taskName',
													label: '任务名称',
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
													name: 'taskWeight',
													id: 'taskWeight',
													label: '权重',
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
									   form.loadLocal(d);
									}
                                },
                                {
                                    text: "删除",
                                    cls: "btn-danger btn-sm",
                                    handle: function (index, d, grid) {
                                        bootbox.confirm("确定该操作?", function (result) {
                                            if (result) {
												var requestUrl = App.href + "/api/task/task/delete";
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
                           
                        });
                    }
                }/*, {
                    text: "启用",
                    cls: " btn-sm",
                    handle: function (index, data) {
                       
                    }
                }, {
                    text: "停止填报",
                    cls: " btn-sm",
                    handle: function (index, data) {
                       
                    }
                }*/, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/task/task/delete";
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
					   var pid = $("#paperId_select").val();
                        var modal = $.orangeModal({
                            id: "add_modal",
                            title: "添加",
                            destroy: true
                        }).show();
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/task/task/insert",
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
                                    id: 'paperId'
                                },{
                                    type: 'hidden',
                                    name: 'parentId',
                                    id: 'parentId'
                                },
                                {
                                    type: 'text',
                                    name: 'taskCode',
                                    id: 'taskCode',
                                    label: '任务编号',
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
                                    name: 'taskName',
                                    id: 'taskName',
                                    label: '任务名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, {
                                    type: 'select',
                                    name: 'taskDept',
                                    id: 'taskDept',
                                    label: '牵头部门',
                                    cls: 'input-xxlarge',
									itemsUrl:App.href + "/api/sys/user/pageList?userType=2",
									autoParam:["id","displayName","data","data"],
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                },
                                {
                                    type: 'radioGroup',
                                    name: 'hasChild',
                                    id: 'hasChild',
                                    label: '是否有子任务',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    },
									items:[{text:"是",value:true},{text:'否',value:false}]
                                },
                                {
                                    type: 'text',
                                    name: 'taskWeight',
                                    id: 'taskWeight',
                                    label: '权重',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                },
                                 {
                                    type: 'select2',
                                    name: 'linkDept',
                                    id: 'linkDept',
                                    label: '考核部门',
                                    cls: 'input-xxlarge',
                                    items:[],
                                    itemsUrl: App.href +"/api/core/dict/getItems?code=ZZBM",
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
					   form.loadLocal({paperId:pid,parentId:"0",hasChild:true});
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
		var currentPaperId=0;
		
    }
})(jQuery, window, document);