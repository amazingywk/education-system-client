<template>
    <div class="navbar">
        <a @click="() => {collapsed = !collapsed}" class="menu-button">
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
        </a>

        <div class="logo">
            <img src="@/assets/img/logo.png" alt="" width="50" height="50">
            <div class="logo-name">教育培训管理系统</div>
        </div>

        <a-menu
            v-if="collapsed"
            mode="vertical"
            theme="dark"
            class="nav-menu"
            :selectedKeys="selectedKeys"
        >
            <a-menu-item v-for="item in list" :key="item.key" @click="changePage(item.key)">
                {{ item.title }}
            </a-menu-item>
        </a-menu>

        <div class="title">
            {{currentTitle}}
        </div>

        <div class="user">
            <span><UserOutlined class="user-logo"/>{{username}}</span>
            
        </div>
        <a class="logout" @click="logout">注销</a>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import storage from '@/utils/storage.js'
import { message } from 'ant-design-vue'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons-vue'
import { queryAuthority } from '@/api/user'
import { adminAuthority, guestAuthority, recruiterAuthority, studentAuthority, teacherAuthority } from '@/config'

export default defineComponent({
    name: 'NAVBAR',

    components: {
        MenuUnfoldOutlined,
        MenuFoldOutlined,
        UserOutlined,
    },

    setup() {
        const router = useRouter()

        const state = reactive({
            collapsed: false,
            selectedKeys: [],
            currentTitle: undefined, // 当前页面名称
            username: undefined, // 显示的用户名
            list: [],               // 权限列表
        })

        onBeforeMount(async () => {
            await getAuthority()

            let path = router.currentRoute.value.path
            state.selectedKeys.push(path.slice(1))

            state.username = storage.getUser().username
            
            // 根据路径显示标题
            state.list.map(node => {
                if (node.key === path.slice(1)){
                    state.currentTitle = node.title
                }
            })
            // 如果为课表管理则单独显示，因为课表管理不在路径中
            if(path === '/timetable-manage') {
                state.currentTitle = '课表管理'
            }
            if (path.startsWith('/home')) {
                state.currentTitle = '主页'
            }
        })

        async function getAuthority () {
            const user = storage.getUser()
            if (user) {
                const { data } = await queryAuthority(user._id)
                switch(data.role) {
                    case 'admin' :
                        state.list = adminAuthority;
                        break;
                    case 'student' :
                        state.list = studentAuthority;
                        break;
                    case 'teacher' :
                        state.list = teacherAuthority;
                        break;
                    case 'guest' :
                        state.list = guestAuthority;
                        break;
                    case 'recruiter' :
                        state.list = recruiterAuthority;
                }
            } else {
                router.push('/post')
            }
        }

        const logout = () => {
            storage.removeUser()
            message.success('注销成功')
            router.push('/post')
        }

        const changePage = (path) => {
            router.push('/'+path)
        }

        return {
            ...toRefs(state),
            logout,
            changePage,
        }
    },
})
</script>

<style lang="less" scoped>

    &:deep(.ant-menu-item-only-child) {
        padding: 0!important;
        text-align: center;
    }
    .navbar {
        display: flex;
        width: 100%;
        height: 50px;
        background-color: skyblue;
        .menu-button {
            margin: auto 0;
            font-size:30px;
            color: #fff;
            margin-left: 30px;
        }
        .logo {
            display:flex;
            margin-left: 30px;
            .logo-name {
                font-size: 28px;
                font-weight: 561;
                color: #fff;
            }
        }
        .nav-menu {
            position: absolute;
            top: 50px;
            width: 150px;
            z-index: 3;
        }
        .title {
            margin: 0 auto;
            font-size: 28px;
            font-weight: 561;
            color: #fff;
        }
        .user {
            position: relative;
            width:300px;
            margin-right: 64px;
            text-align: right;
            font-size: 20px;
            .user-logo {
                font-size: 23px;
                margin: 14px 0;
            }
        }
        .logout {
            position: absolute;
            right: 30px;
            top: 17px;
            font-size: 15px;
            color: #fff;
        }
    }
</style>
