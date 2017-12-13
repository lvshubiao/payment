package com.pay;

import android.Manifest;
import android.app.Application;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.ReactApplication;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.theweflex.react.WeChatPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

import com.umeng.commonsdk.UMConfigure;

import com.pay.invokenative.DplusReactPackage;
import com.pay.invokenative.RNUMConfigure;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImageResizerPackage(),
            new WeChatPackage(),
            new VectorIconsPackage(),
            new ImagePickerPackage(),
            new DplusReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    UMConfigure.setLogEnabled(true);
    RNUMConfigure.init(this, "5a1e5e9b8f4a9d7290000052", "Umeng", UMConfigure.DEVICE_TYPE_PHONE,
    "");
    int i = Log.e("xxxxxx ","onCreate");
getDeviceInfo(this);


  }

   public static String getDeviceInfo(Context context) {

     try {
       org.json.JSONObject json = new org.json.JSONObject();
       android.telephony.TelephonyManager tm = (android.telephony.TelephonyManager) context
               .getSystemService(Context.TELEPHONY_SERVICE);
       String device_id = null;
       if (checkPermission(context, Manifest.permission.READ_PHONE_STATE)) {
         device_id = tm.getDeviceId();
       }
       String mac = null;
       FileReader fstream = null;
       try {
         fstream = new FileReader("/sys/class/net/wlan0/address");
       } catch (FileNotFoundException e) {
         fstream = new FileReader("/sys/class/net/eth0/address");
       }
       BufferedReader in = null;
       if (fstream != null) {
         try {
           in = new BufferedReader(fstream, 1024);
           mac = in.readLine();
         } catch (IOException e) {
         } finally {
           if (fstream != null) {
             try {
               fstream.close();
             } catch (IOException e) {
               e.printStackTrace();
             }
           }
           if (in != null) {
             try {
               in.close();
             } catch (IOException e) {
               e.printStackTrace();
             }
           }
         }
       }
       json.put("mac", mac);
       if (TextUtils.isEmpty(device_id)) {
         device_id = mac;
       }
       if (TextUtils.isEmpty(device_id)) {
         device_id = android.provider.Settings.Secure.getString(context.getContentResolver(),
                 android.provider.Settings.Secure.ANDROID_ID);
       }
       json.put("device_id", device_id);
       Log.e("xxxxxx ",device_id);
       return json.toString();
     } catch (Exception e) {
       e.printStackTrace();
     }
     return null;
   }
   public static boolean checkPermission(Context context, String permission) {
     boolean result = false;
     if (Build.VERSION.SDK_INT >= 23) {
       try {
         Class<?> clazz = Class.forName("android.content.Context");
         Method method = clazz.getMethod("checkSelfPermission", String.class);
         int rest = (Integer) method.invoke(context, permission);
         if (rest == PackageManager.PERMISSION_GRANTED) {
           result = true;
         } else {
           result = false;
         }
       } catch (Exception e) {
         result = false;
       }
     } else {
       PackageManager pm = context.getPackageManager();
       if (pm.checkPermission(permission, context.getPackageName()) == PackageManager.PERMISSION_GRANTED) {
         result = true;
       }
     }
     return result;
   }
}
