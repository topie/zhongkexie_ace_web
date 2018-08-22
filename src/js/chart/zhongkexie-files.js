/**
 *  查看附件
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/files/page": "filesPaper"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.filesPaper = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title); 
			var content = $('<div class="panel-body" >' +
                '<div class="row">' +
					'<div class="row">'+
						'<form ele-type="search" role="form">'+
							'<div class="form-body"><div role="row" class="col-md-12"><div class="col-md-4"><div class="form-group">'+
							'<label>评估项目</label><select name="paperId" id="paperSelect" class="form-control ">'+
							'</select></div></div></div></div>'+
						'</form>'+
					'</div><hr>'+
					'<div class="col-md-12" >' +
					   // '<div class="panel panel-default" >' +
					  //  '<div class="panel-heading"></div>' +
							'<div id="grid"><div class="appform"></div></div>' +
					   // '</div>' +
					'</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {
		var currentPaper = 1;
		var $paper = $("#paperSelect");
		$.ajax({
			url:App.href+"/api/core/scorePaper/getPaperOptions",
			type:"GET",
			async:false,
			success:function(data){
				if(data.code==200){
					if(data.data.length<=0){
						bootbox.alert("没有评估项目，请先添加评估项目！");
					}else{
						for(var i=0;i<data.data.length;i++){
							var item = data.data[i];
							if(i==0){currentPaper=item.id;}
							var option = '<option value="'+item.id+'">'+item.name+'</option>';
							$paper.append(option);
						}
						reRendPaper();
					}
				}else{
					bootbox.alert(data.message);
				}
			}
		});
		//绑定onchange事件
		$paper.bind("change",function(){
			currentPaper = $(this).val();
			reRendPaper();
		});
		function reRendPaper(){
			$.ajax({
					url:App.href + "/api/core/scorePaper/getPaper",
					dataType: "json",
					data: {
						paperId: currentPaper
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
			var colInfos = [{ name: 'displayName', displayName: '学会',static:true, width:"225px" }];
			$.each(js.data,function(ind,index){
				$.each(index.items,function(it,item){
					var title = item.title.replace(/\(.*?\)/,"").replace(/（.*?）/,"");
					if(title.length>20)title=title.substring(0,20);
					colInfos.push({ name: item.id,
						displayName:title ,
						width:"45px",
						format:function(index,data){
							if(item.hideUploadFile==false){
								return '--';
							}
							if(data[item.id]==undefined||data[item.id]=='')
								return '无';
							var href= App.href+'/api/common/downloadzip?id='+data[item.id]+'&itemId='+item.id;
							return '<a href="javascript:void();">查看</a>';
						},
						dataClick:function(index,data){
							if(item.hideUploadFile==false){
								return false;
							}
							if(data[item.id]==undefined||data[item.id]=='')
								return false;
							//var href= App.href+'/api/common/downloadzip?id='+data[item.id]+'&itemId='+item.id;
							var value = data[item.id];
							var itemId = item.id;
							var modalDwon = $.orangeModal({
												id: "scorm",
												title: "材料下载",
													//height: "480",
													width: "550",
												destroy: true,
												buttons: [
													{
														type: 'button',
														text: '打包下载',
														cls: "btn btn-primary",
														handle: function (m) {
															App.download(App.href+"/api/common/downloadzip?id="+value+"&itemId="+itemId,modalDwon.$body);
															
														}
													},{
														type: 'button',
														text: '关闭',
														cls: "btn btn-default",
														handle: function (m) {
															modalDwon.hide();
															
														}
													}]
											});
								modalDwon.show();
								var table = $('<table class="table table-striped clearfix"></tabel>');
								modalDwon.$body.append(table);
								var fileIds = value;
								if ($.trim(fileIds) == "")
									return;
								var ids = fileIds.split("_");
								var template = ''
									+ '<td style="width: 20%;">'
									+ '<span class="preview"><img src="/img/file.png" alt="${alt_}" width="32" height="32"></span>'
									+ '</td>'
									+ '<td style="width: 50%;vertical-align: middle;border-bottom: 1px solid #ddd;">'
									+ '<p class="name">${fileName_}</p>'
									+ '<p class="size">${fileSize_} KB</p>'
									+ '</td>'
									+ '<td style="width: 30%;vertical-align: middle;">'
									+ '    <button type="button" class="btn btn-info btn-sm cancel">下载</button>        '
									+ '</td>'
									+ '';
								var fileInfoUrl = App.href + "/api/common/attachment";
								var dataParam = "attachmentId";
								$.each(ids,function(i,fileid){//})for (var i in ids) {
									var dataParamValue = {};
									dataParamValue[dataParam] = ids[i];
									var tr=$('<tr class="template-upload fade in"></tr>');
									tr.appendTo(table);
									$.ajax({
										type: "POST",
										data: dataParamValue,
										dataType: "json",
										url: fileInfoUrl,
										success: function (data) {
											if (data.code == 200) {
												var file = $.tmpl(template, {
													"alt_": data.data.attachmentSuffix,
													"fileName_": data.data.attachmentName,
													"fileSize_": (data.data.attachmentSize / 1000)
														.toFixed(2),
													"fileIds_": data.data.attachmentId
												});
												if(data.data.attachmentSuffix=="jpg"||data.data.attachmentSuffix=="png"||data.data.attachmentSuffix=="jpeg"){
													file.find("img").attr("src",data.data.attachmentUrl).css("cursor","pointer").parent().bind("click",function(){
														var imageModal = $.orangeModal({
																id: "imgmodal",
																title: data.data.attachmentName,
																	//height: "480",
																destroy: true
																}).show();
															imageModal.$body.append('<img style="width:100%;" src="'+data.data.attachmentUrl+'">');
													});

												}
												tr.append(file);
												tr.find("button.btn.btn-info.cancel").bind("click", function () {
														App.download(App.href+"/api/common/download?id="+ids[i]+"&itemId="+name.replace("itemFile",""),modalDwon.$body);
												});
											}
										}
									});//--ajax
								}
								);//--each
							}
						});
				});
			});
			window.App.content.find("#grid").html('');
			var excel;
			//var colInfos = [
			//{ name: 'displayName', displayName: '学会', size: 50, visible: false }];
			

			var options = {
				title:"各学会上传附件情况表",
				url: App.href + "/api/core/scoreCount/userUploadFileCounts?paperId="+currentPaper,
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
				//columns: colInfos
				colInfos: colInfos
			};
			//grid = window.App.content.find("#grid").orangeGrid(options);
			grid = window.App.content.find("#grid").ExcelView(options);
			
		}
				

    };
})(jQuery, window, document);