/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scorePaper/checkList": "scoreCheck"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.scoreCheck = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
               // '<div class="panel panel-default" >' +
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
            url: App.href + "/api/core/scorePaper/checkList",
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
                    field: "title",
                    sort: true
                }, {
                    title: "开始时间",
                    field: "begin",
                    sort: true
                }, {
                    title: "结束时间",
                    field: "end",
                    sort: true
                }
                , {
                    title: "审核状态",
                    field: "approveStatus",
                    format: function (num, data) {
						if (data.approveStatus == 0) {
                            return "未提交审核";
                        }
                        else if (data.approveStatus == 1) {
                            return "未审核";
                        }
                        else if (data.approveStatus == 2) {
                            return "已通过";
                        }
                        else if(data.approveStatus==3){
                            return "已驳回";
                        }else{
							return '- -';
						}
                    },
                    sort: true
                }, {
                    title: "评估状态",
                    field: "status",
                    format: function (num, data) {
						if (data.status == 0) {
                            return "<span style='color:red;'>关闭</span>";
                        }
                        else if (data.status == 1) {
                            return "<span style='color:green'>填报中</span>";
                        }else{
							return '- -';
						}
                    }
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
                            title: "审核评价表",
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
                                    bootbox.alert(data.message);
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
						if (data.approveStatus == 1) return true;
						return false;
					},
                    handle: function (index, data) {
						bootbox.confirm("确认通过，通过后将不能修改?", function (result) {
							if (result) {
								var requestUrl = App.href + "/api/core/scorePaper/check";
								$.ajax({
									type: "GET",
									dataType: "json",
									data: {
										id: data.id,
										result: 2
									},
									url: requestUrl,
									success: function (data) {
										if (data.code === 200) {
											grid.reload();
										} else {
											bootbox.alert(data.message);
										}
									},
									error: function (e) {
										alert("请求异常。");
									}
								});
							}
						});
                    }
                }, {
                    text: "驳回",
                    cls: "btn-danger btn-sm",
					visible:function(index,data){
						if (data.approveStatus == 1) return true;
						return false;
					},
                    handle: function (index, data) {
						bootbox.confirm("确认驳回?", function (result) {
							if (result) {
								var requestUrl = App.href + "/api/core/scorePaper/check";
								$.ajax({
									type: "GET",
									dataType: "json",
									data: {
										id: data.id,
										result: 3
									},
									url: requestUrl,
									success: function (data) {
										if (data.code === 200) {
											grid.reload();
										} else {
											bootbox.alert(data.message);
										}
									},
									error: function (e) {
										alert("请求异常。");
									}
								});
							}
						});
                    }
                },
                {
                    text: "开启填报",
					textHandle:function(index,data){
						if(data.status ==1) return '关闭填报';
						return '开启填报';
					},
                    cls: "btn-primary btn-sm",
					visible:function(index,data){
						if (data.approveStatus == 2) return true;
						return false;
					},
                    handle: function (index, data) {
                        var requestUrl = App.href + "/api/core/scorePaper/paperStatus";
						var status=1;
						if (data.status == 1) status=0;
                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            data: {
                                id: data.id,
                                status: status
                            },
                            url: requestUrl,
                            success: function (data) {
                                if (data.code === 200) {
                                    grid.reload();
									bootbox.alert('操作成功！');
                                } else {
                                    bootbox.alert(data.message);
                                }
                            },
                            error: function (e) {
                                alert("请求异常。");
                            }
                        });
                    }
                },
					{
                    text: "发送通知",
                    cls: "btn-primary btn-sm",
					visible:function(index,data){
						if (data.approveStatus == 2) return true;
						return false;
					},
                    handle: function (index, data) {
						bootbox.confirm("确认发送通知?", function (result) {
							if (result) {
								var requestUrl = App.href + "/api/core/message/insert";
								$.ajax({
									type: "POST",
									dataType: "json",
									data: {
										spId: data.id,
										status:"1",
										type:"message"
									},
									url: requestUrl,
									success: function (data) {
										if (data.code === 200) {
											grid.reload();
											bootbox.alert("发送成功");
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
                }/*, {
                    text: "预览",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "scorePaperView",
                            title: "预览",
                            destroy: true
                        });
                        modal.show();
                        var js = JSON.parse(data.contentJson);
                        modal.$body.orangePaperView(js);
                    }
                }*/
            ], /*,
            tools: [
                {
                    text: " 添 加",
                    cls: "btn btn-primary",
                    icon: "fa fa-plus",
                    handle: function (grid) {
                        var modal = $.orangeModal({
                            id: "add_modal",
                            title: "添加",
                            destroy: true
                        }).show();
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/core/scorePaper/insert",
                            ajaxSubmit: true,
                            rowEleNum: 1,
                            ajaxSuccess: function () {
                                modal.hide();
                                grid.reload();
                            },
                            submitText: "保存",//保存按钮的文本
                            showReset: true,//是否显示重置按钮
                            resetText: "重置",//重置按钮文本
                            isValidate: true,//开启验证
                            buttons: [{
                                type: 'button',
                                text: '关闭',
                                handle: function () {
                                    modal.hide();
                                    grid.reload();
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
                                {
                                    type: 'text',
                                    name: 'title',
                                    id: 'title',
                                    label: '评估项目',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入评估项目"
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'begin',
                                    id: 'begin',
                                    label: '开始时间',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    },
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择开始时间"
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'end',
                                    id: 'end',
                                    label: '结束时间',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    },
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择结束时间"
                                    }
                                }
                            ]
                        };
                        modal.$body.orangeForm(formOpts);
                    }
                }
            ],*/
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [
                    {
                        type: "text",
                        label: "评估项目",
                        name: "title",
                        placeholder: "输入要搜索的评估项目"
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);

    };
})(jQuery, window, document);