<template>
    <div class="home-teacher">
        <navbar />
        教师主页
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import Navbar from '@/components/navbar.vue'

export default defineComponent({
    name:'HomeTeacher',

    components:{
        Navbar
    },

    setup() {

        return {
            
        }
    },
})
</script>

<style lang="less" scoped>
    
</style>