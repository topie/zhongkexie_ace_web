/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scorePaper/reportList": "scoreReportList"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.scoreReportList = {
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
            url: App.href + "/api/core/scorePaper/reportList",
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
                    title: "试卷名称",
                    field: "title",
                    sort: true
                }, {
                    title: "开始时间",
                    field: "begin",
                    sort: true
                }, {
                    title: "结束时间",
                    field: "end"
                }, {
                    title: "填报状态",
                    field: "status",
                    format: function (num, data) {
                        if (data.status == 1) {
                            return "<span style='color:green'>填报中</span>";
                        }
                        else if (data.status == 0) {
                            return "<span style='color:red'>已关闭</span>";
                        }
						return '- -';
					}
                },
                {
                    title: "审核状态",
                    field: "status",
                    format: function (num, data) {
                        if (data.approveStatus == 0) {
                            return "未提交";
                        }
                        else if (data.approveStatus == 1) {
                            return "审核中";
                        }
						else if (data.approveStatus == 2) {
                            return "审核通过";
                        }
                        else if (data.approveStatus == 3) {
                            return "已驳回";
                        }
						return '- - ';
                    }
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [{
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
                                modal.$body.find('input').each(function () {
                                    if ($(this).attr('name') != 'button')
                                        $(this).attr("disabled", "true");
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
                    text: "填报",
                    cls: "btn-primary btn-sm",
                    visible: function (index, data) {
                        if (data.approveStatus == 1)
                            return false;
						if (data.approveStatus == 2)
                            return false;
                        return true;
                    },
                    handle: function (index, data) {
                        var paper = {};
                        var modal = $.orangeModal({
                            id: "scorePaperView",
                            title: "填报",
                            destroy: true,
                            buttons: [
                                {
                                    type: 'button',
                                    text: '检查',
                                    cls: "btn btn-primary",
                                    handle: function (m) {
                                        var das = {};
                                        var msg = paper.getValidation();
                                        if (msg.length > 0) {
                                            bootbox.alert(msg[0].text + "未填写");
                                            paper.$tab.go(msg[0].index);
                                            return;
                                        }else{
											 bootbox.alert('全部填写完成');
										}
                                        
                                    }
                                },{
                                    type: 'button',
                                    text: '检查并保存',
                                    cls: "btn btn-primary",
                                    handle: function (m) {
                                        var das = {};
                                        var msg = paper.getValidation();
                                        if (msg.length > 0) {
                                            bootbox.alert(msg[0].text + "未填写");
                                            paper.$tab.go(msg[0].index);
                                            return;
                                        }
                                        var as = paper.getAnswer();
                                        das['answers'] = as;
                                        das['paperId'] = data.id;
                                        $.ajax({
                                            type: "POST",
                                            dataType: "json",
                                            contentType: "application/json",
                                            data: JSON.stringify(das),
                                            url: App.href + "/api/core/scorePaper/submit",
                                            success: function (data) {
                                                modal.hide();
                                            },
                                            error: function (e) {
                                                alert("请求异常。");
                                            }
                                        });
                                    }
                                },{
                                    type: 'button',
                                    text: '关闭',
                                    cls: "btn",
                                    handle: function (m) {
                                       modal.hide();    
                                    }
                                }
                            ]
                        }).show();
                        var js = JSON.parse(data.contentJson);
                        paper = modal.$body.orangePaperFill(js, {
                            next: function (p) {
                                var das = {};
                                var as = p.getCurrentTabAnswer();
                                das['answers'] = as;
                                das['paperId'] = data.id;
                                $.ajax({
                                    type: "POST",
                                    dataType: "json",
                                    contentType: "application/json",
                                    data: JSON.stringify(das),
                                    url: App.href + "/api/core/scorePaper/submit",
                                    success: function (data) {
                                        p.$tab.next();
                                    },
                                    error: function (e) {
                                        alert("请求异常。");
                                    }
                                });
                            },
                            prev: function (p) {
                                p.$tab.prev();
                            }
                        });
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
                    text: "查看意见",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            data: {
                                paperId: data.id
                            },
                            url: App.href + "/api/core/scorePaper/getFeedback",
                            success: function (data) {
                                if (data.code === 200) {
									if(data.data===null){
										bootbox.alert("没有意见");
										return ;
									}
									if(data.data.feedback===null){
										bootbox.alert("没有意见");
										return ;
									} 
									if(data.data.feedback=='' ){
										bootbox.alert("没有意见");
										return ;
									}
									bootbox.alert(data.data.feedback);
									
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
                    text: "提交",
                    cls: "btn-primary btn-sm",
                    visible: function (index, data) {
                        if (data.approveStatus == 1)
                            return false;
						if (data.approveStatus == 2)
                            return false;
                        return true;
                    },
					handle:function(index,data){

						bootbox.confirm("确认提交?", function (result) {
							if (result) {
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

    };

})(jQuery, window, document);
