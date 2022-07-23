package com.mikiko.nativeUI;

import android.content.Context;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.mikiko.R;
import com.mikiko.ReactUtils;
import com.tuya.smart.android.camera.sdk.TuyaIPCSdk;
import com.tuya.smart.android.camera.sdk.api.ITuyaIPCCore;
import com.tuya.smart.camera.camerasdk.typlayer.callback.AbsP2pCameraListener;
import com.tuya.smart.camera.camerasdk.typlayer.callback.OperationDelegateCallBack;
import com.tuya.smart.camera.middleware.p2p.ITuyaSmartCameraP2P;
import com.tuya.smart.camera.middleware.widget.AbsVideoViewCallback;
import com.tuya.smart.camera.middleware.widget.TuyaCameraView;

import java.nio.ByteBuffer;

public class CameraView extends LinearLayout {

    private TuyaCameraView mVideoView;
    private ITuyaSmartCameraP2P mCameraP2P;

    private boolean isSpeaking = false;
//    private boolean isRecording = false;
    private boolean isPlay = false;

    private Context context;
    private String devId = "";

    public CameraView(@NonNull Context context) {
        super(context);

        inflate(context, R.layout.view_camera, this);

        mVideoView = findViewById(R.id.camera_view_layout);

        mVideoView.setViewCallback(new AbsVideoViewCallback() {
            @Override
            public void onCreated(Object o) {
                super.onCreated(o);
            }
        });


    }

    public void initData(String _devId){
        devId = _devId;

        ITuyaIPCCore cameraInstance = TuyaIPCSdk.getCameraInstance();
        if (cameraInstance != null) {
            mCameraP2P = cameraInstance.createCameraP2P(devId);
        }
        mVideoView.setViewCallback(new AbsVideoViewCallback() {
            @Override
            public void onCreated(Object o) {
                super.onCreated(o);
                if (null != mCameraP2P) {
                    mCameraP2P.generateCameraView(o);
                }
            }
        });
        mVideoView.createVideoView(devId);
    }
//    public void setDevId(String devId){
//        mVideoView.createVideoView(devId);
//    }

    public void onResumeStream(){
        mVideoView.onResume();
        //must register again,or can't callback
        if (null != mCameraP2P) {
            mCameraP2P.registerP2PCameraListener(p2pCameraListener);
            mCameraP2P.generateCameraView(mVideoView.createdView());
            if (mCameraP2P.isConnecting()) {
                mCameraP2P.startPreview(new OperationDelegateCallBack() {
                    @Override
                    public void onSuccess(int sessionId, int requestId, String data) {
//                        isPlay = true;
                    }

                    @Override
                    public void onFailure(int sessionId, int requestId, int errCode) {
//                        Log.d(TAG, "start preview onFailure, errCode: " + errCode);
                    }
                });
            }
            if (!mCameraP2P.isConnecting()) {
                ITuyaIPCCore cameraInstance = TuyaIPCSdk.getCameraInstance();

                mCameraP2P.connect(devId, new OperationDelegateCallBack() {
                    @Override
                    public void onSuccess(int i, int i1, String s) {
//                        mHandler.sendMessage(MessageUtil.getMessage(MSG_CONNECT, ARG1_OPERATE_SUCCESS));
                    }

                    @Override
                    public void onFailure(int i, int i1, int i2) {
//                        mHandler.sendMessage(MessageUtil.getMessage(MSG_CONNECT, ARG1_OPERATE_FAIL));
                    }
                });
            }
        }
    }

    public void onPause(){
        mVideoView.onPause();
        if (null != mCameraP2P) {
            if (isSpeaking) {
                mCameraP2P.stopAudioTalk(null);
            }
            if (isPlay) {
                mCameraP2P.stopPreview(new OperationDelegateCallBack() {
                    @Override
                    public void onSuccess(int sessionId, int requestId, String data) {

                    }

                    @Override
                    public void onFailure(int sessionId, int requestId, int errCode) {

                    }
                });
                isPlay = false;
            }
            mCameraP2P.removeOnP2PCameraListener();
            mCameraP2P.disconnect(new OperationDelegateCallBack() {
                @Override
                public void onSuccess(int i, int i1, String s) {

                }

                @Override
                public void onFailure(int i, int i1, int i2) {

                }
            });
        }
    }

    private AbsP2pCameraListener p2pCameraListener = new AbsP2pCameraListener() {
        @Override
        public void onReceiveSpeakerEchoData(ByteBuffer pcm, int sampleRate) {
            if (null != mCameraP2P) {
                int length = pcm.capacity();
//                Log.d(TAG, "receiveSpeakerEchoData pcmlength " + length + " sampleRate " + sampleRate);
                byte[] pcmData = new byte[length];
                pcm.get(pcmData, 0, length);
                mCameraP2P.sendAudioTalkData(pcmData, length);
            }
        }
    };

}
