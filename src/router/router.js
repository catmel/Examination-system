//引入主页面
import Login from "../components/Login.vue";
import Logon from "../components/Logon.vue";
import Homepage from "../components/homepage.vue";

//引入分页面
import Page1 from "../components/page/1.vue";
import Page2 from "../components/page/2.vue";
import Login123 from "../components/page/login.vue";
import Test from "../components/page/test.vue";
import StudentList from "../components/page/user/StudentList.vue";
import TeacherList from "../components/page/user/TeacherList.vue";
import MajorList from "../components/page/major/List.vue";
import SubjectList from "../components/page/subject/List.vue";
import ClassesList from "../components/page/classes/List.vue";
import QuestionList from "../components/page/question/List.vue";
//引入系统管理页面
import SystemList from "../components/page/system/systemList.vue";
//引入个人中心
import Private from "../components/page/private/private.vue";

import TrainingList from "../components/page/training/List.vue";
import AddTraining from "../components/page/training/AddTraining.vue";
import TrainingOfStudent from "../components/page/training/ListOfStudent.vue";
import StudentExam from "../components/page/training/StudentExam.vue";
import StudentsOfClass from "../components/page/classes/StudentList.vue";
import GradeManagement from "../components/page/grade/GradeManagement.vue";
import StudentGrade from "../components/page/grade/StudentGrade.vue";




//设置路由数据
const routes = [
    {
        path:"/",
        redirect:'/homepage'
    },
    {
        path:"/login",
        component:Login
    },
    {
        path: '/homepage',
        component: Homepage,
        beforeEnter: (to, from, next) => {
        //进入之前判断有没有登录
        //登录不操作,不登录进入login
        //     console.log(sessionStorage.getItem("loginUser"));
            if(!sessionStorage.getItem("loginUser")){
                next("/login");
            }
            next();
        },
        children:[
            {
                path:'1-1',
                component:Page1
            },
            {
                path:'1-2',
                component:Page2
            },
            {
                path:'test',
                component:Test
            },
            {
                path: 'login',
                component: Login123,
            },
            {
                path: 'private',
                component: Private
            }
        ]
    },
    {
      path:"/logon",
      component: Logon
    },
    {
      path: '/grade/:id',
      name: 'studentGrade',
      component: StudentGrade
    }
];

// 管理员的路由
export const adminRoutes = [{
  path: 'teachers',
  component: TeacherList,
},{
  path: 'students',
  component: StudentList
},{
  path: 'classes/students',
  component: StudentsOfClass
},{
  path: 'majors',
  component: MajorList
},{
  path: 'subjects',
  component: SubjectList
},{
  path: 'classes',
  component: ClassesList
},{
  path: 'system',
  component: SystemList
}
];

// 老师的路由
export const teacherRoutes = [{
  path: 'students',
  component: StudentList
},{
  path: 'classes',
  component: ClassesList
},{
  path: 'classes/students',
  component: StudentsOfClass
},{
  path: 'questions',
  component: QuestionList
},{
  path: 'add-training',
  component: AddTraining
},{
  path: 'training',
  component: TrainingList
},{
  path: 'grade',
  component: GradeManagement
}
];

// 学生的路由
export const studentRoutes = [
  {
    path: 'student-training',
    component: TrainingOfStudent
  }, {
    path: 'student-training/:id',
    name: 'studentExam',
    component: StudentExam
  }
];

//配置路由出口
export default routes;