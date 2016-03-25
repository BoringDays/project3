$(document).ready(function () {
    //init iscroll
    //听说DOM复杂的话，要等100ms到200ms再初始化iscroll对象，否则计算不正确
    //initIScrollEvent('scroll-wrapper');

    //odometer effect
    setTimeout(function () {
        document.querySelector('#money-total .odometer').innerHTML = '500000000';

        document.getElementById('number1').innerHTML = '5800000';
        document.getElementById('number2').innerHTML = '2000';
    }, 1000);

    //first-in modal
    $('#modal_1').modal('show');

    //document.addEventListener('touchmove', function (e) {
    //    e.preventDefault();
    //}, false);
});

function initIScrollEvent(elemId) {
    var pullDownElem = document.getElementById('pullDown'),
        $pullDownElem = $(pullDownElem),
        pullDownOffset = pullDownElem.offsetHeight,
        pullUpElem = document.getElementById('pullUp'),
        $pullUpElem = $(pullUpElem),
        pullUpOffset = pullUpElem.offsetHeight;

    var IScrollObj = new IScroll(document.getElementById(elemId), {probeType: 3, mouseWheel: true});
    IScrollObj.on('scroll', function () {
        if (this.y > 5 && $pullDownElem.attr('data-pull-status') !== 'flip') {
            $pullDownElem.attr('data-pull-status', 'flip').show();//松手开始更新
            this.minScrollY = 0;
            console.log($pullDownElem.attr('data-pull-status') + ',pulldown');
        } else if (this.y < 5 && $pullDownElem.attr('data-pull-status') === 'flip') {
            $pullDownElem.attr('data-pull-status', '').hide();//下拉加载
            this.minScrollY = -pullDownOffset;
            console.log($pullDownElem.attr('data-pull-status') + ',pulldown');
        } else if (this.y < (this.maxScrollY - 5) && $pullUpElem.attr('data-pull-status') !== 'flip') {
            $pullUpElem.attr('data-pull-status', 'flip');//松手开始更新
            this.maxScrollY = this.maxScrollY;
            console.log($pullUpElem.attr('data-pull-status') + ',pullup');
        } else if (this.y > (this.maxScrollY + 5) && $pullUpElem.attr('data-pull-status') === 'flip') {
            $pullUpElem.attr('data-pull-status', '');//上拉加载
            this.maxScrollY = pullUpOffset;
            console.log($pullUpElem.attr('data-pull-status') + ',pullup');
        }
    });
    IScrollObj.on('scrollEnd', function () {
        if ($pullDownElem.attr('data-pull-status') === 'flip') {
            $pullDownElem.attr('data-pull-status', 'loading');//加载中
            console.log($pullDownElem.attr('data-pull-status') + ',pulldown');
            IScrollObj.refresh();
        } else if ($pullUpElem.attr('data-pull-status') === 'flip') {
            $pullUpElem.attr('data-pull-status', 'loading');//加载中
            console.log($pullUpElem.attr('data-pull-status') + ',pullup');
            IScrollObj.refresh();
        }
    });

    //var IScrollObj = new IScroll(document.getElementById(elemId), {
    //    scrollbars: true,
    //    topOffset: pullDownOffset,
    //    onRefresh: function () {
    //        if ($pullDownElem.attr('data-pull-status') === 'loading') {
    //            $pullDownElem.attr('data-pull-status', '');//下拉加载
    //            console.log($pullDownElem.attr('data-pull-status') + ',pulldown');
    //        } else if ($pullUpElem.attr('data-pull-status') === 'loading') {
    //            $pullUpElem.attr('data-pull-status', '');//上拉加载
    //            console.log($pullDownElem.attr('data-pull-status') + ',pullup');
    //        }
    //    },
    //    onScroll: function () {
    //        if (this.y > 5 && $pullDownElem.attr('data-pull-status') !== 'flip') {
    //            $pullDownElem.attr('data-pull-status', 'flip').show();//松手开始更新
    //            this.minScrollY = 0;
    //            console.log($pullDownElem.attr('data-pull-status') + ',pulldown');
    //        } else if (this.y < 5 && $pullDownElem.attr('data-pull-status') === 'flip') {
    //            $pullDownElem.attr('data-pull-status', '').hide();//下拉加载
    //            this.minScrollY = -pullDownOffset;
    //            console.log($pullDownElem.attr('data-pull-status') + ',pulldown');
    //        } else if (this.y < (this.maxScrollY - 5) && $pullUpElem.attr('data-pull-status') !== 'flip') {
    //            $pullUpElem.attr('data-pull-status', 'flip');//松手开始更新
    //            this.maxScrollY = this.maxScrollY;
    //            console.log($pullUpElem.attr('data-pull-status') + ',pullup');
    //        } else if (this.y > (this.maxScrollY + 5) && $pullUpElem.attr('data-pull-status') === 'flip') {
    //            $pullUpElem.attr('data-pull-status', '');//上拉加载
    //            this.maxScrollY = pullUpOffset;
    //            console.log($pullUpElem.attr('data-pull-status') + ',pullup');
    //        }
    //    },
    //    onScrollEnd: function () {
    //        if ($pullDownElem.attr('data-pull-status') === 'flip') {
    //            $pullDownElem.attr('data-pull-status', 'loading');//加载中
    //            console.log($pullDownElem.attr('data-pull-status') + ',pulldown');
    //            pullDownAction(document.getElementById(elemId), this);
    //        } else if ($pullUpElem.attr('data-pull-status') === 'flip') {
    //            $pullUpElem.attr('data-pull-status', 'loading');//加载中
    //            console.log($pullUpElem.attr('data-pull-status') + ',pullup');
    //            pullUpAction(document.getElementById(elemId), this);
    //        }
    //    }
    //});
    //
    //setTimeout(function () {
    //    document.getElementById(elemId).style.left = '0';
    //}, 800);
}

//pull-down action, can be improved
function pullDownAction(iscrollElem, iscrollObj) {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        iscrollElem.prependChild('<div>new pull down content</div>');

        iscrollObj.refresh();
    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

//pull-up action, can be improved
function pullUpAction(iscrollElem) {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        iscrollElem.appendChild('<div>new pull up content</div>');

        iscrollObj.refresh();
    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}