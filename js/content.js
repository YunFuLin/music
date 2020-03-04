//json数组
var list = [
    { "image": "../images/1.jpg", "name": "001. 从开始到现在(Live)--小林", "src": "../music/1.mp3" },
    { "image": "../images/2.jpg", "name": "002. 好心分手--小可爱", "src": "../music/2.mp3" },
    { "image": "../images/3.jpg", "name": "003. 后来--小林", "src": "../music/3.mp3" },
    { "image": "../images/4.jpg", "name": "004. 讲真的--小林", "src": "../music/4.mp3" },
    { "image": "../images/5.jpg", "name": "005. 浪人琵琶--小可爱", "src": "../music/5.mp3" },
    { "image": "../images/6.jpg", "name": "006. 让我做你的眼睛--小林", "src": "../music/6.mp3" },
    { "image": "../images/7.jpg", "name": "007. 温柔乡--小林", "src": "../music/7.mp3" },
    { "image": "../images/8.jpg", "name": "008. 云烟成雨--小林", "src": "../music/8.mp3" },
    { "image": "../images/9.jpg", "name": "009. 再见吧 喵小姐--小林", "src": "../music/9.mp3" },
    { "image": "../images/10.jpg", "name": "010. 再也不会遇见第二个她--小林", "src": "../music/10.mp3" },
    { "image": "../images/11.jpg", "name": "011. 捉泥鳅--小林", "src": "../music/11.mp3" },
];
//解析Json格式的数组
var oMusic = eval(list);
console.log(oMusic);
// 填充内容
$(function() {
    var html = "";
    var i = 0;
    for (var li of oMusic) {
        html += `<div class="box">
            <a class="progress" id="progress` + i + `" href="javascript:;"></a>
            <audio src="${li.src}" class="music" preload="none" id="music` + i + `" ></audio>
            <img class="img" onclick="img(` + i + `)" id="img` + i + `" src="../images/img.gif" data-src="${li.image}" alt="">
            <p>${li.name}</p>
            <img class="boximg" id="s` + i + `"  onclick="playstart(` + i + `)" src="../images/play.png">
            <div class="load" id="load` + i + `">
                <img class="load_frame" src="../images/ui_main_bt_loading_frame.png" alt="">
                <img class="load_bt" src="../images/ui_main_bt_loading.png" alt="">
            </div> 
        </div>`
        i++;
    }
    $(".main").html(html);
})

// 懒加载图片
$(function() {
    //触发滚动 防止第一屏不加载
    $("body,html").scrollTop(0);
    $("body,html").scrollTop(10);
    // 可视区域 img 加载
    //容差值 预加载上下100像素内的图片
    var phase = 50;
    lazy();

    function lazy() {
        $(".img").each(function() {
            var $this = $(this);
            //屏幕底部距离最顶部的高度=窗口的高度+被卷起的高度  
            var thisButtomTop = parseInt($(window).height()) + parseInt($(window).scrollTop());
            //屏幕顶部距离最顶部的高度   减去图片高度，上拉时也会点到图片就加载
            var thisTop = parseInt($(window).scrollTop()) - parseInt($this.height());
            var imgTop = parseInt($this.offset().top);
            if (imgTop >= thisTop - phase && imgTop <= thisButtomTop + phase && $this.attr("data-url") != $this.attr("src")) {
                //如果为空，src设置为data-src
                if ($this.attr("data-src")) {
                    $this.attr("src", $this.attr("data-src"));
                } else {
                    $this.attr("data-src", $this.attr("src"));
                }
            }
        })
    }

    // 用户频繁操作 scroll  不免造成页面性能不佳 此刻当然需要配合 节流 使页面性能更加优化
    function throttle(fn, delay) { // 定义的参数函数和延迟时间
        var begin = new Date();
        return function() {
            var curtimer = new Date();
            var contxt = this,
                args = arguments;
            if (curtimer - begin > delay) { // 时间间隔 > 定义时间 才执行
                fn.apply(contxt, args);
                console.log(123);
                begin = curtimer;
            }
        }
    }
    $(document).scroll(throttle(lazy, 100));
})

//放大照片
function img(i) {
    var photo = document.getElementById('img' + i).getAttribute("data-src");
    var photos = document.getElementById('photo');
    photos.style.display = "block";
    photos.innerHTML = "<img src=" + photo + " alt=''>";
}

$(function() {
    $('#photo').click(() => {
        $('#photo').css("display", "none");
    })
})

//播放暂停
function playstart(i) {
    var img = document.getElementById('s' + i);
    var progress = document.getElementById('progress' + i);
    var audio = document.getElementsByTagName('audio');
    var music = document.getElementById('music' + i);
    var load = document.getElementById("load" + i);

    if (music.paused) {
        music.play();
        load.style.display = "block";
        img.style.display = "none";
        img.src = "../images/pause.png";

        for (var j = audio.length - 1; j >= 0; j--) {

            //进度条

            //监听音频播放时间并更新进度条
            music.addEventListener('timeupdate', function() {
                load.style.display = "none";
                img.style.display = "block";
                // console.log(1);
                var value = music.currentTime / music.duration;
                progress.style.width = value * 100 + '%';
            }, false);

            // 监听播放完成事件
            music.addEventListener('ended', function() {
                progress.style.width = '0';
                img.src = "../images/play.png";
                //自动播放下一曲
                // audio[i + 1].play();
            }, false);
            var a = audio[j].getAttribute("id");
            var s = a.substring(5);
            // console.log(s);
            if (s != i) {
                var audios = document.getElementById('music' + s);
                audios.pause();
                audios.currentTime = 0;
                var h = document.getElementById('s' + s);
                h.src = "../images/play.png";
            }
        }

    } else {
        img.style.display = "block";
        img.src = "../images/play.png";
        music.pause(); // 暂停
        // audio[i].load();
    }
}

//点击下拉框以外的地方,下拉框隐藏
//阻止冒泡事件
function stopPropagation(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
}
//点击除搜索框元素以外隐藏下拉
$(document).bind("click", function() {
    $("#schname").hide();
});


//搜索框
$(function() {
    //提示词
    var oName = [];
    for (var i of oMusic) {
        oName.push(i.name);
    }
    console.log(oName);

    //使得下拉框的宽度和输入框保持一致
    $("#schname").css("width", $(".search").width());
    //监听输入框
    $(".input").keyup(function() {
        var html = "";
        if ($(".input").val().length > 0) {
            var len = oName.length > 8 ? 8 : oName.length; //最多显示10行
            for (var i = 0; i < len; i++) {
                if (oName[i].toLowerCase().indexOf($(".input").val().toLowerCase()) >= 0) {
                    html += `<tr>
                    <td>
                    <img src="../images/search.png" alt="">
                    <p>${oName[i]}</p>
                    </td>
                    </tr>`;
                }
            }
            if ($("#schname").html() == "") {
                html += `<tr><td>
                <img src="../images/search.png" alt="">
                <p>无对应名称或序号</p>
                </td></tr>`;
            }
            $("#schname").html(html);
            $("#schname").css("display", "table");
        } else {
            $("#schname").css("display", "none");
        }
    });

    //      点击事件处理搜索加载
    $('#schname').on('click', 'tr', function() {
        if ($(this).text() == "无对应名称或序号") {
            return; //没有匹配值返回否则做相应处理
        }
        $(".input").val($(this).children().find("p").text());
        $("#schname").css("display", "none");
        var li = "";
        var len = oName.length
        for (var i = 0; i < len; i++) {
            if (oName[i].toLowerCase().indexOf($(".input").val().toLowerCase()) >= 0) {
                li += `<div class="box">
                <a class="progress" id="progress` + i + `" href="javascript:;"></a>
                <audio src="${oMusic[i].src}" class="music" preload="none" id="music` + i + `"></audio>
                <img class="img" onclick="img(` + i + `)" id="img` + i + `" src="../images/img.gif" data-src="${oMusic[i].image}" alt="">
                <p>${oName[i]}</p>
                <img class="boximg" id="s` + i + `"  onclick="playstart(` + i + `)" src="../images/play.png">
                <div class="load" id="load` + i + `">
                    <img class="load_frame" src="../images/ui_main_bt_loading_frame.png" alt="">
                    <img class="load_bt" src="../images/ui_main_bt_loading.png" alt="">
                </div> 
            </div>`;
            }
        }
        $(".main").html(li);
    });
    // 点击搜索
    $('.btn').on('click', function() {
        //触发滚动 防止第一屏不加载
        $("body,html").scrollTop(0);
        $("body,html").scrollTop(10);

        if ($(".input").val() == "没有数据") {
            return; //没有匹配值返回否则做相应处理
        }
        $("#schname").css("display", "none");
        var li = "";
        var find = false;
        var len = oName.length
        for (var i = 0; i < len; i++) {
            if (oName[i].toLowerCase().indexOf($(".input").val().toLowerCase()) >= 0) {
                find = true;
                li += `<div class="box">
                <a class="progress" id="progress` + i + `" href="javascript:;"></a>
                <audio src="${oMusic[i].src}" class="music" preload="none" id="music` + i + `"></audio>
                <img class="img" onclick="img(` + i + `)" id="img` + i + `" src="../images/img.gif" data-src="${oMusic[i].image}" alt="">
                <p>${oName[i]}</p>
                <img class="boximg" id="s` + i + `"  onclick="playstart(` + i + `)" src="../images/play.png">
                <div class="load" id="load` + i + `">
                    <img class="load_frame" src="../images/ui_main_bt_loading_frame.png" alt="">
                    <img class="load_bt" src="../images/ui_main_bt_loading.png" alt="">
                </div> 
            </div>`;
            }
        }
        if (!find) {
            li += `<li style="font-size: .3rem;text-align:center;color:#707070">未找到与<span style='color: red;font-weight: bold;text-align:center'>
            ${$(".input").val()}</span>相关的内容 <br/>试试重新输入</li>`
        }
        $(".main").html(li);
    })

})