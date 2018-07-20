/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/download/page": "downloadPage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.downloadPage = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
               // '<div class="panel panel-default" >' +
               // '<div class="panel-heading">题库试卷管理</div>' +
                '<div class="panel-body" id="grid"></div>' +
              //  '</div>' +
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
		var modal;

        var options = {
            url: App.href + "/api/core/message/list?type=download",
            contentType: "table",
            contentTypeItems: "table,card,list",
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "mId",//id域指定
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
                    title: "下载标题",
                    field: "title",
                    sort: true
                }, {
                    title: "发布时间",
                    field: "createTime",
                    sort: true
                }, {
                    title: "状态",
                    field: "status",
                    sort: true,
					format:function(index,data){
						if(data.status=='0'){
							return '新增';	
						}
						if(data.status=='1'){
							return '发布';	
						}
						if(data.status=='2'){
							return '撤回';	
						}
						return '新建';
					}
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                {
                    text: "编辑",
					visible:function (index, data){
						if(data.status==1)return false;
						return true;
					},
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                         modal = $.orangeModal({
                            id: "downloadForm",
                            title: "编辑",
                            destroy: true
                        });
						 formOpts.action = App.href + "/api/core/message/update";
                        
                        var form = modal.$body.orangeForm(formOpts);
                        form.loadRemote(App.href + "/api/core/message/load/" + data.mId);
                        modal.show();
                    }
                },{
					textHandle:function (index, data){
						if(data.status=="0")return "发布";
						if(data.status=="1")return "取消发布";
						if(data.status=="2")return "再次发布";
						return "发布";
					},
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
						var sta = "1";
						if(data.status==0)sta="1";
						if(data.status==1)sta="2";
                         bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/core/message/update";
                                $.ajax({
                                    type: "POST",
                                    dataType: "json",
                                    data: {
                                        mId: data.mId,
										status:sta
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
                }, {
                    text: "删除",
					visible:function (index, data){
						if(data.status==1)return false;
						return true;
					},
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/core/message/delete";
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
                }
            ],
            tools: [
                {
                    text: " 添 加",
                    cls: "btn btn-primary",
                    icon: "fa fa-plus",
                    handle: function (grid) {
                         modal = $.orangeModal({
                            id: "add_modal",
                            title: "添加",
                            destroy: true
                        }).show();
                        formOpts.action =  App.href + "/api/core/message/insert";
                        modal.$body.orangeForm(formOpts);
                    }
                }
            ],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [
                    {
                        type: "text",
                        label: "标题",
                        name: "title",
                        placeholder: "输入要搜索的标题名称"
                    }
                ]
            }
        };
		var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/core/message/insert",
                            ajaxSubmit: true,
                            rowEleNum: 1,
                            ajaxSuccess: function () {
                                modal.hide();
                                grid.reload();
                            },
                            submitText: "保存",//保存按钮的文本
                            showReset: true,//是否显示重置按钮
                            resetText: "重置",//重置按钮文本
                            isValidate: true,//开启验证
                            buttons: [{
                                type: 'button',
                                text: '关闭',
                                handle: function () {
                                    modal.hide();
                                    grid.reload();
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
								 {
                                    type: 'hidden',
                                    name: 'mId',
                                    id: 'mId'
                                },{
                                    type: 'hidden',
                                    name: 'type',
									value:"download"
                                },{
                                    type: 'hidden',
                                    name: 'status',
									value:"0"
                                },
                                 {
                                    type: 'text',
                                    name: 'title',
                                    id: 'title',
                                    label: '下载标题',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入下载标题"
                                    }
                                }, {
                                    type: 'textarea',
                                    name: 'content',
                                    id: 'content',
                                    label: '下载内容描述',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入下载内容描述"
                                    }
                                }, {
                                    type: 'files',
                                    name: 'downloadFileId',
                                    id: 'downloadFileId',
                                    label: '附件',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
        grid = window.App.content.find("#grid").orangeGrid(options);

    };
})(jQuery, window, document);
