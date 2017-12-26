/**
 * Created by chenguojun on 8/29/16.
 */

(function ($, window, document, undefined) {
    var Tab = function (element, options) {
        this._options = options;
        this.$element = $(element);
        var id = element.id;
        if (id === undefined || id == '') {
            id = "topie_tab_" + new Date().getTime();
            this.$element.attr("id", id);
        }
        this._elementId = id;
        this.init();
    };
    Tab.examples = {
        tabs: [
            {
                title: 'tab1',
                active: true,
                content: {
                    plugin: 'form',
                    options: {}
                }
            },
            {
                title: 'tab2',
                active: true,
                content: {
                    html: ''
                }
            }
        ]
    };
    Tab.defaults = {
        lazy: true,
        tabs: [],
        hideOtherTab: false,
        page: {
            show: true,
            size: 10
        },
        buttons: []
    };
    Tab.prototype = {
        init: function () {
            var that = this;
            if (this._options.tabs !== undefined && this._options.tabs.length > 0) {
                var ul = $('<ul class="nav nav-tabs"></ul>');
                that.$element.append(ul);
                that.$ul = ul;
                if (this._options.page.show) {
                    var prevLi = $('<li role="prev"><a href="javascript:void(0);"><i class="fa fa-angle-left"></i></a></li>');
                    ul.append(prevLi);
                }
                var tabContent = $('<div style="border-left: 1px solid #ddd;' +
                    'border-right: 1px solid #ddd;' +
                    'border-bottom: 1px solid #ddd;' +
                    'padding: 5px 12px 5px 12px;"' +
                    ' class="tab-content"></div>');
                that.$element.append(tabContent);
                $.each(that._options.tabs, function (i, tab) {
                    var tId = that._elementId + "_tab" + i;
                    var li = $('<li role-index=' + i + ' role="tab" ' + (tab.active === true ? 'class="active"' : '') + '>' +
                        '<a href="#' + tId + '" data-toggle="tab" ' +
                        'aria-expanded="' + (tab.active === true ? 'true' : 'false') + '">' +
                        tab.title + '</a>' +
                        '</li>');
                    ul.append(li);
                    var pane = $('<div id="' + tId + '" class="tab-pane fade' + (tab.active === true ? ' active in ' : '') + '"><div role="content"></div></div>');
                    tabContent.append(pane);
                    if (!that._options.lazy) {
                        that.renderContent(pane.find('div[role=content]'), tab.content);
                    } else {
                        if (tab.active === true) {
                            that.renderContent(pane.find('div[role=content]'), tab.content);
                            li.find("a").addClass("init")
                        } else {
                            li.find("a").on("click.init", function (e) {
                                var $t = $(this);
                                if (!$(this).hasClass("init")) {
                                    that.renderContent(pane.find('div[role=content]'), tab.content);
                                    $t.off("click.init");
                                    $t.addClass("init");
                                }
                            })
                        }
                    }
                });
                if (this._options.page.show) {
                    var nextLi = $('<li role="next"><a href="javascript:void(0);"><i class="fa fa-angle-right"></i></a></li>');
                    ul.append(nextLi);
                }
            }
            if (this._options.hideOtherTab) {
                this.$ul.find('a').on("click", function () {
                    var li = $(this).parent('li');
                    li.show();
                    li.siblings().each(function () {
                        $(this).hide();
                    });
                });
            }
            if (this._options.page.show && this._options.page.size !== undefined) {
                this.$ul.find('li[role=tab]').find('a').on("click", function () {
                    var current = $(this).parent('li');
                    var index = current.attr('role-index');
                    var first = index - parseInt(that._options.page.size / 2);
                    first = first < 0 ? 0 : first;
                    var final = first + that._options.page.size - 1;
                    final = final >= that._options.tabs.length ? (that._options.tabs.length - 1) : final;
                    if ((final - first + 1) < that._options.page.size && final - that._options.page.size >= 0) {
                        first = final - that._options.page.size + 1;
                    }
                    that.$ul.find('li[role=tab]').show();
                    that.$ul.find('li[role=tab]:lt(' + first + ')').hide();
                    that.$ul.find('li[role=tab]:gt(' + final + ')').hide();
                });

                this.$ul.find('li[role=prev]').find('a').on("click", function () {
                    var firstLi = that.$ul.find('li[role=tab]:visible').first();
                    var final = parseInt(firstLi.attr('role-index'));
                    var first = final - that._options.page.size + 1;
                    first = first < 0 ? 0 : first;
                    final = final < that._options.page.size ? that._options.page.size - 1 : final;
                    that.$ul.find('li[role=tab]').show();
                    that.$ul.find('li[role=tab]:lt(' + first + ')').hide();
                    that.$ul.find('li[role=tab]:gt(' + final + ')').hide();

                });
                this.$ul.find('li[role=next]').find('a').on("click", function () {
                    var lastLi = that.$ul.find('li[role=tab]:visible').last();
                    var first = parseInt(lastLi.attr('role-index'));
                    var final = first + that._options.page.size - 1;
                    final = final >= that._options.tabs.length ? (that._options.tabs.length - 1) : final;
                    if ((final - first + 1) < that._options.page.size && final - that._options.page.size >= 0) {
                        first = final - that._options.page.size + 1;
                    }
                    that.$ul.find('li[role=tab]').show();
                    that.$ul.find('li[role=tab]:lt(' + first + ')').hide();
                    that.$ul.find('li[role=tab]:gt(' + final + ')').hide();
                });

            }
        },
        renderContent: function (spanElement, content) {
            var rObject = $(spanElement);
            if (content.plugin !== undefined) {
                switch (content.plugin) {
                    case 'grid':
                        rObject = $(spanElement).orangeGrid(content.options);
                        break;
                    case 'form':
                        rObject = $(spanElement).orangeForm(content.options);
                        break;
                    case 'tab':
                        rObject = $(spanElement).orangeTab(content.options);
                        break;
                    default:
                        $(spanElement).append(content.html);
                }
            } else {
                $(spanElement).append(content.html);
            }
            if (content.afterRender != undefined) {
                content.afterRender(rObject);
            }
        },
        next: function () {
            var li = this.$element.find('li.active').next();
            if (li.length > 0) {
                li.find('a').trigger('click');
            }
        },
        prev: function () {
            var li = this.$element.find('li.active').prev();
            if (li.length > 0) {
                li.find('a').trigger('click');
            }
        },
        go: function (i) {
            var li = this.$element.find('li[role=tab]:eq(' + i + ')');
            if (li.length > 0) {
                li.find('a').trigger('click');
            }
        }
    };

    /**
     * jquery插件扩展 ===================================================
     */

    var getTab = function (options) {
        options = $.extend(true, {}, Tab.defaults, options);
        var eles = [];
        this.each(function () {
            var self = this;
            var instance = new Tab(self, options);
            eles.push(instance);
        });
        return eles[0];
    };

    $.fn.extend({
        'orangeTab': getTab
    });
})(jQuery, window, document);
