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

        this.resetToOriPos();
        this.floatingAction();
        this.setMolecueStatus(false);
        this.hintLabel.string = "现在点击叶绿体，了解一下它吧！";
    },

    pressYelvti: function(){
        cc.find("Canvas/yelvtiButton/Background").stopAllActions();
        Alert.show(1.3, "叶绿体", "叶绿体是含有绿色色素(比如：叶绿素)的质体，是绿色植物进行光合作用的场所，是植物的能量转换器。光合作用是叶绿体吸收光能，利用简单的无机物制造有机物的过程。", null, false);
        this.setMolecueStatus(true);
        this.hintLabel.string = "现在通过点击漂浮的小分子，选择光合作用所需要的原料吧";
    },

    readyToMake: function(event, btnName){
        this.hintLabel.string = "先点击选择光合作用需要的所有原料，然后再点击开始合成。";
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
            this.hintLabel.string = "正在进行光合作用";
            this.binReady = 0b0000;
            cc.find("Canvas/walkingButton").active = false;
            cc.find('Canvas/lighting').active = true;
            var finished = cc.callFunc(function(){
                cc.find('Canvas/lighting').active = false;
                cc.find("Canvas/co2inside").runAction(cc.fadeOut(1.8));
                cc.find("Canvas/h2oinside").runAction(cc.fadeOut(1.8));

                var finished4 = cc.callFunc(function(){
                    this.hintLabel.string = "光合作用生产出了氧气和有机物。点击开始答题让我们做个小测试吧!";
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
            Alert.show(1, "原料选择错误", "你选择了错误的光合作用原料组合，请重新选择！", function(){
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
            this.questionLabel.string = "问题：关于植物的光合作用，下列说法错误的是？";
            this.qanswer1Label.string = "光合作用使无机物转化成有机物，释放出氧";
            this.qanswer2Label.string = "光合作用储存在有机物中的能量来自于叶绿体";
            this.qanswer3Label.string = "光合作用为地球上的生物提供了氧气";
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
            this.qhintLabel.string = "";
            this.qanswer = 2;
            this.userAnswerChoice = 0;
        }else if(this.qorder == 1){
            this.questionLabel.string = "问题：光合作用储存在有机物中的能量来自？";
            this.qanswer1Label.string = "水";
            this.qanswer2Label.string = "氧气";
            this.qanswer3Label.string = "光";
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
            this.qhintLabel.string = "恭喜你答对了";
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
                    self.hintLabel.string = "点击运输有机物按钮，来帮忙运输刚刚生成的有机物吧，然后回到地面吧";
                }, 1200);
            }
        }
        else if (this.userAnswerChoice == 0) {
            this.qhintLabel.string = "请选择一个答案";
            cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
        } else {
            this.coinAnimation(-1);
            player.updateCoins(-50);
            this.qhintLabel.string = "选择错误，重新选择一个答案吧！";
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
