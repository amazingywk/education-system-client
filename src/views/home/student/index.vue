<template>
    <div class="home-student">
        <navbar />
        <postcard />
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import Navbar from '@/components/navbar.vue'
import storage from '@/utils/storage'
import { getStudentTimetable } from '@/api/user'
import Postcard from '@/components/postcard.vue'

export default defineComponent({
    name:'HomeStudent',

    components:{
        Navbar,
        Postcard
    },

    setup() {

        const state = reactive({
            
        })

        onBeforeMount(async () => {
            const user = storage.getUser()
            const { data } = await getStudentTimetable(user._id)
            console.log(data)

        })

        return {
            ...toRefs(state),
        }
    },
})
</script>

<style lang="less" scoped>
    
</style>