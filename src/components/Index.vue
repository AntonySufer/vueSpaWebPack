<template>
      <!--内容区域 S-->
<div class="shopmanmain wx_guanlian bghui lh40" >
    <!--头部用户信息 S-->
    <div class="vip_top_box">
        <div class="vip_pic">
            <img v-bind:src= "head_img_url " alt="" class="vip_pic_img">
        </div>
        <div class="vip_inf_box">
            <span class="vip_user_name" v-text="vip_user_name"></span>
            <!--<p class="vip_user_number">会员号：1125467</p>-->
            <a href="javascript:;" class="btn_yz_false " style="display: none">未验证</a>
            <a href="javascript:;" class="btn_yz_true" style="display: none">已验证</a>
        </div>
    </div>
    <!--头部用户信息 E-->

    <!--关于自己 S-->
    <div class="vip_myself_box">
        <ul class="vip_myself_list">
            <li @click="orderListUrl()">
                <a href="javascript:;">
                    <span class="vip_myself_icon1 sp"></span>
                    <span class="vip_myself_s2">消费记录</span>
                    <span class="vip_myself_s3">></span>
                </a>
            </li>
            <li @click="myShopsUrl()">
                <a href="javascript:;">
                    <span class="vip_myself_icon2 sp"></span>
                    <span class="vip_myself_s2">我的店</span>
                    <span class="vip_myself_s3">></span>
                </a>
            </li>
            <li @click="myCardUrl()">
                <a href="javascript:;">
                    <span class="vip_myself_icon3 sp"></span>
                    <span class="vip_myself_s2">我的消费卡</span>
                    <span class="vip_myself_s3">></span>
                </a>
            </li>
        </ul>

    </div>
    <!--关于自己 E-->
    <!--意见反馈 S-->
    <div class="feedback_box">
        <div class="feedback_event" >
            <a v-link="{ path: '/feedBack'}">
                <span class="vip_myself_icon4 sp"></span>
                <span class="vip_myself_s2">意见反馈</span>
                <span class="vip_myself_s3">></span>
            </a>
        </div>
    </div>
    <!--意见反馈 E-->

</div>

</template>

<script>
import * as ajaxUtil from '../util/Ajax.js'; //ajax 请求
let store =require("store"); //存储js
export default {
  data () {
	   return {
       head_img_url: "",
       accessToken :"",
       openId :"",
       vip_user_name:"",
       relation_status:true //是否强关联
     }
  },
  
  beforeCompile(){

            //清理全部localStore
            localStorage.clear();
            sessionStorage.clear();
            var _this=this;
            //设置全局变量
            var mpGlobal={
                openId:GLOBAL.openId,
                accessToken:GLOBAL.accessToken
            };
            store.remove("mpGlobal");
            store.set("mpGlobal",mpGlobal);
 
             _this.accessToken = store.get('mpGlobal').accessToken || GLOBAL.accessToken;
             _this.openId = store.get('mpGlobal').openId || GLOBAL.openId;
            if (!_this.accessToken) {
                  console.log('没有获取到accessToken!');       
            }if (!_this.openId) {
                  console.log('没有获取到openid!');       
            }
            
            var isFirstShow = sessionStorage.getItem('isFirstShow');;//是否第一次进入页面
            var isAllowPosition = store.get('isAllowPosition') || "";//是否第一次进入页面
                if (isFirstShow != 0 || !isAllowPosition) {
                    //获取位置
                   _this.getCoords();  
                }
  },
  ready () {

           var _this =this;
            var mpGlobal = store.get("mpGlobal");
            var openId = mpGlobal.openId;
            var accessToken = mpGlobal.accessToken;

            ajaxUtil.getUserInfo({
                openId:openId,
                accessToken:accessToken
            },function(jsonData){
              console.log("hehe"+JSON.stringify(jsonData) );
                if(jsonData){
                    _this.relation_status = jsonData.strongCorrelation;
                     store.set("strongCorrelation",_this.relation_status);//强关联标识 很重要
                    _this.vip_user_name=jsonData.wechatAlias || "张三";
                    _this.head_img_url = jsonData.wechatUserImg;
                    //add mpGlobal appId;
                    var mpGlobal = store.get("mpGlobal");
                        if(mpGlobal.appId){
                            store.remove(mpGlobal.appId);
                            mpGlobal.appId=jsonData.appId;
                            store.set("mpGlobal",mpGlobal)
                        }else{
                            mpGlobal.appId=jsonData.appId;
                            store.set("mpGlobal",mpGlobal)

                        }
                }
            })
 
  },
  methods:{
        orderListUrl(){
             var _this = this ;
              ajaxUtil.doPost({
                url:request.user.fetchOrderList+_this.openId + "/orders",
                data:{token:_this.accessToken,offset:0,limit:1}
               },(jsonData)=>{
                   if (jsonData.returnCode =="success") {
                        sessionStorage.setItem('isFirstShow',0);  //是否第一次进入页面
                     
                       var  resultList = jsonData.orders;
                           if (resultList != null && resultList.length > 0) {
                                store.set("scrollTop",0);//重置列表页的滚动条  
                                //跳到列表  入口来源orally=info
                                this.$router.replace('/orderList'); //回到首页
                          }else{
                                 if (_this.relation_status) {
                                  window.location.href =GLOBAL.contextPath+ "order-order_list?orally=info"
                                 }else{
                                   window.location.href =GLOBAL.contextPath+ "/shop-self_no_ref_shop"+"?from=orderList";
                                 }
                           }
                       
                     }else{  
                        console.log("错误日志："+jsonData.returnCode);
                     }
             });  
            
            },
            myShopsUrl(){
              /*  var _this = this ;
            $.fetchAjaxData({
                url:request.shop.fetchUserBindshopLis+"/"+_this.openId+"/shops",
                async:false,//同步
                data:{token:_this.accessToken,offset:0,limit:1}
                },function(jsonData){
                     if (jsonData.returnCode =="success") {
                          sessionStorage.setItem('isFirstShow',0);//是否第一次进入页面
                        var resultList =jsonData.shops;
                           if (resultList != null && resultList.length > 0) {
                                 //跳到列表  入口来源orally=info
                                 window.location.href =GLOBAL.contextPath+ "/shop-self_ref_shop_lis?orally=info";
                          }else{
                                 if (_this.relation_status) {
                                    //跳到列表  入口来源orally=info
                                      window.location.href =GLOBAL.contextPath+ "/shop-self_ref_shop_lis?orally=info"
                                 }else{
                                   window.location.href =GLOBAL.contextPath+ "/shop-self_no_ref_shop"+"?from=shopList";
                                 }
                           }
                     }else{  
                        console.log("错误日志："+jsonData.returnCode);
                     }
            
                   });
                        */
            },
            myCardUrl(){
                //消费卡
          /*  var _this = this;
              $.fetchAjaxData({
                url:request.user.fetchCardList+_this.openId + "/cards",
                async:false,//同步
                data:{token:_this.accessToken,offset:0,limit:1}
                },function(jsonData){
                     if (jsonData.returnCode =="success") {
                          sessionStorage.setItem('isFirstShow',0);//是否第一次进入页面
                         var resultList = jsonData.cards;
                           if (resultList != null && resultList.length > 0) {
                              //跳到列表  入口来源orally=info
                                 window.location.href =GLOBAL.contextPath+ "card-self_card_list?orally=info";
                          }else{
                                 if (_this.relation_status) {
                                    //跳到列表  入口来源orally=info
                                      window.location.href =GLOBAL.contextPath+ "card-self_card_list?orally=info"
                                 }else{
                                   window.location.href =GLOBAL.contextPath+ "/shop-self_no_ref_shop"+"?from=cardList";
                                 }
                           }
                     }else{  
                        console.log("错误日志："+jsonData.returnCode);
                     }
            
                   });*/
            },
            // 获取地理位置
            getCoords() {
              var  _this =  this ;
                if (navigator.geolocation) {
                navigator.geolocation.watchPosition(
                 function(data) {
                    // h5采集到经纬度
                    
                    var longitude = data.coords.longitude; // 113.94//经度
                    var latitude = data.coords.latitude; // 22.54879//纬度
                    console.log('进入获取经纬度'+longitude+"///"+latitude);
                    // 获取附近店铺
                    store.set("isAllowPosition","true");//是否获取位置
                    store.set("latitude", latitude);
                    store.set("longitude", longitude);
                        // errorMsg
                }, function(data) {
                    
                     /* UNKNOW_ERROR：表示不包括在其它错误代码中的错误，这里可以在 message 中查找错误信息
                     * 1、PERMISSION_DENIED：表示用户拒绝浏览器获取位置信息的请求 2、
                     * POSITION_UNAVALIABLE：表示网络不可用或者连接不到卫星
                     *3、TIMEOUT：表示获取超时。必须在options中指定了timeout值时才有可能发生这种错误
                     */
                    if (data.code == "1") {
                        console.log('用户拒绝获取位置信息'+data.message);
                        
                    }else if(data.code == "2"){
                         console.log('数据获取失败');
                    }else if(data.code == "3"){
                         console.log('请求超时');
                    }
                    
                    store.set("isAllowPosition",'');//是否获取位置
          
                }, {
                    enableHighAcuracy : true,
                    timeout : 5000,
                    maximumAge : 10000 //缓存位置时间  毫秒， 过了就重新获取
                });
              }
        }
    }
}
</script>
<style type="text/css">
  /*超出显示省略号（1行）*/
.hid_slh1{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;-webkit-text-overflow:ellipsis;}
/*超出显示省略号（2行）*/
.hid_slh2{overflow : hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;}
.hid_slh2{overflow : hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;}
/*雪碧图*/
.sp{background: url("/resources/images/meirong/shop/20160718_yy_fwh/my_xf_sp.png") no-repeat;}
/*头部用户信息*/
.vip_top_box{width: 640px; height: 200px; background: url("/resources/images/meirong/shop/20160718_yy_fwh/my_xf_top_bg.jpg") no-repeat;}
.vip_pic{width: 120px; height: 120px; margin:40px 0 0 32px; float: left;}
.vip_pic_img{display: block; width: 120px; height: 120px; border-radius: 120px;}
.vip_inf_box{width: 400px; height: 120px;  margin:40px 0 0 30px; float: left; }
.vip_user_name{display: block;height: 120px; line-height: 120px; color: #ffffff; font-size: 32px; margin: 0 10px 0 0; float: left; }
.vip_user_number{width: 400px; height: 60px; line-height: 50px; color: #ffffff; font-size: 24px; margin: 0px;}

/*未验证*/
.btn_yz_false{display: block; width: 88px; height: 30px; color: #8b81dc; font-size: 18px; text-align: center; border: 1px solid #8b81dc; float: left; border-radius: 50px; line-height: 30px; text-decoration: none; margin: 48px 10px 0 0;}
.btn_yz_false:hover{color: #8b81dc;}

/*已验证*/
.btn_yz_true{display: block; width: 88px; height: 30px; color: #f89954; font-size: 18px; text-align: center; border: 1px solid #f89954; float: left; border-radius: 50px; line-height: 30px; text-decoration: none; margin: 48px 10px 0 0;}
.btn_yz_true:hover{color: #f89954;}


/*交易状态*/
.jy_anarchy{width: 640px; height: 150px; background-color: #fff;}
.jy_anarchy_list{width: 640px; height: 150px; margin: 0px;}
.jy_anarchy_list li{width: 213px; height: 98px; border-right:1px solid #e4e4e4; margin-top: 26px;  float: left; }
.jy_anarchy_list .jy_anarchy_li2{border-right:0px;}

.jy_anarchy_list li a{display: block; width: 213px; height: 98px; text-decoration: none;}
.jy_anarchy_s1{display: block; width: 213px; height: 49px; text-align: center; line-height: 60px; font-size: 30px; color: #7c7c7c;}
.jy_anarchy_s2{display: block; width: 213px; height: 49px; text-align: center; line-height: 45px; font-size: 36px; color: #444444; }

/*关于自己*/
.vip_myself_box{width: 640px; overflow: hidden; background-color: #fff; margin-top: 20px;}
.vip_myself_list{width: 580px; overflow: hidden; margin: 0 auto 0;}
.vip_myself_list li{width: 580px; height: 88px; border-bottom: 1px solid #e4e4e4; }

.vip_myself_list li:last-child{border-bottom: 0px;}

.vip_myself_list li a{display: block; width: 580px; height: 88px; }

.vip_myself_icon1{display: block; width: 46px; height: 46px; background-position: 0 -519px; margin: 21px 0 0 0; float: left;}
.vip_myself_icon2{display: block; width: 46px; height: 46px; background-position: -53px -519px; margin: 21px 0 0 0; float: left;}
.vip_myself_icon3{display: block; width: 46px; height: 46px; background-position: -115px -519px; margin: 21px 0 0 0; float: left;}
.vip_myself_icon4{display: block; width: 46px; height: 46px; background-position: -175px -519px; margin: 21px 0 0 0; float: left;}

.vip_myself_s2{display: block; width: 514px; height: 46px; background-position: 0 -519px; margin: 21px 0 0 0; text-indent: 16px; color: #7c7c7c; font-size: 30px; line-height: 46px; float: left;}
.vip_myself_s3{display: block; width: 20px; height: 34px; color: #b3b3b3; font-size: 40px; text-align: center; line-height: 10000px; float: left; background: url("/resources/images/meirong/shop/20160718_yy_fwh/jt_sp.png") -105px -1px no-repeat; margin-top: 26px;}

/*意见反馈*/
.feedback_box{width: 640px; height: 88px; margin: 20px auto 0; background-color: #fff; }
.feedback_event{width: 580px; height: 88px; margin: 0 auto 0;}
</style>
