// Tady jsou testy. Při použití tohoto balíčku jako rozšíření nebude zkompilováno.
let tm = new tm1638.TM1638(DigitalPin.P0, DigitalPin.P1, DigitalPin.P2);
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
tm.setLED(0, true);
tm.setLED(1, true);
tm.setLED(2, false);
tm.setLED(3, true);
tm.setLED(4, true);
tm.setLED(5, true);
tm.setLED(6, true);
tm.setLED(7, true);
tm.setDigit(0, 0x3f);
tm.setDigit(1, 0x3f);
tm.showNumberLeft(12);
tm.showNumberRight(53);