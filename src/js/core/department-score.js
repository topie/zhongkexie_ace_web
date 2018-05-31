/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/department/score/page": "departmentScorePage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.departmentScorePage = {
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
            showIndexNum: true,
            indexNumWidth: "5%",
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
                            title: "查看-"+data.userName,
                            destroy: true
                        }).show();
                        var contentString = "";
							$.ajax({
								url:App.href + "/api/department/info/paperJson",
								dataType: "json",
								data: {
									paperId: data.id
								},
								async:false,
								success:function(res){
									if(res.code==200){
										contentString=res.data;
									}else{
										bootbox.alert("请求错误");
									}
								},
								error:function(){
									bootbox.alert("服务器内部错误");
								}
							});
                        paper = modal.$body.orangePaperView(contentString);
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
                }
            ],
            tools: [
                
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
						items:[],
						itemsUrl:App.href+"/api/core/scorePaper/getPaperSelect"
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
		Date.prototype.format = function(format)
				{
				 var o = {
				 "M+" : this.getMonth()+1, //month
				 "d+" : this.getDate(),    //day
				 "h+" : this.getHours(),   //hour
				 "m+" : this.getMinutes(), //minute
				 "s+" : this.getSeconds(), //second
				 "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
				 "S" : this.getMilliseconds() //millisecond
				 }
				 if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
				 (this.getFullYear()+"").substr(4 - RegExp.$1.length));
				 for(var k in o)if(new RegExp("("+ k +")").test(format))
				 format = format.replace(RegExp.$1,
				 RegExp.$1.length==1 ? o[k] :
				 ("00"+ o[k]).substr((""+ o[k]).length));
				 return format;
				}

    };
})(jQuery, window, document);