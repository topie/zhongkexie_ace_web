/**
 * Created by chenguojun on 8/29/16.
 */

(function ($, window, document, undefined) {
    var PaperFillScore = function (element, options) {
        this._options = options;
        this.$element = $(element);
        var id = element.id;
        if (id === undefined || id == '') {
            id = "topie_paper_fill_score" + new Date().getTime();
            this.$element.attr("id", id);
        }
        this._elementId = id;
        this.load();
        this.init();
    };
    PaperFillScore.defaults = {
        title: '',
        data: [],
		tabTitles:[{"userName":"示例","userId":'4'}],
		paperId:1,
		userId:1,
		userIndex:0,
		showSocre:true
    };
    PaperFillScore.prototype = {
        load: function () {
        },
        init: function () {
            var that = this;
            var mainPanel = this.getPanel(this._options.title);
            that.$element.append(mainPanel);
            this.$main = mainPanel;
            var tabs = [];
            if (this._options.tabTitles !== undefined && this._options.tabTitles.length > 0) {
				
					var itemIndex = 1;
                $.each(this._options.tabTitles, function (i, idx) {
							var tab = {};
							var ind = itemIndex;
							tab['title'] = idx.userName;
							if(idx.approveStatus==1){
								tab['title'] = '<i class="ace-icon fa fa-check"></i>'+idx.userName;
							}
							tab['width'] = '87px';
							tab['data'] = idx;
							tab['content'] = {html:''};
							tabs.push(tab);
							itemIndex++;
							if(idx.userId==that._options.userId){
								that._options.userIndex = itemIndex-2;
							}
                });
            }
            tabs[0].active = true;
            var tab = mainPanel.find('div.panel-body:eq(0)').orangeTab({
                hideOtherTab: false,
                page: {
                    show: true,
                    size: 10
                },
                lazy: false,
                tabs: tabs,
				callback:function(li,data){
					that.$main.find(".paperPanel").html("");
					that.$main.find(".paperPanel").append(that.renderSubTab(that._options.data));
					var dept = "专家评价-"+data.userName;
					$("#scorePaperViewtitle").html(dept);
					that.$main.find("label.expert-score").each(function(ele){
						$(this).html($(this).html().replace(/专家评分项/g, '<font style="background-color: #e61c25;border-radius:8px;padding: 0px 6px;color: white;">$&</font>'));
					});
					that.$main.find("label.normal-score").each(function(ele){
						$(this).html($(this).html().replace(/参考项/g, '<font style="background-color:#ccc;border-radius:8px;padding: 0px 6px;color: white;">$&</font>'));
					});
					$.ajax({
						type: "POST",
						dataType: "json",
						data: {
							paperId: that._options.paperId,
							userId:data.userId
						},
						url: App.href + "/api/core/scorePaper/getAnswer",
						success: function (res) {
							if (res.code === 200) {
								that.loadAnswer(res.data,function(an){
										var url =App.href + "/api/core/scorePaper/getAnswerOfRanking";
										var msg = an.answerValue;
											$.ajax({
													type: "POST",
													dataType: "json",
													async:false,
													data: {
														itemId:an.itemId,
														answer:an.answerValue
													},
													url: url,
													success: function (result) {
														if (result.code === 200) {
															msg = "<font style='color:#f00;margin-left:10px;' >"+result.message+"</font>";
														} else {
															bootbox.alert(result.message);
														}
													},
													error: function (e) {
														alert("请求异常。");
													}
												});
											return msg;
									});
							} else {
								alert(res.message);
							}
						},
						error: function (e) {
							alert("请求异常。");
						}
					});
					$.ajax({
						type: "POST",
						dataType: "json",
						data: {
							paperId: that._options.paperId,
							userId:data.userId
						},
						url: App.href + "/api/core/scorePaper/getExperScore",
						success: function (res) {
							if (res.code === 200) {
								that.loadScores(res.data);
							} else {
								alert(res.message);
							}
						},
						error: function (e) {
							alert("请求异常。");
						}
					});
					that._options.userId=data.userId;
				}
				
            });
			mainPanel.find(".panel-body").append('<div class="paperPanel"></div>')
            var prevBtn = $('<button type="button" class="btn btn btn-info">上一项</button>');
            var nextBtn = $('<button type="button" class="btn btn btn-success">下一项</button>');
            var finishBtn = $('<button type="button" class="btn btn btn-success commit">完成该学会评分</button>');
            mainPanel.find('div.panel-footer:eq(0)').append(prevBtn);
            mainPanel.find('div.panel-footer:eq(0)').append(nextBtn);
            mainPanel.find('div.panel-footer:eq(0)').append(finishBtn);
            prevBtn.on("click", function () {
				var $this = $(this);
                if (that._options.prev !== undefined) {
                    that._options.prev(that,$this);
                } else {
                    tab.prev();
                }
            });
            nextBtn.on("click", function () {
				var $this = $(this);
                if (that._options.next !== undefined) {
                    that._options.next(that,$this);
                } else {
                    tab.next();
                }
            });
			finishBtn.on("click", function () {
				var $this = $(this);
                if (that._options.finish !== undefined) {
                    that._options.finish(that,$this);
                } else {
                    tab.next();
                }
            });
            this.$tab = tab;
           /* this.$main.find('form').each(
                function () {
                    $(this).find('input').on("change", function () {
                        that.showCheck();
                    });
                }
            );*/
        },
		renderSubTab: function () {
            var that = this;
            var mainPanel = $('<div></div>');
            if (this._options.data !== undefined && this._options.data.length > 0) {
                $.each(this._options.data, function (i, idx) {
					var hasItem = false;
					 $.each(idx.items, function (i, item) {
						if(item.showLevel>=App.currentUser.userType){
							hasItem = true ;
						}
					 });
					 if(hasItem){
						var r = that.getRow(idx.parentIndexTitle);
						mainPanel.append(r);
						that.renderSubRow(that, r, idx.items);
					 }
                });
            }
			return mainPanel;
            /*this.$main.find("label.control-label").each(function (i, d) {
                $(this).text((i + 1) + "." + $(this).text());
            });*/
        },
        renderSubRow: function (that, row, items) {
            if (items != undefined && items.length > 0) {
                var its = [];
				var currentItems = [];
				items.sort(function(a,b){//排序专家评价放前面
					if(a.scoreType=='3')return 0;
					if(b.scoreType=='3')return 1;
					return 0;
				});
                $.each(items, function (i, item) {
					if(item.showLevel<=App.currentUser.userType){
						return ;
				   }
                    var it = {};
					it.itemActions = that._options.itemActions;
                    it.name = item.id;
                    it.id = item.id;
					it.hideBtn = true;
                    it.label = item.title;
                    it.score = item.score;
					it.readonly=true;
					//it.disabled=true;
					it.placeholder = item.placeholder === undefined ? ""
                        : item.placeholder;
						if(item.scoreType==3){
							it.optionLogicDesc = item.optionLogicDesc;
							//currentItems.push(item);
							it.right=function(currentItem){
								//currentItem.optionLogicDesc='1.信息化建设成效显著，日常办公、会员管理、学术交流、决策咨询、科普宣传等主要业务都实现了信息化，“一站两微一端”平台完善，信息更新及时、关注度高，基本实现了“数字学会”“互联网+学会”；得分80%-100%;</br>2.信息化建设取得一定成效，主要业务3项以上实现了信息化，建立了“一站两微一端”宣传平台，但在使用率、关注度方面有待提高。得分50%-80%；</br>3.信息化建设落后，较少使用信息化手段开展工作，进行宣传。主要业务2项及以下实现了信息化，“一站两微一端”平台不完善，使用率低。得分0%-50%。</br>联系方式：学会部改革处 68581366 王立波';
								var  subs = $('<div class="form-group">'
									+'请对专家评分项进行评分：'
									+'</div><div class="form-group">'
									+'<input drole="main" type="text" showicon="false" name="itemId_'+currentItem.id+'" class="form-control " placeholder=" [数字]  ">'
									+'</div><div class="form-group">'
									+'<button type="button" class="btn btn-info btn-sm" data-item="'+currentItem.id
									+'">评分</button><i class="ace-icon fa fa-info-circle" data-trigger="hover" data-placement="bottom" style="color:#6fb3e0;font-size: 18px;" title="评分标准" data-content="'+currentItem.optionLogicDesc+'">评分标准</i>'
									+'</div>');//<div class="form-group">'+currentItem.optionLogicDesc
									//+'</div>');
								subs.find('i').popover({html:true});
								subs.find('button[data-item="'+currentItem.id+'"]').data("info",currentItem);
								subs.on("click",'button[data-item="'+currentItem.id+'"]',function(){
									var currentItem = $(this).data("info");
									var value = $('input[name="itemId_'+currentItem.id+'"]').val();
									if(isNaN(value)||value==null||value==''){
										bootbox.alert("请输入数字");
										$('input[name="itemId_'+currentItem.id+'"]').val('');
										return false;
									}
									if(parseFloat(value)>currentItem.score){
										bootbox.alert("输入不能超过满分！满分为"+currentItem.score+"分!");
										$('input[name="itemId_'+currentItem.id+'"]').val('');
										return false;
									}
									if(parseInt(value)<0){
										bootbox.alert("输入分数不能为负分！");
										$('input[name="itemId_'+currentItem.id+'"]').val('');
										return false;
									}
									$.ajax({
											type: "POST",
											dataType: "json",
											data: {
												paperId: that._options.paperId,
												userId:that._options.userId,
												itemId:currentItem.id,
												answerScore:value
											},
											url: App.href + "/api/core/scorePaper/updateAnswerScore",
											success: function (data) {
												if (data.code === 200) {
													bootbox.alert("评分成功！");
												} else {
													bootbox.alert(data.message);
												}
											},
											error: function (e) {
												alert("请求异常。");
											}
										});

								});
								return subs;
							}
						}
						if(that._options.showSocre){
						it.label = item.title+"（"+item.score+"分）";
					}
                    if (item.itemType == 0) {
                        it.type = 'text';
                    } else if (item.itemType == 1) {
                        it.type = 'radioGroup';
                    } else if (item.itemType == 2) {
                        it.type = 'checkboxGroup';
                    } else if (item.itemType == 3) {
                        it.type = 'list';
						it.span = 6;
						it.items = [
							{
								type: 'text',
								name: item.id,
								readonly:true
							}
						]
                    } else if (item.itemType == 4) {
                        it.type = 'number';
                    }
					 else if (item.itemType == 5) {
                        it.type = 'radio_input';
                    }
					 else if (item.itemType == 6) {
                        it.type = 'checkbox_input';
                    }else if (item.itemType == 7) {
						it.type = 'list';
						it.row = item.row;
						try{
							var customItems = JSON.parse(item.customItems);
							it.span = 11;
							$.each(customItems,function(index,cont){
								if(index==0){
									it.formInline = cont.formInline;
									if(it.formInline){
										if(cont.label){
											it.span=12;
										}
										it.span = 8;
									}
								}
								customItems[index]["name"]=item.id;
								customItems[index]["readonly"]=true;
								if(!(customItems[index]["type"]=='text'||customItems[index]["type"]=='number'||customItems[index]["type"]=='number_input'||customItems[index]["type"]=='textarea')){
									customItems[index]["disabled"]=true;
								}
								if(customItems[index]["type"]=='select'||customItems[index]["type"]=='radioGroup'||customItems[index]["type"]=='checkbox'){
									 $.each(customItems[index].items, function (i, op) {
											op['disabled']=true;
									});
								}
								customItems[index]["rows"]=8;
							});
							it.items = customItems;
						}catch(err){
							alert("解析json错误："+it.label);
						}
					}else if (item.itemType == 8) {
						it.type = 'radio_inputs';
						it.row = item.row;
						it.span=8;
						it.disabled=true;
						$.each(item.items, function (i, op) {
							if(op.title=='是'||op.title=='有'){
								it.trigerValue=op.id;
							}
						});
						try{
							var customItems = JSON.parse(item.customItems);
							$.each(customItems,function(index,cont){
								if(index==0){
									it.formInline = cont.formInline;
								}
								customItems[index]["name"]=item.id;
								customItems[index]["readonly"]=true;
								if(!(customItems[index]["type"]=='text'||customItems[index]["type"]=='number'||customItems[index]["type"]=='textarea'||customItems[index]["type"]=='number_input')){
									customItems[index]["disabled"]=true;
								}
								if(customItems[index]["type"]=='select'||customItems[index]["type"]=='radioGroup'||customItems[index]["type"]=='checkbox'){
									 $.each(customItems[index].items, function (i, op) {
											op['disabled']=true;
									});
								}
							});
							it.customItems = customItems;
						}catch(err){
							alert("解析json错误："+it.label);
						}
					}else if (item.itemType == 9) {
						it.type = 'number_input';
						it.span=8;
						try{
							var customItems = JSON.parse(item.customItems);
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
                     }else if (item.itemType == 10) {
                          it.type = 'textarea';
						  it.rows=8;
                     }
                    if (item.itemType ==1 || item.itemType==2|| item.itemType==5|| item.itemType==6|| item.itemType == 8) {
						it.inline=true;
                        it.items = [];
                        $.each(item.items, function (i, op) {
                            var option = {
                                'text': op.title,
                                'value': op.id,
								'disabled':true
                            };
                            it.items.push(option);
                        });
                    }
					if(item.itemType==5|| item.timeType==6){
						it.span = 6;
					}
                    if (item.value != undefined && item.value != '') {
                        it.value = item.value;
                    }

					if(item.scoreType==3){
						it.label='(专家评分项)   '+it.label;
						it.labelClass = 'expert-score';
					}else{
						it.label='(参考项)   '+it.label;
						it.labelClass = 'normal-score';
					}
                    its.push(it);
                });
				var subss = [];
				var getFormBodyTmpl;
				if(currentItems.length>0){
					for(var i =0;i<currentItems.length;i++){
						var currentItem = currentItems[i];
						var  subs = $('<div class="form-group">'
							+'请对专家评分项进行评分：'
							+'</div><div class="form-group">'
							+'<input drole="main" type="text" showicon="false" name="itemId_'+currentItem.id+'" class="form-control " placeholder=" [数字]  ">'
							+'</div><div class="form-group">'
							+'<button type="button" class="btn btn-info btn-sm" data-item="'+currentItem.id+'">评分</button>'
							+'</div>');
						subs.find('button[data-item="'+currentItem.id+'"]').data("info",currentItem);
						subs.on("click",'button[data-item="'+currentItem.id+'"]',function(){
							var currentItem = $(this).data("info");
							var value = $('input[name="itemId_'+currentItem.id+'"]').val();
							if(isNaN(value)||value==null||value==''){
								bootbox.alert("请输入数字");
								$('input[name="itemId_'+currentItem.id+'"]').val('');
								return false;
							}
							if(parseFloat(value)>currentItem.score){
								bootbox.alert("输入不能超过满分！满分为"+currentItem.score+"分!");
								$('input[name="itemId_'+currentItem.id+'"]').val('');
								return false;
							}
							if(parseInt(value)<0){
								bootbox.alert("输入分数不能为负分！");
								$('input[name="itemId_'+currentItem.id+'"]').val('');
								return false;
							}
							$.ajax({
									type: "POST",
									dataType: "json",
									data: {
										paperId: that._options.paperId,
										userId:that._options.userId,
										itemId:currentItem.id,
										answerScore:value
									},
									url: App.href + "/api/core/scorePaper/updateAnswerScore",
									success: function (data) {
										if (data.code === 200) {
											bootbox.alert("评分成功！");
										} else {
											bootbox.alert(data.message);
										}
									},
									error: function (e) {
										alert("请求异常。");
									}
								});

						});
						subss.push(subs);
					}
					getFormBodyTmpl =  function(){
						var body = $('<div style="margin-right: 0px;margin-left: 0px;" class="row"></div>');
							body.append('<div class="col-md-9 formbody" style="border-right: dashed 2px #ca9d9d;"></div>');
							var right = $('<div class="col-md-3"></div>');
							for(var i=0;i<subss.length;i++)
								right.append(subss[i]);
							body.append(right);
					   return body;
					}
				}
                var qi = that.getQi();
                row.find('div.panel-body:eq(0)').append(qi);
                var form = qi.find('div[role=qi]').orangeForm({
                    method: "POST",
                    action: "",
                    ajaxSubmit: true,
                    rowEleNum: 1,
					formWrapperTmpl:'<div class="col-md-${span_}">'
										+'<div class="col-md-9" style="border-right: dashed 2px #ca9d9d;">'
											+'<div class="form-group"></div>'
										+'</div>'
										+'<div class="col-md-3 right-ele"></div>'
									+'</div>',
                    //formBodyTmpl: getFormBodyTmpl,
					ajaxSuccess: function () {
                    },
                    showReset: false,
                    showSubmit: false,
					uploadFile:true,
					showUploadBtn:false,
					labelInline:false,
                    isValidate: true,
                    buttonsAlign: "center",
                    items: its
                });
				row.find('div.panel-body:eq(0)').data("plugin",form);
				
            }
        },
        getRow: function (title, theme) {
            if (theme === undefined)
                theme = 'default';
            var rowTmpl = '<div class="row"><div class="col-md-12 col-sm-12">' +
                '<div class="panel panel-' + theme + '" >' +
                '<div style="text-align: left" class="panel-heading">${title_}</div>' +
                '<div class="panel-body"></div>' +
                '</div>' +
                '</div></div>';
            return $.tmpl(rowTmpl, {"title_": title});
        },
        getQi: function () {
            return $('<div class="row"><div role="qi" class="col-md-12 col-sm-12"></div></div>');
        },
        getPanel: function (title, theme) {
            if (theme === undefined)
                theme = 'default';
            var panelTmpl =
                '<div class="panel panel-' + theme + '" >' +
                '<div style="text-align: center" class="panel-heading"><h3>${title_}</h3></div>' +
                '<div class="panel-body"></div>' +
                '<div class="panel-footer"></div>' +
                '</div>';
            return $.tmpl(panelTmpl, {
                "title_": title
            });
        },
        reload: function (options) {
            this.$element.empty();
            this._options = options;
            this.init();
        },
        getJson: function () {
            return this._options;
        },
        getAnswer: function () {
            var answers = [];
            var tmpAs = {};
            this.$main.find('form').each(
                function () {
                    var ps = $(this).serialize().split('&');
                    $.each(ps, function (ii, ppss) {
                        var pss = ppss.split('=');
                        if (pss.length == 2) {
                            if (tmpAs[pss[0] + ''] === undefined) {
                                tmpAs[pss[0] + ''] = decodeURI(pss[1]);
                            } else {
                                tmpAs[pss[0] + ''] = decodeURI(tmpAs[pss[0] + ''] + "," + pss[1]);
                            }
                        }
                    });

                }
            );
            $.each(tmpAs, function (i, d) {
                var answer = {};
                answer['itemId'] = i;
                answer['itemValue'] = d;
                answers.push(answer);
            });
            return answers;
        },
        getValidation: function () {
            //this.showCheck();
            var message = [];
            this.$main.find('li[role=tab]').find('a').each(function () {
                var that = $(this);
                if (that.find('i.fa-check').length === 0) {
                    message.push(
                        {
                            index: parseInt(that.parent('li').attr('role-index')),
                            text: that.text()
                        }
                    );
                }
            });
            return message;
        },
		loadScores:function(list){
			 var that = this;
			$.each(list, function (i, an) {
                that.loadScore(an.itemId, an.itemScore);
				//that.loadScore(an.itemId, an.answerScore);
            });
		},
		loadScore:function(name, value){
			//var ele = this.$main.find("[name='" + name + "']");
			//var label = ele.parents(".form-group").find(".control-label");
			//label.after('<label class="anserScore" style="color:blue">(得分：'+value+')</label>');
			var ele = this.$main.find("input[name='itemId_" + name + "']").val(value);;
		},
        loadAnswer: function (ans,callback) {
			 var that = this;
			$.each(ans, function (i, an) {
                that.loadValue(an.itemId, an.answerValue,an,callback);
                that.loadValue("itemFile"+an.itemId, an.answerFile);
				//that.loadScore(an.itemId, an.answerScore);
            });

		},
		loadValue: function (name, value,an,callback) {
            var ele = this.$main.find("[name='" + name + "']");
			if(ele.length>0){
				var form = ele.closest('div.panel-body').data("plugin");
				form.setValue(name, value);
				var ht=value;
				if (ele.is('input[type="radio"]')) {
					if(callback){
						ht = callback(an);
					}
					this.$main.find(
						"input[type='radio'][name='" + name + "'][value='"
						+ value + "']").parent().append("&nbsp;("+ ht+")");
				}
				if (ele.is('input[role="number"]')) {
					if(ele.length==1){
						if(callback){
							ht = callback(an);
						}
						this.$main.find(
							"input[role='number'][name='" + name + "'][value='"
							+ value + "']").parent().append("&nbsp;("+ ht+")");
					}
				}
			}
        },
        showCheck: function () {
            var that = this;
            that.$main.find('a').find('i.fa-check').remove();
            that.$main.find('form').each(
                function () {
                    var id = $(this).parent().parent().attr("id");
                    var ps = $(this).serialize().split('=');
                    if (ps.length > 0 && ps[1] !== '' && ps[1] != undefined) {//TODO 空字符串输入
                        that.$main.find('a[href="#' + id + '"]').append('<i class="fa fa-check btn-success"></i>');
                    }
                }
            );
        },
		go:function(index){
			if(index==undefined){
				index = this._options.userIndex;
			}
			
			this.$tab.go(index);
		},
        getCurrentTabAnswer: function () {
            var answers = [];
            var tmpAs = {};
            var f = this.$tab.currentDiv().find('form');
            var ps = f.serialize().split('&');
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
            return answers;
        }
    };

    /**
     * jquery插件扩展 ===================================================
     */

    var getPaperFillScore = function (options, extra) {
        options = $.extend(true, {}, PaperFillScore.defaults, options);
        if (extra != undefined) {
            options = $.extend(true, {}, options, extra);
        }
        var eles = [];
        this.each(function () {
            var self = this;
            var instance = new PaperFillScore(self, options);
            eles.push(instance);
        });
        return eles[0];
    };

    $.fn.extend({
        'orangePaperFillScore': getPaperFillScore
    });
})(jQuery, window, document);
