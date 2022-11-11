let slider = null;
function loadItems(_url) {
    $(".marioList").html("");
    $("#menu .list").html("");
    const zDistance = 5000;
    const num = 500;
    let zAmount = 0;
    let selected = 0;
    let oldIndex = 0;
    $(".marioList").off();
    axios.get(_url)
    .then(function(res){
        const items = res.data.items;
        const imgPath = res.data.imgPath;
        const total = items.length;
        const lastZ = (total-1)*zDistance;
        // console.log(lastZ);
        let temp = "";
        let navTemp ="";
        $.each(items,function(i,item){
            temp+=`
            <li class="swiper-slide">
                <div class="mario">
                    <img src="${imgPath}${item.img}" alt="">
                </div>
                <div class="txt">
                    <h2 class="title">${item.title}</h2>
                    <p>
                        ${item.desc}
                    </p>
                    <a href="${item.link}" target="${item.target}">MORE</a>
                </div>
                <div class="bg" style="${item.bg}"></div>
            </li>
            `;
            navTemp+=
            `
                <li><span>${item.title}</span></li>
            `
        });
        //$("#menu .list").append(navTemp);
        //$("#menu .list li:nth-child(1)").addClass("on");
        $(".marioList").append(temp);
        if(slider!==null) {
            slider.destroy();
        }
        slider = new Swiper("#main",{
            slidesPerView:"auto",
            effect:"coverflow",
            centeredSlides:true,
            speed:500,
            //direction:"vertical",
            coverflowEffect: {
                rotate: 0,
                slideShadows: false,
                stretch:0,
                depth:1000,
            },
            loop:true,
            pagination:{
                el:".pagination",
                clickable:true
            },
            mousewheel:true,
        });
    });
    
    $("body").on("click","#menu li",function(){
        
    });
};

const itemsUrl=["mario.json","monster.json"];


$("#gnb li").on("click",function(){
    loadItems(itemsUrl[ $(this).index() ]);
    $(this).addClass("on");
    $(this).siblings().removeClass("on");
    return false;
});
$("#gnb li").eq(0).trigger("click");


