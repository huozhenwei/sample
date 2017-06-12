package com.sample;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.sample.u_share.UShareReactPackage;
import com.sample.u_share.util.Constants;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  {
    PlatformConfig.setWeixin(Constants.KEY_WEIXIN,Constants.SECRET_WEIXIN);
    PlatformConfig.setSinaWeibo(Constants.KEY_WEIBO, Constants.SECRET_WEIBO,"http://sns.whalecloud.com");
    PlatformConfig.setQQZone(Constants.KEY_QQ, Constants.SECRET_QQ);
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SplashScreenReactPackage(),
              new UShareReactPackage()
      );
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
    UMShareAPI.get(this);
  }
}
