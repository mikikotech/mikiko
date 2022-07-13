import React from 'react';
import {NativeModules} from 'react-native';
const {TuyaBLEModule} = NativeModules;

class TuyaBLEDevice {
  startScan() {
    return new Promise((reslove, reject) => {
      TuyaBLEModule.scanBLEDevice()
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  stopScan() {
    TuyaBLEModule.stopScanBLE();
  }

  startBLEActivator(homeId: number) {
    // final int homeId, final String address, final int deviceType, final String uuid, final String productId,
    return new Promise((reslove, reject) => {
      TuyaBLEModule.startBLEActivator(homeId)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  stopBLEAvtivator(uuid: string) {
    TuyaBLEModule.stopBLEAvtivator(uuid);
  }

  isDeviceOnline(devId: string) {
    return new Promise((reslove, reject) => {
      TuyaBLEModule.isDeviceOnline(devId)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  connectToDevice(devId: string) {
    return new Promise((reslove, reject) => {
      TuyaBLEModule.connectToDevice(devId)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  getDeviceDPSInfo(devId: string) {
    return new Promise((reslove, reject) => {
      TuyaBLEModule.getDeviceDPSInfo(devId)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  initDevice(devId: string) {
    TuyaBLEModule.initDevice(devId);
  }

  publishDPs(dps: string) {
    //dps = {"101": true};
    return new Promise((reslove, reject) => {
      TuyaBLEModule.publishDPs(dps)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  deleteDevice() {
    return new Promise((reslove, reject) => {
      TuyaBLEModule.deleteDevice()
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }
}

export default new TuyaBLEDevice();
