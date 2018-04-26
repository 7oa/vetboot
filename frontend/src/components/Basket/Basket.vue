<template>
    <div class="page basket">
        <h1>Корзина</h1>
        <div>
            <table class="table table-bordered allTable">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Цена</th>
                        <th>Количество</th>
                        <th>Сумма</th>
                        <th>Удалить</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="basketItem in basket">
                        <td>{{basketItem.NAME}}</td>
                        <td>{{basketItem.PRICE}}</td>
                        <td>
                            <b-form-input
                                    type="number"
                                    step="1" min="0"
                                    class="basket-input"
                                    :value="basketItem.QUANTITY"
                            >
                            </b-form-input>
                        </td>
                        <td>{{basketItem.FULL_PRICE}}</td>
                        <td>
                            <b-button size="sm" @click="removeFromBasket(basketItem.ID)">
                                <i class="material-icons">delete</i>
                            </b-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import Service from '../../service.js'
    export default {
        data () {
            return {
                basket: []
            }
        },
        components:{

        },
        created(){
            Service.$watch("basket",()=>{
                this.basket = Service.basket;
            });

            Service.$on("addToBasket",(basket)=>{
               this.basket = basket;
            });
        },
        methods: {
            removeFromBasket(itemID){
                Service.removeFromBasket(itemID);
            }
        }
    }
</script>

<style scoped>
</style>