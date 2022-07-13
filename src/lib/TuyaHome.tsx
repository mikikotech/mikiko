import React from 'react';
import {NativeModules} from 'react-native';
const {TuyaHomeModule} = NativeModules;

class TuyaHome {
  createHome(
    homeName: string,
    lon: number,
    lat: number,
    rooms: Array<string>,
    geoName: string,
  ) {
    return new Promise((reslove, reject) => {
      TuyaHomeModule.createHome(homeName, lon, lat, rooms, geoName)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  queryHomeList() {
    return new Promise((reslove, reject) => {
      TuyaHomeModule.queryHomeList()
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  queryHomeDetail(homeId: number) {
    return new Promise((reslove, reject) => {
      TuyaHomeModule.queryHomeDetail(homeId)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  queryHomeDetailCache(homeId: number) {
    return new Promise((reslove, reject) => {
      TuyaHomeModule.queryHomeDetailCache(homeId)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  onDestroy() {
    TuyaHomeModule.onDestroy();
  }

  updateHome(homeName: string, lon: number, lat: number, geoName: string) {
    return new Promise((reslove, reject) => {
      TuyaHomeModule.updateHome(homeName, lon, lat, geoName)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  getHomeWeather(homeId: number, lon: number, lat: number) {
    return new Promise((reslove, reject) => {
      TuyaHomeModule.getHomeWeather(homeId, lon, lat)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  getHomeRoomList(homeId: number) {
    return new Promise((reslove, reject) => {
      TuyaHomeModule.getHomeRoomList(homeId)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  getHomeDeviceList(homeId: number) {
    return new Promise((reslove, reject) => {
      TuyaHomeModule.getHomeDeviceList(homeId)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  getRoomDeviceList(homeId: number) {
    return new Promise((reslove, reject) => {
      TuyaHomeModule.getRoomDeviceList(homeId)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  getHomeBean(homeId: number) {
    return new Promise((reslove, reject) => {
      TuyaHomeModule.getRoomDeviceList(homeId)
        .then((res: any) => {
          reslove(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }
}

export default new TuyaHome();
