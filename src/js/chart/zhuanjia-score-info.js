/**
 * 专家完成情况
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/chart/expert/finishInfo": "expertFinishInfoPage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.expertFinishInfoPage = {
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
            url: App.href + "/api/core/scoreCount/countExpertFinishInfoList",
            contentType: "table",
            contentTypeItems: "table,card,chart-bar",
			showContentType:true,
            pageNum: 1,//当前页码
            pageSize: 30,//每页显示条数
            idField: "id",//id域指定
            headField: "title",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
			displaySearch:true,
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [10, 15, 30, 50,100,150,200,300],
            columns: [
                {
                    title: "专家姓名",
                    field: "displayName",
					chartX:true
                },  {
                    title: "已评价个数",
					chartY:true,
                    field: "count"
                }
                
                
            ],
            tools: [
				{
                    text: "导出",
                    cls: " btn-primary btn",
                    icon: "fa fa-cloud-download",
                    handle: function (grid) {
                        
						App.download(App.href+"/api/core/scoreCount/countExpertFinishInfoExport");
						
                    }
                }
            ],
            search: {
                rowEleNum: 3,
				hide:true,
                //搜索栏元素
                items: [
                    {
                        type: "select",
                        label: "评价表",
                        name: "paperId",
					}
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
				

    };
})(jQuery, window, document);