import React from 'react';
import {NativeModules} from 'react-native';
const {TuyaActivatorModule} = NativeModules;

class TuyaActivator {
  getCurrentSSID() {
    return new Promise((reslove, reject) => {
      TuyaActivatorModule.getCurrentSSID().then((res: string) => {
        reslove(res);
      });
    });
  }

  pairingEZMode(
    homeId: number,
    ssid: string,
    password: string,
    timeout?: number | 100,
  ) {
    return new Promise((reslove, reject) => {
      TuyaActivatorModule.pairingEZMode(homeId, ssid, password, timeout)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  pairingAPMode(
    homeId: number,
    ssid: string,
    password: string,
    timeout?: number | 100,
  ) {
    return new Promise((reslove, reject) => {
      TuyaActivatorModule.pairingAPMode(homeId, ssid, password, timeout)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  stop() {
    TuyaActivatorModule.stop();
  }
}

export default new TuyaActivator();
