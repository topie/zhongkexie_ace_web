/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/publicityconf/page": "publicityconfPage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.publicityconfPage = {
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
        var options = {
            url: App.href + "/api/publicity/info/list",
            contentType: "table",
            contentTypeItems: "table,card,list",
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "id",//id域指定
            headField: "title",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
			displaySearch:false,
			cardEleNum:4,
            indexNumWidth: "5%",
            pageSelect: [8, 15, 30, 60],
            columns: [
                 {
                    title: "评估项目",
                    field: "title"
				},
				{
                    title: "公示状态",
                    field: "publicity",
					format:function(i,data){
						if(data.publicity==1)return "已公示";
						return "未公示";
					}
				}
				
            ],
			actionColumnText: "操作",//操作列文本
            actionColumnWidth: "15%",
            actionColumns: [
				{
                    text: "",
					textHandle:function(i,data){
						if(data.publicity==1){
							return "取消公示";
						}
						return "公示";
						
					},
                    cls: "btn-primary btn-sm",
                    handle:function (index, data) {
						 bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
								var sta = data.publicity==1?0:1;
                                var requestUrl = App.href + "/api/publicity/info/update";
                                $.ajax({
                                    type: "POST",
                                    dataType: "json",
                                    data: {
                                        id: data.id,
                                        title: data.title,
										publicity:sta,
										paperId:data.id
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
				}]
            
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
				

    };
})(jQuery, window, document);