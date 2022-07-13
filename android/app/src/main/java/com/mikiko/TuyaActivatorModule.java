package com.mikiko;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.mikiko.JsonUtils;
import com.mikiko.ReactUtils;
import com.tuya.smart.android.common.utils.WiFiUtil;
import com.tuya.smart.home.sdk.TuyaHomeSdk;
import com.tuya.smart.home.sdk.builder.ActivatorBuilder;
import com.tuya.smart.sdk.api.ITuyaActivator;
import com.tuya.smart.sdk.api.ITuyaActivatorGetToken;
import com.tuya.smart.sdk.api.ITuyaCameraDevActivator;
import com.tuya.smart.sdk.api.ITuyaSmartActivatorListener;
import com.tuya.smart.sdk.bean.DeviceBean;
import com.tuya.smart.sdk.enums.ActivatorModelEnum;

public class TuyaActivatorModule extends ReactContextBaseJavaModule {
    public TuyaActivatorModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private ITuyaActivator mITuyaActivator;
    private ITuyaCameraDevActivator mTuyaActivator;

    @NonNull
    @Override
    public String getName() {
        return "TuyaActivatorModule";
    }


    @ReactMethod
    public void getCurrentSSID(Promise promise) {
        promise.resolve(WiFiUtil.getCurrentSSID(getReactApplicationContext()));
    }

    @ReactMethod
    public void pairingEZMode(final int homeId, final String ssid, final String password, final int timeout, final Promise promise) {
        TuyaHomeSdk.getActivatorInstance().getActivatorToken(homeId, new ITuyaActivatorGetToken() {
            @Override
            public void onSuccess(String token) {
                stop();
                ActivatorBuilder activatorBuilder = new ActivatorBuilder()
                        .setSsid(ssid)
                        .setContext(getReactApplicationContext().getApplicationContext())
                        .setPassword(password)
                        .setActivatorModel(ActivatorModelEnum.TY_EZ)
                        .setTimeOut(timeout)
                        .setToken(token)
                        .setListener(new ITuyaSmartActivatorListener() {
                            @Override
                            public void onError(String errorCode, String errorMsg) {
                                promise.reject(errorCode, errorMsg);
                            }

                            @Override
                            public void onActiveSuccess(DeviceBean devResp) {
                                promise.resolve(ReactUtils.parseToWritableMap(devResp));
                            }

                            @Override
                            public void onStep(String step, Object data) {
                                Log.i("TAG", "onStep: " +  step);
                                promise.resolve(JsonUtils.toString(data));
                            }
                        });

                mITuyaActivator = TuyaHomeSdk.getActivatorInstance().newMultiActivator(activatorBuilder);
                mITuyaActivator.start();
            }

            @Override
            public void onFailure(String errorCode, String errorMsg) {
                promise.reject(errorCode, errorMsg);
            }
        });
    }

    @ReactMethod
    public void pairingAPMode(final int homeId, final String ssid, final String password, final int timeout, final Promise promise) {
        TuyaHomeSdk.getActivatorInstance().getActivatorToken(homeId, new ITuyaActivatorGetToken() {
            @Override
            public void onSuccess(String token) {
                stop();
                ActivatorBuilder activatorBuilder = new ActivatorBuilder()
                        .setSsid(ssid)
                        .setContext(getReactApplicationContext().getApplicationContext())
                        .setPassword(password)
                        .setActivatorModel(ActivatorModelEnum.TY_AP)
                        .setTimeOut(timeout)
                        .setToken(token)
                        .setListener(new ITuyaSmartActivatorListener() {
                            @Override
                            public void onError(String errorCode, String errorMsg) {
                                promise.reject(errorCode, errorMsg);
                            }

                            @Override
                            public void onActiveSuccess(DeviceBean devResp) {
                                promise.resolve(ReactUtils.parseToWritableMap(devResp));
                            }

                            @Override
                            public void onStep(String step, Object data) {
                                Log.i("TAG", "onStep: " +  step);
                                promise.resolve(JsonUtils.toString(data));
                            }
                        });

                mITuyaActivator = TuyaHomeSdk.getActivatorInstance().newActivator(activatorBuilder);
                mITuyaActivator.start();
            }

            @Override
            public void onFailure(String errorCode, String errorMsg) {
                promise.reject(errorCode, errorMsg);
            }
        });
    }

    @ReactMethod
    public void stop() {
        if (mITuyaActivator != null) {
            mITuyaActivator.stop();
            mITuyaActivator.onDestroy();
            mITuyaActivator = null;
        }
    }
}

