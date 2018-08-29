/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/task/appraise/check": "appraisecheck"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.appraisecheck = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
				   // '<div class="panel panel-default" >' +
				  //  '<div class="panel-heading"></div>' +
						'<div id="grid"></div>' +
				   // '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {
		{//添加样式
			var nod = document.createElement("style"); 
			var str = ".scoreLabelmgl20{!important;margin-left:50px;margin-right:-50px;}.itemLabel{font-size:20px;margin-bottom: 20px;}";
			nod.type="text/css";  
			if(nod.styleSheet){         //ie下  
				nod.styleSheet.cssText = str;  
			} else {  
				nod.innerHTML = str;       //或者写成 nod.appendChild(document.createTextNode(str))  
			}  
			document.getElementsByTagName("head")[0].appendChild(nod);  
		}//添加样式结束
		var grid;
        var tree;
		var mapData;
        var options = {
            url: App.href + "/api/score/appraise/list",
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
                {
                    title: "部门用户",
                    field: "userId",
					format:function(index,data){
						if(mapData){
							return mapData[data.userId];
						}else{
							$.ajax({url:App.href + "/api/sys/user/pageList?userType=2",
									async:false,
									type:'GET',success:function(res){
									mapData={};
									$.each(res.data.data,function(i,c){
										mapData[c.id]=c.displayName;
									});
								}
							})
							return mapData[data.userId];
							
						}
					}
                }, {
                    title: "审核状态",
                    field: "itemStatus",
					format:function(index,data){
						if(data.itemStatus==undefined){
							return '未提交';
						}
						if(data.itemStatus==1){
							return '<font style="color:red;">待审核</font>';
						}
						if(data.itemStatus==2){
							return '<font style="color:green;">通过</font>';
						}
						if(data.itemStatus==3){
							return '退回';
						}
						return '--';
					}
                }
               
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                   {
                    text: "审核",
					visible:function(index,data){
						if(data.itemStatus==1)return true;
						return false;
					},
                    cls: "btn-info btn-sm",
                    handle: function (index, data) {
						 var modal = $.orangeModal({
                            id: "chekcModel",
                            title: "审核-"+mapData[data.userId],
                            destroy: true,
							buttons:[{
								text:"通过",
								cls:"btn-info",
								handle:function(){
									checkStatus("2");
								}
							},{
								text:"退回",
								cls:"btn-danger",
								handle:function(){
									checkStatus("3");
								}
							},{
								text:"关闭",
								cls:"btn-error",
								handle:function(){
									modal.hide();
								}
							}]
                        }).show();
						function checkStatus(status){
							bootbox.confirm("确认操作？",function(res){
								if(res){
									$.ajax({url:App.href+"/api/score/appraise/update",
											data:{id:data.id,itemStatus:status},
											type:"POST",
											success:function(res){
												if(res.code==200){
													modal.hide();
													grid.reload();
												}else{
													bootbox.alert(data.message);
												}
											},error:function(){alert("请求异常");}
										})
								}
							});
						}
						renderPaper(index,data,modal);
                      
                    }
                },
				{
                    text: "查看",
                    cls: "btn-info btn-sm",
                    handle: function (index, data) {
						 var modal = $.orangeModal({
                            id: "chekcModel",
                            title: "查看-"+mapData[data.userId],
                            destroy: true,
							buttons:[{
								text:"退回",
								cls:"btn-danger",
								handle:function(){
									checkStatus("3");
								}
							},{
								text:"关闭",
								cls:"btn-error",
								handle:function(){
									modal.hide();
								}
							}]
                        }).show();
						function checkStatus(status){
							bootbox.confirm("确认操作？",function(res){
								if(res){
									$.ajax({url:App.href+"/api/score/appraise/update",
											data:{id:data.id,itemStatus:status},
											type:"POST",
											success:function(res){
												if(res.code==200){
													modal.hide();
													grid.reload();
												}else{
													bootbox.alert(data.message);
												}
											},error:function(){alert("请求异常");}
										})
								}
							});
						}
						renderPaper(index,data,modal);
                      
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
						id:"paperId_select",
						items:[],
						itemsUrl:App.href+"/api/core/scorePaper/getPaperSelect"
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
		var currentPaper=0;
		function renderPaper(index,data,modal){
			reRendPaper();
			function reRendPaper(){
						   currentPaper = $("#paperId_select").val();
							$.ajax({url:App.href+"/api/score/appraise/userItems",
								data:{paperId:currentPaper,userId:data.userId},
								type:"GET",
								success:function(res){
									if(res.code==200){
										var items = res.data.items;
										var values = res.data.values;
										renderForm(items,values);
									}else{
										bootbox.alert(data.message);
									}
								},error:function(){alert("请求异常");}
							})
						}

						function renderForm(items,values){
							if(items.length==0){
								modal.$body.html('<h3>该部门没有可操作的任务</h3>');

								return;
							}
							var value = {};
							$.each(values,function(i,val){
								value[val.itemId+""]=val.itemValue;
							})
							var formItems = [];
							 $.each(items, function (ii, item) {
											
								var it = {};
								it.name = item.id;
								it.label = item.title;// + "(" + item.score + "分)";
								it.labelClass="itemLabel";
								it.placeholder = item.placeholder==undefined?"":item.placeholder;
								if (item.type == 0) {
									it.type = 'text';
								} else if (item.type == 1) {
									it.type = 'radioGroup';
								} else if (item.type == 2) {
									it.type = 'checkboxGroup';
								} else if (item.type == 3) {
									it.type = 'list';
									it.span = 6;
									it.items = [
										{	placeholder:it.placeholder,
											type: 'text',
											name: item.id
										}
									]
								}else if (item.type == 7) {
									it.type = 'list';
									it.row = item.row;
									it.hideBtn = true;
									try{
										var customItems = JSON.parse(item.items);
										it.span = 11;
										$.each(customItems,function(index,cont){
											if(index==0){
												it.formInline = cont.formInline;
											}
											customItems[index]["name"]=item.id;
											customItems[index]["labelSpan"]=3;
											customItems[index]["readonly"]=true;
										});
										it.items = customItems;
									}catch(err){
										alert("解析json错误："+it.label);
									}
								}else if (item.type == 8) {
									it.type = 'radio_inputs';
									it.row = item.row;
									it.hideBtn = true;
									it.span = 12;
									$.each(item.items, function (i, op) {
										if(op.title=='是'||op.title=='有'){
											it.trigerValue=op.id;
										}
									});
									try{
										var customItems = JSON.parse(item.items);
										$.each(customItems,function(index,cont){
											if(index==0){
												it.formInline = cont.formInline;
												if(cont.relate===false)it.relate = false;
												if(cont.span){it.span = cont.span;}
											}
											customItems[index]["name"]=item.id;
										});
										it.customItems = customItems;
									}catch(err){
										alert("解析json错误："+it.label);
									}
								} else if (item.type == 4) {
									it.type = 'number';
									it.inline = true;
								}else if (item.type == 9) {
									it.type = 'number_input';
									it.span=6;
									try{
										var customItems = JSON.parse(item.items);
										$.each(customItems,function(index,cont){
											if(index==0){
												it.formInline = cont.formInline;
											}
											customItems[index]["name"]=item.id;

										});
										it.items = customItems;
									}catch(err){
										alert("解析json错误："+it.label);
									}
								} else if (item.type == 5) {
									it.type = 'radio_input';
									it.span = 6;
								} else if (item.type == 6) {
									it.type = 'checkbox_input';
									it.span = 6;
								} else if (item.type == 10) {
									it.type = 'textarea';
								}
								if (item.type == 1 || item.type == 2 || item.type == 5 || item.type == 6|| item.type == 8) {
									it.items = [];
									it.inline = true;
									$.each(item.items, function (i, op) {
										var option = {
											'text': op.title,
											'value': op.id
										};
										it.items.push(option);
									});
								}
								if (item.value != undefined && item.value != '') {
									it.value = item.value;
								}
								
								formItems.push(it);
							});
							var formOpts = {
											id: "edit_form",
											name: "edit_form",
											showSubmit:false,
											showReset:false,
											labelInline:false,
											items: formItems
										};

						
							var form = modal.$body.orangeForm(formOpts);
							form.loadLocal(value);
						} 
				}
		
    }
})(jQuery, window, document);