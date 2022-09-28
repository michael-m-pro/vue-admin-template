# API Instructions

## 1. Request Instructions

* Base url: https://test.iooopay.com
* Request Method: POST
* Content-Type: application/json

## 2. Request body encryption signature method

* 2.1 Exclude all keys with empty values ​​in the request body,Then sort the remaining keys in ascending 'ASCII' code to get an ordered set,Process all key-value pairs in the collection into strings.

* 2.2 Add your api key to the end of the string obtained in the first step to get the string to be signed

* 2.3 Use the sha256 encryption algorithm to encrypt the string obtained in the second step

**Example**:

```
Request Body:
{
    "merchantAccount":"hcdev@hc.com",
    "version": "V1.0",
    "merchantName": "hc",
    "merchantOrderNo": "8037341-10046-0012",
    "receiveAmount": "102",
    "receiveCurrency": "USD",
    "paymentAmount": "",
    "paymentCurrency": "BRL",
    "paymentCountry": "BR",
    "payerAccount ": "",
    "channelCode": "10046",
    "category":"BANK",
    "notifyUrl": "http://localhost/paymentApi/channel/send.do",
    "memo": "",
    "payerInfo":{
        "lastName":"MAGALI",
        "firstName":"DOLORES ORTIZ", 
        "purposeOfRemittance":"2",
        "countryCode":"AR",
        "userType":"COMPANY",
        "idType":"3", 
        "idNumber":"27397893788", 
        "email":"27397893788@qq.com",
        "areaCode": "86", 
        "phone": "123454332",
        "accountType": "C",
        "accountNo": "0070145330004020870169",
        "locationId": "007", 
        "bankName": "BANCO DE GALICIA Y BUENOS AIRES S.A.U.", 
        "bankBranchName":"ssd"
    },
    "extendedInfo": {
        "test": "test"
    },
    "signature": ""
}
```

String to be encrypted

First step:

category=BANK&channelCode=10046&extendedInfo={test=test}&merchantAccount=hcdev@hc.com&merchantName=hc&merchantOrderNo=8037341-10046-0012&notifyUrl=http://localhost/paymentApi/channel/send.do&payerInfo={accountNo=0070145330004020870169&accountType=C&areaCode=86&bankBranchName=ssd&bankName=BANCO DE GALICIA Y BUENOS AIRES S.A.U.&countryCode=AR&email=27397893788@qq.com&firstName=DOLORES ORTIZ&idNumber=27397893788&idType=3&lastName=MAGALI&locationId=007&phone=123454332&purposeOfRemittance=2&userType=COMPANY}&paymentCountry=BR&paymentCurrency=BRL&receiveAmount=102&receiveCurrency=USD&version=V1.0


Second step:

category=BANK&channelCode=10046&extendedInfo={test=test}&merchantAccount=hcdev@hc.com&merchantName=hc&merchantOrderNo=8037341-10046-0012&notifyUrl=http://localhost/paymentApi/channel/send.do&payerInfo={accountNo=0070145330004020870169&accountType=C&areaCode=86&bankBranchName=ssd&bankName=BANCO DE GALICIA Y BUENOS AIRES S.A.U.&countryCode=AR&email=27397893788@qq.com&firstName=DOLORES ORTIZ&idNumber=27397893788&idType=3&lastName=MAGALI&locationId=007&phone=123454332&purposeOfRemittance=2&userType=COMPANY}&paymentCountry=BR&paymentCurrency=BRL&receiveAmount=102&receiveCurrency=USD&version=V1.0&key=67589b195f71674fb57b3733bac08fbe


Third step：
```
b93549f93e34a9cfa77193b5c3572a5e2278284925c98f1a93197e4ccb2a41c7
```

Final request body：
```
{
    "merchantAccount":"hcdev@hc.com",
    "version": "V1.0",
    "merchantName": "hc",
    "merchantOrderNo": "8037341-10046-0012",
    "receiveAmount": "102",
    "receiveCurrency": "USD",
    "paymentAmount": "",
    "paymentCurrency": "BRL",
    "paymentCountry": "BR",
    "payerAccount ": "",
    "channelCode": "10046",
    "category":"BANK",
    "notifyUrl": "http://localhost/paymentApi/channel/send.do",
    "memo": "",
    "payerInfo":{
        "lastName":"MAGALI",
        "firstName":"DOLORES ORTIZ", 
        "purposeOfRemittance":"2",
        "countryCode":"AR",
        "userType":"COMPANY",
        "idType":"3", 
        "idNumber":"27397893788", 
        "email":"27397893788@qq.com",
        "areaCode": "86", 
        "phone": "123454332",
        "accountType": "C",
        "accountNo": "0070145330004020870169",
        "locationId": "007", 
        "bankName": "BANCO DE GALICIA Y BUENOS AIRES S.A.U.", 
        "bankBranchName":"ssd"
    },
    "extendedInfo": {
        "test": "test"
    },
    "signature": "b93549f93e34a9cfa77193b5c3572a5e2278284925c98f1a93197e4ccb2a41c7"
}
```
## 3. Notification Introduction

When the order is completed, the order details will be pushed to the notify url you specified. The signature method is the same as the signature method of the request body