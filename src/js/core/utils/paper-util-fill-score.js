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

					that._options.userId=data.userId;
				}
            });
			mainPanel.find(".panel-body").append('<div class="paperPanel"></div>')
            var prevBtn = $('<button type="button" class="btn btn btn-info">上一项</button>');
            var nextBtn = $('<button type="button" class="btn btn btn-success">下一项</button>');
            mainPanel.find('div.panel-footer:eq(0)').append(prevBtn);
            mainPanel.find('div.panel-footer:eq(0)').append(nextBtn);
            prevBtn.on("click", function () {
                if (that._options.prev !== undefined) {
                    that._options.prev(that);
                } else {
                    tab.prev();
                }
            });
            nextBtn.on("click", function () {
                if (that._options.next !== undefined) {
                    that._options.next(that);
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
                $.each(items, function (i, item) {
					if(item.showLevel<=App.currentUser.userType){
						return ;
				   }
                    var it = {};
					it.itemActions = that._options.itemActions;
                    it.name = item.id;
					it.hideBtn = true;
                    it.label = item.title;
                    it.score = item.score;
					it.readonly=true;
					it.disabled=true;
					it.placeholder = item.placeholder === undefined ? ""
                        : item.placeholder;
						if(item.scoreType==3){
							currentItems.push(item);
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
								readonly:true,
								disabled:true
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
							it.span = 8;
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
								customItems[index]["disabled"]=true;
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
					}else if (item.itemType == 8) {
						it.type = 'radio_inputs';
						it.row = item.row;
						it.span=8;
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
								customItems[index]["disabled"]=true;
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
					}else{
						it.label='(参考项)   '+it.label;
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
							body.append('<div class="col-md-8 formbody" style="border-right: dashed 2px #ca9d9d;"></div>');
							var right = $('<div class="col-md-4"></div>');
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
                    formBodyTmpl: getFormBodyTmpl,
					ajaxSuccess: function () {
                    },
                    showReset: false,
                    showSubmit: false,
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
				that.loadScore(an.itemId, an.answerScore);
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
