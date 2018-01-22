/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/core/scorePaper/list": "scorePaper"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.scorePaper = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
               // '<div class="panel panel-default" >' +
               // '<div class="panel-heading">题库评价表管理</div>' +
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
        var options = {
            url: App.href + "/api/core/scorePaper/list",
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
                    title: "评价表名称",
                    field: "title",
                    sort: true
                }, {
                    title: "开始时间",
                    field: "begin",
                    sort: true
                }, {
                    title: "结束时间",
                    field: "end",
                    sort: true
                }, {
                    title: "审核状态",
                    field: "status",
                    format: function (num, data) {
						if (data.approveStatus == 0) {
                            return "新建";
                        }
                        else if (data.approveStatus == 1) {
                            return "审核中";
                        }
                        else if (data.approveStatus == 2) {
                            return "已通过";
                        }
                        else if(data.approveStatus==3){
                            return "已驳回";
                        }else{
							return '- -';
						}
                    },
                    sort: true
                }, {
                    title: "填报状态",
                    field: "status",
                    format: function (num, data) {
						if (data.status == 0) {
                            return "<span style='color:red;'>关闭</span>";
                        }
                        else if (data.status == 1) {
                            return "<span style='color:green'>填报中</span>";
                        }else{
							return '- -';
						}
                    }
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [{
                    text: "查看",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var paper = {};
                        var modal = $.orangeModal({
                            id: "scorePaperView",
                            title: "查看评价表",
                            destroy: true
                        }).show();
                        var js = JSON.parse(data.contentJson);
                        paper = modal.$body.orangePaperView(js);
                    }
                },
                {
                    text: "编辑",
                    cls: "btn-primary btn-sm",
					visible:function(index,data){
						 if (data.approveStatus == 1) {//审核中
                            return false;
                        }
						if (data.approveStatus == 2) {//审核通过
                            return false;
                        }
                        return true;
					},
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "scorePaperForm",
                            title: "编辑",
                            destroy: true
                        });
                        var formOpts = {
                            id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/core/scorePaper/update",
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
                                }, {
                                    type: 'text',
                                    name: 'title',
                                    id: 'title',
                                    label: '评价表名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入评价表名称"
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'begin',
                                    id: 'begin',
                                    label: '开始时间',
                                    cls: 'input-xlarge',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    },
                                    rule: {
                                        required: true,
										remote:{type:"GET",
										   url:App.href+"/api/core/util/dateEqual",             //servlet
										   data:{
											 start:function(){return $("#begin").val();},
											 end:function(){return $("#end").val();}
										   } 
										}
                                    },
                                    message: {
                                        required: "请选择开始时间",
										remote:"开始时间不能大于结束时间"
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'end',
                                    id: 'end',
                                    label: '结束时间',
                                    cls: 'input-xlarge',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    },
                                    rule: {
                                        required: true,
										remote:{type:"GET",
										   url:App.href+"/api/core/util/dateEqual",             //servlet
										   data:{
											 start:function(){return $("#begin").val();},
											 end:function(){return $("#end").val();}
										   } 
										}
                                    },
                                    message: {
                                        required: "请选择结束时间",
										remote:"结束时间不能小于开始时间"
                                    }
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts);
                        form.loadRemote(App.href + "/api/core/scorePaper/load/" + data.id);
                        modal.show();
                    }
                }, {
                    text: "删除",
					visible:function(index,data){
						 if (data.approveStatus == 1) {//审核中
                            return false;
                        }
						if (data.approveStatus == 2) {//审核通过
                            return false;
                        }
                        return true;
					},
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/core/scorePaper/delete";
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
                    text: "提交",
                    cls: "btn-info btn-sm",
					visible:function(index,data){
						 if (data.approveStatus == 1) {//审核中
                            return false;
                        }
						if (data.approveStatus == 2) {//审核通过
                            return false;
                        }
                        return true;
					},
                    handle: function (index, data) {
                        bootbox.confirm("提交审核后不能修改，确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/core/scorePaper/check";
								$.ajax({
									type: "GET",
									dataType: "json",
									data: {
										id: data.id,
										result: 1
									},
									url: requestUrl,
									success: function (data) {
										if (data.code === 200) {
											grid.reload();
											bootbox.alert("提交成功请通知审核员进行审核！");
										} else {
											bootbox.alert(data.message);
										}
									},
									error: function (e) {
										alert("请求异常。");
									}
								});
                            }
                        });
                    }
                },
					{
                    text: "复制",
                    cls: "btn-warning btn-sm",
                    handle: function (index, data) {
                    	var title = "复制“"+data.title+"”生成新评价表";
						var paperId = data.id;
						var modal = $.orangeModal({
                            id: "copy_modal",
                            title: title,
                            destroy: true
                        }).show();
                        var formOpts = {
                            id: "copy_form",
                            name: "copy_form",
                            method: "POST",
                            action: App.href + "/api/core/scorePaper/insert",
                            ajaxSubmit: true,
                            rowEleNum: 1,
                            ajaxSuccess: function () {
                                modal.hide();
                                grid.reload();
                            },
                            submitText: "复制保存",//保存按钮的文本
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
                                    name: 'copyPaperId',
                                    id: 'copyPaperId',
                                    label: '复制评价表ID',
                                    cls: 'input-xxlarge',
									value:paperId
                                },{
                                    type: 'display',
                                    label: '复制评价表',
                                    cls: 'input-xxlarge',
									html:data.title
                                },{
                                    type: 'text',
                                    name: 'title',
                                    id: 'title',
                                    label: '新评价表名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入评价表名称"
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'begin',
                                    id: 'begin',
                                    label: '开始时间',
                                    cls: 'input-xlarge',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    },
                                    rule: {
                                        required: true,
										remote:{type:"GET",
										   url:App.href+"/api/core/util/dateEqual",             //servlet
										   data:{
											 start:function(){return $("#begin").val();},
											 end:function(){return $("#end").val();}
										   } 
										}
                                    },
                                    message: {
                                        required: "请选择开始时间",
										remote:"开始时间不能大于结束时间"
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'end',
                                    id: 'end',
                                    label: '结束时间',
                                    cls: 'input-xlarge',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    },
                                    rule: {
                                        required: true,
										remote:{type:"GET",
										   url:App.href+"/api/core/util/dateEqual",             //servlet
										   data:{
											 start:function(){return $("#begin").val();},
											 end:function(){return $("#end").val();}
										   } 
										}
                                    },
                                    message: {
                                        required: "请选择结束时间",
										remote:"结束时间不能小于开始时间"
                                    }
                                }
                            ]
                        };
                        modal.$body.orangeForm(formOpts);
                    }
                }
				,{
                    text: "导入",
					visible:function(index,data){
						 if (data.approveStatus == 1) {//审核中
                            return false;
                        }
						if (data.approveStatus == 2) {//审核通过
                            return false;
                        }
                        return true;
					},
                    cls: "btn-info btn-sm",
                    handle: function (index, data) {
                    	var modal = $.orangeModal({
                            id: "scorePaperIPForm",
                            title: "导入指标",
                            destroy: true
                        });
                        var formOpts = {
                            id: "ip_form",
                            name: "ip_form",
                            method: "POST",
                            action: App.href + "/api/core/importConf/import",
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
                                    type: 'select',
                                    name: 'id',
                                    id: 'id',
                                    label: '导入配置',
                                    cls: 'input-xlarge',
									itemsUrl:App.href + '/api/core/importConf/getOptions',
									items:[],
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择一个配置"
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
                }
				,
					{
                    text: "刷新缓存",
                    cls: "btn-warning btn-sm",
					visible:function(index,data){
						 if (data.status == 1) {
                           // return false;
                        }
                        return true;
					},
                    handle: function (index, data) {
                    	$.ajax({
							url:App.href + "/api/core/scorePaper/update",
							type:"POST",
							data:{id:data.id,title:data.title},
							success:function(res){
								if(res.code==200){
									grid.reload();
									bootbox.alert("刷新成功!");
								}else{
									alert(res.message);
								}
							},
							error:function(status){
								alert("操作异常");
							}
						});
                    }
                }/*, {
                    text: "做题",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var paper = {};
                        var modal = $.orangeModal({
                            id: "scorePaperView",
                            title: "做题",
                            destroy: true,
                            buttons: [
                                {
                                    type: 'button',
                                    text: '提交',
                                    cls: "btn btn-primary",
                                    handle: function (m) {
                                        var das = {};
                                        var as = paper.getAnswer();
                                        das['answers'] = as;
                                        das['paperId'] = data.id;
                                        $.ajax({
                                            type: "POST",
                                            dataType: "json",
                                            contentType: "application/json",
                                            data: JSON.stringify(das),
                                            url: App.href + "/api/core/scorePaper/submit",
                                            success: function (data) {

                                            },
                                            error: function (e) {
                                                alert("请求异常。");
                                            }
                                        });
                                    }
                                }
                            ]
                        }).show();
                        var js = JSON.parse(data.contentJson);
                        paper = modal.$body.orangePaperView(js);
                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            data: {
                                paperId: data.id
                            },
                            url: App.href + "/api/core/scorePaper/getAnswer",
                            success: function (data) {
                                if (data.code === 200) {

                                } else {
                                    alert(data.message);
                                }
                            },
                            error: function (e) {
                                alert("请求异常。");
                            }
                        });
                    }
                }*/
            ],
            tools: [
                {
                    text: " 添 加",
                    cls: "btn btn-primary",
                    icon: "fa fa-plus",
                    handle: function (grid) {
                        var modal = $.orangeModal({
                            id: "add_modal",
                            title: "添加",
                            destroy: true
                        }).show();
                        var formOpts = {
                            id: "add_form",
                            name: "add_form",
                            method: "POST",
                            action: App.href + "/api/core/scorePaper/insert",
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
                                    type: 'text',
                                    name: 'title',
                                    id: 'title',
                                    label: '评价表名称',
                                    cls: 'input-xxlarge',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入评价表名称"
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'begin',
                                    id: 'begin',
                                    label: '开始时间',
                                    cls: 'input-xlarge',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    },
                                    rule: {
                                        required: true,
										remote:{type:"GET",
										   url:App.href+"/api/core/util/dateEqual",             //servlet
										   data:{
											 start:function(){return $("#begin").val();},
											 end:function(){return $("#end").val();}
										   } 
										}
                                    },
                                    message: {
                                        required: "请选择开始时间",
										remote:"开始时间不能大于结束时间"
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'end',
                                    id: 'end',
                                    label: '结束时间',
                                    cls: 'input-xlarge',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    },
                                    rule: {
                                        required: true,
										remote:{type:"GET",
										   url:App.href+"/api/core/util/dateEqual",             //servlet
										   data:{
											 start:function(){return $("#begin").val();},
											 end:function(){return $("#end").val();}
										   } 
										}
                                    },
                                    message: {
                                        required: "请选择结束时间",
										remote:"结束时间不能小于开始时间"
                                    }
                                }
                            ]
                        };
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
                        label: "评价表名称",
                        name: "title",
                        placeholder: "输入要搜索的评价表名称"
                    }
                ]
            }
        };
        grid = window.App.content.find("#grid").orangeGrid(options);

    };
})(jQuery, window, document);
