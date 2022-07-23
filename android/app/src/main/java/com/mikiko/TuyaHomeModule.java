package com.mikiko;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.tuya.smart.home.sdk.TuyaHomeSdk;
import com.tuya.smart.home.sdk.api.ITuyaHomeChangeListener;
import com.tuya.smart.home.sdk.api.ITuyaHomeStatusListener;
import com.tuya.smart.home.sdk.bean.HomeBean;
import com.tuya.smart.home.sdk.bean.WeatherBean;
import com.tuya.smart.home.sdk.callback.IIGetHomeWetherSketchCallBack;
import com.tuya.smart.home.sdk.callback.ITuyaGetHomeListCallback;
import com.tuya.smart.home.sdk.callback.ITuyaHomeResultCallback;
import com.tuya.smart.sdk.api.IResultCallback;
import com.tuya.smart.sdk.api.ITuyaDataCallback;
import com.tuya.smart.sdk.api.ITuyaSearchDeviceListener;
import com.tuya.smart.sdk.bean.DeviceBean;
import com.tuya.smart.sdk.bean.GroupBean;
import com.tuya.smart.sdk.enums.DeviceActiveEnum;

import java.util.ArrayList;
import java.util.List;

public class TuyaHomeModule extends ReactContextBaseJavaModule {
    public TuyaHomeModule (@NonNull ReactApplicationContext reactContext){
        super(reactContext);
    }

    private ITuyaHomeChangeListener mITuyaHomeChangeListener;
    private ITuyaSearchDeviceListener mITuyaSearchDeviceListener;
    private ITuyaHomeStatusListener iTuyaHomeStatusListener;

    @NonNull
    @Override
    public String getName(){
        return "TuyaHomeModule";
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void createHome(final String homeName, final double lon, final double lat, final ReadableArray rooms, final String geoName, Promise promise){

        ArrayList<String> roomList = new ArrayList<>();

        for (int i = 0; i < rooms.size(); i++) {
            roomList.add(rooms.getString(i));
        }

        TuyaHomeSdk.getHomeManagerInstance().createHome(homeName, lon, lat, geoName, roomList, new ITuyaHomeResultCallback() {
            @Override
            public void onSuccess(HomeBean bean) {
                promise.resolve(ReactUtils.parseToWritableMap(bean));
            }
            @Override
            public void onError(String errorCode, String errorMsg) {
                promise.reject(errorCode, errorMsg);
            }
        });
    }

    @ReactMethod
    public void queryHomeList(final Promise promise) {
        TuyaHomeSdk.getHomeManagerInstance().queryHomeList(new ITuyaGetHomeListCallback() {
            @Override
            public void onSuccess(List<HomeBean> homeBeans) {
                promise.resolve(ReactUtils.parseToWritableArray(JsonUtils.toJsonArray(homeBeans)));
            }

            @Override
            public void onError(String errorCode, String error) {
                promise.reject(errorCode, error);
            }
        });
    }

    @ReactMethod
    public void queryHomeDetail(final int homeId, Promise promise){
        TuyaHomeSdk.newHomeInstance(homeId).getHomeDetail(new ITuyaHomeResultCallback() {
            @Override
            public void onSuccess(HomeBean bean) {
                promise.resolve(ReactUtils.parseToWritableMap(bean));
            }
            @Override
            public void onError(String errorCode, String errorMsg) {
                promise.reject(errorCode, errorMsg);
            }
        });

    }

    @ReactMethod
    public void queryHomeDetailCache(final int homeId,Promise promise){
        TuyaHomeSdk.newHomeInstance(homeId).getHomeLocalCache(new ITuyaHomeResultCallback() {
            @Override
            public void onSuccess(HomeBean bean) {
                promise.resolve(ReactUtils.parseToWritableMap(bean));
            }
            @Override
            public void onError(String errorCode, String errorMsg) {
                promise.reject(errorCode, errorMsg);
            }
        });
    }

    @ReactMethod
    public void registerTuyaHomeChangeListener() {
        if (mITuyaHomeChangeListener != null) {
            TuyaHomeSdk.getHomeManagerInstance().unRegisterTuyaHomeChangeListener(mITuyaHomeChangeListener);
            mITuyaHomeChangeListener = null;
        }

        mITuyaHomeChangeListener = new ITuyaHomeChangeListener() {
            @Override
            public void onHomeAdded(long homeId) {
                WritableMap map = Arguments.createMap();
                map.putDouble("homeId", homeId);
                map.putString("type", "onHomeAdded");
//                BridgeUtils.homeChange(getReactApplicationContext(), map, "");

                sendEvent( getReactApplicationContext(),"home", map);
            }

            @Override
            public void onHomeInvite(long homeId, String homeName) {
                WritableMap map = Arguments.createMap();
                map.putDouble("homeId", homeId);
                map.putString("homeName", homeName);
                map.putString("type", "onHomeInvite");
//                BridgeUtils.homeChange(getReactApplicationContext(), map, "");
                sendEvent( getReactApplicationContext(),"home", map);
            }

            @Override
            public void onHomeRemoved(long homeId) {
                WritableMap map = Arguments.createMap();
                map.putDouble("homeId", homeId);
                map.putString("type", "onHomeRemoved");
//                BridgeUtils.homeChange(getReactApplicationContext(), map, "");
                sendEvent( getReactApplicationContext(),"home", map);
            }

            @Override
            public void onHomeInfoChanged(long homeId) {
                WritableMap map = Arguments.createMap();
                map.putDouble("homeId", homeId);
                map.putString("type", "onHomeInfoChanged");
//                BridgeUtils.homeChange(getReactApplicationContext(), map, "");
                sendEvent( getReactApplicationContext(),"home", map);
            }

            @Override
            public void onSharedDeviceList(List<DeviceBean> sharedDeviceList) {
                WritableMap map = Arguments.createMap();
                map.putArray("sharedDeviceList", ReactUtils.parseToWritableArray(JsonUtils.toJsonArray(sharedDeviceList)));
                map.putString("type", "onSharedDeviceList");
//                BridgeUtils.homeChange(getReactApplicationContext(), map, "");
                sendEvent( getReactApplicationContext(),"home", map);
            }

            @Override
            public void onSharedGroupList(List<GroupBean> sharedGroupList) {
                WritableMap map = Arguments.createMap();
                map.putArray("sharedGroupList", ReactUtils.parseToWritableArray(JsonUtils.toJsonArray(sharedGroupList)));
                map.putString("type", "onSharedGroupList");
//                BridgeUtils.homeChange(getReactApplicationContext(), map, "");
                sendEvent( getReactApplicationContext(),"home", map);
            }

            @Override
            public void onServerConnectSuccess() {
                WritableMap map = Arguments.createMap();
                map.putString("type", "onServerConnectSuccess");
//                BridgeUtils.homeChange(getReactApplicationContext(), map, "");
                sendEvent( getReactApplicationContext(),"home", map);
            }
        };
        TuyaHomeSdk.getHomeManagerInstance().registerTuyaHomeChangeListener(mITuyaHomeChangeListener);
    }

    @ReactMethod
    public void TuyaHomeStatusListener(final int homeId){
        iTuyaHomeStatusListener = new ITuyaHomeStatusListener() {
            @Override
            public void onDeviceAdded(String devId) {
                WritableMap map = Arguments.createMap();
                map.putString("devId", devId);
                map.putString("status", "add");
                sendEvent(getReactApplicationContext(), "homestatus", map);
            }

            @Override
            public void onDeviceRemoved(String devId) {
                WritableMap map = Arguments.createMap();
                map.putString("devId", devId);
                map.putString("status", "remove");
                sendEvent(getReactApplicationContext(), "homestatus", map);
            }

            @Override
            public void onGroupAdded(long groupId) {
                WritableMap map = Arguments.createMap();
                map.putDouble("devId", groupId);
                map.putString("status", "groupadd");
                sendEvent(getReactApplicationContext(), "homestatus", map);
            }

            @Override
            public void onGroupRemoved(long groupId) {
                WritableMap map = Arguments.createMap();
                map.putDouble("devId", groupId);
                map.putString("status", "groupremove");
                sendEvent(getReactApplicationContext(), "homestatus", map);
            }

            @Override
            public void onMeshAdded(String meshId) {
                WritableMap map = Arguments.createMap();
                map.putString("devId", meshId);
                map.putString("status", "meshadd");
                sendEvent(getReactApplicationContext(), "homestatus", map);
            }
        };

        TuyaHomeSdk.newHomeInstance(homeId).registerHomeStatusListener(iTuyaHomeStatusListener);
    }

    @ReactMethod
    public void TuyaHomeStatusUnListener(final int homeId){
        TuyaHomeSdk.newHomeInstance(homeId).unRegisterHomeStatusListener(iTuyaHomeStatusListener);
    }

    @ReactMethod
    public void unregisterTuyaHomeChangeListener() {
        TuyaHomeSdk.getHomeManagerInstance().unRegisterTuyaHomeChangeListener(mITuyaHomeChangeListener);
        mITuyaHomeChangeListener = null;
    }


    @ReactMethod
    public void onDestroy() {
        TuyaHomeSdk.getHomeManagerInstance().onDestroy();
    }

    @ReactMethod
    public void updateHome(final int homeId, final String name, final int lon, final int lat, final String geoName, Promise promise){
        TuyaHomeSdk.newHomeInstance(homeId).updateHome(name, lon, lat, geoName, new IResultCallback() {
            @Override
            public void onError(String code, String error) {
                promise.reject(code, error);
            }

            @Override
            public void onSuccess() {
                promise.resolve("update Success");
            }
        });
    }

    @ReactMethod
    public void getHomeWeather(final int homeId, final int lon, final int lat, Promise promise){
        TuyaHomeSdk.newHomeInstance(homeId).getHomeWeatherSketch(lon,lat,
        new IIGetHomeWetherSketchCallBack() {
            @Override
            public void onSuccess(WeatherBean result) {
                promise.resolve(ReactUtils.parseToWritableMap(result));
            }
            @Override
            public void onFailure(String errorCode, String errorMsg) {
                promise.reject(errorCode, errorMsg);
            }
        });
    }

    @ReactMethod
    public void getHomeRoomList(final int homeID, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableArray(
                    JsonUtils.toJsonArray(TuyaHomeSdk.getDataInstance().getHomeRoomList(homeID))));

    }

    @ReactMethod
    public void getHomeDeviceList(final int homeID, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableArray(
                    JsonUtils.toJsonArray(TuyaHomeSdk.getDataInstance().getHomeDeviceList(homeID))));

    }

    @ReactMethod
    public void getHomeGroupList(final int homeID, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableArray(
                    JsonUtils.toJsonArray(TuyaHomeSdk.getDataInstance().getHomeGroupList(homeID))));

    }

    @ReactMethod
    public void getGroupBean(final int groupId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getDataInstance().getGroupBean(groupId)));

    }

    @ReactMethod
    public void getDeviceBean(final String devId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getDataInstance().getDeviceBean(devId)));

    }

    @ReactMethod
    public void getGroupRoomBean(final int groupId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getDataInstance().getGroupRoomBean(groupId)));

    }

    @ReactMethod
    public void getRoomBean(final int roomId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getDataInstance().getRoomBean(roomId)));

    }

    @ReactMethod
    public void getDeviceRoomBean(final String devId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getDataInstance().getDeviceRoomBean(devId)));

    }

    @ReactMethod
    public void getGroupDeviceList(final int groupId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableArray(
                    JsonUtils.toJsonArray(TuyaHomeSdk.getDataInstance().getGroupDeviceList(groupId))));

    }

    @ReactMethod
    public void getMeshGroupList(final String meshId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableArray(
                    JsonUtils.toJsonArray(TuyaHomeSdk.getDataInstance().getMeshGroupList(meshId + ""))));

    }

    @ReactMethod
    public void getMeshDeviceList(final String meshId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableArray(
                    JsonUtils.toJsonArray(TuyaHomeSdk.getDataInstance().getMeshDeviceList(meshId))));

    }

    @ReactMethod
    public void getRoomDeviceList(final int roomId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableArray(
                    JsonUtils.toJsonArray(TuyaHomeSdk.getDataInstance().getRoomDeviceList(roomId))));

    }

    @ReactMethod
    public void getRoomGroupList(final int roomId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableArray(
                    JsonUtils.toJsonArray(TuyaHomeSdk.getDataInstance().getRoomGroupList(roomId))));

    }

    @ReactMethod
    public void getHomeBean(final int homeId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getDataInstance().getHomeBean(homeId)));

    }

    @ReactMethod
    public void getSubDeviceBean(final String devId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableArray(
                    JsonUtils.toJsonArray(TuyaHomeSdk.getDataInstance().getSubDeviceBean(devId))));

    }

    @ReactMethod
    public void getSubDeviceBeanByNodeId(final String devId, final String nodeId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getDataInstance().
                    getSubDeviceBeanByNodeId(devId, nodeId)));

    }


    @ReactMethod
    public void getDp(final String devId, final String dpId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getDataInstance().
                    getDp(devId, dpId)));
    }

    @ReactMethod
    public void getDps(final String devId, Promise promise) {
        promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getDataInstance().
                getDps(devId)));
    }

    @ReactMethod
    public void getSchema(final String devId, Promise promise) {
            promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getDataInstance().
                    getSchema(devId)));

    }

    @ReactMethod
    public void queryDev(final String devId, Promise promise) {
            TuyaHomeSdk.getDataInstance().queryDev(devId, new ITuyaDataCallback<DeviceBean>() {
                @Override
                public void onSuccess(DeviceBean result) {
                    promise.resolve(ReactUtils.parseToWritableMap(result));
                }

                @Override
                public void onError(String errorCode, String errorMessage) {
                    promise.reject(errorCode, errorMessage);
                }
            });

    }

    @ReactMethod
    public void discoveredLanDevice() {
        if (mITuyaSearchDeviceListener != null) {
            TuyaHomeSdk.getDataInstance().unRegisterDiscoveredLanDeviceListener(mITuyaSearchDeviceListener);
            mITuyaSearchDeviceListener = null;
        }

        mITuyaSearchDeviceListener = new ITuyaSearchDeviceListener() {
            @Override
            public void onDeviceFind(String devId, DeviceActiveEnum activeEnum) {
                WritableMap map = Arguments.createMap();
                map.putString("devId", devId);
                map.putInt("activeEnum", activeEnum.getType());
//                BridgeUtils.searchDevice(getReactApplicationContext(), map, "");
            }
        };
        TuyaHomeSdk.getDataInstance().discoveredLanDevice(mITuyaSearchDeviceListener);
    }

    @ReactMethod
    public void unRegisterDiscoveredLanDeviceListener() {
        if (mITuyaSearchDeviceListener != null) {
            TuyaHomeSdk.getDataInstance().unRegisterDiscoveredLanDeviceListener(mITuyaSearchDeviceListener);
            mITuyaSearchDeviceListener = null;
        }
    }
}
