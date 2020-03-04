(function(doc, win) {
    var docEl = doc.documentElement, //保存为变量方便使用 获取根节点
        //下面这段代码是为了判断是移动端还是PC端,因为orientationchange是只有移动端才有的方法
        //orientationchange就是指屏幕翻转事件 而 resize是指屏幕/浏览器大小变化 ,都可以监听其事件变化
        //在window对象中是否有orientationchange属性
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',

        recalc = function() {
            //将屏幕宽度保存为变量
            // var clientWidth = docEl.clientWidth > 750 ? 750 : docEl.clientWidth;
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return; //如果没有宽度 直接返回,不执行

            //这里是假设在750px宽度设计稿的情况下，1rem = 100px；
            //rem就是指HTML里根元素html 的fontsize 通常为16px,1rem=16px;
            //可以根据实际需要修改
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';

        };
    if (!doc.addEventListener) return; //如果document没有addEventListenr方法就返回,不执行

    //监听屏幕变化,屏幕变化的方式上面已经保存好.resizeEvt, 尺寸一变化,就执行recalc,修改rem的值
    win.addEventListener(resizeEvt, recalc, false);

    //监听html的加载情况,只要html加载完成就执行recalc,修改rem的值
    //DOMContentLoaded 指html加载 不等待样式表CSS,图像和子框架的加载.与load不一样,load是指完全加载
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
//这里调用方法,传入document 和window两个大对象,注意其实document是在window下的