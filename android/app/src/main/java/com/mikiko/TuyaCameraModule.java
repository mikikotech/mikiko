package com.mikiko;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ImageFormat;
import android.graphics.Rect;
import android.graphics.YuvImage;
import android.util.Base64;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.tuya.smart.android.camera.sdk.TuyaIPCSdk;
import com.tuya.smart.android.camera.sdk.api.ITuyaIPCCore;
import com.tuya.smart.camera.camerasdk.typlayer.callback.AbsP2pCameraListener;
import com.tuya.smart.camera.middleware.p2p.ITuyaSmartCameraP2P;
import com.tuya.smart.home.sdk.TuyaHomeSdk;
import com.tuya.smart.home.sdk.builder.TuyaCameraActivatorBuilder;
import com.tuya.smart.sdk.api.ITuyaActivatorGetToken;
import com.tuya.smart.sdk.api.ITuyaCameraDevActivator;
import com.tuya.smart.sdk.api.ITuyaSmartCameraActivatorListener;
import com.tuya.smart.sdk.bean.DeviceBean;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.util.Hashtable;

import static com.mikiko.utils.Constants.INTENT_DEV_ID;

public class TuyaCameraModule extends ReactContextBaseJavaModule {
    public TuyaCameraModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private ITuyaCameraDevActivator mTuyaActivator;
    private ITuyaSmartCameraP2P mCameraP2P;

    @NonNull
    @Override
    public String getName() {
        return "TuyaCameraModule";
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void cameraPairing(final int homeId, String ssid, String password, int timeout, Promise promise){
        TuyaHomeSdk.getActivatorInstance().getActivatorToken(homeId, new ITuyaActivatorGetToken() {

            @Override
            public void onSuccess(String token) {

                TuyaCameraActivatorBuilder builder = new TuyaCameraActivatorBuilder()
                        .setContext(getReactApplicationContext().getApplicationContext())
                        .setSsid(ssid)
                        .setPassword(password)
                        .setToken(token)
                        .setTimeOut(timeout)
                        .setListener(new ITuyaSmartCameraActivatorListener() {
                            @Override
                            public void onQRCodeSuccess(String qrcodeUrl) {
                                promise.resolve(qrcodeUrl);
                            }

                            @Override
                            public void onError(String errorCode, String errorMsg) {
                                promise.reject(errorCode, errorMsg);
                            }

                            @Override
                            public void onActiveSuccess(DeviceBean devResp) {
//                                promise.resolve(ReactUtils.parseToWritableMap(devResp));
                                sendEvent(getReactApplicationContext(), "pair", ReactUtils.parseToWritableMap(devResp));
                            }
                        });
                mTuyaActivator = TuyaHomeSdk.getActivatorInstance().newCameraDevActivator(builder);
                mTuyaActivator.createQRCode();
                mTuyaActivator.start();
            }

            @Override
            public void onFailure(String s, String s1) {
                promise.reject(s, s1);
            }
        });
    }

    @ReactMethod
    public void stopPairing(){
        mTuyaActivator.stop();
        mTuyaActivator.onDestroy();
    }

    @ReactMethod
    public void isIPCDevice(final String devId, Promise promise){
        ITuyaIPCCore cameraInstance = TuyaIPCSdk.getCameraInstance();
        if (cameraInstance != null) {
            cameraInstance.isIPCDevice(devId);
            promise.resolve(ReactUtils.parseToWritableMap(cameraInstance.isIPCDevice(devId)));
        }else {
            promise.reject("error", "no IPC");
        }
    }

    @ReactMethod
    public void getP2PType(final String devId, Promise promise){
        ITuyaIPCCore cameraInstance = TuyaIPCSdk.getCameraInstance();
        if (cameraInstance != null) {
            cameraInstance.getP2PType(devId);
            promise.resolve(ReactUtils.parseToWritableMap(cameraInstance.getP2PType(devId)));
        }else {
            promise.reject("error", "no camera instance");
        }
    }

    @ReactMethod
    public void createCameraP2P(final String devId, Promise promise){
        ITuyaIPCCore cameraInstance = TuyaIPCSdk.getCameraInstance();
        if (cameraInstance != null) {
            cameraInstance.createCameraP2P(devId);
            promise.resolve(ReactUtils.parseToWritableMap(cameraInstance.createCameraP2P(devId)));
        }else {
            promise.reject("error", "no camera instance");
        }
    }

    @ReactMethod
    public void cameraDataStream(final String devId, Promise promise){
        mCameraP2P = null;
        ITuyaIPCCore cameraInstance = TuyaIPCSdk.getCameraInstance();
        if (cameraInstance != null) {
            mCameraP2P = cameraInstance.createCameraP2P(devId);
        }

        mCameraP2P.registerP2PCameraListener(new AbsP2pCameraListener() {
            @Override
            public void receiveFrameDataForMediaCodec(int avChannel, byte[] buf, int length, int pFrmNo, byte[] pFrmInfoBuf, boolean isIframe, int codecId) {
                super.receiveFrameDataForMediaCodec(avChannel, buf, length, pFrmNo, pFrmInfoBuf, isIframe, codecId);
            }

            @Override
            public void onReceiveAudioBufferData(int nSampleRate, int nChannelNum, int nBitWidth, long nTimeStamp, long progress, long duration) {
                super.onReceiveAudioBufferData(nSampleRate, nChannelNum, nBitWidth, nTimeStamp, progress, duration);
            }

//            @Override
//            public void onReceiveFrameYUVData(int sessionId, ByteBuffer y, ByteBuffer u, ByteBuffer v, TuyaVideoFrameInfo videoFrameInfo, Object camera) {
//                super.onReceiveFrameYUVData(sessionId, y, u, v, videoFrameInfo, camera);
//            }

            @Override
            public void onReceiveFrameYUVData(int sessionId, ByteBuffer y, ByteBuffer u, ByteBuffer v, int width, int height, int nFrameRate, int nIsKeyFrame, long timestamp, long nProgress, long nDuration, Object camera) {
                super.onReceiveFrameYUVData(sessionId, y, u, v, width, height, nFrameRate, nIsKeyFrame, timestamp, nProgress, nDuration, camera);

//                ByteBuffer ib = ByteBuffer.allocate((height * width) * 2);
//
//                ib.put(y);
//                ib.put(u);
//                ib.put(v);

//                byte[] yuvStream = new byte[y.capacity() + u.capacity() + v.capacity()];
//                ByteArrayOutputStream out = new ByteArrayOutputStream();
//                YuvImage yuvImage = new YuvImage(ib.array(), ImageFormat.NV21, width, height, null);
//                yuvImage.compressToJpeg(new Rect(0, 0, width, height), 50, out);
//                byte[] imageBytes = out.toByteArray();
//                Bitmap bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
//
//                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//                bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
//
//                String base64Image = Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);
//
//                promise.resolve(base64Image);
//
//                sendEvent(getReactApplicationContext(), "streamData", ReactUtils.parseToWritableMap(base64Image));
            }

            @Override
            public void onSessionStatusChanged(Object camera, int sessionId, int sessionStatus) {
                super.onSessionStatusChanged(camera, sessionId, sessionStatus);
            }

            @Override
            public void onReceiveSpeakerEchoData(ByteBuffer pcm, int sampleRate) {
                super.onReceiveSpeakerEchoData(pcm, sampleRate);
            }
        });
    }

    @ReactMethod
    public void openIPC(final String devId){

        Intent intent = new Intent(getCurrentActivity(), CameraActivity.class);
        intent.putExtra("devId", devId);



//        CameraUtils.init(getCurrentActivity().getApplication());
//        CameraUtils.ipcProcess(getReactApplicationContext(), devId);

//        Intent intent = new Intent(getCurrentActivity(), CameraPanelActivity.class);
//        intent.putExtra(INTENT_DEV_ID, devId);

        getCurrentActivity().startActivity(intent);
    }
}
