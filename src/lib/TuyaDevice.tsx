import React from 'react';
import {NativeModules} from 'react-native';
const {TuyaDeviceModule} = NativeModules;

class TuyaDevice {
  removeDevice(devId: string) {
    return new Promise((reslove, reject) => {
      TuyaDeviceModule.removeDevice(devId)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  renameDevice(devId: string, deviceName: string) {
    return new Promise((reslove, reject) => {
      TuyaDeviceModule.renameDevice(devId, deviceName)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }
}

export default new TuyaDevice();
