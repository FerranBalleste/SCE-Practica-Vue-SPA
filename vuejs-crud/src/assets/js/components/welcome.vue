<template>
    <div id="welcome_background" class="container-sm" :style="{height: heightVar}">
        <search-city id="search_component" @clicked="onClickChild"></search-city>
    </div>
</template>
<script>
    import Search from './search.vue';

    export default {
        data() {
        return {
            heightVar: "max-height:90vh"
        }
        },
      components: {
          'searchCity' : Search
      },
      methods: {
      onClickChild(value) {
          if(value == 1)
            this.heightVar = "20vh"
            else
            this.heightVar = "90vh"
        }
        }
    }
</script>
<style>
#welcome_background{
    background-image: url('http://localhost:8080/src/assets/img/beans.jpg');
    background-position: center;
    background-repeat: no-repeat; 
    background-size: cover;
    transition: height 1s ease-in-out;
}

#search_component{
width:700px; 
color: black; 
max-width: 85vh;
}

</style>
