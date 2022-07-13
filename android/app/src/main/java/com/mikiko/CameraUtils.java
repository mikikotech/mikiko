package com.mikiko;

import android.app.Application;
import android.content.Context;
import android.content.Intent;

import com.tuya.smart.android.camera.sdk.TuyaIPCSdk;
import com.tuya.smart.android.camera.sdk.api.ITuyaIPCCore;
import com.mikiko.utils.CameraDoorbellManager;
import com.mikiko.utils.FrescoManager;

import static com.mikiko.utils.Constants.INTENT_DEV_ID;

public final class CameraUtils {

    private CameraUtils() {

    }

    public static void init(Application application) {
        FrescoManager.initFresco(application);
        CameraDoorbellManager.getInstance().init(application);
    }

    public static boolean ipcProcess(Context context, String devId) {
        ITuyaIPCCore cameraInstance = TuyaIPCSdk.getCameraInstance();
        if (cameraInstance != null) {
            if (cameraInstance.isIPCDevice(devId)) {
                Intent intent = new Intent(context, CameraPanelActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.putExtra(INTENT_DEV_ID, devId);
                context.startActivity(intent);
                return true;
            }
        }
        return false;
    }
}
