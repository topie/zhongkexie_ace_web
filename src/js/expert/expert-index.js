/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/expert/index/page": "expertIndex"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.expertIndex = {
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
            url: App.href + "/api/core/scoreIndexCollection/list",
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
                    title: "指标组名称",
                    field: "name"
                },{
                    title: "分类",
                    field: "description"
                },{
                    title: "学会",
                    field: "",
					format:function(){
						var ss = '中国数学学会,中国物理学会,中国化学学会,中国学会,理学会,中国化学会,中国学会,中国物理学会,中国化学学会,中国学会,理学会,中国化学会,中国学会,中国物理学会,中国化学学会,中国学会,理学会,中国化学会,中国学会';
						var html='';
						for(var i=0,sm=ss.split(',');i<sm.length;i++){
							html+='<span class="label label-info  arrowed arrowed-right">'+sm[i]+'</span>';
							if(i%3==2) html+='</br>';
						}
						return html;
					}
                },{
                    title: "专家",
                    field: "",
					format:function(){
						var ss = '中国数学学会,中国理学会,中国化学会,中国学会理学会,中国化学会,中国学会,中国物学会,中国化学学会,中国学会理学会,中国化学会,中国学会,中国物理学会,中国化学学会,中国学会,理学会,中国化学会,中国学会';
						var html='';
						for(var i=0,sm=ss.split(',');i<sm.length;i++){
							html+='<span class="label label-danger  arrowed arrowed-right">'+sm[i]+'</span>';
							if(i%3==2) html+='</br>';
						}
						return html;
					}
                },
                
                
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
                        var js = JSON.parse(data.contentJson);
						js.showSocre=true;
                        paper = modal.$body.orangePaperView(js);
                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            data: {
                                paperId: data.paperId
                            },
                            url: App.href + "/api/core/scorePaper/getAnswer",
                            success: function (data) {
                                if (data.code === 200) {
                                    paper.loadAnswer(data.data);
									modal.$body.find('input').each(function(){
										if($(this).attr('name')!='button')
											$(this).attr("disabled","true");
									});
									paper.loadReals(data.data,"虚假");
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
                    text: "编辑",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                     
						var currentPaper = data.paperId;
						var modal = $.orangeModal({
                            id: "scorePaperViewF",
                            title: "编辑",
                            destroy: true
                        }).show();
							var ss = '中国数学学会,中国物理学会,中国化学学会,中国学会,理学会,中国化学会,中国学会,中国物理学会,中国化学学会,中国学会,理学会,中国化学会,中国学会,中国物理学会,中国化学学会,中国学会,理学会,中国化学会,中国学会';
						var tags='';
						for(var i=0,sm=ss.split(',');i<sm.length;i++){
							tags+='<span class="label label-info  arrowed arrowed-right">'+sm[i]+'</span>';
							if(i%4==2) tags+='</br>';
						}
							var html = '<div class="row col-sm-12"><p class="alert alert-info">'
								+'学术发展（考核项14项，专家评价3项）（300分）'
								+'</p>'
								+'</div>'
								+'<div class="row"><div class="col-sm-6"><div class="col-sm-12 thumbnail">'
								+tags
								+'</div></div><div class="col-sm-6"><div class="col-sm-12 thumbnail">'
								+tags
								+'</div></div></div>'
								+'<div class="row"><div class="col-sm-6"><div class="col-sm-12 thumbnail">'
								+'符合的专家共50位设置抽取个数<input/><button class="btn btn-sm btn-pink"><i class="ace-icon fa fa-share"></i>抽取</button>'
								+'</div></div><div class="col-sm-6"><div class="col-sm-12 thumbnail">'
								+'专家'
								+'</div></div></div>';
						modal.$body.append(html);
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
						bootbox.confirm("确定删除？",function(res){
							if(res){
								var requestUrl = App.href + "/api/core/scoreIndexCollection/delete";
								$.ajax({
									type: "GET",
									dataType: "json",
									data: {
										id: data.id
									},
									url: requestUrl,
									success: function (data) {
										if (data.code === 200) {
											grid.reload();
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
					text: "  添加",
					cls: "btn btn-primary",
					icon: "fa fa-add",
					handle: function (grid) {
						var currentPaper = $("select[name='paperId']").val();
						var modal = $.orangeModal({
                            id: "scorePaperViewF",
                            title: "添加",
                            destroy: true
                        }).show();
                       var formOpt={
							id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/core/scoreIndexCollection/insert",
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
                                },{
                                    type: 'hidden',
                                    name: 'paperId',
                                    id: 'paperId',
									value:currentPaper
                                }, {
                                    type: 'text',
                                    name: 'name',
                                    id: 'name',
                                    label: '名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, {
                                    type: 'textarea',
                                    name: 'description',
                                    id: 'description',
                                    label: '描述',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, {
                                    type: 'select2',
                                    name: 'tags',
                                    id: 'tags',
                                    label: '标签',
                                    cls: 'input-xxlarge',
                                    items:[],
                                    itemsUrl: App.href +"/api/core/dict/getItems?code=ZYBQ"
                                },{
									type: 'tree',//类型
									name: 'indexCollection',
									id: 'indexCollection',//id
									label: '指标',//左边label
									url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper,
									expandAll: true,
									autoParam: ["id", "name", "pId"],
									chkStyle: "checkbox",
									chkboxType:{"Y": "ps", "N": "s"},
									expandAll:false,
									onAsyncSuccess:function(treeObj){
										$.ajax({
											url:App.href + "/api/core/scoreIndexCollection/getSelectedNodesId?&sort_=sort_asc&paperId="+currentPaper,
											type:"GET",
											success:function(res){
												if(res.code==200){
													var ids = res.data;
													for (var i=0, l=ids.length; i < l; i++) {
														var node = treeObj.getNodeByParam("id",ids[i]);
														treeObj.setChkDisabled(node,true);
													}
												}else{
													alert("加载失败");
												}
											}
										});
									}
								},
                            ]
                        };
						var form = modal.$body.orangeForm(formOpt);
						form.loadLocal({tags:"财务,行政"});
                        modal.show();

					}
				}
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
				

    };
})(jQuery, window, document);