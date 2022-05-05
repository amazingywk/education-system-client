<template>
    <div class="course-manage">
        <nav-bar />
        <div class="content">
            <div class="parts-search">
                搜索：
                <a-input
                    v-model:value="search.coursename"
                    placeholder="课程名(模糊搜索)"
                    @pressEnter="getCourseList"
                    width="300px"
                ></a-input>
                <a-input
                    v-model:value="search.number"
                    placeholder="编号"
                    @pressEnter="getCourseList"
                    width="300px"
                ></a-input>
                <a-button @click="changeVisible(null)">添加课程</a-button>
            </div>
            <a-modal
                v-model:visible="visible"
                :title="isEdit?'编辑':'添加'"
                @ok="handleOk"
                cancelText="取 消"
                okText="确定"
                centered
                :width="380"
            >
                <a-form
                    v-if="visible"
                    ref="formRef"
                    :model="formState"
                    :rules="rules"
                >
                    <a-form-item label="课程名" name="coursename"  style="margin-left: 14px;">
                        <a-input v-model:value="formState.coursename" placeholder="请输入班级名" />
                    </a-form-item>
                    <a-form-item label="班级编号" name="number" >
                        <a-input v-model:value="formState.number" placeholder="请输入班级编号" />
                    </a-form-item>
                    <a-form-item label="代课老师" style="margin-left: 11px;">
                        <a-select
                            v-model:value="selectTeacher"
                            show-search
                            placeholder="请选择代课老师"
                            style="width: 200px"
                            :options="options"
                            @change="teacherChange"
                        >
                        </a-select>
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
import { defineComponent, reactive, toRefs, onBeforeMount } from 'vue'
import NavBar from '@/components/navbar.vue'
import _ from 'lodash'
import { queryCourseList, createCourse, updateCourse } from '@/api/course'
import { queryTeacherList } from '@/api/user'
import { message } from 'ant-design-vue'

export default defineComponent({
    name: 'CourseManage',

    components: {
        NavBar,
    },

    setup() {
        const state = reactive({
            data: undefined,    // table表格数据
            isEdit: false,      // 是否为编辑
            visible: false,     // table可见
            search: {           // 搜索条件
                coursename: undefined,
                number: undefined,
            },
            formState: {             // 表单数据
                coursename: undefined,
                number: undefined,
            },
            formRef: undefined,     // 表单实例
            options: [],            // 老师选项数据
            selectTeacher: undefined, // 选择的代课老师
        })

        const columns = [
            {
                title: '课程名',
                width: 100,
                dataIndex: 'coursename',
                fixed: 'left',
            },
            {
                title: '课程编号',
                width: 100,
                dataIndex: 'number',
            },
            {
                title: '代课老师',
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
          coursename: [
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

        // 页面加载前获取table数据
        onBeforeMount(async () => {
            const { data } = await queryTeacherList()
            state.options = data
            getCourseList()
        })

        const getCourseList = async () => {
            const { data } = await queryCourseList(state.search)
            state.data = data
        }

        const changeVisible = (record) => {
            if(record){
                state.isEdit = true
                state.formState = _.cloneDeep(record)
                state.selectTeacher = record.teacher?record.teacher[0]:undefined
            } else {
                state.isEdit = false
                state.selectTeacher = undefined
                state.formState = {
                    coursename: undefined,
                    number: undefined,
                    teacher: []
                }
            }
            state.visible = true
        }

        const teacherChange = (_,node) => {
            state.formState.teacher =  [node.value, node.label]
        }

        const handleOk = () => {
            console.log(state.formState)
            state.formRef.validate()
                .then(async () => {
                    // 编辑
                    if (state.isEdit){
                        await updateCourse(state.formState)
                        message.success('编辑课程成功')
                    } else {
                        // 创建课程
                        await createCourse(state.formState)
                        message.success('创建课程成功')
                    }

                    getCourseList()
                    state.visible = false
                })
                .catch(error => {
                    console.log('error', error);
                });
        }

        return {
            ...toRefs(state),
            columns,
            rules,
            getCourseList,
            changeVisible,
            teacherChange,
            handleOk,
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
    
</style>