<template>
    <div class="recruit-manage">
        <navbar />
        <div class="content">
            <a-table
                :columns="columns"
                :data-source="data"
                rowKey="key"
            >
                <template #action>
                    <a>action</a>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import Navbar from '@/components/navbar.vue'

export default defineComponent({
    name:'RecruitManage',

    components:{
        Navbar
    },

    setup() {

        const columns = [
            {
                title: 'Full Name',
                width: 100,
                dataIndex: 'name',
                key: 'name',
                fixed: 'left',
            },
            {
                title: 'Age',
                width: 100,
                dataIndex: 'age',
                key: 'age',
                fixed: 'left',
            },
            {
                title: 'Action',
                key: 'operation',
                fixed: 'right',
                width: 100,
                slots: {
                    customRender: 'action',
                },
            },
        ]

        const data = [
            {
                name: '111',
                age: '11'
            },
            {
                name: '22',
                age: '22'
            }
        ]

        return {
            columns,
            data,
        }
    },
})
</script>

<style lang="less" scoped>
    
</style>