<template>
  <div id="all-products">
    <h1>Products from {{ city }}</h1>

    <div class="form-group">
      <input type="text" name="search" v-model="productSearch" placeholder="Search products" class="form-control"
        v-on:keyup="searchProducts" />
    </div>

    <div id="all_products" class="container">
      <div class="mainContainer mt-3 row">
        <div id="product_container" class="childContainer" v-for="product in products"
          style="padding: 20px; width: 300px; margin: 10px">
          <img  class="img-responsive" :src="image + product.name + '.jpg'" alt="" style="
              width: 250px;
              height: 250px;
              max-height: 100%;
              max-width: 100%;
            " />
          <h2 style="color: black; margin: 5px">{{ product.name }}</h2>
          <h4 style="color: black; margin: 5px">${{ product.price }}</h4>
          <p class="text-center">
            <input style="height: 50px; font-size: 30px;" v-model="product.qty" type="number" class="form-control" placeholder="Quantity" min="1" />
          </p>
          <button @click="showDetailsModal = true; clickedProduct = product;" class="btn btn-primary btn-warning"
            style="margin-top: 10px; float: left">
            Info
          </button>
          <transition name ="buttontransition">
          <button v-if="product.qty > 0"
            @click="addToCart(product, product.qty);"
            class="btn btn-primary btn-success" style="margin-top: 10px; float: right">
            Add to Cart
          </button>
          </transition>
        </div>
      </div>
    </div>
    <!-- SHOPPING CART BUTTON -->
    <transition name ="buttontransition">
    <button id="shop_cart_button" class="h1 btn-lg p-0" v-if="totalItems > 0" @click="showCartModal = true">
      Shopping Cart!<br />Products: {{ totalItems }}
    </button>
    </transition>
    <!-- SHOPPING MODAL -->
    <transition name="fade">
    <ShoppingCart :items="cartItems" v-show="showCartModal" @close-modal="showCartModal = false" />
    </transition>
    <!-- PRODUCT DETAILS MODAL -->
    <transition name="fade">
    <ProductDetails :product="clickedProduct" v-show="showDetailsModal" @close-modal="showDetailsModal = false" />
    </transition>
  </div>
</template>

<script>
import ProductDetails from "./product-details.vue";
import ShoppingCart from "./shopping-cart.vue";
import Vue from "vue";
var totalProducts = 0;

export default {
  totalProducts,
  props: ["city"],

  components: { ProductDetails, ShoppingCart },

  data() {
    return {
      products: [], //Shown products
      originalProducts: [], //Auxiliar shown product list
      productSearch: "", //Current product search
      clickedProduct: {}, //Clicked product to show details
      showDetailsModal: false, //Show Product Detail Modal
      showCartModal: false, //Show Product Detail Modal
      image: "http://localhost:8080/src/assets/img/",
      totalProducts, //Total cart products
      cartItems: [], //Cart Items
    };
  },

  created: function () {
    this.fetchProductData();
  },

  watch: {
    city: function () {
      this.fetchProductData();
    },
  },

  computed: {
    totalItems() {
      return this.cartItems.reduce((accumulator, item) => {
        return parseInt(Number(accumulator)) + parseInt(Number(item.qty));
      }, 0);
    },
  },

  methods: {
    fetchProductData: function () {
      this.$http.get("http://localhost:3000/api/search/" + this.city).then(
        (response) => {
          this.products = response.body;
          this.originalProducts = this.products;
        },
        (response) => { }
      );
    },

    searchProducts: function () {
      if (this.productSearch == "") {
        this.products = this.originalProducts;
        return;
      }

      var searchedProducts = [];
      for (var i = 0; i < this.originalProducts.length; i++) {
        var productName = this.originalProducts[i]["name"].toLowerCase();
        if (productName.indexOf(this.productSearch.toLowerCase()) >= 0) {
          searchedProducts.push(this.originalProducts[i]);
        }
      }

      this.products = searchedProducts;
    },

    //Add product to shooping cart
    addToCart(itemToAdd, quantity) {
      let found = false;

      // Add the item or increase qty
      let itemInCart = this.cartItems.filter(
        (item) => item.id === itemToAdd.id
      );
      let isItemInCart = itemInCart.length > 0;

      if (isItemInCart === false) {
        this.cartItems.push(Vue.util.extend({}, itemToAdd));
      } else {
        itemInCart[0].qty = parseInt(Number(itemToAdd.qty) + parseInt(Number(itemInCart[0].qty)));
      }

      itemToAdd.qty = parseInt(Number(quantity));
    },
  },
};
</script>