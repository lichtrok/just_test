var validateAccessForm = (function (){
    this._formName = '';
    this._tipText = '';
    this._inputText = '';
    this._Tags = new Array();
    this._default_msg = '*필수입력사항입니다.';
    obj = this;
    data = {};

    toolMsg = new Map();
    //"영어, 숫자만 입력가능"
    toolMsg.set("personid", "영어, 숫자만 입력가능");
    toolMsg.set("password", "영어, 숫자, 허용된 특수기호만 입력가능");
    toolMsg.set("email", "ex)example@test.com");

    regMap = new Map();
    regMap.set(1, "([a-zA-Z0-9]{5,12}");
    regMap.set(2, "[a-zA-Z0-9_]");
    regMap.set(3, "[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$");
    /**
     * @argument {String} value - form's ID  
     * @constructor 
     * */
    setFormName = function (value) {
        this._formName = value;
    },
    setDiv = function (value) {
        var form = $("#" + this._formName);
        this._tipText = value + 'Text';
        this._inputText = $(form).find('input[name="' + value + '"]');
        $(this._inputText).wrap('<div class="tipBox"><div>');
        if (!$("div." + value + "_esg").length) {
            $(this._inputText).after('<div class="' + value + '_esg" >' + this._default_msg + '</div>');
        }
        $(this._inputText).after('<div class="tipText" name="' + this._tipText + '">' + toolMsg.get(value) + '</div>');

        /**툴팁이 움직일 수 있도록**/
        $(this._inputText).focusin(function () {
            $('div[name="' + value + 'Text"]').show();
        });
    },
    setRex = function (rex) { //어떤 패턴을 사용할 건지 
        var type = typeof rex;
        if (type == 'string') {
            return rex;
        }
        if (type == 'number') {
            return regMap.get(rex);
        }
    },
    /**
     *@argument {String} value - inputtag_NAME;
     *@argument {number} rex - number regex pattern user already
     *@argument {String} rex - create Regex pattern D.I.Y.
     *@argument {String} option - R inputtag value check null
     *@function
     **/
    setForm = function (value, rex, option) {
        this.setDiv(value);
        obj._Tags.push(value);

        var chk = 'N';

        var funName = value + 'fn';
        if (option != '' && option != undefined) {
            chk = option;
        }
        var pattern = this.setRex(rex);

        $(this._inputText).blur(funName = function () {
            if ($(this).val() != '' && $(this).val() != undefined) {
                var inputCheck = new RegExp(pattern);
                if (inputCheck.test($(this).val())) {
                    $(this).css({"border": "1px solid green"});
                    $('div[name="' + value + 'Text"]').hide();
                    $("div." + value + "_esg").hide();
                } else {
                    $('div[name="' + value + 'Text"]').hide();
                    $(this).css({"border": "1px solid red"});
                    $("div." + value + "_esg").text('유효하지 않는 형식입니다.').css({"color": "red"});
                    $("div." + value + "_esg").show();
                }
            } else { // input type의 값이 널이 경우
                $('div[name="' + value + 'Text"]').hide();
                if (chk == 'N') {
                    $(this).css({"border": "1px solid #9ca3a9"});
                    $("div." + value + "_esg").hide();
                } else {
                    $(this).css({"border": "1px solid red"});
                    $("div." + value + "_esg").css({"color": "red"}).text('* 필수입력란 입니다.');
                    $("div." + value + "_esg").show();
                }
            }
        });
    },
    clear = function () {
        var len = obj._Tags.length;
        for (var i = 0; i < len; i++) {
            $('input[name="' + obj._Tags[i] + '"]').css({"border": "1px solid #9ca3a9"});
            $('div.' + obj._Tags[i] + '_esg').css({"color": "#9ca3a9"}).text(this._default_msg);
            $('div.' + obj._Tags[i] + '_esg').hide();
        }
    };
    return {
        "setFormName" : setFormName,
        "setDiv" : setDiv,
        "setRex" : setRex,
        "setForm" : setForm,
        "clear" : clear
    };
})();
