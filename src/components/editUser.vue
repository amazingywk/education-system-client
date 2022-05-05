<template>
    <div class="edit-user">
        <a-modal
            v-model:visible="visible"
            title="编辑"
            @ok="handleOk"
            cancelText="取 消"
            okText="确 认"
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
                <a-form-item label="密码" name="password" style="margin-left: 39px;">
                    <a-input-password v-model:value="formState.password" placeholder="请输入密码"/>
                </a-form-item>
                <a-form-item label="确认密码" name="repassword" style="margin-left: 11px;">
                    <a-input-password v-model:value="formState.repassword" placeholder="请输入密码"/>
                </a-form-item>
                <a-form-item label="手机号" name="phone" style="margin-left: 28px;">
                    <a-input v-model:value="formState.phone" placeholder="请输入手机号" type="number" />
                </a-form-item>
                <a-form-item label="性别" name="gender" style="margin-left: 28px;">
                    <a-radio-group v-model:value="formState.gender">
                        <a-radio value="male">男</a-radio>
                        <a-radio value="female">女</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="角色" name="role" style="margin-left: 28px;">
                    <a-select v-model:value="formState.role" placeholder="请选择您要注册的角色" disabled>
                        <a-select-option value="admin">管理员</a-select-option>
                        <a-select-option value="recruiter">招生管理员</a-select-option>
                        <a-select-option value="teacher">教师</a-select-option>
                        <a-select-option value="student">学生</a-select-option>
                        <a-select-option value="guest">游客</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import { updateUser } from '@/api/user'
import { message } from 'ant-design-vue'
import { defineComponent, toRefs, reactive, onBeforeMount, watch } from 'vue'
import md5 from 'js-md5'

export default defineComponent({
    name: 'EDITUSER',

    props: {
        editVisible: { type: Boolean, default: false },
        user: { type: Object },
    },

    emits: ['fallback'],

    setup(props, { emit }) {
        console.log(props)
        const state = reactive({
            visible: false,
            formState: {
                username: undefined,
                password: undefined,
                phone: undefined,
                repassword: undefined,
                gender: "male",
                role: undefined,
            },
            formRef: undefined,
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
          gender: [
              {required: true}
          ],
        }

        onBeforeMount(async () => {

        })

        const handleOk = async () => {
            state.formRef.validate()
                .then(async () => {
                const { password, repassword } = state.formState
                    if (!password && !repassword) {
                        await updateUser({...state.formState })
                        message.success('编辑成功')
                        state.visible = false
                        emit('fallback')
                    } else {
                        if (password !== repassword) {
                            message.error('请确保两次输入的密码相同')
                        } else if(password && (password.length<6 || repassword.length<6)) {
                            message.error('密码长度必须大于6')
                        } else {
                            await updateUser({...state.formState, password:md5(state.formState.password) })
                            message.success('编辑成功')
                            state.visible = false
                            emit('fallback')
                        }
                    }
                })
                .catch((error) => {
                    console.log(state.formState)
                    console.log(error)
                    message.error('请检查输入或刷新重试')
                })
        }

        watch(
            props,
            (props) => {
                state.visible = props.editVisible
                state.formState = { ...props.user, password: undefined, repassword: undefined }
            },
            {
                immediate: true,
                deep: true
            }
        )

        return {
            ...toRefs(state),
            rules,
            handleOk
        }
    },
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
</style>
