<template>
    <!-- Modal -->
    <div class="modal-overlay">
        <div class="modal" style="border-radius: 30px;">
                <table class="table table-cart">
                    <tr v-for="(item, index) in items">
                        <td>{{ item.name }}</td>
                        <td style="width:120px">QTY:
                            <input v-model="item.qty" class="form-control input-qty" type="number" min="1">
                        </td>
                        <td class="text-right">${{ item.price }}</td>
                        <td>
                            <button class="modal_button" @click="removeItem(index)"><span class="glyphicon glyphicon-trash"></span></button>
                        </td>
                    </tr>
                    <tr v-show="items.length === 0">
                        <td colspan="4" class="text-center">Cart is empty</td>
                    </tr>
                </table>
            <div v-show="items.length > 0">
                <b>Cart Total:</b> ${{ Total }}
            </div>
            <paypal :amount="Total"></paypal>
            <button class="modal_button close" @click="$emit('close-modal')">Close</button>
        </div>
    </div>
</template>

<script>
import Paypal from "./PayPal.vue";

export default {
    props: ["items"],
    components: { paypal: Paypal },

    computed: {
        Total() {
            let total = 0;
            this.items.forEach((item) => {
                total += item.price * item.qty;
            });
            return total.toFixed(2);
        },
    },

    methods: {
        // Remove item by its index
        removeItem(index) {
            this.items.splice(index, 1);
        },
    },
};
</script>

<style scoped>
p {
    font-size: 16px;
    margin: 20px 0;
    color: black;
}
button {
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
td {
    color:black;
}
</style>
