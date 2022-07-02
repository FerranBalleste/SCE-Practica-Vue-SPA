<template>
  <div class="modal-overlay">
    <div class="modal" style="border-radius: 30px;">
      <img class="check" :src="image + product.name + '.jpg'" alt="" style="display: block; margin-left: auto; margin-right: auto; width: 50%; " />
      <h6>{{ product.name }}</h6>
      <p><b>Type:</b> {{ product.type }}</p>
      <p><b>Description:</b> {{ product.description }}</p>
      <p><b>Time to prepare:</b> {{ product.time }}</p>
      <p v-if="product.qty"><b>Total price:</b> {{ (product.price * product.qty).toFixed(2) }}$</p>
      <p v-if="product.qty"><b>Quantity:</b> {{ product.qty }}</p>
      <div>
        <button class="modal_button close" @click="$emit('close-modal')">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {},
  },
  data() {
    return {
      image: "http://localhost:8080/src/assets/img/",
    };
  },
};
</script>

<style scoped>
p {
  font-size: 16px;
  margin: 20px 0;
  color: black;
}

.modal_button {
  background-color: #ac003e;
  width: 150px;
  height: 40px;
  color: white;
  font-size: 14px;
  border-radius: 16px;
  left: initial;
  margin-left: 10px;
}
button:hover {
  background-color: rgb(239, 156, 0);
}
</style>
