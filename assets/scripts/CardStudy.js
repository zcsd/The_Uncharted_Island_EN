cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        coinLabel: cc.Label,
        avatarSprite: cc.Sprite,
        contentLabel: cc.Label,
        questionLabel: cc.Label,
        typeLabel: cc.Label,
        correctAnswer: "0",
        userAnswer: "0",
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

        console.log(G.kgPoint.json["1"]["type"]);
        this.loadContent();
    },

    toNextContent: function (event, customData){
        cc.find("Canvas/contentBg/label1Bg").active = false;
        cc.find("Canvas/contentBg/label2Bg").active = false;
        cc.find("Canvas/contentBg/label3Bg").active = false;

        console.log(customData);
        this.loadContent();
    },

    loadContent: function (){
        G.lastKg += 1;
        var order = G.lastKg.toString();

        var type = G.kgPoint.json[order]["type"]
        this.typeLabel.string = type;
        
        var labels = G.kgPoint.json[order]["label"].split("_");

        var labelsLength = labels.length;
        var i;
        for(i = 0; i < labelsLength; i++){
            var nodeStr = "Canvas/contentBg/label" + (i+1).toString() + "Bg";
            console.log(nodeStr);
            cc.find(nodeStr).active = true;
            cc.find(nodeStr+"/label").getComponent(cc.Label).string = labels[i] ;
        }

        if (type == "Reading"){
            cc.find("Canvas/mcq").active = false;
            cc.find("Canvas/reading").active = true;
            this.contentLabel.string = G.kgPoint.json[order].content;
        }else if (type == "MCQ"){
            cc.find("Canvas/reading").active = false;
            cc.find("Canvas/mcq").active = true;
            this.userAnswer = "0";
            cc.find("Canvas/mcq/submitButton").getComponent(cc.Button).interactable = true;
            cc.find("Canvas/mcq/nextButton").active = false;
            cc.find("Canvas/mcq/nextButton").getComponent(cc.Button).interactable = false;
            cc.find("Canvas/mcq/hintLabel").getComponent(cc.Label).string = "";
            this.questionLabel.string = G.kgPoint.json[order].content;
            this.correctAnswer = G.kgPoint.json[order].answer;
            cc.find('Canvas/mcq/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/mcq/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/mcq/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
            cc.find("Canvas/mcq/answerToggleContainer/toggle1/answerLabel").getComponent(cc.Label).string = G.kgPoint.json[order]["option_1"];
            cc.find("Canvas/mcq/answerToggleContainer/toggle2/answerLabel").getComponent(cc.Label).string = G.kgPoint.json[order]["option_2"];
            cc.find("Canvas/mcq/answerToggleContainer/toggle3/answerLabel").getComponent(cc.Label).string = G.kgPoint.json[order]["option_3"];
        }

    },

    changeAnswer: function (event, customEventData) {
        this.userAnswer = event.node._name.replace('toggle', '');
    },

    submitMCQ: function(){
        var order = G.lastKg.toString();
        if (this.userAnswer == G.kgPoint.json[order]["answer"]) {
            console.log("答对了");
            cc.find("Canvas/mcq/hintLabel").getComponent(cc.Label).string = "This is the correct answer, please click next button to continue.";
            cc.find("Canvas/mcq/submitButton").getComponent(cc.Button).interactable = false;
            cc.find("Canvas/mcq/nextButton").active = true;
            cc.find("Canvas/mcq/nextButton").getComponent(cc.Button).interactable = true;
        }
        else if (this.userAnswer == 0) {
            Alert.show(1, "Hint", "Please choose an option.", null, false);
        } else {
            console.log("答错了");
            cc.find("Canvas/mcq/hintLabel").getComponent(cc.Label).string = "You select wrong answer, please try again.";
            cc.find("Canvas/mcq/submitButton").getComponent(cc.Button).interactable = true;
        }
    },

    goToEntryScene: function () {
        cc.director.loadScene("CardEntry");
    },

    goToCardStudyScene : function () {
        cc.director.loadScene("CardStudy");
    },

    goToKtScene: function () {
        cc.director.loadScene("KnowledgeTree");
    },

    goToDiffScene: function () {
        cc.director.loadScene("DoDiffusionTest");
    },

    goToOsmosisScene: function () {
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
