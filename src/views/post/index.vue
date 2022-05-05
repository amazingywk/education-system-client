<template>
    <div>
        <div class="top-bar">
            <div class="logo">
                <img src="@/assets/img/logo.png" alt="" width="50" height="50">
                <div class="logo-name">教育培训管理系统</div>
            </div>
            <div class="button-login">
                <a @click="showModel('login')">登 录</a>
                <a @click="showModel('register')">注 册</a>
            </div>
        </div>

        <a-modal
            v-model:visible="visible"
            :title="isLogin?'登录':'注册'"
            @ok="handleOk"
            cancelText="取 消"
            :okText="isLogin?'登录':'注册'"
            centered
            :width="380"
        >
            <a-form
                v-if="visible"
                ref="formRef"
                :model="formState"
                :rules="rules"
            >
                <a-form-item ref="username" label="账号" name="username"  style="margin-left: 28px;">
                    <a-input v-model:value="formState.username" placeholder="请输入账号" />
                </a-form-item>
                <a-form-item label="密码" name="password" style="margin-left: 28px;">
                    <a-input-password v-model:value="formState.password" placeholder="请输入密码"/>
                </a-form-item>
                <a-form-item label="确认密码" name="repassword" v-if="isLogin?false:true">
                    <a-input-password v-model:value="formState.repassword" placeholder="请输入密码"/>
                </a-form-item>
                <a-form-item label="手机号" name="phone" v-if="isLogin?false:true" style="margin-left: 28px;">
                    <a-input v-model:value="formState.phone" placeholder="请输入手机号" type="number" />
                </a-form-item>
                <a-form-item label="性别" name="gender"  v-if="isLogin?false:true" style="margin-left: 28px;">
                    <a-radio-group v-model:value="formState.gender">
                        <a-radio value="male">男</a-radio>
                        <a-radio value="female">女</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="注册角色" v-if="isLogin?false:true" name="role">
                    <a-select v-model:value="formState.role" placeholder="请选择您要注册的角色">
                        <a-select-option value="recruiter">招生管理员</a-select-option>
                        <a-select-option value="teacher">教师</a-select-option>
                        <a-select-option value="student">学生</a-select-option>
                        <a-select-option value="guest">游客</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-modal>

        <div class="content">
            <div class="carousel">
                <a-carousel autoplay>
                    <div><img src="https://www.tencent.com/img/banners/brief-1-1.jpg" alt=""></div>
                    <div><img src="https://www.tencent.com/img/banners/home-bg-carbon.jpg" alt=""></div>
                    <div><img src="https://www.tencent.com/img/banners/brief-1-1.jpg" alt=""></div>
                    <div><img src="https://www.tencent.com/img/banners/banner-game.jpg" alt=""></div>
                </a-carousel>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { login, register } from '@/api/login.js'
import storage from '@/utils/storage.js'
import md5 from 'js-md5'

export default defineComponent({
    name:'POST',
    setup() {

        const router = useRouter()

        const state = reactive({
            formRef:undefined,
            visible: false,
            isLogin: false,
            formState: {
                username: undefined,
                password: undefined,
                phone: undefined,
                repassword: undefined,
                gender: "male",
                role: undefined,
            },
        })

        const rules = {
          username: [
              {
              required: true,
              message: '请输入账号',
              },
              {
              min: 2,
              max: 12,
              message: '密码必须在2到12之间',
              },
          ],
          password: [
              {
              required: true,
              message: '请输入密码',
              },
              {
              min: 6,
              max: 12,
              message: '密码必须在6到12之间',
              },
          ],
          repassword: [
              {
              required: true,
              message: '请确认密码',
              },
              {
              min: 6,
              max: 12,
              message: '密码必须在6到12之间',
              },
          ],
          gender: [
              {required: true}
          ],
          role: [
              {
                  required:true,
                  message: '请选择注册角色'
              }
          ]
        }

        onBeforeMount(async () => {
            const user = storage.getUser()
            if (user._id){
                try {
                    const { data } = await login(user)
                    message.success('正在自动登录跳转')
                    router.push('/home-'+data.role)
                } catch (error) {
                    console.log(error)
                    storage.removeUser()
                }
            }
        })

        const showModel = (type) => {
            if(type === 'login'){
                state.isLogin = true
            }else{
                state.isLogin = false
            }
            state.visible = true
        }

        const handleOk = () => {
            state.formRef.validate()
                .then(async () => {
                    if (state.isLogin) {// 登录
                        const request = {
                            username: state.formState.username,
                            password: md5(state.formState.password)
                        }
                        const { data } = await login(request)
                        console.log(data)
                        message.success('登录成功，正在跳转')
                        storage.saveUser({ ...request, _id: data._id })
                        router.push('/home-'+data.role)
                    }else {// 注册
                        if (state.formState.password!==state.formState.repassword) {
                            message.error('请确保两次输入的密码相同')
                        }else {
                            if (state.formState.phone){
                                if (state.formState.phone.length!==11){
                                    message.error('请输入正确的手机号')
                                    return
                                }
                            }
                            let request = {
                                username: state.formState.username,
                                password: md5(state.formState.password),
                                phone: state.formState.phone,
                                gender: state.formState.gender,
                                role: state.formState.role,
                            }
                            const { data } = await register(request)
                            message.success('注册并登录成功，正在跳转')
                            storage.saveUser({...request, _id: data._id})
                            router.push('/home-'+data.role)
                        }
                    }
                })
                // .catch(error => {
                //     console.log('error', error);
                // });
        }

        return {
            ...toRefs(state),
            rules,
            showModel,
            handleOk,
        }
    }
})
</script>

<style lang="less" scoped>
    /**
    * 去除input type="number" 右边的上下箭头
    */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type='number'] {
      -moz-appearance: textfield;
    }

    .top-bar{
        position:fixed;
        display: flex;
        width: 100%;
        height: 50px;
        // background-color: skyblue;
        z-index: 2;
        .logo{
            display:flex;
            margin-left: 100px;
            .logo-name{
                font-size: 28px;
                font-weight: 561;
                color: #fff;
            }
        }
        .button-login{
            position: absolute;
            right: 90px;
            top:13px;
            a{
                // color: #000;
                // font-size: 16px;
                margin-right:10px;
                height: 72px;
                // line-height: 72px;
                font-size: 16px;
                color: #fff;
                font-weight: bold;
            }
        }
    }
    .content{
        .carousel {
            img{
                width: 100%;
                height: 730px;
            }
        }
    }
</style>