/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scorePaper/ncheckpage": "ncheckpage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.ncheckpage = {
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
            url: App.href + "/api/core/scorePaper/zjcheckListNotFinishedColl",
			formatData:function(data){
				return data;
			},
            contentType: "table",
            contentTypeItems: "table,card,list",
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "id",//id域指定
            headField: "title",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
			showPaging:false,
            indexNumWidth: "5%",
			renderEmptyTbodyText:"您当前评分任务已完成",
            pageSelect: [2, 15, 30, 50],
            columns: [
                /*{
                    title: "ID",
                    field: "id",
                    sort: true,
                    width: "5%"
                },*/ {
                    title: "评估项目",
                    field: "title"
                },  {
                    title: "填报单位",
                    field: "display_name",
					format:function(index,data){
						if(data.checkStatus==0){
							return '<span style="color:#ccc;" title="已退回">'+data.display_name+'(已退回)</span>';						
						}
						if(data.checkStatus==1){
							return '<span style="color:#aaa;" title="审核中">'+data.display_name+'(审核中)</span>';				
						}
						if(data.checkStatus==3){
							return '<span style="color:#aaa;" title="审核中">'+data.display_name+'(已退回)</span>';				
						}
						return data.display_name;
					}
                },
				{
                    title: "评价状态",
                    field: "display_name",
					format:function(index,data){
						return '待评价';
					}
                }
                /*, {
                    title: "填报审核状态",
                    field: "checkStatus",
                    format:function(num,data){
                    	
                    	
                    	if(data.checkStatus==0 )
                    		{
                    		return "未审核";
                    		}
                    	else if(data.checkStatus==1)
                    	{
                    		return "已通过";
                    	}
                    	else
                    		{
                    		return "已驳回";
                    		}
                    }
                }*/
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
                            title: "查看-"+data.display_name,
                            destroy: true
                        }).show();
                        var contentString = "";
							$.ajax({
								url:App.href + "/api/core/scorePaper/getPaper",
								dataType: "json",
								data: {
									paperId: data.id
								},
								async:false,
								success:function(res){
									if(res.code==200){
										contentString=res.message;
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
                                paperId: data.id,
								userId:data.userId
                            },
                            url: App.href + "/api/core/scorePaper/getAnswer",
                            success: function (data) {
                                if (data.code === 200) {
                                    paper.loadAnswer(data.data);
									/*modal.$body.find('input').each(function(){
										if($(this).attr('name')!='button')
											$(this).attr("disabled","true");
									});*/
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
                    text: "专家评价",
					visible:function(index,data){
					      if(data.checkStatus==0)return false;
						  if(data.checkStatus==1)return false;
						  return true;
					},
                    cls: "btn-primary btn-sm",
                    handle: function (index, coll) {
						var modal = $.orangeModal({
                            id: "scorePaperView",
                            title: "专家评价-"+coll.display_name,
							width:"100%",
							destroy: true,
							buttons: [
								{
									type: 'button',
									text: '关闭',
									cls: "btn btn-default",
									handle: function (m) {
										grid.reload();
										m.hide();
									}
								}
							]
                        }).show();
							var contentString = "";
							$.ajax({
								url:App.href + "/api/core/scorePaper/getPaper",
								dataType: "json",
								data: {
									paperId: coll.id
								},
								async:false,
								success:function(res){
									if(res.code==200){
										contentString=res.message;
									}else{
										bootbox.alert("请求错误");
									}
								},
								error:function(){
									bootbox.alert("服务器内部错误");
								}
							});
							var titles=[];
							$.ajax({
								url:App.href + "/api/core/scorePaper/zjcheckListNotFinishedColl",
								dataType: "json",
								data: grid.$searchForm == undefined ? {} : grid.$searchForm
                        .serialize(),
								async:false,
								success:function(res){
									if(res.code==200){
										titles = res.data.data;
									}else{
										bootbox.alert("请求错误");
									}
								},
								error:function(){
									bootbox.alert("服务器内部错误");
								}
							});
							
						var data = JSON.parse(contentString);
						data.paperId=coll.id;
						data.userId=coll.userId;
						data.tabTitles = titles;
						/*data.finish=function(paper,btn){
							var currentItem = paper.$tab.currentLi().data("tab-data");
							var json = {paperId:coll.id,userId:currentItem.userId,status:1};
							$.ajax({
								url:App.href + "/api/expert/paper/zjFinish",
								dataType: "json",
								data: json,
								async:false,
								success:function(res){
									if(res.code==200){
										var che = $('<i class="ace-icon fa fa-check"></i>');
										if(paper.$tab.currentLi().find('.fa-check').length==0){
											paper.$tab.currentLi().find("a").prepend('<i class="ace-icon fa fa-check"></i>');
										}
                                       btn.prepend(che);
										grid.reload();
									   setTimeout(function(){che.remove();},3000);
									}else{
										bootbox.alert("请求错误");
									}
								},
								error:function(){
									bootbox.alert("服务器内部错误");
								}
							})
							
						}*/
						//var paper = modal.$body.orangePaperViewScore(data);
						var paper = modal.$body.orangePaperFillScore(data);
						paper.go();
					}	
                      
                }
            ],
            tools: [
                
            ]
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
		

    };
})(jQuery, window, document);