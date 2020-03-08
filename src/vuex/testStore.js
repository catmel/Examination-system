export default {
    state:{
        count:1,
        show: false
    },
    //添加修改count的方法
    //注意:
    /* 
        1. mutations中的方法是不分组件的
            比如:在vuexA组件文件中定义了一个switch_dialog事件,在vuexB组件文件中也定义了一个switch_dialog方法, 在组件中调用$store.commit('switch_dialog')事件,会执行所有的switch_dialog事件
        2. mutations中的操作必须是同步的     ***
            在mutations中操作异步操作并不会发生什么,只是官方推荐不要在mutations中执行异步操作
    */
    mutations:{
        add(state){   //这里的state指的是上面的state初始化数据
            // var time = setInterval(function(){
            //     state.count+=1;
            // },1000)
            state.count+=1;
        },
        reduct(state){
            state.count-=1;
        },
        switch_dialog(state){
            state.show = state.show?false:true;
        }
    },
    //官方推荐将所有异步操作写在actions中
    actions:{
        switch_dialog(context){ //这里的context和我们使用的$store拥有相同的对象和方法
            context.commit('switch_dialog');    //相当于$store.commit('switch_dialog)
            //可以在这里触发其他的mutations方法

        }
    },
    //getter和vue中的computed类似,用于计算state然后生成新的数据状态
    getters:{
        //我们在state.show中设置了初始值,可以通过getter修改show的值,然后生成新的数据状态,新数据为getter的函数名
        //在组建中使用$store.getter.not_show
        not_show(state){
            return !state.show;
        }
    }
}