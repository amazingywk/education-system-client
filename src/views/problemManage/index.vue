<template>
    <div class="problem-manage">
        <navbar />
        <div class="content">
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
                <a-button @click="changeVisible(null)">添加题目</a-button>
            </div>
            <a-modal
                v-model:visible="visible"
                :title="isEdit?'编辑':'添加'"
                @ok="handleOk"
                cancelText="取 消"
                okText="确定"
                centered
                :width="550"
            >
                <a-form
                    v-if="visible"
                    ref="formRef"
                    :model="formState"
                    :rules="rules"
                >
                    <a-form-item label="问题" name="question">
                        <!-- <a-input v-model:value="formState.question" placeholder="请输入问题" /> -->
                        <a-textarea
                            v-model:value="formState.question"
                            placeholder="请输入问题"
                            auto-size
                        />
                    </a-form-item>
                    <a-form-item label="编号" style="margin-left: -2px;" name="number">
                        <a-input v-model:value="formState.number" placeholder="编号" />
                    </a-form-item>
                    <a-form-item label="关键字" style="margin-left: -2px;">
                        <a-input v-model:value="formState.keyword" placeholder="关键字" />
                    </a-form-item>
                    <a-form-item label="是否为选择题">
                        <a-radio-group v-model:value="formState.isChoice">
                            <a-radio :value="true">是</a-radio>
                            <a-radio :value="false">否</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="A选项：" v-if="formState.isChoice">
                        <a-input v-model:value="formState.choice1" placeholder="请输入选项A" />
                    </a-form-item>
                    <a-form-item label="B选项：" v-if="formState.isChoice">
                        <a-input v-model:value="formState.choice2" placeholder="请输入选项B" />
                    </a-form-item>
                    <a-form-item label="C选项：" v-if="formState.isChoice">
                        <a-input v-model:value="formState.choice3" placeholder="请输入选项C" />
                    </a-form-item>
                    <a-form-item label="D选项：" v-if="formState.isChoice">
                        <a-input v-model:value="formState.choice4" placeholder="请输入选项D" />
                    </a-form-item>
                    <a-form-item label="答案" name="answer">
                        <a-input v-model:value="formState.answer" placeholder="答案" />
                    </a-form-item>
                </a-form>
            </a-modal>
            <a-table
                :columns="columns"
                :data-source="data"
                rowKey="_id"
                bordered
                :pagination="{pageSize:7}"
            >
                <template #action ="{ record }">
                    <a-button @click="changeVisible(record)">编辑</a-button>
                </template>
                <template #teacher ="{ record }">
                    {{ record.teacher?record.teacher[1]:'-' }}
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
import { defineComponent, toRefs, reactive, onBeforeMount } from 'vue'
import Navbar from '@/components/navbar.vue'
import _ from 'lodash'
import { message } from 'ant-design-vue'
import { createProblem, queryProblemList, updateProblem } from '@/api/problem'
import { queryTeacherList } from '@/api/user'

export default defineComponent({
    name:'ProblemManage',

    components:{
        Navbar,
    },

    setup() {

        const state = reactive({
            isEdit: false,
            visible: false,
            search:{
                author: undefined,
                keyword: undefined
            },
            formState: {},             // 表单数据
            formRef: undefined,     // 表单实例
            options: [],            //出题人选项
            data: []
        })

        const columns = [
            {
                title: '题目',
                width: 100,
                dataIndex: 'question',
                fixed: 'left',
            },
            {
                title: '编号',
                width: 100,
                dataIndex: 'number',
                fixed: 'left',
            },
            {
                title: '关键字',
                width: 100,
                dataIndex: 'keyword',
                fixed: 'left',
            },
            {
                title: '答案',
                width: 100,
                dataIndex: 'answer',
                fixed: 'left',
            },
            {
                title: '操作',
                width: 100,
                slots: {
                    customRender: 'action',
                },
            },
        ]

        const rules = {
          question: [
              {
                required: true,
                message: '请输入问题',
              },
          ],
          number: [
              {
                required: true,
                message: '请输入编号',
              },
          ],
          answer: [
              {
                required: true,
                message: '答案',
              },
          ],
        }

        onBeforeMount(async () => {
            getProblemList()
            const { data } = await queryTeacherList()
            state.options = data
        })

        const getProblemList = async () => {
            const { data } = await queryProblemList(state.search)
            console.log(data)
            state.data = data
        }

        const handleOk = () => {
            state.formRef.validate()
                .then(async () => {
                    // 编辑
                    let request = {}
                    if (state.formState.isChoice) {
                        let choices = [state.formState.choice1, state.formState.choice2, state.formState.choice3, state.formState.choice4]
                        request = {
                            question: state.formState.question,
                            isChoice: state.formState.isChoice,
                            answer: state.formState.answer,
                            keyword: state.formState.keyword,
                            number: state.formState.number,
                            choices,
                        }
                    } else {
                        request = state.formState
                    }
                    if (state.isEdit){
                        request._id = state.formState._id
                        await updateProblem(request)
                        message.success('编辑试卷成功')
                    } else {
                        // 创建试卷
                        await createProblem(request)
                        message.success('创建试卷成功')
                    }

                    getProblemList()
                    state.visible = false
                })
                .catch(error => {
                    console.log('error', error);
                });
        }

        const changeVisible = (record) => {
            console.log(record)
            if (record) {
                state.formState = _.cloneDeep(record)
                if (record.isChoice) {
                    state.formState.choice1 = record.choices[0]
                    state.formState.choice2 = record.choices[1]
                    state.formState.choice3 = record.choices[2]
                    state.formState.choice4 = record.choices[3]
                }
                state.isEdit = true
            } else {
                state.formState = {
                    question: undefined,
                    isChoice: false,
                    answer: undefined,
                    keyword: undefined,
                    number: undefined,
                }
                state.isEdit = false
            }
            state.visible = !state.visible
        }

        return {
            ...toRefs(state),
            columns,
            rules,
            getProblemList,
            handleOk,
            changeVisible,
        }
    },
})
</script>

<style lang="less" scoped>
    &:deep(.ant-table-thead > tr > th) {
        text-align: center;
    }
    &:deep(th span) {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 20px;
    }
    &:deep(td) {
        // width: 160px;
        text-align: center;
    }
    .problem-manage {
        height: 100%;
        .content {
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
        }
    }
</style>