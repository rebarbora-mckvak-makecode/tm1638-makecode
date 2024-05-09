namespace tm1638 {

    export class TM1638 {
        readonly DIGITS: number[];
        stb: DigitalPin;
        clk: DigitalPin;
        dio: DigitalPin;
        _ON: number;
        brightness: number;
        count: number;  // number of LEDs

        constructor(stb: DigitalPin, clk: DigitalPin, dio: DigitalPin) {
            this.stb = stb;
            this.clk = clk;
            this.dio = dio;
            // XXX: I did not find a way to make this a global variable
            this.DIGITS = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];
        }

        init(): void {
            pins.setPull(this.dio, PinPullMode.PullUp);
            pins.digitalWritePin(this.clk, 1);
            pins.digitalWritePin(this.dio, 0);
            pins.digitalWritePin(this.stb, 1);
            this.clear();
            this._ON = 8;
            this.brightness = 4;
            this._write_dsp_ctrl();
        }

        _stbH() {
            pins.digitalWritePin(this.stb, 1);
        }

        _stbL() {
            pins.digitalWritePin(this.stb, 0);
        }

        _clkH() {
            pins.digitalWritePin(this.clk, 1);
        }

        _clkL() {
            pins.digitalWritePin(this.clk, 0);
        }

        _command(cmd: number) {
            this._stbL();
            this._write_byte(cmd);
            this._stbH();
        }

        _write_byte(b: number) {
            for (let i = 0; i < 8; i++) {
                this._clkL();
                pins.digitalWritePin(this.dio, (b >> i) & 1);
                this._clkH();
            }
        }

        _write_dsp_ctrl() {
            this._command(0x80 | this._ON | (this.brightness & 7));
        }

        _set_address(addr: number) {
            this._write_byte(0xC0 | (addr & 0xF));
        }

        //% blockId=TM1638_clear
        //% block="Clear display and LEDs"
        clear() {
            this._command(0x40);
            this._stbL();
            this._set_address(0);
            for (let i = 0; i < 16; i++) {
                this._write_byte(0);
            }
            this._stbH();
        }

        //% blockId=TM1638_set_led
        //% block="Turn LED on/off"
        setLED(led: number, b: boolean) {
            this._command(0x44);
            this._stbL();
            this._set_address((led << 1) + 1);
            this._write_byte(b ? 1 : 0);
            this._stbH();
        }

        setDigit(segment: number, val: number) {
            this._command(0x44);
            this._stbL();
            this._set_address(segment << 1);
            this._write_byte(val & 0xFF);
            this._stbH();
        }

        //% blockId=TM1638_show_number
        //% block="Show a number on display"
        showNumber(n: number) {
            let x = n;
            for (let i = 7; i >= 0; i--) {
                const j = x % 10;
                this.setDigit(i, x > 0 || i == 7 ? this.DIGITS[j] : 0);
                x = Math.idiv(x, 10);
            }
        }

        //% blockId=TM1638_show_number_left
        //% block="Show a number on left display"
        showNumberLeft(n: number) {
            this._showNumber(0, n);
        }

        //% blockId=TM1638_show_number_right
        //% block="Show a number on right display"
        showNumberRight(n: number) {
            this._showNumber(4, n);
        }

        _showNumber(offset: number, n: number) {
            let x = n;
            for (let i = 3; i >= 0; i--) {
                const j = x % 10;
                this.setDigit(offset + i, x > 0 || i == 3 ? this.DIGITS[j] : 0);
                x = Math.idiv(x, 10);
            }
        }
    }

    //% blockId=TM1638_connect
    //% block="connect LED&KEY panel"
    export function create(stb: DigitalPin, clk: DigitalPin, dio: DigitalPin): TM1638 {
        return new TM1638(stb, clk, dio);
    }
}

