//% block="LED&KEY"
namespace tm1638 {

    let _stb = DigitalPin.P0;
    let _clk = DigitalPin.P1;
    let _dio = DigitalPin.P2;
    let _ON = 8;
    let _brightness = 4;
    let DIGITS: number[];

    //% blockId=TM1638_init
    //% block="LED&KEY pin connections STB $stb|CLK $clk|DIO $dio"
    //% block.loc.cs="LED&KEY připojení pinů STB $stb|CLK $clk|DIO $dio"
    export function init(stb: DigitalPin = DigitalPin.P0, clk: DigitalPin = DigitalPin.P1, dio: DigitalPin = DigitalPin.P2): void {
        DIGITS = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];
        _stb = stb;
        _clk = clk;
        _dio = dio;
        pins.setPull(_dio, PinPullMode.PullUp);
        pins.digitalWritePin(_clk, 1);
        pins.digitalWritePin(_dio, 0);
        pins.digitalWritePin(_stb, 1);
        clear();
        _ON = 8;
        _brightness = 4;
        _write_dsp_ctrl();
    }

    function _stbH() {
        pins.digitalWritePin(_stb, 1);
    }

    function _stbL() {
        pins.digitalWritePin(_stb, 0);
    }

    function _clkH() {
        pins.digitalWritePin(_clk, 1);
    }

    function _clkL() {
        pins.digitalWritePin(_clk, 0);
    }

    function _command(cmd: number) {
        _stbL();
        _write_byte(cmd);
        _stbH();
    }

    function _write_byte(b: number) {
        for (let i = 0; i < 8; i++) {
            _clkL();
            pins.digitalWritePin(_dio, (b >> i) & 1);
            _clkH();
        }
    }

    function _write_dsp_ctrl() {
        _command(0x80 | _ON | (_brightness & 7));
    }

    function _set_address(addr: number) {
        _write_byte(0xC0 | (addr & 0xF));
    }

    //% blockId=TM1638_clear
    //% block="Clear display and LEDs"
    //% block.loc.cs="Zhasni displej a LEDky"
    export function clear(): void {
        _command(0x40);
        _stbL();
        _set_address(0);
        for (let i = 0; i < 16; i++) {
            _write_byte(0);
        }
        _stbH();
    }

    //% blockId=TM1638_set_brightness
    //% block="Set display brightness to $b"
    //% block.loc.cs="Nastav jas displeje na $b"
    //% b.min=0 b.max=7
    export function setBrightness(b: number = 4): void {
        _brightness = b;
        _write_dsp_ctrl();
    }

    //% blockId=TM1638_set_led
    //% block="Turn LED $led|on/off $b"
    //% block.loc.cs="Rozsviť LED $led|$b"
    //% led.min=0 led.max=7
    export function setLED(led: number, b: boolean): void {
        _command(0x44);
        _stbL();
        _set_address((led << 1) + 1);
        _write_byte(b ? 1 : 0);
        _stbH();
    }

    //% blockId=TM1638_set_segment
    //% block="Set segment $segment|to $val"
    //% block.loc.cs="Nastav segment $segment|na $val"
    //% segment.min=0 segment.max=7
    //% val.min=0 val.max=255
    export function setSegment(segment: number, val: number): void {
        _command(0x44);
        _stbL();
        _set_address(segment << 1);
        _write_byte(val & 0xFF);
        _stbH();
    }

    //% blockId=TM1638_show_number
    //% block="Show a number $n on display"
    //% block.loc.cs="Zobraz číslo $n na displeji"
    export function showNumber(n: number): void {
        let x = n;
        for (let i = 7; i >= 0; i--) {
            const j = x % 10;
            setSegment(i, x > 0 || i == 7 ? DIGITS[j] : 0);
            x = Math.idiv(x, 10);
        }
    }

    //% blockId=TM1638_show_number_left
    //% block="Show a number $n on the left display"
    //% block.loc.cs="Zobraz číslo $n na levém displeji"
    export function showNumberLeft(n: number): void {
        _showNumber(0, n);
    }

    //% blockId=TM1638_show_number_right
    //% block="Show a number $n on the right display"
    //% block.loc.cs="Zobraz číslo $n na pravém displeji"
    export function showNumberRight(n: number) : void {
        _showNumber(4, n);
    }

    function _showNumber(offset: number, n: number) {
        let x = n;
        for (let i = 3; i >= 0; i--) {
            const j = x % 10;
            setSegment(offset + i, x > 0 || i == 3 ? DIGITS[j] : 0);
            x = Math.idiv(x, 10);
        }
    }
}

