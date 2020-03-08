<template>
  <div class="test" id="app123">
      <h2>{{msg}}</h2>
      <hr>
      <!-- 通过$store.state...获取相关数据 -->
      <!-- 此处的num为computed下面的num(), vuex直接赋值的三种方式之一-->
      <h3>{{$store.state.test.count}}-{{num}}</h3>
      <button @click="$store.commit('add')">增加</button>
      <button @click="$store.commit('reduct')">减少</button>
      <br>
      <br>
      <br>
      <h3>{{$store.state.test.show}}</h3>
      <h4>computed方法赋值$store.state.dialog.show----{{not_show}}</h4>
      <h4>getter修改$store.state.dialog.show数据----{{$store.getters.not_show}}</h4>
      <p style="color:#f00;">$store.getters.show_show的值是不能直接修改的,需要对应的satte发生变化才能修改</p>
      <button @click="$store.commit('switch_dialog')">调取mutations方法</button>
      <button @click="$store.dispatch('switch_dialog')">调取actions方法</button>

      <br>
      <br>
      <h3>{{new_show}}</h3>
      <h3>{{new_num}}</h3>
  </div>
</template>

<script>
//mapState/mapGetter/mapMutations/mapActions
//为了方便我们书写,不用写$store.state...之类的长命令,vuex有很便捷的命令
//步骤一:通过vuex引入mapXxxxxx
import {mapState} from 'vuex';
import {mapGetters} from 'vuex';
import {mapActions} from 'vuex';
import {mapMutations} from 'vuex';


export default {
  data(){
      return{
          msg:'Hello Vuex'
      }
  },
  //将数据添加到组件中
  //computed给store赋值
  computed:{   // /kəm'pju:tid/   计算机的
    num(){
        return this.$store.state.test.count+100;    ////这里就是计算属性的写法
    },
    not_show(){
        return !this.$store.state.test.show;
    },
    ...mapState({
        new_show:state=> state.test.show,
        new_num: state => state.test.count+50
    })
  },
  methods:{
      res:function(){
          console.log("123123123");
      }
  }   
}
</script>
<style lang="less" scoped>
    .test {
        button{
            width: 150px;
            height: 45px;
            border:0;
            display: block;
            margin: 30px auto;
            background: #49ddff;
            border-radius: 8px;
            outline: 0;
        }
    }
</style>

