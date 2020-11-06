<template>
    <section class="app-main">
        <keep-alive exclude="login">
            <router-view v-if="$route.meta.keepAlive" :key="$route.path"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="key"></router-view>
    </section>
</template>
<script>

export default {
    name: 'AppMain',
    data() {
        return {};
    },
    computed: {
        key () {
            return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date();
        }
    }
};
</script>
