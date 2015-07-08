#Colorgy Table Android Version
##簡而言之
他其實就是 `Android` 版的 `Colorgy Table`（廢話）

##不負責任解說
因為我不會寫 Android（才怪，明明就是不想寫）

所以我就用了某個`框架`來幫忙

--> [Ionic framework](http://ionicframework.com/)

[![preview](ionic.png)](http://ionicframework.com/)

##待補完 something need to complete
- ionic & cordova fb native app login
- how do you add plugins to a cordova/ionic project
- Android FB login little note.
  - no need to enter password while generating Hashes...fk
  - ionic/cordova will do the install fb sdk work for u.
  - all you need to do is make sure FBAppId is correct.
  - last, never trust the getting start guide. Always enter hashes in settins, not in quick start....fk.

##Why Ionic?
因為他幫我做好多元件了，棒

在 Android 上直接跑網頁，比起直接寫 java 簡單（因為我不會寫 java，iOS 寫久了沒辦法咩對不起）

還可以寫 Angular，雖然 React 比較好。

##How to use it?
###Install Ionic

`npm install -g cordova ionic`

###Run with browser
`ionic serve`

###Run with iOS
You must install `xcode` first.

`ionic emulate ios`

###Run with android
Install `android studio` first.

then install `ant`

`brew install ant`

Cause android platform is not yet added to this project.

You must first add android platform to this project with this command.

`ionic platform add android && ionic build android`

Run it!

`ionic emulate android`

This is very complicated, so I don't like to use android.

