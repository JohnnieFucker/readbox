const fs = require('fs');
const path = require('path');
const readline = require('readline');
const JsonFile = require('jsonfile');
/**
 * 生成通用字典JSON数据
 */
function createCommonDicJson() {
    const fRead = fs.createReadStream(`${path.dirname(__filename)}/../dicts/jieba.dict.utf8`);
    const rlObj = readline.createInterface({
        input: fRead
    });
    const self = {
        total: 0,
        dic: {}
    };

    rlObj.on('line', (line) => {
        const wordArray = line.split(' ');
        if (wordArray[0] && wordArray[0] !== '') {
            if (wordArray[1] && !isNaN(parseInt(wordArray[1], 10))) {
                self.total += parseInt(wordArray[1], 10);
                self.dic[wordArray[0]] = self.dic.hasOwnProperty(wordArray[0]) ? (self.dic[wordArray[0]] + parseInt(wordArray[1], 10)) : parseInt(wordArray[1], 10);
            } else {
                // 未指定词频的按1处理
                self.total += 1;
                self.dic[wordArray[0]] = self.dic.hasOwnProperty(wordArray[0]) ? (self.dic[wordArray[0]] + 1) : 1;
            }
        }
    });

    rlObj.on('close', () => {
        JsonFile.writeFileSync(`${path.dirname(__filename)}/../dicts/common.dict.json`, self);
        console.log('通用字典生成完毕');
    });
}
createCommonDicJson();
