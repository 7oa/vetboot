<?
use Core\Main\User;
$arBacket = $arResult->getBasketItems();
$USER_ID = User::getID();
$userInfo = User::getByID($USER_ID);
$orderNum = $arResult->getOrderNum();
$orderDate = $arResult->getOrderDate();
$orderGUID = $arResult->getOrderGUID();
$shipType = $arResult->shipType;
$shipAddr = $arResult->shipAddr;
$comment1 = $arResult->comment;
$comment = explode("\n Желаемая дата выполнения заказа: ", $comment1);

$address=User::getInstance()->getResult('GetAddressesById', array('id' => $userInfo["EXTERNAL"]));
if ($address){
    if (!is_array($address["Strings"]))
        $arAddr[] = $address["Strings"];
    else
        $arAddr = $address["Strings"];
}
?>
<?//echo "<pre>"; print_r($arResult); echo "</pre>";?>
<?if($orderNum):?>
    <h1>Редактирование заказа <?=$orderNum?></h1>
<?else:?>
    <h1>Текущий заказ</h1>
<?endif;?>
<?
//$new_arBacket = array_values($arBacket);
//$start_add_basket = strtotime($new_arBacket[0]['TIMESTAMP_X']);
//$today = strtotime(date("Y-m-d H:i:s"));
//if($start_add_basket){
//    $past_time = $today - $start_add_basket;
//    $minutes = floor($past_time/60);
//    $hours = floor($minutes/60);
//    if($minutes>=0)$btn_up = true;
//}else{
//    $minutes = 0;
//    $btn_up = false;
//}


?>
<?//if (((date(G)<10)||(date(G)>=19))):?>
<!--    Обращаем Ваше внимание: не все цены на данный момент актуальны, проверяйте обновление прайса в 10.00 утра (время Мск).-->
<?//endif;?>
<div class="orderStatus"></div>
<div class="emptyBasket"></div>
<div id="minOrders" style="display: none;"><?=$minutes;?></div>
<div id="updOrders" style="display: none;"></div>

<div class="blackBack"></div>

<div class="backetDiv">
    <div class="basketTableAjax">
        <table class="table table-bordered tableBasket allTable">
            <thead>
            <tr>
                <th>Название</th>
                <th>Цена</th>
                <th width="100">Количество</th>
                <th>Сумма</th>
                <th width="70">Удалить</th>
            </tr>
            </thead>
            <tbody>
            <?
            if ($arResult->getItemsCount() > 0):
                foreach ($arBacket as $bItems):
                    ?>
                    <tr id="tr<?= $bItems["ID"] ?>" data-id="<?=trim($bItems["PRODUCT_ID"]) ?>">
                        <td>
							<a href="#detailCard" data-toggle="modal" class="detailCard" data-id="<?= $bItems["PRODUCT_ID"] ?>"><?= $bItems["NAME"] ?></a>
							<br/><small class="art"><?= $bItems["ART"] ?></small>
						</td>
                        <td class="text-right" name="price_old"><?= $arResult->formatePrice($bItems['PRICE']) ?></td>
                        <td class="text-right"><input type="number" data-trid="<?= $bItems["ID"] ?>" class="form-control cnt-basket-changer" value="<?= $bItems["QUANTITY"] ?>" placeholder="<?= $bItems["QUANTITY"] ?>" min="1" max=""></td>
                        <td class="b-sum text-right" id="price-<?= $bItems["ID"] ?>"><?= $arResult->formatePrice($bItems['FULL_PRICE']) ?></td>
                        <td class="text-center">
                            <button class="btn btn-xs btn-default delBacketItem" type="button" data-id="<?= $bItems["ID"] ?>"><span class="glyphicon glyphicon-remove"></span></button>
                        </td>
                    </tr>
                    <?
                endforeach;
            endif;
            ?>
            </tbody>
        </table>

        <div class="text-right">
            <div>Итого: <span class="basketItog" id="full-cart-price"><?= $arResult->getPrice() ?></span> руб.</div>
        </div>
    </div>

    <div class="row desDate text-right">
		<?
            $time = strtotime('+1 day');
            $desDate= date("d.m.Y", $time);
            if($comment[1]){
                $desDate = $comment[1];
            }
		?>
        <div class="col-sm-12">
            <h3>Желаемая дата выполнения заказа</h3>
        </div>
        <div class="col-sm-3 col-sm-offset-9">
            <div class="input-group selectDate" id="zDate">
                <input type="text" class="form-control order-desdate" value="<?=$desDate;?>">
                <span class="input-group-btn">
                    <button class="btn btn-default" type="button"><span class="glyphicon-calendar glyphicon"></span></button>
                </span>
            </div>
        </div>

    </div>

    <div class="row shipBlock text-right">
        <div class="col-sm-12">
            <h3>Выберите вариант доставки:</h3>
        </div>

        <div class="col-sm-12">
            <div class="radio deliveryRadio">
                <label>
                    <input type="radio" class="deliveryRadioOne" name="deliveryRadios" id="deliveryOptR1" value="0" data-id="0" <?if($shipType != 1):?>checked<?endif;?>>
                    Самовывоз
                </label>
                <label>
                    <input type="radio" class="deliveryRadioOne" name="deliveryRadios" id="deliveryOptR2" value="1" data-id="1"<?if($shipType == 1):?>checked<?endif;?>>
                    Нужна доставка
                </label>
<!--                <label>-->
<!--                    <input type="radio" class="deliveryRadioOne" name="deliveryRadios" id="deliveryOptR3" value="2" data-id="2">-->
<!--                    Силами перевозчика-->
<!--                </label>-->
            </div>
        </div>



        <div class="col-sm-12 shipmentAddressBlock" <?if($shipType != 1):?>style="display: none"<?endif;?>>
            <label for="shipAddress" class="text-left">Адрес доставки:</label><br/>

            <?if($arAddr):?>
            <select class="form-control input600" id="shipAddress">
                <?foreach($arAddr as $addr):?>
                <option><?=$addr?></option>
                <?endforeach;?>
            </select>
            <?else:?>
                <input type="text" name="shipAddress" id="shipAddress" class="input600 form-control" placeholder="Введите адрес доставки" <?if($shipAddr):?>value="<?=$shipAddr?>"<?endif;?>>
            <?endif;?>
        </div>

        <div class="col-sm-12 margin20 shipmentCompanyBlock">
            <label for="shipmentCompany" class="text-left">Транспортная компания:</label><br/>
            <input type="text" name="shipmentCompany" id="shipmentCompany" class="input600 form-control" placeholder="Впишите желаемую транспортную компанию для осуществления доставки">
        </div>
    </div>

    <div class="row commentBlock text-right">
        <div class="col-sm-12">
            <h3>Комментарий:</h3>
        </div>

        <div class="col-sm-12">
            <textarea name="commentOrder" id="commentOrder" class="input600 form-control" placeholder="Ваш комментарий"><?if($comment[0]) echo $comment[0]; ?></textarea>
        </div>
    </div>

    <div class="col-sm-12">
        <p style="float: right;" id="info_bask_p">Последнее обновление цен в заказе: </p>
    </div>
    <div class="text-right">
        <button type="button" class="btn btn-default saveSampleBlock" data-toggle="modal" data-target="#save_template">
            Сохранить заказ как шаблон
        </button>
        <button type="button" id="btn_bask" class="btn btn-success update_order"<?if($orderNum):?> data-edit="true"<?endif;?><?if($orderNum):?> data-onum="<?=$orderNum?>"<?endif;?><?if($orderDate):?> data-odate="<?=$orderDate?>"<?endif;?><?if($orderGUID):?>data-guid="<?=$orderGUID?>"<?endif;?>>
            <span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> Обновить цены в заказе
        </button>
        <button id = "add_zakaz" type="button" class="btn btn-primary checkout"<?if($orderNum):?> data-edit="true"<?endif;?><?if($orderNum):?> data-onum="<?=$orderNum?>"<?endif;?><?if($orderDate):?> data-odate="<?=$orderDate?>"<?endif;?><?if($orderGUID):?>data-guid="<?=$orderGUID?>"<?endif;?>>
            <span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> Оформить заказ
        </button>
    </div>

    <div class="modal fade" id="save_template" tabindex="-1" role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="userModalLabel">Добавить шаблон</h4>
                </div>
                <div class="modal-body">
                    <div id="sampleStatus" class="alert alert-warning sampleWarning"></div>
                    <input type="text" class="form-control sample-name" placeholder="Введите название шаблона" >
                    <div class="alert alert-success samplesSuccess"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default to-samples">Сохранить</button>
                    <button type="button" class="btn btn-default sampleClose" data-dismiss="modal">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="update_bask" tabindex="-1" role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="userModalLabel">Обновление цен</h4>
                </div>
                <div class="modal-body" id="info_bask">
                </div>
                <div class="modal-footer center-block">
                    <button type="button" id="btn_bask" class="btn btn-success update_order"<?if($orderNum):?> data-edit="true"<?endif;?><?if($orderNum):?> data-onum="<?=$orderNum?>"<?endif;?><?if($orderDate):?> data-odate="<?=$orderDate?>"<?endif;?><?if($orderGUID):?>data-guid="<?=$orderGUID?>"<?endif;?>>
                        <span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> Обновить цены в заказе
                    </button>
                </div>
            </div>
        </div>
    </div>


</div>