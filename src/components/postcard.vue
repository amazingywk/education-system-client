<template>
    <div class="postcard">
        <editUser :editVisible="editVisible" :user="user" @fallback="fallback"/>
        <div class="picture">
            <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F85%2F50%2F5981488bc465d_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653098396&t=737d8ed4a3095adc35c260cf25b00330" alt="">
        </div>
        <div class="username">{{ user.username }}</div>
        <div class="gender">性别：{{ user.gender === 'male'?'男':'女' }}</div>
        <div class="role">角色：{{ role }}</div>
        <div class="phone">手机号：{{ user.phone?user.phone:'用户暂未填写' }}</div>
        <div class="role">
            <span class="red" v-if="user.testScore===-1" @click="toTest">暂未做综合测评</span>
            <span :class="user.testScore>59?'green':'red'" v-else @click="toTest">综合评测得分：{{ user.testScore }}</span>
        </div>
        <div class="edit-button">
            <a-button type="primary" @click="changeVisible()">
                编辑
            </a-button>
        </div>
    </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
import storage from '@/utils/storage'
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import EditUser from './editUser.vue'

export default defineComponent({
    name: 'POSTCARD',

    components: {
        EditUser
    },

    setup() {

        const router = useRouter()

        const state = reactive({
            user: {
                phone: undefined,
                role: undefined,
                username: undefined,
                gender: undefined,
            },
            role: undefined,
            editVisible: false,
        })

        onBeforeMount(async () => {
            getUser()
        })

        async function getUser() {
            const user = storage.getUser()
            const { data } = await getUserInfo(user._id)
            state.user = data
            switch (data.role) {
                case 'admin' :
                    state.role = '管理员'
                    break
                case 'student' :
                    state.role = '学生'
                    break
                case 'teacher' :
                    state.role = '教师'
                    break
                case 'guest' :
                    state.role = '游客'
                    break
                case 'recruit' :
                    state.role = '招生管理员'
                    break
            }
        }

        const changeVisible = () => {
            state.editVisible = !state.editVisible
        }

        const fallback = () => {
            getUser()
            state.editVisible = false
        }

        const toTest = () => {
            router.push('/test-manage')
        }

        return {
            ...toRefs(state),
            changeVisible,
            fallback,
            toTest,
        }
    },
})
</script>

<style lang="less" scoped>
    .postcard {
        float: right;
        height: 100%;
        width: 200px;
        border-left: 1px solid #000;
        padding-top: 30px;
        .picture {
            width: 120px;
            margin: 0 auto;
            img {
                width: 120px;
                height: 120px;
            }
        }
        .username {
            margin: 20px 0;
            width: 100%;
            text-align: center;
            font-size: 20px;
            font-weight: 700;
        }
        .gender, .role, .phone {
            margin-left: 40px;
        }
        .green {
            cursor: pointer;
            color: green;
        }
        .red {
            cursor: pointer;
            color: red;
        }
        .edit-button {
            width: 100%;
            margin-top: 100px;
            text-align: center;
        }
    }
</style>
