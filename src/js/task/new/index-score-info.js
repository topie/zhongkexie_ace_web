/**
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/task/indexScore/page": "indexScorePage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.indexScorePage = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
				   // '<div class="panel panel-default" >' +
				  //  '<div class="panel-heading">题库题目管理</div>' +
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
		
        var grid,indexDict;
        var options = {
            url: App.href + "/api/task/indexScore/list",
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
               /* {
                    title: "ID",
                    field: "id",
                    sort: true,
                    width: "5%"
                },*/ {
					title: "所属类别",
					field: "indexId",
					format:function(index,data){
						if(index==1){
							var paperId_select = $('#paperId_select').val();
							$.ajax({
								async:false,
								url:App.href + "/api/core/scoreIndex/list?parentId=0&paperId="+paperId_select,
								success:function(res){
									indexDict=res.data.data;
								}
							})
						}
							var s = '- -';
						for(var i=0;i<indexDict.length;i++){
							if(indexDict[i].id==data.indexId){
								s= indexDict[i].name;
							}
						}
						return s;
						
					}
				},{
                    title: "分数",
                    field: "score",
                    width: "5%"
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                {
                    text: "编辑",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
					   var paperId_select = $("#paperId_select").val();
                        var modal = $.orangeModal({
                            id: "scoreItemForm",
                            title: "编辑",
                            destroy: true
                        });
                        var formOpts = {
                            id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/task/indexScore/update",
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
                                    id: 'paperId'
                                }, {
                                    type: 'select',
                                    name: 'indexId',
                                    id: 'indexId',
                                    label: '所属分类',
                                    cls: 'input-xxlarge',
									itemsUrl:App.href + "/api/core/scoreIndex/list?parentId=0&paperId="+paperId_select,
									autoParam:["id","name","data","data"],
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'score',
                                    id: 'score',
                                    label: '分数',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts);
						form.loadLocal(data);
                        modal.show();
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/task/indexScore/delete";
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
                                            alert(data.message);
                                        }
                                    },
                                    error: function (e) {
                                        alert("请求异常。");
                                    }
                                });
                            }
                        });
                    }
                }],
            tools: [
                {
                    text: " 添 加",
                    cls: "btn btn-primary",
                    icon: "fa fa-plus",
                    handle: function (grid) {
					   var paperId_select = $("#paperId_select").val();
						
                        var modal = $.orangeModal({
                            id: "add_modal",
                            title: "添加",
                            destroy: true
                        }).show();
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/task/indexScore/insert",
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
									value:paperId_select
                                }, {
                                    type: 'select',
                                    name: 'indexId',
                                    id: 'indexId',
                                    label: '所属分类',
                                    cls: 'input-xxlarge',
									itemsUrl:App.href + "/api/core/scoreIndex/list?parentId=0&paperId="+paperId_select,
									autoParam:["id","name","data","data"],
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'score',
                                    id: 'score',
                                    label: '分数',
                                    cls: 'input-xxlarge'
                                }
                                
                            ]
                        };
                       var form =  modal.$body.orangeForm(formOpts);

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

    };
})(jQuery, window, document);