/**
 *  查看所有用户的填写内容
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/userPaper/page": "userPaper"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.userPaper = {
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
            url: App.href + "/api/core/dept/list?pid=1",
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
            showIndexNum: false,
            indexNumWidth: "5%",
            pageSelect: [8, 16, 30, 60],
            columns: [
                 {
                    title: "编码",
                    field: "code"
                },{
                    title: "学会名称",
                    field: "name"
                },{
                    title: "学会分类",
                    field: "type"
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
                            title: "查看-"+data.name,
                            destroy: true,
						buttons: [
                                {
                                    type: 'button',
                                    text: '导出模板',
                                    cls: "btn btn-primary",
                                    handle: function (m) {
                                        $("#scorePaperView_panel").wordExport("模板导出");
										
                                    }
                                }, {
                                    type: 'button',
                                    text: '导出数据',
                                    cls: "btn btn-primary",
                                    handle: function (m) {
                                        $("#scorePaperView_panel").wordExportValue(data.name+"_数据导出");
                                        
                                    }
                                },{
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
						js.showNumIndex=true;
						js.numIndexExCludeIds=[118,172,205,198,200];
                        paper = modal.$body.orangePaperView(js);
                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            data: {
                                paperId: paperId,
								deptId:data.id
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
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
				

    };
})(jQuery, window, document);