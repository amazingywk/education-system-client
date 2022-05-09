<template>
    <div class="home-admin">
        <navbar />
        <postcard />
        <div style="display: flex; justify-content: space-between;padding: 20px 120px">
            <div class="pie" ref="pie2Ref"></div>
            <div class="bar" ref="barRef"></div>
        </div>
        <div style="display: flex; justify-content: space-between;padding: 20px 120px">
            <div class="line" ref="lineRef"></div>
            <div class="pie" ref="pieRef"></div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, ref, onMounted, reactive, toRefs } from 'vue'
import Navbar from '@/components/navbar.vue'
import Postcard from '@/components/postcard.vue'
import * as echarts from 'echarts';
import { getUserNum } from '@/api/user'
import { getSystemNum } from '@/api/class'

export default defineComponent({
    name:'HomeAdmin',

    components:{
        Navbar,
        Postcard,
    },

    setup() {
        const pieRef = ref()
        const pie2Ref = ref()
        const barRef = ref()
        const lineRef = ref()

        const state = reactive({
            data: {
                teacher: 0,
                student: 0,
                guest: 0,
                classNum: 0,
                course: 0,
            },
        })

        onBeforeMount(() => {
            
        })

        onMounted(async () => {

            const { data: { people: { teacher, student, guest }, test: { fail, not, pass } } } = await getUserNum()
            const { data: { classNum, course } } = await getSystemNum()

            state.data = { teacher, student, guest, classNum, course }
            console.log(not,pass,fail)

            const pieChart = echarts.init(pieRef.value)
            const pie2Chart = echarts.init(pie2Ref.value)
            const barChart = echarts.init(barRef.value)
            const lineChart = echarts.init(lineRef.value)

            const pie = {
                title: {
                    text: '人员分布'
                },
                series: [
                    {
                        type: 'pie',
                        name: '人员分布图',
                        data: [
                            {
                                value: teacher,
                                name: '教师('+teacher+')'
                            },
                            {
                                value: student,
                                name: '学生('+student+')'
                            },
                            {
                                value: guest,
                                name: '游客('+guest+')'
                            },
                        ],
                        radius: '40%',
                    },
                ]
            }
            const bar = {
                title: {
                    text: '系统统计'
                },
                tooltip: {},
                xAxis: {
                    data: ['课程', '班级', '教师', '学生']
                },
                yAxis: {},
                series: [
                    {
                    // name: '销量',
                    type: 'bar',
                    data: [course, classNum, teacher, student]
                    }
                ]
            }
            const line = {
                title: {
                    text: '系统发展'
                },
                xAxis: {
                    data: ['A', 'B', 'C', 'D', 'E']
                },
                yAxis: {},
                series: [
                    {
                        data: [10, 22, 28, 43, 49],
                        type: 'line',
                        stack: 'x',
                        smooth: true,
                    },
                    {
                        data: [5, 4, 3, 5, 10],
                        type: 'line',
                        stack: 'x',
                        smooth: true,
                    }
                ]
            }
            const pie2 = {
                title: {
                    text: '综合评测统计'
                },
                series: [
                    {
                        type: 'pie',
                        name: 'a',
                        data: [
                            {
                                value: fail,
                                name: '未通过('+fail+')'
                            },
                            {
                                value: pass,
                                name: '通过('+pass+')'
                            },
                            {
                                value: not,
                                name: '未做('+not+')'
                            },
                        ],
                        radius: '40%',
                    },
                ]
            }
            pieChart.setOption(pie)
            pie2Chart.setOption(pie2)
            barChart.setOption(bar)
            lineChart.setOption(line)
        })

        return {
            ...toRefs(state),
            pieRef,
            pie2Ref,
            barRef,
            lineRef,
        }
    },
})
</script>

<style lang="less" scoped>
    .home-admin {
        height: 100%;
    }
    .pie, .bar, .line {
        width: 300px;
        height: 300px;
        // border: 1px solid #000;
    }
    // .line {
    //     margin-left: 150px;
    // }
</style>


