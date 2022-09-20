// //link -> group
// import {doGet, doJSONPost} from "../utils/ajax";
//
// export const findGroup= async (link)=>{
//     return await doGet('/searchGroupByGroupId/' + link)
// }
//
// //order -> back
// export const placeOrder= async (order)=>{
//     return await doJSONPost('/joinGroup', order)
// }
//
// //order_status: 0 -> 1
// export const payOrder= async (oid)=>{
//     return await doGet('/payOrder/' + oid)
// }
//
// //uid -> back -> from history {index} {num}  groups    no priority!!!
// export const findHistoryGroup=(uid, num, index, callback)=>{
//
// }
//
// //uid -> back -> from history {index} {num}  orders
// export const findOrders=(uid, num, index, callback)=>{
//
// }
//
// //refund with txt to the leader (order_status -> 3) -> leader -> (order_status -> 4 :canceled)    low priority!
// export const refund=(oid, txt, callback)=>{
//
// }
//
