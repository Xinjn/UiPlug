/* eslint-disable linebreak-style */
/* eslint-disable consistent-this */
/* eslint-disable func-names */
/* eslint-disable func-style */
/* eslint-disable no-use-before-define */
import defaultImg from "../assets/index.png";

// 判断设备平台
function isMobile() {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return true; // 移动端
  } else {
    return false; // PC端
  }
}

// 图片初始值
const cutImages = [defaultImg];
// const cutImages = [];

// 实例化UI插件
let uiPlugStatus = false;
document.onreadystatechange = function() {
  if (
    document.readyState === "interactive" ||
    document.readyState == "complete"
  ) {
    if (!uiPlugStatus) {
      new UiPlug(cutImages);
      uiPlugStatus = true;
    }
  }
};

// UI走查工具
function UiPlug(cutImages) {
  this.root = document.querySelector("body");
  // 获取根fontsize
  this.rootFZ = document.documentElement.style.fontSize
    ? document.documentElement.style.fontSize.replace("px", "")
    : 37.5;

  // 初始值
  this.show = false; // 是否显示蒙层
  this.currentImg = 0; // 当前图片索引
  this.curPer = 0.6; // 当前透明度
  this.cutImages = cutImages.length > 0 ? cutImages : []; // 图片集
  this.imgFixed = false; // 是否固定图片位置
  this.scrollTogther = false; // 是否一起滚动
  this.lockToggle = false; // 是否冻结
  this.showToggle = false; // 是否显示
  this.flowToggle = true; // 是否跟随
  // 方法：创建ui-div标签并指定类型
  this.createEle = function(ele, cls) {
    const resEle = document.createElement(ele || "ui-div");

    if (cls) {
      resEle.classList.add(cls);
    }

    return resEle;
  };

  // 创建元素：（ui）容器
  this.initUiplug = function() {
    this.uiPlug_root = null;
    if (document.querySelector("#UIPlug_root")) {
      this.uiPlug_root = document.querySelector("#UIPlug_root");
    } else {
      this.uiPlug_root = this.createEle("ui-div", "UIPlug_root");
      this.root.appendChild(this.uiPlug_root);
      this.uiPlug_root.id = "UIPlug_root";
    }

    // 初始化图片蒙层
    this.img = this.createEle("img");
    this.img.src =
      this.cutImages.length > 0 ? this.cutImages[this.currentImg] : ""; // 初始化图片为第一张

    // 设置图片样式
    this.img.setAttribute("id", "ui_img");
    // 平台判断
    if (isMobile()) {
      this.img.style.width = "100%";
    } else {
      this.img.style.width = "1920px";
    }
    this.img.style.opacity = this.curPer;
    this.img.style.position = "absolute";
    this.img.style.top = 0;
    this.img.style.zIndex = 100;
    this.img.style.pointerEvents = "none";
    this.root.appendChild(this.img);

    // 自适应计算图片位置
    const _this = this;

    function imgSelf() {
      // 获取屏幕宽度1920 A
      const clientWidth = parseInt(_this.img.style.width, 10);
      // 获取正文宽度 B
      const bodyWidth = document.body.scrollWidth;
      // 计算图片移动的位移 C
      const imgLeft = clientWidth - bodyWidth;

      _this.img.style.left = `-${imgLeft}px`;
    }
    // 监听屏幕变换
    window.addEventListener("resize", init);
    // 定义函数

    function init() {
      imgSelf();
    }

    // 功能面板
    this.ui_wrap = this.createEle("ui-div", "ui_wrap");
    this.uiPlug_root.appendChild(this.ui_wrap);
    this.ui_model = this.createEle("ui-div", "ui_model");
    this.ui_wrap.appendChild(this.ui_model);
    // logo
    this.logo = this.createEle("ui-div", "ui_logo");
    this.logo.innerHTML = "<div>UI PlugIns</div>";
    this.ui_model.appendChild(this.logo);
    // 冻结UI
    this.lock = this.createEle("ui-div", "ui_lock");
    this.lock.innerHTML = `
                            <div class="ui_radio"></div>
                            <div class="ui_radioTitle">自动</div>
                            `;
    this.ui_model.appendChild(this.lock);
    // 显示UI
    this.show = this.createEle("ui-div", "ui_show");
    this.show.innerHTML = `
                            <div class="ui_radio"></div>
                            <div class="ui_radioTitle">显示</div>
                            `;
    this.ui_model.appendChild(this.show);
    // 实时UI
    this.flow = this.createEle("ui-div", "ui_flow");
    this.flow.innerHTML = `
                            <div class="ui_radio"></div>
                            <div class="ui_radioTitle">冻结</div>
                        `;
    this.ui_model.appendChild(this.flow);
    // 不透明度UI
    this.sliderBar = this.createEle("ui-div", "ui_sliderBar");
    this.sliderBar.innerHTML = `
                                        <input class="ui_slider" type="range" value="60"/>
                                        <input class="ui_sliderInput" type="text" value="60%" readonly/>
                                        `;
    this.ui_model.appendChild(this.sliderBar);

    // 尺寸面板
    this.ui_match = this.createEle("ui-div", "ui_match");
    this.ui_wrap.appendChild(this.ui_match);
    // 上传UI
    this.upload = this.createEle("ui-div", "ui_upload");
    this.upload.innerHTML = `
                                    
                                    <button><img src="https://x0.ifengimg.com/ucms/2022_11/3E7E86CE0445AFDF3F838B098E76979095F26262_size7_w512_h512.png" border="0">点击添加图片</button>
                                    <input type="file" style="display: none" accept="image/*"/>
                                    `;
    this.ui_match.appendChild(this.upload);

    // size容器
    this.ui_size = this.createEle("ui-div", "ui_size");
    this.ui_match.appendChild(this.ui_size);
    // 宽度UI
    this.widthBtn = this.createEle("ui-div", "ui_widthBtn");
    this.widthBtn.innerHTML =
      '<input type="text" class="ui_input" placeholder="width"/>';
    this.ui_size.appendChild(this.widthBtn);
    // 高度UI
    this.ui_heightBtn = this.createEle("ui-div", "ui_heightBtn");
    this.ui_heightBtn.innerHTML =
      '<input type="text" class="ui_input" placeholder="height"/>';
    this.ui_size.appendChild(this.ui_heightBtn);
    // leftUI
    this.leftBtn = this.createEle("ui-div", "ui_leftBtn");
    this.leftBtn.innerHTML =
      '<input type="text" class="ui_input" placeholder="left"/>';
    this.ui_size.appendChild(this.leftBtn);
    // topUI
    this.topBtn = this.createEle("ui-div", "ui_topBtn");
    this.topBtn.innerHTML =
      '<input type="text" class="ui_input" placeholder="top"/>';
    this.ui_size.appendChild(this.topBtn);

    // pageWrap容器
    this.ui_pageWrap = this.createEle("ui-div", "ui_pageWrap");
    this.ui_match.appendChild(this.ui_pageWrap);
    // 上页下页UI
    this.page = this.createEle("ui-div", "ui_page");
    this.page.innerHTML = `
                                <div class="ui_add">
                                    <div class="ui_icon">
                                        +
                                    </div>
                                </div>
                                <div class="ui_sub">
                                    <div class="ui_icon">
                                        -
                                    </div>
                                </div>
                                `;
    this.ui_pageWrap.appendChild(this.page);
    // 页数UI
    this.imgNum = this.createEle("ui-div", "ui_imgNum");
    this.imgNum.innerHTML = `<div">1/${this.cutImages.length}</div>`;
    this.ui_pageWrap.appendChild(this.imgNum);

    // 逻辑
    this.lockPlug(); // 冻结逻辑（自动)
    this.switchPlug(); // 按钮逻辑
    this.flowPlug(); // 实时逻辑（冻结）
    this.alphaPlug(); // 不透明度逻辑
    this.uploadPlug(); // 上传逻辑
    this.sizePlug(); // 尺寸逻辑
    this.pagePlug(); // 上下页逻辑

    this.img.style.display = "none";
  };

  // (逻辑) 设置冻结
  this.lockPlug = function() {
    const _this = this;
    const lockInput = document.querySelector(".UIPlug_root .ui_lock");
    const radio = document.querySelector(".UIPlug_root .ui_lock .ui_radio");

    // 初始化
    // radio.classList.add("current");

    lockInput.addEventListener("click", (e) => {
      if (this.cutImages.length <= 0) {
        alert("暂无预览，请上传设计稿");
        return;
      }
      this.lockToggle = !this.lockToggle;

      if (!this.lockToggle) {
        // 移除
        radio.classList.remove("current");
        // const scrollTop =
        //   document.documentElement.scrollTop || document.body.scrollTop;

        // _this.img.style.position = "fixed";
        // _this.img.style.top = `${-scrollTop}px`;

        _this.imgFixed = true;
      } else {
        // 选中
        radio.classList.add("current");
        _this.img.style.position = "absolute";

        //按钮还原
        const widthBtn = document.querySelector(
          ".UIPlug_root .ui_widthBtn .ui_input"
        );
        const heightBtn = document.querySelector(
          ".UIPlug_root .ui_heightBtn .ui_input"
        );
        const leftBtn = document.querySelector(
          ".UIPlug_root .ui_leftBtn .ui_input"
        );
        const topBtn = document.querySelector(
          ".UIPlug_root .ui_topBtn .ui_input"
        );
        widthBtn.value = window.innerWidth;
        heightBtn.value = window.innerHeight;
        leftBtn.value = 0;
        topBtn.value = 0;

        const uiImg = document.getElementById("ui_img");
        // 图片还原
        uiImg.style.width = `${window.innerWidth}px`;
        uiImg.style.height = `${document.body.offsetHeight}px`;
        uiImg.style.top = 0;
        uiImg.style.left = 0;

        const alphaSlider = document.querySelector(
          ".UIPlug_root .ui_sliderBar .ui_slider"
        );
        const alphaSliderInput = document.querySelector(
          ".UIPlug_root .ui_sliderInput"
        );
        alphaSlider.value = 60;
        alphaSliderInput.value = `${60}%`;
        _this.img.style.opacity = 60 * 0.01;

        _this.imgFixed = false;
      }
    });
  };
  // （逻辑）开关
  this.switchPlug = function(params) {
    const _this = this;
    const showInput = document.querySelector(".UIPlug_root .ui_show");
    const radio = document.querySelector(".UIPlug_root .ui_show .ui_radio");

    // 监听点击事件
    showInput.addEventListener("click", (e) => {
      if (this.cutImages.length <= 0) {
        alert("暂无预览，请上传设计稿");
        return;
      }
      this.showToggle = !this.showToggle;

      if (!this.showToggle) {
        // 移除
        radio.classList.remove("current");

        _this.img.style.display = "none";
        _this.show = false;
      } else {
        // 选中
        radio.classList.add("current");

        _this.img.style.display = "block";
        _this.show = true;
      }
    });

    // 不展示按钮
    // closeBtn.addEventListener("click", (e) => {
    //   _this.uiPlug_root.parentElement.removeChild(_this.uiPlug_root);
    //   _this.img.parentElement.removeChild(_this.img);
    // });
  };

  // (逻辑) 设置跟随
  this.flowPlug = function() {
    const _this = this;
    const flowInput = document.querySelector(".UIPlug_root .ui_flow");
    const radio = document.querySelector(".UIPlug_root .ui_flow .ui_radio");

    // 初始化
    radio.classList.add("current");
    // 重新设置图片跟随
    flowInput.addEventListener("click", (e) => {
      if (this.cutImages.length <= 0) {
        alert("暂无预览，请上传设计稿");
        return;
      }
      this.flowToggle = !this.flowToggle;

      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const img_y = _this.img.getBoundingClientRect().y;

      if (this.flowToggle) {
        // 选中
        radio.classList.add("current");
        // 跟随
        _this.img.style.position = "absolute";
        _this.img.style.top = `${scrollTop + img_y}px`;

        _this.scrollTogther = true;
      } else {
        // 移除
        radio.classList.remove("current");
        _this.img.style.position = "fixed";
        _this.img.style.top = `${img_y}px`;
        _this.scrollTogther = false;
      }
    });
  };
  // (逻辑) 设置不透明度滑轮
  this.alphaPlug = function() {
    const _this = this;
    const alphaSlider = document.querySelector(
      ".UIPlug_root .ui_sliderBar .ui_slider"
    );
    const alphaSliderInput = document.querySelector(
      ".UIPlug_root .ui_sliderInput"
    );

    alphaSlider.addEventListener("input", (e) => {
      const value = e.target.value;
      alphaSliderInput.value = `${value}%`;
      _this.img.style.opacity = value * 0.01;
    });
  };

  // (逻辑) 上传
  this.uploadPlug = function() {
    const _this = this;
    // 获取元素
    const uploadBtn = document.querySelector(".UIPlug_root .ui_upload");
    const input = document.querySelector(".UIPlug_root .ui_upload input");
    const num = document.querySelector(".UIPlug_root .ui_imgNum");

    // 事件监听
    uploadBtn.addEventListener("click", (e) => {
      input.click();
    });
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      try {
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          //   // 首次为空手动更新src
          //   if (_this.cutImages.length === 0) {
          _this.img.src = e.target.result;
          //   }
          // 适配尺寸
          _this.img.style.width = `${window.innerWidth}px`;
          _this.img.style.height = `${document.body.offsetHeight}px`;
          _this.img.style.top = 0;
          _this.img.style.left = 0;
          // 成功读取文件
          // 插入数组
          _this.cutImages.push(e.target.result);
        };
      } catch (error) {
        alert(error);
      }

      num.innerHTML = `${_this.currentImg + 1}/${this.cutImages.length + 1}`;
    });
  };

  // (逻辑) 设置图片尺寸
  this.sizePlug = function() {
    const _this = this;

    const widthBtn = document.querySelector(
      ".UIPlug_root .ui_widthBtn .ui_input"
    );
    const heightBtn = document.querySelector(
      ".UIPlug_root .ui_heightBtn .ui_input"
    );
    const leftBtn = document.querySelector(
      ".UIPlug_root .ui_leftBtn .ui_input"
    );
    const topBtn = document.querySelector(".UIPlug_root .ui_topBtn .ui_input");

    let uiImg = document.getElementById("ui_img");

    //设置初始值
    widthBtn.value = window.innerWidth;
    heightBtn.value = window.innerHeight;
    leftBtn.value = 0;
    topBtn.value = 0;

    // 设置宽度
    widthBtn.addEventListener("change", (e) => {
      uiImg.style.width = `${e.target.value}px`;
    });
    // 设置高度
    heightBtn.addEventListener("change", (e) => {
      uiImg.style.height = `${e.target.value}px`;
    });
    // 设置left
    leftBtn.addEventListener("change", (e) => {
      uiImg.style.left = `${e.target.value}px`;
    });
    // 设置top
    topBtn.addEventListener("change", (e) => {
      uiImg.style.top = `${e.target.value}px`;
    });
  };
  // (逻辑) 设置上下页
  this.pagePlug = function() {
    if (this.cutImages.length === 0) {
      return;
    }
    const _this = this;

    const addBtn = document.querySelector(".UIPlug_root .ui_page .ui_add");
    const subBtn = document.querySelector(".UIPlug_root .ui_page .ui_sub");
    const num = document.querySelector(".UIPlug_root .ui_imgNum");

    // 上一页
    addBtn.addEventListener("click", () => {
      change(true);
    });
    // 下一页
    subBtn.addEventListener("click", () => {
      change(false);
    });

    function change(add) {
      const imgsLength = _this.cutImages.length;

      if (add && _this.currentImg + 1 < imgsLength) {
        // +1
        _this.currentImg += 1;
        if (_this.imgFixed) {
          this.lockPlug();
        }
      } else if (add === false && _this.currentImg + 1 > 1) {
        // -1
        _this.currentImg -= 1;
        if (_this.imgFixed) {
          this.lockPlug();
        }
      }

      _this.img.src = _this.cutImages[_this.currentImg];
      num.innerHTML = `${_this.currentImg + 1}/${imgsLength}`;
    }
  };

  // 初始化容器
  this.initUiplug();
}

// style标签
const style = document.createElement("style");

style.type = "text/css";
style.innerHTML = `
    /* 基础DOM */
    .ui-div { 
        display: block; 

    }

    /* 根节点 */
    .UIPlug_root {
        box-sizing: border-box;
        font-family: 'miui', 'PingFangSC-Regular', 'Pingfang SC', 'Hiragino Sans GB', 'Noto Sans', 'Microsoft YaHei';
        width:100%;
        border-top: 1px solid #ddd;
        background: #fff;
        margin: 0;
        padding: 5px;
        display:flex;
        flex-direction:column;
        position: fixed;
        left:0;
        bottom:0;
        z-index: 1000;
        padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
        padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
    }

    /* 总容器 */
    .UIPlug_root .ui_wrap{
        border:1px solid #EBEDF0;
        border-radius:5px;
    }

    /* 功能面板 */
    .UIPlug_root .ui_model { 
        // border:1px solid black;
        box-sizing: border-box;
        display:flex;
        justify-content:center;
        align-items:center;
        padding-top:5px;
        padding-bottom:5px;
        padding-left:5px;
        padding-right:5px;
    }

    /* Logo容器 */           
    .UIPlug_root .ui_logo {
        // border:1px solid red;
        color:#5893EB;
        font-size:12px;
        font-weight: bold;
        white-space:nowrap;  
        flex:auto;
        text-align:center;
        margin-right:5px;
    }

    /* 冻结容器 */           
    .UIPlug_root .ui_lock {
        // border:1px solid red;
        display: flex;
        cursor:pointer;
        margin-right:3px;
    }
    /* 冻结按钮 */   
    .UIPlug_root .ui_lock .ui_radio{
            width: 10px;
            height: 10px;
            border:3px solid #5E5F69;
            background:#fff;
            border-radius:50%
     
    }
    /* 冻结按钮 选中*/         
    .UIPlug_root .ui_lock  .ui_radio.current{
        background:#F19F38;
    }
    /* 冻结标题 */  
    .UIPlug_root .ui_lock  .ui_radioTitle{
        // margin-left:3px;
        white-space:nowrap;
        font-weight: bold;
        color:#F3A84D;
    }



    /* 显示容器 */           
    .UIPlug_root .ui_show {
        // border:1px solid red;
        display: flex;
        cursor:pointer;
        margin-right:3px;
    }
    /* 显示按钮 */   
    .UIPlug_root .ui_show .ui_radio{
        width: 10px;
        height: 10px;
        border:3px solid #5E5F69;
        background:#fff;
        border-radius:50%
    }  
    /* 显示按钮 选中*/         
    .UIPlug_root .ui_show  .ui_radio.current{
        background:#F19F38;
    }    
    /* 显示文本 */  
    .UIPlug_root .ui_show .ui_radioTitle{
        // margin-left:3px;
        white-space:nowrap;
        font-weight: bold;
        color:#F3A84D;
    }
    
    /* 跟随容器 */ 
    .UIPlug_root .ui_flow {
        // border:1px solid red;
        display: flex;
        cursor:pointer;
        margin-right:3px;
    }
    /* 跟随按钮 */ 
    .UIPlug_root .ui_flow .ui_radio{
        width: 10px;
        height: 10px;
        border:3px solid #5E5F69;
        background:#fff;
        border-radius:50%
    }
    /* 跟随按钮 选中*/         
    .UIPlug_root .ui_flow  .ui_radio.current{
        background:#F19F38;
    }   
    /* 跟随文本 */ 
    .UIPlug_root .ui_flow .ui_radioTitle{
        // margin-left:3px;
        white-space:nowrap;
        font-weight: bold;
        color:#F3A84D;
    }


    /* 不透明度滚轮容器 */ 
    .UIPlug_root .ui_sliderBar {
        // border:1px solid red;
        display: flex;
    }
    /* 不透明度滚轮条 */ 
    .UIPlug_root .ui_sliderBar .ui_slider{
        max-width:90px;
    }
    /* 不透明度滚轮条 */ 
    .UIPlug_root .ui_sliderBar input[type='range']::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        // border: none;
        // outline:none;
        // width: 25em;
        // height: 1.25em;
        // border-radius: 6.25em;
        // box-shadow: 
        //     inset 0 1px 1px #e1e1e1,
        //     inset 0 0 0 0.5em #f5f5f5,
        //     inset 0 1px 1px 0.5em #a5a5a5,
        //     inset 0 -1px 0 0.5em #fff;
        // background: #fff;
    }
    /* 不透明度滚轮轴 */ 
    .UIPlug_root .ui_sliderBar input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        // // margin-top: -0.25em;
        // border: none;
        // width: 1.75em;
        // height: 1.75em;
        // border-radius: 50%;
        // box-shadow: 
        //     inset 0 -0.125em 0.125em #949494,
        //     inset 0 0 0 0.25em #bbb,
        //     inset 0 1px 0.125em 0.25em #676767;
        // background: #888;
    }
    /* 不透明度滚轮Text */ 
    .UIPlug_root .ui_sliderBar .ui_sliderInput{
        // margin-left:3px;
        width:30px;
        border:1px solid #BFBFBF;
        color:#BFBFBF;
        border-radius:3px;
        outline:none;
        text-align:center;
    }


    /* 尺寸面板 */
    .UIPlug_root .ui_match { 
        // border:1px solid black;
        box-sizing: border-box;
        display:flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom:5px;
        padding-left:5px;
        padding-right:5px;
    }

    /* 上传容器 */
    .UIPlug_root .ui_match .ui_upload{
        // border:1px solid red;
        flex:1;
        margin-right:5px;
    }
    /* 上传按钮 */
    .UIPlug_root .ui_match .ui_upload button{
        border:none;
        outline:none;
        background:#4A8AE9;
        color:#fff;
        border-radius:3px;
        height:25px;
        white-space:nowrap;  
        width:100%;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .UIPlug_root .ui_match .ui_upload button img{
        width:15px;
        height:15px;
        margin-right:3px;
    }
    
    /* size容器 */
    .UIPlug_root .ui_match .ui_size{
        display:flex;
        justify-content: center;
        align-items: center;

    }
    /* 尺寸容器 */
    .UIPlug_root .ui_match .ui_input{
        width:35px;
        height:20px;
        border:1px solid #BFBFBF;
        border-radius:3px;
        outline:none;
        text-align:center;
        margin-left:5px;
  
    }

    /* pageWrap容器 */
    .UIPlug_root .ui_match .ui_pageWrap{
        display:flex;
        align-items: center;
        display:none;
    }
    /* 切换容器 */ 
    .UIPlug_root .ui_page {
        width: 57px;
        height: 26px;
        background: #4A8AE9;
        border-radius: 20px;
        display:flex;
        justify-content:space-between;
        align-items: center;
        cursor:pointer;
        margin-right:5px;
    }
    /* 切换+ */ 
    .UIPlug_root .ui_page .ui_add{
        width: 20px;
        height:20px;
        background: #FFFFFF;
        border-radius: 10px;
        font-weight: bold;
        // display: flex;
        // align-items: center;
        // justify-content:center;
        cursor:pointer;
        margin-left:4px;
    }
    /* 切换- */ 
    .UIPlug_root .ui_page .ui_sub{
        width: 20px;
        height:20px;
        background: #FFFFFF;
        border-radius: 10px;
        // display: flex;
        // align-items: center;
        // justify-content:center;
        cursor:pointer;
        margin-right:4px;

    }
    .UIPlug_root .ui_page .ui_icon{
        color:#4A8AE9;
        font-weight: bold;
        font-size: 20px;
        position:relative;
        top:-6px;
        left:4px;
    }
    /* 页数容器 */ 
    .UIPlug_root .ui_imgNum {
        color:#BFBFBF;
        width: 30px;
        font-weight: bold;
        font-size: 11px;
        text-align:center;
        border:1px solid #BFBFBF;
        border-radius:3px;
    }

    /* 图片 */
    .UIPlug_root .changeImgs { 
        border:1px solid red;
        position: fixed;
        bottom: 30px;
        right: 20px;
        z-index: 100;
    }
    .UIPlug_root .changeImgs .btn {
        border:1px solid green;
        font-size: 0.3rem; 
        float: left;
        background: #ccc;
        text-align: center;
        box-sizing: border-box;
    }
    .UIPlug_root .changeImgs .btn.num { 
        background: none; 
    }
    .UIPlug_root .changeImgs .btn.btn_fixed { 
        border:1px solid blue;
        margin-right: 0.8rem;
        position: relative;
    }
    .UIPlug_root .changeImgs .btn.btn_st { 

        position:absolute;
        top:30px;
        left:0;
        white-space:nowrap;
        border-radius: 10px;
    }
    `;

document
  .getElementsByTagName("head")
  .item(0)
  .appendChild(style);
