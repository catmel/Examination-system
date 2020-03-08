<template>
    <!-- :trigger-on-focus="true"下拉提示框输入前显示 -->
    <el-input
        class="search"
        v-model="state"
        placeholder="请输入搜索内容"
        @change="querySearch"
     ></el-input>
  <!-- </el-col> -->
</template>
<script>
export default {
    data() {
        return {
            state: "",
            offset: 0, 
            limit: 10
        };
    },
    props: ['role'],
    methods: {
        querySearch(state) {
            console.log("搜索条件", state,this.role);
                this.$store.dispatch('users/search_user', {keyword: state,role:this.role,offset: this.offset,limit: this.limit}).then(res => {
                    if(res.success){
                        console.log("搜索结果",res.data);
                        this.$emit('searchData',res.data);
                    }
                })
        }
    }
};
</script>
<style scope>
    .search{
        width:300px;

    }
</style>

