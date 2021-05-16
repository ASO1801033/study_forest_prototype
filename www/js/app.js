

ons.ready(async () => {
  let user = ncmb.User.getCurrentUser();
  if (user) {
    try {
      await ncmb.DataStore('Test').fetch();
    } catch (e) {
      user = null;
    }
  }
  if (!user) {
    user = await ncmb.User.loginAsAnonymous();
  }
  const role = await ncmb.Role.equalTo('roleName', 'admin').fetch();
  const users = await role.fetchUser();
  window.admin = users.map(u => u.objectId).indexOf(user.objectId) > -1;
})

function loadImage(name, className) {
  if (!this.querySelector(className)) return;
  ncmb.File.download(name, 'blob')
    .then(blob => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.querySelector(className).src = fileReader.result;
      }
      fileReader.readAsDataURL(blob) ;
    })
}

// 削除可能か判定する関数
function deletable(obj) {
  let bol = false;
  // 管理者であれば常に削除可能
  if (window.admin) {
    bol = true;
  } else {
    // 管理者でない場合は自分に削除権限があるかチェック
    const user = ncmb.User.getCurrentUser();
    bol = user && obj.acl[user.objectId] && obj.acl[user.objectId].write;
  }
  // 削除可能な場合はゴミ箱アイコンを表示
  return bol ? `<ons-icon data-object-id="${obj.objectId}" class="delete" icon="fa-trash"></ons-icon>` : '';
}

/********** ID/PW認証 **********/
// 「Sing up」ボタン押下時の処理
function onSignupByIDBtn() {
    var username = $('#singupUsername').val();
    var password = $('#singupPassword').val();
    var passwordConfirm = $('#singupPasswordConfirm').val();
    if(username == '' || password == '' || passwordConfirm == '') {
        ons.notification.alert('入力されていない項目があります');
    } else if (password != passwordConfirm) {
        ons.notification.alert('パスワードが不一致です');
    } else {
        mb.signupByID(username, password);
    }
}

// 「Sing in」ボタン押下時の処理
function onSigninByIDBtn() { 
    var username = $('#singinUsername').val();
    var password = $('#singinPassword').val();
    if(username == '' || password == '') {
        ons.notification.alert('入力されていない項目があります');
    } else {
        mb.signinByID(username, password);
    }
}


/********** メールアドレス / PW 認証 **********/
// 「Sing up」ボタン押下時の処理
function onSignupByEmailBtn() {
    var mailAddress = $('#singupEmailAddress').val();
    if(mailAddress == '') {
        ons.notification.alert('メールアドレスが入力されていません');
    } else {
        mb.signupByEmail(mailAddress);
    }
}

// 「Sing in」ボタン押下時の処理
function onSigninByEmailBtn() {
    var mailAddress = $('#singinEmailAddress').val();
    var password = $('#singinEmailAddressPW').val();
    if(mailAddress == '' || password == '') {
        ons.notification.alert('入力されていない項目があります');
    } else {
        mb.signinByEmail(mailAddress, password);
    }
}

/********** 匿名認証**********/
// 「Sing in」ボタン押下時の処理
function onSigninByAnonymousIDBtn() {
    mb.signinByAnonymousID();
}

/********** コールバック **********/
// 成功
function userSuccess(message, user) {
    /* 処理成功 */
    console.log(message + ' ' + JSON.stringify(user));
    objectId = user.get('objectId');
    ons.notification.alert(message + ' objectId: ' + objectId)
                    .then(function() {
                        //mb.logout(); ログインできたら自動でログアウトされる
                        //ons.notification.alert('ログアウトしました');
                    });
    clearField();
}

// 失敗
function userError(message, error) {
    console.log(message + ' ' + error);
    ons.notification.alert(message + ' ' + error);
}

// クリア
function clearField() {
    $('#singupUsername').val('');
    $('#singupPassword').val('');
    $('#singupPasswordConfirm').val('');
    $('#singinUsername').val('');
    $('#singinPassword').val('');
    $('#singupEmailAddress').val('');
    $('#singinEmailAddress').val('');
    $('#singinEmailAddressPW').val('');
}
