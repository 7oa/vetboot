<?php
/*echo "<pre>";
print_r($arResult);
echo "</pre>";*/
if(!empty($arResult["BRENDS"])):?>
    <div class="brends-list">
        <?if($arResult["ALL_BRENDS"] != "0"):?>
            <div class="brends-list__item opnElements" data-brand='' <?if($arResult["GROUP_ID"]):?>data-id='<?=$arResult["GROUP_ID"]?>'<?endif;?>><b>Все бренды</b></div>
        <?endif;?>
		<?if(is_array($arResult["BRENDS"])):
			foreach($arResult["BRENDS"] as $key=>$brends):?>
				<?if($brends):?>
                    <div class="brends-list__item opnElements" data-brand='<?=$brends?>' <?if($arResult["GROUP_ID"]):?>data-id='<?=$arResult["GROUP_ID"]?>'<?endif;?>><?=$brends?></div>
				<?endif;?>
			<?endforeach;?>
		<?else:?>
            <div class="brends-list__item opnElements" data-brand='<?=$arResult["BRENDS"]?>' <?if($arResult["GROUP_ID"]):?>data-id='<?=$arResult["GROUP_ID"]?>'<?endif;?>><?=$arResult["BRENDS"]?></div>
		<?endif;?>
    </div>
<?endif?>
    <div class="items-list">
    </div>
<script>
    // режем список
    (function(){
        var columns_num = 5;
        var items = $('.brends-list .brends-list__item');
        var per_column = Math.round(items.length / columns_num);
        if(per_column < items.length / columns_num){
            per_column++;
        }
        if(items.length < columns_num) {
            items.wrapAll('<div class="brends-list__column-wrapper"></div>');
            return;
        }
        var start = 0;
        var sub_items;
        for (var i = 0; i < columns_num ; i++){
            start = i*per_column;
            if(i=== columns_num-1){
                sub_items = items.slice(start,items.length);
            }else{
                sub_items = items.slice(start,start + per_column);
            }
            sub_items.wrapAll('<div class="brends-list__column-wrapper"></div>');
        }
    })();
</script>