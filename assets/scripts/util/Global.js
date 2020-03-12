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