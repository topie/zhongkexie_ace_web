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
		var detail_g;
        var options = {
            url: App.href + "/api/expert/paper/list",
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
                    title: "学会组名称",
                    field: "name"
                },{
                    title: "专业分类",
                    field: "type"
                },{
                    title: "学会",
                    field: "deptNames",
					format:function(index,data){
						var ss = data.deptNames==null?'':data.deptNames;//'中国数学学会,中国物理学会,中国化学学会,中国学会,理学会,中国化学会,中国学会,中国物理学会,中国化学学会,中国学会,理学会,中国化学会,中国学会,中国物理学会,中国化学学会,中国学会,理学会,中国化学会,中国学会';
						var html='<div title="'+ss+'">';
						for(var i=0,sm=ss.split(',');i<sm.length;i++){
							html+='<span class="label label-info  arrowed arrowed-right">'+sm[i]+'</span>';
							if(i%3==2) html+='</br>';
							if(i>12){
								html+='<span class="label label-info ">...</span>';
								return html+'</div>';
							}
						}
						return html+'</div>';
					}
                }/*,{
                    title: "专家",
                    field: "expertNames",
					format:function(i,c){
						var ss = c.expertNames==null?'':c.expertNames;//'中国数学学会,中国理学会,中国化学会,中国学会理学会,中国化学会,中国学会,中国物学会,中国化学学会,中国学会理学会,中国化学会,中国学会,中国物理学会,中国化学学会,中国学会,理学会,中国化学会,中国学会';
						var html='<div title="'+ss+'">';
						for(var i=0,sm=ss.split(',');i<sm.length;i++){
							html+='<span class="label label-danger  arrowed arrowed-right">'+sm[i]+'</span>';
							if(i%3==2) html+='</br>';
							if(i>12){
								html+='<span class="label label-danger ">...</span>';
								return html+'</div>';
							}
						}
						return html+'</div>';;
					}
                }*/
                
                
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
				{
                    text: "详情",
                    cls: "btn-primary btn-sm",
					icon:"ace-icon fa fa-caret-down",
                    handle: function (index, data) {
						$('#grid tr[role="detail"]').remove();
                        var $detail = $('<tr role="detail" class="detail-row open"><td >#####</td><td colspan="5"><div class="table-detail"><div id="detail-grid"></div></div></td></tr>');
						$('#grid tr[role="row"]:eq('+index+')').after($detail);
						detail_option.url=App.href + "/api/expert/indexColl/list?paperExpertId="+data.id;
						detail_option.deptNames = data.deptNames;
						detail_option.deptIds = data.deptIds;
						 detail_g = $detail.find("#detail-grid").orangeGrid(detail_option);
					}
                }
            ],
            tools: [
				
				{	
					text: "  按学会分类初始化",
					cls: "btn btn-primary",
					icon: "fa fa-lightbulb-o",
					handle: function (grid) {
						bootbox.confirm("确定初始化，将会重新生成一套评分方案，之前配置将会删除？",function(res){
							if(res){
								var paperId = $("#search_paperId").val();
								var requestUrl = App.href + "/api/expert/paper/init";
								$.ajax({
									type: "POST",
									dataType: "json",
									data: {
										paperId: paperId,
										type:"type"
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
				,{	
					text: "  不按学会分类初始化",
					cls: "btn btn-primary",
					icon: "fa fa-lightbulb-o",
					handle: function (grid) {
						bootbox.confirm("确定初始化，将会重新生成一套评分方案，之前配置将会删除？",function(res){
							if(res){
								var paperId = $("#search_paperId").val();
								var requestUrl = App.href + "/api/expert/paper/init";
								$.ajax({
									type: "POST",
									dataType: "json",
									data: {
										paperId: paperId
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
            search: {
                rowEleNum: 2,
				hide:false,
                //搜索栏元素
                items: [
                    {
                        type: "select",
                        label: "评估项目",
                        name: "paperId",
						id:"search_paperId",
						items:[],
						itemsUrl:App.href+"/api/core/scorePaper/getPaperSelect"
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
		var detail_option= {
			url: App.href + "/api/expert/indexColl/list",
			pageNum: 1,//当前页码
			pageSize: 150,//每页显示条数
			idField: "id",//id域指定
			showIndexNum: true,
			showPaging:false,
			columns: [
				{
					title: "指标组名称",
					field: "name"
				},{
					title: "专业领域",
					field: "relatedField"
				},{
					title: "专家",
					field: "expertNames",
					format:function(i,c){
						var ss = c.expertNames==null?'':c.expertNames;//'中国数学学会,中国理学会,中国化学会,中国学会理学会,中国化学会,中国学会,中国物学会,中国化学学会,中国学会理学会,中国化学会,中国学会,中国物理学会,中国化学学会,中国学会,理学会,中国化学会,中国学会';
						var html='<div title="'+ss+'">';
						for(var i=0,sm=ss.split(',');i<sm.length;i++){
							html+='<span class="label label-danger  arrowed arrowed-right">'+sm[i]+'</span>';
							if(i%3==2) html+='</br>';
							if(i>12){
								html+='<span class="label label-watning ">...</span>';
								return html+'</div>';
							}
						}
						return html+'</div>';;
					}
				}],
			actionColumnText: "操作",//操作列文本
			actionColumnWidth: "20%",
			actionColumns: [
				{
					text: "抽取专家",
					cls: "btn-primary btn-sm",
					icon:"ace-icon fa fa-caret-down",
					handle: function (index, data) {
						var currentPaper = data.paperId;
						var currentPaperExpertId = data.paperExpertId;
						var modal = $.orangeModal({
                            id: "scorePaperViewF",
                            title: "抽取专家",
                            destroy: true
                        }).show();
						var allEx=[];//所有可选专家
						$.ajax({
							url:App.href+"/api/expert/info/list",
							async:false,
							data:{fieldType:data.fieldType
								,relatedField:data.relatedField
								,pageSize:9999},
							success:function(res){
								if(res.code==200){
									allEx = res.data.data;
								}else{
									bootbox.alert("操作失败！");
								}
							}
						});
						var all='';
						for(var i=0;i<allEx.length;i++){//可选专家
							all+='<span class="label label-info  arrowed arrowed-right all" data-id="'+allEx[i].id+'">'+allEx[i].realName+'</span>';
							if(i%4==3) all+='</br>';
						}
						var checkeEx = data.expertNames==null?"":data.expertNames;//已选专家名称
						var tags='';
						var checkID = data.expertIds==null?"":data.expertIds;
						for(var i=0,sm=checkeEx.split(','),smi=checkID.split(',');i<sm.length;i++){
							tags+='<span class="label label-info  arrowed arrowed-right che" data-id="'+smi[i]+'">'+sm[i]+'</span>';
							if(i%4==2) tags+='</br>';
						}
						var height = '';//detail_g._options.deptNames.split(',').length*14;
						//var height = checkID.length*20;
						//if(height<600) height=600;
						
							var html = $('<div class="row col-sm-12"><p class="alert alert-info">'
								+data.name
								+'</p>'
								+'</div>'
								+'<div class="row"><div class="col-sm-6">'
								+'<div class="col-sm-12">'
								+'<h3 class="header smaller lighter purple">符合条件的专家<small>(点击专家名进行手动选择)</small></h3>'
								+'</div><div class="col-sm-12">'
								+all
								+'</div></div><div class="col-sm-6"><div class="col-sm-12">'
								+'<h3 class="header smaller lighter purple">已选专家<small>(点击专家名手动取消)</small></h3></div>'
								+'<input type="hidden" id="checkedIds" value="'
								+ data.expertIds
								+'"/><input type="hidden" id="checkedNames" value="'
								+ data.expertNames
								+'"/><div id="checkeColl" class="col-sm-12">'
								+tags
								+'</div></div></div>'
								+'<div class="space-24"></div>'
								+'<div class="row">'
									+'<div class="form-group">'
									//+'<label class="col-sm-2 control-label no-padding-right" for="form-field-1-1">设置抽取个数</label>'
										+'<div class="col-sm-6">'
										+'设置抽取个数:'
											+'<div class="input-group">'
												+'<input type="text" id="form-field-1-1" placeholder="抽取个数" class="form-control" value="1">'
												+'<span class="input-group-btn">'
												+'<button class="btn btn-sm btn-pink"><i class="ace-icon fa fa-share"></i>抽取</button>'
												+'<button class="btn btn-sm btn-warning"><i class="ace-icon fa fa-trash"></i>清空已抽取</button>'
												+'<button class="btn btn-sm btn-info"><i class="ace-icon fa fa-floppy"></i>应用该方案</button>'
												+'</span>'
											+'</div>'
										+'</div>'
									+'</div>'
								+'</div>'
								+'<div class="row">'
									+'<div class="form-group"id="mecharts" style="height:'+height+'px;">'
									+'</div>'
								+'</div>');
						modal.$body.append(html);
						html.find("span").each(function(){
							var ele = $(this);
							if(ele.is(".all")){
								ele.bind("click",function(){
									var id = $(this).attr("data-id");
									var name=$(this).text();
									var f = false;
									for(var i=0;i<checkColl.length;i++){
										if(checkColl[i].id==id){f=true;}
									}
									if(f){
										bootbox.alert("该专家已在选中目录中！");
									}else{
										var span =$('<span class="label label-info  arrowed arrowed-right che" data-id="'+id+'">'+name+'</span>');
										$("#checkeColl").append(span);
										spanBindRemove(span);
										checkColl.push({"name":name,id:id});
										flashTree();
									}
								})
							}
							if(ele.is(".che")){
								spanBindRemove($(this));
							}
						});
						function spanBindRemove(span){
							span.bind("click",function(){
								var id = $(this).attr("data-id");
								var name=$(this).text();
								var index=9999;
								for(var i=0;i<checkColl.length;i++){
									if(checkColl[i].id==id){
										index=i;
										$(this).remove();
									}
								}
								checkColl.splice(index,1);
								flashTree();
							})
						}
						//console.log(document.getElementById('mecharts'));
						//保存
						html.find('button.btn-info').bind("click",function(){
							var input = $('#checkedIds').val();
							var inputs = $('#checkedNames').val();
							$.ajax({
								url:App.href+"/api/expert/indexColl/update",
								type:"POST",
								data:{
									id:data.id,
									expertIds:input,
									expertNames:inputs,
									paperExpertId:currentPaperExpertId,
									paperId:currentPaper
									},
								success:function(res){
									if(res.code==200){
										modal.hide();
										grid.reload();
									}else{
										bootbox.alert("操作失败！");
									}
								}
							});
						});
						var	checkColl = [];

						//编辑 如果已选择  初始化状态
						if(data.expertNames){
							setTimeout(function(){
								/*var treedata = {name:data.name,children:[]};
								for(var j=0,nas=data.expertNames.split(',');j<nas.length;j++){
									treedata.children[j]={name:nas[j],children:[]};
									checkColl.push({name:nas[j]})
								}*/
								for(var j=0,nas=data.expertNames.split(','),nasi=data.expertIds.split(',');j<nas.length;j++){
									checkColl.push({name:nas[j],id:nasi[j]});
								}
								flashTree();

							},1000);
						}
						html.find('button.btn-warning').bind("click",function(){
							checkColl=[];
							$("#checkeColl").html("");
							flashTree();
						});
						html.find('button.btn-pink').bind("click",function(){
							if((allEx.length-checkColl.length)==0){
								bootbox.alert("已全部抽取");
								return false;
							}
							var value = $("#form-field-1-1").val();
							if(isNaN(value)||value==null||value==''){
								bootbox.alert("请输入数字");
								$("#form-field-1-1").val(1);
								return false;
							}
							if(parseInt(value) > (allEx.length-checkColl.length)){
								bootbox.alert("请输入小于总个数："+(allEx.length-checkColl.length));
								$("#form-field-1-1").val(1);
								return false;
							}
							if(parseInt(value) <=0){
								bootbox.alert("请输入大于0的数");
								$("#form-field-1-1").val(1);
								return false;
							}
							//抽取
							var length = allEx.length;
							//$("#checkeColl").html("");
							for(var i=0;i<parseInt(value);i++){
								var index = parseInt(Math.random()*length);
								var f = true;
								for(var j=0;j<checkColl.length;j++){
									if(checkColl[j].id==allEx[index].id){
										i--;
										f = false;
									}
								}
								if(f){
									allEx[index].name=allEx[index].realName;
									checkColl.push(allEx[index]);
									var span =$('<span class="label label-info  arrowed arrowed-right che" data-id="'+allEx[index].id+'">'+allEx[index].realName+'</span>');
									$("#checkeColl").append(span);
									spanBindRemove(span);
								}
							}
							flashTree();
							
							
						})
						function flashTree(){
							var treedata = {};
							//treedata.name=data.name;
							//treedata.children=checkColl;
							var checkes = [];
							var checkeNames = [];
							for(var j=0;j<checkColl.length;j++){
								//treedata.children[j].children=[];
								//j!=0&&(treedata.children[j].collapsed = true);
								checkes.push(treedata.children[j].id);
								checkeNames.push(treedata.children[j].name);
							}
							$('#checkedIds').val(checkes);
							$('#checkedNames').val(checkeNames);
							//var xuehui = detail_g._options.deptNames.split(",");
						/*//平均分配
							for(var i=0;i<xuehui.length;i++){
								var j = i%atreedata.children.length;
								atreedata.children[j].children.push({name:xuehui[i]});
							}*/
							//全量分配
							/*for(var j=0;j<treedata.children.length;j++)
								for(var i=0;i<xuehui.length;i++){
									//var j = i%atreedata.children.length;
									treedata.children[j].children.push({name:xuehui[i]});
								}
							
							var chart = echarts.init(document.getElementById('mecharts'));
								chart.clear();
								chart.setOption({ series: [
											{
												type: 'tree',
												data: [treedata],
												top: '0%',
												left: '8%',
												bottom: '1%',
												right: '8%'
										   }
										]});*/
							/*var sankeydata={nodes:[],links:[]};
							sankeydata.nodes.push({name:data.name});
							for(var j=0;j<checkColl.length;j++){
								sankeydata.links.push({source:data.name,target:checkColl[j].name,value:1});
								sankeydata.nodes.push({name:checkColl[j].name});
								for(var i=0;i<xuehui.length;i++){
									sankeydata.links.push({source:checkColl[j].name,target:xuehui[i],value:1});
									sankeydata.nodes.push({name:xuehui[i]});
								}
							}

							var myChart = echarts.init(document.getElementById('mecharts'));
							 myChart.setOption(option = {
									series: [
										{
											type: 'sankey',
											layout:'none',
											data: sankeydata.nodes,
											links: sankeydata.links,
											top: '0%',
											left: '8%',
											bottom: '1%',
											right: '8%',
											itemStyle: {
												normal: {
													borderWidth: 1,
													borderColor: '#aaa'
												}
											},
											lineStyle: {
												normal: {
													curveness: 0.5
												}
											}
										}
									]
								});*/
						}
					}
				}]
		};		

    };
})(jQuery, window, document);