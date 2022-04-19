<template>
    <div class="home-admin">
        <navbar />
        <div style="display: flex;">
            <div class="main" ref="pieRef"></div>
            <div class="main" ref="barRef"></div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, ref, onMounted, reactive } from 'vue'
import Navbar from '@/components/navbar.vue'
import * as echarts from 'echarts';
import { getUserNum } from '@/api/user'
import { getSystemNum } from '@/api/class'

export default defineComponent({
    name:'HomeAdmin',

    components:{
        Navbar
    },

    setup() {
        const pieRef = ref()
        const barRef = ref()

        const state = reactive({
            data: {
                teacher: 0,
                student: 0,
                guest: 0,
                classNum: 0,
                course: 0,
            }
        })

        onBeforeMount(() => {
            
        })

        onMounted(async () => {

            const { data: { teacher, student, guest } } = await getUserNum()
            const { data: { classNum, course } } = await getSystemNum()

            state.data = { teacher, student, guest, classNum, course }

            var pieChart = echarts.init(pieRef.value)
            var barChart = echarts.init(barRef.value)

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
            var bar = {
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
            pieChart.setOption(pie)
            barChart.setOption(bar)
        })

        return {
            pieRef,
            barRef,
        }
    },
})
</script>

<style lang="less" scoped>
    .main {
        width: 500px;
        height: 500px;
        border: 1px solid #000;
    }
</style>


