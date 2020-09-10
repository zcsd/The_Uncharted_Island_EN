cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        coinLabel: cc.Label,
        hintLabel: cc.Label,
        avatarSprite: cc.Sprite,

        coinRotate: cc.Node,
        coinShine: cc.Node,
        coinBlink: cc.Node,

        mask: cc.Node,

        binReady: 0b0000,

        questionLabel: cc.Label,
        qhintLabel: cc.Label,
        qanswer1Label: cc.Label,
        qanswer2Label: cc.Label,
        qanswer3Label: cc.Label,
        qanswer: 0,
        userAnswerChoice: 0, // user choice
 
        qorder: 0,
        qtotal: 2,
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

        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(0.8, 0.93, 0.93), cc.scaleTo(1, 1, 1)));
        cc.find("Canvas/yelvtiButton/Background").runAction(seq);

        KT.lastScene = 'SaveBananaTree03';

        this.resetToOriPos();
        this.floatingAction();
        this.setMolecueStatus(false);
        this.showHint(0, "Please click chloroplast to know more about it.");
        //this.hintLabel.string = "Please click chloroplast to know more about it.";
    },

    showHint: function(method, content) {
        //method: how to show hint content
        //        0 - default
        //        1 - popup window
        //        2 - speech T2S
        if(method == 0){
            cc.find("Canvas/hintLabel").active = true;
            this.hintLabel.string = content;
            var blink = cc.blink(2, 2);
            this.hintLabel.node.runAction(blink);   
        }else if (method == 1){
            cc.find("Canvas/hintLabel").active = false;
        }else if(method == 2){
            console.log('22');
        }
    },

    pressYelvti: function(){
        cc.find("Canvas/yelvtiButton/Background").stopAllActions();
        Alert.show(1.3, "Chloroplast", "The chloroplast, is a cell organelle that produces energy through photosynthesis, the process by which light energy is converted to chemical energy, resulting in the production of oxygen and energy-rich organic compounds.", null, false);
        this.setMolecueStatus(true);
        this.showHint(0, "Please click the floating molecules, to choose all suitable materials that photosynthesis need.");
        //this.hintLabel.string = "Please click the floating molecules, to choose all suitable materials that photosynthesis need.";
    },

    readyToMake: function(event, btnName){
        this.showHint(0, "Click to choose all suitable materials that photosynthesis need, then click 'Produce' button.");
        //this.hintLabel.string = "Click to choose all suitable materials that photosynthesis need, then click 'Produce' button.";
        cc.find("Canvas/walkingButton").active = true;
        if (btnName.includes('co2')){
            this.binReady = this.binReady | 0b1000;
            cc.log('co2 is selected');
            cc.find(btnName).stopAllActions();
            var finished0 = cc.callFunc(function(){
                cc.find(btnName).active = false;
                cc.find("Canvas/co2inside").active = true;
            }, this)
            var seq0 = cc.sequence(cc.moveTo(1.2, -65, -10), finished0)
            cc.find(btnName).runAction(seq0);
        }else if (btnName.includes('h2o')){
            this.binReady = this.binReady | 0b0100;
            cc.log('h2o is selected');
            cc.find(btnName).stopAllActions();
            var finished1 = cc.callFunc(function(){
                cc.find(btnName).active = false;
                cc.find("Canvas/h2oinside").active = true;
            }, this);
            var seq1 = cc.sequence(cc.moveTo(1.2, 55, 0), finished1);
            cc.find(btnName).runAction(seq1);
        }else if (btnName.includes('o2')){
            this.binReady = this.binReady | 0b0010;
            cc.log('o2 is selected');
            cc.find(btnName).stopAllActions();
            var finished2 = cc.callFunc(function(){
                cc.find(btnName).active = false;
                cc.find("Canvas/o2inside").active = true;
            }, this);
            var seq2 = cc.sequence(cc.moveTo(1.2, -10, -70), finished2);
            cc.find(btnName).runAction(seq2);
        }else if (btnName.includes('salt')){
            this.binReady = this.binReady | 0b0001;
            cc.log('salt is selected');
            cc.find(btnName).stopAllActions();
            var finished3 = cc.callFunc(function(){
                cc.find(btnName).active = false;
                cc.find("Canvas/minsaltinside").active = true;
            }, this);
            var seq3 = cc.sequence(cc.moveTo(1.2, -10, 40), finished3);
            cc.find(btnName).runAction(seq3);
        }
    },

    pressToMake: function() {
        var player = cc.find('player').getComponent('Player');

        if ((this.binReady & 0b1111) == 0b1100) {
            this.coinAnimation(1);
            player.updateCoins(100);
            console.log("光合作用选择材料正确");
            this.showHint(0, "Photosynthesis is processing...");
            //this.hintLabel.string = "Photosynthesis is processing...";
            this.binReady = 0b0000;
            cc.find("Canvas/walkingButton").active = false;
            cc.find('Canvas/lighting').active = true;
            var finished = cc.callFunc(function(){
                cc.find('Canvas/lighting').active = false;
                cc.find("Canvas/co2inside").runAction(cc.fadeOut(1.8));
                cc.find("Canvas/h2oinside").runAction(cc.fadeOut(1.8));

                var finished4 = cc.callFunc(function(){
                    this.showHint(0, "Photosynthesis produced oxygen and organic. Click 'start quiz' button to do a test.");
                    //this.hintLabel.string = "Photosynthesis produced oxygen and organic. Click 'start quiz' button to do a test.";
                    cc.find('Canvas/goToQuizButton').active = true;
                    var seq5 = cc.repeatForever(cc.sequence(cc.moveBy(2.0, cc.v2(-8,6)), cc.moveBy(1.8, cc.v2(8, -6))));
                    var seq6 = cc.repeatForever(cc.sequence(cc.moveBy(1.6, cc.v2(5,6)), cc.moveBy(1.8, cc.v2(-5, -6))));
                    var seq7 = cc.repeatForever(cc.sequence(cc.moveBy(1.7, cc.v2(7,-6)), cc.moveBy(1.9, cc.v2(-7, 6))));
                    var seq8 = cc.repeatForever(cc.sequence(cc.moveBy(2.0, cc.v2(-6,-6)), cc.moveBy(1.7, cc.v2(6, 6))));
                    cc.find('Canvas/yangfen').runAction(seq5);
                    cc.find('Canvas/yangfen2').runAction(seq6);
                    cc.find('Canvas/o2make').runAction(seq7);
                    cc.find('Canvas/o2make2').runAction(seq8);
                }, this);
                var seq4 = cc.sequence(cc.fadeIn(2.5), cc.moveTo(1.3, 205, 55), finished4)
                cc.find('Canvas/yangfen').runAction(seq4);
                cc.find('Canvas/yangfen2').runAction(cc.sequence(cc.fadeIn(2.5), cc.moveTo(1.3, 160, 130)));
                cc.find('Canvas/o2make').runAction(cc.sequence(cc.fadeIn(2.5), cc.moveTo(1.3, 230, -80)));
                cc.find('Canvas/o2make2').runAction(cc.sequence(cc.fadeIn(2.5), cc.moveTo(1.3, 245, -22)));
            }, this);
            var seq = cc.sequence(cc.blink(3, 8), finished);
            cc.find('Canvas/lighting').runAction(seq);
        }else{
            console.log("光合作用选择材料错误");
            this.coinAnimation(-1);
            player.updateCoins(-50);
            this.binReady = 0b0000;
            cc.find("Canvas/walkingButton").active = false;
            self = this;
            Alert.show(1, "Material Error", "You choose wrong materials for photosynthesis, please choose again.", function(){
                cc.find("Canvas/co2inside").active = false;
                cc.find("Canvas/h2oinside").active = false;
                cc.find("Canvas/o2inside").active = false;
                cc.find("Canvas/minsaltinside").active = false;
                self.resetToOriPos();
                self.floatingAction();
            }, false);
        }
    },
    
    goToQuiz: function(){
        cc.find("Canvas/goToQuizButton").active = false;
        cc.find("Canvas/questionAlert").active = true;
        cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
        
        if(this.qorder == 0){
            this.questionLabel.string = "Question: Which of the following is wrong regarding the photosynthesis?";
            this.qanswer1Label.string = "Photosynthesis produce oxygen and organic using inorganic.";
            this.qanswer2Label.string = "The energy that store in organic produced in photosynthesis is from chloroplast.";
            this.qanswer3Label.string = "Photosynthesis provide the most oxygen for animals in earth.";
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
            this.qhintLabel.string = "";
            this.qanswer = 2;
            this.userAnswerChoice = 0;
        }else if(this.qorder == 1){
            this.questionLabel.string = "Question: The energy that store in organic produced in photosynthesis is from ( )";
            this.qanswer1Label.string = "water";
            this.qanswer2Label.string = "carbon dioxide";
            this.qanswer3Label.string = "light";
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
            this.qhintLabel.string = "";
            this.qanswer = 3;
            this.userAnswerChoice = 0;
        }
    },

    changeAnswer: function (event, customEventData) {
        this.userAnswerChoice = event.node._name.replace('toggle', '');
    },

    submitQAnswer: function(){
        var player = cc.find('player').getComponent('Player');
        
        if (this.userAnswerChoice == this.qanswer) {
            cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = false;
            this.qhintLabel.string = "Congratulations, it's correct.";
            this.coinAnimation(1);
            player.updateCoins(50);
            self = this;
            this.qorder += 1;
            if(this.qorder < this.qtotal ){
                setTimeout(function(){
                    self.goToQuiz();
                }, 800);
            }else{
                setTimeout(function(){
                    cc.find("Canvas/questionAlert").active = false;
                    cc.find("Canvas/goToQuizButton").active = false;
                    cc.find("Canvas/goToNextScene").active = true;
                    self.showHint(0, "Click 'Transport Organic' button to continue, then go back to the ground.");
                    //self.hintLabel.string = "Click 'Transport Organic' button to continue, then go back to the ground.";
                }, 1200);
            }
        }
        else if (this.userAnswerChoice == 0) {
            this.qhintLabel.string = "Please choose one answer.";
            cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
        } else {
            this.coinAnimation(-1);
            player.updateCoins(-50);
            this.qhintLabel.string = "Wrong choice, please choose again.";
            cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
        }
    },

    goToNextScene: function() {
        cc.director.loadScene("SaveBananaTree04");
    },

    resetToOriPos: function (){
        cc.find("Canvas/minsaltBtn").active = true;
        cc.find("Canvas/minsalt1Btn").active = true;
        cc.find("Canvas/minsalt2btn").active = true;
        cc.find("Canvas/minsalt3btn").active = true;
        cc.find("Canvas/h2obtn").active = true;
        cc.find("Canvas/h2o1btn").active = true;
        cc.find("Canvas/h2o2btn").active = true;
        cc.find("Canvas/co2btn").active = true;
        cc.find("Canvas/co2_1btn").active = true;
        cc.find("Canvas/co2_2btn").active = true;
        cc.find("Canvas/o2btn").active = true;
        cc.find("Canvas/o2_1btn").active = true;

        cc.find("Canvas/minsaltBtn").setPosition(this.getRdmInt(-490, -420), this.getRdmInt(0, 60));
        cc.find("Canvas/minsalt1Btn").setPosition(this.getRdmInt(300, 360), this.getRdmInt(100, 160));
        cc.find("Canvas/minsalt2btn").setPosition(this.getRdmInt(220, 280), this.getRdmInt(-180, -120));
        cc.find("Canvas/minsalt3btn").setPosition(this.getRdmInt(-480,-430), this.getRdmInt(-290, -230));
        cc.find("Canvas/h2obtn").setPosition(this.getRdmInt(500, 560), this.getRdmInt(10, 60));
        cc.find("Canvas/h2o1btn").setPosition(this.getRdmInt(-570, -510), this.getRdmInt(40, 100));
        cc.find("Canvas/h2o2btn").setPosition(this.getRdmInt(-480, -430), this.getRdmInt(-110, -60));
        cc.find("Canvas/co2btn").setPosition(this.getRdmInt(-580, -520), this.getRdmInt(-180, -120));
        cc.find("Canvas/co2_1btn").setPosition(this.getRdmInt(420, 480), this.getRdmInt(130, 190));
        cc.find("Canvas/co2_2btn").setPosition(this.getRdmInt(-360, -300), this.getRdmInt(130, 190));
        cc.find("Canvas/o2btn").setPosition(this.getRdmInt(-400, -340), this.getRdmInt(-250, -190));
        cc.find("Canvas/o2_1btn").setPosition(this.getRdmInt(200, 260), this.getRdmInt(220, 280));
    },

    floatingAction: function(){
        var moveSeq = cc.repeatForever(cc.sequence(cc.moveBy(2.3, cc.v2(-12,9)), cc.moveBy(1.8, cc.v2(12, -9))));
        var moveSeq1 = cc.repeatForever(cc.sequence(cc.moveBy(1.9, cc.v2(11, 8)), cc.moveBy(1.6, cc.v2(-11, -8))));
        var moveSeq2 = cc.repeatForever(cc.sequence(cc.moveBy(2.1, cc.v2(10,-11)), cc.moveBy(2.1, cc.v2(-10, 11))));
        var moveSeq3 = cc.repeatForever(cc.sequence(cc.moveBy(1.6, cc.v2(-9,12)), cc.moveBy(1.7, cc.v2(9, -12))));
        var moveSeq4 = cc.repeatForever(cc.sequence(cc.moveBy(2, cc.v2(-11,-10)), cc.moveBy(1.7, cc.v2(11, 10))));
        var moveSeq5 = cc.repeatForever(cc.sequence(cc.moveBy(2.2, cc.v2(12, 8)), cc.moveBy(2, cc.v2(-12, -8))));
        var moveSeq6 = cc.repeatForever(cc.sequence(cc.moveBy(1.7, cc.v2(-9, 12)), cc.moveBy(1.5, cc.v2(9, -12))));
        
        var moveSeq7 = cc.repeatForever(cc.sequence(cc.moveBy(2.3, cc.v2(-12,9)), cc.moveBy(1.8, cc.v2(12, -9))));
        var moveSeq8 = cc.repeatForever(cc.sequence(cc.moveBy(1.9, cc.v2(-11, -8)), cc.moveBy(1.6, cc.v2(11, 8))));
        var moveSeq9 = cc.repeatForever(cc.sequence(cc.moveBy(2.1, cc.v2(10,-11)), cc.moveBy(2.1, cc.v2(-10, 11))));
        var moveSeq10 = cc.repeatForever(cc.sequence(cc.moveBy(1.6, cc.v2(11,-10)), cc.moveBy(1.7, cc.v2(-11, 10))));
        var moveSeq11 = cc.repeatForever(cc.sequence(cc.moveBy(2, cc.v2(-11,10)), cc.moveBy(1.7, cc.v2(11, -10))));
        
        cc.find("Canvas/minsaltBtn").runAction(moveSeq);
        cc.find("Canvas/minsalt1Btn").runAction(moveSeq1);
        cc.find("Canvas/minsalt2btn").runAction(moveSeq2);
        cc.find("Canvas/minsalt3btn").runAction(moveSeq3);
        cc.find("Canvas/h2obtn").runAction(moveSeq4);
        cc.find("Canvas/h2o1btn").runAction(moveSeq5);
        cc.find("Canvas/h2o2btn").runAction(moveSeq6);

        cc.find("Canvas/co2btn").runAction(moveSeq7);
        cc.find("Canvas/co2_1btn").runAction(moveSeq8);
        cc.find("Canvas/co2_2btn").runAction(moveSeq9);
        cc.find("Canvas/o2btn").runAction(moveSeq10);
        cc.find("Canvas/o2_1btn").runAction(moveSeq11);
    },

    setMolecueStatus: function(status) {
        cc.find('Canvas/minsaltBtn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/minsalt1Btn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/minsalt2btn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/minsalt3btn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/h2obtn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/h2o1btn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/h2o2btn').getComponent(cc.Button).interactable = status;
        cc.find("Canvas/co2btn").getComponent(cc.Button).interactable = status;
        cc.find("Canvas/co2_1btn").getComponent(cc.Button).interactable = status;
        cc.find("Canvas/co2_2btn").getComponent(cc.Button).interactable = status;
        cc.find("Canvas/o2btn").getComponent(cc.Button).interactable = status;
        cc.find("Canvas/o2_1btn").getComponent(cc.Button).interactable = status;
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
            }, this);
            coinRotComponent.play("coinRotAni");
        }else if(type == -1){
            cc.find("Canvas/coinShine").active = true;
            var coinShnComponent = this.coinShine.getComponent(cc.Animation);
            coinShnComponent.on('finished', function(){
                cc.find("Canvas/coinShine").active = false;
                cc.find("Canvas/coin").active = true;
                this.coinLabel.string = G.user.coins.toString();
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

    getRdmInt: function(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

    start () {

    },

    update: function (dt) {},
});
