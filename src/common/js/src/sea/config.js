/*
 * 配置文件

 case "0":
 case ""://返回箭头，背景白色，有标题，有分割线，右边无按钮(默认)
 case "1"://黑色圆返回按钮，背景透明，滑动后显示标题，无分割线，右边无按钮（影片详情）
 case "2"://返回箭头，背景白色，有标题，有分割线，右边有按钮
 case "3"://无返回箭头，左边显示"关闭",背景透明，无标题，无分割线，右边无按钮（登录页面）
 case "4"://只有中间标题
 case "5"://隐藏标题栏,滑动显示黑色圆返回按钮，标题
 case "6"://白色箭头返回按钮，背景透明，无分割线，右边无按钮(活动模块)
 
 * */
define(function(require, exports, module) {
    return {
        "r=default/city": {"title":"选择城市_default/city","style":"0"},
        "r=film/filmview": {"title":"_film/filmview","style":"1"},
        "r=film/cinema": {"title":"影院_film/cinema","style":"0"},
        "r=film/filmschedule": {"title":"loading..._film/filmschedule","style":"0"},
        "r=film/filmscheduleact": {"title":"loading..._film/filmscheduleact","style":"0"},
        "r=film/cinemaview": {"title":"_film/cinemaview","style":"1"},
        "r=film/movie": {"title":"loading..._film/movie","style":"0"},
        "r=film/seat": {"title":"loading..._film/seat","style":"0"},
        "r=meal/meal": {"title":"选择卖品套餐_meal/meal","style":"0"},
        "r=act/queue": {"title":"loading..._act/queue","style":"0"},
        "r=meal/mobile": {"title":"loading..._meal/mobile","style":"0"},
        "r=pay/payorder": {"title":"确认订单_pay/payorder","style":"0"},
        "r=pay/account": {"title":"海洋会员支付_pay/account","style":"0"},
        "r=userwallet/bindguicard": {"title":"绑定尊享卡_userwallet/bindguicard","style":"0"},
        "r=pay/bindmembercard": {"title":"绑定影城会员卡_pay/bindmembercard","style":"0"},
        "r=pay/membercard": {"title":"影城会员卡支付_pay/membercard","style":"0"},
        "r=pay/ticket": {"title":"电子券支付_pay/ticket","style":"0"},
        "r=pay/selectticket": {"title":"选择电子券_pay/selectticket","style":"2_确定"},
        "r=pay/coupon": {"title":"优惠券支付_pay/coupon","style":"0"},
        "r=pay/selectcoupon": {"title":"选择优惠券_pay/selectcoupon","style":"2_确定"},
        "r=pay/type": {"title":"订单支付_pay/type","style":"0"},
        "r=userwallet/seapaytype": {"title":"订单支付_pay/type","style":"0"},
        "r=pay/mobile": {"title":"移动话费支付_pay/mobile","style":"0"},
        "r=default/error": {"title": "加载错误_default/error","style":"0"},
        "r=act/list": {"title":"精彩活动_act/list","style":"0"},
        "r=act/remark": {"title":"活动说明_act/remark","style":"0"},

        "r=pay/result": {"title":"支付结果_pay/result","style":"4"},
        "r=userwallet/seavipcardpayresult": {"title":"支付结果_userwallet/seavipcardpayresult","style":"4"},
        "r=backchange/backresult": {"title":"退款结果_backchange/backresult","style":"4"},
        "r=order/order": {"title":"loading..._order/order","style":"0"},
        "r=order/orderdetails": {"title":"订单详情_order/orderdetails","style":"0"},
        "r=usermenu/mydata": {"title":"个人资料_usermenu/mydata","style":"0"},
        "r=usermenu/changemobile": {"title":"更换手机号_usermenu/changemobile","style":"0"},
        "r=userreview/getmyreview": {"title":"我的评论_userreview/getmyreview","style":"0"},
        "r=userreview/commentreview": {"title":"发表评论_userreview/commentreview","style":"0"},
        "r=usermenu/mywallet": {"title":"我的钱包_usermenu/mywallet","style":"0"},
        "r=userwallet/virtualmemberfill": {"title":"海洋会员充值_userwallet/virtualmemberfill","style":"0"},
        "r=pay/fillpaymobile": {"title":"移动话费支付_pay/fillpaymobile","style":"0"},
        "r=userwallet/bindcinemacard": {"title":"绑定影城会员卡_userwallet/bindcinemacard","style":"0"},
        "r=userwallet/myticket": {"title":"我的电子券_userwallet/myticket","style":"2_绑定"},
        "r=userwallet/ticketexplain": {"title":"电子券使用说明_userwallet/ticketexplain","style":"0"},
        "r=userwallet/ticketexplainused": {"title":"电子券使用说明_userwallet/ticketexplainused","style":"0"},
        "r=userwallet/bindticket": {"title":"电子券绑定_userwallet/bindticket","style":"0"},
        "r=userwallet/mycoupon": {"title":"我的优惠券_userwallet/mycoupon","style":"2_绑定"},
        "r=userwallet/mycouponexplainunused": {"title":"优惠券使用说明_userwallet/mycouponexplainunused","style":"0"},
        "r=userwallet/mycouponexplain": {"title":"优惠券使用说明_userwallet/mycouponexplain","style":"0"},
        "r=userwallet/bindcouponview": {"title":"优惠券绑定_userwallet/bindcouponview","style":"0"},
        "r=userset/feedback": {"title":"意见反馈_userset/feedback","style":"0"},
        "r=usermenu/setup": {"title":"设置_usermenu/setup","style":"0"},
        "r=userset/about": {"title":"关于幸福看_userset/about","style":"0"},
        "r=user/loginview": {"title":"_user/loginview","style":"3"},
        "r=user/forgotpass": {"title":"重置密码_user/forgotpass","style":"0"},
        "r=user/registerview": {"title":"_user/registerview","style":"3"},

        "r=memberday/payaccount": {"title":"海洋会员支付_memberday/payaccount","style":"0"},
        "r=memberday/paymembercard": {"title":"影城会员卡支付_memberday/paymembercard","style":"0"},
        "r=memberday/order": {"title":"确认订单_memberday/order","style":"0"},
        "r=memberday/type": {"title": "支付订单_pay/type", "style": "0"},
        "r=memberday/result": {"title": "支付结果_memberday/result", "style": "4"},
        "r=backchange/changeresult": {"title": "改签结果_backchange/changeresult", "style": "4"},
        "r=signin/index": {"title":"会员签到_signin/index","style": "0"},
        "r=signin/guide": {"title":"签到攻略_signin/guide","style": "0"},

        "r=meal/mymeal": {"title": "我的观影美食_meal/mymeal", "style": "0"},
        "r=meal/list": {"title":"观影美食_meal/list","style":"0"},
        "r=meal/order": {"title":"我的订单_meal/order","style":"0"},
        "r=meal/type": {"title":"支付订单_meal/type","style":"0"},
        "r=meal/accountpay": {"title":"海洋会员支付_meal/accountpay","style":"0"},
        "r=meal/paymembercard": {"title":"影城会员卡支付_meal/paymembercard","style":"0"},
        "r=meal/orderdetails": {"title":"loading..._meal/orderdetails","style":"0"},
        "r=meal/result": {"title":"支付结果_meal/result","style":"4"},

        "r=home/mycredit": {"title":"积分兑换_home/mycredit","style":"0"},
        "r=home/creditrule": {"title":"积分规则_home/creditrule","style":"0"},
        "r=coupon/view": {"title":"_coupon/view","style":"0"},
        "r=product/view": {"title":"_product/view","style":"0"},
        "r=lottery/view": {"title":"_lottery/view","style":"0"},
        "r=user/product": {"title":"_user/product","style":"0"},
        "r=user/mycredit": {"title":"我的积分_user/mycredit","style":"0"},
        "r=creditconvert/list": {"title":"积分转换_creditconvert/list","style":"0"},
        "r=creditconvert/view": {"title":"积分转换_creditconvert/view","style":"0"},

        /* 活动平台 */
        "actId=33": {"title": "_actId","style": "6"},
        "r=meal/actmealsale": {"title": "_meal/actmealsale", "style": "1"},     /*线上卖品提前购*/
        //"r=raffle/index": {"title": "_raffle/index","style": "6"},              /*大转盘*//*九宫格*/
        "r=giftbox/index": {"title": "_giftbox/index","style": "6"},            /*拆礼盒*//*拆礼盒2*/
        "r=home/pointsexchange": {"title": "_home/pointsexchange","style": "6"},/*会员积分转线上*/
        "actId=41": {"title": "_actId", "style": "5"},                          /*新app分享的红包*/
        /*"r=memberday/index": {"title": "_giftbox/index","style": "5"},*/
        "r=memberday/index": {"title": "_memberday/index","style": "5"},        /*会员福利日活动*/
        "actId=119": {"title": "工行爆米花套餐活动_actId", "style": "0"},         /*工行1元购爆米花活动*/
        "actId=83": {"title": "loading..._actId", "style": "0"},                /*购买电子券测试*/
        "r=act/view": {"title": "loading..._act/view", "style": "0"},           /* 浦发观影季， 十元看大片 */
        "actId=7": {"title": "_actId", "style": "5"},                           /*充值，享优惠，赢影券*/
        /*社区*/
        "r=find/index": {"title":"loading..._find/index","style":"5"},
        "r=find/list": {"title":"影讯列表_find/list","style":"0"},
        "r=find/view": {"title":"loading..._find/view","style":"0"},
        /*视频播放*/
        "r=film/videoplay": {"title": "loading..._film/videoplay", "style": "0"},
        /*集卡牌*/
        // "r=card/index": {"title": "幸福在七夕_card/index", "style": "0"},
        // "r=card/cardlist": {"title": "七夕参与_card/cardlist", "style": "0"},
        /*感恩节活动*/
        //r=raffle/playview
        "r=raffle/index": {"title": "_raffle/index","style": "1"},
        //"r=raffle/playview": {"title": "_raffle/playview","style": "1"}


        "r=date/invitation/invite": {"title": "loading..._date/invitation/invite", "style": "2_主页"},//个人中心约影列表
        "r=usermenu/viewhobby": {"title": "loading..._usermenu/viewhobby", "style": "2_确定"},//设置约影爱好
        "r=usermenu/wechat": {"title": "loading..._usermenu/wechat", "style": "2_确定"},//设置约影爱好
        "r=film/designcover": {"title":"制作台词海报_film/designcover","style":"0"},

        /* 购买积分 */
        "r=credit/list": {"title":"购买积分_pay/type","style":"0"},
        "r=credit/result": {"title":"支付结果_credit/result","style":"2_完成"},
        "r=date/book/list": {"title":"loading..._date/book/list","style":"8"},//增加原生消息导航


        /* 活动列表act/list */
        "biz=1": {"title": "loading...", "style": "1"},

        /* 2017贺卡活动 */
        "r=share/index": {"title": "_share/index", "style": "1"},

    }
});

