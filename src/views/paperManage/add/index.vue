<template>
    <div class="paper-add">
        <navbar />
        <div class="tip">{{isEdit?'编辑试卷':'创建试卷'}}</div>
        <div class="parts-search">
            搜索：
            <a-input
                v-model:value="search.keyword"
                placeholder="关键字(模糊搜索)"
                @pressEnter="getProblemList"
                width="300px"
            ></a-input>
            <a-select
                v-model:value="search.author"
                show-search
                placeholder="请选择出题人"
                :options="options"
                @change="getProblemList"
            >
            </a-select>
        </div>
        <div class="paper-title">
            试卷题目：<input v-model="data.papername" @keyup="change()" class="input"/>
        </div>
        <problemCard v-for="(problem, index) in problemList" :key="index" :problem="problem" :index="index"/>
        <div v-if="addVisible" class="problem-select">
            <a-select
                v-model:value="selected"
                placeholder="请选择一个题目"
                :options="problemOptions"
                @change="addProblem"
            ></a-select>
        </div>
        <div class="add-item" @click="changeAddVisible">
            <div>新增题目</div>
            <div class="add">+</div>
        </div>
        <div class="submit">
            <a-button type="primary" @click="submit" size="large">提交</a-button>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import Navbar from '@/components/navbar.vue'
import ProblemCard from '@/components/problemCard.vue'
import { createPaper, getPaperInfo, updatePaper } from '@/api/paper'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { queryTeacherList } from '@/api/user'
import { getProblemInfo, queryProblemList } from '@/api/problem'
import storage from '@/utils/storage'

export default defineComponent({
    name:'PaperAdd',

    components:{
        Navbar,
        ProblemCard
    },

    setup() {

        const route = useRoute()
        const router = useRouter()

        const state = reactive({
            isEdit: false,
            problems: [],
            problemList: [],
            width: 0,
            data: {},
            options: [],
            search: {
                keyword: undefined,
                author: undefined,
            },
            problemOptions: [],
            addVisible: false,
            selected: undefined,
        })

        onMounted(async () => {
            const { data } = await queryTeacherList()
            state.options = data
            if (route.query._id) {
                state.isEdit = true
                const { data } = await getPaperInfo(route.query._id)
                state.data = data
                state.problems = data.problems
                await arrangeProblem()

                const input = document.querySelector('.input')
                let length = (data.papername.length)*30+10
                input.style.setProperty('width',length+'px')
            }
            getProblemList()
        })

        function arrangeProblem() {
            state.problemList = []
            state.problems.map(async problem => {
                const { data } = await getProblemInfo(problem)
                state.problemList.push(data)
            })
            
        }

        const getProblemList = async () => {
            const { data } = await queryProblemList(state.search)
            console.log(data)
            state.problemOptions = []
            data.map(problem => {
                state.problemOptions.push({
                    value: problem._id,
                    label: problem.question,
                })
            })
        }

        const changeAddVisible = () => {
            state.addVisible = true
        }

        const addProblem = async (value) => {
            state.problems.push(value)
            await arrangeProblem()
            state.addVisible = false
            state.selected = undefined
        }

        const submit = async() => {
            const { _id, username} = storage.getUser()
            if (state.isEdit){
                await updatePaper({...state.data, problems: state.problems, teacher:[_id,username] })
                message.success('编辑试卷成功')
                router.push('/paper-manage')
            } else {
                // 创建试卷
                console.log(state.isEdit)
                await createPaper({...state.data, problems: state.problems, teacher:[_id,username] })
                message.success('创建试卷成功')
                router.push('/paper-manage')
            }
        }

        const change = () => {
            const input = document.querySelector('.input')
            let length = (input.value.length)*30+10
            if (length === 10) {
                length = 40
            }
            console.log(length)
            input.style.setProperty('width',length+'px')
        }

        return {
            ...toRefs(state),
            getProblemList,
            changeAddVisible,
            addProblem,
            submit,
            change,
        }
    },
})
</script>

<style lang="less" scoped>
    .paper-add {
        height: 100%;
        overflow-y: auto;
        .paper-title input {
            outline: none;
            border: none;
            border-bottom: 1px solid #000;
            width: 40px;
        }
        .tip {
            font-size: 30px;
            color: skyblue;
            font-weight: 900;
            margin: 20px 0 0 30px;
        }
        .parts-search {
            display: flex;
            position: relative;
            margin: 30px 0 10px 30px;
            button {
                position: absolute;
                right: 20px;
            }
            input {
                width: 220px;
                // height: 32px;
                margin: 0 12px 12px 0;
            }
            .ant-select {
                width: 220px;
                height: 32px;
                margin: 0 12px 12px 0;
            }
            .ant-input-number {
                width: 220px;
                height: 32px;
                margin: 0 12px 12px 0;
            }
            .line {
                display: inline-block;
                margin: 0 8px 0 -4px;
                color: #8c8c8c;
            }
        }
        .paper-title {
            width: 100%;
            text-align: center;
            font-size: 30px;
        }
        .problem-select {
            width: 100%;
            text-align: center;
            margin-top: 30px;
            select {
                width: 600px;
            }
        }
        .add-item {
            margin: 100px auto 0;
            width: 200px;
            height: 100px;
            border: 1px dotted blue;
            text-align: center;
            padding-top: 20px;
            cursor: pointer;
            // font-size: 50px;
            .add {
                margin-top: -15px;
                font-size: 40px;
            }
        }
        .submit {
            width: 100%;
            text-align: center;
            margin-top: 50px;
        }
    }
</style>