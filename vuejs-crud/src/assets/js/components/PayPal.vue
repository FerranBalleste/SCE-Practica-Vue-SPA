<template>
    <div>
        <div id="paypal-button"></div>
        <div v-if="success" class="alert alert-success">
            <strong>Success!</strong> Your payment was successful
        </div>
        <div v-else-if="error" class="alert alert-danger">
            <strong>Ooops!</strong>  Something went wrong with your payment!
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'paypal',
    props:['amount'],
    data (){
        return {
            error:false ,
            success:false
            }
    },
    methods:{
        sendDataPaypal (creds) {
            return new Promise((resolve, reject) => {
                axios.post('http://localhost:3000/checkout', creds).then(res => {
                    return resolve()
                    
                }).catch((err) => {
                    return reject(err)
                })
            })
        }
    },
    mounted(){
            let  client = {
                    sandbox: 'AR-lNrChOfCCPAF4RCwnrZhkpg3bB5F5jrUhMwMfY2XsBnJ_UnoAMO7us71rLF9PmFHjRX455iB4hnxx',
            }
            let  payment = (data, actions) => {
                // Make a call to the REST api to create the payment
                return actions.payment.create({
                    payment: {
                        transactions: [
                            {
                                amount: { total:this.amount, currency: 'USD' }
                            }
                        ]
                    }
                });
            }
            let  onAuthorize = (data) => {
                var data = {
                    paymentID: data.paymentID,
                    payerID: data.payerID,
                    amount:this.amount
                };
                this.sendDataPaypal({data:data}).then(() => {
                    this.success=true
                }).catch(err=>{
                    this.error=true
                });
            }
            paypal.Button.render({
                env: 'sandbox', // sandbox | production
                commit: true,
                client,
                payment,
                onAuthorize
            }, '#paypal-button');
    }
}
</script>