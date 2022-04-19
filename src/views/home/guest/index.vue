<template>
    <div class="home-guest">
        <navbar />
        游客主页
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import Navbar from '@/components/navbar.vue'

export default defineComponent({
    name:'HomeGuest',

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