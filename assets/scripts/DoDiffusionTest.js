cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        coinLabel: cc.Label,
        hintLabel: cc.Label,
        progressBar: cc.ProgressBar,
        avatarSprite: cc.Sprite,

        hints: cc.JsonAsset,

        diffusion: cc.Node,
        freemove: cc.Node,
        red_diffusion: cc.Node,
        red_freemove: cc.Node,

        coinRotate: cc.Node,
        coinShine: cc.Node,
        coinBlink: cc.Node,

        isShowCongra: false,
        showCount: 0,

        pressAni: cc.Node,

        freemoveAniComponent: cc.Animation,
        diffAniComponent: cc.Animation,
        red_freemoveAniComponent: cc.Animation,
        red_diffAniComponent: cc.Animation,

        current_freemoveAni: cc.Animation,
        current_diffAni: cc.Animation,

        currentAniChoice: 'ugreen',
        mask: cc.Node,
        alertHint: cc.Label,

        animSpeed: 0.4,

        kgScale: 0,

        errorCount: null,
    },

    onLoad () {
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
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "init", "na", "na", 0, G.user.coins, G.itemsState);
        
        if(G.isDiffDone){
            var introduction = "Welcome to diffusion lab！You have finished diffusion experiment. There is no more reward for finishing the experiment again.";
            Alert.show(1.3, "Diffusion", introduction, function(){
                self.coinAnimation(0);
                self.pressQuizAnimation();
                self.showHint(0, "There is no more reward for finishing the experiment again.");
            }, false);
        }else{
            var introduction = "Welcome to diffusion lab! Please do a liquid diffusion experiment using U-tube. You need to spend coins to use material. Make your choice after consideration.";
            Alert.show(1.3, "Diffusion", introduction, function(){
                self.coinAnimation(0);
                self.pressQuizAnimation();
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "read", "introduction", "na", 0, G.user.coins, G.itemsState);

                if(G.user.coins <= 0){
                    self.showHint(0, "Coins are not enough for playing game, click the quiz icon to do quiz to win more coins.");                                                                                                                                   
                }else{
                    /*
                    setTimeout(function(){
                        cc.find("Canvas/popup").active = true;
                        cc.find("Canvas/popup/kgLevelSurvey").active = true;
                    }, 300);*/
                    self.showHint(0, "Please click to use suitable instrument and solute.");
                }       
            }, false);
        }

        this.freemoveAniComponent = this.freemove.getComponent(cc.Animation);
        this.diffAniComponent = this.diffusion.getComponent(cc.Animation);
        this.red_freemoveAniComponent = this.red_freemove.getComponent(cc.Animation);
        this.red_diffAniComponent = this.red_diffusion.getComponent(cc.Animation);

        G.globalSocket.on('diffusion', function(msg){
            console.log('diffusion hint: ', msg);
            self.hintLabel.string = msg;
        });

        G.globalSocket.on('command', function(msg){
            console.log('command received: ', msg);
            
            if (msg == 'colder'){
                self.changeToCold();
            }else if (msg == 'hotter'){
                self.changeToHot();
            }
        });

        KT.lastScene = 'DoDiffusionTest';

        this.progressBar.progress = 0;
        //this.checkMaterial();
        G.isDiffEnter = true;

        this.errorCount = [0, 0];
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

    changeToCold: function() {
        this.animSpeed = this.animSpeed - 0.15;

        if(this.currentAniChoice == 'ugreen'){
            this.freemoveAniComponent.stop("freemoveAni");
            var animState = this.freemoveAniComponent.play("freemoveAni");
            animState.speed = this.animSpeed;
        }else if(this.currentAniChoice == 'ured'){
            this.red_freemoveAniComponent.stop("redFreemoveAni");
            var animState = this.red_freemoveAniComponent.play("redFreemoveAni");
            animState.speed = this.animSpeed;
        }

        if(this.animSpeed > 0.4){ // hot
            var currentTemp = 27 + (this.animSpeed-0.4)/0.15*10;
            var tempString = "Temperature: " + Math.ceil(currentTemp).toString() + "℃";
            var tempLabel = cc.find("Canvas/tempLabel").getComponent(cc.Label);
            tempLabel.string = tempString;
            var blink = cc.blink(1, 2);
            tempLabel.node.runAction(blink);   

            cc.find('Canvas/hightempature').active = true;
            cc.find('Canvas/lowtempature').active = false;
            cc.find("Canvas/Hot").getComponent(cc.Button).interactable = true;
            cc.find("Canvas/Cold").getComponent(cc.Button).interactable = true;
            this.showHint(0, "You can continue to click hotter or colder to see the diffusion speed." );
            if(this.animSpeed >= 0.68){
                cc.find("Canvas/Hot").getComponent(cc.Button).interactable = false;
                this.showHint(0, "The rate of diffusion is higher at higher temperature, now you can try colder or back to main." );
            }
        }else if(this.animSpeed < 0.4){ // cold
            var currentTemp = 27 - (0.4-this.animSpeed)/0.15*10;
            var tempString = "Temperature: " + Math.ceil(currentTemp).toString() + "℃";
            var tempLabel = cc.find("Canvas/tempLabel").getComponent(cc.Label);
            tempLabel.string = tempString;
            var blink = cc.blink(1, 2);
            tempLabel.node.runAction(blink); 

            cc.find('Canvas/hightempature').active = false;
            cc.find('Canvas/lowtempature').active = true;
            cc.find("Canvas/Cold").getComponent(cc.Button).interactable = true;
            cc.find("Canvas/Hot").getComponent(cc.Button).interactable = true;
            this.showHint(0, "You can continue to click colder or hotter to see the diffusion speed." );
            if(this.animSpeed <= 0.12){
                cc.find("Canvas/Cold").getComponent(cc.Button).interactable = false;
                this.showHint(0, "The rate of diffusion is lower at lower temperature, now you can try hotter or back to main." );
            }
        }else if(this.animSpeed == 0.4){ // normal temperature
            var tempLabel = cc.find("Canvas/tempLabel").getComponent(cc.Label);
            tempLabel.string = "Temperature: 27℃";
            var blink = cc.blink(1, 2);
            tempLabel.node.runAction(blink); 

            cc.find('Canvas/hightempature').active = false;
            cc.find('Canvas/lowtempature').active = false;
            cc.find("Canvas/Cold").getComponent(cc.Button).interactable = true;
            cc.find("Canvas/Hot").getComponent(cc.Button).interactable = true;
            this.showHint(0,"Molecules move slower at lower temperature, faster at higher temperature. You can try hotter or colder." );
        }
    },

    changeToHot: function() {
        this.animSpeed = this.animSpeed + 0.15;

        if(this.currentAniChoice == 'ugreen'){
            this.freemoveAniComponent.stop("freemoveAni");
            var animState = this.freemoveAniComponent.play("freemoveAni");
            animState.speed = this.animSpeed;
        }else if(this.currentAniChoice == 'ured'){
            this.red_freemoveAniComponent.stop("redFreemoveAni");
            var animState = this.red_freemoveAniComponent.play("redFreemoveAni");
            animState.speed = this.animSpeed;
        }

        if(this.animSpeed > 0.4){ // hot
            var currentTemp = 27 + (this.animSpeed-0.4)/0.15*10;
            var tempString = "Temperature: " + Math.ceil(currentTemp).toString() + "℃";
            var tempLabel = cc.find("Canvas/tempLabel").getComponent(cc.Label);
            tempLabel.string = tempString;
            var blink = cc.blink(1, 2);
            tempLabel.node.runAction(blink);   

            cc.find('Canvas/hightempature').active = true;
            cc.find('Canvas/lowtempature').active = false;
            cc.find("Canvas/Hot").getComponent(cc.Button).interactable = true;
            cc.find("Canvas/Cold").getComponent(cc.Button).interactable = true;
            this.showHint(0, "You can continue to click hotter or colder to see the diffusion speed." );
            if(this.animSpeed >= 0.68){
                cc.find("Canvas/Hot").getComponent(cc.Button).interactable = false;
                this.showHint(0, "The rate of diffusion is higher at higher temperature, now you can try colder or back to main." );
            }
        }else if(this.animSpeed < 0.4){ // cold
            var currentTemp = 27 - (0.4-this.animSpeed)/0.15*10;
            var tempString = "Temperature: " + Math.ceil(currentTemp).toString() + "℃";
            var tempLabel = cc.find("Canvas/tempLabel").getComponent(cc.Label);
            tempLabel.string = tempString;
            var blink = cc.blink(1, 2);
            tempLabel.node.runAction(blink); 

            cc.find('Canvas/hightempature').active = false;
            cc.find('Canvas/lowtempature').active = true;
            cc.find("Canvas/Cold").getComponent(cc.Button).interactable = true;
            cc.find("Canvas/Hot").getComponent(cc.Button).interactable = true;
            this.showHint(0, "You can continue to click colder or hotter to see the diffusion speed." );
            if(this.animSpeed <= 0.12){
                cc.find("Canvas/Cold").getComponent(cc.Button).interactable = false;
                this.showHint(0, "The rate of diffusion is lower at lower temperature, now you can try hotter or back to main." );
            }
        }else if(this.animSpeed == 0.4){ // normal temperature
            var tempLabel = cc.find("Canvas/tempLabel").getComponent(cc.Label);
            tempLabel.string = "Temperature: 27℃";
            var blink = cc.blink(1, 2);
            tempLabel.node.runAction(blink); 

            cc.find('Canvas/hightempature').active = false;
            cc.find('Canvas/lowtempature').active = false;
            cc.find("Canvas/Cold").getComponent(cc.Button).interactable = true;
            cc.find("Canvas/Hot").getComponent(cc.Button).interactable = true;
            this.showHint(0,"Molecules move slower at lower temperature, faster at higher temperature. You can try hotter or colder." );
        }
    },

    changeHint: function(){
        var player = cc.find('player').getComponent('Player');
        var used = player.diffMaterialUsed;

        var situation = '';

        if (used.size == 0){
            situation = 'zero';
        } else if (used.has(1) && used.size == 1){
            situation = 'water';
        } else if (used.has(4) && used.size == 1){
            situation = 'dye';
        }
        
        //for hints2
        var finalHint;
        if(situation == 'zero'){
            finalHint = this.hints.json["diff"][situation][G.finalStyle][this.errorCount[0].toString()];
            this.errorCount[0] += 1;
        }else if(situation == 'water'){
            finalHint = this.hints.json["diff"][situation][G.finalStyle][this.errorCount[1].toString()];
            this.errorCount[1] += 1;
        }

        /*
        if(G.finalStyle == 'A' || G.finalStyle == 'S'){
            var keywords = this.hints.json["diff"][situation]['con'];
            if(G.finalStyle == 'A'){
                finalHint = 'How can ' + keywords + ' relate to this?';
            }else if(G.finalStyle == 'S'){
                finalHint = 'Think about the realtions to ' + keywords + '.'; 
            }
        }else if(G.finalStyle == 'R' || G.finalStyle == 'I'){
            var keywords = this.hints.json["diff"][situation]['abs'];
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
        if (player.diffMaterialOwned.has(materialCode)) {
            if (player.diffMaterialUsed.has(materialCode)) {
                console.log("is used");
                var displayInfo = "Do you want to take back " + materialInfo[1]  + "?";
                var self = this;
                Alert.show(1, "Take Back", displayInfo, function(){
                    self.afterBacking(materialCode, materialClass);
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "takeback", materialInfo[1], "na", 0, G.user.coins, G.itemsState);
                });
            }
            else {
                if (player.diffMaterialUsedClass.has(materialClass)) {
                    console.log("owned, same class used");
                    
                    var displayInfo = "Do you want to spend 50 coins to use " + materialInfo[1]  + "?";
                    var self = this;
                    Alert.show(1, "Use", displayInfo, function(){ 
                        if(self.checkCoinEnough(50)){
                            self.afterUsing(materialCode, materialInfo[1], materialClass);
                        }else{
                            self.showHint(0, "You don't have enough coins to use material, click quiz icon to win coins.");
                        }            
                    });
                    /*
                    var displayInfo = "You have used the item of same category. Please use it after taking the original back.";
                    Alert.show(1, "Use", displayInfo, function(){
                        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "refuseusing", materialInfo[1], "na", 0, G.user.coins, G.itemsState);
                    }, false);*/
                }
                else {
                    console.log("owned, can use, but not used");
                    var displayInfo = "Do you want to spend 50 coins to use " + materialInfo[1]  + "?";
                    var self = this;
                    Alert.show(1, "Use", displayInfo, function(){ 
                        if(self.checkCoinEnough(50)){
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
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "buy", materialInfo[1], "penalty", materialCost, G.user.coins, G.itemsState);
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

    readyToDiffuse: function () {
        var animState = this.diffAniComponent.play("uDiffAni");
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = 2;
    },

    afterBuying: function(cost, code) {
        console.log("购买确定按钮被点击!");
        this.coinAnimation(-1);
        var player = cc.find('player').getComponent('Player');
        player.updateCoins(cost*(-1));
        player.updateInventory('diff', 'buy', code);

        this.setMaterialOwned(code);
        this.showHint(0, "You bought the material and haven't used, now you can click the icon to use it.");
    },

    afterUsing: function(code, material, mClass) {
        var player = cc.find('player').getComponent('Player');

        if (mClass == 'a') {
            this.coinAnimation(-1);
            player.updateCoins(-50);
            if (code == 1) {
                this.setMaterialUsed(code);
                player.updateInventory('diff', 'use', code, mClass);
                var nodePath = 'Canvas/container/c' + code.toString();
                var containerNode = cc.find(nodePath);
                containerNode.active = true;
                this.progressBar.progress += 0.5;
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "use", material, "penalty", 10, G.user.coins, G.itemsState); 
            }
            else {
                this.changeHint();
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
            }
        }

        if (mClass == 'c') {
            if (player.diffMaterialUsed.has(1)) {
                if (code == 4 || code == 5) {
                    G.isDiffDone = true;
                    this.coinAnimation(-1);
                    player.updateCoins(-50);
                    this.setMaterialUsed(code);
                    player.updateInventory('diff', 'use', code, mClass);
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "use", material, "penalty", 10, G.user.coins, G.itemsState); 
                    
                    if(code == 4){
                        // green ink used
                        this.currentAniChoice = 'ugreen';
                        this.current_diffAni = this.diffAniComponent;
                        this.current_freemoveAni = this.freemoveAniComponent;
                        this.diffAniComponent.on('finished', function() {
                            cc.find('Canvas/container/c1/diff').active = false;
    
                            var freemoveAnimState = this.freemoveAniComponent.play("freemoveAni");
                            freemoveAnimState.wrapMode = cc.WrapMode.Loop;
                            freemoveAnimState.repeatCount = Infinity;
    
                            this.progressBar.progress += 0.5;
                            var self = this;
                            if(G.isDiffRewarded){
                                Alert.show(1.2, "Achievement", "Well done! You have finised the experiment, no reward.", function(){
                                    player.updateInventory('diff', 'clear', 0);

                                    cc.find("Canvas/Cold").active = true;
                                    cc.find("Canvas/Hot").active = true;
                                    cc.find("Canvas/tempLabel").active = true;

                                    self.showHint(0, "Now click below button to select Colder or Hotter temperature for experiment, observe the change.");
                                }, false);
                            }else{
                                player.updateCoins(300);
                                G.isDiffRewarded = true;
                                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "finish", "na", "reward", 300, G.user.coins, G.itemsState);
                                Alert.show(1.2, "Achievement", "Well done! You have finished the experiment, click ok to get 300 coins！", function(){
                                    self.coinAnimation(1);
                                    player.updateInventory('diff', 'clear', 0);

                                    cc.find("Canvas/Cold").active = true;
                                    cc.find("Canvas/Hot").active = true;
                                    cc.find("Canvas/tempLabel").active = true;

                                    self.showHint(0, "Now click below button to select Colder or Hotter temperature for experiment, observe the change.");
                                }, false);
                            }
                        }, this);
    
                        var animState = this.diffAniComponent.play("uDiffAni");
                    }else if (code ==5){
                        // red ink used
                        this.currentAniChoice = 'ured';
                        this.current_diffAni = this.red_diffAniComponent;
                        this.current_freemoveAni = this.red_freemoveAniComponent;
                        this.red_diffAniComponent.on('finished', function() {
                            cc.find('Canvas/container/c1/diff_red').active = false;
    
                            var freemoveAnimState = this.red_freemoveAniComponent.play("redFreemoveAni");
                            freemoveAnimState.wrapMode = cc.WrapMode.Loop;
                            freemoveAnimState.repeatCount = Infinity;
    
                            this.progressBar.progress += 0.5;
                            var self = this;
                            if(G.isDiffRewarded){
                                Alert.show(1, "Achievement", "Well done, you have finised the experiment, no reward.", function(){
                                    player.updateInventory('diff', 'clear', 0);

                                    cc.find("Canvas/Cold").active = true;
                                    cc.find("Canvas/Hot").active = true;
                                    cc.find("Canvas/tempLabel").active = true;

                                    self.showHint(0, "Now click below button to select Colder or Hotter temperature for experiment, observe the change.");
                                }, false);
                            }else{
                                player.updateCoins(300);
                                G.isDiffRewarded = true;
                                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "finish", "na", "reward", 300, G.user.coins, G.itemsState);
                                Alert.show(1, "Achievement", "Well done, you have finished the experiment. Click ok to get 300 coins！", function(){
                                    self.coinAnimation(1);
                                    player.updateInventory('diff', 'clear', 0);

                                    cc.find("Canvas/Cold").active = true;
                                    cc.find("Canvas/Hot").active = true;
                                    cc.find("Canvas/tempLabel").active = true;

                                    self.showHint(0, "Now click below button to select Colder or Hotter temperature for experiment, observe the change.");
                                }, false);
                            }
                        }, this);
    
                        var animState = this.red_diffAniComponent.play("redDiffAni");
                    }
                }
                else {
                    this.coinAnimation(-1);
                    player.updateCoins(-50);

                    this.changeHint();
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
                }
            }
            else {
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 

                this.changeHint();
            }           
        }

        if (mClass == 'b') {
            this.coinAnimation(-1);
            player.updateCoins(-50);

            this.changeHint();
            insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
        }
    },

    afterBacking: function(code, mClass) {
        var materialNodePath = 'Canvas/materialBackground/m' + code.toString() + 'Button';
        var isOwnedNode = cc.find((materialNodePath + '/isOwned'));
        isOwnedNode.getComponent(cc.Sprite).setState(0);

        var player = cc.find('player').getComponent('Player');

        player.updateInventory('diff', 'takeback', code, mClass);

        if (mClass == 'a') {
            var nodePath = 'Canvas/container/c' + code.toString();
            var containerNode = cc.find(nodePath);
            containerNode.active = false;
            if (code == 1) {
                this.progressBar.progress -= 0.5;
            }
        }
    },

    checkMaterial: function() {
        var player = cc.find('player').getComponent('Player');
        
        for (var i of player.diffMaterialOwned) {
            this.setMaterialOwned(i);
        }

        for (var i of player.diffMaterialUsed) {
            this.setMaterialUsed(i);
        }
    },

    setMaterialOwned: function(code) {
        var materialNodePath = 'Canvas/materialBackground/m' + code.toString() + 'Button';
        var isOwnedNode = cc.find((materialNodePath + '/isOwned'));
        //isOwnedNode.active = true;
    },

    setMaterialUsed: function(code) {
        var materialNodePath = 'Canvas/materialBackground/m' + code.toString() + 'Button';
        var isOwnedNode = cc.find((materialNodePath + '/isOwned'));
        isOwnedNode.active = true;
        isOwnedNode.getComponent(cc.Sprite).setMaterial(1);
    },

    checkCoinEnough: function(cost) {
        var tempCoins = G.user.coins - cost;
        if (tempCoins >= 0){
            return true;
        }else{
            insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "bankrupt", "na", "na", 0, G.user.coins, G.itemsState);
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
                if(G.user.coins <= 0 && G.isDiffDone == false){
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
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "back", "na", "na", 0, G.user.coins, G.itemsState);
        //cc.director.loadScene("LevelMap");
        cc.director.loadScene("CardStudy");
	},

    resetScene: function () {
        G.globalSocket.removeAllListeners("diffusion");
        G.globalSocket.removeAllListeners("command");
        var player = cc.find('player').getComponent('Player');
        player.updateInventory('diff', 'clear', 0);
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "reset", "na", "na", 0, G.user.coins, G.itemsState);
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
        /*
        if (this.showCount >= 150){
            this.isShowCongra = false;
            this.showCount = 0;
            //cc.find("Canvas/singleColor").active = false;
            //cc.find("Canvas/congraluation").active = false;
        }else if (this.showCount < 150 && this.isShowCongra == true) {
            this.showCount++;
        }*/
    },
});
