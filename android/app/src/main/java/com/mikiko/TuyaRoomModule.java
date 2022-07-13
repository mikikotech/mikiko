package com.mikiko;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.tuya.smart.home.sdk.TuyaHomeSdk;
import com.tuya.smart.sdk.api.IResultCallback;


public class TuyaRoomModule extends ReactContextBaseJavaModule {
    public TuyaRoomModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "TuyaRoomModule";
    }

    @ReactMethod
    public void updateRoom(final int roomId, final String roomName, final Promise promise) {
            TuyaHomeSdk.newRoomInstance(roomId).updateRoom(roomName, new IResultCallback() {
                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }

                @Override
                public void onSuccess() {
                    promise.resolve("success update room name");
                }
            });
    }

    @ReactMethod
    public void addDevice(final int roomId, final String devId, final Promise promise) {
            TuyaHomeSdk.newRoomInstance(roomId).addDevice(devId, new IResultCallback() {
                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }

                @Override
                public void onSuccess() {
                    promise.resolve("success add device name");
                }
            });
    }


    @ReactMethod
    public void removeDevice(final int roomId, final String devId, final Promise promise) {
            TuyaHomeSdk.newRoomInstance(roomId).removeDevice(devId, new IResultCallback() {
                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }

                @Override
                public void onSuccess() {
                    promise.resolve("success remove device name");
                }
            });
    }

}
