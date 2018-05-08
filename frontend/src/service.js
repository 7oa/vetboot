import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$http = axios;

const basketActions = '/ajax/basketActions.php';

export default new Vue({
    data: {
        basket: [],
        showLoading: false
    },
    methods:{
        loading(params){
            this.showLoading = params;
        },
        setBasket(basket){
            this.basket = basket;
            console.log(this.basket);
        },
        addToBasket(item){
            console.log(item.inbasket);
            this.$http.post(basketActions,{
                TYPE: 'add',
                id: item.id,
                cnt: item.inbasket,
                name: item.name,
                price: item.price,
                art: item.art
            })
            .then(response => {
                this.$emit("addToBasket",response.data);
                console.log(response);
            })
        }
    }
});