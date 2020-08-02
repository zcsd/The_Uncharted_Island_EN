cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        coinLabel: cc.Label,
        hintLabel: cc.Label,
        progressBar: cc.ProgressBar,
        avatarSprite: cc.Sprite,

        hints: cc.JsonAsset,

        osmosisLeft: cc.Node,
        osmosisRight: cc.Node,
        sodium: cc.Node,

        osmosisLeft1: cc.Node,
        osmosisRight1: cc.Node,
        sodium1: cc.Node,

        coinRotate: cc.Node,
        coinShine: cc.Node,
        coinBlink: cc.Node,

        isShowCongra: false,
        showCount: 0,

        pressAni: cc.Node,

        sodAni: cc.Animation,
        leftAni: cc.Animation,
        rightAni: cc.Animation,

        sod1Ani: cc.Animation,
        left1Ani: cc.Animation,
        right1Ani: cc.Animation,

        mask: cc.Node,
        alertHint: cc.Label,
        kgScale: 0,
        errorCount: null,
    },

    onLoad: function () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;
        this.coinLabel.string = player.coinsOwned.toString();

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });
        // load hints from json
        cc.loader.loadRes('hints2', function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                self.hints = data;
            }
        });

        //socket, username, sequenceID, stage, actionType, operatedItem, rewardType, rewardQty, totalCoins
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "init", "na", "na", 0, G.user.coin, G.itemsState);
        
        if(G.isOsmoDone){
            var introduction = "Welcome to osmosis lab！You have finished osmosis experiment. There is no more reward for finishing the experiment again.";
            Alert.show(1.3, "Osmosis", introduction, function(){
                self.coinAnimation(0);
                self.pressQuizAnimation();
                self.showHint(0, "There is no more reward for finishing the experiment again.");
            }, false);
        }else{
            var introduction = "Welcome to osmosis lab! Please do a osmosis experiment using beaker. You need to spend coins to buy or use material. Make your choice after consideration.";
            Alert.show(1.3, "Osmosis", introduction, function(){
                self.coinAnimation(0);
                self.pressQuizAnimation();
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "read", "introduction", "na", 0, G.user.coins, G.itemsState);
                
                if(G.user.coins <= 0){
                    self.showHint(0, "Coins are not enough for playing game, click the quiz icon to do quiz to win more coins.");
                }else{
                    setTimeout(function(){
                        cc.find("Canvas/popup").active = true;
                        cc.find("Canvas/popup/kgLevelSurvey").active = true;
                    }, 300);
                    self.showHint(0, "Please buy or use suitable instrument and solute.");
                }
            }, false);
        }

        KT.lastScene = 'DoOsmosisTest';

        this.sodAni = this.sodium.getComponent(cc.Animation);
        this.leftAni = this.osmosisLeft.getComponent(cc.Animation);
        this.rightAni = this.osmosisRight.getComponent(cc.Animation);

        this.sod1Ani = this.sodium1.getComponent(cc.Animation);
        this.left1Ani = this.osmosisLeft1.getComponent(cc.Animation);
        this.right1Ani = this.osmosisRight1.getComponent(cc.Animation);

        G.globalSocket.on('osmosis', function(msg){
            console.log('osmosis hint: ', msg);
            self.hintLabel.string = msg;
        });

        G.globalSocket.on('command', function(msg){
            console.log('command received: ', msg);
            
            if (msg == 'leftsalt'){
                self.addSaltToLeft();
            }
        });

        this.progressBar.progress = 0;
        this.checkMaterial();
        G.isOsmoEnter = true;

        this.errorCount = [0, 0, 0];
    },

    showHint: function(method, content) {
        //method: how to show hint content
        //        0 - default
        //        1 - popup window
        //        2 - speech T2S
        if(method == 0){
            cc.find("Canvas/hintIconLabel").active = true;
            cc.find("Canvas/hintLabel").active = true;
            this.hintLabel.node.color = new cc.color(0,0,0,255);
            this.hintLabel.string = content;
            var blink = cc.blink(2, 2);
            this.hintLabel.node.runAction(blink);   
        }else if (method == 1){
            cc.find("Canvas/hintIconLabel").active = false;
            cc.find("Canvas/hintLabel").active = false;

            var self = this;
            setTimeout(function(){
                cc.find("Canvas/popup").active = true;
                cc.find("Canvas/popup/hintAlert").active = true;
                self.alertHint.string = content;
                cc.find('Canvas/popup/hintAlert/contentBg/surveyToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
                cc.find('Canvas/popup/hintAlert/contentBg/surveyToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
            }, 600);
        }else if(method == 2){
            console.log('22');
        }
    },

    addSaltToLeft: function () {
        this.sodAni.stop("sodiumAni");
        cc.find('Canvas/container/c2/left').active = false;
        cc.find('Canvas/container/c2/right').active = false;
        cc.find('Canvas/container/c2/sodium').active = false;

        cc.find('Canvas/container/c2/left1').active = true;
        cc.find('Canvas/container/c2/right1').active = true;
        cc.find('Canvas/container/c2/sodium1').active = true;

        var sod1State = this.sod1Ani.play('sodium1Ani');
        sod1State.wrapMode = cc.WrapMode.Loop;
        sod1State.repeatCount = Infinity;

        this.left1Ani.play('left1Ani');
        this.right1Ani.play('right1Ani');

        this.showHint(0, "More water moves to higher concentration side, osmosis is affected by the difference of solute concentration. Now you can back to main.");
    },

    changeHint: function(){
        var player = cc.find('player').getComponent('Player');
        var used = player.osmoMaterialUsed;

        var situation = '';

        if (used.size == 0){
            situation = 'zero';
        } else if (used.size == 1 && used.has(2)){
            situation = 'utube';
        } else if (used.size == 2 && used.has(2) && used.has(6)){
            situation = 'utubemembrane';
        }

        //for hints2
        var finalHint;

        if(situation == 'zero'){
            finalHint = this.hints.json["osmo"][situation][G.finalStyle][this.errorCount[0].toString()];
            this.errorCount[0] += 1;
        }else if(situation == 'utube'){
            finalHint = this.hints.json["osmo"][situation][G.finalStyle][this.errorCount[1].toString()];
            this.errorCount[1] += 1;
        }else if(situation == 'utubemembrane'){
            finalHint = this.hints.json["osmo"][situation][G.finalStyle][this.errorCount[2].toString()];
            this.errorCount[2] += 1;
        }
        /*
        if(G.finalStyle == 'A' || G.finalStyle == 'S'){
            var keywords = this.hints.json["osmo"][situation]['con'];
            if(G.finalStyle == 'A'){
                finalHint = 'How can ' + keywords + ' relate to this?';
            }else if(G.finalStyle == 'S'){
                finalHint = 'Think about the realtions to ' + keywords + '.'; 
            }
        }else if(G.finalStyle == 'R' || G.finalStyle == 'I'){
            var keywords = this.hints.json["osmo"][situation]['abs'];
            if(G.finalStyle == 'R'){
                finalHint = 'Think about how' + keywords + '.';
            }else if(G.finalStyle == 'I'){
                finalHint = 'How can there be ' + keywords + '?'; 
            }
        }*/

        console.log(finalHint);

        G.globalSocket.emit('hintAlert', '操作错误，提示，' + finalHint);

        finalHint = 'You did wrongly. ' + finalHint;

        this.showHint(G.hintMethod, finalHint);
    },

    removeHintAlert: function(){
        this.alertHint.string = '';
        cc.find("Canvas/popup").active = false;
        cc.find("Canvas/popup/hintAlert").active = false;
    },

    getKgScale: function(){
        var scale = cc.find("Canvas/popup/kgLevelSurvey/contentBg/scaleEditBox/TEXT_LABEL").getComponent(cc.Label).string;
        console.log('scale: ' + scale);
        this.kgScale = scale;
        cc.find("Canvas/popup").active = false;
        cc.find("Canvas/popup/kgLevelSurvey").active = false;
    },

    getHintFeedback: function(event, customEventData){
        console.log("Hint quality: " + customEventData);
    },

    readyToBuyMaterial: function (event, customEventData) {
        var materialInfo = customEventData.split("_", 4);
        var materialCost = Number(materialInfo[0]);
        var materialName = materialInfo[1];
        var materialCode = Number(materialInfo[2]);
        var materialClass = materialInfo[3];

        cc.find("Canvas/hintIconLabel").active = false;
        cc.find("Canvas/hintLabel").active = false;

        var player = cc.find('player').getComponent('Player');
        if (player.osmoMaterialOwned.has(materialCode)) {
            if (player.osmoMaterialUsed.has(materialCode)) {
                console.log("is used");
                var displayInfo = "Do you want to take back " + materialInfo[1]  + "?";
                var self = this;
                Alert.show(1, "Take Back", displayInfo, function(){
                    self.afterBacking(materialCode, materialClass);
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "takeback", materialInfo[1], "na", 0, G.user.coins, G.itemsState);
                });
            }
            else {
                if (player.osmoMaterialUsedClass.has(materialClass)) {
                    console.log("owned, can not used");
                    var displayInfo = "You have used the item of same category. Please use it after taking the original back.";
                    Alert.show(1, "Warning", displayInfo, function(){
                        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "refuseusing", materialInfo[1], "na", 0, G.user.coins, G.itemsState);
                    }, false);
                }
                else {
                    console.log("owned, can use, but not used");
                    var displayInfo = "Do you want to spend 10 coins to use " + materialInfo[1]  + "?";
                    var self = this;
                    Alert.show(1, "Use", displayInfo, function(){
                        if(self.checkCoinEnough(10)){
                            self.afterUsing(materialCode, materialInfo[1], materialClass);
                        }else{
                            self.showHint(0, "You don't have enough coins to use material, click quiz icon to win coins.");
                        }  
                    });
                }
            }
        }
        else {
            console.log("Not owned.");
            var displayInfo = "Do you want to spend " + materialInfo[0] + " coins to buy " + materialInfo[1] + "?";
            var self = this;
            Alert.show(1, "Buy", displayInfo, function(){
                if(self.checkCoinEnough(50)){
                    self.afterBuying(materialCost, materialCode);
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "buy", materialInfo[1], "penalty", materialCost, G.user.coins, G.itemsState);
                }else{
                    if(G.user.coins >0){
                        G.isQuizOpen = true;
                        self.pressQuizAnimation();
                    }
                    self.showHint(0, "You don't have enough coins to buy material, click quiz icon to win coins.");
                } 
            });
        }
    },

    afterBuying: function(cost, code) {
        console.log("购买确定按钮被点击!");
        this.coinAnimation(-1);
        var player = cc.find('player').getComponent('Player');
        player.updateCoins(cost*(-1));
        player.updateInventory('osmo', 'buy', code);

        this.setMaterialOwned(code);
    },

    afterUsing: function(code, material, mClass) {
        var player = cc.find('player').getComponent('Player');

        if (mClass == 'a') {
            this.coinAnimation(-1);
            player.updateCoins(-10);
            if (code == 2) {
                this.setMaterialUsed(code);
                player.updateInventory('osmo', 'use', code, mClass);
                var nodePath = 'Canvas/container/c' + code.toString();
                var containerNode = cc.find(nodePath);
                containerNode.active = true;
                this.progressBar.progress += 0.33;
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "use", material, "penalty", 10, G.user.coins, G.itemsState); 
            }
            else {
                this.changeHint();
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
            }
        }

        if (mClass == 'b') {
            if(player.osmoMaterialUsed.has(2)) {
                this.coinAnimation(-1);
                player.updateCoins(-10);
                if (code == 6) {
                    player.updateInventory('osmo', 'use', code, mClass);
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "use", material, "penalty", 10, G.user.coins, G.itemsState); 
                    this.setMaterialUsed(code);
                    var nodePath = 'Canvas/container/c2/membrane';
                    cc.find(nodePath).active = true;
                    this.progressBar.progress += 0.33;
                }
                else {
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
                    this.changeHint();
                }
            }
            else {
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
                this.changeHint();
            }
        }

        if (mClass == 'c') {
            if (player.osmoMaterialUsed.has(6)) {
                if (code == 7) {
                    G.isOsmoDone = true;
                    this.coinAnimation(-1);
                    player.updateCoins(-10);
                    this.setMaterialUsed(code);

                    player.updateInventory('osmo', 'use', code, mClass);
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "use", material, "penalty", 10, G.user.coins, G.itemsState); 

                    this.leftAni.on('finished', function() {
                        this.progressBar.progress = 1.0;
                        var self = this;
                        if(G.isOsmoRewarded){
                            Alert.show(1, "Achievement", "Well done! You have finished the experiment, no reward.", function(){
                                player.updateInventory('osmo', 'clear', 0);
                                
                                cc.find("Canvas/addSalt").active = true;

                                self.showHint(0, "Now click 'Add Salt' button to add some salt to left side, observe the change.");
                            }, false);
                        }else{
                            player.updateCoins(400);
                            G.isOsmoRewarded = true;
                            insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "finish", "na", "reward", 400, G.user.coins, G.itemsState);
                            Alert.show(1, "Achievement", "Well done! You have finished the experiment. Click ok to get 400 coins！", function(){
                                self.coinAnimation(1);

                                player.updateInventory('osmo', 'clear', 0);

                                cc.find("Canvas/addSalt").active = true;

                                self.showHint(0, "Now click 'add salt' button to add some salt to left side, observe the change.");
                            }, false);
                        }
                    }, this);

                    var sodiAniState = this.sodAni.play("sodiumAni");
                    sodiAniState.wrapMode = cc.WrapMode.Loop;
                    sodiAniState.repeatCount = Infinity;

                    this.leftAni.play("leftAni");
                    this.rightAni.play("rightAni");
                }
                else {
                    this.coinAnimation(-1);
                    player.updateCoins(-10);
                    this.changeHint();
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
                }
            }
            else {
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
                this.changeHint();
            }
        }
    },

    afterBacking: function(code, mClass) {
        var materialNodePath = 'Canvas/materialBackground/m' + code.toString() + 'Button';
        var isOwnedNode = cc.find((materialNodePath + '/isOwned'));
        isOwnedNode.getComponent(cc.Sprite).setState(0);

        var player = cc.find('player').getComponent('Player');
        player.updateInventory('osmo', 'takeback', code, mClass);

        if (mClass == 'a') {
            var nodePath = 'Canvas/container/c' + code.toString();
            var containerNode = cc.find(nodePath);
            containerNode.active = false;
            if (code == 2) {
                this.progressBar.progress -= 0.33;
            }
        }
    },

    checkMaterial: function() {
        var player = cc.find('player').getComponent('Player');
        for (var i of player.osmoMaterialOwned) {
            this.setMaterialOwned(i);
        }

        for (var i of player.osmoMaterialUsed) {
            this.setMaterialUsed(i);
        }
    },

    setMaterialOwned: function(code) {
        var materialNodePath = 'Canvas/materialBackground/m' + code.toString() + 'Button';
        var isOwnedNode = cc.find((materialNodePath + '/isOwned'));
        isOwnedNode.active = true;
    },

    setMaterialUsed: function(code) {
        var materialNodePath = 'Canvas/materialBackground/m' + code.toString() + 'Button';
        var isOwnedNode = cc.find((materialNodePath + '/isOwned'));
        isOwnedNode.getComponent(cc.Sprite).setMaterial(1);
    },

    checkCoinEnough: function(cost) {
        var tempCoins = G.user.coins - cost;
        if (tempCoins >= 0){
            return true;
        }else{
            insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "bankrupt", "na", "na", 0, G.user.coins, G.itemsState);
            return false;
        }
    },

    coinAnimation: function (type) {
        cc.find("Canvas/coin").active = false;
        if(type == 1){
            cc.find("Canvas/coinRotate").active = true;
            var coinRotComponent = this.coinRotate.getComponent(cc.Animation);
            coinRotComponent.on('finished', function(){
                cc.find("Canvas/coinRotate").active = false;
                cc.find("Canvas/coin").active = true;
                this.coinLabel.string = G.user.coins.toString();

                this.isShowCongra = true;
                //cc.find("Canvas/singleColor").active = true;
                //cc.find("Canvas/congraluation").active = true;
            }, this);
            coinRotComponent.play("coinRotAni");
        }else if(type == -1){
            cc.find("Canvas/coinShine").active = true;
            var coinShnComponent = this.coinShine.getComponent(cc.Animation);
            coinShnComponent.on('finished', function(){
                cc.find("Canvas/coinShine").active = false;
                cc.find("Canvas/coin").active = true;
                this.coinLabel.string = G.user.coins.toString();
                if(G.user.coins <= 0 && G.isOsmoDone == false){
                    //this.hintLabel.node.color = new cc.color(230, 0, 0, 255);
                    //this.hintLabel.string = "金币已不足，无法继续试验，点击右上角参与答题赢取金币吧";
                }
                this.pressQuizAnimation();
            }, this);
            coinShnComponent.play("coinShineAni");
        }else if(type == 0){
            cc.find("Canvas/coinBlink").active = true;
            var coinBlkComponent = this.coinBlink.getComponent(cc.Animation);
            coinBlkComponent.on('finished', function(){
                cc.find("Canvas/coinBlink").active = false;
                cc.find("Canvas/coin").active = true;
            }, this);
            coinBlkComponent.play("coinBlkAni");
        }
    },

    pressQuizAnimation: function(){
        if(G.isQuizOpen){
            cc.find("Canvas/quizButton").active = true;
            cc.find('Canvas/quizButton').getComponent(cc.Button).interactable = true;
            cc.find("Canvas/pressAni").active = true;
            var pressQuizComponent = this.pressAni.getComponent(cc.Animation);
            pressQuizComponent.on('finished', function(){
                cc.find("Canvas/pressAni").active = false;
                var quizSeq = cc.repeatForever(cc.sequence(cc.scaleTo(1.4, 0.68), cc.scaleTo(1.4, 0.72)));
                cc.find('Canvas/quizButton').runAction(quizSeq);
            }, this);
            pressQuizComponent.play("pressAni");
        }else{
            cc.find("Canvas/quizButton").active = false;
            cc.find('Canvas/quizButton').getComponent(cc.Button).interactable = false;
        }
    },

    backToMapScene: function () {
        this.resetScene();
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "back", "na", "na", 0, G.user.coins, G.itemsState);
        cc.director.loadScene("LevelMap");
    },
    
    resetScene: function () {
        G.globalSocket.removeAllListeners("osmosis");
        G.globalSocket.removeAllListeners("command");
        var player = cc.find('player').getComponent('Player');
        player.updateInventory('osmo', 'clear', 0);
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "reset", "na", "na", 0, G.user.coins, G.itemsState);
    },

    goToQuizScene: function() {
        this.resetScene();
        cc.director.loadScene("DoQuiz");
    },

    onEnable : function(){
        this.mask.on('touchstart',function(event){
            event.stopPropagation();
        });

        this.mask.on('touchend', function (event) {
            event.stopPropagation();
        });
    },
        
    onDisable : function(){

        this.mask.off('touchstart',function(event){
            event.stopPropagation();
        });
        this.mask.off('touchend', function (event) {
            event.stopPropagation();
        });
    },

    //start () {},

    update: function () {
        if (this.showCount >= 150){
            this.isShowCongra = false;
            this.showCount = 0;
            cc.find("Canvas/singleColor").active = false;
            cc.find("Canvas/congraluation").active = false;
        }else if (this.showCount < 150 && this.isShowCongra == true) {
            this.showCount++;
        }
    },
});
