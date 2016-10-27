var store = require('store')
export function configRouter (router) {
  // normal routes
    router.map({
	     "/login":{
		    name:"login",
		    component:require('./components/Login.vue'),
	    },
	    "/":{
		       component: require('./components/Index.vue'),
		      
		        
	    },   
	   '*': {
	          component: require('./components/Index.vue')
	     },
	    '/feedBack':{
	    	   name :"feedBack", //意见提交
	          component: require('./components/advice/feedBack.vue')
	     },
	     '/orderList':{
	    	   name :"orderList", //意见提交
	          component: require('./components/order/orderList.vue')
	     }

    
  })

	/*router.beforeEach(function (transition) {
           
		     if(store.get('user') == null){
			     router.go({"path":"/login",append: false});
			       transition.next();
		     }else{
		        transition.next();
	     }
	      
	  
	       
	  
	})*/
}
