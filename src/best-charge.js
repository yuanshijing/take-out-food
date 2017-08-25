const loadAllItems = require('./items');
const loadPromotions = require('./promotions');

function makeItemsList(inputs) {
    let allItems = loadAllItems();
    let itemsInfo = [];
    inputs.forEach((item) => {
        itemsInfo.push({id:item.split(' x ')[0],count:item.split(' x ')[1]});
    })
    itemsInfo.forEach((i) => {
        for (let item of allItems) {
            if (i.id == item.id) {
                i.name = item.name;
                i.price = item.price;
                i.sum = i.price * i.count;
            }
        }
    })
    return itemsInfo;
}/*[ { id: 'ITEM0013', count: '4', name: '肉夹馍', price: 6, sum: 24 },
  { id: 'ITEM0022', count: '1', name: '凉皮', price: 8, sum: 8 } ]*/

function promotion1(itemsInfo) {
    let summary = {sum:0,save:0};
    itemsInfo.forEach((i) => summary.sum+=i.sum);
    if (summary.sum >= 30){
        summary.save = 6;
        summary.sum -= 6;
    }
    return summary;
}//{ sum: 26, save: 6 }

function promotion2(itemsInfo) {
    let summary = {sum:0,save:0,name:[]};
    let promotions = loadPromotions()[1].items;
    itemsInfo.forEach((item) =>{
        summary.sum += item.sum;
        if(promotions.includes(item.id)) {
            summary.save += item.sum/2;
            summary.name.push(item.name);
        }
    })
    summary.sum -= summary.save;
    return summary;
}//{ sum: 25, save: 13, name: [ '黄焖鸡', '凉皮' ] }

function printReceipt(sum1,sum2,itemsInfo) {
    let sum = 0;
    let receipt = '============= 订餐明细 =============\n';
    itemsInfo.forEach((item) =>receipt += `${item.name} x ${item.count} = ${item.sum}元\n`);
    if(sum1.save !== 0 || sum2.save !== 0) {
        receipt += '-----------------------------------\n使用优惠:\n';
        if(sum2.sum > sum1.sum)  {
            receipt += `满30减6元，省6元\n`;
            sum = sum1.sum;
        }else {
            receipt += `指定菜品半价(${sum2.name[0]}`;
            for (let i = 1;i<sum2.name.length;i++) {
                receipt += `，${sum2.name[i]}`;
            }
            receipt += `)，省${sum2.save}元\n`;
            sum = sum2.sum;
        }
    }else{
        sum = sum1.sum;
    }
    receipt += `-----------------------------------
总计：${sum}元
===================================`;
    return receipt;
}

module.exports = function bestCharge (inputs) {
    let itemsInfo = makeItemsList(inputs);
    let sum1 = promotion1(itemsInfo);
    let sum2 = promotion2(itemsInfo);
    return printReceipt(sum1,sum2,itemsInfo);
}

