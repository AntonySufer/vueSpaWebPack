
<template>
    <div class="shopmanmain wx_guanlian bghui lh40" id="feedbackApp" style="margin-top: 60px;">
    <!-- 输入意见 S -->
    <div class="write_yj_box">
        <textarea name="" id="" class="write_yj_box_text" maxlength="300" placeholder="请输入您的反馈意见（300字以内）"   v-model="comment_input"  ></textarea>

        <p class="write_yj_box_num" ><span v-text='count'></span>/<span v-text="comment_max_length"></span> </p>
    </div>
    <!-- 输入意见 E -->
    <!--手机号码 S-->
    <div class="phone_number_box">
        <div class="phone_number_event">
            <span class="phone_number_s1">手机号码</span>
            <input type="tel" placeholder="选填" class="phone_number_inp fix_cursor_pos" maxlength="11" v-model="phone_number"  onkeyup="this.value=this.value.replace(/\D/g,'')" /><span class="xx" @click="clearPhone()" v-if="!verifyPhone">X</span>
        </div>
    </div>
    <!--手机号码 E-->
    <!--意见反馈 S-->
    <div class="phone_number_box" id="page-picker">
        <div class="phone_number_event">
            <span class="phone_number_s1">反 馈 给</span>
            <input type="text"  v-model="selectedShop"  class="phone_number_inp" id="picker" readonly   />
            <span class="vip_myself_s3"></span>
        </div>
    </div>
    
      <a  v-bind:class="{ 'btn_tj_red_g': notbuttonsub, 'btn_tj_red': allowtbuttonsub}" href="javascript:;"   @click ="submitBut()">提交</a>
    <!--意见反馈 E-->
    
</div>
</template>


<script>
 
 import store from 'store';
import * as ajaxUtil from '../../util/Ajax.js'; //ajax 请求
 export default {
 	//数据初始化
 	 data () {
	   return {
	        picked_shop:"",
	        phone_number:"",//电话号码
	        comment_input:"",//意见内容
	        comment_max_length:300,
	        disable:false,
	        selectedShop:"美丽加服务号",//建议对象
	        targetType : 1, //提交类型 0 店铺  1服务号
	        shopNo :"",//店铺号  提交类型为1 的时候必传
	        shop_data :"",//提交数据集
	        verifyPhone:true,//验证手机
	        notbuttonsub :true,//button样式
	        allowtbuttonsub :false,//可以提交样 式
	        selectId :""  //提交对象id
	    }
   },
    computed :{
    	//输入
        'count' : function() {
            return this.comment_input.length
        }
     },
     //数据变化监控
    watch: {
      "comment_input" : function (newVal, oldVal) {
      	
            if ( newVal && newVal.length >= this.comment_max_length) {
                this.comment_input = newVal.slice(0, this.comment_max_length);
                this.disable=true;
            }
          
           if (this.comment_input && this.verifyPhone ) {
                    this.allowtbuttonsub = true;
                    this.notbuttonsub = false;
             }else{
                    this.allowtbuttonsub = false;
                    this.notbuttonsub = true;
             }
       

       },
      "phone_number" : function(newVal,oldVal){
      	   	 var telReg =new RegExp(/^1[3-9]\d{9}$/)
                if(newVal){
                    console.log( telReg.test(newVal))
                    this.verifyPhone=telReg.test(newVal);
    
                }else{
                    this.verifyPhone=true;//现实X
                }
                
             if (this.comment_input && this.verifyPhone ) {
                    this.allowtbuttonsub = true;
                    this.notbuttonsub = false;
             }else{
                    this.allowtbuttonsub = false;
                    this.notbuttonsub = true;
             }
        }
      
    },
   beforeCompile(){
   	  document.title="意见反馈";
   	  this.getUserTel();
   },
   ready(){
   	    //获取服务列表
          this.getShoplist();

   },
   //方法
   methods:{
       //**************************绑定事件*******************************/
        	//提交
         submitBut : function(){
              var _this =this;
              if (_this.allowtbuttonsub==true && _this.notbuttonsub ==false ) {
                     if (!_this.comment_input) {
                           $.alert("请输入反馈意见!", "警告！");   
                             return;
                        }
                     if (this.verifyPhone==false) {
                     	 $.alert("请输入正确的手机号码格式!", "警告！");    
                             return;
                     }
                     var proList = _this.shop_data ||"";  
                     if (proList.length>0 && proList !="" ) {
                        for(var j = 0 ;j< proList.length;j++){
                        	    if (_this.selectedShop =="美丽加服务号") {
                        	    	 _this.shopNo = "";
                                    _this.targetType = 1;
                                    break;
                        	    }
                        	
                                if(proList[j].shopName == _this.selectedShop ){
                                    _this.shopNo =  proList[j].shopNo;
                                    _this.targetType = 0;
                                    break;
                                }
                                
                        }
                     }else{
                     	 _this.selectedShop = "美丽加服务号";//建议对象
                     	 _this.targetType = 1; //提交类型 0 店铺  1服务号
                         _this.shopNo = "";//店铺号  提交类型为1 的时候必传
                       
                     }
                     
                     if (_this.comment_input && _this.verifyPhone) {
                            _this.allowbuttonsub = true;
                            _this.commitRequse();
                     }
              }
              
              
         		
            },
         
            //清空
          clearPhone: function(){
               this.phone_number="";
            },
         //**************************绑定事件end*******************************/
            
            
         //*************************  获取数据start****************************/
            
         //获取用户手机号码 
         getUserTel: function(){
         	 /* 获取用户手机号码*/
            var _this =this;
            var accessToken = store.get('mpGlobal').accessToken || GLOBAL.accessToken;
            var openId = store.get('mpGlobal').openId || GLOBAL.openId;

            ajaxUtil.getUserInfo({
                openId:openId,
                accessToken:accessToken
            },function(jsonData){
                if(jsonData){
                _this.phone_number = jsonData.relationPhoneNo; 
                }
            })
         },
         //获取服务列表  
         getShoplist : function(){
         	    var _this =this;//注意指向当前el对象
                var accessToken = store.get('mpGlobal').accessToken || GLOBAL.accessToken;
                var openId = store.get('mpGlobal').openId || GLOBAL.openId;
                if (!accessToken) {
                       console.log('没有获取到accessToken!', {icon: 2});   
                }
               //获取
                   var  url = request.shop.fetchUserBindshopLis+"/"+openId+"/shops";
                   var  params ={
                   	    "token":accessToken,
                        "offset":'1',
                        "limit":'50'
                       };
        		    _this.$http.get(url,{params:params}).then((response) => {
        		   	// 响应成功回调
        		      	var jsonData = response.body ;
        		      	 if (jsonData.returnCode == "success") {
                     	 var shopList =jsonData.shops;
                        if (shopList != null && shopList.length > 0) {
                            for (var i = 0; i < shopList.length; i++) {
                                 shopList[i].targetType ="0";
                            }     
                        }else{
                            console.log();
                        }
                          _this.shop_data = shopList;//存储数据集
                          _this.chooseWaiter();

   
                     }else{
                        console.log("错误信息："+jsonData.errDesc+jsonData.errCode);
                     }
        		   	
        		   }, (errorEsponse) => {
        		   	    console.log(errorEsponse);
        		   	// 响应错误回调
        		   });    
         },
         //弹出列表插件
         chooseWaiter:function(){
         	var _this =this;
           //重新请求数据列表
          //  _this.getShoplist();
            //选择插件
         	var proList =  _this.shop_data;
         	
            var fnameList=["美丽加服务号"];
            //获取建议list
            if (proList !="" && proList.length>0) {
            	proList.forEach(function(item, index){
            		fnameList.push(item.shopName);
            	});
            }
 
          /**picker弹出插件*/
                 $("#picker").picker({
                     title: "请选择",
                     cols: [
                       {
                         textAlign: 'center',
                         values: fnameList
                       },
                     ],
                    onChange(p, v, endChange) {
                    	//选中
                       _this.selectedShop =endChange;
                       },
                    onClose(p, v, d) {
                       
                       }
                   });
            
          },


          //提交意见
         //*************************  获取数据start****************************/
           /***
            *  * @param openId
             * @param appId
             * @param content 反馈内容
             * @param targetType 反馈对象类型Shop(0,"店铺"), MP(1,"服务号");
             * @param phoneNo 
             * @param shopNo 店铺编号
            */
         commitRequse : function(){
         	 var _this =this;
             var openId = store.get('mpGlobal').openId || GLOBAL.openId; 
             var accessToken = store.get('mpGlobal').accessToken || GLOBAL.accessToken;
             var appId = store.get('mpGlobal').appId || GLOBAL.appId;
             var param ={
                "app_id":appId,
                "open_id":openId,
                "target_type":_this.targetType,
                "content" :_this.comment_input,
                "phone_no" :_this.phone_number,
                "shop_no":_this.shopNo
            }
             var url =request.user.feedBackAdvice+openId+"/feedback";
             	ajaxUtil.doPost({
             		url:url,
             		data:param},(jsonData)=>{
        		      	 if (jsonData.returnCode == "success") {
                             this.$router.replace('/Index'); //回到首页
                     }else{
                        console.log("错误信息："+jsonData.errDesc+jsonData.errCode);
                     }
             });	
         
         }

   }


  }



</script>

<style>
body{font-family: "微软雅黑";}

.write_yj_box{width: 640px; height: 452px; background-color: #ffffff; overflow: hidden; position: relative;} 
.write_yj_box_text{display: block; width: 640px; height: 452px; margin: 0px auto 0; border: 0px; padding: 18px; font-size: 24px; font-family: "微软雅黑";}
.write_yj_box_text:hover{border: 0px;}
.write_yj_box_text:active{border: 0px;}
.write_yj_box_num{text-align: right; color: #b3b3b3; font-size: 20px; position: absolute; bottom: 0px; right: 10px;}
.write_yj_box_num span{color: #ff5ebd;}
.phone_number_s1{display: block; width: 130px; height: 88px; color: #7c7c7c; font-size: 30px; line-height: 46px; float: left; text-align: right; line-height: 88px;}
.phone_number_inp{display: block; width: 418px; height: 88px; font-size: 24px; line-height: 88px; float: left; margin-left: 15px; text-indent: 5px; }
.phone_number_inp:focus{border: 0px;}

.vip_myself_s3{display: block; width: 20px; height: 34px; color: #b3b3b3; font-size: 40px; text-align: center; line-height: 10000px; float: left; background: url("/resources/images/meirong/shop/20160718_yy_fwh/jt_sp.png") -105px -1px no-repeat; margin-top: 26px;}

/*意见反馈*/
.phone_number_box{width: 640px; height: 88px; margin: 20px auto 0; background-color: #fff; }
.phone_number_event{width: 586px; height: 88px; margin: 0 auto 0;}

.btn_tj_red{display: block; width: 580px; height: 84px; background-color: #ff5ebd; font-size: 30px; color: #ffffff; text-align: center; line-height: 84px; margin: 60px auto 0; text-decoration: none; border-radius: 10px;}

.btn_tj_red_g{display: block; width: 580px; height: 84px; background-color: #b3b3b3; font-size: 30px; color: #ffffff; text-align: center; line-height: 84px; margin: 60px auto 0; text-decoration: none; border-radius: 10px;}

.btn_tj_red:focus{color: #fff;}
.btn_tj_red_g:focus{color: #fff;}
 .xx{display: inline-block;margin-top: 28px;font-size: 24px;color:red}
    .fix_cursor_pos{
        padding: 44px 0px;
        display:inline-block;
        line-height:25px;
    }
</style>
