/**
 *  查看进度 所有用户的填写内容
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/task/page": "jtaskPaper"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.jtaskPaper = {
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
        var numIndex = ["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","二十一","二十二","二十三","二十四","二十五","二十六","二十七"];
		var options = {
            url: App.href + "/api/task/scoreCounts/list",
            contentType: "table",
            contentTypeItems: "table,card,list",
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
                 /*{
                    title: "学会编码",
					width:"10%",
                    field: "loginName",
					format:function(i,c){
						return c.loginName.subStr(0,c.loginName.length-3);
					}
                },*/ {
                    title: "学会",
					width:"20%",
                    field: "displayName"
                },
					{
                    title: "分数",
					width:"50%",
                    field: "score"
                }
                
                
            ],
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
                            title: "查看-"+data.displayName,
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
						var $body = modal.$body;
						var taskValue = [];
						$.ajax({url:App.href+"/api/task/scoreCounts/taskScoreList",
								data:{paperId:data.paperId,userId:data.id},
								async:false,
								type:"GET",
								success:function(res){
									if(res.code==200){
										taskValue = res.data;
									}else{
										bootbox.alert(data.message);
									}
								},error:function(){alert("请求异常");}
							});
						$.ajax({url:App.href+"/api/task/task/allTask",
								data:{paperId:data.paperId},
								type:"GET",
								success:function(res){
									if(res.code==200){
										var items = res.data;
										renderForm(items);
									}else{
										bootbox.alert(data.message);
									}
								},error:function(){alert("请求异常");}
							});
						
						function renderForm(items){
							if(items.length==0){
								$body.html('<h3>没有任务</h3>');
								return;
							}
							var top=getTopIndex(items);
							$.each(top,function(index,item){
								createParentTitle(index,item);
								if(item.hasChild==true){
									var child = getChildIndex(items,item.id);
									$.each(child,function(ci,citem){
										createChild(ci,citem);
									});
								}else{
									createChild(0,item);
								}
							})
						}
						
						function createParentTitle(index,item){
							$body.append('<h3 class="header smaller lighter red">'+numIndex[index]+'.'+item.taskName+'</h3>');
						}
						function createChild(ci,item){
							var str = '<span class="green">（未参与）</span>';
							for(var i=0;i<taskValue.length;i++){
								if(item.id==taskValue[i].taskId){
									if(taskValue[i].value==0){
										str = '<span class="blue">（主要负责）('+taskValue[i].score+'分)</span>';
									}
									if(taskValue[i].value==1){
										str = '<span class="blue">（承担部分任务）('+taskValue[i].score+'分)</span>';
									}
									if(taskValue[i].value==2){
										str = '<span class="blue">（提供专家或派人参与）('+taskValue[i].score+'分)</span>';
									}
									if(taskValue[i].value==3){
										str = '<span class="blue">（提供相关材料）('+taskValue[i].score+'分)</span>';
									}
								}
							}
							$body.append('<h4 class="lighter block green" style="margin-left: 40px;">'+(ci+1)+"."+item.taskName+'('+item.taskScore+'分)'+str+'</h4>');
						}
						function getTopIndex(items){
							var top=[];
							taskIds=[];
							$.each(items,function(i,item){
								if(item.parentId==0){
									top.push(item)
								}
								if(item.taskStatus==1){
									taskIds.push(item.id);
								}
							});
							return top;
						
						}
						function getChildIndex(items,parentId){
							var child=[];
							$.each(items,function(i,item){
								if(item.parentId==parentId){
									child.push(item)
								}
							});
							return child;
						}
					}
                }
				
            ],
			tools:[{
                    text: "重新计算分数",
                    cls: " btn-info btn",
                    icon: "fa fa-reflush",
                    handle: function (grid) {
                        var searchData = grid.$searchForm.serialize();
						$.ajax(App.href+"/api/task/task/updateScore?"+searchData,function(res){
							if(res.code==200)bootbox.alert("更新成功");
							else bootbox.alert(res.message);
						});
						
                    }
                },{
                    text: "导出",
                    cls: " btn-primary btn",
                    icon: "fa fa-cloud-download",
                    handle: function (grid) {
                        var searchData = grid.$searchForm.serialize();
						App.download(App.href+"/api/task/scoreCounts/taskScoreListExport?"+searchData);
						
                    }
                }],
            search: {
                rowEleNum: 3,
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
					/*,{
                        type: "text",
                        label: "学会名称",
                        name: "name",
						placeholder:"学会名称搜索"
                    }
					,{
                        type: "select",
                        label: "学会分类",
                        name: "type",
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
                    }*/
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
				

    };
})(jQuery, window, document);