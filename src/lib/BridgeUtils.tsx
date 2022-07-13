import {DeviceEventEmitter} from 'react-native';

const GROUPLISTENER = 'groupListener';
const NEEDLOGIN = 'needLogin';

const OTALISTENER = 'otaListener';
const DEVLISTENER = 'devListener';
const GATWAYLISTENER = 'gatwayListener';
const HOMEDEVICESTATUS = 'homeDeviceStatus';
const HOMESTATUS = 'homeStatus';
const HOMECHANGE = 'homeChange';
const TRANSFERDATA = 'transferData';
const TRANSFER = 'transfer';
const WARNMESSAGEARRIVED = 'WarnMessageArrived';
const SMARTUPDATE = 'SmartUpdate';
const SEARCHDEVICE = 'searchDevice';

const TYNativeBridge: any = {};

TYNativeBridge.on = (eventname: any, callback: any) => {
  DeviceEventEmitter.addListener(eventname, callback);
};
TYNativeBridge.off = (eventname: any) => {
  DeviceEventEmitter.removeAllListeners(eventname);
};
TYNativeBridge.bridge = (key: string, id: string) => {
  return key + '//' + id;
};

export {
  TYNativeBridge,
  GROUPLISTENER,
  OTALISTENER,
  DEVLISTENER,
  GATWAYLISTENER,
  HOMEDEVICESTATUS,
  HOMESTATUS,
  HOMECHANGE,
  TRANSFERDATA,
  TRANSFER,
  WARNMESSAGEARRIVED,
  SMARTUPDATE,
  SEARCHDEVICE,
  NEEDLOGIN,
};
