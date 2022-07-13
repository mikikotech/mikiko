import React from 'react';
import {NativeModules} from 'react-native';
const {TuyaCameraModule} = NativeModules;

class TuyaCamera {
  cameraPairing(
    homeId: number,
    ssid: string,
    password: string,
    timeout: number,
  ) {
    return new Promise((reslove, reject) => {
      TuyaCameraModule.cameraPairing(homeId, ssid, password, timeout)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  startPairing() {
    TuyaCameraModule.start();
  }

  stopPairing() {
    TuyaCameraModule.stopPairing();
  }

  openIPC(devId: string) {
    TuyaCameraModule.openIPC(devId);
  }
}

export default new TuyaCamera();
