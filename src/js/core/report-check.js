/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scorePaper/reportCheck": "reportCheck"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.reportCheck = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
              //  '<div class="panel panel-default" >' +
              //  '<div class="panel-heading">题库试卷管理</div>' +
                '<div class="panel-body" id="grid"></div>' +
               // '</div>' +
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
            url: App.href + "/api/core/scorePaper/reportCheck",
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
                    title: "试卷名称",
                    field: "title",
                    sort: true
                }, {
                    title: "开始时间",
                    field: "begin",
                    sort: true,
					format:function(i,n){
						var beg = new Date(n.begin);
						return beg.format("yyyy-MM-dd hh:mm:ss");
					}
                }, {
                    title: "结束时间",
                    field: "end",
                    sort: true,
					format:function(i,n){
						var beg = new Date(n.end);
						return beg.format("yyyy-MM-dd hh:mm:ss");
					}
                }
                , {
                    title: "填报审核状态",
                    field: "status",
                    format:function(num,data){
                    	
                    	
                    	if( data.status==0)
                    		{
                    		return "未审核";
                    		}
                    	else if(data.status==1)
                    	{
                    		return "已通过";
                    	}
                    	else
                    		{
                    		return "已驳回";
                    		}
                    },
                    sort: true
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
				{
                    text: "预览",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var paper = {};
                        var modal = $.orangeModal({
                            id: "scorePaperView",
                            title: "预览",
                            destroy: true
                        }).show();
                        var js = JSON.parse(data.contentJson);
                        paper = modal.$body.orangePaperView(js);
                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            data: {
                                paperId: data.id
                            },
                            url: App.href + "/api/core/scorePaper/getAnswer",
                            success: function (data) {
                                if (data.code === 200) {
                                    paper.loadAnswer(data.data);
									modal.$body.find('input').each(function(){
										if($(this).attr('name')!='button')
											$(this).attr("disabled","true");
									});
                                } else {
                                    alert(data.message);
                                }
                            },
                            error: function (e) {
                                alert("请求异常。");
                            }
                        });
                    }
                },             
                {
                    text: "通过",
                    cls: "btn-primary btn-sm",
					visible:function(index,data){
						if( data.status==0)
                    		return true;
						return false;
					},
                    handle: function (index, data) {
                    	var requestUrl = App.href + "/api/core/scorePaper/reportContentCheck";
                    	$.ajax({
                            type: "GET",
                            dataType: "json",
                            data: {
                                id: data.id,
                                result:1
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
                }, {
                    text: "驳回",
                    cls: "btn-danger btn-sm",
					visible:function(index,data){
						if( data.status==0)
                    		return true;
						return false;
					},
                    handle: function (index, data) {
                    	var requestUrl = App.href + "/api/core/scorePaper/reportContentCheck";
                    	$.ajax({
                            type: "GET",
                            dataType: "json",
                            data: {
                                id: data.id,
                                result:2
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
                }
                ],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [
                    {
                        type: "text",
                        label: "试卷名称",
                        name: "title",
                        placeholder: "输入要搜索的试卷名称"
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