 
(function(){
	 
	var wxServer = GLOBAL.wechatActionServer;
	var server =GLOBAL.saasActionServer;
	var onlinePayServer = GLOBAL.payActionServer;
	var uploadImgServer = GLOBAL.uploadImgServer;//http://upload.mljia.cn
	
	

	var request={
			shop:{
				shopInfo      : server + "/saas.shop/h5/shop/get/information", //店铺详情
				fetchShopDetails: wxServer+ "/mp/shop/detail",//获取商店详细信息
				fetchUserBindshopLis : wxServer +"/mp/user/openid/",// 店铺列表
				getShopCode : wxServer + "/mp/shop/", //获取关注店铺二维码 
				checkShopReady :wxServer +"/mp/comment/confirm",  //判断是否已经提交过评论
				getShopScore : wxServer +"/mp/comment/average/" //获取店铺的总评分
			},
			user:{
				getRelationStatusAndUserInfo   : wxServer +"/mp/user/openid/", //获取用户关联状态，微信头像、昵称等信息
				feedBackAdvice				: wxServer+"/mp/user/openid/",//意见反馈
				getverifyCode: wxServer + "/mp/user/openid/",//获取短信验证码
				submitPhoneNumber: wxServer + "/mp/user/openid/",//提交手机号
				fetchCardList:	wxServer + "/mp/user/openid/",//獲取用戶可用卡列表
				fetchOrderList : wxServer + "/mp/user/openid/", //獲取用戶可用訂單列表
				fetchOrderDetails : wxServer + "/mp/user/openid/",// 获取订单详情
				orderAssess : wxServer +"/mp/comment/submit",  //扫码评价提交
				getAssessInfo : wxServer +"/mp/comment/review",  //评价查询
				fixMakeOrder     :wxServer +"/mp/sync/data"  , //修复预约订单
				/*************1.3.2版本添加*************************/
				getRelatedAndGl :wxServer +"/mp/user/check/status", //查询用户是否关注与关联
				attentionShop :wxServer +"/mp/user/attention/shop", //关注
				relationShop :wxServer +"/mp/user/relation/shop", //申请关联
				cancelAttention :wxServer +"/mp/user/cancel/attention", //取消关注
				cancelRelation :wxServer +"/mp/user/cancel/relation", //取消关联
				/*************1.3.2版本添加*************************/

				callWXpay:              onlinePayServer +"wxpay/mppay"//发起微信支付
			},
			pay:{
				wxPay:wxServer + "/mp/wxpay/directmppay",// 微信支付
				alipay:onlinePayServer + "alipay/wap/directpay" //支付宝支付
			},
			wxSdk:{
			   wxJsSdk :wxServer+"/mp/helper/getJsSign"   //调用微信sdk
			},
			upLoadImg : {
			   upLoadImgUrl    : uploadImgServer +"/upload/cloud/image" ,   //上传本地图片
			   upLoadImgRect :uploadImgServer + "/upload/cloud/url", //上传远程图片
			   getImgId :wxServer +"/mp/upload/image" //获取上传图片的imgid
			},
           //预约
		reserved:{
			//获取微信签名信息
			getWXOrderPayInfo              :server + "/saas.order/weixin/opt/order/wxPayInfo",

			//修改预约时间
			changeReserveTim : server + "/saas.order/weixin/opt/yuyueModify",
			//取消预约
			cancelReserve    : server + "/saas.order/weixin/opt/yuyueCancel"
		}
			


			
	};
	window.request=request;

	// 对Date的扩展，将 Date 转化为指定格式的String   
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
	// 例子：   
	// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
	// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
	 if(!Date.prototype.format){
			Date.prototype.format =function(format){
				var o = {
				"M+" : this.getMonth()+1, //month
				"d+" : this.getDate(), //day
				"h+" : this.getHours(), //hour
				"m+" : this.getMinutes(), //minute
				"s+" : this.getSeconds(), //second
				"q+" : Math.floor((this.getMonth()+3)/3), //quarter
				"S" : this.getMilliseconds() //millisecond
				};
				if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
				(this.getFullYear()+"").substr(4- RegExp.$1.length));
				for(var k in o)if(new RegExp("("+ k +")").test(format))
				format = format.replace(RegExp.$1,
				RegExp.$1.length==1? o[k] :
				("00"+ o[k]).substr((""+ o[k]).length));
				return format;
			};
	 }
	 
	 
	 //获取请求参数值
	 if(!window.getSearchString){
		 window.getSearchString =  function (name){
			    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			    var result = window.location.search.substr(1).match(reg);
			    if(result != null){
			        return result[2];
			    }else{
			        return null;
			    }
		};
		 
	 }
	 //获取请求参数值
	 if(!getUrlParam){
		 var getUrlParam =  function (name){
			    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			    var result = window.location.search.substr(1).match(reg);
			    if(result != null){
			        return result[2];
			    }else{
			        return null;
			    }
		};
		 window.getUrlParam=getUrlParam;
	 }
	 
	 //格式化输出日期  输出 最大唯一单位
	 if(!arrive_timer_format){
		var  arrive_timer_format=function(s) {
				var t;
				if(s<0){
					return;
				}
				if(s > -1){
				    hour = Math.floor(s/3600);
				    min = Math.floor(s/60) % 60;
				    sec = s % 60;
				    day = parseInt(hour / 24);
				    if (day > 0) {
				        hour = hour - 24 * day;
				        t = day + ":" + hour + ":";
				        }
				    else t = hour + ":";   
				    if(min < 10){t += "0";}
				        t += min + ":";
				    if(sec < 10){t += "0";}
				        t += sec;
				}
				if(  t.split(":").length==4 && Number(t.split(":")[0]) > 0 ){
					
					return Number(t.split(":")[0])+"天";
				}else if(t.split(":").length==3 && Number(t.split(":")[0]) > 0 ){
					return Number(t.split(":")[0])+"小时";
				}else if(t.split(":").length==3 && Number(t.split(":")[0]) == 0   ){
					return Number(t.split(":")[1])+"分钟";
				}
				
			};
		window.arrive_timer_format=arrive_timer_format;
	 }
	
	 
	//+---------------------------------------------------  
	//| 把日期分割成数组  
	//+---------------------------------------------------  
	Date.prototype.toArray = function()  
	{   
	    var myDate = this;  
	    var myArray = Array();  
	    myArray[0] = myDate.getFullYear();  
	    myArray[1] = myDate.getMonth();  
	    myArray[2] = myDate.getDate();  
	    myArray[3] = myDate.getHours();  
	    myArray[4] = myDate.getMinutes();  
	    myArray[5] = myDate.getSeconds();  
	    return myArray;  
	}
	 
	 
})();
