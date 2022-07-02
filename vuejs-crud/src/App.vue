<template>
    <div class="container">
      <welcome></welcome>
      <div id="page">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
      </div>
    </div>
</template>

<style>
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
      opacity: 0
    }
</style>

<script>
    import list from './assets/js/components/welcome.vue';

    export default {
      components: {
          'welcome' : list
      }
    }
</script>
