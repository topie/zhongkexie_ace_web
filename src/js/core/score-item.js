/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scoreItem/list": "scoreItem"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.scoreItem = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
					'<div class="col-md-4" >' +
						'<div class="panel panel-default" >' +
							'<div class="panel-heading">'+
							'<div class="row">'+
							'<div class="col-md-9">'+
							'<select class="form-control input-sm" id="paperSelect">'+
								/*'<option>TODO 动态加载考评表</option>'+
								'<option>2018全国学会综合能力指标体系考评表</option>'+
								'<option>2017全国学会综合能力指标体系考评表</option>'+*/
							'</select>'+
							'</div>'+
							'<div class="col-md-3">'+
								'<a data-exp="false" id="expandAllBtn" class="btn btn-info btn-sm" href="javascript:void(0);">展开</a>'+
							'</div>'+
							'</div>'+
							'</div>' +
							'<ul id="tree" class="ztree pre-scrollable" style="max-height:600px"></ul>' +
						'</div>' +
					'</div>' +
					'<div class="col-md-8" >' +
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
		//初始化选择评估项目，
		var currentPaper='';
		var currentIndex='';
		var currentIndexTitle='';
		var tree;
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
					}
				}else{
					bootbox.alert(data.message);
				}
			}
		});
		//绑定onchange事件
		$paper.bind("change",function(){
			currentPaper = $(this).val();
			//tree.reAsyncChildNodes(null, "refresh");
			setting.async.url= App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper;
			tree.destroy();
			 $.fn.zTree.init($("#tree"), setting);
			tree = $.fn.zTree.getZTreeObj("tree");
			//var url = App.href + "/api/core/scoreIndex/list?paperId="+currentPaper;
			//grid.reload({url:url});
		});
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
		var setting = {
            async: {
                enable: true,
                url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc&paperId="+currentPaper,
                autoParam: ["id", "name", "pId"]
            },
            edit: {
                enable: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
			view:{
				addDiyDom: addDiyDom  
			},
            callback: {
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                   // var zTree = $.fn.zTree.getZTreeObj(treeId);
                   // zTree.expandAll(true);
                },
				beforeClick: function(treeId, treeNode, clickFlag) {
						return !treeNode.isParent;
				},
				onClick:function(event, treeId, treeNode){
					currentIndex = treeNode.id;
					currentIndexTitle = treeNode.name;
					var  url = App.href + "/api/core/scoreItem/list?indexId="+currentIndex;
					grid.reload({url:url});
				}
            }
        };
		function addDiyDom(treeId, treeNode) {  
			var spaceWidth = 5;  
			var switchObj = $("#" + treeNode.tId + "_switch"),  
			icoObj = $("#" + treeNode.tId + "_ico");  
			switchObj.remove();  
			icoObj.before(switchObj);  
			if (treeNode.level > 1) {  
				var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";  
				switchObj.before(spaceStr);  
			}  
			var spantxt=$("#" + treeNode.tId + "_span").html();  
			if(spantxt.length>17){  
				spantxt=spantxt.substring(0,17)+"...";  
				$("#" + treeNode.tId + "_span").html(spantxt);  
			}
		} ;

        $.fn.zTree.init($("#tree"), setting);
        tree = $.fn.zTree.getZTreeObj("tree");

        var grid;
        var tree;
		var itemGrid;
        var options = {
            url: App.href + "/api/core/scoreItem/list?indexId=0",
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
                    title: "题目名称",
                    field: "title",
                    sort: true
                }, {
                    title: "题目分值",
                    field: "score",
                    sort: true
                },{
					title:"类型",
					field:"type",
					format:function(index,data){
					 if(data.type==0)return '填空[文本]';
					 if(data.type==1)return '单选';
					 if(data.type==2)return '多选';
					 if(data.type==3)return '填空[多]';
					 if(data.type==4)return '填空[数字]';
					 if(data.type==5)return '单选[可填空]';
					 if(data.type==6)return '多选[可填空]';
					 if(data.type==7)return '多填空[自定义]';
					 if(data.type==8)return '单选[是否填空]';
					 if(data.type==9)return '数字[列举]';
					 if(data.type==10)return '文本框';
					 return '未识别';
					}
				},{
					title:"评分类型",
					field:"scoreType",
					format:function(index,data){
					 if(data.scoreType==1)return '统计项';
					 if(data.scoreType==2)return '线性打分项';
					 if(data.scoreType==3)return '专家打分项';
					 if(data.scoreType==4)return '其他打分项';
					 return '未识别';
					}
				}
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                {
                    text: "编辑",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "scoreItemForm",
                            title: "编辑",
                            destroy: true
                        });
                        var formOpts = {
                            id: "edit_form",
                            name: "edit_form",
                            method: "POST",
							replate2B:false,
                            action: App.href + "/api/core/scoreItem/update",
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
                                    name: 'indexId',
									label: '指标',
                                    id: 'indexId'
                                },{
                                    type: 'display',
                                    name: 'indexTitle',
									label: '指标名称',
                                    id: 'indexTitle'
                                },/* {
                                    type: 'tree',
                                    name: 'indexId',
                                    id: 'indexId',
                                    label: '指标',
                                    url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc",
                                    expandAll: true,
                                    autoParam: ["id", "name", "pId"],
                                    chkStyle: "radio",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择指标"
                                    }
                                },*/ {
                                    type: 'text',
                                    name: 'title',
                                    id: 'title',
                                    label: '题目名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入题目名称"
                                    }
                                }, {
                                    type: 'select',
                                    name: 'type',
                                    id: 'type',
                                    label: '选项类型',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入选项文本"
                                    },
                                    items: [
                                        {
                                            text: '填空[文本]',
                                            value: 0
                                        },
                                        {
                                            text: '单选',
                                            value: 1
                                        },
                                        {
                                            text: '多选',
                                            value: 2
                                        },
                                        {
                                            text: '填空[多]',
                                            value: 3
                                        },
                                        {
                                            text: '填空[数字]',
                                            value: 4
                                        },
										{
                                            text: '单选[可填空]',
                                            value: 5
                                        },
                                        {
                                            text: '多选[可填空]',
                                            value: 6
                                        },
                                        {
                                            text: '单选[是否填空]',
                                            value: 8
                                        },
                                        {
                                            text: '多填空[自定义]',
                                            value: 7
                                        },
                                        {
                                            text: '数字[列举]',
                                            value: 9
                                        },
                                        {
                                            text: '文本框',
                                            value: 10
                                        }
                                    ]
                                }, {
                                    type: 'textarea',
                                    name: 'items',
                                    id: 'items',
                                    label: '自定义填空',
									placeholder:'[{type:text,placeholder:"请填写个数"}]',
                                    cls: 'input-xxlarge'
                                },{
                                    type: 'number',
                                    name: 'row',
                                    id: 'row',
									value:"0",
                                    label: '生成行数',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入零分值"
                                    }
                                },{
                                    type: 'radioGroup',
                                    name: 'hideBtn',
                                    id: 'hideBtn',
                                    label: '隐藏添加按钮',
                                    items:[{text:'隐藏',value:'true'},{text:'不隐藏',value:'false',checked:'true'}]
                                }, {
                                    type: 'select',
                                    name: 'showLevel',
                                    id: 'showLevel',
                                    label: '展示等级',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入选项文本"
                                    },
                                    items: [
                                    ],
									itemsUrl:App.href +"/api/core/dict/getItems?code=YHLX"
                                }, {
                                    type: 'select',
                                    name: 'scoreType',
                                    id: 'scoreType',
                                    label: '评分类型',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入评分类型"
                                    },
                                    items: [
                                        {
                                            text: '统计项（不评分）',
                                            value: 1
                                        },
                                        {
                                            text: '线性评分项',
                                            value: 2
                                        },
                                        {
                                            text: '专家评分项',
                                            value: 3
                                        },
                                        {
                                            text: '其他评分项',
                                            value: 4
                                        }
                                    ]
                                }, {
                                    type: 'textarea',
                                    name: 'optionLogic',
                                    id: 'optionLogic',
                                    label: '评分逻辑',
                                    cls: 'input-xxlarge'
                                },{
                                    type: 'textarea',
                                    name: 'optionLogicDesc',
                                    id: 'optionLogicDesc',
                                    label: '评分逻辑描述',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'number',
                                    name: 'score',
                                    id: 'score',
                                    label: '题目分值',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入分值"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'placeholder',
                                    id: 'placeholder',
                                    label: '输入框提示',
                                    cls: 'input-xxlarge'
                                }, 
                                {
                                    type: 'select2',
                                    name: 'responsibleDepartment',
                                    id: 'responsibleDepartment',
                                    label: '责任部门',
                                    cls: 'input-xxlarge',
                                    items:[],
                                    itemsUrl: App.href +"/api/core/dict/getItems?code=ZZBM"
                                },
                                {
                                    type: 'textarea',
                                    name: 'relatedField',
                                    id: 'relatedField',
                                    label: '导出配置',
                                    cls: 'input-xxlarge'
                                    
                                    //itemsUrl: App.href +"/api/core/dict/getItems?code=ZYLY"
                                },
                                {
                                    type: 'number',
                                    name: 'sort',
                                    id: 'sort',
                                    label: '排序',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts,function(){
							var AddFrom = this.$form;
							var hideBtn = AddFrom.find('div[formele="radioGroup"]').parent().parent().parent();
							var row = AddFrom.find("#row").parent().parent().parent();
							var items = AddFrom.find("#items").parent().parent().parent();
							hideBtn.hide();
							row.hide();
							items.hide();
							AddFrom.find("#type").bind("change",function(){
								var selected = $(this).val();
								if(selected==3||selected==7||selected==8){
									hideBtn.show();
									row.show();
									if(selected==7||selected==8){
										items.show();
									}
								}else{
									hideBtn.hide();
									row.hide();
									items.hide();
								}
								if(selected==9){items.show();}else{}
							});
							
							var optionLogic = AddFrom.find("#optionLogic").parent().parent().parent();
							optionLogic.hide();
							AddFrom.find("#scoreType").bind("change",function(){
								var selected = $(this).val();
								if(selected==2){
									optionLogic.show();
								}else{
									optionLogic.hide();
								}
							});
						});
                        form.loadRemote(App.href + "/api/core/scoreItem/load/" + data.id,function(res){
							var AddFrom = form.$form;
							var type = res.type;
							if(type == 3||type == 7||type==8){
								var hideBtn = AddFrom.find('div[formele="radioGroup"]').parent().parent().parent();
								var row = AddFrom.find("#row").parent().parent().parent();
								if(type==7||type==8){
									var mitems = AddFrom.find("#items").parent().parent().parent();
									mitems.show();
								}
								hideBtn.show();
								row.show();
							}
							if(type==9){
								var mitems = AddFrom.find("#items").parent().parent().parent();
								mitems.show();
							}else{}
							var selected = res.scoreType;
							var optionLogic = AddFrom.find("#optionLogic").parent().parent().parent();
								if(selected==2){
									optionLogic.show();
								}else{
									optionLogic.hide();
								}
						});
						form.loadLocal({indexTitle:currentIndexTitle});
                        modal.show();
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/core/scoreItem/delete";
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
                }, {
                    text: "管理选项",
                    cls: "btn-info btn-sm",
					visible:function(index,data){
						if(data.type==1)return true;
						if(data.type==2)return true;
						if(data.type==5)return true;
						if(data.type==6)return true;
						if(data.type==8)return true;
						return false;
					},
                    handle: function (index, data, grid) {
                        var itemModal = $.orangeModal({
                            id: "scoreItemOptionGrid",
                            title: "管理选项-" + data.title,
                            destroy: true,
                            width: $(window).width()
                        }).show();
                        var itemId = data.id;
                        var requestUrl = App.href + "/api/core/scoreItemOption/list?itemId=" + itemId;
						 itemModal.$body.orangeForm({
                                            id: "static_item_edit_form",
                                            name: "static_item_edit_form",
                                            method: "POST",
                                            action: App.href + "/api/core/scoreItemOption/insert",
                                            ajaxSubmit: true,
											rowEleNum:3,
                                            ajaxSuccess: function () {
                                                document.getElementById("static_item_edit_form").reset();
                                                itemGrid.reload();
                                            },
                                            submitText: "添加",
                                            showReset: true,
                                            resetText: "重置",
                                            isValidate: true,
                                            
                                            buttonsAlign: "center",
                                            items: [
                                                {
                                                    type: 'hidden',
                                                    name: 'id',
                                                    id: 'id'
                                                }, {
                                                    type: 'hidden',
                                                    name: 'itemId',
                                                    id: 'itemId',
                                                    value: itemId
                                                }, {
                                                    type: 'text',
                                                    name: 'optionTitle',
                                                    id: 'optionTitle',
                                                    label: '选项文本',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入选项文本"
                                                    }
                                                }, {
                                                    type: 'text',
                                                    name: 'optionRate',
                                                    id: 'optionRate',
                                                    label: '系数',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入选项系数"
                                                    }
                                                }, {
                                                    type: 'text',
                                                    name: 'optionDesc',
                                                    id: 'optionDesc',
                                                    label: '选项描述',
                                                    cls: 'input-xxlarge'
                                                }
                                            ]
                                        }
							
						);
                        itemGrid = itemModal.$body.orangeGrid({
                            url: requestUrl,
                            contentType: "table",
                            contentTypeItems: "table,card,list",
							replate2B:false,
                            pageNum: 1,//当前页码
                            pageSize: 15,//每页显示条数
                            idField: "id",//id域指定
                            headField: "name",
                            showCheck: true,//是否显示checkbox
                            checkboxWidth: "3%",
                            showIndexNum: false,
                            indexNumWidth: "5%",
                            pageSelect: [2, 15, 30, 50],
                            sort: "id_asc",
                            columns: [
                                {
                                    title: "选项文本",
                                    field: "optionTitle"
                                },
                                {
                                    title: "系数",
                                    field: "optionRate"
                                },
                                {
                                    title: "选项描述",
                                    field: "optionDesc"
                                }
                            ],
                            actionColumnText: "操作",//操作列文本
                            actionColumnWidth: "20%",
                            actionColumns: [
                                {
                                    text: "编辑",
                                    cls: "btn-primary btn-sm",
                                    handle: function (index, d, grid) {
                                        var modal = $.orangeModal({
                                            id: "scoreItemOptionForm",
                                            title: "编辑",
                                            destroy: true
                                        }).show();
                                        var formOpts = {
                                            id: "edit_form",
                                            name: "edit_form",
                                            method: "POST",
                                            action: App.href + "/api/core/scoreItemOption/update",
                                            ajaxSubmit: true,
                                            ajaxSuccess: function () {
                                                modal.hide();
                                                itemGrid.reload();
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
                                                }, {
                                                    type: 'hidden',
                                                    name: 'itemId',
                                                    id: 'itemId'
                                                }, {
                                                    type: 'text',
                                                    name: 'optionTitle',
                                                    id: 'optionTitle',
                                                    label: '选项文本',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入选项文本"
                                                    }
                                                }, {
                                                    type: 'number',
                                                    name: 'optionRate',
                                                    id: 'optionRate',
                                                    label: '选项系数',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入选项系数"
                                                    }
                                                }, {
                                                    type: 'textarea',
                                                    name: 'optionDesc',
                                                    id: 'optionDesc',
                                                    label: '描述',
                                                    cls: 'input-xxlarge'
                                                }, {
                                                    type: 'text',
                                                    name: 'optionSort',
                                                    id: 'optionSort',
                                                    label: '排序',
                                                    cls: 'input-xxlarge'
                                                }
                                            ]
                                        };
                                        var form = modal.$body.orangeForm(formOpts);
                                        form.loadRemote(App.href + "/api/core/scoreItemOption/load/" + d.id);
                                        modal.show();
                                    }
                                },
                                {
                                    text: "删除",
                                    cls: "btn-danger btn-sm",
                                    handle: function (index, d, grid) {
                                        bootbox.confirm("确定该操作?", function (result) {
                                            if (result) {
                                                var requestUrl = App.href + "/api/core/scoreItemOption/delete";
                                                $.ajax({
                                                    type: "GET",
                                                    dataType: "json",
                                                    data: {
                                                        id: d.id
                                                    },
                                                    url: requestUrl,
                                                    success: function (data) {
                                                        if (data.code === 200) {
                                                            itemGrid.reload();
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
                           /* tools: [
                                {
                                    text: "添加选项",
                                    cls: "btn btn-primary",
                                    icon: "fa fa-plus",
                                    handle: function (grid) {
                                        var itemModal = $.orangeModal({
                                            id: "add_sub_modal",
                                            title: "添加选项",
                                            destroy: true
                                        }).show();
                                        var formOpts = {
                                            id: "add_form",
                                            name: "add_form",
                                            method: "POST",
                                            action: App.href + "/api/core/scoreItemOption/insert",
                                            ajaxSubmit: true,
                                            rowEleNum: 1,
                                            ajaxSuccess: function () {
                                                itemModal.hide();
                                                itemGrid.reload();
                                            },
                                            submitText: "保存",//保存按钮的文本
                                            showReset: true,//是否显示重置按钮
                                            resetText: "重置",//重置按钮文本
                                            isValidate: true,//开启验证
                                            buttons: [{
                                                type: 'button',
                                                text: '关闭',
                                                handle: function () {
                                                    itemModal.hide();
                                                    itemGrid.reload();
                                                }
                                            }],
                                            buttonsAlign: "center",
                                            items: [
                                                {
                                                    type: 'hidden',
                                                    name: 'itemId',
                                                    id: 'itemId',
                                                    value: itemId
                                                }, {
                                                    type: 'text',
                                                    name: 'optionTitle',
                                                    id: 'optionTitle',
                                                    label: '选项文本',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入选项文本"
                                                    }
                                                }, {
                                                    type: 'text',
                                                    name: 'optionRate',
                                                    id: 'optionRate',
                                                    label: '选项系数',
                                                    cls: 'input-xxlarge',
                                                    rule: {
                                                        required: true
                                                    },
                                                    message: {
                                                        required: "请输入选项系数"
                                                    }
                                                }, {
                                                    type: 'textarea',
                                                    name: 'optionDesc',
                                                    id: 'optionDesc',
                                                    label: '描述',
                                                    cls: 'input-xxlarge'
                                                }, {
                                                    type: 'text',
                                                    name: 'optionSort',
                                                    id: 'optionSort',
                                                    label: '排序',
                                                    cls: 'input-xxlarge'
                                                }
                                            ]
                                        };
                                        itemModal.$body.orangeForm(formOpts);
                                    }
                                }
                            ]*/
                        });
                    }
                },
				{
                    text: "管理",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal2 = $.orangeModal({
                            id: "scoreItemForm",
                            title: "添加或修改指标说明，修改上传文件",
                            destroy: true
                        });
                        var formOpts2 = {
                            id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/core/scoreItem/update",
                            ajaxSubmit: true,
                            ajaxSuccess: function () {
                                modal2.hide();
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
                                    modal2.hide();
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
                                {
                                    type: 'hidden',
                                    name: 'id',
                                    id: 'id'
                                },{
                                    type: 'radioGroup',
                                    name: 'hideUploadFile',
									label: '上传附件',
                                    id: 'hideUploadFile',
									items:[{text:'隐藏',value:false},{text:'展示上传',value:true}]
                                },{
                                    type: 'textarea',
                                    name: 'info',
									label: '指标说明',
                                    id: 'info'
                                }
                            ]
                        };
                        var form2 = modal2.$body.orangeForm(formOpts2);
						form2.loadLocal(data);
						modal2.show();
					}
				}],
            tools: [
                {
                    text: " 添 加",
                    cls: "btn btn-primary",
                    icon: "fa fa-plus",
                    handle: function (grid) {
						if(currentIndex){
							
						}else{
							bootbox.alert("请先选择指标!");
							return;
						}
                        var modal = $.orangeModal({
                            id: "add_modal",
                            title: "添加",
                            destroy: true
                        }).show();
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/core/scoreItem/insert",
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
                                /*{
                                    type: 'tree',
                                    name: 'indexId',
                                    id: 'indexId',
                                    label: '指标',
                                    url: App.href + "/api/core/scoreIndex/treeNodes?sort_=sort_asc",
                                    expandAll: true,
                                    autoParam: ["id", "name", "pId"],
                                    chkStyle: "radio",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择指标"
                                    }
                                },*/{
                                    type: 'hidden',
                                    name: 'indexId',
                                    id: 'indexId',
									label: '指标'	
								},{
                                    type: 'display',
                                    name: 'indexTitle',
									label: '指标名称',
                                    id: 'indexTitle'
                                },{
                                    type: 'text',
                                    name: 'title',
                                    id: 'title',
                                    label: '题目名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入题目名称"
                                    }
                                }, {
                                    type: 'select',
                                    name: 'type',
                                    id: 'type',
                                    label: '选项类型',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入选项文本"
                                    },
                                    items: [
                                        {
                                            text: '填空[文本]',
                                            value: 0
                                        },
                                        {
                                            text: '单选',
                                            value: 1
                                        },
                                        {
                                            text: '多选',
                                            value: 2
                                        },
                                        {
                                            text: '填空[多]',
                                            value: 3
                                        },
                                        {
                                            text: '填空[数字]',
                                            value: 4
                                        },
										{
                                            text: '单选[可填空]',
                                            value: 5
                                        },
                                        {
                                            text: '单选[是否填空]',
                                            value: 8
                                        },
                                        {
                                            text: '多选[可填空]',
                                            value: 6
                                        },
                                        {
                                            text: '填空[自定义]',
                                            value: 7
                                        },
                                        {
                                            text: '数字[列举]',
                                            value: 9
                                        },
                                        {
                                            text: '文本框',
                                            value: 10
                                        }
                                    ]
                                }, {
                                    type: 'textarea',
                                    name: 'items',
                                    id: 'items',
                                    label: '自定义填空',
									placeholder:'[{type:text,placeholder:"请填写个数"}]',
                                    cls: 'input-xxlarge'
                                },{
                                    type: 'number',
                                    name: 'row',
                                    id: 'row',
									value:"0",
                                    label: '生成行数',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入行数"
                                    }
                                },{
                                    type: 'radioGroup',
                                    name: 'hideBtn',
                                    id: 'hideBtn',
                                    label: '隐藏添加按钮',
                                    items:[{text:'隐藏',value:'true'},{text:'不隐藏',value:'false',checked:'true'}]
                                }, {
                                    type: 'select',
                                    name: 'showLevel',
                                    id: 'showLevel',
                                    label: '展示等级',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入选项文本"
                                    },
                                    items: [
                                    ],
									itemsUrl:App.href +"/api/core/dict/getItems?code=YHLX"
                                }, {
                                    type: 'select',
                                    name: 'scoreType',
                                    id: 'scoreType',
                                    label: '评分类型',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入评分类型"
                                    },
                                    items: [
                                        {
                                            text: '统计项（不评分）',
                                            value: 1
                                        },
                                        {
                                            text: '线性评分项',
                                            value: 2
                                        },
                                        {
                                            text: '专家评分项',
                                            value: 3
                                        },
                                        {
                                            text: '其他评分项',
                                            value: 4
                                        }
                                    ]
                                }, {
                                    type: 'textarea',
                                    name: 'optionLogic',
                                    id: 'optionLogic',
                                    label: '评分逻辑',
                                    cls: 'input-xxlarge'
                                },{
                                    type: 'textarea',
                                    name: 'optionLogicDesc',
                                    id: 'optionLogicDesc',
                                    label: '评分逻辑描述',
                                    cls: 'input-xxlarge'
                                }, {
                                    type: 'number',
                                    name: 'score',
                                    id: 'score',
                                    label: '题目分值',
                                    value: '0',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入分值"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'placeholder',
                                    id: 'placeholder',
                                    label: '输入框提示',
                                    cls: 'input-xxlarge'
                                }, 
                                {
                                    type: 'select2',
                                    name: 'responsibleDepartment',
                                    id: 'responsibleDepartment',
                                    label: '责任部门',
                                    cls: 'input-xxlarge',
                                    items:[],
                                    itemsUrl: App.href +"/api/core/dict/getItems?code=ZZBM"
                                },
                                {
                                    type: 'textarea',
                                    name: 'relatedField',
                                    id: 'relatedField',
                                    label: '导出配置',
                                    cls: 'input-xxlarge'
                                    
                                    //itemsUrl: App.href +"/api/core/dict/getItems?code=ZYLY"
                                },
                                {
                                    type: 'number',
                                    name: 'sort',
                                    id: 'sort',
                                    label: '排序',
                                    cls: 'input-xxlarge'
                                }
                            ]
                        };
                       var form =  modal.$body.orangeForm(formOpts,function(){
							var AddFrom = this.$form;
							var hideBtn = AddFrom.find('div[formele="radioGroup"]').parent().parent().parent();
							var row = AddFrom.find("#row").parent().parent().parent();
							var items = AddFrom.find("#items").parent().parent().parent();
							hideBtn.hide();
							row.hide();
							items.hide();
							AddFrom.find("#type").bind("change",function(){
								var selected = $(this).val();
								if(selected==3||selected==7||selected==8){
									hideBtn.show();
									row.show();
									if(selected==7||selected==8){
										items.show();
									}
								}else{
									hideBtn.hide();
									row.hide();
									items.hide();
								}
								if(selected==9){items.show();}else{}
							});
							
							var optionLogic = AddFrom.find("#optionLogic").parent().parent().parent();
							optionLogic.hide();
							AddFrom.find("#scoreType").bind("change",function(){
								var selected = $(this).val();
								if(selected==2){
									optionLogic.show();
								}else{
									optionLogic.hide();
								}
							});
						});
					   form.loadLocal({indexId:currentIndex,indexTitle:currentIndexTitle});
                    }
                }
            ],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [
                    {
                        type: "text",
                        label: "题目名称",
                        name: "title",
                        placeholder: "输入要搜索的题目名称"
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);

    };
})(jQuery, window, document);