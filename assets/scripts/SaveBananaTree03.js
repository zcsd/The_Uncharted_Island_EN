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

        this.floatingAction();
        this.setMolecueStatus(false);
        this.hintLabel.string = "现在点击叶绿体，了解一下它吧！";
    },

    pressYelvti: function(){
        cc.find("Canvas/yelvtiButton/Background").stopAllActions();
        Alert.show(1.3, "叶绿体", "叶绿体是含有绿色色素的质体，是绿色植物进行光合作用的场所，是植物的能量转换器。光合作用是叶绿体吸收光能，利用简单的无机物制造有机物并且释放氧气的过程。", null, false);
        this.setMolecueStatus(true);
        this.hintLabel.string = "xxxx";
    },

    floatingAction: function(){
        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(0.8, 0.93, 0.93), cc.scaleTo(1, 1, 1)));
        cc.find("Canvas/yelvtiButton/Background").runAction(seq);

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
