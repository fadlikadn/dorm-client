/**
 * INSPINIA - Responsive Admin Theme
 *
 * Main directives.js file
 * Define directives for used plugin
 *
 *
 * Functions (directives)
 *  - sideNavigation
 *  - iboxTools
 *  - minimalizaSidebar
 *  - vectorMap
 *  - sparkline
 *  - icheck
 *  - ionRangeSlider
 *  - dropZone
 *  - responsiveVideo
 *  - chatSlimScroll
 *  - customValid
 *  - fullScroll
 *  - closeOffCanvas
 *  - clockPicker
 *  - landingScrollspy
 *  - fitHeight
 *  - iboxToolsFullScreen
 *  - slimScroll
 *  - truncate
 *  - touchSpin
 *  - markdownEditor
 *  - resizeable
 *  - bootstrapTagsinput
 *
 */


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'FindDorm | Find The Best Dorm';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'FindDorm | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();

            });

            // Enable initial fixed sidebar
            //var sidebar = element.parent();
            //sidebar.slimScroll({
            //    height: '100%',
            //    railOpacity: 0.9,
            //});
        }
    };
};

/**
 * responsibleVideo - Directive for responsive video
 */
function responsiveVideo() {
    return {
        restrict: 'A',
        link:  function(scope, element) {
            var figure = element;
            var video = element.children();
            video
                .attr('data-aspectRatio', video.height() / video.width())
                .removeAttr('height')
                .removeAttr('width')

            //We can use $watch on $window.innerWidth also.
            $(window).resize(function() {
                var newWidth = figure.width();
                video
                    .width(newWidth)
                    .height(newWidth * video.attr('data-aspectRatio'));
            }).resize();
        }
    }
}

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
        }
    };
}

/**
 * iboxTools with full screen - Directive for iBox tools elements in right corner of ibox with full screen option
 */
function iboxToolsFullScreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools_full_screen.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            };
            // Function for full screen
            $scope.fullscreen = function () {
                var ibox = $element.closest('div.ibox');
                var button = $element.find('i.fa-expand');
                $('body').toggleClass('fullscreen-ibox-mode');
                button.toggleClass('fa-expand').toggleClass('fa-compress');
                ibox.toggleClass('fullscreen');
                setTimeout(function() {
                    $(window).trigger('resize');
                }, 100);
            }
        }
    };
}

/**
 * minimalizaSidebar - Directive for minimalize sidebar
*/
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 200);
                } else if ($('body').hasClass('fixed-sidebar')){
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 100);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};


function closeOffCanvas() {
    return {
        restrict: 'A',
        template: '<a class="close-canvas-menu" ng-click="closeOffCanvas()"><i class="fa fa-times"></i></a>',
        controller: function ($scope, $element) {
            $scope.closeOffCanvas = function () {
                $("body").toggleClass("mini-navbar");
            }
        }
    };
}

/**
 * vectorMap - Directive for Vector map plugin
 */
function vectorMap() {
    return {
        restrict: 'A',
        scope: {
            myMapData: '=',
        },
        link: function (scope, element, attrs) {
            var map = element.vectorMap({
                map: 'world_mill_en',
                backgroundColor: "transparent",
                regionStyle: {
                    initial: {
                        fill: '#e4e4e4',
                        "fill-opacity": 0.9,
                        stroke: 'none',
                        "stroke-width": 0,
                        "stroke-opacity": 0
                    }
                },
                series: {
                    regions: [
                        {
                            values: scope.myMapData,
                            scale: ["#1ab394", "#22d6b1"],
                            normalizeFunction: 'polynomial'
                        }
                    ]
                },
            });
            var destroyMap = function(){
                element.remove();
            };
            scope.$on('$destroy', function() {
                destroyMap();
            });
        }
    }
}


/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
    return {
        restrict: 'A',
        scope: {
            sparkData: '=',
            sparkOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.sparkData, function () {
                render();
            });
            scope.$watch(scope.sparkOptions, function(){
                render();
            });
            var render = function () {
                $(element).sparkline(scope.sparkData, scope.sparkOptions);
            };
        }
    }
};

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, $attrs, ngModel) {
            return $timeout(function() {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function(newValue){
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
            });
        }
    };
}

/**
 * ionRangeSlider - Directive for Ion Range Slider
 */
function ionRangeSlider() {
    return {
        restrict: 'A',
        scope: {
            rangeOptions: '='
        },
        link: function (scope, elem, attrs) {
            elem.ionRangeSlider(scope.rangeOptions);
        }
    }
}

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
function dropZone() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {

            var config = {
                url: 'http://localhost:8080/upload',
                maxFilesize: 100,
                paramName: "uploadfile",
                maxThumbnailFilesize: 10,
                parallelUploads: 1,
                autoProcessQueue: false
            };

            var eventHandlers = {
                'addedfile': function(file) {
                    scope.file = file;
                    if (this.files[1]!=null) {
                        this.removeFile(this.files[0]);
                    }
                    scope.$apply(function() {
                        scope.fileAdded = true;
                    });
                },

                'success': function (file, response) {
                }

            };

            dropzone = new Dropzone(element[0], config);

            angular.forEach(eventHandlers, function(handler, event) {
                dropzone.on(event, handler);
            });

            scope.processDropzone = function() {
                dropzone.processQueue();
            };

            scope.resetDropzone = function() {
                dropzone.removeAllFiles();
            }
        }
    }
}

/**
 * chatSlimScroll - Directive for slim scroll for small chat
 */
function chatSlimScroll($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '234px',
                    railOpacity: 0.4
                });

            });
        }
    };
}

/**
 * customValid - Directive for custom validation example
 */
function customValid(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
            scope.$watch(attrs.ngModel, function() {

                // You can call a $http method here
                // Or create custom validation

                var validText = "Inspinia";

                if(scope.extras == validText) {
                    c.$setValidity('cvalid', true);
                } else {
                    c.$setValidity('cvalid', false);
                }

            });
        }
    }
}


/**
 * fullScroll - Directive for slimScroll with 100%
 */
function fullScroll($timeout){
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '100%',
                    railOpacity: 0.9
                });

            });
        }
    };
}

/**
 * slimScroll - Directive for slimScroll with custom height
 */
function slimScroll($timeout){
    return {
        restrict: 'A',
        scope: {
            boxHeight: '@'
        },
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: scope.boxHeight,
                    railOpacity: 0.9
                });

            });
        }
    };
}

/**
 * clockPicker - Directive for clock picker plugin
 */
function clockPicker() {
    return {
        restrict: 'A',
        link: function(scope, element) {
                element.clockpicker();
        }
    };
};


/**
 * landingScrollspy - Directive for scrollspy in landing page
 */
function landingScrollspy(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.scrollspy({
                target: '.navbar-fixed-top',
                offset: 80
            });
        }
    }
}

/**
 * fitHeight - Directive for set height fit to window height
 */
function fitHeight(){
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.css("height", $(window).height() + "px");
            element.css("min-height", $(window).height() + "px");
        }
    };
}

/**
 * truncate - Directive for truncate string
 */
function truncate($timeout){
    return {
        restrict: 'A',
        scope: {
            truncateOptions: '='
        },
        link: function(scope, element) {
            $timeout(function(){
                element.dotdotdot(scope.truncateOptions);

            });
        }
    };
}


/**
 * touchSpin - Directive for Bootstrap TouchSpin
 */
function touchSpin() {
    return {
        restrict: 'A',
        scope: {
            spinOptions: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.spinOptions, function(){
                render();
            });
            var render = function () {
                $(element).TouchSpin(scope.spinOptions);
            };
        }
    }
};

/**
 * markdownEditor - Directive for Bootstrap Markdown
 */
function markdownEditor() {
    return {
        restrict: "A",
        require:  'ngModel',
        link:     function (scope, element, attrs, ngModel) {
            $(element).markdown({
                savable:false,
                onChange: function(e){
                    ngModel.$setViewValue(e.getContent());
                }
            });
        }
    }
};


/* ShadAhm/angular.keruC */
var f = function ($compile) {
    return {
        restrict: 'E',
        template: '<canvas width="{{settings.canvasWidth}}" height="{{settings.canvasHeight}}" id="canvasId"></canvas>',
        scope: {
            rows: '=data',
            selectedNodes: '=',
            onSelected: '&',
            onDeselected: '&',
            onDisallowedSelected: '&'
        },
        link: function (scope, element, attrs) {
            var nodeLocations = [];
            var rows = null;

            scope.settings = {
                canvasWidth: attrs.canvasWidth || 500,
                canvasHeight: attrs.canvasHeight || 500,
                vacantColourBg: attrs.vacantColourBg || '#76D75D',
                vacantColourFg: attrs.vacantColourFg || '#C1F2B4',
                occupiedColourBg: attrs.occupiedColourBg || '#F56979',
                occupiedColourFg: attrs.occupiedColourFg || '#BB1F31',
                selectedColourBg: attrs.selectedColourBg || '#7854AF',
                selectedColourFg: attrs.selectedColourFg || '#472085',
                showRowLabel: attrs.showRowLabel || false,
                showSeatLabel: attrs.showSeatLabel || true
            };

            var structure =
                {
                    squareGapX: 0, // gaps between squares, 3 squares will have 2 gaps between them
                    squareGapY: 0,
                    eachSquare: { width: 0, height: 0 }
                }

            var onRowDataChanged = function (newData) {
                if (newData == null)
                    return;

                rows = newData.rows;
                var canvasWidth = scope.settings.canvasWidth;
                var canvasHeight = scope.settings.canvasHeight;

                var longestRow = 0;

                for (var i = 0; i < rows.length; ++i) {
                    if (rows[i].nodes.length >= longestRow)
                        longestRow = rows[i].nodes.length;
                }

                if (scope.settings.showRowLabel)
                    longestRow = longestRow + 2;

                var numberOfSquareGapsX = longestRow + 1;
                var numberOfSquareGapsY = rows.length + 1;

                var totalSquareGapSpaceX = canvasWidth * 0.1;
                var totalSquareGapSpaceY = canvasHeight * 0.1;

                structure.squareGapX = totalSquareGapSpaceX / numberOfSquareGapsX;
                structure.squareGapY = totalSquareGapSpaceY / numberOfSquareGapsY;
                structure.eachSquare.width = (canvasWidth - totalSquareGapSpaceX) / longestRow;
                structure.eachSquare.height = (canvasHeight - totalSquareGapSpaceY) / rows.length;

                draw();
                addClickEventToCanvas();
            };

            scope.$watch('rows', onRowDataChanged);

            var drawSquare = function (selected, xPos, yPos, width, height, displayName) {
                var canvas = element.find('canvas')[0];
                var ctx = canvas.getContext('2d');
                var fontSize = structure.eachSquare.width * 0.4;
                var seatColour = '#000000';
                var textColour = '#000000';

                var boxCentrePointX = xPos + (structure.eachSquare.width / 2);
                var boxCentrePointY = yPos + (structure.eachSquare.height / 2);

                switch (selected) {
                    case 0:
                        seatColour = scope.settings.vacantColourBg;
                        textColour = scope.settings.vacantColourFg;
                        break;
                    case 1:
                        seatColour = scope.settings.occupiedColourBg;
                        textColour = scope.settings.occupiedColourFg;
                        break;
                    case 2:
                        seatColour = scope.settings.selectedColourBg;
                        textColour = scope.settings.selectedColourFg;

                        ctx.fillStyle = seatColour;
                        ctx.fillRect(xPos, yPos, width, height);

                        ctx.fillStyle = '#472085';
                        ctx.beginPath();
                        ctx.arc(boxCentrePointX, boxCentrePointY, structure.eachSquare.width * 0.2, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.fill();

                        ctx.beginPath();
                        ctx.fillStyle = '#472085';
                        ctx.beginPath();
                        ctx.arc(boxCentrePointX, yPos + structure.eachSquare.height, structure.eachSquare.width * 0.35, 0, Math.PI, true);
                        ctx.closePath();
                        ctx.fill();
                        return;
                }

                ctx.fillStyle = seatColour;
                ctx.fillRect(xPos, yPos, width, height);

                if (scope.settings.showSeatLabel == true) {
                    ctx.fillStyle = textColour;
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center';
                    ctx.font = fontSize + 'px sans-serif';
                    ctx.fillText(displayName, boxCentrePointX, boxCentrePointY);
                }
            };

            var drawRowLabel = function (row, xPos, yPos) {
                var canvas = element.find('canvas')[0];
                var ctx = canvas.getContext('2d');
                var fontSize = structure.eachSquare.width * 0.35;
                var textColour = '#999999';

                var boxCentrePointX = xPos + (structure.eachSquare.width / 2);
                var boxCentrePointY = yPos + (structure.eachSquare.height / 2);

                ctx.fillStyle = textColour;
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.font = fontSize + 'px sans-serif';
                ctx.fillText(row.rowName, boxCentrePointX, boxCentrePointY);

                return xPos + structure.squareGapX + structure.eachSquare.width;
            };

            var draw = function () {
                if (rows == null)
                    return;

                var lastUp = 0;
                for (var i = 0; i < rows.length; ++i) {
                    var lastRight = 0;

                    if (scope.settings.showRowLabel == true) {
                        lastRight = drawRowLabel(rows[i], lastRight + structure.squareGapX, lastUp + structure.squareGapY);
                    }

                    for (var j = 0; j < rows[i].nodes.length; ++j) {
                        if (rows[i].nodes[j].type == 0) {
                            lastRight = lastRight + structure.squareGapX + structure.eachSquare.width;
                        }
                        else {
                            drawSquare(
                                rows[i].nodes[j].selected,
                                lastRight + structure.squareGapX,
                                lastUp + structure.squareGapY,
                                structure.eachSquare.width,
                                structure.eachSquare.height,
                                rows[i].nodes[j].displayName
                            );

                            nodeLocations.push({
                                node: rows[i].nodes[j],
                                x: lastRight + structure.squareGapX,
                                y: lastUp + structure.squareGapY,
                                width: structure.eachSquare.width,
                                height: structure.eachSquare.height
                            });

                            lastRight = lastRight + structure.squareGapX + structure.eachSquare.width;
                        }
                    }

                    if (scope.settings.showRowLabel == true) {
                        lastRight = drawRowLabel(rows[i], lastRight + structure.squareGapX, lastUp + structure.squareGapY);
                    }

                    lastUp = lastUp + structure.squareGapY + structure.eachSquare.height;
                }
            };

            var onCanvasClick = function (e) {
                var canvas = element.find('canvas')[0];console.log(canvas);
                var x = e.pageX - canvas.offsetLeft;
                var y = e.pageY - canvas.offsetTop;
				console.log('x = '+e.pageX+' - '+canvas.offsetLeft);
				console.log('y = '+e.pageY+' - '+canvas.offsetTop);
                var clickedNode = null;

                for (var i = 0; i < nodeLocations.length; i++) {
                    var minX = nodeLocations[i].x;
                    var maxX = nodeLocations[i].x + nodeLocations[i].width;
                    var minY = nodeLocations[i].y;
                    var maxY = nodeLocations[i].y + nodeLocations[i].height;

                    var isInBox = (x > minX+485 && x < maxX+485) && (y > minY+232 && y < maxY+232);
console.log(x+'>'+minX+' && '+x+'<'+maxX);
console.log(y+'>'+minY+' && '+y+'<'+maxY);
                    if (isInBox) {
                        clickedNode = nodeLocations[i];
                        if (clickedNode.node.selected != 1) {
                            clickedNode.node.selected = clickedNode.node.selected == 0 ? 2 : 0;
                            nodeLocations[i] = clickedNode;

                            switch (clickedNode.node.selected) {
                                case 0:
                                    var indexof = scope.selectedNodes.indexOf(clickedNode.node);
                                    scope.selectedNodes.splice(indexof, 1);
                                    break;
                                case 2: scope.selectedNodes.push(clickedNode.node);
                                    break;
                            }
                            scope.$apply();
                        }
                    }
                }

                if (clickedNode == null || clickedNode.node.selected == 1) {
                    scope.onDisallowedSelected({ "$node": clickedNode.node });
                    return;
                }
                else {
                    switch (clickedNode.node.selected) {
                        case 0: scope.onDeselected({ "$node": clickedNode.node });
                            break;
                        case 2: scope.onSelected({ "$node": clickedNode.node });
                            break;
                    }

                    drawSquare(
                        clickedNode.node.selected,
                        clickedNode.x,
                        clickedNode.y,
                        clickedNode.width,
                        clickedNode.height,
                        clickedNode.node.displayName
                    );
                }
            };

            var addClickEventToCanvas = function () {
                var canvas = element.find('canvas')[0];
                canvas.addEventListener('click', onCanvasClick, false);
            };
        }
    }
};


/**
 *
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('vectorMap', vectorMap)
    .directive('sparkline', sparkline)
    .directive('icheck', icheck)
    .directive('ionRangeSlider', ionRangeSlider)
    .directive('dropZone', dropZone)
    .directive('responsiveVideo', responsiveVideo)
    .directive('chatSlimScroll', chatSlimScroll)
    .directive('customValid', customValid)
    .directive('fullScroll', fullScroll)
    .directive('closeOffCanvas', closeOffCanvas)
    .directive('clockPicker', clockPicker)
    .directive('landingScrollspy', landingScrollspy)
    .directive('fitHeight', fitHeight)
    .directive('iboxToolsFullScreen', iboxToolsFullScreen)
    .directive('slimScroll', slimScroll)
    .directive('truncate', truncate)
    .directive('touchSpin', touchSpin)
    .directive('markdownEditor', markdownEditor)
	.directive('kerucSeatpicker', ['$compile', f]);
