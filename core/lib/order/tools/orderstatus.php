<?php
include $_SERVER['DOCUMENT_ROOT'] . '/core/loader/prolog_before.php';
use Core\Main\User;
$USER_ID = filter_input(INPUT_POST, 'user_id', FILTER_VALIDATE_INT);
$USER_ID_GET = filter_input(INPUT_GET, 'user_id', FILTER_VALIDATE_INT);
if($USER_ID){
    $userInfo = User::getByExID($USER_ID);
}else{
    $userInfo = User::getByExID($USER_ID_GET);
}

$notice = $userInfo['NOTICE_TYPE'];

if ($notice == "1") sendEmail();
if ($notice == "2") sendSMS();
if ($notice == "3") {
    sendEmail();
    sendSMS();
};
sendMy($notice, $USER_ID, $USER_ID_GET);
function sendMy($not, $id_u,$id_g){
    $order_id = filter_input(INPUT_POST, 'order_id');
    $value = filter_input(INPUT_POST, 'value');
    $phone = filter_input(INPUT_POST, 'phone');
    $phone_get = filter_input(INPUT_GET, 'phone');

    $mailText = "Заказ № ";
    $mailText .= $order_id . " изменил статус:";
    $mailText .= $value."-".$phone."- статус:".$not."-user-".$id_u."-user-".$id_g."phone_get=".$phone_get;
    $subject = "Тест";
    $headers = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "From: ВТК. СИСОПТ <support@opt.vetkom.ru>\r\n";
    $to = "avtor-ht@yandex.ru";

    mail($to, $subject, $mailText, $headers);
}

function sendEmail(){
    $email = filter_input(INPUT_POST, 'email');
    $order_id = filter_input(INPUT_POST, 'order_id');
    $event = filter_input(INPUT_POST, 'event');
    $param = filter_input(INPUT_POST, 'param');
    $value = filter_input(INPUT_POST, 'value');
    if ($param === 'status' && $event === 'order_change') {
        $mailText = "Заказ № ";
        $mailText .= $order_id . " изменил статус:";
        $mailText .= $value;
        $subject = "Изменен статус заказа";
        $headers = "Content-type: text/html; charset=utf-8 \r\n";
        $headers .= "From: ВТК. СИСОПТ <support@opt.vetkom.ru>\r\n";
        $to = $email;
//if ($result) {
        mail($to, $subject, $mailText, $headers);
    }
}
function sendSMS(){

    $order_id = filter_input(INPUT_POST, 'order_id');
    $value = filter_input(INPUT_POST, 'value');
    $phone = filter_input(INPUT_POST, 'phone');

    $SMSText = "Заказ № ";
    $SMSText .= $order_id . " изменил статус:";
    $SMSText .= $value;

    try{
        $request_params = array(
            'login' => "ooovtk",
            'psw' => "Gfhec2007",
            'phones' => $phone,
            'mes' => $SMSText,
            'charset' => 'utf-8',
            'sender' => 'OPT.VETKOM.RU',
        );
        $get_params = http_build_query($request_params);
        $result = file_get_contents('https://smsc.ru/sys/send.php?'. $get_params);
        return $result;
    }catch (Exception $e){
        return false;
    }


}