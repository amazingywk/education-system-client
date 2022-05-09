<template>
    <div class="test-manage">
        <navbar />
        <div class="tip">综合测评</div>
        <div v-if="reset" class="retest-tip"> 您的得分为：{{score}}</div>
        <div v-if="!retest">
            <problemCard
            v-for="(problem, index) in data"
            :key="index" :problem="problem"
            :index="index"
            :read="read"
            @changeAnswer="changeAnswer"
        />
        </div>
        <div v-else class="retest-tip">
            您已经做完综合评测啦！
        </div>
        <div class="submit" v-if="!reset">
            <a-button @click="submit" type="primary" size="large">提交</a-button>
        </div>
        <div class="submit" v-else>
            <a-button @click="resetPage" type="primary" size="large">重做</a-button>
        </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import Navbar from '@/components/navbar.vue'
import ProblemCard from '@/components/problemCard.vue'
import { getProblemInfo, submitTestScore } from '@/api/problem'
import storage from '@/utils/storage'
import { getUserInfo } from '@/api/user'
import { message } from 'ant-design-vue'
import { getTestPaper } from '@/api/paper'

export default defineComponent({
    name:'TestManage',

    components:{
        Navbar,
        ProblemCard,
    },

    setup() {

        const state = reactive({
            read: false,
            data: [
                {
                    answer: "D",
                    choices: ['周三','周四','周五','周日'],
                    isChoice: true,
                    keyword: "测评题",
                    number: "test1",
                    question: "如果昨天是明天的话就好了，这样今天就是周五了。请问今天是周几？",
                },
                {
                    answer: "姐姐",
                    choices: [],
                    isChoice: false,
                    keyword: "测评题",
                    number: "test2",
                    question: "一男一女去上坟，俩人哭的同一人，男的哭他丈人的女婿，女的哭她女婿的丈人，问：女人是男人的谁？（女比男大）",
                },
                {
                    answer: "D",
                    choices: ['是C干的','是D干的','如果是我干的，那么D一定是主犯','不是我干的'],
                    isChoice: true,
                    keyword: "测评题",
                    number: "test3",
                    question: "伦敦一户富商家里失窃了，现在已有A、B、C、D四名嫌疑犯被拘捕。探长通过对四人的审讯，获取的口供如下：只有一个人供词是假的,请问谁说谎了",
                },
                {
                    answer: "5",
                    choices: [],
                    isChoice: false,
                    keyword: "测评题",
                    number: "test4",
                    question: "余老板收购了两枚古币，后来又以每枚60元的价格出售。其中一枚赚了20%，另一枚赔了20%。请问：和他当初收购这两枚古币相比，余老板赚了或者赔了多少钱",
                },
                
            ],
            answer: [],
            retest: false,
            reset: false,
            score: undefined,
        })

        const { _id } = storage.getUser()

        onBeforeMount(async () => {
            const { data:{ testScore } } = await getUserInfo(_id)
            if (testScore===-1) {
                state.retest = false
                state.reset = false
                await getPaper()
            } else {
                state.retest = true
                state.reset = true
                state.score = testScore
            }

            for(let i=0; i<state.data.length; i++) {
                state.answer[i] = 'NULL'
            }
        })

        async function getPaper() {
            const { data } = await getTestPaper()

            state.data = []
            data.problems.map(async problem => {
                const { data } = await getProblemInfo(problem)
                state.data.push(data)
            })
        }

        const submit = async () => {
            state.read = true
            let num = 0
            for(let i=0; i<state.data.length; i++) {
                if (state.answer[i] == state.data[i].answer) {
                    num++
                }
            }
            let score = 100/state.data.length*num
            const { data } = await submitTestScore({ _id, score })
            state.score = data.score
            if (data.score>59) {
                message.success('真不错，您的得分为'+data.score+'！')
            } else {
                message.error('下次努力哦，您的得分为'+data.score+'！')
            }
            state.reset = true
        }

        const resetPage = async () => {
            state.retest = false
            state.reset = false
            state.read = false

            await getPaper()
        }

        const changeAnswer = (index, value) => {
            state.answer[index] = value
            console.log(index, value, state.answer)
        }

        return {
            ...toRefs(state),
            submit,
            resetPage,
            changeAnswer,
        }
    },
})
</script>

<style lang="less" scoped>
    .test-manage {
        height: 100%;
        overflow-y: auto;
        padding: 0 0 30px 0;
        .tip {
            width: 100%;
            text-align: center;
            font-size: 30px;
            color: skyblue;
            font-weight: 900;
            padding-top: 30px;
        }
        .retest-tip {
            text-align: center;
            font-size: 20px;
            margin: 30px 0;
        }
        .submit {
            text-align: center;
        }
    }
</style>