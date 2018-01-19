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
                    if (idx.items.length > 0) {
                        $.each(idx.items, function (ii, item) {
                            var display = {
                                name: '',
                                id: '',
                                type: 'display',
                                label: '',
                                html: '<span>' + idx.parentIndexTitle + '</span>'
                            };
                            var it = {};
                            it.name = item.id;
                            it.label = item.title;// + "(" + item.score + "分)";
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
                                        name: item.id
                                    }
                                ]
                            } else if (item.itemType == 4) {
                                it.type = 'number';
                                it.inline = true;
                            } else if (item.itemType == 5) {
                                it.type = 'radio_input';
                                it.span = 6;
                            } else if (item.itemType == 6) {
                                it.type = 'checkbox_input';
                                it.span = 6;
                            }
                            if (item.itemType == 1 || item.itemType == 2 || item.itemType == 5 || item.itemType == 6) {
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
                            var tab = {};
                            tab['title'] = '第' + itemIndex + '题';
                            tab['width'] = '87px';
                            tab['content'] = {
                                plugin: 'form',
                                options: {
                                    method: "POST",
                                    action: "",
                                    ajaxSubmit: true,
                                    rowEleNum: 1,
                                    ajaxSuccess: function () {
                                    },
                                    showReset: false,
                                    showSubmit: false,
                                    isValidate: true,
                                    labelInline: false,
                                    buttonsAlign: "center",
                                    items: [display, it]
                                }
                            };
                            tabs.push(tab);
                            itemIndex++;
                        });
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
            var prevBtn = $('<button type="button" class="btn btn btn-info">上一题</button>');
            var nextBtn = $('<button type="button" class="btn btn btn-success">下一题</button>');
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
            this.$main.find('form').each(
                function () {
                    $(this).find('input').on("change", function () {
                        that.showCheck();
                    });
                }
            );
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
                });
                this.$tab.go(ans.length - 1);
            } else {
                this.$tab.go(0);
            }
            that.showCheck();
        },
        loadValue: function (name, value) {
            var ele = this.$main.find("[name='" + name + "']");
            var form = ele.parents('div[role=content]:eq(0)').data("plugin");
            form.setValue(name, value);
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
        getCurrentTabAnswer: function () {
            var answers = [];
            var tmpAs = {};
            var f = this.$tab.currentDiv().find('form');
            var ps = f.serialize().split('&');
            $.each(ps, function (ii, ppss) {
                var pss = ppss.split('=');
                if (pss.length === 2) {
                    if (tmpAs[pss[0] + ''] === undefined) {
                        tmpAs[pss[0] + ''] = pss[1];
                    } else {
                        tmpAs[pss[0] + ''] = tmpAs[pss[0] + ''] + "," + pss[1];
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
