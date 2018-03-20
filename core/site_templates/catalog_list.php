<?php
/*echo "<pre>";
print_r($arResult);
echo "</pre>";*/
?>
<?if (!empty($arResult["ITEMS"])) {

    foreach ($arResult["ITEMS"] as $oneProduct){
        $group[$oneProduct["group_name"]][] = $oneProduct;
    }
    ?>
    <?
    $max = intval($arResult["COUNT"]/$arResult["AMOUNT"] +1);
    $leftEdge = 2;
    $rightEdge = 2;
    $active_page = 0;
    while ($arResult["AMOUNT"]*$count < $arResult["COUNT"]){
        $count ++;
        if($arResult["START"]+$arResult["AMOUNT"] == $arResult["AMOUNT"]*$count){
            $active_page = $count;
            break;
        }
    }
    $curr = $active_page;
    ?>
    <div class="page-nav">


        <?if($max>5):?>
            Страницы:
            <?if($curr > 2):?>
                <div class="pagenavElements" <?=($curr==1?' active':'')?> data-start="<?=$arResult["AMOUNT"]*0?>">1</div>
            <?endif;?>

            <?if($curr-1 > $leftEdge && $curr ):?>

                <span class="pagination__page pagination__page_span">...</span>

            <?endif;?>

            <?if($curr==1):?>
                <div class="pagenavElements active" data-start="<?=$arResult["AMOUNT"]*($curr-1)?>">1</div>
                <div class="pagenavElements" data-start="<?=$arResult["AMOUNT"]*($curr)?>">2</div>
                <div class="pagenavElements " data-start="<?=$arResult["AMOUNT"]*($curr+1)?>">3</div>

            <?elseif($curr==$max):?>

                <div class="pagenavElements" data-start="<?=$arResult["AMOUNT"]*($curr-3)?>"><?=$curr-2?></div>
                <div class="pagenavElements" data-start="<?=$arResult["AMOUNT"]*($curr-2)?>"><?=$curr-1?></div>
                <div class="pagenavElements active" data-start="<?=$arResult["AMOUNT"]*($curr-1)?>"><?=$curr?></div>

            <?else:?>

                <div class="pagenavElements" data-start="<?=$arResult["AMOUNT"]*($curr-2)?>"><?=$curr-1?></div>
                <div class="pagenavElements active" data-start="<?=$arResult["AMOUNT"]*($curr-1)?>"><?=$curr?></div>
                <div class="pagenavElements" data-start="<?=$arResult["AMOUNT"]*($curr)?>"><?=$curr+1?></div>

            <?endif;?>

            <?if($max - $curr > $rightEdge):?>

                <span class="pagination__page">...</span>

            <?endif;?>

            <?if($max - $curr > 1):?>

                <div class="pagenavElements" data-start="<?=$arResult["AMOUNT"]*($max-1)?>"><?=$max?></div>

            <?endif;?>

        <?else:?>
            <?
            if($arResult["START"]+$arResult["AMOUNT"] < $arResult["COUNT"] || $arResult["COUNT"]>$arResult["AMOUNT"]){
                $count = 0;
                $first = true;
                while ($arResult["AMOUNT"]*$count < $arResult["COUNT"]){
                    $active = '';
                    $count ++;
                    if($arResult["START"]+$arResult["AMOUNT"] == $arResult["AMOUNT"]*$count)$active = 'active';
                    if($first){
                        echo 'Страницы: <div class="pagenavElements '.$active.'" data-start='.$arResult["AMOUNT"]*($count-1).'>'.$count.'</div>';
                        $first = false;
                    }else{
                        echo ' <div class="pagenavElements '.$active.'" data-start='.$arResult["AMOUNT"]*($count-1).'>'.$count.'</div>';
                    }

                }
            }
            ?>
        <?endif;?>
    </div>
    </div>

    <table class="table table-bordered tableCatalog allTable" id="">
        <thead>
        <tr>
            <th>Название<span class="btmSort glyphicon glyphicon-arrow-down <?=($arResult["SORT"]=='name')?'active':'';?>" data-sort="name" title="Сортировать по наименованию"></span></th>
            <th width="100">Бренд <span class="btmSort glyphicon glyphicon-arrow-down <?=($arResult["SORT"]=='brand')?'active':'';?>" data-sort="brand" title="Сортировать по бренду"></span></th>
            <th width="100">Цена <span class="btmSort glyphicon glyphicon-arrow-up <?=($arResult["SORT"]=='priceasc')?'active':'';?>" data-sort="priceasc" title="Сортировать по цене (возрастание)"></span><span class="btmSort glyphicon glyphicon-arrow-down <?=($arResult["SORT"]=='pricedesc')?'active':'';?>" data-sort="pricedesc" title="Сортировать по цене (убывание)"></span></th>
            <th width="80">Аналоги</th><div class="btmSort" data-target="price" data-sort="">
                <? if ($arResult["DEF_PRICE"] == 1): ?><th width="100">Розничная</th><? endif; ?>
                <th width="130">Заказ</th>
        </tr>
        </thead>
        <tbody>
        <? foreach ($group as $key=>$arGroup){ ?>
            <?php
            $check = $arResult['CHECKED'];
            ob_start();
            ?>
            <?if($arResult["GROUPS"]=="Y"):?>
                <tr>
                    <td colspan="4"><h4><?=$key?></h4></td>
                </tr>
            <?endif;?>
            <?foreach($arGroup as $pr_key=>$oneProduct):?>
                <tr data-id="<?= $oneProduct["id"] ?>" class="element" data-key="<?=$key?>">
                    <td>
                        <?if($oneProduct["img_path"]):?>
                            <img src="<?=$oneProduct["img_path"]?>" alt="" class="element__prev-img">
                        <?endif;?>

                        <a href="#detailCard" data-toggle="modal" class="detailCard" data-id="<?= $oneProduct["id"] ?>"><?= $oneProduct["name"] ?></a>
                        <br/><small class="art">Код: <?= $oneProduct["id"] ?></small>

                    </td>
                    <td class="text-right"><?=$oneProduct["brand"]?></td>
                    <td class="text-right"><?= number_format($oneProduct["price"], 2, '.', ''); ?></td>
                    <td class="text-center">
                        <button type="button" class="btn btn-default openAnalogModal" data-id="<?= $oneProduct['id'] ?>" data-toggle="modal" data-target="#analogModal"><span class="glyphicon glyphicon-transfer"></span></button>
                    </td>
                    <? if ($arResult["DEF_PRICE"] == 1): ?><td class="text-right"><?= number_format($oneProduct["priceDefault"], 2, '.', ''); ?></td><? endif; ?>
                    <td>
                        <div class="input-group">
                            <input type="number" data-id="<?= $oneProduct["id"] ?>" class="form-control cnt-basket" value="1" placeholder="1" min="1" max="<?= $quantity; ?>">
                            <span class="input-group-btn">
                                <button data-id="<?= $oneProduct["id"] ?>" data-name='<?= $oneProduct["name"] ?>' data-price="<?= $oneProduct["price"] ?>" data-art="<?= $oneProduct["art"] ?>" class="btn btn-default to-basket" type="button"><span class="glyphicon glyphicon-shopping-cart"></span></button>
                            </span>
                        </div>
                    </td>
                </tr>
            <? endforeach; ?>
            <?php
            $content = ob_get_clean();
            if ($check == "Y") {
                if ($oneProduct['quantity'] > 0) {
                    echo $content;
                }
            } else {
                echo $content;
            }
            ?>
        <?}?>
        </tbody>
    </table>
    <?
} else {
    if ($arResult["SEARCH"] == "Y")
        echo '<span>По Вашему запросу ничего не найдено</span>';
    else
        echo '<span>У выбранного раздела отсутствуют элементы</span>';
}?>
