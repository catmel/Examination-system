<template>
<div class="ddic_content">

  <el-row :gutter="20">
    <el-col :span="12">
      <!-- 左侧类目 -->
      <div class="left" >
        <el-button class=" button margin-b-10" type="primary" @click="form_type({})">
          <i class="el-icon-plus el-icon--left"></i>添加类目
        </el-button>
        <el-table
          :data="ddic"
          @row-click="show_detail"
          border
          style="width: 100%"
          height="650"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="name"
            label="类目"
            width="100">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="show_detail(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="form_type(scope.row,true);">编辑</el-button>
              <el-button type="text" size="small"  @click.stop="saveDeleteId(true,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <el-col :span="12">
      <!-- 右侧细目 -->
      <div class="right box">
        <el-button class=" button margin-b-10" type="primary" @click="form_type_detail({},false)">
          <i class="el-icon-plus el-icon--left"></i>添加{{ddic_name}}细目
        </el-button>
        <el-table
          :data="ddic_detail"
          border
          style="width: 100%"
          height="650"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="name"
            label="细目"
            width="100">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="form_type_detail(scope.row,true);">编辑</el-button>
              <el-button type="text" size="small"  @click="saveDeleteId(false,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </el-col>
  </el-row>
     <!-- 添加/编辑类目 -->
    <!-- 开启表单验证 @close="handleClose('ruleForm')" -->
    <el-dialog :title="form_title" :visible.sync="dialogFormVisible" width="400px"
     @close="handleClose('form')">
      <!-- 表单验证规则   :rules="formRules" ref="ruleForm" -->
      <el-form :model="form" :rules="formRules" ref="form">
        <!-- 班级名称 -->
        <!-- prop为表单验证绑定的内容 -->
        <el-form-item label="类目名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>



     <!-- 添加/编辑细目 -->
    <!-- 开启表单验证 @close="handleClose('ruleForm')" -->
    <el-dialog :title="form_title" :visible.sync="dialogFormVisible_detail" width="400px"
     @close="handleClose_detail('formRules_detail')">
      <!-- 表单验证规则   :rules="formRules" ref="ruleForm" -->
      <el-form :model="form_detail" :rules="formRules_detail" ref="formRules_detail">
        <!-- prop为表单验证绑定的内容 -->
        <el-form-item label="当前所属类目"  :label-width="formLabelWidth" prop="ddicId">
          <el-select v-model="form_detail.ddicId" filterable placeholder="所属类目">
            <el-option v-for="(ddic, index) in ddic" :key="index" :label="ddic.name" :value="ddic.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- prop为表单验证绑定的内容 -->
        <el-form-item label="细目名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form_detail.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_detail = false">取 消</el-button>
        <el-button type="primary" @click="submitForm_detail('formRules_detail')">确 定</el-button>
      </div>
    </el-dialog>

   

   <!-- 删除类目 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="400px"
    >
      <span>确定要删除此类目吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="removeClass">确 定</el-button>
      </span>
    </el-dialog>
   <!-- 删除细目 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible_detail"
      width="400px"
    >
      <span>确定要删除<span class="font">{{ddic_name}}</span>类目下<span class="font">{{ddic_detail_name}}</span>此细目吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible_detail = false">取 消</el-button>
        <el-button type="primary" @click="removeDetail">确 定</el-button>
      </span>
    </el-dialog>


    
  </div>
</template>

<script>
    import { UUID } from '../../../utils/utils';

  export default {
    computed:{
        //此处函数名为绑定的列表数据
        ddic(){
            let detail_list = this.$store.state.ddic.list || [];
            const filterArr = detail_list.filter(item => item.id === this.form_detail.ddicId);
            if(filterArr.length > 0) {
              this.ddic_detail=filterArr[0].detail;
              this.ddic_name = filterArr[0].name;
            }
            return this.$store.state.ddic.list;
        },
        ddicCount() {
            return this.$store.state.ddic.list.length;
        }
    },
     //这里为axios应该获取数据
    mounted() {
        this.$store.dispatch('ddic/getList');
        console.log(this.$store.state.ddic.list);
    },
     data() {
      return {
        // 表单验证规则
        formRules:{
            //类目名称
            //required--必填
            name: [
            {required: true,message: '类目名称不能为空', trigger: 'blur'},
            { min: 1, max: 16, message: '长度在 1 到 16 个数字', trigger: 'blur'}
            ]
        },
        //细目
        formRules_detail:{
            //类目名称
            //required--必填
            name: [
            {required: true,message: '细目名称不能为空', trigger: 'blur'},
            { min: 1, max: 16, message: '长度在 1 到 16 个数字', trigger: 'blur'}
            ],
            ddicId: [
            { required: true, message: '请选择所属类目', trigger: 'change' }
          ],
        },
            //此为编辑弹框显示隐藏的选项
        dialogFormVisible: false,
        //细目弹框
        dialogFormVisible_detail:false,
        //此为删除弹框显示隐藏选项
        deleteDialogVisible: false,
        //删除细目弹框
        deleteDialogVisible_detail: false,
        //此处为删除的id
        deleteId:"",
        //设置添加编辑班级的标题
        form_title:"",
        url:"",
        detail_url:"",
        ddicId:'',
        //此处为弹框的内容,
        form: {
            //班级id
            id:'',
            //班级名称
            name: ''
        },
        //此处为细目的内容,
        form_detail: {
            //班级名称
            name: '',
            ddicId: ''
        },
        ddic_name:'',
        ddic_detail_name:'',
        ddic_detail:[],
        //弹框宽度
        formLabelWidth: '120px',
      }
    },
    methods:{
        //切换表单类型,添加/编辑类目
        form_type(row={},type){
            //将row的内容添加到this.form中
          const { id, name } = row;
          this.form = { id, name };
          this.form_title = type ? '编辑类目' : '新增类目';
          this.url = type ? 'ddic/edit' : 'ddic/create';
          this.dialogFormVisible = true;
        },
        //切换表单类型,添加/编辑细目
        form_type_detail(row={},type){
            this.form_detail.ddicId =  type ? row.ddicId : this.ddicId;
            this.form_detail.name =  row.name;
            this.detail_url = type ? 'ddic_detail/edit' : 'ddic_detail/create';
            this.form_title = type ? '编辑细目' : '新增细目';
            this.dialogFormVisible_detail = true;
        },
        //增改查班级事件
        submitForm(formName) {
            //先进行表单验证
            this.$refs[formName].validate((valid) => {
                //表单验证通过则...
                if (valid) {
                    //调取添加数据命令
                    this.$store.dispatch(this.url, this.form).then(data => {
                    if(data.success){
                        //新增
                        this.dialogFormVisible = false;
                        //此处为vuex的路径!!!!再不能错了
                        this.$store.dispatch('ddic/getList');
                    }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //增改细目事件
        submitForm_detail(formName) {
            //先进行表单验证
            this.$refs[formName].validate((valid) => {
                //表单验证通过则...
                if (valid) {
                  this.$store.dispatch(this.detail_url, this.form_detail).then(data => {
                    if(data.success) {
                        this.dialogFormVisible_detail = false;
                        this.$store.dispatch('ddic/getList');
                    }
                  });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        show_detail(scope){  
            this.ddic_name =  scope.name;   
            this.ddic_detail = scope.detail;
            this.form_detail.ddicId = scope.id;
            this.ddicId = scope.id;
            this.form_detail.name = '';
        },
        //获取删除类目的id
        saveDeleteId(type,row) {
            console.log(row);
            this.deleteId = row.id;
            this.ddic_detail_name = row.name;
            if(type === true){
                this.deleteDialogVisible = true;
            }else{
                this.deleteDialogVisible_detail = true;
            }
            
            
        },
        //删除类目
        removeClass() {
        //这个是调用的vuex的方法,不是路径
            this.$store.dispatch('ddic/remove', { id: this.deleteId }).then((data) => {
                this.deleteDialogVisible = false;
                if(data.success) {
                this.$store.dispatch('ddic/getList');
                }
            });
        },
        //删除类目
        removeDetail() {
        //这个是调用的vuex的方法,不是路径
            this.$store.dispatch('ddic_detail/remove', { id: this.deleteId }).then((data) => {
                this.deleteDialogVisible_detail = false;
                if(data.success) {
                this.$store.dispatch('ddic/getList');
                }
            });
        },
        //表单验证,不允许输入框为空
        handleClose(formName) {
            this.$refs[formName].clearValidate();
        },
        //细目表单验证,不允许输入框为空
        handleClose_detail(formName) {
            this.$refs[formName].clearValidate();
        },
    },
   
  }
</script>
<style scope lang="less">
  .ddic_content{
    overflow: hidden;
    .el-dialog__header {
      text-align: left;
    }
    .box{
      overflow: hidden;
    }
    .left,.right{
      /*float: left;*/
      /*width: 48%;*/
      flex: 1;
      /* background: rgba(0,0,0,0.5); */
      min-height: 200px;
    }
    .right{
      margin-left: 20px;
    }
    .button{
      display: block !important;
    }
    .el-select{
      width:100%;
    }
    .el-dialog__body .font{
      font-size: 20px;
      font-weight: bold;
    }
  }

</style>

