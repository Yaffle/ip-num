"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var src_2 = require("../src");
var src_3 = require("../src");
var src_4 = require("../src");
describe('IPv4CidrRange: ', function () {
    it('should instantiate by calling constructor with IPv4 and prefix', function () {
        var ipv4CidrRange = new src_1.IPv4CidrRange(new src_2.IPv4("192.198.0.0"), new src_3.IPv4Prefix(24));
        expect(ipv4CidrRange.toCidrString()).toEqual("192.198.0.0/24");
    });
    it('should instantiate from string in cidr notation', function () {
        var ipv4CidrRange = src_1.IPv4CidrRange.fromCidr("192.198.0.0/24");
        expect(ipv4CidrRange.toCidrString()).toEqual("192.198.0.0/24");
    });
    it('should throw exception when passed in a malformed range', function () {
        var errorMessages = [src_4.Validator.invalidOctetRangeMessage, src_4.Validator.invalidPrefixValueMessage];
        var errorMessage = errorMessages.filter(function (message) { return message !== ''; }).join(" and ");
        expect(function () {
            src_1.IPv4CidrRange.fromCidr("192.198.333.0/66");
        }).toThrowError(Error, errorMessage);
    });
    it('should return the first IPv4 number in range', function () {
        var ipv4CidrRange = new src_1.IPv4CidrRange(new src_2.IPv4("192.198.0.0"), new src_3.IPv4Prefix(24));
        expect(ipv4CidrRange.getFirst().toString()).toEqual("192.198.0.0");
    });
    it('should return the last IPv4 number in range', function () {
        var ipv4CidrRange = new src_1.IPv4CidrRange(new src_2.IPv4("192.198.0.0"), new src_3.IPv4Prefix(24));
        expect(ipv4CidrRange.getLast().toString()).toEqual("192.198.0.255");
    });
    it('should convert to string with range dash format', function () {
        var ipv4CidrRange = new src_1.IPv4CidrRange(new src_2.IPv4("192.198.0.0"), new src_3.IPv4Prefix(24));
        expect(ipv4CidrRange.toRangeString()).toEqual("192.198.0.0-192.198.0.255");
    });
    it('should return the correct list of IPv4 number when take is called', function () {
        var ipv4CidrRange = new src_1.IPv4CidrRange(new src_2.IPv4("192.198.0.0"), new src_3.IPv4Prefix(24));
        var take = ipv4CidrRange.take(3);
        expect(take[0].toString()).toBe("192.198.0.0");
        expect(take[1].toString()).toBe("192.198.0.1");
        expect(take[2].toString()).toBe("192.198.0.2");
    });
    it('should throw an exception when asked to take a value bigger than the size of range', function () {
        var ipv4CidrRange = new src_1.IPv4CidrRange(new src_2.IPv4("192.198.0.0"), new src_3.IPv4Prefix(24));
        var errMessage = src_4.Validator.takeOutOfRangeSizeMessage
            .replace("$size", ipv4CidrRange.getSize().toString())
            .replace("$count", (ipv4CidrRange.getSize().plus(1)).toString());
        expect(function () {
            ipv4CidrRange.take(ipv4CidrRange.getSize().plus(1).valueOf());
        }).toThrowError(Error, errMessage);
    });
    it('should throw an exception when trying to split a range with on IP number', function () {
        var ipv4CidrRange = new src_1.IPv4CidrRange(new src_2.IPv4("192.198.0.0"), new src_3.IPv4Prefix(32));
        expect(function () {
            ipv4CidrRange.split();
        }).toThrowError(Error, src_4.Validator.cannotSplitSingleRangeErrorMessage);
    });
    it('should correctly tell if ranges are consecutive', function () {
        var firstRange = src_1.IPv4CidrRange.fromCidr("192.168.0.0/25");
        var secondRange = src_1.IPv4CidrRange.fromCidr("192.168.0.128/25");
        var anotherSecondRange = src_1.IPv4CidrRange.fromCidr("192.168.0.127/25");
        expect(firstRange.isConsecutive(secondRange)).toBe(true);
        expect(secondRange.isConsecutive(firstRange)).toBe(true);
        expect(firstRange.isConsecutive(anotherSecondRange)).toBe(false);
        expect(anotherSecondRange.isConsecutive(firstRange)).toBe(false);
    });
    it('should correctly tell if a range contains another range', function () {
        var containerRange = src_1.IPv4CidrRange.fromCidr("192.168.0.0/24");
        var firstRange = src_1.IPv4CidrRange.fromCidr("192.168.0.0/25");
        var secondRange = src_1.IPv4CidrRange.fromCidr("192.168.0.128/25");
        expect(containerRange.contains(firstRange)).toBe(true);
        expect(containerRange.contains(secondRange)).toBe(true);
        expect(firstRange.contains(containerRange)).toBe(false);
        expect(secondRange.contains(containerRange)).toBe(false);
    });
    it('should correctly tell if a range is inside another range', function () {
        var containerRange = src_1.IPv4CidrRange.fromCidr("192.168.0.0/24");
        var firstRange = src_1.IPv4CidrRange.fromCidr("192.168.0.0/25");
        var secondRange = src_1.IPv4CidrRange.fromCidr("192.168.0.128/25");
        expect(containerRange.inside(firstRange)).toBe(false);
        expect(containerRange.inside(secondRange)).toBe(false);
        expect(firstRange.inside(containerRange)).toBe(true);
        expect(secondRange.inside(containerRange)).toBe(true);
    });
    it('should correctly tell if ranges are not overlapping', function () {
        var firstRange = src_1.IPv4CidrRange.fromCidr("192.168.0.0/26");
        var secondRange = src_1.IPv4CidrRange.fromCidr("192.168.0.64/26");
        expect(firstRange.isOverlapping(secondRange)).toBe(false);
        expect(firstRange.isOverlapping(secondRange)).toBe(false);
    });
    it('should correctly tell that containing ranges are not overlapping', function () {
        var containerRange = src_1.IPv4CidrRange.fromCidr("192.168.0.0/24");
        var firstRange = src_1.IPv4CidrRange.fromCidr("192.168.0.0/25");
        var secondRange = src_1.IPv4CidrRange.fromCidr("192.168.0.128/25");
        expect(firstRange.isOverlapping(secondRange)).toBe(false);
        expect(secondRange.isOverlapping(firstRange)).toBe(false);
        expect(containerRange.isOverlapping(firstRange)).toBe(false);
        expect(firstRange.isOverlapping(containerRange)).toBe(false);
    });
    it('should be able to use for in construct on range', function () {
        var ipv4CidrRange = new src_1.IPv4CidrRange(new src_2.IPv4("192.198.0.0"), new src_3.IPv4Prefix(30));
        var expectedValue = ipv4CidrRange.take(4);
        var expectedIndex = 0;
        try {
            for (var ipv4CidrRange_1 = __values(ipv4CidrRange), ipv4CidrRange_1_1 = ipv4CidrRange_1.next(); !ipv4CidrRange_1_1.done; ipv4CidrRange_1_1 = ipv4CidrRange_1.next()) {
                var value = ipv4CidrRange_1_1.value;
                expect(value.isEquals(expectedValue[expectedIndex])).toBe(true);
                expectedIndex++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (ipv4CidrRange_1_1 && !ipv4CidrRange_1_1.done && (_a = ipv4CidrRange_1.return)) _a.call(ipv4CidrRange_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    });
    it('should be able to use spread syntax on range', function () {
        var ipv4CidrRange = new src_1.IPv4CidrRange(new src_2.IPv4("192.198.0.0"), new src_3.IPv4Prefix(30));
        var expectedValue = ipv4CidrRange.take(4);
        var iPv4CidrRanges = __spread(ipv4CidrRange);
        expect(iPv4CidrRanges[0].isEquals(expectedValue[0])).toBe(true);
        expect(iPv4CidrRanges[1].isEquals(expectedValue[1])).toBe(true);
        expect(iPv4CidrRanges[2].isEquals(expectedValue[2])).toBe(true);
        expect(iPv4CidrRanges[3].isEquals(expectedValue[3])).toBe(true);
    });
    it('should split IP range correctly', function () {
        var ipv4CidrRange = src_1.IPv4CidrRange.fromCidr("192.168.208.0/24");
        var splitRanges = ipv4CidrRange.split();
        var firstRange = splitRanges[0];
        var secondRange = splitRanges[1];
        expect(firstRange.toCidrString()).toBe("192.168.208.0/25");
        expect(secondRange.toCidrString()).toBe("192.168.208.128/25");
    });
    it('should tell if there is a next consecutive range', function () {
        var firstRange = new src_1.IPv4CidrRange(new src_2.IPv4("0.0.0.0"), new src_3.IPv4Prefix(1));
        var secondRange = new src_1.IPv4CidrRange(new src_2.IPv4("127.255.255.255"), new src_3.IPv4Prefix(1));
        var thirdRange = new src_1.IPv4CidrRange(new src_2.IPv4("128.0.0.0"), new src_3.IPv4Prefix(1));
        var fourthRange = new src_1.IPv4CidrRange(new src_2.IPv4("255.255.255.255"), new src_3.IPv4Prefix(1));
        expect(firstRange.hasNextRange()).toBe(true);
        expect(secondRange.hasNextRange()).toBe(true);
        expect(thirdRange.hasNextRange()).toBe(false);
        expect(fourthRange.hasNextRange()).toBe(false);
        expect(src_1.IPv4CidrRange.fromCidr("192.168.208.0/24").hasNextRange()).toBe(true);
        expect(src_1.IPv4CidrRange.fromCidr("255.255.254.0/24").hasNextRange()).toBe(true);
        expect(src_1.IPv4CidrRange.fromCidr("255.255.255.0/24").hasNextRange()).toBe(false);
    });
    it('should tell if there is a next adjacent range', function () {
        var firstRange = new src_1.IPv4CidrRange(new src_2.IPv4("0.0.0.0"), new src_3.IPv4Prefix(1));
        var secondRange = new src_1.IPv4CidrRange(new src_2.IPv4("127.255.255.255"), new src_3.IPv4Prefix(1));
        var thirdRange = new src_1.IPv4CidrRange(new src_2.IPv4("128.0.0.0"), new src_3.IPv4Prefix(1));
        var fourthRange = new src_1.IPv4CidrRange(new src_2.IPv4("255.255.255.255"), new src_3.IPv4Prefix(1));
        expect(firstRange.hasNextRange()).toBe(true);
        expect(secondRange.hasNextRange()).toBe(true);
        expect(thirdRange.hasNextRange()).toBe(false);
        expect(fourthRange.hasNextRange()).toBe(false);
        expect(src_1.IPv4CidrRange.fromCidr("192.168.208.0/24").hasNextRange()).toBe(true);
        expect(src_1.IPv4CidrRange.fromCidr("255.255.254.0/24").hasNextRange()).toBe(true);
        expect(src_1.IPv4CidrRange.fromCidr("255.255.255.0/24").hasNextRange()).toBe(false);
    });
    it('should tell if there is a previous adjacent range', function () {
        var firstRange = new src_1.IPv4CidrRange(new src_2.IPv4("0.0.0.0"), new src_3.IPv4Prefix(1));
        var secondRange = new src_1.IPv4CidrRange(new src_2.IPv4("127.255.255.255"), new src_3.IPv4Prefix(1));
        var thirdRange = new src_1.IPv4CidrRange(new src_2.IPv4("128.0.0.0"), new src_3.IPv4Prefix(1));
        var fourthRange = new src_1.IPv4CidrRange(new src_2.IPv4("255.255.255.255"), new src_3.IPv4Prefix(1));
        expect(firstRange.hasPreviousRange()).toBe(false);
        expect(secondRange.hasPreviousRange()).toBe(false);
        expect(thirdRange.hasPreviousRange()).toBe(true);
        expect(fourthRange.hasPreviousRange()).toBe(true);
        expect(src_1.IPv4CidrRange.fromCidr("0.0.0.0/24").hasPreviousRange()).toBe(false);
        expect(src_1.IPv4CidrRange.fromCidr("192.168.208.0/24").hasPreviousRange()).toBe(true);
        expect(src_1.IPv4CidrRange.fromCidr("255.255.254.0/24").hasPreviousRange()).toBe(true);
        expect(src_1.IPv4CidrRange.fromCidr("255.255.255.0/24").hasPreviousRange()).toBe(true);
    });
    it('should return the next adjacent range', function () {
        expect(src_1.IPv4CidrRange.fromCidr("255.255.254.0/24").nextRange()).toEqual(src_1.IPv4CidrRange.fromCidr("255.255.255.0/24"));
    });
    it('should return the previous adjacent range', function () {
        expect(src_1.IPv4CidrRange.fromCidr("255.255.255.0/24").previousRange()).toEqual(src_1.IPv4CidrRange.fromCidr("255.255.254.0/24"));
    });
});
//# sourceMappingURL=IPv4CidrRangeTest.js.map