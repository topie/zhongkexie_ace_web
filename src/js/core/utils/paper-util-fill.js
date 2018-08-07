/**
 * Created by chenguojun on 8/29/16.
 */

(function ($, window, document, undefined) {
    var PaperFill = function (element, options) {
        this._options = options;
        this.$element = $(element);
        var id = element.id;
        if (id === undefined || id == '') {
            id = "topie_paper_fill_" + new Date().getTime();
            this.$element.attr("id", id);
        }
        this._elementId = id;
        this.load();
        this.init();
    };
    PaperFill.defaults = {
        title: '',
        data: []
    };
    PaperFill.prototype = {
        load: function () {
        },
        init: function () {
            var that = this;
            var mainPanel = this.getPanel(this._options.title);
            that.$element.append(mainPanel);
            this.$main = mainPanel;
            var tabs = [];
            if (this._options.data !== undefined && this._options.data.length > 0) {
				
					var itemIndex = 1;
                $.each(this._options.data, function (i, idx) {
					var formItems = [];
                    if (idx.items.length > 0) {
						var display = {
                                name: '',
                                id: '',
                                type: 'display',
                                label: '',
                                html: '<span>' + idx.parentIndexTitle + '</span>'
                            };
						formItems.push(display);
                        $.each(idx.items, function (ii, item) {
							if(item.showLevel<App.currentUser.userType){
								return ;
							}
                            
                            var it = {};
                            it.name = item.id;
                            //it.label = item.id+"__"+item.title;// + "(" + item.score + "分)";
							it.label = item.title;// + "(" + item.score + "分)";
							it.uploadFile=item.hideUploadFile;
							it.templateId = item.templateId;
							it.templateDesc = item.templateDesc;
							//it.labelTitle="";
							it.info=item.info;
							it.infoTitle="指标说明";
							it.placeholder = item.placeholder==undefined?"":item.placeholder;
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
                                    {	placeholder:it.placeholder,
                                        type: 'text',
                                        name: item.id
                                    }
                                ]
                            }else if (item.itemType == 7) {
                                it.type = 'list';
								it.row = item.row;
								it.hideBtn = item.hideBtn;
								try{
									var customItems = JSON.parse(item.customItems);
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
                            }else if (item.itemType == 8) {
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
									var customItems = JSON.parse(item.customItems);
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
                            } else if (item.itemType == 4) {
                                it.type = 'number';
                                it.inline = true;
                            }else if (item.itemType == 9) {
                                it.type = 'number_input';
								it.span=6;
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
                            } else if (item.itemType == 5) {
                                it.type = 'radio_input';
                                it.span = 6;
                            } else if (item.itemType == 6) {
                                it.type = 'checkbox_input';
                                it.span = 6;
                            } else if (item.itemType == 10) {
                                it.type = 'textarea';
                            }
                            if (item.itemType == 1 || item.itemType == 2 || item.itemType == 5 || item.itemType == 6|| item.itemType == 8) {
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
						if(formItems.length>1){
							var tab = {};
							tab['title'] = '第' + itemIndex + '项';
							tab['width'] = '87px';
							tab['content'] = {
								plugin: 'form',
								options: {
									method: "POST",
									action: "",
									ajaxSubmit: true,
									rowEleNum: 1,
									uploadFile: true,
									uploadFun:function($input,formPlug){
										var items = [];
										var tempId = $input.attr('data-templateId');
										var tempDesc = $input.attr('data-templateDesc');
										if(tempId==''||tempId==undefined||tempId=='null'||isNaN(tempId)){
											items.push({
												type: 'display',
												name: 'id',
												id: 'id',
												html:'可上传图片，文档，视频等证明材料'
											});
										}else{
											items.push({
												type: 'download',
												templateId:tempId,
												//downloadUrl: App.href+"/api/common/download?id="+tempId,
												//templateName: tempDesc,
												id: 'id',
												templateDesc:tempDesc
											});
										}
										items.push({
											type: 'files',
											name: 'uploadfiles',
											label: '',
											id: 'uploadfiles',
											allowType:".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf,.jpg,.jpeg,.png,.gif,.tif,.rm,.mp4,.rmvb,.avi,.wmv,.flv"
										});
										 var modalUp = $.orangeModal({
												id: "scoreItemForm",
												title: "上传证明材料",
												destroy: true
											});
											var formOpts = {
												id: "edit_form",
												name: "edit_form",
												method: "POST",
												action: App.href + "/api/core/112",
												showSubmit:false,
												showReset:false,
												ajaxSubmit: true,
												ajaxSuccess: function () {
												},
												isValidate: true,
												buttons: [{
													type: 'button',
													cls:' btn-primary',
													text: '保存',
													handle: function () {
														var ins = modalUp.$body.find('input[name="uploadfiles"]');
														var value =[];
														$.each(ins,function(){
															if($(this).val()!=''){
																value.push($(this).val());
															}
														});
														var v  = value.join("_");
														formPlug.setValue($input.attr("name"),v);
														modalUp.hide();
													}
												},{
													type: 'button',
													text: '关闭',
													handle: function () {
														modalUp.hide();
													}
												}],
												buttonsAlign: "center",
												items:items
											};
											var formUp = modalUp.$body.orangeForm(formOpts);
											formUp.loadLocal({uploadfiles:$input.val().split("_")});
											modalUp.show();
									},
									ajaxSuccess: function () {
									},
									showReset: false,
									showSubmit: false,
									isValidate: true,
									labelInline: false,
									buttonsAlign: "center",
									items: formItems
								}
							};
							tabs.push(tab);
							itemIndex++;
						}
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
                tabs: tabs
            });
            var prevBtn = $('<button type="button" class="btn btn-info">上一项</button>');
            var nextBtn = $('<button type="button" class="btn btn-success">保存并下一项</button>');
            mainPanel.find('div.panel-footer:eq(0)').append(prevBtn);
			if(that._options.submit){
				var submBtn = $('<button type="button" class="btn btn-primary">保存</button>');
				mainPanel.find('div.panel-footer:eq(0)').append(submBtn);
				submBtn.on("click", function () {
					that._options.submit(that,$(this));
				});
			}
            mainPanel.find('div.panel-footer:eq(0)').append(nextBtn);
            prevBtn.on("click", function () {
                if (that._options.prev !== undefined) {
                    that._options.prev(that,$(this));
                } else {
                    tab.prev();
                }
            });
			
            nextBtn.on("click", function () {
                if (that._options.next !== undefined) {
                    that._options.next(that,$(this));
                } else {
                    tab.next();
                }
            });
            this.$tab = tab;
            /*this.$main.find('form').each(
                function () {
                    $(this).find('input').on("change", function () {
                        that.showCheck();
                    });
                }
            );*/
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
                               // tmpAs[pss[0] + ''] = decodeURI(tmpAs[pss[0] + ''] + "," + pss[1]);
							   tmpAs[pss[0] + ''] = tmpAs[pss[0] + ''] + "," +decodeURI( pss[1]);
                            }
                        }
                    });

                }
            );
            $.each(tmpAs, function (i, d) {
				var isFile = isNaN(i);//"itemFile"+itemId
				if(!isFile){
					if (d != '') {
						var answer = {};
						answer['itemId'] = i;
						answer['itemValue'] = d;
						$.each(tmpAs, function (ii, dd) {
							if (ii=== 'itemFile'+i) {//"itemFile"+itemId
								answer['itemFile'] = dd;
							}
						});
						answers.push(answer);
					}
				}
            });
            return answers;
        },
        getValidation: function () {
            this.showCheck();
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
        loadAnswer: function (ans) {
            var that = this;
            if (ans.length > 0) {
                $.each(ans, function (i, an) {
                    that.loadValue(an.itemId, an.answerValue);
                    that.loadValue("itemFile"+an.itemId, an.answerFile);
                });
               // this.$tab.go(ans.length - 1);
            } else {
                this.$tab.go(0);
            }
			this.$tab.go(0);
            //var msg = that.getValidation();
			//this.$tab.go(msg[0].index);

        },
        loadValue: function (name, value) {
            var ele = this.$main.find("[name='" + name + "']");
			if(ele.length>0){
				var form = ele.parents('div[role=content]:eq(0)');
				var formPlug = form.data("plugin");
				formPlug.setValue(name, value);
			}
        },
        showCheck: function () {
            var that = this;
            that.$main.find('a').find('i.fa-check').remove();
            that.$main.find('form').each(
                function () {
					var thatForm = $(this);
                    var id = thatForm.parent().parent().attr("id");
                    /*var ps = $(this).serialize().split('=');
                    if (ps.length > 0 && ps[1] !== '' && ps[1] != undefined) {//TODO 空字符串输入
						that.$main.find('a[href="#' + id + '"]').append('<i class="fa fa-check btn-success"></i>');

					}*/
					/*var check = true;
					$.each($(this).find('div[data-row]'),function(i,c){
						
					})*/
					var nameMap = {};
					$.each(thatForm.find('input[type="radio"]'),function(){
						var name = $(this).attr("name");
						nameMap[name]=name;
					})
					$.each(thatForm.find('input[type="checkbox"]'),function(){
						var name = $(this).attr("name");
						nameMap[name]=name;
					})
					var su = true;
					$.each(nameMap,function(k,v){
						var v = thatForm.find('input[name="'+k+'"]:checked').val();
						//console.log(k+"  :  "+v);
						if(v==null||v==''||v==undefined)su=false;
					})
					
					/*$.each(thatForm.find('input[type="text"][role="number"]'),function(){
						var name = $(this).attr("name");
						nameMap[name]=name;
					})*/
					
					if(su)
						that.$main.find('a[href="#' + id + '"]').append('<i class="fa fa-check btn-success"></i>');
                    
					
                }
            );
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
				var isFile = isNaN(i);//"itemFile"+itemId
				if(!isFile){
					if (d != '') {
						var answer = {};
						answer['itemId'] = i;
						answer['itemValue'] = d;
						$.each(tmpAs, function (ii, dd) {
							if (ii=== 'itemFile'+i) {//"itemFile"+itemId
								answer['itemFile'] = dd;
							}
						});
						answers.push(answer);
					}
				}
            });
            return answers;
        }
    };

    /**
     * jquery插件扩展 ===================================================
     */

    var getPaperFill = function (options, extra) {
        options = $.extend(true, {}, PaperFill.defaults, options);
        if (extra != undefined) {
            options = $.extend(true, {}, options, extra);
        }
        var eles = [];
        this.each(function () {
            var self = this;
            var instance = new PaperFill(self, options);
            eles.push(instance);
        });
        return eles[0];
    };

    $.fn.extend({
        'orangePaperFill': getPaperFill
    });
})(jQuery, window, document);
