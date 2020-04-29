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

        binRead: 0b000, //how many holes read
        numCollect: 0,
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

        //Alert.show(1.4, "xxx", "xxx。", null, false);
        this.setMolecueStatus(false);

        this.floatingAction();
    },

    selectFreeDiff: function(){
        console.log("自由扩散");
        Alert.show(1.3, "自由扩散", "自由扩散是小分子物质从浓度高的一侧通过细胞膜向浓度低的一侧转运，不需要载体，不需要消耗能量，属于被动运输的一种，是最简单的运输方式之一。", null, false);

        cc.find("Canvas/freeDiffHole/Background").stopAllActions();

        if ((this.binRead & 0b001) == 0b000) {
            this.binRead = this.binRead | 0b001;
        }
        console.log(this.binRead);
        if((this.binRead & 0b111) == 0b111) {
            this.setMolecueStatus(true);
        }
    },

    selectFaciDiff: function(){
        console.log("协助扩散");
        Alert.show(1.3, "协助扩散", "协助扩散也称促进扩散，是大分子物质从浓度高的一侧通过细胞膜上的特殊载体向浓度低的一侧转运，不需要消耗能量，属于被动运输的一种。", null, false);
        
        cc.find("Canvas/faciDiffHole/Background").stopAllActions();

        if ((this.binRead & 0b010) == 0b000) {
            this.binRead = this.binRead | 0b010;
        }
        console.log(this.binRead);
        if((this.binRead & 0b111) == 0b111) {
            this.setMolecueStatus(true);
        }
    },

    selectActTran: function(){
        console.log("主动运输");
        Alert.show(1.3, "主动运输", "主动运输是物质从浓度低的一侧通过细胞膜上的特殊载体向浓度高的一侧转运, 需要消耗能量，常见的有钠离子钾离子进出细胞膜。", null, false);
        
        cc.find("Canvas/actTranHole/Background").stopAllActions();
        
        if ((this.binRead & 0b100) == 0b000) {
            this.binRead = this.binRead | 0b100;
        }
        console.log(this.binRead);
        if((this.binRead & 0b111) == 0b111) {
            this.setMolecueStatus(true);
        }
    },

    collectMolecues: function(event, btnName) {
        this.hintLabel.string = "开始点击水分子和无机盐来收集它们吧，植物生长需要它们。";
        cc.find(btnName).active = false;
        cc.find(btnName).getComponent(cc.Button).interactable = false;
        cc.find("Canvas/collectBox").active = true;
        if(btnName.includes("salt")){
            cc.find("Canvas/minSaltOwned").active = true;
            var seq = cc.sequence(cc.scaleBy(0.5, 1.2), cc.scaleBy(0.5, 0.833), cc.scaleBy(0.5, 1.11));
            cc.find("Canvas/minSaltOwned").runAction(seq);
        }else if(btnName.includes("h2o")){
            cc.find("Canvas/h2oOwned").active = true;
            var seq = cc.sequence(cc.scaleBy(0.5, 1.2), cc.scaleBy(0.5, 0.833), cc.scaleBy(0.5, 1.11));
            cc.find("Canvas/h2oOwned").runAction(seq);
        }
        this.numCollect += 1;
        if(this.numCollect >= 7 ){
            this.hintLabel.string = "收集完成，现在带着水和无机盐准备进入根毛里面吧!";
        }
    },

    floatingAction: function(){
        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(1, 0.95, 0.95).easing(cc.easeBounceInOut(3.0)), cc.scaleTo(1, 1, 1).easing(cc.easeBounceInOut(3.0))));
        var seq1 = cc.repeatForever(cc.sequence(cc.scaleTo(1.5, 0.95, 0.95).easing(cc.easeCircleActionIn(3.0)), cc.scaleTo(1.5, 1, 1).easing(cc.easeCircleActionIn(3.0))));
        var seq2 = cc.repeatForever(cc.sequence(cc.scaleTo(1.2, 0.95, 0.95).easing(cc.easeQuarticActionIn(3.0)), cc.scaleTo(1.2, 1, 1).easing(cc.easeQuarticActionIn(3.0))));
        cc.find("Canvas/freeDiffHole/Background").runAction(seq);
        cc.find("Canvas/faciDiffHole/Background").runAction(seq1);
        cc.find("Canvas/actTranHole/Background").runAction(seq2);

        var moveSeq = cc.repeatForever(cc.sequence(cc.moveBy(2.3, cc.v2(-12,9)), cc.moveBy(1.8, cc.v2(12, -9))));
        var moveSeq1 = cc.repeatForever(cc.sequence(cc.moveBy(1.9, cc.v2(11, 8)), cc.moveBy(1.6, cc.v2(-11, -8))));
        var moveSeq2 = cc.repeatForever(cc.sequence(cc.moveBy(2.1, cc.v2(10,-11)), cc.moveBy(2.1, cc.v2(-10, 11))));
        var moveSeq3 = cc.repeatForever(cc.sequence(cc.moveBy(1.6, cc.v2(-9,12)), cc.moveBy(1.7, cc.v2(9, -12))));
        var moveSeq4 = cc.repeatForever(cc.sequence(cc.moveBy(2, cc.v2(-11,-10)), cc.moveBy(1.7, cc.v2(11, 10))));
        var moveSeq5 = cc.repeatForever(cc.sequence(cc.moveBy(2.2, cc.v2(12, 8)), cc.moveBy(2, cc.v2(-12, -8))));
        var moveSeq6 = cc.repeatForever(cc.sequence(cc.moveBy(1.7, cc.v2(-9, 12)), cc.moveBy(1.5, cc.v2(9, -12))));
        
        cc.find("Canvas/minsaltBtn").runAction(moveSeq);
        cc.find("Canvas/minsalt1Btn").runAction(moveSeq1);
        cc.find("Canvas/minsalt2btn").runAction(moveSeq2);
        cc.find("Canvas/minsalt3btn").runAction(moveSeq3);
        cc.find("Canvas/h2obtn").runAction(moveSeq4);
        cc.find("Canvas/h2o1btn").runAction(moveSeq5);
        cc.find("Canvas/h2o2btn").runAction(moveSeq6);
    },

    setMolecueStatus: function(status) {
        console.log('fss');
        cc.find('Canvas/minsaltBtn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/minsalt1Btn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/minsalt2btn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/minsalt3btn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/h2obtn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/h2o1btn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/h2o2btn').getComponent(cc.Button).interactable = status;
    },

    backToMapScene: function () {
        cc.director.loadScene("LevelMap");
    },

    start () {

    },

    update: function (dt) {},
});
