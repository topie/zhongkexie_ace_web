/**
 * Created by chenguojun on 2017/2/10.
 */
(function ($, window, document, undefined) {
    var mapping = {
        "/api/task/task/taskCheck": "tasktaskCheck"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.tasktaskCheck = {
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
							'<div id="grid"><form id="mainForm"><div class="appform"></div></form></div>' +
							'<div class="form-actions center" style="border-top: 0px;padding: 0px 0px 0px;background: none;">'+
								'<button type="button" class="btn btn-sm btn-warning" id="subform" title="" >退回</button>'+
								'&nbsp;<button type="button" class="btn btn-sm btn-info" id="saveForm" title="" >保存</button>'+
								'&nbsp;<button type="button" class="btn btn-sm btn-primary" id="commitForm" title=""  >通过</button>&nbsp;'+
							'</div>'+
					   // '</div>' +
					'</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {
		var deptDict;
		var $body = $(".appform");
		var numIndex = ["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五"];
		var levelLabel = ["主要负责","承担部分任务","提供专家或派人参与","提供相关材料"];
		var taskIds=[];
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
		$("#saveForm").bind("click",submitForm);
		$("#subform").bind("click",back);
		$("#commitForm").bind("click",cmmit);
		
		function reRendPaper(){
			$body.html('');
			$.ajax({url:App.href+"/api/task/task/deptCheckTask",
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
				$("#saveForm").hide();
				$("#subform").hide();
				$("#commitForm").hide();
				return;
			}
			var top=getTopIndex(items);
			$.each(top,function(index,item){
				/*if(index==0){
					if(item.taskStatus=='0')
						$body.html('<h3>填报中</h3>');
					else if(item.taskStatus=='1'){
						$body.html('<h3>未审核</h3>');
						$('#subform').show();
						$('#commitForm').show();
					}
					else if(item.taskStatus=='2'){
						$body.html('<h3>审核已通过</h3>');
						$('#subform').show();
					}
					else if(item.taskStatus=='3')
						$body.html('<h3>审核退回</h3>');
					else
						$body.html('<h3>填报中</h3>');
				}*/
				createParentTitle(index,item);
				if(item.hasChild==true){
					var child = getChildIndex(items,item.id);
					$.each(child,function(ci,citem){
						createChild(ci,citem);
					});
				}else{
					createChild(0,item);
				}
			})
		}
		
		function createParentTitle(index,item){
			var status = '';
			if(item.taskStatus=='0')
				status = '<span class="blue">填报中</span>';
			else if(item.taskStatus=='1'){
				status = '<span class="green">未审核</span>';
			}
			else if(item.taskStatus=='2'){
				status = '<span>审核已通过</span>';
			}
			else if(item.taskStatus=='3')
				status = '<span class="yellow">审核退回</span>';
			else
				status = '<span class="green">填报中</span>';
			$body.append('<h3 class="header smaller lighter red">（'+status+'）'+numIndex[index]+'.'+item.taskName+'</h3>');
		}
		/*function createParent(item){
			$body.append('<h3 class="lighter block blue" style="margin-left: 40px;">'+item.taskName+'</h3>');
			createInput(item);
		}*/
		function createChild(ci,item){
			$body.append('<h4 class="lighter block green" style="margin-left: 40px;">'+(ci+1)+"."+item.taskName+'</h4>');
			createInput(item);
		}
		function createInput(item){
			var b = $('<div class="well" style="margin-left: 40px;"></div>');
			$body.append(b);
			for(var i=0;i<levelLabel.length;i++){
				var well = $('<div class="col-sm-2"></div>');
				var well1 = $('<div class="col-sm-2"></div>');
				var well2 = $('<div class="col-sm-7"></div>');
				well.append("<lable>"+levelLabel[i]+"</lable>");
				var value = '';
				var cw = '';
				try{
				//if(item.taskValue!=null)
					value=item.taskValue.split(',')[i];
				}catch(e){}
				try{
				//if(item.taskCweight!=null)
					cw=item.taskCweight.split(',')[i];
				}catch(e){}
				var readonly = false;
				if(item.taskStatus=='2'){
					readonly=true;
				}
				well1.append(getInput({name:"weight_"+item.id,value:cw,readonly:readonly}));
				well2.append(getTextArea({name:"org_"+item.id,value:value,readonly:readonly}));
				var row=$('<div class="row"><div>');
				row.append(well).append(well1).append(well2);
				b.append(row);
			}
			
		}
		function getInput(item){
			var readonly = "";
			if(item.readonly){
				readonly = 'readonly="readonly" ';
			}
			var e = $('<input name="'+item.name+'"'+readonly+' class="form-control" style="width:80%;" title="分数权重百分比0~100之间的数字" placeholder="分数权重百分比"/>');
			if(item.value!=undefined){
				e.val(item.value);
			}
			e.tooltip({});
			e.bind("keyup",function(){if(this.value=='')return;if(isNaN(this.value))this.value='';
				if(this.value>100||this.value<0){
					this.value=100;
				}
			});
			return e;
		}
		function getTextArea(item){
			var readonly = "";
			if(item.readonly){
				readonly = ' readonly="readonly" ';
			}
			var e = $('<textarea name="'+item.name+'" '+readonly+' class="form-control" style="width:100%;" rows="3" title="填写参与学会名称以“;”隔开" placeholder="填写参与学会名称以“;”隔开"></textarea>');
			if(item.value!=undefined){
				e.val(item.value);
			}
			return e;
		}
		
		function getTopIndex(items){
			var top=[];
			taskIds=[];
			$.each(items,function(i,item){
				if(item.parentId==0){
					top.push(item)
				}
				if(item.taskStatus==1){
					taskIds.push(item.id);
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
		function getDept(id){
			if(deptDict==undefined){
				$.ajax({
					async:false,
					url:App.href + "/api/sys/user/pageList?userType=2&pageSize=50",
					success:function(res){
						deptDict=res.data.data;
					}
				})
			}
			var s = '';
			var arr = id.split(',');
			for(var j=0;j<arr.length;j++){
				for(var i=0;i<deptDict.length;i++){
					if(deptDict[i].id==arr[j]){
						s+= ','+deptDict[i].displayName;
					}
				}
			}
			if(s.length>0){
				s = s.sbuString(1);
			}
			return s;
		
		}

		function submitForm(){
			bootbox.confirm("对修改的内容进行保存？",function(res){
				if(res){
					var jsondata = $("#mainForm").serialize();
					$.ajax({
						url:App.href+"/api/task/task/deptCommit",
						type:'POST',
						data:jsondata,
						success:function(res){
							if(res.code==200){
								bootbox.alert("操作成功！");
								reRendPaper();
								
							}else{
								bootbox.alert(res.message);
							}
						},
						error:function(){
							alert("请求错误");
						}
					})
					}
				});
				
		}
		function back(){
			bootbox.confirm("只对审核中的进行退回，退回后需填报员重新进行填写补充，确认操作？",function(res){
				if(res){
							
					var jsondata2 = {taskIds:taskIds.join(","),status:3};
					$.ajax({
						url:App.href+"/api/task/task/updateStatus",
						type:'POST',
						data:jsondata2,
						success:function(res){
							if(res.code==200){
								bootbox.alert("操作成功！");
								reRendPaper();
								
							}else{
								bootbox.alert(res.message);
							}
						},
						error:function(){
							alert("请求错误");
						}
					})
										
							
				}
			});
				
		}
		function cmmit(){
			bootbox.confirm("只对审核中的进行通过，通过后该数据将不能进行修改，确认通过？",function(res){
				if(res){
							
					var jsondata2 = {taskIds:taskIds.join(","),status:2};
					$.ajax({
						url:App.href+"/api/task/task/updateStatus",
						type:'POST',
						data:jsondata2,
						success:function(res){
							if(res.code==200){
								bootbox.alert("操作成功！");
								reRendPaper();
								
							}else{
								bootbox.alert(res.message);
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