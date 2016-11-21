'use strict';

;(function($) {
    var tableSlider = {
        init: function () {

            this.buildSlider();
            this._addEventListeners();
            this._calculateWidth();

            $(window).on('resize', function(){
                tableSlider._calculateWidth();
            });
        },

        buildSlider: function () {
            var table = $('.table');
            var fixedContent = table.find('tbody, thead').clone();
            var fixedColumn = table.find('thead, tbody').clone();

            var sliderContent = $([
                '<div class="table-slider">',
                    '<div class="table-slider_fixed-column">',
                        '<table border="0" cellpadding="0" cellspacing="0" width="100%">',
                        '</table>',
                    '</div>',
                    '<div class="table-slider_content">',
                        '<table border="0" cellpadding="0" cellspacing="0" width="100%">',
                        '</table>',
                '</div>'].join(''));

                sliderContent.insertBefore('.rte_content');

            var stickyCol = $('.table-slider_fixed-column table');
            var sliderContent = $('.table-slider_content table');

            stickyCol
                .append(fixedColumn)
                    .find('tbody tr')
                    .find('td:gt(0)')
                    .remove();

            sliderContent
                .append(fixedContent)
                    .find('tbody tr')
                    .find('td:lt(1)')
                    .remove();
        },

            _calculateWidth: function  () {
                    var containerWith = $('.table-slider_content').width();
                    var fixedColumnContainerWidth = $('.table-slider_fixed-column').width();
                    var fixedColumnCell = $('.table-slider_fixed-column table tr td');
                    var sliderQuantity = 3;
                    var cellWidth = containerWith / sliderQuantity;

                    fixedColumnCell.css(
                        {"width" : fixedColumnContainerWidth + 'px'}
                    );

                    $('.table-slider_content td')
                        .css(
                            {"width" : cellWidth + 'px'}
                        );

                    var tdItems = $('.table-slider_content table tr:first-child td').length;
                    var tableWidth = tdItems * cellWidth;

                    $('.table-slider_content table')
                        .css(
                            {"width" : tableWidth + 'px'}
                        );

                     $('.table-slider_content')
                        .find('tr').each(function (i) {
                            $('.table-slider_fixed-column table')
                                .find('tr')
                                    .eq(i)
                                        .height($(this).height());
                        });

                },

        _addEventListeners: function () {
            var self = this;
            var slider = $('.table-slider_content');
            var content = $('.table-slider_content table');
            var back = $('.table-previous');
            var next = $('.table-next');
            var visibleItems = 3;
            var totalItems = content.find('tr:first-child td').length;
            var iteration = 0;
            var iterations = totalItems / visibleItems;
            var positions = [];

            back.click(clickHandler);
            next.click(clickHandler);

            _storeSliderPositions();

            function clickHandler (event) {
                var target = $(event.currentTarget);

                if(target.is('.table-previous')) {
                    self.previous();
                    } else {
                    self.next();
                }
            };

            // Store slider positions so we don't need to perform queries to find their position anymore
            function _storeSliderPositions () {
                var i = 0,
                targetIndex,
                target,
                position;

                for(; i < iterations; ++i) {
                    targetIndex = (i * visibleItems) + 1;
                    console.log(targetIndex);
                    target = content.find('tr:first-child td:nth-child(' + targetIndex + ')');
                    position = target.position().left;
                    console.log(position);
                    positions.push(position);
                }
            }

            function update () {
                var targetPosition = positions[iteration];
                content.css({marginLeft: -targetPosition});
            }

            this.previous = function () {
                if(iteration > 0) {
                    --iteration;
                    update();
                }
            }

            this.next = function () {
                if(iteration < iterations - 1) {
                    ++iteration;
                    update();
                }
            }
        },
    }

    tableSlider.init();


})(jQuery);
