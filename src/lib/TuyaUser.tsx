import React from 'react';
import {NativeModules} from 'react-native';
const {TuyaUserModule} = NativeModules;

class TuyaUser {
  getUser() {
    return new Promise((reslove, reject) => {
      TuyaUserModule.getUser()
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  isLogin() {
    return new Promise((reslove, reject) => {
      TuyaUserModule.isLogin()
        .then((res: boolean) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  sendVerifyCodeWithUserName(countryCode: string, email: string) {
    return new Promise((reslove, reject) => {
      TuyaUserModule.sendVerifyCodeWithUserName(countryCode, email)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  registerAccountWithEmail(
    countryCode: string,
    email: string,
    password: string,
    code: string,
  ) {
    return new Promise((reslove, reject) => {
      TuyaUserModule.registerAccountWithEmail(
        countryCode,
        email,
        password,
        code,
      )
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  registerAccountWithPhone(
    countryCode: string,
    phoneNumber: string,
    password: string,
    code: string,
  ) {
    return new Promise((reslove, reject) => {
      TuyaUserModule.registerAccountWithPhone(
        countryCode,
        phoneNumber,
        password,
        code,
      )
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  loginWithEmail(countryCode: string, email: string, password: string) {
    return new Promise((reslove, reject) => {
      TuyaUserModule.loginWithEmail(countryCode, email, password)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  loginWithPhone(countryCode: string, phoneNumber: string, password: string) {
    return new Promise((reslove, reject) => {
      TuyaUserModule.loginWithEmail(countryCode, phoneNumber, password)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  loginByFacebook(countryCode: string, fbToken: string) {
    return new Promise((reslove, reject) => {
      TuyaUserModule.loginByFacebook(countryCode, fbToken)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  loginByGoogle(countryCode: string, ggToken: string) {
    return new Promise((reslove, reject) => {
      TuyaUserModule.loginByGoogle(countryCode, ggToken)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  logout() {
    return new Promise((reslove, reject) => {
      TuyaUserModule.logout()
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  setTempUnitCelcius() {
    return new Promise((reslove, reject) => {
      TuyaUserModule.setTempUnitCelcius()
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  setTempUnitFahrenheit() {
    return new Promise((reslove, reject) => {
      TuyaUserModule.setTempUnitFahrenheit()
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  uploadUserAvatar(imgPath: string) {
    return new Promise((reslove, reject) => {
      TuyaUserModule.uploadUserAvatar(imgPath)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  updateNickName(nickName: string) {
    return new Promise((reslove, reject) => {
      TuyaUserModule.updateNickName(nickName)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }
}

export default new TuyaUser();
