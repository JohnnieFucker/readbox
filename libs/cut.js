const fs = require('fs');
const path = require('path');

const regEng = new RegExp('[a-zA-Z0-9]');
const regChi = new RegExp('([\u4E00-\u9FD5a-zA-Z0-9+#&\\._]+)');
const regSkip = new RegExp('(\\r|\\n|\\s)');
const regChiCutAll = new RegExp('([\u4E00-\u9FD5]+)');
const regSkipCutAll = new RegExp('[^a-zA-Z0-9+#\\n]');
const commonDic = require('../dicts/common.dict.json');

/**
 * 生成DAG有向无环图
 * @param sentence
 * @param companyId
 * @return {{}}
 */
function getDAG(sentence) {
    const DAG = {};
    const n = sentence.length;
    for (let i = 0; i < n; i++) {
        const tmp = [];
        let k = i;
        let frag = sentence[i];
        while (k < n) {
            // 在公有字典中匹配或者在公司私有字典中匹配
            if (commonDic.dic.hasOwnProperty(frag)) {
                tmp.push(k);
            }
            k++;
            frag = sentence.substring(i, k + 1);
        }
        if (tmp.length === 0) {
            tmp.push(i);
        }
        DAG[i] = tmp;
    }
    return DAG;
}

/**
 * 计算最佳路径
 * @param sentence
 * @param companyId
 * @param DAG
 * @return {{}}
 */
function calRoute(sentence, DAG) {
    const route = {};
    const n = sentence.length;
    const total = commonDic.total;
    route[n] = {
        q: 0,
        i: 0
    };
    for (let i = n - 1; i >= 0; i--) {
        const maxFreq = {
            q: false,
            i: 0
        };
        for (const x of DAG[i]) {
            const word = sentence.substring(i, x + 1);
            let freq = commonDic.dic.hasOwnProperty(word) ? commonDic.dic[word] : 1;
            freq = Math.log(freq / total) + route[x + 1].q;
            if (maxFreq.q === false) {
                maxFreq.q = freq;
                maxFreq.i = x;
            }
            if (freq > maxFreq.q) {
                maxFreq.q = freq;
                maxFreq.i = x;
            }
        }
        route[i] = maxFreq;
    }
    return route;
}

function _cutDAGNoHMM(sentence) {
    const route = calRoute(sentence, getDAG(sentence));
    const result = [];
    let x = 0;
    let y = 0;
    const n = sentence.length;
    let word = '';
    while (x < n) {
        y = route[x].i + 1;
        const tmpWord = sentence.substring(x, y);
        if (tmpWord.length === 1 && regEng.test(tmpWord)) {
            word += tmpWord;
        } else {
            if (word !== '') {
                result.push(word);
                word = '';
            }
            result.push(tmpWord);
        }
        x = y;
    }
    if (word !== '') {
        result.push(word);
    }
    return result;
}

/**
 * 分词
 * @param sentence
 * @param companyId
 * @param cutAll
 * @param HMM
 * @return {Array}
 */
function cut(sentence, cutAll, HMM) {
    if (typeof (cutAll) === 'undefined') {
        cutAll = false;
    }
    if (typeof (HMM) === 'undefined') {
        HMM = true;
    }
    let regH = regChi;
    let regS = regSkip;
    if (cutAll) {
        regH = regChiCutAll;
        regS = regSkipCutAll;
    }
    const blocks = sentence.split(regH);
    const result = [];
    blocks.forEach((blk) => {
        if (blk && blk !== '') {
            if (regH.test(blk)) {
                let words = [];
                if (cutAll) {
                    // words = _cutAll(blk);
                } else if (HMM) {
                    // words = _cutDAGWithHMM(blk);
                } else {
                    words = _cutDAGNoHMM(blk);
                }
                words.forEach((w) => {
                    result.push(w);
                });
            } else {
                blk.split(regS).forEach((x) => {
                    if (x && x !== '') {
                        if (regS.test(x)) {
                            result.push(x);
                        } else if (cutAll) {
                            result.push(x);
                        } else {
                            for (let i = 0; i < x.length; i++) {
                                result.push(x[i]);
                            }
                        }
                    }
                });
            }
        }
    });
    // const ret = [];
    // result.forEach((w) => {
    //     const w2 = {
    //         word: w
    //     };
    //     if (globalVar.dicCommonItent.hasOwnProperty(w)) {
    //         w2.tag = globalVar.dicCommonItent[w];
    //     }
    //     if (globalVar.dicCompany.hasOwnProperty(companyId) && globalVar.dicCompany[companyId].dic.hasOwnProperty(w)) {
    //         if (isNaN(parseInt(globalVar.dicCompany[companyId].dic[w], 10))) {
    //             if (w2.tag && w2.tag !== '') {
    //                 w2.tag += `||${globalVar.dicCompany[companyId].dic[w]}`;
    //             } else {
    //                 w2.tag = globalVar.dicCompany[companyId].dic[w];
    //             }
    //         }
    //     }
    //     ret.push(w2);
    // });
    // return ret;
    return result;
}

/**
 * 返回语句中所有分词，去掉单字
 * @param sentence
 * @param companyId
 */
function tag(sentence) {
    const dag = getDAG(sentence);
    const result = [];
    for (const k in dag) {
        if (dag.hasOwnProperty(k)) {
            if (dag[k].length > 0) {
                dag[k].forEach((ele) => {
                    if (parseInt(k, 10) !== ele) {
                        const word = sentence.substring(parseInt(k, 10), ele + 1);
                        result.push(word);
                    }
                });
            }
        }
    }
    return result;
}


function keyWord(sentence) {
    let words = cut(sentence, false, false);
    words = words.filter(w => w.length > 1 && regChi.test(w));
    const total = words.length;
    const freq = {};
    words.forEach((w) => {
        if (freq.hasOwnProperty(w)) {
            freq[w].fq += 1;
        } else {
            freq[w] = {
                w: w,
                fq: 1
            };
        }
    });
    const retArr = [];
    for (const w in freq) {
        if (freq.hasOwnProperty(w)) {
            freq[w].tf = freq[w].fq / total;
            if (commonDic.dic.hasOwnProperty(w)) {
                freq[w].idf = Math.log(commonDic.total / commonDic.dic[w]);
            } else {
                freq[w].idf = 0.1;
            }
            freq[w].score = freq[w].tf * freq[w].idf;
            retArr.push(freq[w]);
        }
    }
    retArr.sort((a, b) => (a.score > b.score ? -1 : 1));
    return retArr.slice(0, 9);
}

module.exports = {
    cut: cut,
    tag: tag,
    keyWord: keyWord
};
