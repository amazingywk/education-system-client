<template>
    <div class="timetable-manage">
        <nav-bar />
        <div class="content">
            <div style="display: flex;">
                <div>
                    <div class="title">
                        {{ data.classname }}
                    </div>
                    <div class="number">
                        编号：{{ data.number }}
                    </div>
                    <div class="teacher">
                        {{ data.teacher?.length?'班主任：'+data.teacher[1]:'暂未指定班主任' }}
                    </div>
                </div>

                <div style="margin-left: 150px">
                    考卷：<div class="paper" @click="toPaperDetails(paper[0])">{{paper?paper[1]:''}}</div>
                    <a-button type="primary" @click="changePaperVisible">发布试卷</a-button>
                </div>
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
                    {{ course&&course.length?course[1]:'暂未选课' }}
                    <div>{{course&&course[2]?course[2]:''}}</div>
                </div>
            </div>
            <a-modal
                v-model:visible="visible"
                title="选课"
                @ok="handleOk"
                cancelText="取 消"
                okText="确 定"
                centered
                :width="380"
            >
                <a-select
                    v-if="visible"
                    v-model:value="selectCourseId"
                    show-search
                    placeholder="请选择一门课程"
                    :options="options"
                    style="width: 330px;"
                    @change="courseChange"
                >
                </a-select>
            </a-modal>
            <a-modal
                v-model:visible="paperVisible"
                title="添加试卷"
                @ok="addPaper"
                cancelText="取 消"
                okText="确 定"
                centered
                :width="380"
            >
                <a-select
                    v-if="paperVisible"
                    show-search
                    placeholder="请选择一份试卷"
                    :options="paperOptions"
                    style="width: 330px;"
                    @change="paperChange"
                >
                </a-select>
            </a-modal>
        </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import NavBar from '@/components/navbar.vue'
import { useRoute, useRouter } from 'vue-router'
import { changeClassPaper, classInfo } from '@/api/class'
import { getCourseOptions } from '@/api/course'
import { updateTimetable } from  '@/api/timetable'
import { message } from 'ant-design-vue'
import { getPaperOptions } from '@/api/paper'

export default defineComponent({
    name: 'TimetableManage',
    components: {
        NavBar,
    },
    
    setup() {
        const route = useRoute()
        const router = useRouter()

        const state = reactive({
            visible: false,             // 模态框状态
            paperVisible: false,
            selectCourseId: undefined,    // 已选中的课程_id
            selectCourse: undefined,    // 已选中的课程
            clickNode: undefined,       // 被点击的格子
            data: {                     // 班级数据
                classname: undefined,
                number: undefined,
                teacher: undefined,
            },
            paper: undefined,
            schedule: {},
            options: [],                // 课程可选项
            paperOptions: [],
            selectPaper: undefined,
        })

        onBeforeMount(async ()=>{
            const { data: { classNode, timetable } } = await classInfo(route.query._id)
            state.data = classNode

            state.paper = classNode.paper

            state.schedule = timetable
            delete state.schedule._id
            delete state.schedule.__v

            const { data: paperOptions } = await getPaperOptions()
            state.paperOptions = paperOptions

            const { data } = await getCourseOptions()
            state.options = data
            state.options.unshift({
                value: null,
                label: '暂不选课'
            })
        })

        const toPaperDetails = (id) => {
            router.push({
                    path: '/paper-manage/add',
                    query: {
                        _id: id
                    }
                })
        }

        const changeVisible = (index, course) => {
            state.clickNode = index
            state.selectCourseId = course?.length?course[0]:undefined
            state.visible = true
        }

        const courseChange = (_, node) => {
            state.selectCourse = node
        }

        const changePaperVisible = () => {
            state.paperVisible = true
        }

        const paperChange = (_, node) => {
            state.selectPaper = node
        }

        const addPaper = async () => {
            state.paper = [state.selectPaper.value, state.selectPaper.label]
            let request = {
                _id: route.query._id,
                paper: state.paper
            }
            await changeClassPaper(request)
            message.success('添加试卷成功')

            state.paperVisible = false
            state.selectPaper = undefined
        }

        const handleOk = async () => {
            const a = {}
            console.log(state.clickNode,state.selectCourse)
            if (state.selectCourse.value==null) {
                a[state.clickNode] = null
                state.schedule[state.clickNode] = null
            } else {
                a[state.clickNode] = [state.selectCourse.value, state.selectCourse.label, state.selectCourse.teacher]
                state.schedule[state.clickNode] = [state.selectCourse.value, state.selectCourse.label, state.selectCourse.teacher]
            }
            await updateTimetable({ _id: state.data.timetable, ...a })

            message.success('选课成功')
            state.visible = false
        }

        return {
            ...toRefs(state),
            toPaperDetails,
            changeVisible,
            courseChange,
            changePaperVisible,
            paperChange,
            addPaper,
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
        .paper {
            cursor: pointer;
            margin-left: 30px;
            font-size: 17px;
            color: green;
        }
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