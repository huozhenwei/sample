package com.sample;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.sample.u_share.UShare;
import com.umeng.analytics.MobclickAgent;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "sample";
    }

    /**
     * 友盟统计集成
     */
    public void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }
    public void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        UShare.init(this);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        UShare.onActivityResult(requestCode,resultCode,data);
    }
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        UShare.onRequestPermissionsResult(requestCode,permissions,grantResults);
    }

}
