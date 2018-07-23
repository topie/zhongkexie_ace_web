/**
 * Created by chenguojun on 8/29/16.
 */

(function ($, window, document, undefined) {
    var PaperView = function (element, options) {
        this._options = options;
        this.$element = $(element);
        var id = element.id;
        if (id === undefined || id == '') {
            id = "topie_paper_view_" + new Date().getTime();
            this.$element.attr("id", id);
        }
        this._elementId = id;
        this.load();
        this.init();
    };
	 var isArray = function (object) {
        return object && typeof object === 'object' &&
            Array == object.constructor;
    }
    PaperView.examples = [
        {
            "score": 1,
            "pid": 0,
            "id": 1,
            "title": "1",
            "type": "index",
            "items": [
                {
                    "score": 2,
                    "pid": 1,
                    "id": 2,
                    "title": "12",
                    "type": "index",
                    "items": [
                        {
                            "score": 121,
                            "pid": 2,
                            "id": 6,
                            "title": "121",
                            "type": "index",
                            "items": [
                                {
                                    "score": 1,
                                    "pid": 6,
                                    "id": 7,
                                    "title": "1211",
                                    "type": "index",
                                    "items": [
                                        {
                                            "id": 1,
                                            "itemType": 1,
                                            "items": [
                                                {
                                                    "id": 1,
                                                    "title": "是"
                                                },
                                                {
                                                    "id": 2,
                                                    "title": "否"
                                                }
                                            ],
                                            "score": 1,
                                            "title": "正确吗？",
                                            "type": "item"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "score": 13,
                    "pid": 1,
                    "id": 5,
                    "title": "13",
                    "type": "index",
                    "items": []
                }
            ]
        },
        {
            "score": 12,
            "pid": 0,
            "id": 3,
            "title": "2",
            "type": "index",
            "items": [
                {
                    "score": 122,
                    "pid": 3,
                    "id": 4,
                    "title": "21",
                    "type": "index",
                    "items": []
                }
            ]
        }
    ];
    PaperView.defaults = {
        title: '',
        data: [],
		itemActions:[],
		showSocre:false,
		showIndex:false,
		showType:false
    };
    PaperView.prototype = {
        load: function () {
        },
        init: function () {
            var that = this;
            var mainPanel = this.getPanel(this._options.title);
            that.$element.append(mainPanel);
            this.$main = mainPanel;
            if (this._options.data !== undefined && this._options.data.length > 0) {
				var index = 1;
                $.each(this._options.data, function (i, idx) {
					var hasItem = false;
					 $.each(idx.items, function (i, item) {
						if(item.showLevel>=App.currentUser.userType){
							hasItem = true ;
						}
					 });
					 if(hasItem){
						 var title = (that._options.showIndex?'[第'+index++ +'项]  ':'')+idx.parentIndexTitle;
						  var r = that.getRow(title);
							mainPanel.find('div.panel-body:eq(0)').append(r);
							that.renderSubRow(that, r, idx.items);
					 }
                });
            }
            /*this.$main.find("label.control-label").each(function (i, d) {
                $(this).text((i + 1) + "." + $(this).text());
            });*/
        },
        renderSubRow: function (that, row, items) {
            if (items != undefined && items.length > 0) {
                var its = [];
                $.each(items, function (i, item) {
					
					if(item.showLevel<App.currentUser.userType){
						return ;
				   }
                    var it = {};
					it.hideBtn = true;
					it.itemActions = that._options.itemActions;
                    it.name = item.id;
                    it.label = item.title;
                    it.score = item.score;
					it.labelData=item.id;
					it.readonly=true;
					it.placeholder = item.placeholder === undefined ? ""
                        : item.placeholder;
					if(that._options.showSocre){
						it.label = it.label+"（"+item.score+"分）";
					}
					if(that._options.showType){
						if(item.scoreType==3){
							it.label='(专家评分项)'+it.label;
							it.labelClass="zhuanjiapingfen Cscore";
						}else if(item.scoreType==2){
							it.label='(线性打分项)'+it.label;
							it.labelClass="xianxingpingfen Cscore";
						}else if(item.scoreType==1){
							it.label='(统计项)'+it.label;
							it.labelClass="tongjixiang Cscore";
						}
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
								if(!(customItems[index]["type"]=='text'||customItems[index]["type"]=='number'||customItems[index]["type"]=='textarea'||customItems[index]["type"]=='number_input')){
								
									customItems[index]["disabled"]=true;
								}
								if(customItems[index]["type"]=='select'||customItems[index]["type"]=='radioGroup'||customItems[index]["type"]=='checkbox'){
									 $.each(customItems[index].items, function (i, op) {
											op['disabled']=true;
									});
								}
								customItems[index]["rows"]=8;
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
								if(!(customItems[index]["type"]=='text'||customItems[index]["type"]=='number'||customItems[index]["type"]=='textarea'||customItems[index]["type"]=='number_input')){
									customItems[index]["disabled"]=true;
								}
								if(customItems[index]["type"]=='select'||customItems[index]["type"]=='radioGroup'||customItems[index]["type"]=='checkbox'){
									 $.each(customItems[index].items, function (i, op) {
											op['disabled']=true;
									});
								}
								customItems[index]["rows"]=8;
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
                    its.push(it);
                });
                var qi = that.getQi();
                row.find('div.panel-body:eq(0)').append(qi);
                var form = qi.find('div[role=qi]').orangeForm({
                    method: "POST",
                    action: "",
                    ajaxSubmit: true,
                    rowEleNum: 1,
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
        getPanel: function (title, theme) {
            if (theme === undefined)
                theme = 'default';
            var panelTmpl =
                '<div class="panel panel-' + theme + '" >' +
                '<div style="text-align: center" class="panel-heading">${title_}</div>' +
                '<div class="panel-body"></div>' +
                '</div>';
            return $.tmpl(panelTmpl, {
                "title_": title
            });
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
            this.$main.find('form').each(
                function () {
                    var ps = $(this).serialize().split('&');
                   // console.info(ps);
                    $.each(ps, function (ii, ppss) {
                        var pss = ppss.split('=');
                        if (pss.length == 2) {
                            var answer = {};
                            answer['itemId'] = pss[0];
                            answer['itemValue'] = pss[1];
                            answers.push(answer);
                        }
                    });

                }
            );
            return answers;
        },
			
		loadReals: function (reals,text) {
            var that = this;
            $.each(reals, function (i, an) {
                that.loadReal(an.itemId, an.answerReal,text);
            });
        },
		loadReal:function(name, value,text){
			if(text){
				
			}else{
				text='已标记为虚假';
			}
			var ele = this.$main.find("[name='" + name + "']");
			var label = ele.parents(".form-group").find(".control-label");
			if(value===false){
				label.after('<label class="realmarker" style="color:red">('+text+')</label>');
			}
		},
		loadScores: function (reals) {
            var that = this;
            $.each(reals, function (i, an) {
                that.loadScore(an.itemId, an.answerScore);
            });
        },
		loadScore:function(name, value){
			var ele = this.$main.find("[name='" + name + "']");
			var cl = ele.closest('.row[data-row]').find(".Cscore");
			cl.after('<label class="anserScore" style="color:blue">(得分：'+value+')</label>');
		},
		loadAnswer: function (ans) {
			 var that = this;
			$.each(ans, function (i, an) {
                that.loadValue(an.itemId, an.answerValue);
                that.loadValue("itemFile"+an.itemId, an.answerFile);
            });
			/*that.$main.find("textarea").each(function(ind,cont){
				$(cont).width("540");
			});*/

		},
		loadValue: function (name, value) {
            var ele = this.$main.find("[name='" + name + "']");
			if(ele.length>0){
				var form = ele.parents('div.panel-body:eq(0)').data("plugin");
				form.setValue(name, value);
			}
        },
        loadAnswers: function (ans) {
            var that = this;
            $.each(ans, function (i, an) {
                that.loadValue(an.itemId, an.answerValue);
            });
			var list = this.$main.find('div[formele="list"]');
			if(list.length>0){
				$.each(list,function(i,item){
					var ele = $(item).find('div[role="ele"]');
					var e_eles = ele.find('div[role="s-ele"]');
					if(e_eles.length<=0){//如果空则添加一个
						ele.append('<input drole="list" type="text" showicon="false" class="form-control " placeholder="">');
					}
				});
			}
			
			$.each(that.$element.find('input[type="text"]'),function(){
				console.log($(this).val());
				$(this).attr("title",$(this).val());
			});
        },
        loadValues: function (name, value) {
            var ele = this.$main.find("[name='" + name + "']");
            if (ele.is('input[type="radio"]')) {
				if(value==='other'){
					this.$main.find(
                    "input[type='radio'][name='" + name + "'][value='"
                    + value + "']").attr("checked", true).parent().addClass("selected_info");
				}else if(value.indexOf('other,')==-1){
					this.$main.find(
                    "input[type='radio'][name='" + name + "'][value='"
                    + value + "']").attr("checked", true).parent().addClass("selected_info");
				}else{
					this.$main.find(
                    "input[type='radio'][name='" + name + "'][value='other']").attr("checked", true).parent().addClass("selected_info");
						var that = this;
						var radioGroup = ele.parents("[class='radio-list']");
						var data = radioGroup.data("data");
						var value_arr = isArray(value) ? value : value.split(',');
					   //var span = data.span === undefined ? 12 : data.span;
						$.each(value_arr, function (i, id) {
							if(id==='other'){}
							else{
								var itemWrapper = $('<div class=""col-lg-12">' +
									'<div role="s-ele" class="col-lg-12 form-group input-group"></div>' +
									'</div>');
								var textTmpl = '<input drole="main" type="text" showicon=${showIcon_} id="${id_}" name="${name_}" value="${value_}" class="form-control ${cls_}" ${readonly_} ${disabled_} ${attribute_} placeholder="${placeholder_}">';
								var item = $.tmpl(textTmpl, {
									"id_": (data.id === undefined ? data.name : data.id),
									"name_": name,
									"value_":id,
									"showIcon_": data.showIcon === undefined ? false
										: data.showIcon,
									"placeholder_": (data.placeholder === undefined ? ""
										: data.placeholder),
									"cls_": data.cls === undefined ? ""
										: (data.icon !== undefined ? "" : data.cls),
									"readonly_": (data.readonly ? "readonly" : ""),
									"disabled_": (data.disabled ? "disabled" : ""),
									"attribute_": (data.attribute === undefined ? ""
										: data.attribute)
								});
								itemWrapper.find('[role="s-ele"]').append(item);
								radioGroup.parent().append(itemWrapper);
							}
						});
				}
            } else if (ele.is('input[type="checkbox"]')) {
                if (value != null) {
                    var values = value.split(",");
                    for (var i in values) {
                        this.$main.find(
                            "input[type='checkbox'][name='" + name
                            + "'][value='" + values[i] + "']")
                            .attr("checked", true).parent().addClass("selected_info");
                    }
					var that = this;
					var itemsValue = value.substring(value.indexOf("other,"));
						var checkboxGroup = ele.parents("[class='checkbox-list']");
						var data = checkboxGroup.data("data");
						var value_arr = isArray(itemsValue) ? itemsValue : itemsValue.split(',');
					   //var span = data.span === undefined ? 12 : data.span;
						$.each(value_arr, function (i, id) {
							if(id==='other'){}
							else{
								var itemWrapper = $('<div class=""col-lg-12">' +
									'<div role="s-ele" class="col-lg-12 form-group input-group"></div>' +
									'</div>');
								var textTmpl = '<input drole="main" type="text" showicon=${showIcon_} id="${id_}" name="${name_}" value="${value_}" class="form-control ${cls_}" ${readonly_} ${disabled_} ${attribute_} placeholder="${placeholder_}">';
								var item = $.tmpl(textTmpl, {
									"id_": (data.id === undefined ? data.name : data.id),
									"name_": name,
									"value_":id,
									"showIcon_": data.showIcon === undefined ? false
										: data.showIcon,
									"placeholder_": (data.placeholder === undefined ? ""
										: data.placeholder),
									"cls_": data.cls === undefined ? ""
										: (data.icon !== undefined ? "" : data.cls),
									"readonly_": (data.readonly ? "readonly" : ""),
									"disabled_": (data.disabled ? "disabled" : ""),
									"attribute_": (data.attribute === undefined ? ""
										: data.attribute)
								});
								itemWrapper.find('[role="s-ele"]').append(item);
								checkboxGroup.parent().append(itemWrapper);
							}
						});

                }
            } else if (ele.is('select')) {
                ele.val(value);
			}else if (ele.is('div')) {//type = list
				var that = this;
				var data = ele.data("data");
               var value_arr = isArray(value) ? value : value.split(',');
			   //var span = data.span === undefined ? 12 : data.span;
				$.each(value_arr, function (i, id) {
					var itemWrapper = $('<div class=""col-lg-12">' +
						'<div role="s-ele" class="col-lg-12 form-group input-group"></div>' +
						'</div>');
					var textTmpl = '<input drole="main" type="text" showicon=${showIcon_} id="${id_}" name="${name_}" value="${value_}" class="form-control ${cls_}" ${readonly_} ${disabled_} ${attribute_} placeholder="${placeholder_}">';
					var item = $.tmpl(textTmpl, {
						"id_": (data.id === undefined ? data.name : data.id),
						"name_": name,
						"value_":id,
						"showIcon_": data.showIcon === undefined ? false
							: data.showIcon,
						"placeholder_": (data.placeholder === undefined ? ""
							: data.placeholder),
						"cls_": data.cls === undefined ? ""
							: (data.icon !== undefined ? "" : data.cls),
						"readonly_": (data.readonly ? "readonly" : ""),
						"disabled_": (data.disabled ? "disabled" : ""),
						"attribute_": (data.attribute === undefined ? ""
							: data.attribute)
					});
					itemWrapper.find('[role="s-ele"]').append(item);
					ele.find('[role=ele]').append(itemWrapper);
						
				});
            } else {
                ele.val(value);
            }
            if (!$().uniform) {
                return;
            }
            var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");
            if (test.size() > 0) {
                test.each(function () {
                    $(this).show();
                    $(this).uniform();
                });
            }
        }
    };
	
    /**
     * jquery插件扩展 ===================================================
     */

    var getPaperView = function (options) {
        options = $.extend(true, {}, PaperView.defaults, options);
        var eles = [];
        this.each(function () {
            var self = this;
            var instance = new PaperView(self, options);
            eles.push(instance);
        });
        return eles[0];
    };

    $.fn.extend({
        'orangePaperView': getPaperView
    });
})(jQuery, window, document);
