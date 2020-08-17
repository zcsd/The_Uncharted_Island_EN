cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        coinLabel: cc.Label,
        avatarSprite: cc.Sprite,
        standSprite: cc.Sprite,
        pressAni: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;
        this.coinLabel.string = player.coinsOwned.toString();

        if (G.user.coins > 50) {
            G.isQuizOpen = false;
        }
        else {
            G.isQuizOpen = true;
        }

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir, cc.SpriteFrame, function (err, spriteFrame) {
            self.standSprite.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });
        
        if(G.isNewUser){
            Alert.show(1.4, "Welcome to Uncharted Island", "There are three levels in game, you can learn the knowledge about plant transporatation system. Please start from diffusion lab, click the icon to start game.", null, false);
        }

        KT.lastScene = 'LevelMap';
        
        //socket, username, sequenceID, stage, actionType, operatedItem, rewardType, rewardQty, totalCoins
        //insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "levelmap", "system", "na", "na", 0, G.user.coins);
        G.isNewUser = false;
        this.levelAnimation();
        this.pressQuizAnimation();
    },

    start () {

    },

    levelAnimation: function () {
        var levelNode = null;
        if(!G.isDiffDone){
            levelNode = "Canvas/diffButton/Background";
            cc.find('Canvas/diffButton').getComponent(cc.Button).interactable = true;
            cc.find('Canvas/osButton').getComponent(cc.Button).interactable = true; //edit here
            cc.find('Canvas/bananaButton').getComponent(cc.Button).interactable = true;//edit here
        }else if (!G.isOsmoDone){
            cc.find("Canvas/diffButton/done").active = true;
            cc.find('Canvas/osButton').getComponent(cc.Button).interactable = true;
            levelNode = "Canvas/osButton/Background";
        }else if(!G.isBanaDone){
            cc.find('Canvas/bananaButton').getComponent(cc.Button).interactable = true;
            cc.find("Canvas/diffButton/done").active = true;
            cc.find("Canvas/osButton/done").active = true;
            levelNode = "Canvas/bananaButton/Background";
        }else{
            cc.find("Canvas/diffButton/done").active = true;
            cc.find("Canvas/osButton/done").active = true;
            cc.find("Canvas/bananaButton/done").active = true;
        }
        
        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(1.3, 0.9), cc.scaleTo(1.3, 1)));
        cc.find(levelNode).runAction(seq);

        var sunSeq = cc.repeatForever(cc.sequence(cc.moveBy(2, cc.v2(-9, -5)), cc.moveBy(2, cc.v2(9, 5))));
        cc.find("Canvas/cloudsSunBg").runAction(sunSeq);
    },

    pressQuizAnimation: function(){
        if(G.isQuizOpen){
            cc.find("Canvas/pressAni").active = true;
            var pressQuizComponent = this.pressAni.getComponent(cc.Animation);
            pressQuizComponent.on('finished', function(){
                cc.find("Canvas/pressAni").active = false;
                cc.find('Canvas/quizButton').getComponent(cc.Button).interactable = true;
                var quizSeq = cc.repeatForever(cc.sequence(cc.scaleTo(1.4, 0.68), cc.scaleTo(1.4, 0.72)));
                cc.find('Canvas/quizButton').runAction(quizSeq);
            }, this);
            pressQuizComponent.play("pressAni");
        }else{
            cc.find('Canvas/quizButton').getComponent(cc.Button).interactable = false;
        }
    },

    goToKtScene: function () {
        cc.director.loadScene("KnowledgeTree");
    },

    goToDiffScene: function () {
        cc.director.loadScene("DoDiffusionTest");
    },

    goToOsmosisScene: function () {
        var player = cc.find('player').getComponent('Player');
        
        // force coins to 250 for osmosis
        /*
        if(!G.isOsmoDone && !G.isOsmoEnter){
            player.coinsOwned = 250;
            G.user.coins = player.coinsOwned;
        }
        */
        cc.director.loadScene("DoOsmosisTest");
    },

    goToBananaScene: function () {
        cc.director.loadScene("SaveBananaTree");
    },

    goToQuizScene: function () {
        cc.director.loadScene("DoQuiz");
    },
    /*
    update: function (dt) {
    },*/
});
