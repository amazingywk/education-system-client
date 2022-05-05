<template>
    <div class="paper-manage">
        <navbar />
        <div class="content">
            <div class="parts-search">
                搜索：
                <a-input
                    v-model:value="search.papername"
                    placeholder="试卷名(模糊搜索)"
                    @pressEnter="getPaperList"
                    width="300px"
                ></a-input>
                <a-input
                    v-model:value="search.teacher"
                    placeholder="出卷人"
                    @pressEnter="getPaperList"
                    width="300px"
                ></a-input>
                <a-button @click="toAddOrUpdate(null)">添加试卷</a-button>
            </div>
            <a-table
                :columns="columns"
                :data-source="data"
                rowKey="_id"
                bordered
                :pagination="{ pageSize:7 }"
            >
                <template #action ="{ record }">
                    <a-button @click="toAddOrUpdate(record)">编辑</a-button>
                </template>
                <template #teacher ="{ record }">
                    {{ record.teacher?record.teacher[1]:'-' }}
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import Navbar from '@/components/navbar.vue'
import { queryPaperList } from '@/api/paper'
import { useRouter } from 'vue-router'

export default defineComponent({
    name:'PaperDetails',

    components:{
        Navbar,
    },

    setup() {

        const router = useRouter()

        const state = reactive({
            search:{
                papername: undefined,
                teacher: undefined,
            },
            data: []
        })

        const columns = [
            {
                title: '试卷名',
                width: 100,
                dataIndex: 'papername',
                fixed: 'left',
            },
            {
                title: '出卷人',
                width: 100,
                slots: {
                    customRender: 'teacher',
                },
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
          papername: [
              {
              required: true,
              message: '请输入课程名',
              },
              {
              min: 2,
              max: 10,
              message: '班级名必须在2到10之间',
              },
          ],
          number: [
              {
              required: true,
              message: '请输入编号',
              },
              {
              min: 2,
              max: 12,
              message: '编号必须在2到12之间',
              },
          ],
        }

        onBeforeMount(() => {
            getPaperList()
        })

        const getPaperList = async () => {
            const { data } = await queryPaperList(state.search)
            console.log(data)
            state.data = data
            
        }

        const toAddOrUpdate = (record) => {
            console.log(record)
            if (record) {
                router.push({
                    path: '/paper-manage/add',
                    query: {
                        _id: record._id
                    }
                })
            } else {
                router.push('/paper-manage/add')
            }
        }

        return {
            ...toRefs(state),
            columns,
            rules,
            getPaperList,
            toAddOrUpdate,
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
    .paper-manage {
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
                    height: 32px;
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
