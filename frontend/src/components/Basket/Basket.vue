<template>
    <div>
        <h1>Корзина</h1>
        <div v-if="basket.length!==0">

            <div v-for="basketItem in basket">
                {{basketItem.NAME}} {{basketItem.PRICE}}
            </div>
        </div>
        <div v-else>Корзина пуста.</div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                basket: []
            }
        },
        components:{

        },
        created(){
            this.$http({
                method: 'post',
                url: '/ajax/basketActions.php',
                data: {
                    TYPE: 'show'
                }
            })
                .then(response => {
                    this.basket = response.data;
                    console.log(response);
                })
        }
    }
</script>

<style scoped>
</style>