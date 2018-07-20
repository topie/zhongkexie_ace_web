/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/disssentcheck/page": "disssentcheckPage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.disssentcheckPage = {
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
            url: App.href + "/api/core/dictItem/list?dictId=5",
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
                    title: "提交人",
                    field: "title",
					format:function(){return "测试员";}
                },  {
                    title: "标题",
                    field: "userName",
					format:function(){return "***提出举报";}
                }
                
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
				{
                    text: "查看",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {

						}
				},
					{
                    text: "标记为已读",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {

						}
				}
            ],
            search: {
                rowEleNum: 3,
				hide:false,
                //搜索栏元素
                items: [
                   
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
		var formOpts = {
				id: "add_dict_form",
				name: "add_dict_form",
				method: "POST",
				action: App.href + "/api/core/dict/insert",
				ajaxSubmit: true,
				rowEleNum: 2,
				ajaxSuccess: function () {
				},
				submitText: "提交",//保存按钮的文本
				showReset: true,//是否显示重置按钮
				resetText: "重置",//重置按钮文本
				isValidate: true,//开启验证
				buttonsAlign: "center",
				items:[{
                                    type: 'hidden',
                                    name: 'dictId',
                                    id: 'dictId'
                                },{
                                    type: 'text',
                                    name: 'dictName',
                                    id: 'dictName',
                                    label: '标题',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                },
                                {
                                    type: 'text',
                                    name: 'dictSeq',
                                    id: 'dictSeq',
                                    label: '联系人',
                                    cls: 'input-xxlarge'
                                },{
                                    type: 'text',
                                    name: 'dictName',
                                    id: 'dictName',
                                    label: '类型',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                },
                                {
                                    type: 'text',
                                    name: 'dictDesc',
                                    id: 'dictDesc',
                                    label: '联系电话',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'textarea',
                                    name: 'dictCode',
                                    id: 'dictCode',
                                    label: '异议或意见',
                                    cls: 'input-xxlarge',
									rows:8,
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                },
                                {
                                    type: 'text',
                                    name: 'dictSeq',
                                    id: 'dictSeq',
                                    label: '邮箱',
                                    cls: 'input-xxlarge'
                                }]
			};
		  // var form =   window.App.content.find("#form").orangeForm(formOpts);		

    };
})(jQuery, window, document);