<template>
    <div class="class-manage">
        <nav-bar />
        <div class="content">
            <div class="parts-search">
                搜索：
                <a-input
                    v-model:value="search.classname"
                    placeholder="班级名(模糊搜索)"
                    @pressEnter="getClassList"
                    width="300px"
                ></a-input>
                <a-input
                    v-model:value="search.number"
                    placeholder="编号"
                    @pressEnter="getClassList"
                    width="300px"
                ></a-input>
                <a-button @click="changeVisible(null)">添加班级</a-button>
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
                    <a-form-item ref="username" label="班级名" name="classname"  style="margin-left: 14px;">
                        <a-input v-model:value="formState.classname" placeholder="请输入班级名" />
                    </a-form-item>
                    <a-form-item ref="number" label="班级编号" name="number" >
                        <a-input v-model:value="formState.number" placeholder="请输入班级编号" />
                    </a-form-item>
                    <a-form-item label="班主任" style="margin-left: 26px;">
                        <a-select
                            v-model:value="selectTeacher"
                            show-search
                            placeholder="请选择班主任"
                            :options="teacherOptions"
                            @change="teacherChange"
                        >
                        </a-select>
                    </a-form-item>
                    <a-form-item label="班内学生" name="students" style="margin-left: 11px;">
                        <a-select
                            v-model:value="formState.students"
                            show-search
                            mode="multiple"
                            placeholder="选择一到多名学生"
                            :options="options"
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
                    <a-button @click="toTimetable(record)" type="primary" style="margin-left: 20px;">课表</a-button>
                </template>
                <template #teacher ="{ record }">
                    {{ record.teacher?record.teacher[1]:'-' }}
                </template>
                <template #students ="{ record }">
                    <span>
                        {{
                            record?.studentsName?.join('、')
                        }}
                    </span>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive, onBeforeMount, toRefs } from 'vue'
import NavBar from '@/components/navbar.vue'
import { queryClassList, createClass, updateClass  } from '@/api/class'
import { queryStudentList, queryTeacherList } from '@/api/user'
import _ from 'lodash'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

export default defineComponent({
    name: 'ClassManage',

    components: {
        NavBar,
    },

    setup() {

        const router = useRouter()

        const state = reactive({
            data: undefined,    // table表格数据
            isEdit: false,      // 是否为编辑
            visible: false,     // table可见
            search: {           // 搜索条件
                classname: undefined,
                number: undefined,
            },
            formState: {},          // 表单数据
            formRef: undefined,     // 表单实例
            options: [],            // 学生选项数据
            teacherOptions: [],     // 教师选项数据
            selectTeacher: undefined,   // 选中的教师
        })

        const columns = [
            {
                title: '班级名',
                width: 100,
                dataIndex: 'classname',
                fixed: 'left',
            },
            {
                title: '班级编号',
                width: 100,
                dataIndex: 'number',
            },
            {
                title: '班主任',
                width: 100,
                // dataIndex: 'number',
                slots: {
                    customRender: 'teacher',
                },
            },
            {
                title: '学生',
                width: 200,
                // dataIndex: 'students',
                slots: {
                    customRender: 'students',
                },
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

        const rules = {
          classname: [
              {
              required: true,
              message: '请输入班级名',
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
            const { data } = await queryStudentList()
            const { data: teacherOptions } = await queryTeacherList()
            state.options = data
            state.teacherOptions = teacherOptions
            getClassList()
        })

        const getClassList = async () => {
            const { data } = await queryClassList(state.search)
            state.data = data

            // 给班级添加一个studentsName属性来通过_id显示名称
            data?.map(c => {
                c.studentsName = []
                c.students?.map(student =>  {
                    for(let i = 0; i<state.options.length; i++) {
                        if(state.options[i].value === student) {
                            c.studentsName.push(state.options[i].label)
                        }
                    }
                })
            })
        }

        const teacherChange = (_,node) => {
            state.formState.teacher =  [node.value, node.label]
        }

        const handleOk = () => {
            state.formRef.validate()
                .then(async () => {
                    // 编辑
                    if (state.isEdit){
                        await updateClass(state.formState)
                        message.success('编辑班级成功')
                    }else {
                        // 新增班级
                        await createClass(state.formState)
                        message.success('新增班级成功')
                    }

                    getClassList()
                    state.visible = false
                })
                .catch(error => {
                    console.log('error', error);
                });
        }

        const changeVisible = (record) => {
            if(record){
                state.isEdit = true
                state.formState = _.cloneDeep(record)
                state.selectTeacher = record.teacher?record.teacher[0]:undefined
                // 去除多余属性
                state.formState.studentsName = undefined
            } else {
                state.isEdit = false
                state.selectTeacher = undefined
                state.formState = {
                    classname: undefined,
                    number: undefined,
                    teacher: [],
                    students: [],
                }
            }
            state.visible = true
        }

        const toTimetable = (record) => {
            router.push({
                path: 'timetable-manage',
                query: { _id: record._id }
            })
        }

        return {
            ...toRefs(state),
            columns,
            rules,
            getClassList,
            teacherChange,
            handleOk,
            changeVisible,
            toTimetable,
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