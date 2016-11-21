'use strict';

;(function($) {
    var tableSlider = {
        init: function () {
            var self = this;
            var visibleItems = 3;

            if ($(window).width() <= 768 && $(window).width() > 400) {
                visibleItems = 2;
            } else if ($(window).width() <= 400) {
                visibleItems = 1;
            }

            this.buildSlider();
            this.calculateWidth(visibleItems);
            this.addEventListeners(visibleItems);

            $(window).on('resize', function() {
                if ($(window).width() <= 768 && $(window).width() > 400) {
                    visibleItems = 2;
                } else if ($(window).width() <= 400) {
                    visibleItems = 1;
                } else visibleItems = 3;

                self.calculateWidth(visibleItems);
                self.addEventListeners(visibleItems);
            });
        },

        buildSlider: function () {

            var table = $('.table'),
                fixedContent,
                fixedColumn;


            this.table = table.each( function() {

                if ($(this).find('thead').length > 0 && $(this).find('th').length > 0 &&  $(this).find('tbody').length > 0) {
                    fixedContent = $(this).find('thead, tbody').clone();
                    fixedColumn = $(this).find('thead, tbody').clone();
                } else if ($(this).find('thead').length === 0 && $(this).find('tbody').length > 0) {
                    fixedContent = $(this).find('tbody').clone();
                    fixedColumn = $(this).find('tbody').clone();
                } else {
                    fixedContent = $(this).find('tr').clone();
                    fixedColumn = $(this).find('tr').clone();
                }

                var sliderContent = $([
                    '<div class="table-slider">',
                        '<div class="table-slider_fixed-column">',
                            '<table border="0" cellpadding="0" cellspacing="0" width="100%">',
                            '</table>',
                        '</div>',
                        '<div class="table-slider_content">',
                            '<table border="0" cellpadding="0" cellspacing="0" width="100%">',
                            '</table>',
                        '</div>',
                    '</div>',
                    '<div class="table-controls-wrapper">',
                        '<div class="table-controls">',
                            '<a href="#" class="table-previous">Previous</a>',
                            '<div class="pagination">',
                                '<a href="#" class="pagination-current"></a><span>/</span>',
                                '<a href="#" class="pagination-total"></a>',
                            '</div>',
                            '<a href="#" class="table-next">Next</a>',
                        '</div>',
                    '</div>'].join(''));

                    sliderContent.insertBefore('.rte_content');

                var stickyCol = sliderContent.find('.table-slider_fixed-column table');
                var sliderContent = sliderContent.find('.table-slider_content table');


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
            });
        },

        calculateWidth: function  (visibleItems) {

                var containerWith = $('.table-slider_content').width();
                var fixedColumnContainerWidth = $('.table-slider_fixed-column').width();
                var fixedColumnCell = $('.table-slider_fixed-column table tr td');
                var visibleItems = visibleItems || 3;
                var cellWidth = containerWith / visibleItems;

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
                        var fixedColumn = $('.table-slider_fixed-column table')
                            .find('tr')
                                .eq(i);

                        fixedColumn.height('auto');
                        $(this).height('auto');

                        $(this).height() <= fixedColumn.height() ? $(this).height(fixedColumn.height()) : fixedColumn.height($(this).height());
                    });

            },

        addEventListeners: function (visibleItems) {
            var self = this;
            var slider = $('.table-slider_content');
            var content = $('.table-slider_content table');
            var back = $('.table-previous');
            var next = $('.table-next');
            var visibleItems = visibleItems || 3;
            var totalItems = content.find('tr:first-child td').length;
            var iteration = 0;
            var iterations = totalItems / visibleItems;
            var moduloItems = totalItems % visibleItems;
            var positions = [];
            var blankSpace;

            function pagination() {
                $('.pagination').find('.pagination-current').html(iteration + 1);
            }

            function paginationTotalItems() {
                $('.pagination').find('.pagination-total').html(Math.ceil(iterations));
                console.log(iterations);
            }

            back.unbind('click');
            back.bind('click', clickHandler);
            next.unbind('click');
            next.bind('click', clickHandler);

            function clickHandler (event) {
                var target = $(event.currentTarget);

                if(target.is('.table-previous')) {
                    self.previous();
                    } else {
                    self.next();
                }
            };

            function lastIterationValue () {
                (moduloItems == 0) ? blankSpace = 0 : (blankSpace = (visibleItems - moduloItems) * content.find('tr:first-child td:first-child').innerWidth());
            }

            function storeSliderPositions () {
                lastIterationValue();

                var i = 0,
                    position,
                    slideWidth = content.find('tr:first-child td:first-child').innerWidth();

                for(;i < iterations; ++i) {
                    position = slideWidth * i * visibleItems;

                    if (i === parseInt(iterations)) {
                        position -= blankSpace;
                    }

                    positions.push(position);
                    console.log(positions);
                }
            }

            function update () {
                var targetPosition = positions[iteration];
                content.css({marginLeft: -targetPosition});
                pagination();
            }

            this.previous = function () {
                if(iteration > 0) {
                    iteration--;
                    update();
                }
            }

            this.next = function () {
                if(iteration < iterations - 1) {
                    iteration++;
                    update();
                }
            }

            function goToFirstSlide() {
                if (!iteration) {
                    iteration = 0;
                    update();
                }
            }

            storeSliderPositions();
            pagination();
            paginationTotalItems();
            goToFirstSlide();
        },
    }

    tableSlider.init();


})(jQuery);
