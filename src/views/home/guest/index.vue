<template>
    <div class="home-guest">
        <navbar />
        <postcard />
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import Navbar from '@/components/navbar.vue'
import Postcard from '@/components/postcard.vue'

export default defineComponent({
    name:'HomeGuest',

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
    .home-guest {
        height: 100%;
    }
</style>