<template>
    <div class="home-student">
        <navbar />
        学生主页
    </div>
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue'
import Navbar from '@/components/navbar.vue'
import storage from '@/utils/storage'
import { getStudentTimetable } from '@/api/user'

export default defineComponent({
    name:'HomeStudent',

    components:{
        Navbar
    },

    setup() {

        onBeforeMount(async () => {
            const user = storage.getUser()
            const { data } = await getStudentTimetable(user._id)
            console.log(data)
        })

        return {
            
        }
    },
})
</script>

<style lang="less" scoped>
    
</style>