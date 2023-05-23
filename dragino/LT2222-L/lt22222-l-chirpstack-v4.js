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
    //let port = input.fPort;
    let bytes = input.bytes;
    let hardware = (bytes[10] & 0xC0)>>6;
    let mode0 = bytes[10] & 0xff;
    let mode = bytes[10] & 0x3f;
    let decoded = {};

    if (hardware == '0') {
        decoded.Hardware_mode = "LT33222";
        decoded.DO3_status = (bytes[8] &0x04) ? "L":"H";
        if (mode0 == '1') {
            decoded.DI3_status = (bytes[8] &0x20) ? "H":"L";
        }
    }
    else if (hardware == '1') {
        decoded.Hardware_mode = "LT22222";
    }

    if (mode != 6) {
        decoded.DO1_status = (bytes[8] &0x01) ? "L":"H";
        decoded.DO2_status = (bytes[8] &0x02) ? "L":"H";
        decoded.RO1_status = (bytes[8] &0x80) ? "ON":"OFF";
        decoded.RO2_status = (bytes[8] &0x40) ? "ON":"OFF";
        if (mode != 1) {
            if (mode != 5) {
                decoded.Count1_times= (bytes[0]<<24 | bytes[1]<<16 | bytes[2]<<8 | bytes[3]);
            }
            decoded.First_status= (bytes[8] &0x20) ? "Yes":"No";
        }
    }

    if (mode == '1') {
        decoded.Work_mode = "2ACI+2AVI";
        decoded.AVI1_V  = parseFloat(((bytes[0]<<24>>16 | bytes[1])/1000).toFixed(3));
        decoded.AVI2_V  = parseFloat(((bytes[2]<<24>>16 | bytes[3])/1000).toFixed(3));
        decoded.ACI1_mA = parseFloat(((bytes[4]<<24>>16 | bytes[5])/1000).toFixed(3));
        decoded.ACI2_mA = parseFloat(((bytes[6]<<24>>16 | bytes[7])/1000).toFixed(3));
        decoded.DI1_status = (bytes[8] &0x08) ? "H":"L";
        decoded.DI2_status = (bytes[8] &0x10) ? "H":"L"
    }
    else if(mode == '2') {
        decoded.Work_mode = "Count mode 1";
        decoded.Count2_times = (bytes[4]<<24 | bytes[5]<<16 | bytes[6]<<8 | bytes[7]);
    }
    else if (mode == '3') {
        decoded.Work_mode = "2ACI+1Count";
        decoded.ACI1_mA = parseFloat(((bytes[4]<<24>>16 | bytes[5])/1000).toFixed(3));
        decoded.ACI2_mA = parseFloat(((bytes[6]<<24>>16 | bytes[7])/1000).toFixed(3));
    }
    else if (mode == '4') {
        decoded.Work_mode = "Count mode 2";
        decoded.Acount_times = (bytes[4]<<24 | bytes[5]<<16 | bytes[6]<<8 | bytes[7]);
    }
    else if (mode == '5') {
        decoded.Work_mode = " 1ACI+2AVI+1Count";
        decoded.AVI1_V  = parseFloat(((bytes[0]<<24>>16 | bytes[1])/1000).toFixed(3));
        decoded.AVI2_V  = parseFloat(((bytes[2]<<24>>16 | bytes[3])/1000).toFixed(3));
        decoded.ACI1_mA = parseFloat(((bytes[4]<<24>>16 | bytes[5])/1000).toFixed(3));
        decoded.Count1_times = bytes[6]<<8 | bytes[7];
    }
    else if (mode == '6') {
        decoded.Work_mode   = "Exit mode";
        decoded.Mode_status = bytes[9] ? "True":"False";
        decoded.AV1L_flag   = (bytes[0] &0x80) ? "True":"False";
        decoded.AV1H_flag   = (bytes[0] &0x40) ? "True":"False";
        decoded.AV2L_flag   = (bytes[0] &0x20) ? "True":"False";
        decoded.AV2H_flag   = (bytes[0] &0x10) ? "True":"False";
        decoded.AC1L_flag   = (bytes[0] &0x08) ? "True":"False";
        decoded.AC1H_flag   = (bytes[0] &0x04) ? "True":"False";
        decoded.AC2L_flag   = (bytes[0] &0x02) ? "True":"False";
        decoded.AC2H_flag   = (bytes[0] &0x01) ? "True":"False";
        decoded.AV1L_status = (bytes[1] &0x80) ? "True":"False";
        decoded.AV1H_status = (bytes[1] &0x40) ? "True":"False";
        decoded.AV2L_status = (bytes[1] &0x20) ? "True":"False";
        decoded.AV2H_status = (bytes[1] &0x10) ? "True":"False";
        decoded.AC1L_status = (bytes[1] &0x08) ? "True":"False";
        decoded.AC1H_status = (bytes[1] &0x04) ? "True":"False";
        decoded.AC2L_status = (bytes[1] &0x02) ? "True":"False";
        decoded.AC2H_status = (bytes[1] &0x01) ? "True":"False";
        decoded.DI2_status  = (bytes[2] &0x08) ? "True":"False";
        decoded.DI2_flag    = (bytes[2] &0x04) ? "True":"False";
        decoded.DI1_status  = (bytes[2] &0x02) ? "True":"False";
        decoded.DI1_flag    = (bytes[2] &0x01) ? "True":"False";
    }

    if (bytes.length == 11) {
        return {data: decoded};
    }
}

// Encode downlink function.
//
// Input is an object with the following fields:
// - data = Object representing the payload that must be encoded.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - bytes = Byte array containing the downlink payload.

/*****************************************
* downlink function not set or tested
******************************************/
function encodeDownlink(input) {
    let port = input.fPort;
    let bytes = input.bytes;

  return {data: bytes[255, 254, 253, 0], fPort: port};
}
