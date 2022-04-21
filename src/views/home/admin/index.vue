<template>
    <div class="home-admin">
        <navbar />
        <postcard />
        <div style="display: flex;">
            <div class="pie" ref="pieRef"></div>
            <div class="bar" ref="barRef"></div>
            <div class="line" ref="lineRef"></div>
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

            const { data: { teacher, student, guest } } = await getUserNum()
            const { data: { classNum, course } } = await getSystemNum()


            state.data = { teacher, student, guest, classNum, course }

            const pieChart = echarts.init(pieRef.value)
            const barChart = echarts.init(barRef.value)
            const lineChart = echarts.init(lineRef.value)

            const pie = {
                series: [
                    {
                        type: 'pie',
                        name: 'a',
                        data: [
                            {
                                value: teacher,
                                name: '教师（'+teacher+'）'
                            },
                            {
                                value: student,
                                name: '学生（'+student+'）'
                            },
                            {
                                value: guest,
                                name: '游客（'+guest+'）'
                            },
                        ],
                        radius: '50%',
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
            pieChart.setOption(pie)
            barChart.setOption(bar)
            lineChart.setOption(line)
        })

        return {
            ...toRefs(state),
            pieRef,
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
        width: 400px;
        height: 400px;
        // border: 1px solid #000;
    }
</style>


