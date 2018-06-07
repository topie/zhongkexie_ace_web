/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/mem/satisfaction": "satisfaction"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.satisfaction = {
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
            url: App.href + "/api/mem/score/list",
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
                }, {
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
                    title: "满意度（百分比/%）",
                    field: "score",
					format:function(index,data){
						return dataClick(index,data,App.href + "/api/mem/score/scoreUpdate");

					}
                }
                
                
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

		function dataClick(num,data,url){
			var sco = data.score==null?"":data.score;
			var html = $('<div class="input-group">'+
			'<input type="text" class="spinbox-input form-control text-center " placeholder="" value="'+sco+'">'+
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
						if(isNaN(value)){
							value=0;
						}
						html.find('input').val(value);
					});
				}
				if($btn.is(".spinbox-down")){
					$btn.bind("click",function(){
						var value = html.find('input').val();
						if(isNaN(value)){
							html.find('input').val(0);
							return ;
						}
						if(value==0){
							html.find('input').val(100);
							return ;
						}
						value = parseInt(value)-10;
						if(value<0){
							value=0;
						}
						if(isNaN(value)){
							value=0;
						}
						html.find('input').val(value);
					});
				}
				if($btn.is(".btn-primary")){
					$btn.bind("click",function(){
						var value = html.find('input').val();
						if(parseInt(value)<0){
							bootbox.alert("满意度不能小于0%!");
							return false;
						}
						if(parseInt(value)>100){
							bootbox.alert("满意度不能大于100%!");
							return false;
						}
						if(isNaN(parseFloat(value))){
							bootbox.alert("请输入数字!");
							return false;
						}
						$.ajax({
									type: "POST",
									dataType: "json",
									data: {
										paperId:data.id,
										userId:data.userId,
										score:value,
										id:data.approveStatus
									},
									url: url,
									success: function (data) {
										if (data.code === 200) {
											html.addClass("has-success");
											bootbox.alert("评价成功");
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
					});
				}
			});
			return html;

		};

    };
})(jQuery, window, document);