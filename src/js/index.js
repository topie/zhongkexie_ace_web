/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var token = $.cookie(App.token_key);
    if (token == undefined) {
        window.location.href = '../login.html';
    }
    App.token = token;

    var requestMapping = {
        "/api/index": "index"
    };
    App.requestMapping = $.extend({}, App.requestMapping, requestMapping);

    App.index = {
        page: function (title) {
            App.content.empty();
            App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-6" >' +
					'<div class="row">' +
						'<div class="panel panel-info" >' +
							'<div class="panel-heading"><i class="fa fa-bell fa-fw"></i>通知公告</div>' +
							'<div class="panel-body" id="content1"></div>' +
						'</div>' +
					'</div>' +
					'<div class="row" style="display:none;">' +
						'<div class="panel panel-success" >' +
							'<div class="panel-heading"><i class="fa fa-pencil fa-fw"></i>我的任务</div>' +
							'<div class="panel-body" id="content4"></div>' +
						'</div>' +
					'</div>' +
				'</div>' +
                /*'<div class="col-md-6" >' +
                '<div class="panel panel-warning" >' +
                '<div class="panel-heading"><i class="fa fa-calendar fa-fw"></i>今日日程</div>' +
                '<div class="panel-body" id="content2"></div>' +
                '</div>' +
                '</div>' +*/
                '<div class="col-md-6" >' +
					'<div class="col-md-12">' +
						'<div class="panel panel-danger" >' +
							'<div class="panel-heading"><i class="fa fa-suitcase fa-fw"></i>文件下载</div>' +
							'<div class="panel-body" id="content3"></div>' +
						'</div>' +
					'</div>' +
                /*'<div class="col-md-6" >' +
                 '<div class="panel panel-primary" >' +
                 '<div class="panel-heading">板块5</div>' +
                 '<div class="panel-body" id="content5"></div>' +
                 '</div>' +
                 '</div>' +
                 '<div class="col-md-6" >' +
                 '<div class="panel panel-red" >' +
                 '<div class="panel-heading">板块6</div>' +
                 '<div class="panel-body" id="content6"></div>' +
                 '</div>' +
                 '</div>' +*/
                '</div>' +
                '</div>');
            App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {
        initMessage();
		initDownload();
		if(App.currentUser.userType==4){
			initWord();
		}
    };
	function initWord(){
		$('#content4').parent().parent().show();
		$.ajax({
            url: App.href + "/api/core/scoreCount/countExpertFinish",
            type: "GET",
            resultType: "json",
            success: function (result) {
                if (result.code != 200) {
                    console.log("信息加载失败");
                }
				var html='<div class="infobox infobox-blue" style="width:48%">'
							+'<div class="infobox-icon">'
								+'<i class="ace-icon fa fa-hdd-o"></i>'
							+'</div>'
							+'<div class="infobox-data">'
								+'<span class="infobox-data-number">'+result.data.finished+'</span>'
								+'<div class="infobox-content">已完成评价'+result.data.finished+'个</div>'
							+'</div>'
							//+'<div class="stat stat-success">8%</div>'
						+'</div>'
						+'<div class="infobox infobox-red" style="width:48%">'
							+'<div class="infobox-icon">'
								+'<i class="ace-icon fa fa-pencil-square-o"></i>'
								//+'<span class="sparkline" data-values="196,128,202,177,154,94,100,170,224"></span>'
							+'</div>'
							+'<div class="infobox-data">'
								+'<span class="infobox-data-number">'+result.data.commited+'</span>'
								+'<div class="infobox-content">待评价'+result.data.commited+'个</div>'
							+'</div>'
							//+'<div class="stat stat-success">8%</div>'
						+'</div>';
                $('#content4').append(html);
				/*$('.easy-pie-chart.percentage').each(function(){
					var $box = $(this).closest('.infobox');
					var barColor = $(this).data('color') || (!$box.hasClass('infobox-dark') ? $box.css('color') : 'rgba(255,255,255,0.95)');
					var trackColor = barColor == 'rgba(255,255,255,0.95)' ? 'rgba(255,255,255,0.25)' : '#E2E2E2';
					var size = parseInt($(this).data('size')) || 50;
					$(this).easyPieChart({
						barColor: barColor,
						trackColor: trackColor,
						scaleColor: false,
						lineCap: 'butt',
						lineWidth: parseInt(size/10),
						animate: ace.vars['old_ie'] ? false : 1000,
						size: size
					});
				})
				$('.sparkline').each(function(){
					var $box = $(this).closest('.infobox');
					var barColor = !$box.hasClass('infobox-dark') ? $box.css('color') : '#FFF';
					$(this).sparkline('html',
									 {
										tagValuesAttribute:'data-values',
										type: 'bar',
										barColor: barColor ,
										chartRangeMin:$(this).data('min') || 0
									 });
				});*/
			},
			error:function(){}
		});
	}
    function initMessage() {
        $.ajax({
            url: App.href + "/api/core/message/list",
            type: "GET",
            data: "pageNum=1&pageSize=5&status=1&type=message",
            resultType: "json",
            success: function (result) {
                if (result.code != 200) {
                    console.log("信息加载失败");
                }
                var $content1 = $("#content1");
                if (result.data.total > 0) {
                    var $ul = $('<div class="panel-group" id="accordion"></div>');
                    for (var i = 0; i < result.data.total; i++) {
                        var item = result.data.data[i];
                        var open = ' aria-expanded="false" class="collapsed" ';
                        var contentopne = 'class=" panel-collapse collapse" aria-expanded="false" style="height: 0px;" ';
                        if (i == 0) {
                            open = ' aria-expanded="true" ';
                            contentopne = 'class=" panel-collapse collapse in" aria-expanded="true" ';
                        }
						var download='<div style="    text-align: right;">';
						if(item.downloadFileId!=null){
							var files = item.downloadFileId.split(",");
							for(var j=0;j<files.length;j++){
								download += '<button class="btn btn-minier btn-white btn-warning btn-bold" onclick="App.download(\'/api/common/download?id='+files[j]+'\')">'+
												'<i class="ace-icon fa fa-download bigger-120 orange"></i>'
												+'附件'+(j+1)+
											'</button>';
							}
						}
						download+='</div>';
                        var li = '<div class="panel panel-default">' +
                            '                                    <div class="panel-heading">' +
                            '                                        <h4 class="panel-title">' +
                            '                                            <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne' +
                            item.mId + '" ' + open + '><i class="fa fa-envelope fa-fw"></i>' +
                            item.title + ' &nbsp;' + item.createTime.substring(0, 11) + '</a>' +
                            '                                        </h4>' +
                            '                                    </div>' +
                            '                                    <div id="collapseOne' + item.mId + '" ' + contentopne + '>' +
                            '                                        <div class="panel-body">'+
							//'<a href="'+App.href+'/index.html?u=/api/core/scorePaper/reportList">' +
                            item.content +
                           // '                                        </a>'+
							download+
							'</div>' +
                            '                                    </div>' +
                            '                                </div>';

                        $ul.append(li);
                    }
                    $content1.append($ul);
                }
            }
        });
		
    }
	
	function initDownload() {

        $.ajax({
            url: App.href + "/api/core/message/list",
            type: "GET",
            data: "pageNum=1&pageSize=5&status=1&type=download",
            resultType: "json",
            success: function (result) {
                if (result.code != 200) {
                    console.log("信息加载失败");
                }
                var $content1 = $("#content3");
                if (result.data.total > 0) {
                    var $ul = $('<div class="panel-group" id="accordionD"></div>');
                    for (var i = 0; i < result.data.total; i++) {
                        var item = result.data.data[i];
                        var open = ' aria-expanded="false" class="collapsed" ';
                        var contentopne = 'class=" panel-collapse collapse" aria-expanded="false" style="height: 0px;" ';
                        if (i == 0) {
                            open = ' aria-expanded="true" ';
                            contentopne = 'class=" panel-collapse collapse in" aria-expanded="true" ';
                        }
						var download='<div style="    text-align: right;">';
						if(item.downloadFileId!=null){
							var files = item.downloadFileId.split(",");
							for(var j=0;j<files.length;j++){
								download += '<button class="btn btn-minier btn-white btn-warning btn-bold" onclick="App.download(\'/api/common/download?id='+files[j]+'\')">'+
												'<i class="ace-icon fa fa-download bigger-120 orange"></i>'
												+'附件'+(j+1)+
											'</button>';
							}
						}
						download+='</div>';
                        var li = '<div class="panel panel-default">' +
                            '                                    <div class="panel-heading">' +
                            '                                        <h4 class="panel-title">' +
                            '                                            <a data-toggle="collapse" data-parent="#accordionD" href="#collapseOne' +
                            item.mId + '" ' + open + '><i class="fa fa-download fa-fw"></i>' +
                            item.title + ' &nbsp;' + item.createTime.substring(0, 11) + '</a>' +
                            '                                        </h4>' +
                            '                                    </div>' +
                            '                                    <div id="collapseOne' + item.mId + '" ' + contentopne + '>' +
                            '                                        <div class="panel-body">'+
							//'<a href="'+App.href+'/index.html?u=/api/core/scorePaper/reportList">' +
                            item.content +
                           // '                                        </a>'+
							download+
							'</div>' +
                            '                                    </div>' +
                            '                                </div>';

                        $ul.append(li);
                    }
                    $content1.append($ul);
                }
            }
        });
    }
	
})
(jQuery, window, document);
