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
tm1638.setLED(0, true);
tm1638.setLED(1, true);
tm1638.setLED(2, false);
tm1638.setLED(3, true);
tm1638.setLED(4, true);
tm1638.showNumberLeft(12);
tm1638.showNumberRight(53);