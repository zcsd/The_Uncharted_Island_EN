window.G = {
    globalSocket: null,
    user: null,
    sequenceCnt: 0,
    isNewUser: false,
    isDiffDone: false,
    isOsmoDone: false,
    isBanaDone: false,
    isQuizOpen: false,
    isDiffRewarded: false,
    isOsmoRewarded: false,
    isDiffEnter: false,
    isOsmoEnter: false,
    itemsState: '001001001001001001001001001',
    style: 'A_S',
    finalStyle: 'I',
    hintMethod: 1,
    kgPoint: cc.JsonAsset,
    lastKg: 0,
    totalKg: 13,
}

window.KT = {
    branchSize: 21,
    check: {'check1': false, 'check2': false, 'check3': false, 'check4': false, 'check5': false,
    'check6': false,'check7': false,'check8': false,'check9': false,'check10': false,'check11': false,
    'check12': false,'check13': false,'check14': false,'check15': false,'check16': false,'check17': false,
    'check18': false,'check19': false,'check20': false,'check21': false},

    attention: {'attention1': false, 'attention2': false, 'attention3': false, 'attention4': false, 'attention5': false,
    'attention6': false,'attention7': false,'attention8': false,'attention9': false,'attention10': false,'attention11': false,
    'attention12': false,'attention13': false,'attention14': false,'attention15': false,'attention16': false,'attention17': false,
    'attention18': false,'attention19': false,'attention20': false,'attention21': false},

    toStart: {'start1': true, 'start2': true, 'start3': true, 'start4': true, 'start5': true,
    'start6': true,'start7': true,'start8': true,'start9': true,'start10': true,'start11': true,
    'start12': true,'start13': true,'start14': true,'start15': true,'start16': true,'start17': true,
    'start18': true,'start19': true,'start20': true,'start21': true},

    lastScene: 'LevelMap',
}

window.insertNewAction = function(socket, username, sequenceID, stage, actionType,
    operatedItem, rewardType, rewardQty, totalCoins, itemsState = '001001001001001001001001001'){

    console.log(itemsState);

    var activity = {username: username, sequenceID: sequenceID, stage: stage, actionType: actionType,
                    operatedItem: operatedItem, rewardType: rewardType, rewardQty: rewardQty,
                    totalCoins: totalCoins, itemsState: itemsState};
   
    socket.emit("newAction", activity);
    G.sequenceCnt = sequenceID + 1;
};
