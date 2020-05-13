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
        Alert.show(1.3, "叶绿体", "叶绿体是含有绿色色素的质体，是绿色植物进行光合作用的场所，是植物的能量转换器。光合作用是叶绿体吸收光能，利用简单的无机物制造有机物的过程。", null, false);
        this.setMolecueStatus(true);
        this.hintLabel.string = "现在通过点击漂浮的无机物，选择光合作用所需要的原料吧";
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
        if ((this.binReady & 0b1111) == 0b1100) {
            console.log("光合作用选择材料正确");
            this.hintLabel.string = "正在进行光合作用";
            this.binReady = 0b0000;
            cc.find("Canvas/walkingButton").active = false;
            cc.find('Canvas/lighting').active = true;
            var finished = cc.callFunc(function(){
                this.hintLabel.string = "光合作用完成，生产出了氧气和有机物";
                cc.find('Canvas/lighting').active = false;
                cc.find("Canvas/co2inside").runAction(cc.fadeOut(1.3));
                cc.find("Canvas/h2oinside").runAction(cc.fadeOut(1.3));
                cc.find('Canvas/yangfen').runAction(cc.fadeIn(2.2));
                cc.find('Canvas/yangfen2').runAction(cc.fadeIn(2.2));
                cc.find('Canvas/o2make').runAction(cc.fadeIn(2.2));
                cc.find('Canvas/o2make2').runAction(cc.fadeIn(2.2));
            }, this);
            var seq = cc.sequence(cc.blink(2.5, 8), finished);
            cc.find('Canvas/lighting').runAction(seq);
        }else{
            console.log("光合作用选择材料错误");
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
/*
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
*/
    start () {

    },

    update: function (dt) {},
});
