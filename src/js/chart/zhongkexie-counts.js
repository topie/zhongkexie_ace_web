/**
 *  查看进度 所有用户的填写内容
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/counts/page": "countsPaper"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.countsPaper = {
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
            url: App.href + "/api/core/scoreCount/partIndexScore",
            contentType: "chart-bar",
            contentTypeItems: "table,chart-bar,card",
			showContentType:true,
            pageNum: 1,//当前页码
            pageSize: 16,//每页显示条数
            idField: "id",//id域指定
            headField: "title",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
			displaySearch:false,
			cardEleNum:4,
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [8, 16, 30, 60,200],
            columns: [
                 {
                    title: "学会编码",
					width:"10%",
                    field: "loginName",
					format:function(i,c){
						return c.loginName.replace("002",'');
					}
                }, {
                    title: "学会",
					width:"20%",
                    field: "displayName",
					chartX:true
                },
					{
                    title: "分数",
					width:"50%",
                    field: "score",
					chartY:true
                }
                
                
            ],
			tools:[{
                    text: "导出",
                    cls: " btn-primary btn",
                    icon: "fa fa-cloud-download",
                    handle: function (grid) {
                        var searchData = grid.$searchForm.serialize();
						App.download(App.href+"/api/core/scoreCount/partIndexScoreExport?"+searchData);
						
                    }
                }],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "10%",
            actionColumns: [
				{
                    text: "查看",
                    cls: "btn-primary btn-sm",
                    handle:function (index, data) {
                        var paper = {};
                        var modal = $.orangeModal({
                            id: "scorePaperView",
                            title: "查看-"+data.userName,
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
						 var contentString = "";
						 var paperId = $("select[name='paperId']").val();
						$.ajax({
							url:App.href + "/api/core/scorePaper/load/"+paperId,
							dataType: "json",
							data: {
								paperId: paperId
							},
							async:false,
							success:function(res){
								if(res.code==200){
									contentString=res.data.contentJson;
								}else{
									bootbox.alert("请求错误");
								}
							},
							error:function(){
								bootbox.alert("服务器内部错误");
							}
						});
						var js = JSON.parse(contentString);
                        paper = modal.$body.orangePaperView(js);
                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            data: {
                                paperId: paperId,
								userId:data.userId
                            },
                            url: App.href + "/api/core/scorePaper/getAnswer",
                            success: function (data) {
                                if (data.code === 200) {
                                    paper.loadAnswer(data.data);
									/*setTimeout(function(){
									$("#scorePaperView").find("input:text").each(function(i,c){
										var v = $(c).val();
										var parent = $(c).parent();
										var cla = parent.attr("class")
										$('<lable class="control-label '+cla+'">'+v+'</lable>').insertAfter(parent);
										parent.remove();
									})
									},1000)*/
									
                                } else {
                                    alert(data.message);
                                }
                            },
                            error: function (e) {
                                alert("请求异常。");
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
                        type: "select",
                        label: "评估项目",
                        name: "paperId",
						//items:[{text:"2018年度全国学会综合能力评估",value:"1"}]
						items:[],
						itemsUrl:App.href+"/api/core/scorePaper/getPaperSelect"
                    }
					,{
                        type: "inputGroupBtn",
                        label: "指标分类选择",
                        name: "indexIds",
						placeholder:"请选择",
						clickCall:function(input){
							var currentPaper =$("select[name='paperId']").val();
							var modal = $.orangeModal({
								id: "scorePaperIndexView",
								title: "选择指标",
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
							var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            ajaxSubmit: true,
                            showSubmit: false,
                            rowEleNum: 2,
                            ajaxSuccess: function () {
                                modal.hide();
                            },
                            showReset: true,//是否显示重置按钮
                            resetText: "重置",//重置按钮文本
                            isValidate: true,//开启验证
                            buttons: [{
                                type: 'button',
								cls: "btn btn-primary",
                                text: '确认',
                                handle: function () {
									var id = modal.$body.find("#indexIds").val();
									input.val(id);
									modal.hide();
                                }
                            },{
                                type: 'button',
                                text: '关闭',
                                handle: function () {
                                    modal.hide();
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
								/*{
									type: 'tree',//类型
									name: 'orgIds',
									id: 'orgIds',//id
									label: '机构',//左边label
									url: App.href + "/api/core/dept/tree",
									//url:App.href + "/api/core/scorePaper/zjcheckListName?paperId="+currentPaper,
									//expandAll: true,
									//mtype:"GET",
									autoParam: ["id", "name", "pId"],
									chkStyle: "checkbox",
									chkboxType:{"Y": "ps", "N": "s"},
									expandAll:false
								},*/
								{
									type: 'tree',//类型
									name: 'indexIds',
									id: 'indexIds',//id
									label: '指标',//左边label
									url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper,
									//expandAll: true,
									autoParam: ["id", "name", "pId"],
									//hideSearch:false,
									chkStyle: "checkbox",
									chkboxType:{"Y": "ps", "N": "s"},
									expandAll:false,
									rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择指标"
                                    }
								}
									
                                
                            ]
                        };
                         form = modal.$body.orangeForm(formOpts);

						}
                    },{
                        type: "inputGroupBtn",
                        label: "指标项选择",
                        name: "itemIds",
						placeholder:"请选择",
						clickCall:function(input){
							var currentPaper =$("select[name='paperId']").val();
							var modal = $.orangeModal({
								id: "scorePaperIndexView",
								title: "选择指标",
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
							var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            ajaxSubmit: true,
                            showSubmit: false,
                            rowEleNum: 2,
                            ajaxSuccess: function () {
                                modal.hide();
                            },
                            showReset: true,//是否显示重置按钮
                            resetText: "重置",//重置按钮文本
                            isValidate: true,//开启验证
                            buttons: [{
                                type: 'button',
								cls: "btn btn-primary",
                                text: '线性打分项',
                                handle: function () {
									$.ajax({
										type:"GET",
										url:App.href+"/api/core/scoreItem/list",
										data:{scoreType:"2",pageSize:999999},
										success:function(res){
											if(res.code==200){
												var id = [];
												$.each(res.data.data,function(i,c){
													id.push(c.id);
												})
												input.val(id);
												modal.hide();
											
											}else{
												bootbox.alert("请求错误");
											}
										},
										error:function(){
											bootbox.alert("请求错误");
										}
									})
                                }
                            },{
                                type: 'button',
								cls: "btn btn-primary",
                                text: '专家打分项',
                                handle: function () {
									$.ajax({
										type:"GET",
										url:App.href+"/api/core/scoreItem/list",
										data:{scoreType:"3",pageSize:999999},
										success:function(res){
											if(res.code==200){
												var id = [];
												$.each(res.data.data,function(i,c){
													id.push(c.id);
												})
												input.val(id);
												modal.hide();
											
											}else{
												bootbox.alert("请求错误");
											}
										},
										error:function(){
											bootbox.alert("请求错误");
										}
									})
                                }
                            },{
                                type: 'button',
								cls: "btn btn-primary",
                                text: '重大任务/满意度',
                                handle: function () {
									$.ajax({
										type:"GET",
										url:App.href+"/api/core/scoreItem/list",
										data:{scoreType:"4",pageSize:999999},
										success:function(res){
											if(res.code==200){
												var id = [];
												$.each(res.data.data,function(i,c){
													id.push(c.id);
												})
												input.val(id);
												modal.hide();
											
											}else{
												bootbox.alert("请求错误");
											}
										},
										error:function(){
											bootbox.alert("请求错误");
										}
									})
                                }
                            },{
                                type: 'buttonGroup',
								cls: "btn btn-primary",
                                text: '选择部门',
								actions:[],
								actionsUrl:App.href +"/api/core/dict/getItems?code=ZZBM",
								handle: function (dept) {
									$.ajax({
										type:"GET",
										url:App.href+"/api/core/scoreItem/list",
										data:{responsibleDepartment:dept.value,pageSize:999999},
										success:function(res){
											if(res.code==200){
												var id = [];
												$.each(res.data.data,function(i,c){
													id.push(c.id);
												})
												input.val(id);
												modal.hide();
											
											}else{
												bootbox.alert("请求错误");
											}
										},
										error:function(){
											bootbox.alert("请求错误");
										}
									})
								}
                            },{
                                type: 'button',
								cls: "btn btn-primary",
                                text: '确认',
                                handle: function () {
									var id = modal.$body.find("#itemIds").val();
									id= id.replace(/-/g,'')
									input.val(id);
									modal.hide();
                                }
                            },{
                                type: 'button',
                                text: '关闭',
                                handle: function () {
                                    modal.hide();
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
								/*{
									type: 'tree',//类型
									name: 'orgIds',
									id: 'orgIds',//id
									label: '机构',//左边label
									url: App.href + "/api/core/dept/tree",
									//url:App.href + "/api/core/scorePaper/zjcheckListName?paperId="+currentPaper,
									//expandAll: true,
									//mtype:"GET",
									autoParam: ["id", "name", "pId"],
									chkStyle: "checkbox",
									chkboxType:{"Y": "ps", "N": "s"},
									expandAll:false
								},*/
								{
									type: 'tree',//类型
									name: 'itemIds',
									id: 'itemIds',//id
									label: '指标',//左边label
									dataFilter:function (treeId, parentNode, responseData) {
										if(parentNode==undefined){
											if (responseData) {
											  for(var i =0; i < responseData.length; i++) {
												responseData[i]['isParent']=true;
												responseData[i]['nocheck']=true;
											  }
											}
										}
										return responseData;
									},
									url: function (treeId, treeNode) {
										if(treeNode==undefined)return App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper;
										
										return App.href + "/api/core/scoreItem/getTreeNode?indexId="+treeNode.id;
									},//App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper,
									autoParam: ["id", "name", "pId"],
									chkStyle: "checkbox",
									//hideSearch:false,
									chkboxType:{"Y": "ps", "N": "s"},
									rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择指标"
                                    }
								}
									
                                
                            ]
                        };
                         form = modal.$body.orangeForm(formOpts);
						}
                    }
					,{
                        type: "select",
                        label: "学会分类",
                        name: "deptType",
						items:[
								{
								text:'全部',
								value:''
								},
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
								}]
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
				

    };
})(jQuery, window, document);