//package com.mikiko;
//
//import androidx.annotation.NonNull;
//
//import com.espressif.iot.esptouch.EsptouchTask;
//import com.espressif.iot.esptouch.IEsptouchListener;
//import com.espressif.iot.esptouch.IEsptouchResult;
//import com.espressif.iot.esptouch.util.ByteUtil;
//import com.espressif.iot.esptouch.util.TouchNetUtil;
//import com.facebook.react.bridge.Promise;
//import com.facebook.react.bridge.ReactApplicationContext;
//import com.facebook.react.bridge.ReactContextBaseJavaModule;
//import com.facebook.react.bridge.ReactMethod;
//
//import java.util.List;
//
//public class EspTouchModule extends ReactContextBaseJavaModule {
//    public  EspTouchModule(ReactApplicationContext reactContext){
//        super(reactContext);
//    }
//
//    EsptouchTask task;
//
//    @NonNull
//    @Override
//    public String getName(){
//        return "EspTouchModule";
//    }
//
//    @ReactMethod
//    public void start(final String ssid, final String bssid, final String password, Promise promise){
//        byte[] currentSSID = ByteUtil.getBytesByString(ssid);
//        byte[] currentBSSID = TouchNetUtil.parseBssid2bytes(bssid);
//        byte[] currentPASSWORD = ByteUtil.getBytesByString(password);
//
//        task = new EsptouchTask(currentSSID, currentBSSID, currentPASSWORD, getReactApplicationContext());
//
//        task.setEsptouchListener(new IEsptouchListener() {
//            @Override
//            public void onEsptouchResultAdded(IEsptouchResult result) {
//
//            }
//        });
//
//        int expectResultCount = 1;
//        List<IEsptouchResult> results = task.executeForResults(expectResultCount);
//        IEsptouchResult first = results.get(0);
//        if (first.isCancelled()) {
//            promise.reject("err", "user cancel");
//        }
//        if (first.isSuc()) {
//            promise.resolve(ReactUtils.parseToWritableMap(results));
//        }
//    }
//
//    @ReactMethod
//    public void stop(){
//        task.interrupt();
//    }
//}
