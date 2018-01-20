/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scorePaper/checkpage": "checkpage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.checkpage = {
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
                    title: "试卷名称",
                    field: "title"
                },  {
                    title: "填报单位",
                    field: "userName",
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
                                paperId: data.id,
								userId:data.userId
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
                },{
                    text: "评价",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                      bootbox.alert("正努力开发中");
					}
                }/*,             
                {
                    text: "通过",
                    cls: "btn-primary btn-sm",
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
                }, {
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
            ],
            tools: [
                {
                    text: "导出",
                    cls: "btn btn-primary",
                    icon: "fa fa-excle",
                    handle: function (grid) {
                        var modal = $.orangeModal({
                            id: "export_excle",
                            title: "导出",
                            destroy: true
                        }).show();
						var form ;
						var currentPaper = 3;
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            ajaxSubmit: true,
                            showSubmit: false,
                            rowEleNum: 2,
                            ajaxSuccess: function () {
                                modal.hide();
                            },
                            showReset: true,//是否显示重置按钮
                            resetText: "重置",//重置按钮文本
                            isValidate: true,//开启验证
                            buttons: [{
                                type: 'button',
								cls: "btn btn-primary",
                                text: '查看',
                                handle: function () {
									var data = form.getFormSerialize()+"&paperId=3";
									 $.ajax({
										url:App.href +"/api/core/scorePaper/getPaperJson",
										type:"post",
										dataType: "json",
										data:data,
										success: function (data) {
											if (data.code === 200) {
												var paper = {};
												var modal = $.orangeModal({
													id: "scorePaperView_1",
													title: "查看",
													destroy: true
												}).show();
												var js = data.data;
												paper = modal.$body.orangePaperView(js);
												$.ajax({
													type: "POST",
													dataType: "json",
													data: {
														paperId: currentPaper
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
                                type: 'button',
								cls: "btn btn-primary",
                                text: '开始导出',
                                handle: function () {
                                }
                            },{
                                type: 'button',
                                text: '关闭',
                                handle: function () {
                                    modal.hide();
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
								{
									type: 'tree',//类型
									name: 'orgIds',
									id: 'orgIds',//id
									label: '机构',//左边label
									url: App.href + "/api/core/dept/tree",
									expandAll: true,
									autoParam: ["id", "name", "pId"],
									chkStyle: "checkbox",
									chkboxType:{"Y": "ps", "N": "s"},
									expandAll:false
								},
								{
									type: 'tree',//类型
									name: 'indexIds',
									id: 'indexIds',//id
									label: '指标',//左边label
									url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper,
									expandAll: true,
									autoParam: ["id", "name", "pId"],
									chkStyle: "checkbox",
									chkboxType:{"Y": "ps", "N": "s"},
									expandAll:false
								},
									
                                
                            ]
                        };
                         form = modal.$body.orangeForm(formOpts);
						  
						
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