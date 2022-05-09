<template>
    <div class="recruit-manage">
        <navbar />
        <div class="content">
            <div class="parts-search">
                搜索：
                <a-input
                    v-model:value="search.username"
                    placeholder="账号(模糊搜索)"
                    @pressEnter="getUserList"
                    width="300px"
                ></a-input>
                <a-input
                    v-model:value="search.phone"
                    placeholder="手机号"
                    @pressEnter="getUserList"
                    width="300px"
                ></a-input>
                <a-select
                    v-model:value="search.gender"
                    @change="getUserList"
                    placeholder="性别"
                >
                    <a-select-option :value="null">全部</a-select-option>
                    <a-select-option value="male">男</a-select-option>
                    <a-select-option value="female">女</a-select-option>
                </a-select>
            </div>
            <a-table
                :columns="columns"
                :data-source="data"
                rowKey="_id"
                bordered
                :pagination="{pageSize:7}"
            >
                <template #action ="{ record }">
                    <a-popconfirm
                        title="确定要通过该用户吗"
                        ok-text="确定"
                        cancel-text="再想想"
                        @confirm="confirm(record)"
                    >
                        <a-button type="primary">通过</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import Navbar from '@/components/navbar.vue'
import { changeGuestToStudent, queryUserList } from '@/api/user.js'
import { message } from 'ant-design-vue';

export default defineComponent({
    name: 'UserManage',

    components: {
        Navbar,
    },

    setup() {

        const state = reactive({
            data: [], // table表格数据
            search: {
                username: undefined,
                phone: undefined,
                gender: undefined,
            },
            user: {},
            editVisible: false,
        })

        onBeforeMount(() => {
            getUserList()
        })

        const columns = [
            {
                title: '账号',
                width: 100,
                dataIndex: 'username',
                fixed: 'left',
            },
            {
                title: '手机号',
                width:100,
                dataIndex: 'phone',
            },
            {
                title: '性别',
                width: 100,
                dataIndex: 'gender',
                key: 'age',
                fixed: 'left',
            },
            {
                title: '角色',
                width: 100,
                dataIndex: 'role',
                fixed: 'left',
            },
            {
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 100,
                slots: {
                    customRender: 'action',
                },
            },
        ]

        const getUserList = async () => {
            state.data = []
            const { data } = await queryUserList(state.search)
            data.map(user => {
                if (user.role === 'guest') {
                    state.data.push(user)
                }
            })
        }

        const confirm = async (guest) => {
            await changeGuestToStudent(guest)
            message.success('操作成功')

            getUserList()
        }

        return {
            ...toRefs(state),
            columns,
            getUserList,
            confirm
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
    .parts-search {
        margin: 30px 0 10px 30px;
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
</style>