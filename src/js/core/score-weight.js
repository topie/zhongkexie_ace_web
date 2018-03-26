/**
 * Created by wangJL on 2018/3/26.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scoreWeight/list": "scoreWeight"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.scoreWeight = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-5" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">' +
				'<div class="row">'+
				'<div class="col-md-9">'+
				'<select class="form-control input-sm" id="paperSelect">'+
					/*'<option>TODO 动态加载考评表</option>'+
					'<option>2018全国学会综合能力指标体系考评表</option>'+
					'<option>2017全国学会综合能力指标体系考评表</option>'+*/
				'</select>'+
                /*'<div class="pull-right">' +
                '<div class="btn-group">' +
                '<button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' +
                '操作' +
                '<span class="caret"></span>' +
                '</button>' +
                '<ul class="dropdown-menu pull-right" role="menu">' +
                '<li><a id="add_node" href="javascript:void(0);">添加</a>' +
                '</li>' +
                '</ul>' +*/
                '</div>' +
					'<div class="col-md-3">'+
					'<a data-exp="false" id="expandAllBtn" class="btn btn-info btn-sm" href="javascript:void(0);">展开</a>'+
					'</div>'+
                '</div>' +
                '</div>' +
                '<div class="panel-body pre-scrollable" style="max-height:600px">' +
				//'<div class="row well"></div>'+
                '<ul id="tree" class="ztree"></ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-7" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading" id="grid-title">指标权重管理</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {
		var currentPaper ='';
		var currentTotalSocre = 0;
		var currentParentId;
		var currentParent;
		var currentGridType="index";
		var $paper = $("#paperSelect");
		$paper.bind("change",function(){
			currentPaper = $(this).val();
			currentTotalSocre = parseInt($(this).find("option:selected").attr('data-socre'));
			//tree.reAsyncChildNodes(null, "refresh");
			setting.async.url= App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper;
			tree.destroy();
			 $.fn.zTree.init($("#tree"), setting);
			tree = $.fn.zTree.getZTreeObj("tree");
			var url = App.href + "/api/core/scoreIndex/list?paperId="+currentPaper+"&parentId=0";
			grid.reload({url:url});
			setGridTitle();
		});
		function setGridTitle(){
			var title='指标权重管理<font style="color:#f33">(当前列出指标总分数：'+currentTotalSocre+'分)</font>';
			$("#grid-title").html(title);
		}
		$("#expandAllBtn").bind("click",function(){
			var that = $("#expandAllBtn");
			if(that.attr("data-exp")=="true"){
				that.attr("data-exp","false");
				tree.expandAll(false);
				that.html("展开");
			}else{
				that.attr("data-exp","true");
				tree.expandAll(true);
				that.html("折叠");
			}
		});
		
		$.ajax({
			url:App.href+"/api/core/scorePaper/getPaperOptions",
			type:"GET",
			async:false,
			success:function(data){
				if(data.code==200){
					if(data.data.length<=0){
						bootbox.alert("没有评价表，请先添加评价表！");
					}else{
						for(var i=0;i<data.data.length;i++){
							var item = data.data[i];
							if(i==0){currentPaper=item.id;currentTotalSocre = item.score;
			setGridTitle();}
							var option = '<option value="'+item.id+'" data-socre="'+item.score+'">'+item.name+'</option>';
							$paper.append(option);
						}
					}
				}else{
					bootbox.alert(data.message);
				}
			}
		});
        var grid;
        var tree;
        var options = {
            url: App.href + "/api/core/scoreIndex/list?paperId="+currentPaper+"&parentId=0",
            contentType: "table",
            contentTypeItems: "table,card,list",
            pageNum: 1,//当前页码
            pageSize: 100,//每页显示条数
            idField: "id",//id域指定
            headField: "name",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 10, 15, 30, 50],
            columns: [
               /* {
                    title: "节点id",
                    field: "id",
                    sort: true,
                    width: "5%"
                }, {
                    title: "父节点id",
                    field: "parentId",
                    sort: true,
                    width: "5%"
                },*/ {
                    title: "指标名称",
                    field: "name",
                    sort: true
                }, {
                    title: "指标权重",
                    field: "weight",
                    sort: true,
					dataClick:dataClick,
					format:function(index,data){
						return data.weight+"%";
					}
                }, {
                    title: "指标分值",
                    field: "score",
                    sort: true
                }
            ]
           
        };
        grid = window.App.content.find("#grid").orangeGrid(options);

	var itemOptions = {
            url: App.href + "/api/core/scoreItem/list?indexId=0",
            contentType: "table",
            contentTypeItems: "table,card,list",
            pageNum: 1,//当前页码
            pageSize: 100,//每页显示条数
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
                },*/ {
                    title: "题目名称",
                    field: "title",
                    sort: true
                }, {
                    title: "指标权重",
                    field: "weight",
                    sort: true,
					dataClick:itemDataClick,
					format:function(index,data){
						return data.weight+"%";
					}
                }, {
                    title: "题目分值",
                    field: "score",
                    sort: true
                }
            ]
		};
        var setting = {
            async: {
                enable: true,
                url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper,
                autoParam: ["id", "name", "pId"]
            },
            edit: {
                enable: false,
				drag:{
					isMove:false,
					isCopy:false
				}
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                    //var zTree = $.fn.zTree.getZTreeObj(treeId);
                    //zTree.expandAll(true);
                },
				onClick:function(e,treeId,treeNode){
					currentParent=treeNode.name;
					currentParentId=treeNode.id;
					currentTotalSocre = treeNode.s;
					setGridTitle();
					if(treeNode.isParent){
						var url=App.href + "/api/core/scoreIndex/list?paperId="+currentPaper+"&parentId="+currentParentId;
						if(currentGridType=="index"){
							grid.reload({url:url});
						}else{
							options.url=url;
							grid = window.App.content.find("#grid").html("").orangeGrid(options);
							currentGridType="index";
						}
						
					}else{
						var  url = App.href + "/api/core/scoreItem/list?indexId="+currentParentId;
						if(currentGridType=="item"){
							grid.reload({url:url});
						}else{
							itemOptions.url=url;
							grid = window.App.content.find("#grid").html("").orangeGrid(itemOptions);
							currentGridType="item";
						}
					}
				}
            }
        };
        $.fn.zTree.init($("#tree"), setting);
        tree = $.fn.zTree.getZTreeObj("tree");

        function itemDataClick(num,data,td){
			var url=App.href + "/api/core/scoreItem/update";
			dataClick(num,data,td,url)
		}

		function dataClick(num,data,td,url){
			if(url){
					
			}else{
				url=App.href + "/api/core/scoreIndex/update";
			}
			var action = td.unbind("click");
			//td.html('<input type="text" id="1_id" name="id" rowid="1" value="'+data.weight+'" role="textbox" class="editable inline-edit-cell ui-widget-content ui-corner-all" style="width: 96%;">');
			var html = $('<div class="input-group">'+
			/*'<span class="input-group-addon">'+
			'<i class="ace-icon fa fa-check"></i>'+
			'</span>'+*/
			'<input type="text" class="spinbox-input editable inline-edit-cell" placeholder="" style="width:100%" value="'+data.weight+'">'+

			'<div class="spinbox-buttons input-group-btn btn-group-vertical">'+
			'<button type="button" class="btn spinbox-up btn-sm btn-info">'+
			'<i class="icon-only  ace-icon fa fa-chevron-up"></i>'+
			'</button>'+
			'<button type="button" class="btn spinbox-down btn-sm btn-info">'+
			'<i class="icon-only  ace-icon fa fa-chevron-down"></i></button>'+
			'</div>'+

			'<span class="input-group-btn">'+
			'<button type="button" class="btn btn-primary btn-sm">'+
			'<span class="ace-icon fa fa-check icon-on-right"></span></button>'+
			'</span><span class="input-group-btn">'+
			'<button type="button" class="btn btn-danger btn-sm">'+
			'<span class="ace-icon fa fa-times icon-on-right"></span></button>'+
			'</span>'+
			'</div>');
			html.find('button').each(function(index,btn){
				var $btn = $(btn);
				if($btn.is(".spinbox-up")){
					$btn.bind("click",function(){
						var value = html.find('input').val();
						if(value==100){
							html.find('input').val(0);
							return ;
						}
						value = parseInt(value)+10;
						if(value>100){
							value=100;
						}
						html.find('input').val(value);
					});
				}
				if($btn.is(".spinbox-down")){
					$btn.bind("click",function(){
						var value = html.find('input').val();
						if(value==0){
							html.find('input').val(100);
							return ;
						}
						value = parseInt(value)-10;
						if(value<0){
							value=0;
						}
						html.find('input').val(value);
					});
				}
				if($btn.is(".btn-primary")){
					$btn.bind("click",function(){
						var value = html.find('input').val();
						if(parseInt(value)<0){
							bootbox.alert("权重不能小于0%!");
							return false;
						}
						if(parseInt(value)>100){
							bootbox.alert("权重不能大于100%!");
							return false;
						}
						if(isNaN(parseFloat(value))){
							bootbox.alert("请输入数字!");
							return false;
						}
						var score = currentTotalSocre/100*parseFloat(value);
						$.ajax({
									type: "POST",
									dataType: "json",
									data: {
										id:data.id,
										weight:value,
										score:score
									},
									url: url,
									success: function (data) {
										if (data.code === 200) {
											grid.reload();
											var sNodes = tree.getSelectedNodes();
											var sNode=null;
											if(sNodes.length>0){sNode = sNodes[0].id;console.log(sNode);}
											tree.reAsyncChildNodes(null, "refresh",true,function(){
												if(sNode!=null){
													var node = tree.getNodeByParam("id",parseInt(sNode));
													console.log(node);
													tree.selectNode(node);
												}
											});
											
										} else {
											bootbox.alert(data.message);
										}
									},
									error: function (e) {
										alert("请求异常。");
									}
								});
					});
				}
				if($btn.is(".btn-danger")){
					$btn.bind("click",function(){
						grid.reload();
						td.html(data.weight);
						//td.bind("click",dataClick(num,data,td));
					});
				}
			});
			td.html(html);
			
			/*var score = item.score;
						bootbox.prompt({
							title: "请评价最终得分：",
							inputType: 'number',
							callback: function (result) {
								if(result==null || result==''){
									return;
								}
								var sc=result;
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
						});*/

		};
		}

})(jQuery, window, document);