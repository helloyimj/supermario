(function (){
    let amount = 0;
    let wheelAmount = 500;
    let num = 0;
    let zNum = 5000;
    let selected = 0;
    let old = selected;
    let total = 0;
    let move;
    function reset() {
        amount = 0;
        $("#main").off(); //기존에 걸려 있는 이벤트 삭제
        $("#main .marioList").html(""); // 기존에 있는 item 삭제
        $("#menu .list").html(""); // 기존에 있는 item 삭제
    }
    //자바스크립트의 변수는 선언될때 결정된다.  
    function onClass(num) {
        let item = $("#menu li").eq(num);
        //console.log(num);
        if (!item.hasClass("on")) {
            item.addClass("on");
            item.siblings().removeClass("on");
        }
    }
    function appendList(_mario) {
        $.each(_mario, function (i, item) {
            $("#menu .list").append(
                `
                <li><span>${item.title}</span></li>
            `
            );
            $("#main .marioList").append(
                `
            <li style="z-index:${total-i}; transform: translateZ(${-zNum*i}px)">
                <div class="mario">
                    <img src="${item.img}" alt="">
                </div>
                <div class="txt">
                    <h2 class="title">${item.title}</h2>
                    <p>
                        ${item.desc}
                    </p>
                    <a href="${item.link}">MORE</a>
                </div>
                <div class="bg" style="background-image:${item.bg}"></div>
            </li>
            `
            )
        });
    }

    function showItem() {
        gsap.from("#main .marioList li", {
            z: -500000,
            ease: "power4.inOut",
            duration: 1,
            stagger: {
                each: 0.1,
            }
        });

        gsap.from("#menu li", {
            x: -500,
            ease: "back",
            duration: 1,
            stagger: {
                each: 0.05
            },
            onComplete: function () {
                $("#menu li").eq(0).addClass("on");
            }
        });
    }

    function mouseWheel() {
        $("#main").on("mousewheel", function (e) {
            let wheel = e.originalEvent.deltaY;
            if (wheel > 0) {
                num = wheelAmount;
            } else {
                num = -wheelAmount;
            }
            amount += num;

            if (amount >= (total - 1) * zNum) {
                amount = (total - 1) * zNum;
            } else if (amount <= 0) {
                amount = 0;
            }
            
            selected = Math.floor((amount + zNum / 2) / zNum);
            moveMario($("#main .marioList li").eq(selected).find(".mario"));
            onClass(selected);
            $("#main .marioList li").each(function (i, item) {
                gsap.to(item, {
                    z: amount - i * zNum,
                    ease: "power4"
                });
            });
            old=selected;
        });
    }

    function moveMario(mc) {
        if(move!==undefined){
            move.kill();
            move=null;
        }
        move = gsap.to(mc, {
            x: function(){return Math.random() * 200 - 100},
            y: function(){return Math.random() * 200 - 100},
            duration:  function(){return Math.random() * 2 + 1},
            ease: "none",
            repeat:-1,
            repeatRefresh:true,
        });
    }

    function clickMenu() {
        $("#menu li").on("click", function () {
            let idx = $(this).index();
            amount = zNum * idx;
            onClass(idx);
            let _duration = Math.abs(idx - selected);
            
            moveMario($("#main .marioList li").eq(idx).find(".mario"));
            $("#main .marioList li").each(function (i, item) {
                gsap.to(item, {
                    duration: Math.min(_duration * 0.5, 2.5), // 0.5 ,1 ,1.5
                    z: amount - i * zNum,
                    ease: "power4"
                });
            });
            selected = idx;
        });
    }

    function loadJSON(_url) {
        $.ajax({
                url: _url
            })
            .done(function (res) {
                let mario = res.mario;
                total = mario.length;
                reset();
                appendList(mario);
                showItem();
                mouseWheel();
                clickMenu();
                // $("#main .marioList li").each(function(i,item){
                //     moveMario($(this).find(".mario"));
                // });
            });
    }
    let jsonArray = ["mario.json", "monster.json", "all.json"];
    $("#gnb li").on("click", function () {
        loadJSON(`${$(this).data("url")}.json`);
        $(this).addClass("on");
        $(this).siblings().removeClass("on");
    });
    $("#gnb li").eq(0).trigger("click");
})();