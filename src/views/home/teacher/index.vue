<template>
    <div class="home-teacher">
        <navbar />
        <postcard />
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import Navbar from '@/components/navbar.vue'
import Postcard from '@/components/postcard.vue'

export default defineComponent({
    name:'HomeTeacher',

    components:{
        Navbar,
        Postcard
    },

    setup() {

        return {
            
        }
    },
})
</script>

<style lang="less" scoped>
    .home-teacher {
        height: 100%;
    }
</style>