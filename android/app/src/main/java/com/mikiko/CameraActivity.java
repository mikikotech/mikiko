package com.mikiko;


import static com.mikiko.utils.Constants.ARG1_OPERATE_FAIL;
import static com.mikiko.utils.Constants.ARG1_OPERATE_SUCCESS;
import static com.mikiko.utils.Constants.MSG_SCREENSHOT;
import static com.mikiko.utils.Constants.MSG_SET_CLARITY;
import static com.mikiko.utils.Constants.MSG_TALK_BACK_BEGIN;
import static com.mikiko.utils.Constants.MSG_TALK_BACK_OVER;
import static com.mikiko.utils.Constants.MSG_VIDEO_RECORD_BEGIN;
import static com.mikiko.utils.Constants.MSG_VIDEO_RECORD_FAIL;
import static com.mikiko.utils.Constants.MSG_VIDEO_RECORD_OVER;

import android.Manifest;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.mikiko.utils.Constants;
import com.mikiko.utils.MessageUtil;
import com.tuya.smart.android.camera.sdk.TuyaIPCSdk;
import com.tuya.smart.android.camera.sdk.api.ITuyaIPCCore;
import com.tuya.smart.camera.camerasdk.typlayer.callback.AbsP2pCameraListener;
import com.tuya.smart.camera.camerasdk.typlayer.callback.OperationDelegateCallBack;
import com.tuya.smart.camera.ipccamerasdk.p2p.ICameraP2P;
import com.tuya.smart.camera.middleware.p2p.ITuyaSmartCameraP2P;
import com.tuya.smart.camera.middleware.widget.AbsVideoViewCallback;
import com.tuya.smart.camera.middleware.widget.TuyaCameraView;

import java.io.File;
import java.nio.ByteBuffer;

public class CameraActivity extends AppCompatActivity {

    private static final String TAG = "CameraPanelActivity";
    private TuyaCameraView mVideoView;
//    private Button btnSpeak;

    private ImageView muteImg, speakTxt, snapshotImg, recordImg;
    private TextView qualityTv;
//    private TextView ;


    private int previewMute = ICameraP2P.MUTE;
    private int videoClarity = ICameraP2P.HD;

    private boolean isPlay = false;
    private boolean isSpeaking = false;
    private boolean isRecording = false;

    private String devId;
    private ITuyaSmartCameraP2P mCameraP2P;

    public static final int EXTERNAL_STORAGE_REQ_CODE = 10;
    public static final int EXTERNAL_AUDIO_REQ_CODE = 11;

    public static final int ARG1_OPERATE_SUCCESS = 0;
    public static final int ARG1_OPERATE_FAIL = 1;

    public static final int MSG_CONNECT = 2033;
    public static final int MSG_CREATE_DEVICE = 2099;
    public static final int MSG_SET_CLARITY = 2054;

    public static final int MSG_TALK_BACK_FAIL = 2021;
    public static final int MSG_TALK_BACK_BEGIN = 2022;
    public static final int MSG_TALK_BACK_OVER = 2023;
    public static final int MSG_DATA_DATE = 2035;

    public static final int MSG_MUTE = 2024;
    public static final int MSG_SCREENSHOT = 2017;

    public static final int MSG_VIDEO_RECORD_FAIL = 2018;
    public static final int MSG_VIDEO_RECORD_BEGIN = 2019;
    public static final int MSG_VIDEO_RECORD_OVER = 2020;


    public static final int MSG_DATA_DATE_BY_DAY_SUCC = 2045;
    public static final int MSG_DATA_DATE_BY_DAY_FAIL = 2046;

    public static final int ALARM_DETECTION_DATE_MONTH_FAILED = 2047;
    public static final int ALARM_DETECTION_DATE_MONTH_SUCCESS = 2048;
    public static final int MSG_GET_ALARM_DETECTION = 2049;
    public static final int MOTION_CLASSIFY_FAILED = 2050;
    public static final int MOTION_CLASSIFY_SUCCESS = 2051;
    public static final int MSG_DELETE_ALARM_DETECTION = 2052;
    public static final int MSG_GET_VIDEO_CLARITY = 2053;

    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case MSG_CONNECT:
                    handleConnect(msg);
                    break;
            }
            super.handleMessage(msg);
        }
    };



    private void handleConnect(Message msg) {
        if (msg.arg1 == ARG1_OPERATE_SUCCESS) {
            preview();
        } else {
//            ToastUtil.shortToast(CameraPanelActivity.this, getString(R.string.connect_failed));
        }
    }


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camera);

        initView();
        initData();

        listener();
    }

    private void initView() {
        mVideoView = findViewById(R.id.camera_video_view);
        mVideoView.setCameraViewDoubleClickEnable(false);

//        butnMute = findViewById(R.id.button3);
//        btnSpeak = findViewById(R.id.button4);

        muteImg = findViewById(R.id.camera_mute);
        qualityTv = findViewById(R.id.camera_quality);

        speakTxt = findViewById(R.id.camera_mic_btn);

        snapshotImg = findViewById(R.id.camera_photo_btn);

        recordImg = findViewById(R.id.camera_record_btn);

//        speakImg = findViewById(R.id.camera_mic_btn);
//        speakImg.setEnabled(true);
    }

    private void initData() {
        devId = getIntent().getStringExtra("devId");
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
        if (null == mCameraP2P) {
//            showNotSupportToast();
        } else {

        }
    }

    private void listener(){
        muteImg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                muteClick();

                muteImg.setSelected(previewMute == ICameraP2P.MUTE);
            }
        });

//        btnSpeak.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                speakClick();
//            }
//        });

        qualityTv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setVideoClarity();
            }
        });

        speakTxt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                speakClick();

                speakTxt.setSelected(isSpeaking);
            }
        });

        snapshotImg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                snapShotClick();
            }
        });

        recordImg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                recordClick();

                recordImg.setSelected(isRecording);
            }
        });

//        speakImg.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                speakClick();
//
//                speakImg.setSelected(isSpeaking);
//            }
//        });
    }

    private void preview() {
        mCameraP2P.startPreview(videoClarity, new OperationDelegateCallBack() {
            @Override
            public void onSuccess(int sessionId, int requestId, String data) {
                isPlay = true;
            }

            @Override
            public void onFailure(int sessionId, int requestId, int errCode) {
                isPlay = false;
            }
        });
    }

    private void muteClick() {
        int mute;
        mute = previewMute == ICameraP2P.MUTE ? ICameraP2P.UNMUTE : ICameraP2P.MUTE;
        mCameraP2P.setMute(mute, new OperationDelegateCallBack() {
            @Override
            public void onSuccess(int sessionId, int requestId, String data) {
                previewMute = Integer.valueOf(data);
//                mHandler.sendMessage(ReactUtils.getMessage(MSG_MUTE, ARG1_OPERATE_SUCCESS));
            }

            @Override
            public void onFailure(int sessionId, int requestId, int errCode) {
//                mHandler.sendMessage(ReactUtils.getMessage(MSG_MUTE, ARG1_OPERATE_FAIL));
            }
        });
    }

    private void speakClick() {

//        mCameraP2P.startAudioTalk(new OperationDelegateCallBack() {
//            @Override
//            public void onSuccess(int sessionId, int requestId, String data) {
//                isSpeaking = true;
//            }
//
//            @Override
//            public void onFailure(int sessionId, int requestId, int errCode) {
//                isSpeaking = false;
//            }
//        });

        if (isSpeaking) {
            mCameraP2P.stopAudioTalk(new OperationDelegateCallBack() {
                @Override
                public void onSuccess(int sessionId, int requestId, String data) {
                    isSpeaking = false;
                }

                @Override
                public void onFailure(int sessionId, int requestId, int errCode) {
                    isSpeaking = false;

                }
            });
        } else {
            mCameraP2P.startAudioTalk(new OperationDelegateCallBack() {
                @Override
                public void onSuccess(int sessionId, int requestId, String data) {
                    isSpeaking = true;
                }

                @Override
                public void onFailure(int sessionId, int requestId, int errCode) {
                    isSpeaking = false;
                }
            });
        }
    }

    private void snapShotClick() {
        String picPath = getExternalFilesDir(null).getPath() + "/" + devId;
        File file = new File(picPath);
        if (!file.exists()) {
            file.mkdirs();
        }
        String fileName = System.currentTimeMillis() + ".jpg";
        mCameraP2P.snapshot(picPath, fileName, CameraActivity.this, new OperationDelegateCallBack() {
            @Override
            public void onSuccess(int sessionId, int requestId, String data) {
                Log.i(TAG, "snapshot :" + data);
            }

            @Override
            public void onFailure(int sessionId, int requestId, int errCode) {
            }
        });
    }

    private void recordClick() {
        if (!isRecording) {
            String picPath = getExternalFilesDir(null).getPath() + "/" + devId;
            File file = new File(picPath);
            if (!file.exists()) {
                file.mkdirs();
            }
            String fileName = System.currentTimeMillis() + ".mp4";
            mCameraP2P.startRecordLocalMp4(picPath, fileName, CameraActivity.this, new OperationDelegateCallBack() {
                @Override
                public void onSuccess(int sessionId, int requestId, String data) {
                    isRecording = true;
//                    mHandler.sendEmptyMessage(MSG_VIDEO_RECORD_BEGIN);
                    //returns the recorded thumbnail path （.jpg）
                    Log.i(TAG, "record :" + data);
                }

                @Override
                public void onFailure(int sessionId, int requestId, int errCode) {
//                    mHandler.sendEmptyMessage(MSG_VIDEO_RECORD_FAIL);
                }
            });
//            recordStatue(true);
        } else {
            mCameraP2P.stopRecordLocalMp4(new OperationDelegateCallBack() {
                @Override
                public void onSuccess(int sessionId, int requestId, String data) {
                    isRecording = false;
                    mHandler.sendMessage(MessageUtil.getMessage(MSG_VIDEO_RECORD_OVER, ARG1_OPERATE_SUCCESS));
                }

                @Override
                public void onFailure(int sessionId, int requestId, int errCode) {
                    isRecording = false;
                    mHandler.sendMessage(MessageUtil.getMessage(MSG_VIDEO_RECORD_OVER, ARG1_OPERATE_FAIL));
                }
            });
//            recordStatue(false);
        }
    }

    private void setVideoClarity() {
        mCameraP2P.setVideoClarity(videoClarity == ICameraP2P.HD ? ICameraP2P.STANDEND : ICameraP2P.HD, new OperationDelegateCallBack() {
            @Override
            public void onSuccess(int sessionId, int requestId, String data) {
                videoClarity = Integer.valueOf(data);

                if(videoClarity == 2){
                    qualityTv.setText(R.string.sd);
                } else if(videoClarity == 4) {
                    qualityTv.setText(R.string.hd);
                }
//                mHandler.sendMessage(MessageUtil.getMessage(MSG_SET_CLARITY, ARG1_OPERATE_SUCCESS));
            }

            @Override
            public void onFailure(int sessionId, int requestId, int errCode) {
//                mHandler.sendMessage(MessageUtil.getMessage(MSG_SET_CLARITY, ARG1_OPERATE_FAIL));
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        mVideoView.onResume();
        //must register again,or can't callback
        if (null != mCameraP2P) {
            mCameraP2P.registerP2PCameraListener(p2pCameraListener);
            mCameraP2P.generateCameraView(mVideoView.createdView());
            if (mCameraP2P.isConnecting()) {
                mCameraP2P.startPreview(new OperationDelegateCallBack() {
                    @Override
                    public void onSuccess(int sessionId, int requestId, String data) {
                        isPlay = true;
                    }

                    @Override
                    public void onFailure(int sessionId, int requestId, int errCode) {
                    }
                });
            }
            if (!mCameraP2P.isConnecting()) {
                ITuyaIPCCore cameraInstance = TuyaIPCSdk.getCameraInstance();
                mCameraP2P.connect(devId, new OperationDelegateCallBack() {
                    @Override
                    public void onSuccess(int i, int i1, String s) {
                        mHandler.sendMessage(ReactUtils.getMessage(MSG_CONNECT, ARG1_OPERATE_SUCCESS));
                    }

                    @Override
                    public void onFailure(int i, int i1, int i2) {
                        mHandler.sendMessage(ReactUtils.getMessage(MSG_CONNECT, ARG1_OPERATE_FAIL));
                    }
                });
            }
        }
    }

    private AbsP2pCameraListener p2pCameraListener = new AbsP2pCameraListener() {
        @Override
        public void onReceiveSpeakerEchoData(ByteBuffer pcm, int sampleRate) {
            if (null != mCameraP2P) {
                int length = pcm.capacity();
                byte[] pcmData = new byte[length];
                pcm.get(pcmData, 0, length);
                mCameraP2P.sendAudioTalkData(pcmData, length);
            }
        }
    };

    @Override
    protected void onPause() {
        super.onPause();
        mVideoView.onPause();
        if (null != mCameraP2P) {
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

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (null != mHandler) {
            mHandler.removeCallbacksAndMessages(null);
        }
        if (null != mCameraP2P) {
            mCameraP2P.destroyP2P();
        }
    }
}