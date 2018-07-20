/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/publicity/page": "publicityPage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.publicityPage = {
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
            url: App.href + "/api/core/scorePaper/zkxcheckList",
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
                    title: "评估项目",
                    field: "title"
                },  {
                    title: "填报单位",
                    field: "userName",
					format:function(index,data){
						if(data.checkStatus==0){
							return '<span style="color:#ccc;" title="已退回">'+data.userName+'(已退回)</span>';						
						}
						if(data.checkStatus==1){
							return '<span style="color:#aaa;" title="审核中">'+data.userName+'(审核中)</span>';				
						}
						return data.userName;
					}
                },  {
                    title: "总得分",
                    field: "score"/*,
					format:function(index,data){
						//if(data.subjectiveScore==0)
						//	return data.score;
						if(data.subjectiveScore>=0)
							return data.score+data.subjectiveScore+"("+data.score+"+"+data.subjectiveScore+")";
						return data.score+data.subjectiveScore+"("+data.score+data.subjectiveScore+")";

					}*/
                }
                
                
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
                rowEleNum: 3,
				hide:false,
                //搜索栏元素
                items: [
                    {
                        type: "select",
                        label: "评估项目",
                        name: "paperId",
						items:[],
						itemsUrl:App.href+"/api/core/scorePaper/getPaperSelect"
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
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
				

    };
})(jQuery, window, document);