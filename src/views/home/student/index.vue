<template>
    <div class="home-student">
        <navbar />
        <postcard />
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
                <div v-for="course in schedule" :key="course" :class="course?.length?'green':'none'">
                    {{ course?.length?course[1]:'还没有选课哦' }}
                </div>
            </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import Navbar from '@/components/navbar.vue'
import storage from '@/utils/storage'
import { getStudentTimetable } from '@/api/user'
import Postcard from '@/components/postcard.vue'

export default defineComponent({
    name:'HomeStudent',

    components:{
        Navbar,
        Postcard
    },

    setup() {

        const state = reactive({
            schedule: {},
            data: {}
        })

        onBeforeMount(async () => {
            const user = storage.getUser()
            const { data: { classNode, timetable} } = await getStudentTimetable(user._id)
            state.data = classNode
            state.schedule = timetable
            delete state.schedule._id
            delete state.schedule.__v
        })

        return {
            ...toRefs(state),
        }
    },
})
</script>

<style lang="less" scoped>
    .home-student {
        height: 100%;
        width: 100%;
        height: 100%;
        // padding-left: 20px;
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
                width: 75px;
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
                width: 75px;
                height: 100px;
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
            top: -151px;
            left: -247px;
            width: 526px;
            height: 200px;
            margin: 0 auto;
            // border: 1px solid red;
            .course, .green, .none {
                box-sizing: border-box;
                width: 75px;
                height: 50px;
                border: 1px solid #000;
            }
            .green {
                color: #000;
            }
            .none {
                color: green;
            }
        }
    }
</style>