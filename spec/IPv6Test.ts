
import {Validator} from "../src/Validator";
import * as bigInt from "big-integer";
import {IPv6} from "../src/IPv6";

describe('IPv6: ', () => {
    it('should instantiate by calling constructor', () => {
        // with big Integer
        let iPv6 = new IPv6(bigInt("1".repeat(128), 2));
        expect(iPv6.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        iPv6.getHexadecatet().forEach(hexadecatet => {
            expect(hexadecatet.toString()).toEqual("ffff");
        })
        // with hexadecimal string
        let iPv6Value = new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(iPv6Value.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
    });

    it('should instantiate by calling fromBigInteger', () => {
        let bigIntegerValue = bigInt("42540766411282592856903984951653826560");
        let iPv6 = IPv6.fromBigInteger(bigIntegerValue);
        expect(iPv6.toString()).toEqual("2001:db8:0:0:0:0:0:0");
        let hexadecatets = iPv6.getHexadecatet();

        expect(hexadecatets[0].toString()).toEqual("2001");
        expect(hexadecatets[1].toString()).toEqual("db8");
        expect(hexadecatets[2].toString()).toEqual("0");
        expect(hexadecatets[3].toString()).toEqual("0");
        expect(hexadecatets[4].toString()).toEqual("0");
        expect(hexadecatets[5].toString()).toEqual("0");
        expect(hexadecatets[6].toString()).toEqual("0");
        expect(hexadecatets[7].toString()).toEqual("0");

    });

    it('should instantiate by calling fromHexadecimal', () => {
        let iPv6 = IPv6.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(iPv6.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        iPv6.getHexadecatet().forEach(hexadecatet => {
            expect(hexadecatet.toString()).toEqual("ffff");
        })
    });

    it('should correctly return the right value', () => {
        let bigIntegerValue = bigInt("1".repeat(128), 2);
        let iPv6 = IPv6.fromBigInteger(bigIntegerValue);
        expect(iPv6.getValue()).toEqual(bigIntegerValue);
    });

    it('should correctly return the next value when nextIPAddress is called', () => {
        let iPv6 = IPv6.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffe");
        expect(iPv6.nextIPAddress().toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
    });

    it('should correctly return the previous value when previousIPAddress is called', () => {
        let iPv6 = IPv6.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffe");
        expect(iPv6.previousIPAddress().toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffd");
    });

    it('should throw exception when calling next leads to an invalid IPv4', () => {
        let value = IPv6.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(() => {
            value.nextIPAddress();
        }).toThrowError(Error, Validator.invalidIPv6NumberMessage);
    });

    it('should throw exception when calling previous leads to an invalid IPv4', () => {
        let value = IPv6.fromHexadecimalString("::000");
        expect(() => {
            value.previousIPAddress();
        }).toThrowError(Error, Validator.invalidIPv6NumberMessage);
    });

    it('should correctly tell if there is a next value for an IPv6', () => {
        let value: IPv6 = IPv6.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffe");
        expect(value.hasNext()).toBe(true);
        expect(value.nextIPAddress().hasNext()).toBe(false);
    });

    it('should correctly tell if there is a previous value for an IPv6', () => {
        let value = IPv6.fromHexadecimalString("::001");
        expect(value.hasPrevious()).toBe(true);
        expect(value.previousIPAddress().hasPrevious()).toBe(false);
    });

    it('should correctly check equality related operations', () => {
        expect(IPv6.fromBigInteger(bigInt("100")).isLessThan(IPv6.fromBigInteger(bigInt("200")))).toEqual(true);
        expect(IPv6.fromBigInteger(bigInt("200")).isLessThan(IPv6.fromBigInteger(bigInt("100")))).toEqual(false);
        expect(IPv6.fromBigInteger(bigInt("200")).isLessThan(IPv6.fromBigInteger(bigInt("200")))).toEqual(false);

        expect(IPv6.fromBigInteger(bigInt("1234")).isLessThanOrEquals(IPv6.fromBigInteger(bigInt("12345")))).toEqual(true);
        expect(IPv6.fromBigInteger(bigInt("12345")).isLessThanOrEquals(IPv6.fromBigInteger(bigInt("1234")))).toEqual(false);
        expect(IPv6.fromBigInteger(bigInt("12345")).isLessThanOrEquals(IPv6.fromBigInteger(bigInt("12345")))).toEqual(true);

        expect(IPv6.fromBigInteger(bigInt("1234")).isEquals(IPv6.fromBigInteger(bigInt("1234")))).toEqual(true);
        expect(IPv6.fromBigInteger(bigInt("1234")).isEquals(IPv6.fromBigInteger(bigInt("12345")))).toEqual(false);

        expect(IPv6.fromBigInteger(bigInt("1234")).isGreaterThan(IPv6.fromBigInteger(bigInt("12345")))).toEqual(false);
        expect(IPv6.fromBigInteger(bigInt("12345")).isGreaterThan(IPv6.fromBigInteger(bigInt("1234")))).toEqual(true);
        expect(IPv6.fromBigInteger(bigInt("12345")).isGreaterThan(IPv6.fromBigInteger(bigInt("12345")))).toEqual(false);

        expect(IPv6.fromBigInteger(bigInt("12345")).isGreaterThanOrEquals(IPv6.fromBigInteger(bigInt("1234")))).toEqual(true);
        expect(IPv6.fromBigInteger(bigInt("1234")).isGreaterThanOrEquals(IPv6.fromBigInteger(bigInt("12345")))).toEqual(false);
        expect(IPv6.fromBigInteger(bigInt("12345")).isGreaterThanOrEquals(IPv6.fromBigInteger(bigInt("12345")))).toEqual(true);
    });
});