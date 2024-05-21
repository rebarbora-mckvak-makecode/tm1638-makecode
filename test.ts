// Tady jsou testy. Při použití tohoto balíčku jako rozšíření nebude zkompilováno.
tm1638.init(DigitalPin.P0, DigitalPin.P1, DigitalPin.P2);
/*tm._command(0x44);
tm._stbL();
tm._set_address(4);
tm._write_byte(0x77);
tm._stbH();

tm._command(0x40);
tm._stbL();
tm._set_address(0);
for (let i = 0; i < 8; i++) {
    tm._write_byte(0x77);
    tm._write_byte(1);
}
tm._stbH();
*/
// tm1638.setLED(0, true);
// tm1638.setLED(1, true);
// tm1638.setLED(2, false);
// tm1638.setLED(3, true);
// tm1638.setLED(4, true);
tm1638.showNumberLeft(12);
tm1638.showNumberRight(50);
let x = 0;
let y = 0;
tm1638.onButtonPressEvent((index) => {
    // led.toggle(x++, y);
    // if (x == 5) {
    //     x = 0;
    //     y++;
    //     if (y == 5)
    //         y = 0;
    // }
    // basic.showNumber(index);
    // tm1638.showNumberRight(index);
    if (rozsvicene_ledky[index] == 0) {
        rozsvicene_ledky[index] = 1
        tm1638.setLED(index, true)
    } else {
        rozsvicene_ledky[index] = 0
        tm1638.setLED(index, false)
    }
});
let rozsvicene_ledky: number[] = []
for (let i = 1; i <= 8; i++)
    rozsvicene_ledky[i] = 0;

// while (true) {
//     let k = tm1638.keys();
//     tm1638.showNumberRight(k);
//     basic.pause(10)
// }
