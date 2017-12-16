# ABL OrderForm submit system
It can  add update and detele Orderform



1,
/login
{"username": "abc1","password": "1234"}
登录

2,
/user/updatepassword
{"newpassword": "1234"}
修改登录用户密码

3，
/user/addagent
添加用户，用户名和小站名字不可以和之前重复
{"username": "test1",
 "password": "123",
 "stationname": "S11",
 "receiverate":0.6,
 "publishrate":0.7
}

2,
/user/mystations 
get the register stations by me.
 do not work for agent privilege.

3,
/user/:country
get the register stations by me.
 do not work for agent and admin privilege.

6,
add a new orderform
/orderform/addorderform
{
   "adName":"Hello",
   "adType":"AD",
   "adStatus":"Pending",
   "adBeginDate":"2017-10-19",
   "adEndDate":"2017-10-29",
   "publishType":"Monthy",
   "orderTotalAmont":3000,
   "customerName":"王致和",
   "paymentMethod":"Alipay",
   "receivePosition":{
      "stationname":"S1",
      "currency":"Dol"
   },
   "publishPositions":[
      {
         "stationname":"S1",
         "amount":300,
         "currency":"Dol"
      },
      {
         "stationname":"S2",
         "amount":200,
         "currency":"Dol"
      }
   ],
   "customerWechat":"ADC",
   "customerPhone":"415-478-1234",
   "remark":null,
   "adContinue":false
}

4，
update orderform information
if rebuilt is true: checkorder will be overriten, the payment history will be earased. According to the rules, if 
publishPositions, receivePosition and totalAmount has changes , rebuilt need to be true. 
If the changes doesn't include these fields, rebuilt should be false.
/orderform/updateorderform
{
   "rebuilt":true,
   "adName":"Hello",
   "adType":"AD",
   "adStatus":"Pending",
   "adBeginDate":"2017-10-19",
   "adEndDate":"2017-10-29",
   "publishType":"Monthy",
   "orderTotalAmont":3000,
   "customerName":"王致和",
   "paymentMethod":"Alipay",
   "receivePosition":{
      "stationname":"S1",
      "currency":"Dol"
   },
   "publishPositions":[
      {
         "stationname":"S1",
         "amount":300,
         "currency":"Dol"
      },
      {
         "stationname":"S2",
         "amount":200,
         "currency":"Dol"
      }
   ],
   "customerWechat":"ADC",
   "customerPhone":"415-478-1234",
   "remark":null,
   "adContinue":false
}
/orderform/getorderform/:option
There are 3 options for parameter:

search:
   it has queries, all of those can be use combined.
   ex: getorderform/search?receiveSationName=S1&adStatus=Ongoing
       _id: search by ObjectId  ex:'5a3088f79a456321b0355808' do not work for agent privilege 
       receiveSationName:   ex 'S1'   for agent privilege fixxed in its stationname
       adStatus: search by status. ex: 'Pending'
       publishStationName: ex: 'S1'    for agent privilege fixxed in its stationname
       beginBeforeDate&beginAfterDate&endAfterDate&endBeforeDate:  '2017-08-09'


'all':
   return all the orderform 
   do not work for agent privilege.

'nothing':
   you will get error
 
 
 DELETE
 /orderform/deleteorderform
 orderform/checkOrder/delete?paymentId=5a347b9adf3486119c5c8633





ADD 
payment History
/orderform/checkOrder/paycheckOrder
add a payment history to checkorderId
{
  "checkOrderId":"5a20e169ee21392b8ca9b1ae",
  "payDay":"2017-12-01T04:58:17.456Z",
  "paymentAmount":80
}


UPDATE
/orderform/checkOrder/updatepayorder'
paymentId must exist 
{
  "paymentId":"5a21fc9a8166fe1f74c47c8d",
  "payDay":"2017-12-01T04:58:17.456Z",
  "paymentAmount":800
}

DELETE
/orderform/checkOrder/delete
orderform/checkOrder/delete?paymentId=5a347b9adf3486119c5c8633

