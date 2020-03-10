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
    isDIffEnter: false,
    isOsmoEnter: false,
    itemsState: ['001001001001001001001001001'],
}

window.insertNewAction = function(socket, username, sequenceID, stage, actionType,
    operatedItem, rewardType, rewardQty, totalCoins, itemsState = ''){

    var state;
    if(stage == 'diff'){
        state = '0';
        state.concat(itemsState);
    }else if(stage == 'osmo'){
        state = '1';
        state.concat(itemsState);
    }

    var activity = {username: username, sequenceID: sequenceID, stage: stage, actionType: actionType,
                    operatedItem: operatedItem, rewardType: rewardType, rewardQty: rewardQty,
                    totalCoins: totalCoins, itemsState: state};
   
    socket.emit("newAction", activity);
    G.sequenceCnt = sequenceID + 1;
};