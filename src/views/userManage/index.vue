<template>
    <div class="user-manage">
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
                <a-select
                    v-model:value="search.disabled"
                    @change="getUserList"
                    placeholder="状态"
                >
                    <a-select-option :value="null">全部</a-select-option>
                    <a-select-option :value="false">已启用</a-select-option>
                    <a-select-option :value="true">已禁用</a-select-option>
                </a-select>
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
                <a-select
                    v-model:value="search.role"
                    @change="getUserList"
                    placeholder="角色"
                >
                    <a-select-option :value="null">全部</a-select-option>
                    <a-select-option value="recruiter">招生管理员</a-select-option>
                    <a-select-option value="teacher">教师</a-select-option>
                    <a-select-option value="student">学生</a-select-option>
                    <a-select-option value="visitor">游客</a-select-option>
                </a-select>
            </div>
            <a-table
                :columns="columns"
                :data-source="data"
                rowKey="_id"
                bordered
            >
                <template #action ="{ record }">
                    <a-button @click="changeUserState(record)">{{record.disabled?'启用':'禁用'}}</a-button>
                    <a-button @click="changeUserState(record)">编辑</a-button>
                </template>
                <template #disabled="{ record }">
                    <span class="state-icon">
                        <template v-if="record.disabled === false">
                            <CheckCircleOutlined style="color: green" />
                            已启用
                        </template>
                        <template v-else>
                            <CloseCircleOutlined style="color: red" />
                            已禁用
                        </template>
                    </span>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import Navbar from '@/components/navbar.vue'
import { queryUserList, enableOneUser, disableOneUser } from '@/api/user.js'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

export default defineComponent({
    name: 'UserManage',

    components: {
        Navbar,
        CheckCircleOutlined,
        CloseCircleOutlined,
    },

    setup() {

        const state = reactive({
            data: undefined, // table表格数据
            search: {
                username: undefined,
                phone: undefined,
                gender: undefined,
                role: undefined,
                disabled: false,
            }
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
                title: '状态',
                slots: {
                    customRender: 'disabled',
                },
                width: 100,
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
            const { data } = await queryUserList(state.search)
            console.log(data)
            state.data = data
        }

        const changeUserState = async (user) => {
            if ( user.disabled ){
                const { data } = await enableOneUser({ _id: user._id })
                if (data.status === 1){
                    message.success('启用该用户成功')
                } else {
                    message.error('操作失败，请重试')
                }
            } else {
                const { data } = await disableOneUser({ _id: user._id })
                if (data.status === 1){
                    message.success('禁用该用户成功')
                } else {
                    message.error('操作失败，请重试')
                }
            }

            getUserList()
        }

        return {
            ...toRefs(state),
            columns,
            getUserList,
            changeUserState,
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