## EM300-TH

Temperature & Humidity Sensor

IP67 Waterproof<br />
LoRaWAN® Wireless<br />
5/10 Years Battery Life<br />
NFC for Configuring<br />

![EM300-TH!](https://thedxshop.com/wp-content/uploads/2021/10/em300-th.jpeg)

[EM300-TH](https://www.milesight-iot.com/lorawan/sensor/em300-th)

## Example Payload Decoders
Cayenne compatible: Yes/No/Unknown

```js
/*
 * Payload Decoder for Chirpstack and Milesight network server
 *
 * Copyright 2021 Milesight IoT
 * Editied Cory Callcott, cory@callref.com.au to work chirpstack v4
 *
 * @product EM300-TH
 */
function decodeUplink(input) {
  	let bytes = input.bytes;
    let decoded = {};

    for (let i = 0; i < bytes.length;) {
        let channel_id = bytes[i++];
        let channel_type = bytes[i++];

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            // ℃
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;

            // ℉
            // decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10 * 1.8 + 32;
            // i +=2;
        }
        // HUMIDITY
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = bytes[i] / 2;
            i += 1;
        } else {
            break;
        }
    }
    return {data: decoded};
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt16LE(bytes) {
    let value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    let ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

// Encode downlink function.
//
// Input is an object with the following fields:
// - data = Object representing the payload that must be encoded.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - bytes = Byte array containing the downlink payload.

function encodeDownlink(input) {
    let port = input.fPort;
    let downlink = input.bytes;
    return {bytes: downlink, fPort: port};
}

```

Please submit pull request to main repository to report/repair any bad links or to provide additional documentation or node reviews.