/**
 * 答案导入
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/paper/importAnswer": "scoreImportAnswer"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.scoreImportAnswer = {
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
        var options = {
            url: App.href + "/api/core/scorePaper/list",
            contentType: "table",
            contentTypeItems: "table,card,list",
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "id",//id域指定
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 10, 30, 50],
            columns: [
                /* {
                     title: "ID",
                     field: "id",
                     sort: true,
                     width: "5%"
                 }, */{
                    title: "评估项目名称",
                    field: "title",
                    sort: true
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [ {
                    text: "导出模板",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                    	var url = App.href + "/api/answerImport/template?paperId="+data.id;
						App.download(url);
                   
                    }

                },{
				text: "模板导入数据",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        modal = $.orangeModal({
                            id: "scoreItemForm",
                            title: "导入",
                            destroy: true
                        });
						var	formOpts={
							id: "ip_form",
                            name: "ip_form",
                            method: "POST",
							//rowEleNum:2,
                            action: App.href + "/api/answerImport/import",
                            ajaxSubmit: true,
                            ajaxSuccess: function (res) {
								if(res.code==200){
									var html='导入结果：';
									for(var i=0;i<res.data.length;i++){
										html+="</br>"+res.data[i].msg;	
									}
									if(html=='导入结果：'){
										html="导入成功";
									}
									bootbox.alert(html);
									modal.hide();
								}else{
									bootbox.alert("操作发生错误:"+res.message);
								}
                                //grid.reload();
                            },
                            submitText: "导入",
                            showReset: true,
                            resetText: "重置",
                            isValidate: true,
                            buttons: [/*{
                                type: 'button btn-primary',
                                text: '导入测试',
                                handle: function () {
                                    var $form = $("#ip_form");
									var file = $form.find("#fileId");
									if(file.val()===undefined || file.val()==''){
										bootbox.alert("请先上传附件！");
										return;
									}

                                }
                            },*/{
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
                                    name: 'paperId',
                                    id: 'paperId'
                                }, {
									type: 'tree',//类型
									name: 'orgId',
									id: 'orgId',//id
									label: '学会',//左边label
									url: App.href + "/api/core/dept/tree",
									//url:App.href + "/api/core/scorePaper/zjcheckListName?paperId="+currentPaper,
									//expandAll: true,
									//mtype:"GET",
									autoParam: ["id", "name", "pId"],
									chkStyle: "radio",
									//chkboxType:{"Y": "ps", "N": "s"},
									expandAll:false,
									rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "选择学会"
                                    }
								},{
									type:'files',
									name:'fileId',
									id:'fileId',
									label: '选择文件',
									rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请上传文件"
                                    }
								}
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts);
						form.loadLocal({"paperId":data.id});
                        modal.show();
                    }
				},{
				text: "导入数据2",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        modal = $.orangeModal({
                            id: "scoreItemForm",
                            title: "导入",
                            destroy: true
                        });
						var	formOpts={
							id: "ip_form",
                            name: "ip_form",
                            method: "POST",
							//rowEleNum:2,
                            action: App.href + "/api/answerImport/import2",
                            ajaxSubmit: true,
                            ajaxSuccess: function (res) {
								if(res.code==200){
									var html='导入结果：';
									for(var i=0;i<res.data.length;i++){
										html+="</br>"+res.data[i].msg;	
									}
									if(html=='导入结果：'){
										html="导入成功";
									}
									bootbox.alert(html);
									modal.hide();
								}else{
									bootbox.alert("操作发生错误:"+res.message);
								}
                                //grid.reload();
                            },
                            submitText: "导入",
                            showReset: true,
                            resetText: "重置",
                            isValidate: true,
                            buttons: [/*{
                                type: 'button btn-primary',
                                text: '导入测试',
                                handle: function () {
                                    var $form = $("#ip_form");
									var file = $form.find("#fileId");
									if(file.val()===undefined || file.val()==''){
										bootbox.alert("请先上传附件！");
										return;
									}

                                }
                            },*/{
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
                                    name: 'paperId',
                                    id: 'paperId'
                                },{
									type:'files',
									name:'fileId',
									id:'fileId',
									label: '选择文件',
									rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请上传文件"
                                    }
								}
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts);
						form.loadLocal({"paperId":data.id});
                        modal.show();
                    }
				}
               
            ],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [
                    {
                        type: "text",
                        label: "评估项目名称",
                        name: "title",
                        placeholder: "输入要搜索的评估项目"
                    }
                ]
            }
        };
	
        grid = window.App.content.find("#grid").orangeGrid(options);

    };

})(jQuery, window, document);
