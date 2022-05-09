<template>
    <div class="card">
        <div class="card-title">
            {{index+1}}、{{ problem.question }}
        </div>
        <div class="choice" v-if="problem.isChoice">
            <div v-for="(choice, index) in problem.choices" :key="index">
                {{ index===0?'A：':index===1?'B：':index===2?'C：':'D：'}}{{ choice }}
            </div>
        </div>
        <div class="else" v-else></div>
        <div class="answer">
            您的答案为：
            <input v-model="answer" @keyup="change"/>
            <span v-if="read">
                <CheckOutlined style="color: green; fontSize: 40px" v-if="answer==problem.answer"/>
                <CloseOutlined style="color: red; fontSize: 40px" v-else/>
            </span>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';

export default defineComponent({
    name:'PaperAdd',

    components: {
        CheckOutlined,
        CloseOutlined,
    },

    props: {
        problem: { type: Object },
        index: { type: Number },
        read: { type: Boolean, default: false }
    },

    emits: [ 'changeAnswer' ],

    setup(props, { emit }) {

        const state = reactive({
            data: [],
            answer: undefined,
        })

        const change = () => {
            emit('changeAnswer',props.index,state.answer)
        }

        return {
            ...toRefs(state),
            change
        }
    },
})
</script>

<style lang="less" scoped>
    input {
            outline: none;
            border: none;
            border-bottom: 1px solid #000;
            width: 80px;
        }
    .card {
        min-width: 500px;
        min-height: 100px;
        margin: 30px 150px;
        .card-title {
            font-size: 20px;
            font-weight: 500;
        }
        .choice {
            font-size: 15px;
            margin: 30px 0 0px 30px;
            div {
                margin: 15px 0;
            }
        }
        .else {
            height:130px;
        }
        .answer {
            margin-left: 20px;
            font-size: 20px
        }
    }
</style>