
import qwest from 'qwest';
import Vue from 'vue';
import vueResource from 'vue-resource';
import libbase64 from 'libbase64';
Vue.use(vueResource);
var store = require('store');
export function decodeContent(content){ //转为utf-8
	return  libbase64.decode(content).toString("UTF-8");
	
}



export function doError(obj,self){
	if(obj.status == 5){
		store.remove('user');
        self.$router.go({"path":"/login"});
	}
	if(obj.status == 400){
		return "系统异常";
	}
}


export function doGet(params,fn){  //config ajax配置
	      Vue.http({
		            method:'get',
		            url:params.url,
		            params:params.data,
		            before: function(){
                       $.showLoading();  //显示加载层
                    }
		        }).then(function(response){
		        	  $.hideLoading();
                        fn && fn(response.body); //会掉
                     

             },(errorEsponse) =>{
             	     $.hideLoading();
             	     $.toast("错误信息"+errorEsponse, "forbidden");
                     console.log(errorEsponse);
        		   	// 响应错误回调
             })	;
}



export function doPost(params,fn){  //config ajax配置
	      Vue.http({
		            method:'post',
		            url:params.url,
		            params:params.data,
		            before: function(){
                       $.showLoading();  //显示加载层
                    }
		        }).then(function(response){
		        	  $.hideLoading();
                       fn && fn(response.body); //会掉
             },(errorEsponse) =>{
             	     $.hideLoading();
             	     $.toast("错误信息"+errorEsponse, "forbidden");
                     console.log(errorEsponse);
        		   	// 响应错误回调
             })	;
}



  /** 是否关联,及关联强度
     */
export function getUserInfo(arg,fun){
         var params = {token:arg.accessToken};
		    console.log(params);
		    var url = request.user.getRelationStatusAndUserInfo+arg.openId;
		    console.log(url);
		   Vue.http.get(url, params).then((response) => {
		   	// 响应成功回调
             if (response.body) {
             	fun && fun(response.body);
             }
		   	
		   }, (errorEsponse) => {
		   	    console.log(errorEsponse);
		   	// 响应错误回调
		   });




    }

