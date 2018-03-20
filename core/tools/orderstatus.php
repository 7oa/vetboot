<?php
require $_SERVER['DOCUMENT_ROOT'] . '/core/lib/order/tools/orderstatus.php';

//include $_SERVER['DOCUMENT_ROOT'] . '/core/loader/prolog_before.php';
//sendSMS();
//die();
//function sendSMS(){
//
//    $order_id = $_GET["order_id"];
//    $value = $_GET["value"];
//    $phone = $_GET["phone"];
//
//    $SMSText = "Тест: ";
//    $SMSText .= $order_id . " изменил статус:";
//    $SMSText .= $value;
//
//    try{
//        $request_params = array(
//            'login' => "ooovtk",
//            'psw' => "Gfhec2007",
//            'phones' => $phone,
//            'mes' => $SMSText,
//            'charset' => 'utf-8'
//            //'cost' => "1",
//        );
//        $get_params = http_build_query($request_params);
//        $result = file_get_contents('https://smsc.ru/sys/send.php?'. $get_params);
//        echo 'успешно';
//        echo "<pre>";
//        print_r($result);
//        echo "</pre>";
//    }catch (Exception $e){
//        echo 'ошибка';
//    }
//}
