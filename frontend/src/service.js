import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$http = axios;

let basketActions = '/ajax/basketActions.php';

export default new Vue({
    data: {
        basket: []
    },
    created(){
        this.$http.post(basketActions,{
            TYPE: 'show'
        })
        .then(response => {
            this.basket = response.data;
            console.log(response);
        })
    },
    methods:{
        addToBasket(item){
            console.log(item.price);
            this.$http.post(basketActions,{
                TYPE: 'add',
                id: item.id,
                cnt: '1',
                name: item.name,
                price: item.price,
                art: item.art
            })
            .then(response => {
                console.log(response);
                this.$emit("addToBasket",response.data);
            })
        },
        // removeFromBasket(){
        //     this.$emit("removeFromBasket");
        // }
    }
});