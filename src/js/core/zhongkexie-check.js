/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scorePaper/scorePage": "scorePage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.scorePage = {
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
			displaySearch:false,
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 15, 30, 50],
            columns: [
                {
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
                },  {
                    title: "总得分",
                    field: "score"/*,
					format:function(index,data){
						//if(data.subjectiveScore==0)
						//	return data.score;
						if(data.subjectiveScore>=0)
							return data.score+data.subjectiveScore+"("+data.score+"+"+data.subjectiveScore+")";
						return data.score+data.subjectiveScore+"("+data.score+data.subjectiveScore+")";

					}*/
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
                            title: "查看-"+data.userName,
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
						js.showSocre=true;
						js.showType=true;
                        paper = modal.$body.orangePaperView(js);
						//添加详细打分情况start
						paper.$element.find(".zhuanjiapingfen").each(function(index,label){
							var $label = $(label);
							var itemId = $label.data("label-data");
							$.ajax({
									type: "get",
									dataType: "json",
									data: {
										itemId: itemId,
										userId:data.userId
									},
									url: App.href + "/api/expert/paper/getScoreInfo",
									success: function (res) {
										if (res.code === 200) {
											var html='<div><table>';
											$.each(res.data,function(i,c){
												html+="<tr><td style='padding-right: 20px;'>"+c.display_name+"</td><td>"+c.item_score+'</td></tr>';
												
											});	
											html+="</table></div>";
											if(res.data.length==0) html='暂无专家打分';
											var info = $('<i class="ace-icon fa fa-info-circle" style="color:#6fb3e0;font-size: 18px;" title="打分情况" data-content="'+html+'"></i>');
												info.popover({html:true});
												$label.append(info);
										}
										else{
											bootbox.alert(res.msg);
										}
									},
									error:function(){
										alert("请求错误");
									}
								})
							
						});
						//详细end
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
									/*modal.$body.find('input[type="text"]').each(function(){
										var $this = $(this);
										$this.parent().append('<span style="background-color:#ccc;height:'+$this.parent().height()+'px">'+$this.val()+'</span>');
										$this.remove();
										   /*console.log($this.val()+"==="+$this.get(0).offsetWidth);
										   var text_length = $this.val().length;//获取当前文本框的长度
										   var current_width = parseInt(text_length) *16;//该16是改变前的宽度除以当前字符串的长度,算出每个字符的长度
											
										   if($this.parent().width()<current_width)
											 $this.css("width",current_width+"px");
									});*/
									//paper.loadReals(data.data,"虚假");
									
									paper.loadScores(data.data);
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
                    text: "查看不包含题目分数",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var paper = {};
                        var modal = $.orangeModal({
                            id: "scorePaperView",
                            title: "查看-"+data.userName,
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
						//添加详细打分情况start
						
						//详细end
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
									/*modal.$body.find('input[type="text"]').each(function(){
										var $this = $(this);
										$this.parent().append('<span style="background-color:#ccc;height:'+$this.parent().height()+'px">'+$this.val()+'</span>');
										$this.remove();
										   /*console.log($this.val()+"==="+$this.get(0).offsetWidth);
										   var text_length = $this.val().length;//获取当前文本框的长度
										   var current_width = parseInt(text_length) *16;//该16是改变前的宽度除以当前字符串的长度,算出每个字符的长度
											
										   if($this.parent().width()<current_width)
											 $this.css("width",current_width+"px");
									});*/
									//paper.loadReals(data.data,"虚假");
									
									paper.loadScores(data.data);
                                } else {
                                    alert(data.message);
                                }
                            },
                            error: function (e) {
                                alert("请求异常。");
                            }
                        });
                    }
                }/*,{
                    text: "主观分",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                       var score = data.subjectiveScore;
									bootbox.prompt({
										title: "请输入主观分：",
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
											if(parseInt(sc)>10){
												bootbox.alert("分数不能超过10分！");
												return false;
											}
											if(parseInt(sc)<-10){
												bootbox.alert("分数不能少于-10分！");
												return false;
											}
											$.ajax({
												type: "GET",
												dataType: "json",
												data: {
													paperId: data.id,
													userId:data.userId,
													subjectiveScore:sc
												},
												url: App.href + "/api/core/scorePaper/updateSubjectiveScore",
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
                }*/, {
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
                }
				
            ],
            tools: [
				{	
					text: "  更新分数",
					cls: "btn btn-primary",
					icon: "fa fa-refresh",
					handle: function (grid) {
						var paperId = $("select[name='paperId']").val();
						var requestUrl = App.href+"/api/core/scorePaper/updatePaperScore";
						$.ajax({
									type: "GET",
									dataType: "json",
									data: {
										paperId:paperId
									},
									url: requestUrl,
									success: function (data) {
										if (data.code === 200) {
											grid.reload();
											bootbox.alert("已更新为最新分数！");
										} else {
											bootbox.alert("错误："+data.message);
										}
									},
									error: function (e) {
										alert("请求异常。");
									}
								});
					}
				},{
                    text: "导出详细情况",
                    cls: " btn-primary btn",
                    icon: "fa fa-download",
                    handle: function (grid) {
                        var modal = $.orangeModal({
                            id: "export_excle",
                            title: "导出",
                            destroy: true
                        }).show();
						var form ;
						var currentPaper = $("select[name='paperId']").val();
						//var currentU = griddata.userName;
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
                                text: '选中已提交的学会',
                                handle: function () {
                                   $.ajax({
										url:App.href + "/api/core/scorePaper/zjcheckListName",
										dataType: "json",
										data: {
											paperId: currentPaper
										},
										async:false,
										success:function(res){
												var ss = '';
											if(res.code==200){
												titles = res.data.data;
												 var treeObj = $.fn.zTree.getZTreeObj("tree_orgIds");
												 $.each(titles,function(){
													var name = this["userName"].trim();
													var nodes = treeObj.getNodesByParam("name", name, null);
													if(nodes.length>0)
														treeObj.checkNode(nodes[0], true, true);
													else 
														ss+=" "+name;
												 })
												if(ss!=''){
												 form._alert(ss+"  未选中，请手动选中","danger",500);
												 }
											}else{
												bootbox.alert("请求错误");
											}
										},
										error:function(){
											bootbox.alert("服务器内部错误");
										}
									});
                                }
                            },{
                                type: 'button',
								cls: "btn btn-primary",
                                text: '只导出分数',
                                handle: function () {
									var data = form.getFormSerialize()+"&paperId="+currentPaper+"&type=score";
									App.download(App.href+"/api/core/scorePaper/exportPaper?"+data,modal.$body)
                                }
                            },{
                                type: 'button',
								cls: "btn btn-primary",
                                text: '只导统计数据',
                                handle: function () {
									var data = form.getFormSerialize()+"&paperId="+currentPaper+"&type=value";
									App.download(App.href+"/api/core/scorePaper/exportPaper?"+data,modal.$body)
                                }
                            },{
                                type: 'button',
								cls: "btn btn-primary",
                                text: '分数和统计项导出',
                                handle: function () {
									var data = form.getFormSerialize()+"&paperId="+currentPaper+"";
									App.download(App.href+"/api/core/scorePaper/exportPaper?"+data,modal.$body)
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
									//url:App.href + "/api/core/scorePaper/zjcheckListName?paperId="+currentPaper,
									//expandAll: true,
									//mtype:"GET",
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
									//expandAll: true,
									autoParam: ["id", "name", "pId"],
									chkStyle: "checkbox",
									chkboxType:{"Y": "ps", "N": "s"},
									expandAll:false,
									rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择需要导出的指标"
                                    }
								}
									
                                
                            ]
                        };
                         form = modal.$body.orangeForm(formOpts);
						  
						
                    }
                },{
                    text: "导出总得分",
                    cls: " btn-primary btn",
                    icon: "fa fa-cloud-download",
                    handle: function (grid) {
                        
						var currentPaper = $("select[name='paperId']").val();
						App.download(App.href+"/api/core/scorePaper/exportPaperScore?paperId="+currentPaper);
						
                    }
                }/*,
				{	
					text: "  配置虚假条数",
					cls: "btn btn-primary",
					icon: "fa fa-gears",
					handle: function (grid) {
						var paperId = $("select[name='paperId']").val();
						var modal = $.orangeModal({
                            id: "scorePaperViewF",
                            title: "配置",
                            destroy: true
                        }).show();
                       var formOpt={
							id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/core/scorePaper/update",
                            ajaxSubmit: true,
                            ajaxSuccess: function () {
                                modal.hide();
                                grid.reload();
                            },
                            submitText: "保存",
                            showReset: true,
                            resetText: "重置",
                            isValidate: true,
                            buttons: [{
                                type: 'button',
                                text: '关闭',
                                handle: function () {
                                    modal.hide();
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
                                {
                                    type: 'hidden',
                                    name: 'id',
                                    id: 'id'
                                }, {
                                    type: 'number',
                                    name: 'falsityCountItem',
                                    id: 'falsityCountItem',
                                    label: '指标下题目最大错误数量',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, {
                                    type: 'number',
                                    name: 'falsityCount',
                                    id: 'falsityCount',
                                    label: '指标最大错误数量',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }
                            ]
                        };
							var form = modal.$body.orangeForm(formOpt);
                        form.loadRemote(App.href + "/api/core/scorePaper/load/" + paperId);
                        modal.show();

					}
				}*/
            ],
            search: {
                rowEleNum: 3,
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