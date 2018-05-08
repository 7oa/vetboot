<?php

include $_SERVER['DOCUMENT_ROOT'] . '/core/loader/prolog_before.php';

use Core\Main\User,
  Core\Main\DataBase,
  Core\Main\Catalog,
  Core\Main\Basket,
  Core\Main\Template;

//$data             = $_POST;
$data = json_decode(trim(file_get_contents('php://input')), true);
$USER_ID          = User::getID();
$arUser           = User::getByID($USER_ID);
$price_id         = $arUser["PRICE"];
$def_price        = $arUser["SHOWDEFAULTPRICE"];
$group_det        = "false"; //$arUser["PRICEGROUPDETAL"];
$agreement        = $arUser["AGREEMENT"];
$USER_EXTERNAL_ID = $arUser["EXTERNAL"];
$type             = $data['TYPE'];
$catalog          = Catalog::getInstance();
$basket           = Basket::getInstance(false);
$byID             = ['id' => $data["id"], 'price_id' => $price_id];

switch ($data['TYPE']) {
  case 'list_sort':
    $params = [
        'price_id' => $price_id,
        'priceGroupDetal' => $group_det,
        'agreement_id' => $agreement,
        'Brand' => $data["brand"],
        'Sort' => $data["sort"],
        'Start' => $data["start"],
        'Amount' => $data["amount"],
    ];
    $arrRes = $catalog->getResult('GetProductList', $params, TRUE, TRUE);
    if ((array_key_exists('Products', $arrRes))&&(count($arrRes['Products'])>0)) {
      $products["ITEMS"] = $arrRes['Products'];
    }
    if (array_key_exists('Amount', $arrRes)) {
      $products["COUNT"]  = $arrRes['Amount'];
      $products["BRAND"]  = $data['brand'];
      $products["SORT"]   = $data['sort'];
      $products["START"]  = $data['start'];
      $products["AMOUNT"] = $data['amount'];
    }
    $products['ID']        = $data["id"];
    $products['DEF_PRICE'] = $def_price;
    $products['CHECKED']   = $data['checked'];
    $arBasket = $basket->getBasketItems();
    if($products["COUNT"]>0){
        if($products["ITEMS"]){
            foreach ($products["ITEMS"] as $key => &$oneProduct) {
                $oneProduct = (array) $oneProduct;
                //картинки
                if($oneProduct["img_mini"]){
                    $img_id = $oneProduct["id"];
                    $img = $oneProduct["img_mini"];
                    $ext = $oneProduct["img_mini_ext"];
                    $oneProduct["img_path"] = $catalog->checkPrevImage($img_id, $img, 'jpg');
                    unset($oneProduct['img_mini']);
                }
                $oneProduct['inbasket'] = 0;
                foreach ($arBasket as $k => $basketItem) {
                    if($oneProduct['id'] == $k) $oneProduct['inbasket'] = $basketItem['QUANTITY'];
                }
            }
        }
    }
    else $products["ITEMS"]=false;

    if (!$data['id']) {
      $products["GROUPS"] = "Y";
    }

    echo json_encode($products);
    //Template::includeTemplate('catalog_list', $products);
    break;
  case 'list':
    $params                = [
      'id'              => $data["id"],
      'price_id'        => $price_id,
      'priceGroupDetal' => $group_det,
      'agreement_id'    => $agreement,
      'Brand'           => $data["brand"],
    ];
    $products["ITEMS"]     = $catalog->getResult('GetProductList', $params, TRUE);
    $products['ID']        = $data["id"];
    $products['DEF_PRICE'] = $def_price;
    $products['CHECKED']   = $data['checked'];
    //проверка, добавлен ли товар в избранное
    $connect = DataBase::getConnection();
    foreach ($products["ITEMS"] as $key => &$oneProduct) {
      $oneProduct = (array) $oneProduct;


      $pId            = $oneProduct['id'];
      $check_favorits = $connect->query("SELECT * FROM `favorits` WHERE `USER_ID` = '$USER_ID' AND `PRODUCT_ID` = '$pId'")
        ->fetchRaw();
      if ($check_favorits == FALSE) {
        $oneProduct['favorits'] = 0;
      }
      else {
        $oneProduct['favorits'] = $check_favorits['TYPE'];
      }

      //картинки
      if ($oneProduct["img_mini"]) {
        $img_id                 = $oneProduct["id"];
        $img                    = $oneProduct["img_mini"];
        $ext                    = $oneProduct["img_mini_ext"];
        $oneProduct["img_path"] = $catalog->checkPrevImage($img_id, $img, 'jpg');
      }

    }
    if (!$data['id']) {
      $products["GROUPS"] = "Y";
    }
    Template::includeTemplate('catalog_list', $products);
    break;
  case 'allBrends':
    $brends = $catalog->getResult('GetBrands', ["TypeID"      => $data['id'],
                                                "FirstLetter" => $data['letter'],
    ]);
    if ($data["allbrend"] == 'no') {
      $products["ALL_BRENDS"] = "0";
    }
    $products["BRENDS"] = $brends["Strings"];
    if ($data["letter"] || $data["id"]) {
      /*if ($data["id"]) {
        $products["GROUP_ID"] = $data["id"];
      }*/
      if(is_array($products["BRENDS"])) echo json_encode($products["BRENDS"]);
      else echo json_encode($products);
    // Template::includeTemplate('brands_let_list', $products);
    }
    else {
        foreach ($products["BRENDS"] as $mas){
            $alph[] = mb_substr( strtoupper($mas), 0, 1, 'utf-8' );
        }
        $brands_alph = array_unique($alph);
        sort($brands_alph);
        $brendsAlph["RU"] = preg_grep("/[А-Я]/u", $brands_alph);
        $brendsAlph["EN"] = preg_grep("/[^А-Я]/u", $brands_alph);

        echo json_encode($brendsAlph);
      // Template::includeTemplate('brands_list', $products);
    }
    break;
  case 'analogs':
    $analogs = $catalog->getResult('GetSimilarProducts', ['id'              => $data['id'],
                                                          'price_id'        => $price_id,
                                                          'priceGroupDetal' => $group_det,
                                                          'agreement_id'    => $agreement,
    ]);
    if ($analogs == FALSE) {
      echo "У выбранного товара нет аналогов";
    }
    else {
      Template::includeTemplate('catalog_analogs', $analogs);
    }
    break;
  case 'section':
      $params = array('id' => $data["id"], 'Input' => '', 'brand'=>'');
      $sections = $catalog->getResult('GetGroupList', $params);
      echo json_encode($sections);
      break;
  case 'detail':
    $id         = $data["id"];
    $findParams = ['req'             => "code",
                   'value'           => $id,
                   'price_id'        => $price_id,
                   'priceGroupDetal' => $group_det,
                   'agreement_id'    => $agreement,
    ];
    $soapCart   = $catalog->getResult('GetProductDetails', $byID, TRUE);
    //$find = $catalog->getResult('FindProductsBy', $findParams);
    $detailCard = $soapCart[0];
    //$detailCard['price'] = $find['Products']["price"];
    if (!empty($detailCard['img'])) {
      $detailCard['img'] = $catalog->checkDetailImage($detailCard);
    }
    $skocks = $catalog->getResult('GetStocksByProduct', ['id' => $id]);
    if ($skocks) {
      $detailCard["STOCK"] = $skocks["Stocks"];
    }
    echo json_encode($detailCard);
//    Template::includeTemplate('catalog_item_detail', $detailCard);
    break;
  case 'search':
    $search            = [
      'req'             => $data["req"],
      'value'           => $data["value"],
      'price_id'        => $price_id,
      'priceGroupDetal' => $group_det,
      'agreement_id'    => $agreement,
    ];
    $products["ITEMS"] = $catalog->getResult('FindProductsBy', $search, TRUE);
    foreach ($products["ITEMS"] as $key => &$oneProduct) {
      $oneProduct = (array) $oneProduct;
      //картинки
      if ($oneProduct["img_mini"]) {
        $img_id                 = $oneProduct["id"];
        $img                    = $oneProduct["img_mini"];
        $ext                    = $oneProduct["img_mini_ext"];
        $oneProduct["img_path"] = $catalog->checkPrevImage($img_id, $img, 'jpg');
      }

    }
    $products["DEF_PRICE"] = $def_price;
    $products["SEARCH"]    = "Y";
    $products['CHECKED']   = $data['checked'];
    $products['AMOUNT']    = count($products);
    Template::includeTemplate('catalog_list', $products);
    break;
  case 'searchBrend':
    $search = Catalog::getInstance()->getResult('GetGroupList', ['id'    => '',
                                                                 'Input' => $data["value"],
    ]);
    echo json_encode($search);
    //Template::includeTemplate('group_res', $search);
    break;
  case 'quant':
    $id     = $data["id"];
    $skocks = $catalog->getResult('GetStocksByProduct', ['id' => $id]);
    if ($skocks) {
      $detailCard["STOCK"] = $skocks["Stocks"];
    }
    Template::includeTemplate('quantity_detail', $skocks);
    break;
  case 'price':
    $params = ['user_id' => $USER_EXTERNAL_ID];
    $print  = $catalog->getResult('PrintPrice', $params, TRUE);
    $url    = $catalog->checkXLS($print, 'price_' . $USER_EXTERNAL_ID);
    echo $url;
    break;
}
