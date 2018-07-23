/**
 * 
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/disssent/page": "dissentPage"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.dissentPage = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
				 '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel-body" id="form"></div>' +
                '<div class="panel-body"></div>' +
                '</div>' +
                '</div>' +
				'<hr>'+
				'<hr>'+
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
            url: App.href + "/api/dissent/info/cuserList",
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
                    title: "有异议的学会名称",
                    field: "dissentOrg"
                },  {
                    title: "有异议的指标项",
                    field: "dissentIndex"
                },  {
                    title: "意见",
                    field: "content"
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
				action: App.href + "/api/dissent/info/insert",
				ajaxSubmit: true,
				rowEleNum: 1,
				ajaxSuccess: function (data) {
					if(data.code==200){
						bootbox.alert("提交成功，感谢您的反馈意见！");
						form.reload();
						grid.reload();
					}else bootbox.alert("提交错误！请联系管理员");

				},
				submitText: "提交",//保存按钮的文本
				showReset: true,//是否显示重置按钮
				resetText: "重置",//重置按钮文本
				isValidate: true,//开启验证
				buttonsAlign: "center",
				items:[{
                                    type: 'hidden',
                                    name: 'id',
                                    id: 'id'
                                },/*{
                                    type: 'display',
                                    name: 'dictId',
                                    id: 'dictId',
									html:'<span style="font-size: 28px;">学会可以对其他学会填报信息提出异议</span>'
                                },*/{
                                    type: 'text',
                                    name: 'dissentOrg',
                                    id: 'dissentOrg',
                                    label: '有异议的学会名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }/*,
                                {
                                    type: 'text',
                                    name: 'dictSeq',
                                    id: 'dictSeq',
                                    label: '联系人',
                                    cls: 'input-xxlarge'
                                }*/,{
                                    type: 'text',
                                    name: 'dissentIndex',
                                    id: 'dissentIndex',
                                    label: '有异议的指标项',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入"
                                    }
                                }/*,
                                {
                                    type: 'text',
                                    name: 'dictDesc',
                                    id: 'dictDesc',
                                    label: '联系电话',
                                    cls: 'input-xxlarge'
                                }*/, {
                                    type: 'textarea',
                                    name: 'content',
                                    id: 'content',
                                    label: '异议内容',
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
                                    type: 'display',
                                    name: 'dictSeq',
                                    id: 'dictSeq',
                                    label: '',
                                    cls: 'input-xxlarge',
									html:'注意事项：8月16日-22日学会可对其他学会填报信息提出异议，内容填写完成后，点击“提交”即可。'
                                }]
			};
		   var form =   window.App.content.find("#form").orangeForm(formOpts);		

    };
})(jQuery, window, document);