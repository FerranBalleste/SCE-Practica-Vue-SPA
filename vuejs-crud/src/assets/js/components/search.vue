<template>
    <div>
      <label name="city">City</label>
      <multiselect v-model="value" :options="options" :optionsLimit=3 placeholder="Introduce the city name" 
      @select="dispatchAction" @remove="welcome" @search-change="updateCities"
      :internal-search="false"></multiselect>
    </div>
</template>
<script>
    import Vue from 'vue'
    import Multiselect from 'vue-multiselect'
    import axios from 'axios'

    Vue.component('multiselect', Multiselect)
    export default {
        components: {Multiselect},
        created: function(){
            this.updateCities("T")
        },
        methods: {
          updateCities(city){
            if(city){
            axios.get("http://localhost:3000/api/city/" + city)
              .then(res => {
                this.options = res.data;
              })
              .catch(error => {console.log(error)})
            }
          },
          dispatchAction (actionName) {
            this.$emit("clicked", 1)
            this.$router.push( { name: 'all_products', params: { city: actionName }} )
          }, 
          welcome (actionName){
            this.$emit("clicked", 0)
            this.$router.push( { name: 'empty'} )
          }
        },
        data() {
            return {
              value: null,
              options: ['Tarragona'],
              cityName: ''
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>