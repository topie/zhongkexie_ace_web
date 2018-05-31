/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/task/appraise/page": "appraise"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.appraise = {
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

		{//添加样式
			var nod = document.createElement("style"); 
			var str = ".scoreLabelmgl20{!important;margin-left:50px;margin-right:-50px;}.itemLabel{font-size:20px;margin-bottom: 20px;}";
			nod.type="text/css";  
			if(nod.styleSheet){         //ie下  
				nod.styleSheet.cssText = str;  
			} else {  
				nod.innerHTML = str;       //或者写成 nod.appendChild(document.createTextNode(str))  
			}  
			document.getElementsByTagName("head")[0].appendChild(nod);  
		}//添加样式结束
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
			$("#grid").html('');
			$.ajax({url:App.href+"/api/score/appraise/userItems",
				data:{paperId:currentPaper},
				type:"GET",
				success:function(res){
					if(res.code==200){
						var items = res.data.items;
						var values = res.data.values;
						renderForm(items,values);
					}else{
						bootbox.alert(data.message);
					}
				},error:function(){alert("请求异常");}
			})
		}

		function renderForm(items,values){
			if(items.length==0){
				$("#grid").html('<h3>您没有可操作的任务</h3>');

				return;
			}
			var value = {};
			$.each(values,function(i,val){
				value[val.itemId+""]=val.itemValue;
			})
			var formItems = [];
			 $.each(items, function (ii, item) {
				            
				var it = {};
				it.name = item.id;
				it.label = item.title;// + "(" + item.score + "分)";
				it.labelClass="itemLabel";
				it.placeholder = item.placeholder==undefined?"":item.placeholder;
				if (item.type == 0) {
					it.type = 'text';
				} else if (item.type == 1) {
					it.type = 'radioGroup';
				} else if (item.type == 2) {
					it.type = 'checkboxGroup';
				} else if (item.type == 3) {
					it.type = 'list';
					it.span = 6;
					it.items = [
						{	placeholder:it.placeholder,
							type: 'text',
							name: item.id
						}
					]
				}else if (item.type == 7) {
					it.type = 'list';
					it.row = item.row;
					it.hideBtn = item.hideBtn;
					try{
						var customItems = JSON.parse(item.items);
						it.span = 8;
						$.each(customItems,function(index,cont){
							if(index==0){
								it.formInline = cont.formInline;
								if(it.formInline){
									if(cont.label){
										it.span=8;
									}
									it.span = 8;
								}
							}
							customItems[index]["name"]=item.id;
						});
						if(customItems.length==3){
							it.span = 9;
						}if(customItems.length==2){
							it.span = 7;
						}
						it.items = customItems;
					}catch(err){
						alert("解析json错误："+it.label);
					}
				}else if (item.type == 8) {
					it.type = 'radio_inputs';
					it.row = item.row;
					it.hideBtn = item.hideBtn;
					it.span = 8;
					$.each(item.items, function (i, op) {
						if(op.title=='是'||op.title=='有'){
							it.trigerValue=op.id;
						}
					});
					try{
						var customItems = JSON.parse(item.items);
						$.each(customItems,function(index,cont){
							if(index==0){
								it.formInline = cont.formInline;
								if(cont.relate===false)it.relate = false;
								if(cont.span){it.span = cont.span;}
							}
							customItems[index]["name"]=item.id;
						});
						it.customItems = customItems;
					}catch(err){
						alert("解析json错误："+it.label);
					}
				} else if (item.type == 4) {
					it.type = 'number';
					it.inline = true;
				}else if (item.type == 9) {
					it.type = 'number_input';
					it.span=6;
					try{
						var customItems = JSON.parse(item.items);
						$.each(customItems,function(index,cont){
							if(index==0){
								it.formInline = cont.formInline;
							}
							customItems[index]["name"]=item.id;

						});
						it.items = customItems;
					}catch(err){
						alert("解析json错误："+it.label);
					}
				} else if (item.type == 5) {
					it.type = 'radio_input';
					it.span = 6;
				} else if (item.type == 6) {
					it.type = 'checkbox_input';
					it.span = 6;
				} else if (item.type == 10) {
					it.type = 'textarea';
				}
				if (item.type == 1 || item.type == 2 || item.type == 5 || item.type == 6|| item.type == 8) {
					it.items = [];
					it.inline = true;
					$.each(item.items, function (i, op) {
						var option = {
							'text': op.title,
							'value': op.id
						};
						it.items.push(option);
					});
				}
				if (item.value != undefined && item.value != '') {
					it.value = item.value;
				}
				
				formItems.push(it);
			});
			var formOpts = {
                            id: "edit_form",
                            name: "edit_form",
                            method: "POST",
                            action: App.href + "/api/score/appraise/submit",
                            ajaxSubmit: true,
							ajaxContentType: "application/json",
                            ajaxSuccess: function (res) {
								if(res.code==200){
									bootbox.alert("保存成功");
								}else{
									bootbox.alert(res.message);
								}

                            },
							beforeSubmitFormatData:function(data){
								var answers = [];
								var tmpAs = {};
								var ps = data.split("&");
								$.each(ps, function (ii, ppss) {
									var pss = ppss.split('=');
									if (pss.length === 2) {
										if (tmpAs[pss[0] + ''] === undefined) {
											tmpAs[pss[0] + ''] = decodeURI(pss[1]);
										} else {
											tmpAs[pss[0] + ''] = tmpAs[pss[0] + ''] + "," +decodeURI( pss[1]);
										}
									}
								});
								$.each(tmpAs, function (i, d) {
									if (d != '') {
										var answer = {};
										answer['itemId'] = i;
										answer['itemValue'] = d;
										answers.push(answer);
									}
								});
								var das = {};
                                das['answers'] = answers;
                                das['paperId'] = 0;
                               
								return JSON.stringify(das);
							},
                            submitText: "保存",
							//showSubmit:false,
                            showReset: true,
                            resetText: "重置",
                            isValidate: false,
							labelInline:false,
                            buttonsAlign: "center",
                            items: formItems
                        };

		
			var form = $("#grid").orangeForm(formOpts);
			form.loadLocal(value);
		}
    }
})(jQuery, window, document);