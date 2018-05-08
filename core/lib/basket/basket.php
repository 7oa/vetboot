<?php

namespace Core\Main;

class Basket extends DataManager {

	protected $items = array(),
            $basketPrice = null,
            $itemsCount = null;

    function __construct() {
        $items = $this->getItems(User::getID());

        $USER_ID = User::getID();
        $connect = DataBase::getConnection();
        $isedit = $connect->query("SELECT * FROM `order_edit` WHERE `USER_ID` = '$USER_ID'")->fetchRaw();
        if(!empty($isedit)){
            $this->orderNum = $isedit["ORDER_NUM"];
			$this->orderDate = $isedit["ORDER_DATE"];
			$this->orderGuid = $isedit["ORDER_GUID"];
			$this->shipType = $isedit["SHIP_TYPE"];
			$this->shipAddr = $isedit["SHIP_ADDR"];
			$this->comment = $isedit["COMMEN"];
        }
        if ($items) {
            foreach ($items as $arItem)
                $this->items[$arItem['PRODUCT_ID']] = $arItem;

            foreach ($this->items as &$arItem):
                $product = static::getActualPriceNew($arItem['PRODUCT_ID']);
                $arItem['PRICE'] = $product['price'];
                $price += $arItem['PRICE'] * $arItem['QUANTITY'];
                $arItem['FULL_PRICE'] = $arItem['PRICE'] * $arItem['QUANTITY'];
            endforeach;

            $this->basketPrice = $price;
            $this->itemsCount = sizeof($this->items);

        } else
            return false;
    }

    public static function getTable() {
        return 'basket';
    }

    public static function getFieldMap() {
        return array(
            'ID' => array(
                'data_type' => 'integer',
                'primary' => true,
                'autocomplete' => true,
            ),
            'TIMESTAMP_X' => array(
                'data_type' => 'datetime',
                'required' => true,
            ),
            'USER_ID' => array(
                'data_type' => 'integer',
                'required' => true,
            ),
            'PRODUCT_ID' => array(
                'data_type' => 'string',
                'required' => true,
            ),
            'ART' => array(
                'data_type' => 'string',
                'required' => true,
            ),
            'NAME' => array(
                'data_type' => 'string',
                'required' => true,
            ),
            'PRICE' => array(
                'data_type' => 'float',
                'required' => true,
            ),
            'QUANTITY' => array(
                'data_type' => 'integer',
                'required' => true,
            )
        );
    }

    public static function getItems($ID) {
        $parameters['filter'] = array('USER_ID' => $ID);
        $res = static::getList($parameters);
        $dbResult = $res->fetchAll();

        return $dbResult;
    }

    public static function checkItem($ID) {
        $parameters['filter'] = array('USER_ID' => User::getID(), 'PRODUCT_ID' => $ID);
        $parameters['select'] = array('ID', 'QUANTITY');
        $res = static::getList($parameters);
        if ($res->rowsCount() > 0)
            return $res->fetchRaw();
        else
            return false;
    }

    protected static function getActualPrice($product) {
		$USER_ID = User::getID();
		$arUser = User::getByID($USER_ID);
		$price_id=$arUser["PRICE"];
        //$def_price=$arUser["SHOWDEFAULTPRICE"];
        $group_det="false";//$arUser["PRICEGROUPDETAL"];
        $agreement=$arUser["AGREEMENT"];
        $soap = new Soap;
        $findParams = array('req' => "code", 'value' => $product, 'price_id' => $price_id, 'priceGroupDetal' => $group_det, 'agreement_id' => $agreement);
        $find = $soap->call('FindProductsBy', $findParams);
        return $find;
    }

    protected static function getActualPriceNew($product) {
        $USER_ID = User::getID();
        $arUser = User::getByID($USER_ID);
        $price_id=$arUser["PRICE"];
        //$def_price=$arUser["SHOWDEFAULTPRICE"];
        $group_det="false";//$arUser["PRICEGROUPDETAL"];
        $agreement=$arUser["AGREEMENT"];
        $soap = new Soap;
        $findParams = array('id' => $product, 'price_id' => $price_id);
        $find = $soap->call('GetProductDetails', $findParams);
        return $find;
    }

    protected static function getActualPriceProduct($products) {
        $USER_ID = User::getID();
        $arUser = User::getByID($USER_ID);
        $price_id=$arUser["PRICE"];
        //$def_price=$arUser["SHOWDEFAULTPRICE"];
        $group_det="false";//$arUser["PRICEGROUPDETAL"];
        $agreement=$arUser["AGREEMENT"];
        //var_dump($products);
        $soap = new Soap;
        foreach ($products as $product) {
            $products_arr[] = trim($product);
        }

        $findParams = array('products' => array('Strings'=>$products_arr), 'agreement_id' => $agreement);
        $find = $soap->call('GetPrices', $findParams);
        $result = array();
        $temp_arr = array();
        $temp_arr['ProductPrices']['092146'] = array("id" => "092146", "price" => "0");
        $temp_arr['ProductPrices']['016201'] = array("id" => "016201", "price" => "100");
        if(!$find['ProductPrices'][0]){
            $result['ProductPrices'][0] = $find['ProductPrices'];
        }else{
            $result = $find;
        }
        foreach ($result['ProductPrices'] as $key => $item){
            $idd = trim($item['id']);
            $result['ProductPrices'][$idd] = $item;
            $result['ProductPrices'][$idd]['id'] = $idd;
            unset($result['ProductPrices'][$key]);
        }
        return $result;
    }

    public static function addItemByProduct($data) {
        $item = static::checkItem($data['PRODUCT_ID']);
        if ($item === false) {
            $id = static::add($data);
            $data['ID'] = $id;
            $returnData = $data;
        }
        else
            $returnData = static::update($item['ID'], $data, $item, true, true);

        return $returnData;
    }

    public static function update($primaty, $data, $item = array(), $needRecalc = false, $returnData = false) {
        if ($needRecalc)
            $data['QUANTITY']=$item['QUANTITY'];

        $price = static::getActualPriceNew($data['PRODUCT_ID']);
        $data['PRICE'] = $price['price'];
        $data['TIMESTAMP_X'] = strtotime(date("Y-m-d H:i:s"));
        parent::update($primaty, $data);

        if ($returnData)
            return $data;
    }
    public static function update_new($produkt_id) {

        $new_price = static::getActualPriceProduct($produkt_id);
        return $new_price;
    }

    public static function add($data) {
        return parent::add($data);
    }

    public static function delete($ID) {
        parent::delete($ID);
    }

    public function getItemsCount() {
        return $this->itemsCount;
    }

    public function getBasketItems() {
        return $this->items;
    }

    public function getOrderNum(){
        return $this->orderNum;
    }

	public function getOrderDate(){
		return $this->orderDate;
	}

	public function getOrderGuid(){
		return $this->orderGuid;
	}

    public function getPrice() {
        return $this->formatePrice($this->basketPrice);
    }

    public function formatePrice($price) {
        return number_format($price, 2, '.', ' ');
    }

}
