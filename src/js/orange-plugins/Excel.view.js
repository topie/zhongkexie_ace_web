/**
 * Created by chenguojun on 8/29/16.
 */

(function ($, window, document, undefined) {
    var ExcelView = function (element, options) {
        this._options = options;
        this.$element = $(element);
        var id = element.id;
        if (id === undefined || id == '') {
            id = "topie_excel_view_" + new Date().getTime();
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
    ExcelView.examples = [
        
    ];
    ExcelView.defaults = {
        title: '',
        data: [],
		itemActions:[],
		colInfos:[],
		autoGenerateColumns:true,
		showIndexNum:true
    };
    ExcelView.prototype = {
        load: function () {
        },
        init: function () {
            var that = this;
            var mainPanel = this.getPanel(this._options.title);
            that.$element.append(mainPanel);
            this.$main = mainPanel;
            that.colInfos= that._options.colInfos;
			that.renderTitle();
			if (this._options.data != undefined) {
				this.data = this._options.data;
				this.renderData();
			}
            if(that._options.url!==undefined){
				that.url=that._options.url;
				this.loadData();
			}
			that.bindHead();
			
			
        },
		bindHead:function(){
			var that = this;
			that.$tbody2.parent().parent().scroll(function(){
				 that.$thead2.parent().parent().scrollLeft($(this).scrollLeft());
				 that.$tbody1.parent().parent().scrollTop($(this).scrollTop());
				 //dc.body2.children("table.datagrid-btable-frozen").css("left", -$(this)._scrollLeft());
			})
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
        renderTitle: function () {
			var that = this;
			var panel = that.$main.find(".panel-body");
			var tabel =$('<div style="    position: relative;overflow: hidden;">'
							+'<div class="data-grid-container" style="position: absolute;z-index:99;">'
							+'<table class="data-grid" ><tbody></tbody></table></div>'
							+'<div class="data-grid-container" style="width:100%;overflow-x: hidden;position: absolute;left: 138px;margin-right: 138px;">'
							+'<table class="data-grid" ><tbody></tbody></table></div>'
							+'<div class="data-grid-container" style="height:600px;overflow-y: hidden;position: absolute;top: 138px;">'
							+'<table class="data-grid" ><tbody></tbody></table></div>'
							+'<div class="data-grid-container" style="height:600px;overflow: auto;position: inherit;top: 138px;left: 138px;margin-bottom: 138px;margin-right: 138px;">'
							+'<table class="data-grid" ><tbody></tbody></table></div>'
						+'</div>');
			/*var tabel =$('<div><table style="width:100%;overflow:hidden;"><tbody><tr><td><div class="data-grid-container" >'
							+'<table class="data-grid" ><tbody></tbody></table></div></td><td>'
							+'<div class="data-grid-container" style="overflow: hidden;">'
							+'<table class="data-grid" ><tbody></tbody></table></div></td></tr>'
							+'<tr><td><div class="data-grid-container" style="height:600px;overflow-y: hidden;">'
							+'<table class="data-grid" id="titleTable" ><tbody></tbody></table></div></td>'
							+'<td><div class="data-grid-container" style="height:600px;overflow: auto;">'
							+'<table class="data-grid" id="titleTable" ><tbody></tbody></table></div></td></tr></tbody></table>'
						+'</div>');*/
			panel.append(tabel);
			that.$thead1 = tabel.find(".data-grid>tbody:eq(0)");
			that.$thead2 = tabel.find(".data-grid>tbody:eq(1)");
			that.$tbody1 = tabel.find(".data-grid>tbody:eq(2)");
			that.$tbody2 = tabel.find(".data-grid>tbody:eq(3)");
			var th1 = '<tr>';
			var th2 = '<tr>';
			var width=3;

			if(that._options.showIndexNum){
				width+=20;
				th1+='<td class="cell read-only"><span class="value-viewer" style="width:20px;">'+'序号'+'</span></td>';
			}
		   $.each(that.colInfos,function(i,r){
			   if(r.static){
				   
				width+=(r.width==undefined?0:parseInt(r.width.replace("px",'')));
					th1+='<td class="cell read-only"><span class="value-viewer" style="width:'
					+(r.width==undefined?'':r.width)+';">'+r.displayName+'</span></td>';
			   }else{
					th2+='<td class="cell read-only"><span class="value-viewer" style="width:'
					+(r.width==undefined?'':r.width)+';">'+r.displayName+'</span></td>';
			   }
		   })
			th2+='<td class="cell read-only"></td>';
			th1+='</tr>';
			th2+='</tr>';
			that.$thead1.append(th1);
			that.$thead2.append(th2);
			that.$thead2.parent().parent().css('left',width+"px");
			that.$tbody2.parent().parent().css('left',width+"px");
			var top = that.$thead2.height();
			that.$tbody1.parent().parent().css('top',top+"px");
			that.$tbody2.parent().parent().css('top',top+"px");

        },
		renderData: function () {
			var that = this;
		   $.each(that.data,function(i,row){
				var th1 = '<tr>';
				var th2 = '<tr>';
				if(that._options.showIndexNum){
					th1+='<td class="cell read-only"><span class="value-viewer" style="width:20px;">'+(1+i)+'</span></td>';
				}
				$.each(that.colInfos,function(j,r){
					var title = row[r.name];
					if(r.format!=undefined){
						title=r.format(i,row);
					}
					if(r.static){
						th1+='<td class="cell"><span class="value-viewer" style="text-align:'+(r.align==undefined?'':r.align)+';width:'+(r.width==undefined?'':r.width)+';">'+title+'</span></td>';
					}else{
						th2+='<td class="cell"><span class="value-viewer" style="text-align:'+(r.align==undefined?'':r.align)+';width:'+(r.width==undefined?'':r.width)+';">'+title+'</span></td>';
					}
			   });
				th1+='</tr>';
				th2+='</tr>';
				that.$tbody1.append(th1);
				that.$tbody2.append(th2);
		   })
        },
		loadData:function(){
			var that = this;
		   $.ajax({
                    type: "GET",
                    url: that.url,
                    dataType: "json",
                    beforeSend: function (request) {
                        if (that._beforeSend != undefined) {
                            that._beforeSend(request);
                        }
                    },
                    success: function (data) {
                        if (data.code === 200) {
                            //that.$element.unblock();
							that.data = data.data.data;
							that.renderData();
                        } else if (data.code === 401) {
                            //that._alert(data.message + ";请重新登录！", undefined, undefined, App.redirectLogin);
                        } else if (data.code === 403) {

                        } else {
                        }
                    },
                    error: function (jqXHR, textStatus, errorMsg) {
                        //that.$element.unblock();
                        console.error("请求异常！");
                    }
                });
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
        reload: function (options) {
            this.$element.empty();
            this._options = options;
            this.init();
        },
        getJson: function () {
            return this._options;
        },
		loadValue: function (name, value) {
           
        },
        loadValues: function (name, value) {
           
		}
    };
	
    /**
     * jquery插件扩展 ===================================================
     */

    var getExcelView = function (options) {
        options = $.extend(true, {}, ExcelView.defaults, options);
        var eles = [];
        this.each(function () {
            var self = this;
            var instance = new ExcelView(self, options);
            eles.push(instance);
        });
        return eles[0];
    };

    $.fn.extend({
        'ExcelView': getExcelView
    });
})(jQuery, window, document);
