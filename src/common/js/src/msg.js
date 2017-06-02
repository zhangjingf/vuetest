/**
 * 本页只做storageMessager消息注明
 *
 * 1、userChanged 登录状态变更时触发
 *     将会关闭所有子webview，然后回到“我的”页面
 *     因为会关闭所有子webview，所以只会留存主页面，
 *     如果主页面有用户相关信息，需要调用webBridge.reload()重新加载页面（不要直接获取数据，登录或者退出登录似乎app不能瞬间更新登录数据）
 *
 * 2、userModify 当用户资料更新的时候触发
 *     各个使用到用户数据的页面需要更新本身user缓存
 *     在现在只有myData.html中调用了各个修改用户数据的层，因此只有主页面以及myData.html(myData.html是从主页面直接点开的)需要绑定此事件
 *
 * 3、selectedCityChanged 当用户选择的城市发生变化
 *     各个使用到用户选择的城市需要更新本身city缓存
 *     在现在只有index.html中调用了cities.html修改城市，因此只有主页面需要绑定此事件
 *
 * 4、cardsChange 当用户绑定一张影城会员卡
 *     将关闭绑定会员卡页面bindCinemaCard.html
 *     回到myWallet.html页面，会重新加载数据。（没有用webBridge.reload(),因为用这个方法底部会有留白。 我用的是调用walletCard模块的initView方法）
 *
 * 5、hasReview 当用户评论时
 * 	   将刷新电影详情页，以更新页面上的评论
 */