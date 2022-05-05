<template>
    <div class="timetable-manage">
        <nav-bar />
        <div class="content">
            <div class="title">
                {{ data.classname }}
            </div>
            <div class="number">
                编号：{{ data.number }}
            </div>
            <div class="teacher">
                {{ data.teacher?.length?'班主任：'+data.teacher[1]:'暂未指定班主任' }}
            </div>

            <div class="date">
                <div></div>
                <div>星期一</div>
                <div>星期二</div>
                <div>星期三</div>
                <div>星期四</div>
                <div>星期五</div>
                <div>星期六</div>
                <div>星期日</div>
            </div>
            <div class="time">
                <div>上午</div>
                <div>下午</div>
            </div>
            <div class="schedule">
                <div v-for="(course, index) in schedule" :key="course" :class="course?.length?'green':'red'" @click="changeVisible(index, course)" >
                    {{ course?.length?course[1]:'暂未选课' }}
                </div>
            </div>
            <a-modal
                v-model:visible="visible"
                title="选课"
                @ok="handleOk"
                cancelText="取 消"
                okText="确定"
                centered
                :width="380"
            >
                <a-select
                    v-if="visible"
                    v-model:value="selectCourseId"
                    show-search
                    placeholder="请选择一门课程"
                    style="width: 200px"
                    :options="options"
                    @change="courseChange"
                >
                </a-select>
            </a-modal>
        </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import NavBar from '@/components/navbar.vue'
import { useRoute } from 'vue-router'
import { classInfo } from '@/api/class'
import { getCourseOptions } from '@/api/course'
import { updateTimetable } from  '@/api/timetable'
import { message } from 'ant-design-vue'

export default defineComponent({
    name: 'TimetableManage',
    components: {
        NavBar,
    },
    
    setup() {
        const route = useRoute()

        const state = reactive({
            visible: false,             // 模态框状态
            selectCourseId: undefined,    // 已选中的课程_id
            selectCourse: undefined,    // 已选中的课程
            clickNode: undefined,       // 被点击的格子
            data: {                     // 班级数据
                classname: undefined,
                number: undefined,
                teacher: undefined,
            },
            schedule: {
                monday1: [1,2],
                monday2: [1,2],
                monday3: [1,2],
                monday4: [1,2],
                tuesday1: [1,2],
                tuesday2: [1,2],
                tuesday3: [1,2],
                tuesday4: [1,2],
                wednesday1: [1,2],
                wednesday2: [1,2],
                wednesday3: [1,2],
                wednesday4: [1,2],
                thursday1: [1,2],
                thursday2: [1,2],
                thursday3: [1,2],
                thursday4: [1,2],
                friday1: [1,2],
                friday2: [1,2],
                friday3: [1,2],
                friday4: [1,2],
                saturday1: [1,2],
                saturday2: [1,2],
                saturday3: [1,2],
                saturday4: [1,2],
                sunday1: [1,2],
                sunday2: [1,2],
                sunday3: [1,2],
                sunday4: [],
            },
            options: [],                // 课程可选项
        })

        onBeforeMount(async ()=>{
            const { data: { classNode, timetable } } = await classInfo(route.query._id)
            state.data = classNode
            console.log(timetable)
            state.schedule = timetable
            delete state.schedule._id
            delete state.schedule.__v


            const { data } = await getCourseOptions()
            state.options = data
        })

        const changeVisible = (index, course) => {
            state.clickNode = index
            state.selectCourseId = course.length?course[0]:undefined
            state.visible = true
        }

        const courseChange = (_, node) => {
            state.selectCourse = node
        }

        const handleOk = async () => {
            const a = {}
            console.log(state.clickNode,state.selectCourse)
            a[state.clickNode] = [state.selectCourse.value, state.selectCourse.label, state.selectCourse.teacher]
            await updateTimetable({ _id: state.data.timetable, ...a })

            message.success('选课成功')
            state.schedule[state.clickNode] = [state.selectCourse.value, state.selectCourse.label, state.selectCourse.teacher]
            state.visible = false
        }

        return {
            ...toRefs(state),
            changeVisible,
            courseChange,
            handleOk,
        }
    },
})
</script>

<style lang="less" scoped>
.timetable-manage {
    width: 100%;
    height: 100%;
    .content {
        width: 100%;
        height: 100%;
        padding-left: 20px;
        .title {
            font-size: 30px;
            font-weight: 500;
        }
        .date {
            display: flex;
            position: relative;
            left: 83px;
            top: 49px;
            div {
                width: 150px;
                text-align: center;
                background-color: skyblue;
                border:1px solid #000;
            }
        }
        .time {
            position: relative;
            top: 49px;
            left: 83px;
            div {
                width: 150px;
                height: 200px;
                text-align: center;
                background-color: skyblue;
                border: 1px solid #000;
            }
        }
        .schedule {
            position: relative;
            display: flex;
            box-sizing: border-box;
            flex-wrap: wrap;
            top: -351px;
            width: 1052px;
            height: 400px;
            margin: 0 auto;
            // border: 1px solid red;
            .course, .green, .red {
                box-sizing: border-box;
                width: 150px;
                height: 100px;
                border: 1px solid #000;
            }
            .green {
                color: green;
            }
            .red {
                color: red;
            }
        }
    }
}
</style>