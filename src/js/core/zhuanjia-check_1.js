/**
 * 
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
            url: App.href + "/api/core/scorePaper/zjcheckList",
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
                    text: "专家评价",
                    cls: "btn-primary btn-sm",
                    handle: function (index, coll) {
						var modal = $.orangeModal({
                            id: "scorePaperView",
                            title: "专家评价-"+coll.userName,
                            destroy: true
                        }).show();
							var contentString = "";
							$.ajax({
								url:App.href + "/api/core/scorePaper/getPaper",
								dataType: "json",
								data: {
									paperId: coll.id
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
						var data = JSON.parse(contentString);
						data.paperId=coll.id;
						data.userId=coll.userId;
						var paper = modal.$body.orangePaperViewScore(data);
						$.ajax({
                            type: "POST",
                            dataType: "json",
                            data: {
                                paperId: coll.id,
								userId:coll.userId
                            },
                            url: App.href + "/api/core/scorePaper/getAnswer",
                            success: function (res) {
                                if (res.code === 200) {
                                    paper.loadAnswer(res.data,function(an){
										var url =App.href + "/api/core/scorePaper/getAnswerOfRanking";
										var msg = an.answerValue;
											$.ajax({
													type: "POST",
													dataType: "json",
													async:false,
													data: {
														itemId:an.itemId,
														answer:an.answerValue
													},
													url: url,
													success: function (result) {
														if (result.code === 200) {
															msg = "<font style='color:#f00;margin-left:10px;' >"+result.message+"</font>";
														} else {
															bootbox.alert(result.message);
														}
													},
													error: function (e) {
														alert("请求异常。");
													}
												});
											return msg;
									});
									paper.loadScores(res.data);
									$("#main-body").find('div.formbody input').each(function(){
										if($(this).attr('name')!='button')
											$(this).attr("disabled","true");
									});
                                } else {
                                    alert(res.message);
                                }
                            },
                            error: function (e) {
                                alert("请求异常。");
                            }
                        });
					}	
                        /*var paper = {};
                        var modal = $.orangeModal({
                            id: "scorePaperView",
                            title: "专家评价-"+data.userName,
                            destroy: true
                        }).show();
                        var js = JSON.parse(data.contentJson);

						js.showSocre=true;
						js.itemActions=[
							{
								text: "评分",
								cls: "btn-info btn-sm",
								handle: function ( item,label) {
									var score = item.score;
									bootbox.prompt({
										title: "请评价最终得分：",
										inputType: 'number',
										value:score,
										callback: function (result) {
											if(result==null || result==''){
												return;
											}
											var sc=result;
											if(isNaN(parseInt(sc))){
												bootbox.alert("请输入数字！");
												return false;
											}
											if(parseInt(sc)>parseInt(score)){
												bootbox.alert("分数不能大于总分数！");
												return false;
											}
											if(parseInt(sc)<0){
												bootbox.alert("分数不能为负数！");
												return false;
											}
											$.ajax({
												type: "POST",
												dataType: "json",
												data: {
													paperId: data.id,
													userId:data.userId,
													itemId:item.name,
													answerScore:sc
												},
												url: App.href + "/api/core/scorePaper/updateAnswerScore",
												success: function (data) {
													if (data.code === 200) {
														var tab = label.parent().find("label.anserScore");
														if(tab.length>0)tab.remove();
														label.after('<label class="anserScore" style="color:blue">(得分：'+sc+')</label>');
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
							},{
								text: "取消虚假标记",
								cls: "btn-info btn-sm",
								attribute:'role=realinfo',
								handle: function ( item,label) {

									$.ajax({
										type: "POST",
										dataType: "json",
										data: {
											paperId: data.id,
											userId:data.userId,
											itemId:item.name,
											answerReal:true
										},
										url: App.href + "/api/core/scorePaper/updateAnswerReal",
										success: function (data) {
											if (data.code === 200) {
												var tab = label.parent().find("label.realmarker");
												if(tab.length>0)tab.remove();
												label.after('<label class="realmarker" style="color:red">(已取消)</label>');
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
								text: "信息虚假",
								cls: "btn-primary btn-sm",
								attribute:'role=realinfo',
								handle: function ( item,label) {
									 $.ajax({
										type: "POST",
										dataType: "json",
										data: {
											paperId: data.id,
											userId:data.userId,
											itemId:item.name,
											answerReal:false
										},
										url: App.href + "/api/core/scorePaper/updateAnswerReal",
										success: function (data) {
											if (data.code === 200) {
												var tab = label.parent().find("label.realmarker");
												if(tab.length>0)tab.remove();
												label.after('<label class="realmarker" style="color:red">(已标记为虚假)</label>');
												var tab = label.parent().find("label.anserScore");
												if(tab.length>0)tab.remove();
												label.after('<label class="anserScore" style="color:blue">(得分：0)</label>');
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
						];
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
									
                                    paper.loadReals(data.data);
									paper.loadScores(data.data);
                                } else {
                                    alert(data.message);
                                }
                            },
                            error: function (e) {
                                alert("请求异常。");
                            }
                        });
                    }*/
                }, /*{
                    text: "退回",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
						bootbox.confirm("确定退回到填报员？",function(res){
							if(res){
								var requestUrl = App.href + "/api/core/scorePaper/reportBack";
								$.ajax({
									type: "GET",
									dataType: "json",
									data: {
										id: data.id,
										userId:data.userId
									},
									url: requestUrl,
									success: function (data) {
										if (data.code === 200) {
											grid.reload();
											bootbox.alert("已成功退回,请联系填报员！");
										} else {
											bootbox.alert("错误："+data.message);
										}
									},
									error: function (e) {
										alert("请求异常。");
									}
								});
							}
							return;
						})
                    	
                    }
                }*//*
				,{
                    text: "导出",
                    cls: " btn-primary btn-sm",
                    icon: "fa fa-excle",
                    handle: function (index,griddata) {
                        var modal = $.orangeModal({
                            id: "export_excle",
                            title: "导出",
                            destroy: true
                        }).show();
						var form ;
						var currentPaper = griddata.id;
						var currentU = griddata.userName;
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
                            buttons: [/*{
                                type: 'button',
								cls: "btn btn-primary",
                                text: '查看',
                                handle: function () {
									var data = form.getFormSerialize()+"&paperId="+currentPaper;
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
                            },*//*{
                                type: 'button',
								cls: "btn btn-primary",
                                text: '开始导出',
                                handle: function () {
									var data = form.getFormSerialize()+"&paperId="+currentPaper;
									App.download(App.href+"/api/core/scorePaper/exportPaper?"+data)
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
								}
									
                                
                            ]
                        };
                         form = modal.$body.orangeForm(formOpts);
						  
						
                    }
                }*/
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