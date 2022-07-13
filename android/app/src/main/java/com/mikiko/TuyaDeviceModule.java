package com.mikiko;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.tuya.smart.home.sdk.TuyaHomeSdk;
import com.tuya.smart.sdk.api.IDevListener;
import com.tuya.smart.sdk.api.IResultCallback;
import com.tuya.smart.sdk.api.ITuyaActivator;
import com.tuya.smart.sdk.api.ITuyaDevice;
import com.tuya.smart.sdk.enums.TYDevicePublishModeEnum;

import java.util.Map;

public class TuyaDeviceModule extends ReactContextBaseJavaModule {
    public TuyaDeviceModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private IDevListener mIDevListener;
    private ITuyaActivator mITuyaActivator;

    @NonNull
    @Override
    public String getName() {
        return "TuyaDeviceModule";
    }

    @ReactMethod
    public void getDeviceDPSInfo(final String devId, Promise promise){
        try {
            Map<String, Object> dps = TuyaHomeSdk.getDataInstance().getDps(devId);
            promise.resolve(ReactUtils.parseToWritableMap(dps));
        }catch (Exception e){
            promise.reject("error", e);
        }
    }

    @ReactMethod
    public void removeDevice(final String devId, Promise promise) {
        getDevice(devId).removeDevice(new IResultCallback() {
            @Override
            public void onError(String code, String error) {
                promise.reject(code, error);
            }

            @Override
            public void onSuccess() {
                promise.resolve("success");
            }
        });

    }

    @ReactMethod
    public void renameDevice(final String devId, final String deviceName, Promise promise) {
            getDevice(devId).renameDevice(deviceName, new IResultCallback() {
                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }

                @Override
                public void onSuccess() {
                    promise.resolve("success");
                }
            });

    }

    @ReactMethod
    public void publishDps(final String devId, final String dps, Promise promise) {
            getDevice(devId).publishDps(dps, new IResultCallback() {
                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }

                @Override
                public void onSuccess() {
                    promise.resolve("success");
                }
            });

    }

    @ReactMethod
    public void publishDpsWithEnum(final String devId, final String dps, Promise promise) {
            getDevice(devId).publishDps(dps, TYDevicePublishModeEnum.TYDevicePublishModeAuto, new IResultCallback() {
                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }

                @Override
                public void onSuccess() {
                    promise.resolve("success");
                }
            });

    }


    @ReactMethod
    public void registerDevListener(final String devId) {
            if (mIDevListener != null) {
                getDevice(devId).unRegisterDevListener();
                mIDevListener = null;
            }
            mIDevListener = new IDevListener() {

                @Override
                public void onDpUpdate(String devId, String dpStr) {
                    WritableMap map = Arguments.createMap();
                    map.putString("devId", devId);
                    map.putString("dpStr", dpStr);
                    map.putString("type", "onDpUpdate");
//                    BridgeUtils.devListener(getReactApplicationContext(), map, devId);
                }

                @Override
                public void onRemoved(String devId) {
                    WritableMap map = Arguments.createMap();
                    map.putString("devId", devId);
                    map.putString("type", "onRemoved");
//                    BridgeUtils.devListener(getReactApplicationContext(), map, devId);
                }

                @Override
                public void onStatusChanged(String devId, boolean online) {
                    WritableMap map = Arguments.createMap();
                    map.putString("devId", devId);
                    map.putBoolean("online", online);
                    map.putString("type", "onStatusChanged");
//                    BridgeUtils.devListener(getReactApplicationContext(), map, devId);
                }

                @Override
                public void onNetworkStatusChanged(String devId, boolean status) {
                    WritableMap map = Arguments.createMap();
                    map.putString("devId", devId);
                    map.putBoolean("status", status);
                    map.putString("type", "onNetworkStatusChanged");
//                    BridgeUtils.devListener(getReactApplicationContext(), map, devId);
                }

                @Override
                public void onDevInfoUpdate(String devId) {
                    WritableMap map = Arguments.createMap();
                    map.putString("devId", devId);
                    map.putString("type", "onDevInfoUpdate");
//                    BridgeUtils.devListener(getReactApplicationContext(), map, devId);
                }
            };
            getDevice(devId).registerDevListener(mIDevListener);

    }

    @ReactMethod
    public void unRegisterDevListener(final String devId) {
        if (mIDevListener != null) {
            getDevice(devId).unRegisterDevListener();
            mIDevListener = null;
        }
    }

    @ReactMethod
    public void getDp(final String devId, final String dpId, Promise promise) {
            getDevice(devId).getDp(dpId, new IResultCallback() {
                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }

                @Override
                public void onSuccess() {
                    promise.resolve("success");
                }
            });

    }

    private ITuyaDevice getDevice(String devId) {
        return TuyaHomeSdk.newDeviceInstance(devId);
    }
}
