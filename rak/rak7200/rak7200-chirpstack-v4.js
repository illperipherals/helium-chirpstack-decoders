// Decode uplink function.
//
// Input is an object with the following fields:
// - bytes = Byte array containing the uplink payload, e.g. [255, 230, 255, 0]
// - fPort = Uplink fPort.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - data = Object representing the decoded payload.

function decodeUplink(input) {
    let data = input.bytes;
    let fPort = input.fPort;
    let bytes = bytes2hexStr(data)
    return rakSensorDataDecode(bytes);
}

// convert bytes to hex string
function bytes2hexStr(bytes) {
    let data = Array.from(bytes, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
    return data;
}

// convert string to short integer
function parseShort(str, base) {
    var n = parseInt(str, base);
    return (n << 16) >> 16;
}

// convert string to triple bytes integer
function parseTriple(str, base) {
    var n = parseInt(str, base);
    return (n << 8) >> 8;
}

// decode Hex sensor string data to object
function rakSensorDataDecode(hexStr) {
    var str = hexStr;
    var myObj = {};

    while (str.length > 4) {
        var flag = parseInt(str.substring(0, 4), 16);
        switch (flag) {
        case 0x0768:// Humidity
            myObj.humidity = parseFloat(((parseShort(str.substring(4, 6), 16) * 0.01 / 2) * 100).toFixed(1));// + "%RH";//unit:%RH
            str = str.substring(6);
            break;
        case 0x0673:// Atmospheric pressure
            myObj.barometer = parseFloat((parseShort(str.substring(4, 8), 16) * 0.1).toFixed(2));// + "hPa";//unit:hPa
            str = str.substring(8);
            break;
        case 0x0267:// Temperature
            myObj.temperature = parseFloat((parseShort(str.substring(4, 8), 16) * 0.1).toFixed(2));// + "°C";//unit: °C
            str = str.substring(8);
            break;
        case 0x0188:// GPS
            myObj.latitude = parseFloat((parseTriple(str.substring(4, 10), 16) * 0.0001).toFixed(4));// + "°";//unit:°
            myObj.longitude = parseFloat((parseTriple(str.substring(10, 16), 16) * 0.0001).toFixed(4));// + "°";//unit:°
            myObj.altitude = parseFloat((parseTriple(str.substring(16, 22), 16) * 0.01).toFixed(1));// + "m";//unit:m
            str = str.substring(22);
            break;
        case 0x0371:// Triaxial acceleration
            myObj.acceleration_x = parseFloat((parseShort(str.substring(4, 8), 16) * 0.001).toFixed(3));// + "g";//unit:g
            myObj.acceleration_y = parseFloat((parseShort(str.substring(8, 12), 16) * 0.001).toFixed(3));// + "g";//unit:g
            myObj.acceleration_z = parseFloat((parseShort(str.substring(12, 16), 16) * 0.001).toFixed(3));// + "g";//unit:g
            str = str.substring(16);
            break;
        case 0x0402:// air resistance
            myObj.gasResistance = parseFloat((parseShort(str.substring(4, 8), 16) * 0.01).toFixed(2));// + "KΩ";//unit:KΩ
            str = str.substring(8);
            break;
        case 0x0802:// Battery Voltage
            myObj.battery = parseFloat((parseShort(str.substring(4, 8), 16) * 0.01).toFixed(2));// + "V";//unit:V
            str = str.substring(8);
            break;
        case 0x0586:// gyroscope
            myObj.gyroscope_x = parseFloat((parseShort(str.substring(4, 8), 16) * 0.01).toFixed(2));// + "°/s";//unit:°/s
            myObj.gyroscope_y = parseFloat((parseShort(str.substring(8, 12), 16) * 0.01).toFixed(2));// + "°/s";//unit:°/s
            myObj.gyroscope_z = parseFloat((parseShort(str.substring(12, 16), 16) * 0.01).toFixed(2));// + "°/s";//unit:°/s
            str = str.substring(16);
            break;
        case 0x0902:// magnetometer x
            myObj.magnetometer_x = parseFloat((parseShort(str.substring(4, 8), 16) * 0.01).toFixed(2));// + "μT";//unit:μT
            str = str.substring(8);
            break;
        case 0x0a02:// magnetometer y
            myObj.magnetometer_y = parseFloat((parseShort(str.substring(4, 8), 16) * 0.01).toFixed(2));// + "μT";//unit:μT
            str = str.substring(8);
            break;
        case 0x0b02:// magnetometer z
            myObj.magnetometer_z = parseFloat((parseShort(str.substring(4, 8), 16) * 0.01).toFixed(2));// + "μT";//unit:μT
            str = str.substring(8);
            break;
        default:
            str = str.substring(7);
            break;
        }
    }
    return {data: myObj};
}
