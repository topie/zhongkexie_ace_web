/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scorePaper/historyList": "historyList"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.historyList = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                //  '<div class="panel panel-default" >' +
                //  '<div class="panel-heading">题库试卷管理</div>' +
                '<div class="panel-body" id="grid"></div>' +
                //  '</div>' +
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
            url: App.href + "/api/core/scorePaper/historyPaper",
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
                /* {
                     title: "ID",
                     field: "id",
                     sort: true,
                     width: "5%"
                 }, */{
                    title: "评估项目",
                    field: "title",
                    sort: true
                }, {
                    title: "填报时间",
                    field: "begin",
                    sort: true
                } 
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [{
                text: "查看",
                cls: "btn-primary btn-sm",
                handle: function (index, data) {
                    var paper = {};
                    var modal = $.orangeModal({
                        id: "scorePaperView",
                        title: "查看",
                        destroy: true,
						buttons: [
                                {
                                    type: 'button',
                                    text: '导出模板',
                                    cls: "btn btn-primary",
                                    handle: function (m) {
                                        $("#scorePaperView_panel").wordExport(data.title+"_导出");
										
                                    }
                                }, {
                                    type: 'button',
                                    text: '导出数据',
                                    cls: "btn btn-primary",
                                    handle: function (m) {
                                        $("#scorePaperView_panel").wordExportValue(data.title+"_数据导出");
                                        
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
                    var js = JSON.parse(data.contentJson);
					js.showIndex=true;
                    paper = modal.$body.orangePaperView(js);
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        data: {
                            paperId: data.id,
							timestamp_:new Date().getTime()
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
            ]
        };
        grid = window.App.content.find("#grid").orangeGrid(options);

    };

})(jQuery, window, document);
