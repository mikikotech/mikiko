package com.mikiko;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.mikiko.nativeUI.CameraViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class MyAppPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                new CameraViewManager()
        );
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new TuyaModule(reactContext));
        modules.add(new TuyaUserModule(reactContext));
        modules.add(new TuyaHomeModule(reactContext));
        modules.add(new TuyaDeviceModule(reactContext));
        modules.add(new TuyaRoomModule(reactContext));
        modules.add(new TuyaActivatorModule(reactContext));
        modules.add(new TuyaCameraModule(reactContext));
//        modules.add(new EspTouchModule(reactContext));

        return modules;
    }

}
