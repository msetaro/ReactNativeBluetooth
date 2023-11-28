import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";

interface BluetoothApi {
    requestPermissions(): Promise<boolean>;
    scanForDevices(): Promise<void>;
    foundDevices: Device[];
}


function useBle(): BluetoothApi {

    const bleManager = useMemo(() => new BleManager(), [])
    
    const [foundDevices, setFoundDevices] = useState<Device[]>([])

    const requestAPI31Permissions = async () => {
        const scanPermissions  = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Scan permissions",
                message: "App requires Bluetooth scan permissions to function",
                buttonPositive: "Ok"
            }
        )

        const connectPermissions  = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Connect permissions",
                message: "App requires Bluetooth connect permissions to function",
                buttonPositive: "Ok"
            }
        )

        const fineLocationPermissions  = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Fine location permissions",
                message: "App requires fine location permissions to function",
                buttonPositive: "Ok"
            }
        )

        return scanPermissions === PermissionsAndroid.RESULTS.granted && 
                connectPermissions === PermissionsAndroid.RESULTS.granted && 
                fineLocationPermissions === PermissionsAndroid.RESULTS.granted;
    }


    const requestPermissions = async () => {
        if(Platform.OS === "android") {
            if(ExpoDevice.platformApiLevel ?? -1 < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Fine location permissions",
                        message: "App requires fine location permissions to function",
                        buttonPositive: "Ok"
                    }
                )

                return granted === PermissionsAndroid.RESULTS.granted;
            }
            else {
                return requestAPI31Permissions();
            }
        }
        else {
            // Default to true for iOS because the permissions get requested on app launch
            return true;
        }
    }

    const scanForDevices = async () => {
        if(await requestPermissions()) {
            bleManager.startDeviceScan(null, null, (error, device) => {
                if(error) {
                    console.error(error);
                }

                if(device) {
                    setFoundDevices([...foundDevices, device])
                }
            });
        }
    };

    return {
        requestPermissions,
        scanForDevices,
        foundDevices
    }
}

export default useBle;