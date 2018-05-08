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
                    <tr v-for="(basketItem, index) in basket">
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
                            <b-button size="xs" @click="removeFromBasket(basketItem.ID,index)">
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

    const basketActions = '/ajax/basketActions.php';

    export default {
        data () {
            return {
                basket: []
            }
        },
        created(){
            Service.loading(true);
            this.$http.post(basketActions,{
                TYPE: 'show'
            })
            .then(response => {
                this.basket = response.data;
                Service.setBasket(response.data);
                Service.loading(false);
            });

            Service.$on("addToBasket",(basket)=>{
                this.basket = basket;
            });
        },
        watch:{

        },
        methods: {
            removeFromBasket(itemID,index){
                Service.loading(true);
                this.$http.post(basketActions,{
                    TYPE: 'delete',
                    id: itemID
                })
                .then(response => {
                    this.$delete(this.basket, index);
                    Service.setBasket(this.basket);
                    Service.loading(false);
                })
            }
        }
    }
</script>

<style scoped>
</style>