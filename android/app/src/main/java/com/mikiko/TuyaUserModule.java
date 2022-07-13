package com.mikiko;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.tuya.smart.android.user.api.IBooleanCallback;
import com.tuya.smart.android.user.api.IGetRegionCallback;
import com.tuya.smart.android.user.api.ILoginCallback;
import com.tuya.smart.android.user.api.ILogoutCallback;
import com.tuya.smart.android.user.api.IReNickNameCallback;
import com.tuya.smart.android.user.api.IRegisterCallback;
import com.tuya.smart.android.user.api.IResetPasswordCallback;
import com.tuya.smart.android.user.api.IWhiteListCallback;
import com.tuya.smart.android.user.bean.Region;
import com.tuya.smart.android.user.bean.User;
import com.tuya.smart.android.user.bean.WhiteList;
import com.tuya.smart.home.sdk.TuyaHomeSdk;
import com.tuya.smart.sdk.api.IResultCallback;
import com.tuya.smart.sdk.enums.TempUnitEnum;

import java.io.File;

import javax.annotation.Nonnull;

public class TuyaUserModule extends ReactContextBaseJavaModule {
    public TuyaUserModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "TuyaUserModule";
    }

    @ReactMethod
    public void getUser(Promise promise) {
        if (TuyaHomeSdk.getUserInstance().getUser() != null) {
            promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getUserInstance().getUser()));
        } else {
            promise.reject("user null", "user null");
        }
    }

    @ReactMethod
    public void isLogin(Promise promise) {
        promise.resolve(TuyaHomeSdk.getUserInstance().isLogin());
    }

    @ReactMethod
    public void loginWithPhone(final String countryCode, final String phoneNumber, final String code, Promise promise) {
            TuyaHomeSdk.getUserInstance().loginWithPhone(countryCode, phoneNumber, code, new ILoginCallback() {
                @Override
                public void onSuccess(User user) {
                    promise.resolve(ReactUtils.parseToWritableMap(user));
                }

                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }
            });
    }

    @ReactMethod
    public void loginWithEmail(final String countryId, final String Email, final String password, Promise promise){
        TuyaHomeSdk.getUserInstance().loginWithEmail(countryId, Email, password, new ILoginCallback(){
            @Override
            public void onSuccess(User user){
                Log.d("Success", "onSuccess: " + user);
                promise.resolve(ReactUtils.parseToWritableMap(user));
            };

            @Override
            public void onError(String code, String error){
                Log.d("fail", "failed: " + error);
                promise.reject(code, error);
            }
        });
    }

    @ReactMethod
    public void sendVerifyCodeWithUserName(final String countryCode,final String email, Promise promise){
        TuyaHomeSdk.getUserInstance().sendVerifyCodeWithUserName(email, "", countryCode, 1, new IResultCallback() {
            @Override
            public void onError(String code, String error) {
                promise.reject(code, error);
            }

            @Override
            public void onSuccess() {
                promise.resolve("success get code");
            }
        });
    }

    @ReactMethod
    public void registerAccountWithEmail(final String countryCode,final String email,final String password,final String code, Promise promise){
        TuyaHomeSdk.getUserInstance().registerAccountWithEmail(countryCode, email, password, code, new IRegisterCallback() {
            @Override
            public void onSuccess(User user) {
                Log.d("Register Success", "onSuccess: " + user);
                promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getUserInstance().getUser()));
            }

            @Override
            public void onError(String code, String error) {
                Log.d("Register fail", "failed: " + error);
                promise.reject(code, error);
            }
        });
    }

    @ReactMethod
    public void loginWithPhonePassword(final String countryCode, final String phoneNumber, final String password, Promise promise) {
            TuyaHomeSdk.getUserInstance().loginWithPhonePassword(countryCode, phoneNumber, password, new ILoginCallback() {
                @Override
                public void onSuccess(User user) {
                    promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getUserInstance().getUser()));
                }

                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }
            });
    }


    @ReactMethod
    public void registerAccountWithPhone(final String countryCode, final String phoneNumber, final String password, final String code, Promise promise) {
            TuyaHomeSdk.getUserInstance().registerAccountWithPhone(countryCode, phoneNumber, password, code, new IRegisterCallback() {
                @Override
                public void onSuccess(User user) {
                    promise.resolve(ReactUtils.parseToWritableMap(TuyaHomeSdk.getUserInstance().getUser()));
                }

                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }
            });
    }


    @ReactMethod
    public void resetEmailPassword(final String countryCode, final String email, final String password, final String emailCode, Promise promise) {
     TuyaHomeSdk.getUserInstance().resetEmailPassword(countryCode, email, emailCode, password, new IResetPasswordCallback() {
         @Override
         public void onSuccess() {
             promise.resolve("change password success");
         }

         @Override
         public void onError(String code, String error) {
            promise.reject(code, error);
         }
     });
    }

    @ReactMethod
    public void resetPhonePassword(final String countryCode, final String phoneNumber, final String password, final String newPassword, Promise promise) {
        TuyaHomeSdk.getUserInstance().resetPhonePassword(countryCode, phoneNumber, password, newPassword, new IResetPasswordCallback() {
            @Override
            public void onSuccess() {
                promise.resolve("change password success");
            }

            @Override
            public void onError(String code, String error) {
                promise.reject(code, error);
            }
        });
    }

    @ReactMethod
    public void loginByFacebook(final String countryCode, final String fbToken, Promise promise) {
        TuyaHomeSdk.getUserInstance().loginByFacebook(countryCode, fbToken, new ILoginCallback() {
            @Override
            public void onSuccess(User user) {
                promise.resolve(ReactUtils.parseToWritableMap(user));
            }

            @Override
            public void onError(String code, String error) {
                promise.reject(code, error);
            }
        });
    }

    @ReactMethod
    public void loginByGoogle(final String countryCode, final String ggToken, Promise promise){
        TuyaHomeSdk.getUserInstance().thirdLogin(countryCode, ggToken,"gg","{\"pubVersion\":1}", new ILoginCallback() {
            @Override
            public void onSuccess(User user) {
                promise.resolve(ReactUtils.parseToWritableMap(user));
            }
            @Override
            public void onError(String code, String error) {
                promise.reject(code, error);
            }
        });

    }

    @ReactMethod
    public void getListCountry(Promise promise){
        TuyaHomeSdk.getUserInstance().getWhiteListWhoCanSendMobileCodeSuccess(new IWhiteListCallback() {
            @Override
            public void onSuccess(WhiteList whiteList) {
                promise.resolve(ReactUtils.parseToWritableMap(whiteList));
            }

            @Override
            public void onError(String code, String error) {
                promise.reject(code, error);
            }
        });
    }

    /* logout */
    @ReactMethod
    public void logout(final Promise promise) {
        TuyaHomeSdk.getUserInstance().logout(new ILogoutCallback() {
            @Override
            public void onSuccess() {
                promise.resolve("logout");
            }

            @Override
            public void onError(String code, String error) {
                promise.reject(code, error);
            }
        });
    }

    @ReactMethod
    public void removeUser(Promise promise) {
        promise.resolve(TuyaHomeSdk.getUserInstance().removeUser());
    }

    @ReactMethod
    public void updateTimeZone(final String timezoneId, Promise promise) {
            TuyaHomeSdk.getUserInstance().updateTimeZone(timezoneId, new IResultCallback() {
                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }

                @Override
                public void onSuccess() {
                    promise.resolve("success update timezone");
                }
            });
    }

    @ReactMethod
    public void setTempUnitCelcius( Promise promise) {
            TuyaHomeSdk.getUserInstance().setTempUnit(TempUnitEnum.Celsius, new IResultCallback() {
                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }

                @Override
                public void onSuccess() {
                    promise.resolve("success update temp");
                }
            });
    }

    @ReactMethod
    public void setTempUnitFahrenheit( Promise promise) {
        TuyaHomeSdk.getUserInstance().setTempUnit(TempUnitEnum.Fahrenheit, new IResultCallback() {
            @Override
            public void onError(String code, String error) {
                promise.reject(code, error);
            }

            @Override
            public void onSuccess() {
                promise.resolve("success update temp");
            }
        });
    }

    @ReactMethod
    public void uploadUserAvatar(final String filePath, Promise promise) {
        TuyaHomeSdk.getUserInstance().uploadUserAvatar(
                new File(filePath), new IBooleanCallback() {
                    @Override
                    public void onSuccess() {
                        promise.resolve("success update file");
                    }
                    @Override
                    public void onError(String code, String error) {
                        promise.reject(code, error);
                    }
                });
    }

    @ReactMethod
    public void updateNickName(final String nickName, Promise promise){
        TuyaHomeSdk.getUserInstance().updateNickName(nickName,
                new IReNickNameCallback() {
                    @Override
                    public void onSuccess() {
                        promise.resolve("update nickname success");
                    }
                    @Override
                    public void onError(String code, String error) {
                        promise.reject(code, error);
                    }
                });

    }

    @ReactMethod
    public void updateUserInfo(Promise promise){
        TuyaHomeSdk.getUserInstance().updateUserInfo(new IResultCallback() {
            @Override
            public void onError(String code, String error) {
                promise.reject(code, error);
            }

            @Override
            public void onSuccess() {
                User user = TuyaHomeSdk.getUserInstance().getUser();
                promise.resolve(ReactUtils.parseToWritableMap(user));
            }
        });

    }

    @ReactMethod
    public void checkVersionUpgrade(Promise promise) {
        promise.resolve(TuyaHomeSdk.getUserInstance().checkVersionUpgrade());
    }


    @ReactMethod
    public void onDestroy() {
        TuyaHomeSdk.getUserInstance().onDestroy();
    }

    @ReactMethod
    public void getRegionListWithCountryCode(final String countryCode, Promise promise) {
            TuyaHomeSdk.getUserInstance().getRegionListWithCountryCode(countryCode, new IGetRegionCallback() {
                @Override
                public void onSuccess(Region regionList) {
                    promise.resolve(ReactUtils.parseToWritableMap(regionList));
                }

                @Override
                public void onError(String code, String error) {
                    promise.reject(code, error);
                }
            });
    }
}
