function Decode(fPort, bytes) {
    var data = {
        Latitude:
          (bytes[0]<<24 | bytes[1]<<16 | bytes[2]<<8 | bytes[3]) / 1000000,

        Longitude:
          (bytes[4]<<24 | bytes[5]<<16 | bytes[6]<<8 | bytes[7]) / 1000000,

        // Alarm status: boolean
        ALARM_status: (bytes[8] & 0x40) > 0,

        // Battery; 14 bits; unit: V
        BatV: ((bytes[8] & 0x3f)<<8 | bytes[9]) / 1000,

        // Motion detection mode; 2 bits
        MD: {
          "0": "Disable",
          "1": "Move",
          "2": "Collide",
          "3": "Custom"
        }[bytes[10]>>6],

        // LED status for position, uplink and downlink; 1 bit
        LON: (bytes[10] & 0x20) ? "ON" : "OFF",

        // Firmware version; 5 bits
        FW:150+(bytes[10] & 0x1f),

        // Roll; signed 16 bits integer, MSB; unit:
        // Sign-extend to 32 bits to support negative values: shift 16 bytes
        // too far to the left, followed by sign-propagating right shift
        Roll: (bytes[11]<<24>>16 | bytes[12]) / 100,

        // Pitch: signed 16 bits integer, MSB, unit:
        Pitch: (bytes[13]<<24>>16 | bytes[14]) / 100,
      };
        return data;
    }