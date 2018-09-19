/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/task/task/taskInfo": "taskTaskInfo"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.taskTaskInfo = {
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
							'<div id="grid"><form id="mainForm"><div class="appform"></div><button type="button" id="subform">提交</button></form></div>' +
					   // '</div>' +
					'</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {
		var $body = $(".appform");

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
		$("#subform").bind("click",submitForm);
		
		function reRendPaper(){
			$body.html('');
			$.ajax({url:App.href+"/api/task/task/deptTask",
				data:{paperId:currentPaper},
				type:"GET",
				success:function(res){
					if(res.code==200){
						var items = res.data;
						renderForm(items);
					}else{
						bootbox.alert(data.message);
					}
				},error:function(){alert("请求异常");}
			})
		}
		function renderForm(items){
			if(items.length==0){
				$body.html('<h3>您没有可操作的任务</h3>');
				return;
			}
			var top=getTopIndex(items);
			$.each(top,function(index,item){
				if(item.hasChild==true){
					createParentTitle(item);
					var child = getChildIndex(items,item.id);
					$.each(child,function(ci,citem){
						createChild(citem);
					});
				}else{
					createParent(item);
				}
			})
		}
		
		function createParentTitle(item){
			$body.append('<h3 class="lighter block blue">'+item.taskName+'</h3>');
		}
		function createParent(item){
			$body.append('<h3 class="lighter block blue">'+item.taskName+'</h3>');
			createInput(item);
		}
		function createChild(item){
			$body.append('<h5 class="lighter block green">'+item.taskName+'</h5>');
			createInput(item);
		}
		function createInput(item){
			var b = $('<div></div>');
			$body.append(b);
			b.append(getInput({name:"weight_"+item.id}));
			b.append(getTextArea({name:"org_"+item.id}));

			b.append(getInput({name:"weight_"+item.id}));
			b.append(getTextArea({name:"org_"+item.id}));

			b.append(getInput({name:"weight_"+item.id}));
			b.append(getTextArea({name:"org_"+item.id}));

			b.append(getInput({name:"weight_"+item.id}));
			b.append(getTextArea({name:"org_"+item.id}));
		}
		function getInput(item){
			var e = $('<input name="'+item.name+'"/>');
			if(item.value!=undefined){
				e.val(item.value);
			}
			return e;
		}
		function getTextArea(item){
			var e = $('<textarea name="'+item.name+'"></textarea>');
			if(item.value!=undefined){
				e.val(item.value);
			}
			return e;
		}
		
		function getTopIndex(items){
			var top=[];
			$.each(items,function(i,item){
				if(item.parentId==0){
					top.push(item)
				}
			});
			return top;
		
		}
		function getChildIndex(items,parentId){
			var child=[];
			$.each(items,function(i,item){
				if(item.parentId==parentId){
					child.push(item)
				}
			});
			return child;
		}
		function submitForm(){
			bootbox.confirm("确认上报？",function(res){
				if(res){
					var jsondata = $("#mainForm").serialize();
					$.ajax({
						url:App.href+"/api/task/task/deptCommit",
						type:'POST',
						data:jsondata,
						success:function(res){
							if(res.code==200){
								bootbox.alert("操作成功！");
								
							}else{
								bootbox.alert(res.msg);
							}
						},
						error:function(){
							alert("请求错误");
						}
					})
				}
			});
		}
		
    }
})(jQuery, window, document);