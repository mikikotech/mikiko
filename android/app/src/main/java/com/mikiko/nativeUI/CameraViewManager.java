package com.mikiko.nativeUI;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class CameraViewManager extends SimpleViewManager<CameraView> {

    public static final String REACT_CLASS = "RTCCameraViewManager";
    public String devId = "";

    CameraView view;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public CameraView createViewInstance(ThemedReactContext context) {
        return new CameraView(context);
    }

//    @ReactProp(name = "devId")
//    public void setDevId(CameraView view, @NonNull String _devId) {
//        view.setDevId(_devId);
//    }

    @ReactMethod
    public void initData(@NonNull String _devId){
        view.initData(_devId);
    }

    @ReactMethod
    public void resumePlay(){
        view.onResumeStream();
    }

    @ReactMethod
    public void pausePlay(){
        view.onPause();
    }

    @NonNull
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        //For frequent updates like on change or movement, read about getExportedCustomBubblingEventTypeConstants);
        return MapBuilder.<String, Object>builder()
                .put("nativeCreate", //Same as name registered with receiveEvent
                        MapBuilder.of("registrationName", "onCreate"))
                .build();
    }

}
