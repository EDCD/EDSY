/*
 E:D Shipyard was created using assets and imagery from Elite: Dangerous, with the permission of Frontier Developments plc, for non-commercial purposes.
 It is not endorsed by nor reflects the views or opinions of Frontier Developments and no employee of Frontier Developments was involved in the making of it.

 Except where noted otherwise, all design, markup and script code for edshipyard.com is copyright (c) 2015,2016 taleden
 and is provided under a Creative Commons Attribution-NonCommercial 4.0 International License (http://creativecommons.org/licenses/by-nc/4.0/).

 The Elite: Dangerous game logic and data in this file remains the property of Frontier Developments plc,
 and is used here as authorized by Frontier Customer Services (https://forums.frontier.co.uk/showthread.php?t=5349).
 */
window.edshipyard = new (function () {
    var
            DOCUMENT_TITLE = 'E:D Shipyard',
            LOG_2 = Math.LN2,
            LOG_10 = Math.LN10,
            POWER_HATCH = 0.60,
            BOOST_MARGIN = 0.0005,
            HASH_VERSION = 11
            ;
    var
            abs = Math.abs,
            sign = Math.sign,
            pow = Math.pow,
            exp = Math.exp,
            log = Math.log,
            min = Math.min,
            max = Math.max,
            floor = Math.floor,
            ceil = Math.ceil,
            round = Math.round
            ;
    if (!sign) {
        sign = function (x) {
            x = +x;
            if (x === 0 || isNaN(x))
                return x;
            return (x < 0) ? -1 : 1;
        };
    }


    /* **********************************************************************
     * FORMATTING & UTILITY FUNCTIONS
     ********************************************************************** */


    var formatNum0, formatNum1, formatNum2, formatNum3;
    var formatPct0, formatPct1, formatPct2, formatPct3;
    if (window.Intl && window.Intl.NumberFormat) {
        formatNum0 = (new window.Intl.NumberFormat(undefined, {style: 'decimal', useGrouping: true, minimumIntegerDigits: 1, minimumFractionDigits: 0, maximumFractionDigits: 0})).format;
        formatNum1 = (new window.Intl.NumberFormat(undefined, {style: 'decimal', useGrouping: true, minimumIntegerDigits: 1, minimumFractionDigits: 1, maximumFractionDigits: 1})).format;
        formatNum2 = (new window.Intl.NumberFormat(undefined, {style: 'decimal', useGrouping: true, minimumIntegerDigits: 1, minimumFractionDigits: 2, maximumFractionDigits: 2})).format;
        formatNum3 = (new window.Intl.NumberFormat(undefined, {style: 'decimal', useGrouping: true, minimumIntegerDigits: 1, minimumFractionDigits: 3, maximumFractionDigits: 3})).format;
        formatPct0 = (new window.Intl.NumberFormat(undefined, {style: 'percent', useGrouping: false, minimumIntegerDigits: 1, minimumFractionDigits: 0, maximumFractionDigits: 0})).format;
        formatPct1 = (new window.Intl.NumberFormat(undefined, {style: 'percent', useGrouping: false, minimumIntegerDigits: 1, minimumFractionDigits: 1, maximumFractionDigits: 1})).format;
        formatPct2 = (new window.Intl.NumberFormat(undefined, {style: 'percent', useGrouping: false, minimumIntegerDigits: 1, minimumFractionDigits: 2, maximumFractionDigits: 2})).format;
        formatPct3 = (new window.Intl.NumberFormat(undefined, {style: 'percent', useGrouping: false, minimumIntegerDigits: 1, minimumFractionDigits: 3, maximumFractionDigits: 3})).format;
    }
    else {
        var _formatNumberCommas = function (n, d) {
            if (!isFinite(n))
                return n.toFixed(d);
            var parts = n.toFixed(d).split('.'), s = parts[0], i = L = s.length, o = '';
            while (i--)
                o = ((i && !((L - i) % 3)) ? ',' : '') + s[i] + o;
            return o + (d ? ('.' + parts[1]) : '');
        }; // _formatNumberCommas()
        formatNum0 = function (n) {
            return _formatNumberCommas(n, 0);
        };
        formatNum1 = function (n) {
            return _formatNumberCommas(n, 1);
        };
        formatNum2 = function (n) {
            return _formatNumberCommas(n, 2);
        };
        formatNum3 = function (n) {
            return _formatNumberCommas(n, 3);
        };
        formatPct0 = function (n) {
            return (n * 100).toFixed(0) + '%';
        };
        formatPct1 = function (n) {
            return (n * 100).toFixed(1) + '%';
        };
        formatPct2 = function (n) {
            return (n * 100).toFixed(2) + '%';
        };
        formatPct3 = function (n) {
            return (n * 100).toFixed(3) + '%';
        };
    }
    this.formatNum0 = formatNum0;
    this.formatNum1 = formatNum1;
    this.formatNum2 = formatNum2;
    this.formatNum3 = formatNum3;
    this.formatPct0 = formatPct0;
    this.formatPct1 = formatPct1;
    this.formatPct2 = formatPct2;
    this.formatPct3 = formatPct3;


    var formatNumHTML = function (n, d) {
        if (n === undefined)
            return '';
        var s;
        switch (d) {
            case 0:
                s = formatNum0((n === n) ? n : 0);
                break;
            case 1:
                s = formatNum1((n === n) ? n : 0);
                break;
            case 2:
                s = formatNum2((n === n) ? n : 0);
                break;
            default:
                s = formatNum3((n === n) ? n : 0);
                break;
        }
        if (n !== n)
            s = '<abbr class="error" title="Unknown; please send me this data if you have it!">' + s.replace(/0/g, '?') + '</abbr>';
        return s;
    }; // formatNumHTML()


    var formatPctHTML = function (n, d) {
        if (n === undefined)
            return '';
        var s;
        switch (d) {
            case 0:
                s = formatPct0((n === n) ? n : 0);
                break;
            case 1:
                s = formatPct1((n === n) ? n : 0);
                break;
            case 2:
                s = formatPct2((n === n) ? n : 0);
                break;
            default:
                s = formatPct3((n === n) ? n : 0);
                break;
        }
        if (n !== n)
            s = '<abbr class="error" title="Unknown; please send me this data if you have it!">' + s.replace(/0/g, '?') + '</abbr>';
        return s.replace('%', '<small>%</small>');
    }; // formatPctHTML()


    var formatSeconds = function (s) {
        if (s !== s)
            return formatNumHTML(NaN, 0) + '<small>s</small>';
        if (!isFinite(s))
            return formatNumHTML(s, 0);

        var m = (s / 60) >> 0;
        s = (s % 60);
        var h = (m / 60) >> 0;
        m = (m % 60) >> 0;
        var d = (h / 24) >> 0;
        h = (h % 24) >> 0;

        var str = '';
        if (s)
            str = ((d || h || m || s >= 10 || !(s % 1.0)) ? formatNum0(s) : formatNum1(s)) + '<small>s</small>' + str;
        if (m || ((d || h) && s))
            str = m + '<small>m</small>' + str;
        if (h || (d && (m || s)))
            str = h + '<small>h</small>' + str;
        if (d)
            str = d + '<small>d</small>' + str;
        return str;
    }; // formatSeconds()
    this.formatSeconds = formatSeconds;


    var erf = function (x) {
        // save the sign of x
        var sign = (x >= 0) ? 1 : -1;
        x = abs(x);

        // constants
        var a1 = 0.254829592;
        var a2 = -0.284496736;
        var a3 = 1.421413741;
        var a4 = -1.453152027;
        var a5 = 1.061405429;
        var p = 0.3275911;

        // A&S formula 7.1.26
        var t = 1.0 / (1.0 + p * x);
        var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * exp(-x * x);
        return sign * y; // erf(-x) = -erf(x);
    }; // erf()


    var clearSelectOptions = function (select, firstValue, firstText) {
        var node;
        while (node = select.firstChild)
            select.removeChild(node)

        if (typeof firstValue !== 'undefined') {
            var node = document.createElement('option');
            node.value = firstValue;
            node.text = (typeof firstText !== 'undefined') ? firstText : firstValue;
            select.appendChild(node);
        }
    }; // clearSelectOptions()
    this.clearSelectOptions = clearSelectOptions;


    var eraseInputSelection = function (input) {
        var value = input.value, start = input.selectionStart, end = input.selectionEnd;
        if ((end == value.length) && (start < value.length)) {
            input.value = value.substring(0, start) + value.substring(end);
            input.setSelectionRange(start, start);
        }
    }; // eraseInputSelection()
    this.eraseInputSelection = eraseInputSelection;


    var hashChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-';


    var hashEncode = function (n, l) {
        var h = '';
        while (n) {
            h = hashChars[n & 63] + h;
            n = n >> 6;
        }
        while (h.length < l)
            h = hashChars[0] + h;
        return h;
    }; // hashEncode()


    var hashDecode = function (h) {
        var n = 0, i = 0;
        while (i < h.length)
            n = (n << 6) | hashChars.indexOf(h[i++]);
        return n;
    }; // hashDecode()


    var hashEncodeS = function (s) {
        var h = '', i = 0, c;
        for (var i = 0; i < s.length; i++) {
            c = s.charCodeAt(i);
            if (c >= 0x20 && c <= 0xFFF) {
                h += hashChars[c >> 6] + hashChars[c & 0x3F];
            }
        }
        return h;
    }; // hashEncodeS()


    var hashDecodeS = function (h) {
        var s = '', i = 1, c1, c2;
        for (var i = 1; i < h.length; i += 2) {
            c1 = hashChars.indexOf(h[i - 1]);
            c2 = hashChars.indexOf(h[i]);
            if (c1 >= 0 && c2 >= 0) {
                s += String.fromCharCode((c1 << 6) | c2);
            }
        }
        return s;
    }; // hashDecodeS()


    var fixed20Encode = function (n) {
        return min(max((n * (1 << 17) + 0.5) | 0, 0), 0xFFFFF);
    }; // fixed20Encode()


    var fixed20Decode = function (n) {
        return (1.0 * n / (1 << 17));
    }; // fixed20Decode()


    var float20Encode = function (f) {
        // this is a custom 20-bit floating point format based on the design of IEEE 16- and 32-bit floats
        // yes, it's probably a little silly to invent a custom data type just for a fan site,
        // but 16 bits just isn't quite enough precision to encode engineer attribute modifiers
        // and 32 bits would unnecessarily inflate the length of URL hashes, so here we are --taleden
        var s = (f < 0) | 0;
        f = (f < 0) ? -f : f;
        var m = f | 0;
        var e = ((1 << 5) - 1);
        if (isNaN(f)) { // NaN
            m = 1;
        }
        else if (f > ((1 << 15) - 1)) { // +/- Infinity
            m = 0;
        }
        else {
            e -= 1;
            f -= m;
            while (m < (1 << 14) && e > 0) {
                m <<= 1;
                e -= 1;
                f *= 2;
                if (f >= 1) {
                    m |= 1;
                    f -= 1;
                }
            }
            if (e == 0) {
                m = (m >> 1) + (m & 1);
                e = (m >= (1 << 15));
            }
            else if (f * 2 >= 1) {
                m += 1;
                if (m >= (1 << 15)) {
                    m >>= 1;
                    e += 1;
                }
            }
        }
        s &= 1;
        e &= ((1 << 5) - 1);
        m &= ((1 << 14) - 1);
        return (s << 19) | (e << 14) | m;
    }; // float20Encode()


    var float20Decode = function (b) {
        var s = (b >> 19) & 1;
        var e = (b >> 14) & ((1 << 5) - 1);
        var m = b & ((1 << 14) - 1);
        return (e >= ((1 << 5) - 1)) ? (m ? NaN : (s ? -Infinity : Infinity)) : ((s ? -1 : 1) * pow(2.0, e - ((1 << 5) - 2) + (e == 0)) * ((e ? (1 << 14) : 0) | m));
    }; // float20Decode()


    var sliderPosToModifier = function (p) {
        var s = 1;
        if (p < 0.5) {
            s = -1;
            p = 1 - p;
        }
        return s * (pow(100, p * 2 - 1) - 1) / (99 / 2.5);
        //	return pow((p - 0.5) * 2, 2) * ((p < 0.5) ? -2 : 2);
    }; // sliderPosToModifier()


    var modifierToSliderPos = function (m) {
        var s = 1;
        if (m < 0) {
            s = -1;
            m = -m;
        }
        var x = m * (99 / 2.5) + 1;
        return (s * log(x) / log(100) + 1) / 2;
        //	return pow(abs(m) / 2, 0.5) / ((m < 0) ? -2 : 2) + 0.5;
    }; // modifierToSliderPos()


    /* **********************************************************************
     * ELITE LOGIC
     ********************************************************************** */


    var getJumpFuelCost = function (mass, dist, fsdOpt, fsdMul, fsdExp) {
        // https://forums.frontier.co.uk/showthread.php?p=643461#post643461
        // fuel = fsdMul * pow(range * mass / opt, fsdPow)
        return fsdMul * pow(dist * mass / fsdOpt, fsdExp);
    }; // getJumpFuelCost()
    this.getJumpFuelCost = getJumpFuelCost;


    var getJumpRange = function (mass, fuel, fsdOpt, fsdMul, fsdExp) {
        // https://forums.frontier.co.uk/showthread.php?p=643461#post643461
        // range = pow(fuel / fsdMul, 1 / fsdPow) * opt / mass
        return pow(fuel / fsdMul, 1 / fsdExp) * fsdOpt / mass;
    }; // getJumpRange()
    this.getJumpRange = getJumpRange;


    var getMassCurveMultiplier = function (mass, minMass, optMass, maxMass, minMul, optMul, maxMul) {
        // https://forums.frontier.co.uk/showthread.php/300225-The-One-Formula-To-Rule-Them-All-The-Mechanics-of-Shield-and-Thruster-Mass-Curves
        return (minMul + pow(min(1.0, (maxMass - mass) / (maxMass - minMass)), log((optMul - minMul) / (maxMul - minMul)) / log((maxMass - optMass) / (maxMass - minMass))) * (maxMul - minMul));
    }; // getMassCurveMultiplier()


    var getEffectiveDamageResistance = function (baseres, extrares) {
        // https://forums.frontier.co.uk/showthread.php/266235-Kinetic-Resistance-Calculation?p=4230114&viewfull=1#post4230114
        // https://forums.frontier.co.uk/showthread.php/286097-Shield-Booster-Mod-Calculator?p=4998592&viewfull=1#post4998592
        var res = 1 - ((1 - baseres) * (1 - extrares));
        var softcap = 1 - ((1 - baseres) * (1 - 0.3));
        return res - max(0, (res - softcap) / 2);
    }; // getEffectiveDamageResistance()


    var getEffectiveShieldBoostMultiplier = function (shieldbst) {
        // https://forums.frontier.co.uk/showthread.php/314820-(very)-Experimental-shield-change?p=4895068&viewfull=1#post4895068
        var i = (1 + (shieldbst / 100));
        //	i = min(i, (1 - exp(-0.7 * i)) * 2.5); // not implemented in 2.3.0 final
        return i;
    }; // getEffectiveShieldBoostMultiplier()


    var getIdleHeat = function (heatcap, heateff, pwrdraw) {
        // https://forums.frontier.co.uk/showthread.php/286628-Research-Detailed-Heat-Mechanics
        return pow(heateff * pwrdraw / heatcap / 0.2, 0.5) * heatcap;
    }; // getIdleHeat()


    /* **********************************************************************
     * DB HELPERS
     ********************************************************************** */


    var getShipIDByName = function (name) {
        name = name.trim().toUpperCase();
        for (var sID in eddb.ship) {
            if (eddb.ship.hasOwnProperty(sID) && eddb.ship[sID].name.trim().toUpperCase() == name)
                return sID;
        }
        return null;
    }; // getShipIDByName()


    var createLoadoutStruct = function (sID) {
        sID = parseInt(sID) || 0;
        var loadout = {
            label: '',
            ship: sID,
            hatch: {
                powered: true,
                priority: 1,
            },
            hardpoint: [],
            utility: [],
            component: [],
            military: [],
            internal: [],
        };
        var ship = eddb.ship[sID];
        if (ship) {
            loadout.label = ship.name;
            for (var slot = 0; slot < ship.slots.hardpoint.length; slot++)
                loadout.hardpoint.push(createLoadoutModuleStruct(0));
            for (var slot = 0; slot < ship.slots.utility.length; slot++)
                loadout.utility.push(createLoadoutModuleStruct(0));
            for (var slot = 0; slot < ship.slots.component.length; slot++)
                loadout.component.push(createLoadoutModuleStruct(ship.stock.component[slot] || 0));
            for (var slot = 0; slot < ship.slots.military.length; slot++)
                loadout.military.push(createLoadoutModuleStruct(0));
            for (var slot = 0; slot < ship.slots.internal.length; slot++)
                loadout.internal.push(createLoadoutModuleStruct(0));
        }
        return loadout;
    }; // createLoadoutStruct()


    var createLoadoutModuleStruct = function (mID) {
        mID = parseInt(mID) || 0;
        return {
            module: mID,
            powered: true,
            priority: 1,
            modified: false,
            blueprint: 0,
            modifier: {},
        };
    }; // createLoadoutModuleStruct()


    var getDefaultShipLoadout = function (sID) {
        sID = parseInt(sID) || 0;
        var ship = eddb.ship[sID];
        if (!ship)
            return null;

        var loadout = createLoadoutStruct(sID);
        for (var slot = 0; slot < ship.slots.hardpoint.length; slot++)
            loadout.hardpoint[slot].module = (ship.stock.hardpoint[slot] || 0);
        for (var slot = 0; slot < ship.slots.utility.length; slot++)
            loadout.utility[slot].module = (ship.stock.utility[slot] || 0);
        for (var slot = 0; slot < ship.slots.component.length; slot++)
            loadout.component[slot].module = (ship.stock.component[slot] || 0);
        for (var slot = 0; slot < ship.slots.military.length; slot++)
            loadout.military[slot].module = (ship.stock.military[slot] || 0);
        for (var slot = 0; slot < ship.slots.internal.length; slot++)
            loadout.internal[slot].module = (ship.stock.internal[slot] || 0);

        return loadout;
    }; // getDefaultShipLoadout()


    var isShipLoadoutValid = function (loadout, fix, errors, prefix) {
        prefix = prefix || '';

        if (!loadout || !loadout.hardpoint || !loadout.utility || !loadout.component || !loadout.military || !loadout.internal) {
            if (errors)
                errors.push(prefix + 'Invalid loadout data structure');
            if (fix && loadout)
                loadout.ship = null;
            return false;
        }

        var ship = eddb.ship[loadout.ship];
        if (!ship) {
            if (errors)
                errors.push(prefix + 'Unknown ship ID "' + loadout.ship + '"');
            if (fix)
                loadout.ship = null;
            return false;
        }

        var valid = true;
        if (loadout.hatch.priority < 1 || loadout.hatch.priority > 5) {
            if (errors)
                errors.push(prefix + 'Cargo Hatch: Invalid power priority group "' + loadout.hatch.priority + '"');
            if (!fix)
                return false;
            valid = false;
            loadout.hatch.priority = 1;
        }

        for (var slot = 0; slot < ship.slots.hardpoint.length; slot++) {
            if (slot >= loadout.hardpoint.length) {
                while (fix && slot >= loadout.hardpoint.length)
                    loadout.hardpoint.push(createLoadoutModuleStruct(0));
            }
            else if (!isShipLoadoutSlotValid(loadout, 'hardpoint', slot, fix, errors, (prefix + 'Hardpoint #' + (slot + 1) + ':'))) {
                valid = false;
            }
        }
        if (slot < loadout.hardpoint.length) {
            if (errors)
                errors.push(prefix + 'Too many hardpoint modules');
            if (!fix)
                return false;
            valid = false;
            while (slot < loadout.hardpoint.length)
                loadout.hardpoint.pop();
        }

        for (var slot = 0; slot < ship.slots.utility.length; slot++) {
            if (slot >= loadout.utility.length) {
                while (fix && slot >= loadout.utility.length)
                    loadout.utility.push(createLoadoutModuleStruct(0));
            }
            else if (!isShipLoadoutSlotValid(loadout, 'utility', slot, fix, errors, (prefix + 'Utility #' + (slot + 1) + ':'))) {
                valid = false;
            }
        }
        if (slot < loadout.utility.length) {
            if (errors)
                errors.push(prefix + 'Too many utility modules');
            if (!fix)
                return false;
            valid = false;
            while (slot < loadout.utility.length)
                loadout.utility.pop();
        }

        for (var slot = 0; slot < ship.slots.component.length; slot++) {
            if (slot >= loadout.component.length || !loadout.component[slot]) {
                if (errors)
                    errors.push(prefix + cache.component.slotLabel[slot] + ': No module specified');
                if (!fix)
                    return false;
                valid = false;
                loadout.component[slot] = createLoadoutModuleStruct(ship.stock.component[slot] || 0);
            }
            else if (!isShipLoadoutSlotValid(loadout, 'component', slot, fix, errors, (prefix + slot + ':'))) {
                valid = false;
            }
        }

        for (var slot = 0; slot < ship.slots.military.length; slot++) {
            if (slot >= loadout.military.length) {
                while (fix && slot >= loadout.military.length)
                    loadout.military.push(createLoadoutModuleStruct(0));
            }
            else if (!isShipLoadoutSlotValid(loadout, 'military', slot, fix, errors, (prefix + 'Military #' + (slot + 1) + ':'))) {
                valid = false;
            }
        }
        if (slot < loadout.military.length) {
            if (errors)
                errors.push(prefix + 'Too many military modules');
            if (!fix)
                return false;
            valid = false;
            while (slot < loadout.military.length)
                loadout.military.pop();
        }

        for (var slot = 0; slot < ship.slots.internal.length; slot++) {
            if (slot >= loadout.internal.length) {
                while (fix && slot >= loadout.internal.length)
                    loadout.internal.push(createLoadoutModuleStruct(0));
            }
            else if (!isShipLoadoutSlotValid(loadout, 'internal', slot, fix, errors, (prefix + 'Internal #' + (slot + 1) + ':'))) {
                valid = false;
            }
        }
        if (slot < loadout.internal.length) {
            if (errors)
                errors.push(prefix + 'Too many internal modules');
            if (!fix)
                return false;
            valid = false;
            while (slot < loadout.internal.length)
                loadout.internal.pop();
        }

        return valid;
    }; // isShipLoadoutValid()


    var isShipLoadoutSlotValid = function (loadout, group, slot, fix, errors, prefix) {
        var valid = true;
        var ship = eddb.ship[loadout.ship];
        var mID = loadout[group][slot].module;
        var module = ship.module[mID] || eddb.module[mID];
        if (group == 'component' && !mID) {
            if (errors)
                errors.push(prefix + 'Cannot be empty');
            if (!fix)
                return false;
            valid = false;
            loadout[group][slot].module = (group == 'component') ? ship.stock.component[slot] : 0;
            loadout[group][slot].modified = false;
            loadout[group][slot].blueprint = 0;
            loadout[group][slot].modifier = {};
        }
        else if (mID && !module) {
            if (errors)
                errors.push(prefix + 'Unknown module ID "' + mID + '"');
            if (!fix)
                return false;
            valid = false;
            loadout[group][slot].module = (group == 'component') ? ship.stock.component[slot] : 0;
            loadout[group][slot].modified = false;
            loadout[group][slot].blueprint = 0;
            loadout[group][slot].modifier = {};
        }
        else if (!isShipSlotModuleValid(loadout.ship, group, slot, mID)) {
            if (errors)
                errors.push(prefix + 'Cannot fit "' + getModuleLabel(module) + '"');
            if (!fix)
                return false;
            valid = false;
            loadout[group][slot].module = (group == 'component') ? ship.stock.component[slot] : 0;
            loadout[group][slot].modified = false;
            loadout[group][slot].blueprint = 0;
            loadout[group][slot].modifier = {};
        }
        else {
            if (loadout[group][slot].priority < 1 || loadout[group][slot].priority > 5) {
                if (errors)
                    errors.push(prefix + 'Invalid power priority group "' + loadout[group][slot].priority + '"');
                if (!fix)
                    return false;
                valid = false;
                loadout[group][slot].priority = 1;
            }
            if (loadout[group][slot].modified) {
                if (loadout[group][slot].blueprint && (!eddb.mtype[module.mtype] || !eddb.mtype[module.mtype].blueprint || !eddb.mtype[module.mtype].blueprint[loadout[group][slot].blueprint])) {
                    if (errors)
                        errors.push(prefix + 'Invalid blueprint ' + loadout[group][slot].blueprint);
                    if (!fix)
                        return false;
                    valid = false;
                    loadout[group][slot].blueprint = 0;
                }
                var modifier = loadout[group][slot].modifier;
                var drop = [];
                for (var attr in modifier) {
                    if (modifier.hasOwnProperty(attr) && !isModuleAttributeModifiable(module, attr)) {
                        if (errors)
                            errors.push(prefix + 'Invalid attribute modifier "' + attr + '"');
                        if (!fix)
                            return false;
                        valid = false;
                        drop.push(attr);
                    }
                }
                while (drop.length > 0) {
                    delete modifier[drop.pop()];
                }
            }
        }
        return valid;
    }; // isShipLoadoutSlotValid()


    var getModuleIDByName = function (group, slot, name) {
        name = name.trim().toUpperCase();
        for (var mID in eddb.module) {
            if (eddb.module.hasOwnProperty(mID) && getModuleLabel(eddb.module[mID]).trim().toUpperCase() == name)
                return mID;
        }
        return null;
    }; // getModuleIDByName()


    var isShipSlotModuleValid = function (sID, group, slot, mID) {
        var ship = eddb.ship[sID];
        if (!ship)
            return false; // ship does not exist
        if (!mID)
            return (group != 'component'); // core components cannot be empty
        var module = eddb.module[mID];
        if (!module)
            return false; // module does not exist
        if (!((group == 'component') ? eddb.group.component[slot] : eddb.group[group]).mtypes[module.mtype])
            return false; // module type is not allowed in this group/slot
        if (module.class > ship.slots[group][slot])
            return false; // module is too large for the slot
        if (module.reserved && !module.reserved[sID])
            return false; // module is not allowed on this ship
        if ((module.mtype == 'cls' || module.mtype == 'cs') && module.class != ship.slots[group][slot])
            return false; // module is too small for the slot
        if (ship.reserved && ship.reserved[group] && ship.reserved[group][slot] && !ship.reserved[group][slot][module.mtype])
            return false; // module type is not allowed in this internal slot
        return true;
    }; // isShipSlotModuleValid()


    var isShipSlotModuleBigEnough = function (sID, group, slot, mID) {
        var ship = eddb.ship[sID];
        if (!ship)
            return false; // ship does not exist
        var module = eddb.module[mID];
        if (!module)
            return false; // module does not exist
        if ((module.mtype == 'ct' || module.mtype == 'isg') && ship.mass > module.maxmass)
            return false; // ship mass exceeds thruster/shieldgen maximum
        if (module.mtype == 'cpd' && ship.boostcost + BOOST_MARGIN > module.engcap)
            return false; // ship boost cost exceeds distributor capacity
        return true;
    }; // isShipSlotModuleBigEnough()


    var getModuleLabel = function (module, brief, icons) {
        var label = '' + module.class + module.rating;
        if (module.mount || module.missile || module.cabincls)
            label += '/' + (module.mount ? (icons ? (cache.icon.mount[module.mount] || '<span class="icon unknown"></span>') : module.mount) : '') + (module.missile ? (icons ? (cache.icon.missile[module.missile] || '<span class="icon unknown"></span>') : module.missile) : '') + (module.cabincls || '');
        if (!brief)
            label += ' ' + module.name;
        return label;
    }; // getModuleLabel()


    var getModuleAttributeModificationIndex = function (module, attr) {
        var value = (module[attr] !== undefined) ? module[attr] : (eddb.attribute[attr] ? eddb.attribute[attr].default : NaN);
        if (isNaN(value) || (value == 0 && !eddb.attribute[attr].modset && !eddb.attribute[attr].modadd && !eddb.attribute[attr].modmod) || !eddb.mtype[module.mtype].modifiable)
            return -1;
        return eddb.mtype[module.mtype].modifiable.indexOf(attr);
    }; // getModuleAttributeModificationIndex()


    var isModuleAttributeModifiable = function (module, attr) {
        return (getModuleAttributeModificationIndex(module, attr) >= 0);
    }; // isModuleAttributeModifiable()


    var getModuleAttributeValue = function (module, attr, modifier, rounding) {
        if (attr == 'rof') {
            var bstsize = getModuleAttributeValue(module, 'bstsize');
            var rof = (
                    (bstsize > 1)
                    ? (bstsize / ((bstsize - 1) / getModuleAttributeValue(module, 'bstrof') + getModuleAttributeValue(module, 'bstint')))
                    : (1 / getModuleAttributeValue(module, 'bstint'))
                    );
            if (modifier && isFinite(rof))
                rof *= (1 + modifier);
            return rof;
        }
        else if (attr == 'dps') {
            var rof = getModuleAttributeValue(module, 'rof');
            return (
                    getModuleAttributeValue(module, 'damage', modifier)
                    * (isFinite(rof) ? rof : 1.0)
                    * getModuleAttributeValue(module, 'rounds')
                    );
        }
        else if (module[attr] === undefined && isNaN(eddb.attribute[attr].default) && !isNaN(eddb.attribute[attr].scale)) {
            return getModuleAttributeValue(module, eddb.attribute[attr].default, modifier);
        }
        var base = (module[attr] !== undefined) ? module[attr] : eddb.attribute[attr].default;
        if ((modifier === undefined) || isNaN(base) || (base == 0 && !eddb.attribute[attr].modset && !eddb.attribute[attr].modadd && !eddb.attribute[attr].modmod))
            return base;
        if (eddb.attribute[attr].modset) {
            var value = modifier;
        }
        else if (eddb.attribute[attr].modadd) {
            var value = base + modifier;
        }
        else if (eddb.attribute[attr].modmod) {
            var value = ((1 + (base / eddb.attribute[attr].modmod)) * (1 + modifier) - 1) * eddb.attribute[attr].modmod;
        }
        else {
            var value = base * (1 + modifier);
        }
        if (eddb.attribute[attr].step) {
            if (rounding < 0)
                value = ((value / eddb.attribute[attr].step + 0.000001) | 0);
            else if (rounding > 0)
                value = ceil(value / eddb.attribute[attr].step);
            else
                value = round(value / eddb.attribute[attr].step);
            value *= eddb.attribute[attr].step;
        }
        if (eddb.attribute[attr].min !== undefined)
            value = max(value, eddb.attribute[attr].min);
        if (eddb.attribute[attr].max !== undefined)
            value = min(value, eddb.attribute[attr].max);
        return value;
    }; // getModuleAttributeValue()


    var encodeModuleAttributeValueToText = function (module, attr, value) {
        if (isNaN(value) || !isFinite(value)) {
            return value;
        }
        else if (eddb.attribute[attr].step) {
            var step = eddb.attribute[attr].step;
        }
        else if (eddb.attribute[attr].modset || eddb.attribute[attr].modadd) {
            var step = 1 / (1 << 14);
        }
        else if (eddb.attribute[attr].modmod) {
            var step = abs(eddb.attribute[attr].modmod) / (1 << 14);
        }
        else {
            var step = (getModuleAttributeValue(module, attr) || 1) / (1 << 14);
        }
        var decimals = -ceil(log(step) / LOG_10 - 0.000001);
        if (decimals > 0) {
            var text = value.toFixed(decimals).replace(/(\.[0-9]*?[1-9])0+$/, '$1').replace(/\.0*$/, '');
        }
        else {
            var step = pow(10, -decimals);
            var text = (((value / step + 0.5) | 0) * step).toFixed(0);
        }
        return text;
    }; // encodeModuleAttributeValueToText()


    var getModuleAttributeModifier = function (module, attr, value) {
        var base = getModuleAttributeValue(module, attr);
        if (isNaN(value) || value == base)
            return 0;
        if (eddb.attribute[attr].modset) {
            var modifier = value;
            value = getModuleAttributeValue(module, attr, modifier);
            modifier = value;
        }
        else if (eddb.attribute[attr].modadd) {
            var modifier = value - base;
            value = getModuleAttributeValue(module, attr, modifier);
            modifier = value - base;
        }
        else if (eddb.attribute[attr].modmod) {
            var modifier = ((1 + (value / eddb.attribute[attr].modmod)) / (1 + (base / eddb.attribute[attr].modmod))) - 1;
            value = getModuleAttributeValue(module, attr, modifier);
            modifier = ((1 + (value / eddb.attribute[attr].modmod)) / (1 + (base / eddb.attribute[attr].modmod))) - 1;
        }
        else {
            var modifier = (value / base) - 1;
            value = getModuleAttributeValue(module, attr, modifier);
            modifier = (value / base) - 1;
        }
        return modifier;
    }; // getModuleAttributeModifier()


    var encodeModuleAttributeModifierToText = function (module, attr, modifier) {
        var text = '';
        if (modifier && !isNaN(modifier)) {
            if (eddb.attribute[attr].modset) {
                var base = getModuleAttributeValue(module, attr);
                text = ((modifier > base) ? '+' : '') + (modifier - base).toFixed((eddb.attribute[attr].step >= 1) ? 0 : 2);
            }
            else if (eddb.attribute[attr].modadd) {
                text = ((modifier > 0) ? '+' : '') + modifier.toFixed((eddb.attribute[attr].step >= 1) ? 0 : 2);
            }
            else if (eddb.attribute[attr].modmod || eddb.attribute[attr].unit == '%') {
                var base = getModuleAttributeValue(module, attr);
                var value = getModuleAttributeValue(module, attr, modifier);
                text = (((modifier * (eddb.attribute[attr].modmod || 1)) > 0) ? '+' : '') + (value - base).toFixed(2) + '%';
            }
            else {
                text = ((modifier > 0) ? '+' : '') + (modifier * 100).toFixed(2) + '%';
            }
        }
        return text;
    }; // encodeModuleAttributeModifierToText()


    var decodeModuleAttributeModifierFromText = function (module, attr, text) {
        var modifier = 0;
        text = text.trim();
        var textvalue = parseFloat(text);
        if (!isNaN(textvalue)) {
            var base = getModuleAttributeValue(module, attr);
            if (text.slice(-1) == '%') {
                var value = base * (1 + textvalue / 100);
            }
            else {
                var value = base + textvalue;
            }
            modifier = getModuleAttributeModifier(module, attr, value);
        }
        return modifier;
    }; // decodeModuleAttributeModifierFromText()


    var getBlueprintAttributeRolledModifier = function (blueprint, attr, bonusroll, malusroll) {
        var lomod = blueprint[attr][0];
        var himod = blueprint[attr][1];
        if ((lomod < himod) == (eddb.attribute[attr].bad > 0)) {
            var tmp = lomod;
            lomod = himod;
            himod = tmp;
        }
        var isMalus = eddb.attribute[attr].bad ? (lomod > 0) : (lomod < 0);
        lomod = lomod / (eddb.attribute[attr].modmod || ((eddb.attribute[attr].modset || eddb.attribute[attr].modadd) ? 1 : 100));
        himod = himod / (eddb.attribute[attr].modmod || ((eddb.attribute[attr].modset || eddb.attribute[attr].modadd) ? 1 : 100));
        return lomod + (isMalus ? malusroll : bonusroll) * (himod - lomod);
    }; // getBlueprintAttributeRolledModifier()


    var getModuleBlueprintRolledModifiers = function (module, bID, bonusroll, malusroll) {
        var blueprint = (eddb.mtype[module.mtype].blueprint || {})[bID];
        var modifiers = {};
        if (eddb.mtype[module.mtype].modifiable) {
            if (isNaN(bonusroll))
                bonusroll = 0.5;
            if (isNaN(malusroll))
                malusroll = bonusroll;
            for (var i = 0; i < eddb.mtype[module.mtype].modifiable.length; i++) {
                var attr = eddb.mtype[module.mtype].modifiable[i];
                if (blueprint && blueprint[attr])
                    modifiers[attr] = getBlueprintAttributeRolledModifier(blueprint, attr, bonusroll, malusroll);
            }
            if (blueprint && blueprint.bstint && !module.bstint) { // bstint (ROF) malus on beams applies to damage instead
                modifiers.damage = (1 + (modifiers.damage || 0)) / (1 + getBlueprintAttributeRolledModifier(blueprint, 'bstint', bonusroll, malusroll)) - 1;
            }
            if (modifiers.ammoclip) {
                var bstsize = getModuleAttributeValue(module, 'bstsize', modifiers.bstsize);
                modifiers.ammoclip = getModuleAttributeModifier(module, 'ammoclip', ceil((getModuleAttributeValue(module, 'ammoclip') * (1 + modifiers.ammoclip)) / bstsize) * bstsize)
            }
            if (modifiers.bstint || modifiers.bstrof || modifiers.bstsize) {
                var bstsize = getModuleAttributeValue(module, 'bstsize', modifiers.bstsize);
                var rof = bstsize / ((bstsize - 1) / (getModuleAttributeValue(module, 'bstrof', modifiers.bstrof) || 1) + getModuleAttributeValue(module, 'bstint', modifiers.bstint));
                modifiers.rof = (1 + (modifiers.rof || 0)) * (rof / getModuleAttributeValue(module, 'rof')) - 1;
            }
            if (modifiers.damage || modifiers.rof || modifiers.rounds) {
                modifiers.dps = (1 + (modifiers.dps || 0)) * (1 + (modifiers.damage || 0)) * (1 + (modifiers.rof || 0)) * (1 + (modifiers.rounds || 0)) - 1;
            }
            if (modifiers.maxrng > 0) { // maxrng bonus applies to shotspd to maintain projectile flight time, but maxrng malus does *not* affect shotspd
                modifiers.shotspd = (1 + (modifiers.shotspd || 0)) * (1 + (modifiers.maxrng || 0)) - 1;
            }
            if (modifiers.optmass) {
                modifiers.minmass = (1 + (modifiers.minmass || 0)) * (1 + (modifiers.optmass || 0)) - 1;
                modifiers.maxmass = (1 + (modifiers.maxmass || 0)) * (1 + (modifiers.optmass || 0)) - 1;
            }
            if (modifiers.optmul) {
                modifiers.minmul = (1 + (modifiers.minmul || 0)) * (1 + (modifiers.optmul || 0)) - 1;
                modifiers.maxmul = (1 + (modifiers.maxmul || 0)) * (1 + (modifiers.optmul || 0)) - 1;
                if (module.optmulspd) {
                    modifiers.minmulspd = (1 + (modifiers.minmulspd || 0)) * (1 + (modifiers.optmul || 0)) - 1;
                    modifiers.optmulspd = (1 + (modifiers.optmulspd || 0)) * (1 + (modifiers.optmul || 0)) - 1;
                    modifiers.maxmulspd = (1 + (modifiers.maxmulspd || 0)) * (1 + (modifiers.optmul || 0)) - 1;
                }
                if (module.optmulacc) {
                    modifiers.minmulacc = (1 + (modifiers.minmulacc || 0)) * (1 + (modifiers.optmul || 0)) - 1;
                    modifiers.optmulacc = (1 + (modifiers.optmulacc || 0)) * (1 + (modifiers.optmul || 0)) - 1;
                    modifiers.maxmulacc = (1 + (modifiers.maxmulacc || 0)) * (1 + (modifiers.optmul || 0)) - 1;
                }
                if (module.optmulrot) {
                    modifiers.minmulrot = (1 + (modifiers.minmulrot || 0)) * (1 + (modifiers.optmul || 0)) - 1;
                    modifiers.optmulrot = (1 + (modifiers.optmulrot || 0)) * (1 + (modifiers.optmul || 0)) - 1;
                    modifiers.maxmulrot = (1 + (modifiers.maxmulrot || 0)) * (1 + (modifiers.optmul || 0)) - 1;
                }
            }
        }
        return modifiers;
    }; // getModuleBlueprintRolledModifiers()


    /* **********************************************************************
     * UI GENERATORS
     ********************************************************************** */


    var createUISlotRow = function (group, slot, _unused) {
        var tr, td, span, div, divPopup, label, abbr, input, button;

        tr = document.getElementById('tr_' + group + '_' + slot);
        if (tr)
            return tr;

        tr = document.createElement('tr');
        tr.id = 'tr_' + group + '_' + slot;

        // slot class
        td = document.createElement('td');
        span = document.createElement('span');
        span.id = 'span_' + group + '_' + slot + '_class';
        td.appendChild(span);
        tr.appendChild(td);

        // module selector
        td = document.createElement('td');
        td.appendChild(createUISlotModuleControl(group, slot));
        tr.appendChild(td);

        // mass
        td = document.createElement('td');
        td.className = 'tar';
        span = document.createElement('span');
        span.id = 'span_' + group + '_' + slot + '_mass';
        td.appendChild(span);
        tr.appendChild(td);

        // power(ed)
        td = document.createElement('td');
        td.className = 'tar';
        label = document.createElement('label');
        span = document.createElement('span');
        span.id = 'span_' + group + '_' + slot + '_power';
        label.appendChild(span);
        input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'checkbox_' + group + '_' + slot + '_powered';
        input.value = 1;
        input.tabIndex = 40;
        input.checked = true;
        input.addEventListener('change', onFormStatsChange);
        label.appendChild(document.createTextNode(' '));
        label.appendChild(input);
        span = document.createElement('span');
        span.className = 'checkbox';
        label.appendChild(span);
        td.appendChild(label);
        tr.appendChild(td);

        // priority
        td = document.createElement('td');
        button = document.createElement('button');
        button.id = 'button_' + group + '_' + slot + '_priority';
        button.className = 'priority';
        button.tabIndex = 50;
        button.innerHTML = '1';
        button.addEventListener('click', onUISlotPriorityButtonClick);
        td.appendChild(button);
        tr.appendChild(td);

        // attributes
        td = document.createElement('td');
        td.colSpan = 2;
        span = document.createElement('span');
        span.id = 'span_' + group + '_' + slot + '_attr';
        td.appendChild(span);
        tr.appendChild(td);

        // cost
        td = document.createElement('td');
        td.className = 'tar';
        label = document.createElement('label');
        span = document.createElement('span');
        span.id = 'span_' + group + '_' + slot + '_cost';
        label.appendChild(span);
        input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'checkbox_' + group + '_' + slot + '_priced';
        input.value = 1;
        input.tabIndex = 80;
        input.checked = true;
        input.addEventListener('change', onFormStatsChange);
        label.appendChild(document.createTextNode(' '));
        label.appendChild(input);
        span = document.createElement('span');
        span.className = 'checkbox';
        label.appendChild(span);
        td.appendChild(label);
        tr.appendChild(td);

        document.getElementById('tbody_' + group).appendChild(tr);
        return tr;
    }; // createUISlotRow()


    var createUISlotModuleControl = function (group, slot) {
        var divSlot, button, divPopup;

        divSlot = document.createElement('div');
        divSlot.id = 'div_' + group + '_' + slot;
        divSlot.className = 'slotmodule';

        button = document.createElement('button');
        button.id = 'button_' + group + '_' + slot + '_module';
        button.className = 'module';
        button.tabIndex = 20;
        button.value = '';
        button.innerHTML = '(empty)';
        button.addEventListener('click', onUISlotModuleButtonClick);
        button.addEventListener('keydown', onUISlotModuleKeydown);
        divSlot.appendChild(button);

        divPopup = createUISlotModulePopup(group, slot);
        divSlot.appendChild(divPopup);

        button = document.createElement('button');
        button.id = 'button_' + group + '_' + slot + '_modification';
        button.className = 'unmodified icon engineer';
        button.tabIndex = 21;
        //	button.innerHTML = '&#x2731;';
        button.addEventListener('click', onUISlotModificationButtonClick);
        divSlot.appendChild(button);

        divPopup = createUISlotModificationPopup(group, slot);
        divSlot.appendChild(divPopup);
        return divSlot;
    }; // createUISlotModuleControl()


    var createUISlotModulePopup = function (group, slot) {
        var divPopup, divType, divRow, divFlex, header, label, input, span;
        var mtype, sizes, module, moduleClass, moduleUnique;

        divPopup = document.createElement('div');
        divPopup.id = 'div_' + group + '_' + slot + '_module_popup';
        divPopup.className = 'picker';
        divPopup.addEventListener('keydown', onUISlotModuleKeydown, true);
        divPopup.addEventListener('mouseup', onUISlotModulePopupMouseup, true);
        divPopup.addEventListener('wheel', onUIPopupWheel);
        divType = document.createElement('div');
        divType.id = 'div_' + group + '_' + slot + '_mtype_';
        divType.className = 'picker_mtype sizeempty';
        divRow = document.createElement('div');
        divRow.className = 'picker_row sizeempty';
        divFlex = document.createElement('div');
        divFlex.className = 'picker_flex';
        label = document.createElement('label');
        label.id = 'label_' + group + '_' + slot + '_module_' + 0;
        input = document.createElement('input');
        input.tabIndex = 20;
        input.type = 'radio';
        input.name = 'radio_' + group + '_' + slot;
        input.value = 0;
        label.appendChild(input);
        span = document.createElement('span');
        if (group == 'hardpoint') {
            span.innerHTML = '(empty Hardpoint)';
        }
        else if (group == 'utility') {
            span.innerHTML = '(empty Utility Mount)';
        }
        else if (group == 'component') {
            span.innerHTML = '(missing ' + cache.component.slotLabel[slot] + ')';
        }
        else if (group == 'military') {
            span.innerHTML = '(empty Military Compartment)';
        }
        else if (group == 'internal') {
            span.innerHTML = '(empty Internal Compartment)';
        }
        else {
            span.innerHTML = '(empty)';
        }
        label.appendChild(span);
        divFlex.appendChild(label);
        divRow.appendChild(divFlex);
        divType.appendChild(divRow);
        divPopup.appendChild(divType);
        divRow = null;
        var order = ((group == 'component') ? cache.order.component[slot] : cache.order[group]);
        for (var m = 0; m < order.mtypes.length; m++) {
            mtype = order.mtypes[m];
            divType = document.createElement('div');
            divType.id = 'div_' + group + '_' + slot + '_mtype_' + mtype;
            if (order.mtypes.length > 1) {
                header = document.createElement('header');
                span = document.createElement('span');
                span.innerHTML = eddb.mtype[mtype].name;
                header.appendChild(span);
                divType.appendChild(header);
            }
            sizes = {};
            for (var i = 0; i <= order.mtypeModules[mtype].length; i++) {
                module = eddb.module[order.mtypeModules[mtype][i] || 0];
                if (!module || module.class !== moduleClass || !eddb.mtype[mtype].modulenames[module.name] || moduleUnique) {
                    if (divRow) {
                        divType.appendChild(divRow);
                        divRow = null;
                    }
                }
                if (module) {
                    moduleClass = module.class;
                    moduleUnique = !eddb.mtype[mtype].modulenames[module.name];
                    sizes[moduleClass] = 1;
                    if (!divRow) {
                        divRow = document.createElement('div');
                        divRow.className = 'picker_row size' + moduleClass;
                        divFlex = document.createElement('div');
                        divFlex.className = 'picker_flex';
                        divRow.appendChild(divFlex);
                    }
                    label = document.createElement('label');
                    label.id = 'label_' + group + '_' + slot + '_module_' + order.mtypeModules[mtype][i];
                    label.className = (moduleUnique ? 'named' : '');
                    input = document.createElement('input');
                    input.tabIndex = 20;
                    input.type = 'radio';
                    input.name = 'radio_' + group + '_' + slot;
                    input.value = order.mtypeModules[mtype][i];
                    label.appendChild(input);
                    span = document.createElement('span');
                    span.innerHTML = getModuleLabel(module, !moduleUnique, true);
                    label.appendChild(span);
                    divFlex.appendChild(label);
                }
            }
            moduleClass = '';
            for (var s in sizes)
                moduleClass += ' size' + s;
            divType.className = 'picker_mtype' + moduleClass;
            divPopup.appendChild(divType);
        }
        return divPopup;
    }; // createUISlotModulePopup()


    var createUISlotModificationPopup = function (group, slot) {
        var divPopup, table, thead, tbody, tr, th, label, input, span, button, div, select, option;

        divPopup = document.createElement('div');
        divPopup.id = 'div_' + group + '_' + slot + '_modification_popup';
        divPopup.className = 'modification_popup';
        divPopup.addEventListener('focus', onUISlotModificationFocus, true);
        divPopup.addEventListener('keydown', onUISlotModificationKeydown, true);
        divPopup.addEventListener('mousedown', onUISlotModificationMousedown, true);
        //	divPopup.addEventListener('wheel', onUIPopupWheel);
        table = document.createElement('table');
        thead = document.createElement('thead');
        tr = document.createElement('tr');

        th = document.createElement('th');
        th.colSpan = 5;
        div = document.createElement('div');
        div.className = 'selectbuttons';

        select = document.createElement('select');
        select.id = 'select_' + group + '_' + slot + '_storedmodule';
        select.tabIndex = 22;
        option = document.createElement('option');
        option.value = '';
        option.text = '(Stock)';
        option.style.fontStyle = 'italic';
        option.selected = true;
        select.appendChild(option);
        select.addEventListener('change', onSelectStoredModuleChange);
        div.appendChild(select);

        /* TODO: is this worth the screen real estate? *
         button = document.createElement('button');
         button.id = 'button_' + group + '_' + slot + '_storedmodule_reload';
         button.className = 'icon reload';
         button.tabIndex = 22;
         button.addEventListener('click', onButtonStoredModuleActionClick);
         div.appendChild(button);

         button = document.createElement('button');
         button.id = 'button_' + group + '_' + slot + '_storedmodule_save';
         button.className = 'icon save';
         button.tabIndex = 22;
         button.addEventListener('click', onButtonStoredModuleActionClick);
         div.appendChild(button);
         /* */

        button = document.createElement('button');
        button.id = 'button_' + group + '_' + slot + '_storedmodule_saveas';
        button.className = 'icon saveas';
        button.tabIndex = 22;
        button.addEventListener('click', onButtonStoredModuleActionClick);
        div.appendChild(button);

        /* TODO: is this worth the screen real estate? *
         button = document.createElement('button');
         button.id = 'button_' + group + '_' + slot + '_storedmodule_rename';
         button.className = 'icon rename';
         button.tabIndex = 22;
         button.addEventListener('click', onButtonStoredModuleActionClick);
         div.appendChild(button);
         /* */

        button = document.createElement('button');
        button.id = 'button_' + group + '_' + slot + '_storedmodule_delete';
        button.className = 'icon delete';
        button.tabIndex = 22;
        button.addEventListener('click', onButtonStoredModuleActionClick);
        div.appendChild(button);

        select = document.createElement('select');
        select.id = 'select_' + group + '_' + slot + '_blueprint';
        select.tabIndex = 22;
        select.addEventListener('change', onUISlotModificationBlueprintSelectChange);
        option = document.createElement('option');
        option.value = 0;
        option.text = '(No Blueprint)';
        option.style.fontStyle = 'italic';
        select.appendChild(option);
        div.appendChild(select);

        button = document.createElement('button');
        button.id = 'button_' + group + '_' + slot + '_blueprint_avg';
        button.className = 'icon blueprintAvg';
        button.tabIndex = 22;
        button.addEventListener('click', onUISlotModificationBlueprintButtonClick);
        div.appendChild(button);

        button = document.createElement('button');
        button.id = 'button_' + group + '_' + slot + '_blueprint_good';
        button.className = 'icon blueprintGood';
        button.tabIndex = 22;
        button.addEventListener('click', onUISlotModificationBlueprintButtonClick);
        div.appendChild(button);

        /*
         button = document.createElement('button');
         button.id = 'button_' + group + '_' + slot + '_blueprint_max';
         button.className = 'icon blueprintMax';
         button.tabIndex = 22;
         button.addEventListener('click', onUISlotModificationBlueprintButtonClick);
         div.appendChild(button);
         */

        button = document.createElement('button');
        button.id = 'button_' + group + '_' + slot + '_blueprint_best';
        button.className = 'icon blueprintBest';
        button.tabIndex = 22;
        button.addEventListener('click', onUISlotModificationBlueprintButtonClick);
        div.appendChild(button);

        th.appendChild(div);
        tr.appendChild(th);

        thead.appendChild(tr);
        table.appendChild(thead);
        tbody = document.createElement('tbody');
        tbody.id = 'tbody_' + group + '_' + slot + '_modification';
        table.appendChild(tbody);
        divPopup.appendChild(table);
        return divPopup;
    }; // createUISlotModificationPopup()


    var generateUIAttributeHTML = function (html, tag, desc, value, unit, abbrclass, spanclass, spanid) {
        html.push('<div class="attribute">');
        html.push('<abbr title="', desc, '" class="', (abbrclass || ''), '">', tag, '</abbr>');
        html.push('<span id="', (spanid || ''), '" class="', (spanclass || ''), '">', value, '</span>');
        html.push('<small>', unit, '</small>');
        html.push('</div>');
    }; // generateUIAttributeHTML()


    /* **********************************************************************
     * APP RUNTIME LOGIC
     ********************************************************************** */


    var getUIShip = function () {
        return eddb.ship[getUIShipID()];
    }; // getUIShip()


    var getUIShipID = function () {
        return parseInt(document.getElementById('select_ship').value);
    }; // getUIShipID()


    var getUILoadout = function () {
        // ship hull and cargo hatch
        var sID = getUIShipID();
        var ship = eddb.ship[sID];
        if (!ship)
            return null;
        var loadout = createLoadoutStruct(0);
        loadout.label = (hashDecodeS(document.getElementById('select_storedfitting').value).trim() || '');
        loadout.ship = sID;
        loadout.hatch.powered = !!document.getElementById('checkbox_ship_hatch_powered').checked;
        loadout.hatch.priority = parseInt(document.getElementById('button_ship_hatch_priority').innerHTML);

        // modules
        for (var slot = 0; slot < ship.slots.hardpoint.length; slot++)
            loadout.hardpoint[slot] = getUILoadoutSlot('hardpoint', slot);
        for (var slot = 0; slot < ship.slots.utility.length; slot++)
            loadout.utility[slot] = getUILoadoutSlot('utility', slot);
        for (var slot = 0; slot < ship.slots.component.length; slot++)
            loadout.component[slot] = getUILoadoutSlot('component', slot);
        for (var slot = 0; slot < ship.slots.military.length; slot++)
            loadout.military[slot] = getUILoadoutSlot('military', slot);
        for (var slot = 0; slot < ship.slots.internal.length; slot++)
            loadout.internal[slot] = getUILoadoutSlot('internal', slot);

        return loadout;
    }; // getUILoadout()


    var getUILoadoutSlot = function (group, slot) {
        var moduleObj = createLoadoutModuleStruct(0);
        var ship = getUIShip();
        var mID = getUISlotModuleID(group, slot);
        var module = ship.module[mID] || eddb.module[mID];
        if (module) {
            moduleObj.module = mID;
            moduleObj.powered = !!document.getElementById('checkbox_' + group + '_' + slot + '_powered').checked;
            moduleObj.priority = parseInt(document.getElementById('button_' + group + '_' + slot + '_priority').innerHTML);
            if (eddb.mtype[module.mtype].modifiable && isUISlotModified(group, slot)) {
                var num = 0;
                for (var a = 0; a < eddb.mtype[module.mtype].modifiable.length; a++) {
                    var attr = eddb.mtype[module.mtype].modifiable[a];
                    if (eddb.attribute[attr]) {
                        var mod = getUISlotAttributeModifier(group, slot, attr);
                        if (mod != 0) {
                            num++;
                            moduleObj.modifier[attr] = mod;
                        }
                    }
                }
                if (num) {
                    moduleObj.modified = true;
                    moduleObj.blueprint = parseInt(document.getElementById('select_' + group + '_' + slot + '_blueprint').value);
                }
            }
        }
        return moduleObj;
    }; // getUILoadoutSlot()


    var setUILoadout = function (loadout) {
        var ship = eddb.ship[loadout.ship];
        if (!ship)
            return false;

        // update ship picker
        document.getElementById('select_ship').value = loadout.ship;

        // update attributes and cargo hatch
        updateUIShipAttributes(ship);
        document.getElementById('checkbox_ship_priced').checked = true;
        setUISlotPowerPriority('ship', 'hatch', loadout.hatch.powered, loadout.hatch.priority);

        // update hardpoint pickers and hide extra UI rows
        for (var slot = 0; slot < ship.slots.hardpoint.length; slot++) {
            createUISlotRow('hardpoint', slot).style.display = '';
            updateUISlotOptions('hardpoint', slot);
        }
        var tr;
        while (tr = document.getElementById('tr_hardpoint_' + slot)) {
            tr.style.display = 'none';
            slot++;
        }

        // update utility pickers and hide extra UI rows
        for (var slot = 0; slot < ship.slots.utility.length; slot++) {
            createUISlotRow('utility', slot).style.display = '';
            updateUISlotOptions('utility', slot);
        }
        var tr;
        while (tr = document.getElementById('tr_utility_' + slot)) {
            tr.style.display = 'none';
            slot++;
        }

        // update component pickers
        for (var slot = 0; slot < ship.slots.component.length; slot++) {
            createUISlotRow('component', slot).style.display = '';
            updateUISlotOptions('component', slot);
        }

        // update military pickers and hide extra UI rows
        for (var slot = 0; slot < ship.slots.military.length; slot++) {
            createUISlotRow('military', slot).style.display = '';
            updateUISlotOptions('military', slot);
        }
        var tr;
        while (tr = document.getElementById('tr_military_' + slot)) {
            // this is the only group that can become empty, which is a problem for Firefox's table border rendering
            // so instead of hiding rows, we have to destroy them and let CSS then hide the :empty TBODY
            tr.parentNode.removeChild(tr);
            tr = null;
            slot++;
        }

        // update internal pickers and hide extra UI rows
        for (var slot = 0; slot < ship.slots.internal.length; slot++) {
            createUISlotRow('internal', slot).style.display = '';
            updateUISlotOptions('internal', slot);
        }
        var tr;
        while (tr = document.getElementById('tr_internal_' + slot)) {
            tr.style.display = 'none';
            slot++;
        }

        // set modules and apply any provided power management bits and modifications
        for (var slot = 0; slot < ship.slots.hardpoint.length; slot++) {
            var obj = loadout.hardpoint[slot];
            if (!setUISlotModule('hardpoint', slot, obj.module, obj.modified, obj.blueprint, obj.modifier, obj.powered, obj.priority))
                setUISlotModule('hardpoint', slot, 0, false, 0, null, true, 1);
        }
        for (var slot = 0; slot < ship.slots.utility.length; slot++) {
            var obj = loadout.utility[slot];
            if (!setUISlotModule('utility', slot, obj.module, obj.modified, obj.blueprint, obj.modifier, obj.powered, obj.priority))
                setUISlotModule('utility', slot, 0, false, 0, null, true, 1);
        }
        for (var slot = 0; slot < ship.slots.component.length; slot++) {
            var obj = loadout.component[slot];
            if (!setUISlotModule('component', slot, obj.module, obj.modified, obj.blueprint, obj.modifier, obj.powered, obj.priority))
                setUISlotModule('component', slot, (ship.stock.component[slot] || 0), false, 0, null, true, 1);
        }
        for (var slot = 0; slot < ship.slots.military.length; slot++) {
            var obj = loadout.military[slot];
            if (!setUISlotModule('military', slot, obj.module, obj.modified, obj.blueprint, obj.modifier, obj.powered, obj.priority))
                setUISlotModule('military', slot, 0, false, 0, null, true, 1);
        }
        for (var slot = 0; slot < ship.slots.internal.length; slot++) {
            var obj = loadout.internal[slot];
            if (!setUISlotModule('internal', slot, obj.module, obj.modified, obj.blueprint, obj.modifier, obj.powered, obj.priority))
                setUISlotModule('internal', slot, 0, false, 0, null, true, 1);
        }

        return true;
    }; // setUILoadout()


    var updateUIShipAttributes = function (ship) {
        var spansize = document.getElementById('span_ship_size');
        var spanmass = document.getElementById('span_ship_mass');
        var spanpower = document.getElementById('span_ship_hatch_power');
        var inputpowered = document.getElementById('checkbox_ship_hatch_powered');
        var inputpriority = document.getElementById('button_ship_hatch_priority');
        var spanattr = document.getElementById('span_ship_attr');
        var spancost = document.getElementById('span_ship_cost');
        var inputpriced = document.getElementById('checkbox_ship_priced');
        if (ship === undefined)
            ship = getUIShip();

        if (ship) {
            var attrHTML = [];
            var hide = {topspd: 1, bstspd: 1, minthrust: 1, boostcost: 1, pitch: 1, yaw: 1, roll: 1, shields: 1, armour: 1, fuelcost: 1, heatcap: 1};
            var special = {class: ship.class, mass: 0, pwrcap: 0, pwrdraw: POWER_HATCH, cost: ship.cost};
            var attr, tag, desc, value, unit, abbrclass;
            var order = cache.order.attribute;
            for (var a = 0; a < order.length; a++) {
                attr = order[a];
                value = ship[attr];
                if (value !== undefined) {
                    if (special[attr] !== undefined) {
                        special[attr] = value;
                    }
                    else if (!hide[attr]) {
                        tag = eddb.attribute[attr].abbr || attr;
                        desc = eddb.attribute[attr].desc || eddb.attribute[attr].name;
                        unit = eddb.attribute[attr].unit || '';
                        abbrclass = '';
                        switch (attr) {
                            case 'rank':
                                if (value <= 0)
                                    continue;
                                if (eddb.rank[ship.faction] && value < eddb.rank[ship.faction].length)
                                    value = eddb.rank[ship.faction][value] + ' (' + value + ')';
                                break;
                        }
                        generateUIAttributeHTML(attrHTML, tag, desc, value, unit, abbrclass);
                    }
                }
            }
            spansize.innerHTML = special.class ? '?SML'[special.class] : formatNumHTML(NaN, 0);
            spanmass.innerHTML = special.mass ? formatNumHTML(special.mass, 2) : '';
            spanpower.innerHTML = formatNumHTML(-special.pwrdraw, 2);
            inputpowered.style.visibility = special.pwrdraw ? 'visible' : 'hidden';
            inputpriority.style.visibility = special.pwrdraw ? 'visible' : 'hidden';
            spanattr.innerHTML = attrHTML.join('');
            var discount = document.getElementById('select_discount').value.split('_');
            var discountAll = (discount[0] == 'all') ? parseFloat(discount[1]) : 0;
            var discountShip = (discount[0] == 'ship') ? parseFloat(discount[1]) : 0;
            spancost.innerHTML = special.cost ? formatNumHTML(special.cost * (1 - discountAll) - (ship.retail * discountShip), 0) : '';
            inputpriced.style.visibility = special.cost ? 'visible' : 'hidden';
        }
        else {
            spansize.innerHTML = '';
            spanmass.innerHTML = '';
            spanpower.innerHTML = '';
            inputpowered.style.visibility = 'hidden';
            inputpriority.style.visibility = 'hidden';
            spanattr.innerHTML = '';
            spancost.innerHTML = '';
            inputpriced.style.visibility = 'hidden';
        }
    }; // updateUIShipAttributes()


    var updateUISlotOptions = function (group, slot) {
        var sID = parseInt(document.getElementById('select_ship').value);
        var ship = eddb.ship[sID];
        var label = '?';
        //	var empty = '(empty)';

        switch (group) {
            case 'hardpoint':
                label = 'USMLH'[ship.slots.hardpoint[slot]];
                //		empty = '(empty ' + cache.hardpoint.classLabel[ship.slots.hardpoint[slot]] + ')';
                break;
            case 'utility':
                label = 'U';
                //		empty = '(empty Utility Mount)';
                break;
            case 'component':
                label = formatNum0(ship.slots.component[slot]);
                break;
            case 'military':
                label = formatNum0(ship.slots.military[slot]);
                //		empty = '(empty C' + ship.slots.military[slot] + ' Military Compartment)';
                break;
            case 'internal':
                label = formatNum0(ship.slots.internal[slot]);
                //		empty = '(empty C' + ship.slots.internal[slot] + ' Internal Compartment)';
                break;
        }

        if (ship.reserved && ship.reserved[group] && ship.reserved[group][slot]) {
            label = '<abbr class="attention" title="This compartment is restricted to only certain types of modules">' + label + '*</abbr>';
        }
        document.getElementById('span_' + group + '_' + slot + '_class').innerHTML = label;
        //	document.getElementById('label_'+group+'_'+slot+'_module_0').getElementsByTagName('SPAN')[0].innerHTML = empty;

        var div = document.getElementById('div_' + group + '_' + slot + '_module_popup');
        var classes = 'picker';
        if (group == 'hardpoint' || group == 'utility' || group == 'military' || group == 'internal')
            classes += ' showempty';
        if (group == 'utility')
            classes += ' showsize0';
        var c = (group == 'component' && (slot == cache.component.abbrSlot.LS || slot == cache.component.abbrSlot.SS)) ? ship.slots[group][slot] : 1;
        while (c <= ship.slots[group][slot]) {
            classes += ' showsize' + c;
            c++;
        }
        div.className = classes;

        if (group == 'component' && slot == cache.component.abbrSlot.PD) {
            var mtype = 'cpd';
            div = document.getElementById('div_' + group + '_' + slot + '_mtype_' + mtype);
            // flag distributors that can't boost this ship
            var inputs = div.getElementsByTagName('INPUT');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].className = isShipSlotModuleBigEnough(sID, group, slot, parseInt(inputs[i].value)) ? '' : 'warning';
            }
        }

        if (group == 'internal') { // TODO if other groups ever have reserved slots
            // show/hide mtype blocks in case the slot was/is reserved
            for (var m = 0; m < cache.order[group].mtypes.length; m++) {
                var mtype = cache.order[group].mtypes[m];
                div = document.getElementById('div_' + group + '_' + slot + '_mtype_' + mtype);
                div.style.display = ((ship.reserved && ship.reserved[group] && ship.reserved[group][slot] && !ship.reserved[group][slot][mtype]) ? 'none' : '');
                // enable/disable individual modules of certain types in case they're reserved or mass limited
                if (mtype == 'ifh' || mtype == 'ipc' || mtype == 'isg') { // TODO if other mtypes ever have reserved ships
                    var inputs = div.getElementsByTagName('INPUT');
                    for (var i = 0; i < inputs.length; i++) {
                        inputs[i].disabled = !isShipSlotModuleValid(sID, group, slot, parseInt(inputs[i].value));
                        inputs[i].className = isShipSlotModuleBigEnough(sID, group, slot, parseInt(inputs[i].value)) ? '' : 'warning';
                    }
                }
            }
        }
    }; // updateUISlotOptions()


    var getUISlotModule = function (group, slot) {
        var ship = getUIShip();
        var mID = getUISlotModuleID(group, slot);
        return ship.module[mID] || eddb.module[mID];
    }; // getUISlotModule()


    var getUISlotModuleID = function (group, slot) {
        var button = document.getElementById('button_' + group + '_' + slot + '_module');
        return parseInt(button.value);
    }; // getUISlotModuleID()


    var setUISlotModule = function (group, slot, mID, modified, blueprint, modifier, powered, priority) {
        var sID = getUIShipID();
        if (!isShipSlotModuleValid(sID, group, slot, mID))
            return false;
        var ship = eddb.ship[sID];
        var module = ship.module[mID] || eddb.module[mID];

        var button = document.getElementById('button_' + group + '_' + slot + '_module');
        if (module) {
            button.value = mID;
            button.innerHTML = getModuleLabel(module, false, true);
        }
        else {
            button.value = '0';
            if (group == 'hardpoint') {
                button.innerHTML = '(empty ' + cache.hardpoint.classLabel[ship.slots.hardpoint[slot]] + ')';
            }
            else if (group == 'utility') {
                button.innerHTML = '(empty Utility Mount)';
            }
            else if (group == 'component') {
                button.innerHTML = '(missing ' + cache.component.slotLabel[slot] + ')';
            }
            else if (group == 'military') {
                button.innerHTML = '(empty C' + ship.slots.military[slot] + ' Military Compartment)';
            }
            else if (group == 'internal') {
                button.innerHTML = '(empty C' + ship.slots.internal[slot] + ' Internal Compartment)';
            }
            else {
                button.innerHTML = '(empty)';
            }
        }

        // if it's a singleton type, remove any others of the same type
        if (module && eddb.mtype[module.mtype].singleton) {
            var i = ship.slots[group].length;
            while (i-- > 0) {
                var other = getUISlotModule(group, i);
                if (i != slot && other && other.mtype == module.mtype)
                    setUISlotModule(group, i, 0);
            }
        }

        // rebuild the modification popup table and apply modifications and power management
        resetUISlotModification(group, slot);
        if (modified)
            setUISlotModifications(group, slot, modified, blueprint, modifier);
        powered = (module ? powered : true);
        priority = (module ? priority : 1);
        setUISlotPowerPriority(group, slot, powered, priority);

        // redraw the attribute summary and update any related module types in case we swapped out a relevant module
        updateUISlotAttributes(group, slot, module);
        if (group == 'utility' && (!module || module.mtype != 'usb'))
            updateSpecificModuleAttributes('internal', 'isg');
        if (group == 'internal' && (!module || module.mtype != 'cft'))
            updateSpecificModuleAttributes('internal', 'ifs');
        if ((group == 'military' || group == 'internal') && (!module || module.mtype != 'ihrp'))
            updateSpecificModuleAttributes('component', cache.component.abbrSlot.BH);
        document.getElementById('checkbox_' + group + '_' + slot + '_priced').checked = true;

        // hide redundant empty hardpoints and utilities
        if (group == 'hardpoint' || group == 'utility') {
            document.getElementById('span_' + group + '_' + slot + '_class').innerHTML = 'USMLH'[ship.slots[group][slot]];
            var size = 99;
            var count = 0;
            var i = ship.slots[group].length;
            while (i-- >= 0) {
                module = (i >= 0) ? getUISlotModule(group, i) : null;
                if (i < 0 || ship.slots[group][i] != size || module) {
                    if (count > 0) {
                        document.getElementById('tr_' + group + '_' + (i + 1)).style.display = '';
                        document.getElementById('span_' + group + '_' + (i + 1) + '_class').innerHTML = (count > 1) ? ('x' + count) : 'USMLH'[size];
                    }
                    size = ship.slots[group][i];
                    count = 0;
                }
                if (module) {
                    document.getElementById('tr_' + group + '_' + i).style.display = '';
                    count = 0;
                }
                else if (i >= 0) {
                    document.getElementById('tr_' + group + '_' + i).style.display = 'none';
                    count++;
                }
            }
        }

        return true;
    }; // setUISlotModule()


    var resetUISlotModification = function (group, slot) {
        var button = document.getElementById('button_' + group + '_' + slot + '_modification');
        var div = document.getElementById('div_' + group + '_' + slot + '_modification_popup');
        if (!button || !div)
            return false;
        var selectBP = document.getElementById('select_' + group + '_' + slot + '_blueprint');
        var tbody = div.getElementsByTagName('TBODY')[0];
        var module = getUISlotModule(group, slot);
        var hide = {mount: 1, missile: 1};
        var attr, tr, abbr, input, slider;

        var scale1 = (100 * modifierToSliderPos(-0.5)) | 0;
        var scale2 = (100 * modifierToSliderPos(-1.0)) | 0;
        var scale3 = (100 * modifierToSliderPos(-1.5)) | 0;
        if (module && eddb.mtype[module.mtype].modifiable) {
            var order = cache.order.mtypeBlueprints[module.mtype];
            for (var i = 0; i < order.length; i++) {
                while (!selectBP.options[1 + i])
                    selectBP.appendChild(document.createElement('option'));
                selectBP.options[1 + i].value = order[i];
                selectBP.options[1 + i].text = eddb.mtype[module.mtype].blueprint[order[i]].name + ' ' + eddb.mtype[module.mtype].blueprint[order[i]].grade;
            }
            while (selectBP.options[1 + i])
                selectBP.removeChild(selectBP.options[selectBP.options.length - 1]);
            selectBP.selectedIndex = 0;

            var order = cache.order.attribute;
            for (var i = 0, r = 0; i < order.length; i++) {
                attr = order[i];
                var modifiable = ((attr == 'rof' && module.bstint) || (attr == 'dps' && module.damage) || isModuleAttributeModifiable(module, attr));
                if ((module[attr] !== undefined && !hide[attr]) || modifiable) {
                    abbr = null;
                    input = null;
                    while (r >= tbody.rows.length) {
                        var tr = document.createElement('tr');
                        tr.appendChild(document.createElement('td'));
                        tr.appendChild(document.createElement('td'));
                        tr.appendChild(document.createElement('td'));
                        tr.appendChild(document.createElement('td'));
                        tr.appendChild(document.createElement('td'));
                        abbr = document.createElement('abbr');
                        tr.cells[0].appendChild(abbr);
                        input = document.createElement('input');
                        input.tabIndex = 22;
                        input.type = 'text';
                        input.size = 4;
                        input.addEventListener('change', onUISlotModificationChange);
                        tr.cells[1].appendChild(input);
                        slider = document.createElement('abbr');
                        slider.className = 'slider';
                        slider.innerHTML = (
                                '<div class="range" style="left:50%;right:50%"></div>' +
                                '<div class="scale" style="left:' + scale1 + '%;right:' + scale1 + '%"></div>' +
                                '<div class="scale" style="left:' + scale2 + '%;right:' + scale2 + '%"></div>' +
                                '<div class="scale" style="left:' + scale3 + '%;right:' + scale3 + '%"></div>' +
                                '<div></div>'
                                );
                        tr.cells[3].appendChild(slider);
                        tbody.appendChild(tr);
                    }
                    abbr = abbr || tbody.rows[r].cells[0].getElementsByTagName('abbr')[0];
                    abbr.innerHTML = eddb.attribute[attr].name;
                    abbr.title = eddb.attribute[attr].desc;
                    input = input || tbody.rows[r].cells[1].getElementsByTagName('input')[0];
                    input.name = attr;
                    input.value = encodeModuleAttributeValueToText(module, attr, getModuleAttributeValue(module, attr));
                    input.disabled = !((attr == 'rof' && module.bstint) || isModuleAttributeModifiable(module, attr));
                    tbody.rows[r].cells[2].innerHTML = eddb.attribute[attr].unit || '';
                    tbody.rows[r].cells[3].firstChild.style.display = (modifiable ? 'block' : 'none');
                    tbody.rows[r].cells[3].firstChild.title = '';
                    tbody.rows[r].cells[3].firstChild.firstChild.className = 'range';
                    tbody.rows[r].cells[3].firstChild.firstChild.style.left = '50%';
                    tbody.rows[r].cells[3].firstChild.firstChild.style.right = '50%';
                    tbody.rows[r].cells[3].firstChild.lastChild.className = 'marker';
                    tbody.rows[r].cells[3].firstChild.lastChild.style.left = '50%';
                    tbody.rows[r].cells[4].innerHTML = '';
                    tbody.rows[r].style.display = ((attr == 'bstint') ? 'none' : '');
                    r++;
                }
            }
            while (r < tbody.rows.length) {
                tbody.rows[r].cells[1].getElementsByTagName('input')[0].name = '';
                tbody.rows[r].style.display = 'none';
                r++;
            }
            button.style.visibility = 'visible';
        }
        else {
            button.style.visibility = 'hidden';
        }
        setUISlotModified(group, slot, false);
        return true;
    }; // resetUISlotModification()


    var isUISlotModified = function (group, slot) {
        var selectSM = document.getElementById('select_' + group + '_' + slot + '_storedmodule');
        return (selectSM ? (selectSM.selectedIndex != 0) : undefined);
    }; // isUISlotModified()


    var setUISlotModified = function (group, slot, modified) {
        var selectSM = document.getElementById('select_' + group + '_' + slot + '_storedmodule');
        if (selectSM && (selectSM.selectedIndex != 0) != !!modified)
            selectSM.selectedIndex = (modified ? -1 : 0);
        var button = document.getElementById('button_' + group + '_' + slot + '_modification');
        if (button)
            button.className = (modified ? 'modified' : 'unmodified') + ' icon engineer';
    }; // setUISlotModified()


    var getUISlotBlueprint = function (group, slot) {
        if (!isUISlotModified(group, slot))
            return 0;
        var selectBP = document.getElementById('select_' + group + '_' + slot + '_blueprint');
        return (selectBP ? parseInt(selectBP.value) : undefined);
    }; // getUISlotBlueprint()


    var setUISlotBlueprint = function (group, slot, bID) {
        var module = getUISlotModule(group, slot);
        var selectBP = document.getElementById('select_' + group + '_' + slot + '_blueprint');
        var tbody = selectBP;
        while (tbody && tbody.tagName !== 'TABLE')
            tbody = tbody.parentNode;
        if (!module || !selectBP || !tbody)
            return false;
        tbody = tbody.tBodies[0];

        if (bID)
            setUISlotModified(group, slot, true);
        selectBP.value = bID || 0;
        var button = selectBP;
        while (button = button.nextSibling)
            button.disabled = (!eddb.mtype[module.mtype].blueprint || !eddb.mtype[module.mtype].blueprint[bID]);

        var minmods = getModuleBlueprintRolledModifiers(module, bID, 0, 0);
        var maxmods = getModuleBlueprintRolledModifiers(module, bID, 1, 1);
        for (var r = 0; r < tbody.rows.length; r++) {
            var input = tbody.rows[r].cells[1].firstChild;
            var attr = input.name;
            input.disabled = !isModuleAttributeModifiable(module, attr);
            var slider = tbody.rows[r].cells[3].firstChild;
            var range = slider.firstChild;
            if (minmods[attr] || maxmods[attr]) {
                var minval = getModuleAttributeValue(module, attr, minmods[attr]);
                var minmod = encodeModuleAttributeModifierToText(module, attr, getModuleAttributeModifier(module, attr, minval));
                var minpos = modifierToSliderPos((eddb.attribute[attr].bad ? -1 : 1) * parseFloat(minmod || 0) / 100);
                var maxval = getModuleAttributeValue(module, attr, maxmods[attr]);
                var maxmod = encodeModuleAttributeModifierToText(module, attr, getModuleAttributeModifier(module, attr, maxval));
                var maxpos = modifierToSliderPos((eddb.attribute[attr].bad ? -1 : 1) * parseFloat(maxmod || 0) / 100);
                range.style.left = (100 * min(max(minpos, 0), 1)).toFixed(2) + '%';
                range.style.right = (100 * min(max(1 - maxpos, 0), 1)).toFixed(2) + '%';
                range.className = ((minpos < 0.5 && minpos < (1 - maxpos)) ? 'range red' : 'range blue');
                slider.title = (
                        encodeModuleAttributeValueToText(module, attr, minval) + (eddb.attribute[attr].unit || '')
                        + ' (' + (minmod || '+0%') + ') ... ' +
                        encodeModuleAttributeValueToText(module, attr, maxval) + (eddb.attribute[attr].unit || '')
                        + ' (' + (maxmod || '+0%') + ')'
                        );
            }
            else {
                range.className = 'range';
                range.style.left = '50%';
                range.style.right = '50%';
                slider.title = '';
            }
        }
    }; // setUISlotBlueprint()


    var getUISlotAttributeInput = function (group, slot, attr) {
        var div = document.getElementById('div_' + group + '_' + slot + '_modification_popup');
        if (!div)
            return null;
        var inputs = div.getElementsByTagName('INPUT');
        var i = inputs.length;
        while (i-- > 0) {
            if (inputs[i].name == attr)
                return inputs[i];
        }
        if (eddb.attribute[attr] && isNaN(eddb.attribute[attr].default) && !isNaN(eddb.attribute[attr].scale))
            return getUISlotAttributeInput(group, slot, eddb.attribute[attr].default);
        return null;
    }; // getUISlotAttributeInput()


    var getUISlotAttributeValue = function (group, slot, attr) {
        var module = getUISlotModule(group, slot);
        if (!module) {
            return undefined;
        }
        else if (attr == 'rof') {
            var bstsize = getUISlotAttributeValue(group, slot, 'bstsize');
            return (bstsize / ((bstsize - 1) / (getUISlotAttributeValue(group, slot, 'bstrof') || 1) + getUISlotAttributeValue(group, slot, 'bstint')));
        }
        else if (attr == 'dps') {
            var rof = getUISlotAttributeValue(group, slot, 'rof');
            return (getUISlotAttributeValue(group, slot, 'damage') * (isFinite(rof) ? rof : 1.0) * getUISlotAttributeValue(group, slot, 'rounds'));
        }
        var value = getModuleAttributeValue(module, attr);
        if (isUISlotModified(group, slot)) {
            var input = getUISlotAttributeInput(group, slot, attr);
            if (input)
                value = (typeof value === 'number') ? parseFloat(input.value) : input.value;
        }
        return value;
    }; // getUISlotAttributeValue()


    var getUISlotAttributeModifier = function (group, slot, attr, value) {
        var module = getUISlotModule(group, slot);
        if (!module)
            return undefined;
        if (value === undefined)
            value = getUISlotAttributeValue(group, slot, attr);
        return getModuleAttributeModifier(module, attr, value);
    }; // getUISlotAttributeModifier()


    var setUISlotAttributeModifier = function (group, slot, attr, modifier) {
        var module = getUISlotModule(group, slot);
        var input = getUISlotAttributeInput(group, slot, attr);
        var tr = input;
        while (tr && tr.tagName !== 'TR')
            tr = tr.parentNode;
        if (!module || !input || !tr)
            return false;
        input.value = encodeModuleAttributeValueToText(module, attr, getModuleAttributeValue(module, attr, modifier));
        var marker = tr.cells[3].firstChild.lastChild;
        if (modifier === undefined || modifier == 0) {
            tr.cells[4].innerHTML = '';
            tr.cells[4].className = '';
            marker.className = 'marker';
            marker.style.left = '50%';
        }
        else {
            var dispmod = encodeModuleAttributeModifierToText(module, attr, modifier);
            var disppos = ((modifier * (eddb.attribute[attr].modmod || 1)) > 0) ^ (eddb.attribute[attr].bad > 0);
            tr.cells[4].innerHTML = dispmod;
            //tr.cells[4].innerHTML += ' ; ' + modifier.toFixed(6); // DEBUG
            tr.cells[4].className = (disppos ? 'bluefg' : 'redfg');
            marker.style.left = (100 * min(max(modifierToSliderPos((eddb.attribute[attr].bad ? -1 : 1) * parseFloat(dispmod) / 100), 0), 1)).toFixed(2) + '%';
            marker.className = (disppos ? 'marker blue' : 'marker red');
        }
        // special cases: some modifiers also apply to or influence other attributes
        if (attr == 'damage' || attr == 'bstint' || attr == 'bstrof' || attr == 'bstsize' || attr == 'rounds') {
            var rofbase = getModuleAttributeValue(module, 'rof');
            if (isFinite(rofbase)) {
                var bstsize = getUISlotAttributeValue(group, slot, 'bstsize');
                var rofvalue = bstsize / ((bstsize - 1) / (getUISlotAttributeValue(group, slot, 'bstrof') || 1) + getUISlotAttributeValue(group, slot, 'bstint'));
                var rofmod = (rofvalue / rofbase) - 1;
            }
            else {
                var rofmod = 0;
            }
            setUISlotAttributeModifier(group, slot, 'rof', rofmod);
            var dpsmod = ((1 + getUISlotAttributeModifier(group, slot, 'damage')) * (1 + rofmod) * (1 + getUISlotAttributeModifier(group, slot, 'rounds'))) - 1;
            setUISlotAttributeModifier(group, slot, 'dps', dpsmod);
        }
        else if (attr == 'maxrng' && modifier > 0) {
            setUISlotAttributeModifier(group, slot, 'shotspd', modifier);
        }
        else if (attr == 'optmass') {
            setUISlotAttributeModifier(group, slot, 'minmass', modifier);
            setUISlotAttributeModifier(group, slot, 'maxmass', modifier);
        }
        else if (attr == 'optmul') {
            setUISlotAttributeModifier(group, slot, 'minmul', modifier);
            setUISlotAttributeModifier(group, slot, 'maxmul', modifier);
            if (module.optmulspd) {
                setUISlotAttributeModifier(group, slot, 'minmulspd', modifier);
                setUISlotAttributeModifier(group, slot, 'optmulspd', modifier);
                setUISlotAttributeModifier(group, slot, 'maxmulspd', modifier);
            }
            if (module.optmulacc) {
                setUISlotAttributeModifier(group, slot, 'minmulacc', modifier);
                setUISlotAttributeModifier(group, slot, 'optmulacc', modifier);
                setUISlotAttributeModifier(group, slot, 'maxmulacc', modifier);
            }
            if (module.optmulrot) {
                setUISlotAttributeModifier(group, slot, 'minmulrot', modifier);
                setUISlotAttributeModifier(group, slot, 'optmulrot', modifier);
                setUISlotAttributeModifier(group, slot, 'maxmulrot', modifier);
            }
        }
        return true;
    }; // setUISlotAttributeModifier()


    var setUISlotModifications = function (group, slot, modified, blueprint, modifier) {
        setUISlotModified(group, slot, modified);
        setUISlotBlueprint(group, slot, blueprint);
        var tbody = document.getElementById('tbody_' + group + '_' + slot + '_modification');
        modifier = (modified && modifier) ? modifier : {};
        // because some attrs affect others, we need to apply all resets before any modifiers
        var after = [];
        for (var r = 0; r < tbody.rows.length; r++) {
            var attr = tbody.rows[r].cells[1].firstChild.name;
            if (modifier[attr] !== undefined) {
                after.push(attr);
            }
            else if (attr) {
                setUISlotAttributeModifier(group, slot, attr, modifier[attr]);
            }
        }
        for (var a = 0; a < after.length; a++) {
            var attr = after[a];
            setUISlotAttributeModifier(group, slot, attr, modifier[attr]);
        }
    }; // setUISlotModifications()


    var setUISlotPowerPriority = function (group, slot, powered, priority) {
        if (powered !== undefined) {
            powered = !!powered;
            document.getElementById('checkbox_' + group + '_' + slot + '_powered').checked = powered;
        }
        if (priority !== undefined) {
            priority = parseInt(priority).toFixed(0);
            var button = document.getElementById('button_' + group + '_' + slot + '_priority');
            button.className = 'priority power' + priority;
            button.innerHTML = priority;
        }
    }; // setUISlotPowerPriority()


    var updateSpecificModuleAttributes = function (group, mtype) {
        var ship = eddb.ship[parseInt(document.getElementById('select_ship').value)];
        var module;
        if (group == 'hardpoint' || group == 'utility' || group == 'military' || group == 'internal') {
            for (var i = 0; i < ship.slots[group].length; i++) {
                module = getUISlotModule(group, i);
                if (module && module.mtype == mtype) {
                    updateUISlotAttributes(group, i, module);
                    return true;
                }
            }
        }
        else if (group == 'component') {
            var slot = mtype;
            module = getUISlotModule(group, slot);
            if (module) {
                updateUISlotAttributes(group, slot, module);
                return true;
            }
        }
        return false;
    }; // updateSpecificModuleAttributes()


    var updateUISlotAttributes = function (group, slot, module) {
        var spanmass = document.getElementById('span_' + group + '_' + slot + '_mass');
        var spanpower = document.getElementById('span_' + group + '_' + slot + '_power');
        var inputpowered = document.getElementById('checkbox_' + group + '_' + slot + '_powered');
        var inputpriority = document.getElementById('button_' + group + '_' + slot + '_priority');
        var spanattr = document.getElementById('span_' + group + '_' + slot + '_attr');
        var spancost = document.getElementById('span_' + group + '_' + slot + '_cost');
        var inputpriced = document.getElementById('checkbox_' + group + '_' + slot + '_priced');
        if (module === undefined)
            module = getUISlotModule(group, slot);

        if (module) {
            var attrHTML = [];
            var ship = eddb.ship[parseInt(document.getElementById('select_ship').value)];
            var modified = isUISlotModified(group, slot);
            var hide = {
                integ: (module.mtype != 'imrp'), boottime: (module.mtype != 'cfsd'), maxcargo: 1, passiverng: 1, hullbst: 1,
                bstint: 1, bstrof: 1, bstsize: 1, minbrc: 1, maxbrc: 1, rounds: 1, dmgtype: 1,
                minmass: 1, maxmass: 1, minmul: 1, maxmul: 1, minmulspd: 1, optmulspd: 1, maxmulspd: 1, minmulacc: 1, optmulacc: 1, maxmulacc: 1, minmulrot: 1, optmulrot: 1, maxmulrot: 1,
                wepchg: 1, engchg: 1, syschg: 1
            };
            var special = {mass: 0, pwrcap: 0, pwrdraw: 0, cost: module.cost};
            var attr, modifiable, tag, desc, value, diff, unit, abbrclass, spanclass, v2, v3;

            switch (module.mtype) {
                case 'usb':
                    updateSpecificModuleAttributes('internal', 'isg');
                    break;
                case 'cbh':
                    // TODO: value mod coloring
                    value = ship.armour * (1 + getUISlotAttributeValue(group, slot, 'hullbst') / 100.0);
                    var expdmg = (1 - (getUISlotAttributeValue(group, slot, 'expres') / 100.0));
                    var kindmg = (1 - (getUISlotAttributeValue(group, slot, 'kinres') / 100.0));
                    var thmdmg = (1 - (getUISlotAttributeValue(group, slot, 'thmres') / 100.0));
                    var expdmgE = kindmgE = thmdmgE = 1;
                    for (var i = 0; i < ship.slots.military.length; i++) {
                        var moduleI = getUISlotModule('military', i);
                        if (moduleI && moduleI.mtype == 'ihrp') {
                            value += ship.armour * (getUISlotAttributeValue('military', i, 'hullbst') / 100.0);
                            value += getUISlotAttributeValue('military', i, 'hullrnf');
                            expdmgE *= (1 - (getUISlotAttributeValue('military', i, 'expres') / 100.0));
                            kindmgE *= (1 - (getUISlotAttributeValue('military', i, 'kinres') / 100.0));
                            thmdmgE *= (1 - (getUISlotAttributeValue('military', i, 'thmres') / 100.0));
                        }
                    }
                    for (var i = 0; i < ship.slots.internal.length; i++) {
                        var moduleI = getUISlotModule('internal', i);
                        if (moduleI && moduleI.mtype == 'ihrp') {
                            value += ship.armour * (getUISlotAttributeValue('internal', i, 'hullbst') / 100.0);
                            value += getUISlotAttributeValue('internal', i, 'hullrnf');
                            expdmgE *= (1 - (getUISlotAttributeValue('internal', i, 'expres') / 100.0));
                            kindmgE *= (1 - (getUISlotAttributeValue('internal', i, 'kinres') / 100.0));
                            thmdmgE *= (1 - (getUISlotAttributeValue('internal', i, 'thmres') / 100.0));
                        }
                    }
                    expdmg = 1 - getEffectiveDamageResistance(1 - expdmg, 1 - expdmgE);
                    kindmg = 1 - getEffectiveDamageResistance(1 - kindmg, 1 - kindmgE);
                    thmdmg = 1 - getEffectiveDamageResistance(1 - thmdmg, 1 - thmdmgE);
                    cache.stats.armour = value;
                    cache.stats.armourexpres = (1 - expdmg) * 100;
                    cache.stats.armourkinres = (1 - kindmg) * 100;
                    cache.stats.armourthmres = (1 - thmdmg) * 100;
                    value = value.toFixed(1) + ' (' + (value / kindmg).toFixed(1) + '<small>Ki</small>/' + (value / thmdmg).toFixed(1) + '<small>Th</small>/' + (value / expdmg).toFixed(1) + '<small>Ex</small>)';
                    generateUIAttributeHTML(attrHTML, 'Hull', 'Raw hull strength (and effective strength vs kinetic/thermal/explosive damage), including reinforcement packages', value, '');
                    break;
                case 'cpp':
                    /* TODO
                     generateUIAttributeHTML(attrHTML, 'Heat', 'Idle heat level with hardpoints retracted/deployed, not including any active thermal loads (not exact; derived from experimental testing)', '', '%', 'attention', null, 'span_heat_idle');
                     */
                    break;
                case 'cft':
                    updateSpecificModuleAttributes('internal', 'ifs');
                    break;
                case 'ihrp':
                    updateSpecificModuleAttributes('component', cache.component.abbrSlot.BH);
                    break;
                case 'iscb':
                    // TODO: value mod coloring
                    v2 = getUISlotAttributeValue(group, slot, 'shieldrnf') * getUISlotAttributeValue(group, slot, 'duration');
                    v3 = getUISlotAttributeValue(group, slot, 'ammoclip') + getUISlotAttributeValue(group, slot, 'ammomax');
                    generateUIAttributeHTML(attrHTML, 'Ttl', 'Shield reinforcement total (shields per use * total ammo)', '' + (v2 * v3).toFixed(1) + ' (' + v2.toFixed(1) + '*' + v3.toFixed(0) + ')', '');
                    break;
                case 'isg':
                    // TODO: value mod coloring
                    var shieldbst = 0
                    var expdmg = (1 - (getUISlotAttributeValue(group, slot, 'expres') / 100.0));
                    var kindmg = (1 - (getUISlotAttributeValue(group, slot, 'kinres') / 100.0));
                    var thmdmg = (1 - (getUISlotAttributeValue(group, slot, 'thmres') / 100.0));
                    var expdmgE = kindmgE = thmdmgE = 1;
                    for (var i = 0; i < ship.slots.utility.length; i++) {
                        var moduleH = getUISlotModule('utility', i);
                        if (moduleH && moduleH.mtype == 'usb' && document.getElementById('checkbox_utility_' + i + '_powered').checked) {
                            shieldbst += getUISlotAttributeValue('utility', i, 'shieldbst');
                            expdmgE *= (1 - (getUISlotAttributeValue('utility', i, 'expres') / 100));
                            kindmgE *= (1 - (getUISlotAttributeValue('utility', i, 'kinres') / 100));
                            thmdmgE *= (1 - (getUISlotAttributeValue('utility', i, 'thmres') / 100));
                        }
                    }
                    value = ship.shields * getEffectiveShieldBoostMultiplier(shieldbst) * getMassCurveMultiplier(
                            ship.mass,
                            getUISlotAttributeValue(group, slot, 'minmass'), getUISlotAttributeValue(group, slot, 'optmass'), getUISlotAttributeValue(group, slot, 'maxmass'),
                            getUISlotAttributeValue(group, slot, 'minmul') / 100.0, getUISlotAttributeValue(group, slot, 'optmul') / 100.0, getUISlotAttributeValue(group, slot, 'maxmul') / 100.0
                            );
                    expdmg = 1 - getEffectiveDamageResistance(1 - expdmg, 1 - expdmgE);
                    kindmg = 1 - getEffectiveDamageResistance(1 - kindmg, 1 - kindmgE);
                    thmdmg = 1 - getEffectiveDamageResistance(1 - thmdmg, 1 - thmdmgE);
                    cache.stats.shield = value;
                    cache.stats.shieldexpres = (1 - expdmg) * 100;
                    cache.stats.shieldkinres = (1 - kindmg) * 100;
                    cache.stats.shieldthmres = (1 - thmdmg) * 100;
                    if (ship.mass > getUISlotAttributeValue(group, slot, 'maxmass')) {
                        value = '<abbr class="error" title="Hull mas exceeds generator maximum mass">ERR</abbr>';
                    }
                    else {
                        value = value.toFixed(1) + ' (' + (value / kindmg).toFixed(1) + '<small>Ki</small>/' + (value / thmdmg).toFixed(1) + '<small>Th</small>/' + (value / expdmg).toFixed(1) + '<small>Ex</small>)';
                    }
                    generateUIAttributeHTML(attrHTML, 'Shd', 'Raw shield strength (and effective strength vs kinetic/thermal/explosive damage), including boosters', value, '');
                    break;
            }
            var order = cache.order.attribute;
            for (var a = 0; a < order.length; a++) {
                attr = order[a];
                modifiable = ((attr == 'rof' && module.bstint) || (attr == 'dps' && module.damage) || isModuleAttributeModifiable(module, attr));
                if (module[attr] !== undefined || (modified && modifiable)) {
                    value = getUISlotAttributeValue(group, slot, attr);
                    if (special[attr] !== undefined) {
                        special[attr] = value;
                    }
                    else if (!hide[attr]) {
                        tag = eddb.attribute[attr].abbr || attr;
                        desc = eddb.attribute[attr].desc || eddb.attribute[attr].name;
                        unit = eddb.attribute[attr].unit || '';
                        abbrclass = '';
                        diff = (modified && modifiable) ? (value - getModuleAttributeValue(module, attr)) : 0;
                        spanclass = ((diff == 0) ? '' : (((diff < 0) == !eddb.attribute[attr].bad) ? 'redfg' : 'bluefg'));
                        if (!isNaN(eddb.attribute[attr].scale))
                            value = parseFloat(value.toFixed(2 * eddb.attribute[attr].scale));
                        switch (attr) {
                            case 'damage':
                                v2 = getUISlotAttributeModifier(group, slot, attr);
                                v3 = getUISlotAttributeValue(group, slot, 'rounds');
                                value = parseFloat(getModuleAttributeValue(module, attr, (((v2 + 1) * v3) - 1)).toFixed(3));
                                desc = 'Raw damage (in units per ' + (isFinite(module.rof) ? 'shot' : 'second') + ') and type (kinetic/thermal/explosive)';
                                unit = module.dmgtype || '';
                                break;
                            case 'brcdmg':
                                v2 = getUISlotAttributeModifier(group, slot, attr);
                                v3 = getUISlotAttributeValue(group, slot, 'rounds');
                                value = parseFloat(getModuleAttributeValue(module, attr, (((v2 + 1) * v3) - 1)).toFixed(3));
                                v2 = getUISlotAttributeValue(group, slot, 'minbrc');
                                v3 = getUISlotAttributeValue(group, slot, 'maxbrc');
                                if (v2 <= 0 && v3 <= 0)
                                    continue;
                                desc = 'Breach damage (in units per ' + (isFinite(module.rof) ? 'shot' : 'second') + ') and chance (at maximum and minimum integrity)';
                                value = '' + value + ' (' + v2 + ((v2 == v3) ? '' : ('-' + v3)) + '%)';
                                unit = '';
                                break;
                            case 'rof':
                            case 'bstrof':
                                if (value === Infinity) {
                                    value = '&infin;';
                                    unit = '';
                                }
                                break;
                            case 'ammoclip':
                            case 'ammomax':
                                // some modules define clip and no max, others the reverse; whichever we see first, render them together and hide the other
                                hide.ammoclip = hide.ammomax = 1;
                                value = getUISlotAttributeValue(group, slot, 'ammoclip');
                                v2 = getUISlotAttributeValue(group, slot, 'ammomax');
                                tag = 'Ammo';
                                desc = 'Ammo clip size and reserve capacity';
                                value = '' + value.toFixed(0) + (v2 ? ('+' + v2.toFixed(0)) : '');
                                break;
                            case 'optmass':
                                tag = 'Mass';
                                if (module.minmass || module.maxmass) {
                                    v2 = parseFloat(getUISlotAttributeValue(group, slot, 'minmass').toFixed(1));
                                    v3 = parseFloat(getUISlotAttributeValue(group, slot, 'maxmass').toFixed(1));
                                    desc = 'Minimum/optimal/maximum ship mass (in tons)';
                                    value = '' + v2 + '/' + value + '/' + v3;
                                }
                                break;
                            case 'optmul':
                                tag = 'Mul';
                                if (module.minmul || module.maxmul) {
                                    if (module.optmulspd || module.optmulacc || module.optmulrot) {
                                        v2 = ((getUISlotAttributeValue(group, slot, 'minmulspd') + getUISlotAttributeValue(group, slot, 'minmulacc') + getUISlotAttributeValue(group, slot, 'minmulrot')) / 3.0);
                                        value = ((getUISlotAttributeValue(group, slot, 'optmulspd') + getUISlotAttributeValue(group, slot, 'optmulacc') + getUISlotAttributeValue(group, slot, 'optmulrot')) / 3.0);
                                        v3 = ((getUISlotAttributeValue(group, slot, 'maxmulspd') + getUISlotAttributeValue(group, slot, 'maxmulacc') + getUISlotAttributeValue(group, slot, 'maxmulrot')) / 3.0);
                                    }
                                    else {
                                        v2 = getUISlotAttributeValue(group, slot, 'minmul');
                                        v3 = getUISlotAttributeValue(group, slot, 'maxmul');
                                    }
                                    desc = 'Minimum/optimal/maximum strength multipliers';
                                    value = '' + v2.toFixed(0) + '/' + value.toFixed(0) + '/' + v3.toFixed(0);
                                }
                                break;
                            case 'wepcap':
                                tag = 'Wep';
                                desc = 'Weapon capacitor capacity (in megawatts) and recharge rate (in megawatts per second)';
                                value = '' + value + '<small>MW</small>+' + parseFloat(getUISlotAttributeValue(group, slot, 'wepchg').toFixed(2));
                                unit = '/s';
                                break;
                            case 'engcap':
                                tag = 'Eng';
                                desc = 'Engine capacitor capacity (in megawatts) and recharge rate (in megawatts per second)';
                                if (value < ship.boostcost + BOOST_MARGIN) {
                                    abbrclass = 'error';
                                    desc = '(CANNOT BOOST!) ' + desc;
                                }
                                value = '' + value + '<small>MW</small>+' + parseFloat(getUISlotAttributeValue(group, slot, 'engchg').toFixed(2));
                                unit = '/s';
                                break;
                            case 'syscap':
                                tag = 'Sys';
                                desc = 'System capacitor capacity (in megawatts) and recharge rate (in megawatts per second)';
                                value = '' + value + '<small>MW</small>+' + parseFloat(getUISlotAttributeValue(group, slot, 'syschg').toFixed(2));
                                unit = '/s';
                                break;
                            case 'mincargo':
                                tag = 'Cgo';
                                desc = 'Cargo yield range';
                                value = '' + value + '-' + getUISlotAttributeValue(group, slot, 'maxcargo').toFixed(0);
                                break;
                            case 'bgenrate':
                                tag = 'Bld';
                                desc = 'Time to rebuild to 50% strength when broken or onlined (in seconds)';
                                value = formatSeconds(cache.stats.shield / 2.0 / value);
                                unit = '';
                                break;
                            case 'kinres':
                            case 'thmres':
                            case 'expres':
                                if (module.mtype == 'cbh' || module.mtype == 'isg') {
                                    value = cache.stats[((module.mtype == 'cbh') ? 'armour' : 'shield') + attr];
                                    diff = value - getModuleAttributeValue(module, attr);
                                    diff = (diff > -0.0001 && diff < 0.0001) ? 0 : diff;
                                    spanclass = ((diff == 0) ? '' : (((diff < 0) == !eddb.attribute[attr].bad) ? 'redfg' : 'bluefg'));
                                    value = value.toFixed(1);
                                }
                                /*
                                 // just in case we have one and not the others
                                 hide.kinres = hide.thmres = hide.expres = 1;
                                 tag = 'Res';
                                 desc = 'Resistance to kinetic/thermal/explosive damage';
                                 attr = 'kinres';
                                 var res = getUISlotAttributeValue(group, slot, attr);
                                 modifiable = isModuleAttributeModifiable(module, attr);
                                 diff = (modified && modifiable) ? (res - getModuleAttributeValue(module, attr)) : 0;
                                 spanclass = ((diff == 0) ? '' : (((diff < 0) == !eddb.attribute[attr].bad) ? 'redfg' : 'bluefg'));
                                 value = '<span class="' + spanclass + '">' + parseFloat(res.toFixed(1)) + '</span><small>%(K)</small>';
                                 attr = 'thmres';
                                 var res = getUISlotAttributeValue(group, slot, attr);
                                 modifiable = isModuleAttributeModifiable(module, attr);
                                 diff = (modified && modifiable) ? (res - getModuleAttributeValue(module, attr)) : 0;
                                 spanclass = ((diff == 0) ? '' : (((diff < 0) == !eddb.attribute[attr].bad) ? 'redfg' : 'bluefg'));
                                 value += '/<span class="' + spanclass + '">' + parseFloat(res.toFixed(1)) + '</span><small>%(T)</small>';
                                 attr = 'expres';
                                 var res = getUISlotAttributeValue(group, slot, attr);
                                 modifiable = isModuleAttributeModifiable(module, attr);
                                 diff = (modified && modifiable) ? (res - getModuleAttributeValue(module, attr)) : 0;
                                 spanclass = ((diff == 0) ? '' : (((diff < 0) == !eddb.attribute[attr].bad) ? 'redfg' : 'bluefg'));
                                 value += '/<span class="' + spanclass + '">' + parseFloat(res.toFixed(1)) + '</span><small>%(E)</small>';
                                 unit = '';
                                 spanclass = '';
                                 */
                                break;
                            case 'activerng':
                                if (value === Infinity)
                                    value = '&infin;';
                                v2 = getUISlotAttributeValue(group, slot, 'passiverng');
                                if (v2) {
                                    tag = 'Rng';
                                    desc = 'Maximum active scan range and automatic passive scan range (in light-seconds)';
                                    value = '' + value + ' (' + parseFloat(v2.toFixed(2)) + ')';
                                }
                                break;
                            case 'scooprate':
                                var fuelcap = getUISlotAttributeValue('component', cache.component.abbrSlot.FT, 'fuelcap');
                                for (var i = 0; i < ship.slots.internal.length; i++)
                                    fuelcap += (getUISlotAttributeValue('internal', i, 'fuelcap') || 0);
                                generateUIAttributeHTML(attrHTML, 'Time', 'Time to refill all fuel tanks from empty at maximum scoop rate', formatSeconds(1.0 * fuelcap / value), '', abbrclass, spanclass);
                                break;
                        }
                        if (eddb.attribute[attr].time && !isNaN(value) && unit == 's') {
                            value = formatSeconds(value);
                            if (value === '')
                                continue;
                            unit = '';
                        }
                        generateUIAttributeHTML(attrHTML, tag, desc, value, unit, abbrclass, spanclass);
                    }
                }
            }
            spanmass.innerHTML = special.mass ? formatNumHTML(special.mass, 2) : '';
            diff = (modified && isModuleAttributeModifiable(module, 'mass')) ? (special.mass - getModuleAttributeValue(module, 'mass')) : 0;
            spanmass.className = ((diff == 0) ? '' : ((diff < 0) ? 'bluefg' : 'redfg'));
            if (special.pwrcap) {
                spanpower.innerHTML = '+' + formatNumHTML(special.pwrcap, 2);
                diff = (modified && isModuleAttributeModifiable(module, 'pwrcap')) ? (special.pwrcap - getModuleAttributeValue(module, 'pwrcap')) : 0;
                spanpower.className = ((diff == 0) ? '' : ((diff < 0) ? 'redfg' : 'bluefg'));
            }
            else if (special.pwrdraw) {
                /* FINALLY FIXED in 2.3!
                 if (module.mtype == 'iss') {
                 spanpower.innerHTML = '<abbr class="attention" title="The surface scanner seems to consume power in the outfitter, but actually does not while in-flight">-' + formatNumHTML(special.pwrdraw, 2) + '</abbr>';
                 } else {
                 */
                spanpower.innerHTML = '-' + formatNumHTML(special.pwrdraw, 2);
                // }
                diff = (modified && isModuleAttributeModifiable(module, 'pwrdraw')) ? (special.pwrdraw - getModuleAttributeValue(module, 'pwrdraw')) : 0;
                spanpower.className = ((diff == 0) ? '' : ((diff < 0) ? 'bluefg' : 'redfg'));
            }
            else {
                spanpower.innerHTML = '';
                spanpower.className = '';
            }
            inputpowered.style.visibility = special.pwrdraw ? 'visible' : 'hidden';
            inputpriority.style.visibility = special.pwrdraw ? 'visible' : 'hidden';
            spanattr.innerHTML = attrHTML.join('');
            var discount = document.getElementById('select_discount').value.split('_');
            var discountAll = (discount[0] == 'all') ? parseFloat(discount[1]) : 0;
            spancost.innerHTML = special.cost ? formatNumHTML(special.cost * (1 - discountAll), 0) : '';
            inputpriced.style.visibility = special.cost ? 'visible' : 'hidden';
        }
        else {
            spanmass.innerHTML = '';
            spanmass.className = '';
            spanpower.innerHTML = '';
            spanpower.className = '';
            inputpowered.style.visibility = 'hidden';
            inputpriority.style.visibility = 'hidden';
            spanattr.innerHTML = '';
            spancost.innerHTML = '';
            inputpriced.style.visibility = 'hidden';
        }
    }; // updateUISlotAttributes()


    var showUIPopup = function (element, trigger, sticky) {
        if (element) {
            if (cache.popup.element) {
                cache.popup.element.style.display = 'none';
            }
            else {
                document.addEventListener('mousedown', onDocumentMousedown, true);
                document.addEventListener('click', onDocumentClickFocus, true);
                document.addEventListener('focus', onDocumentClickFocus, true);
            }
            element.style.display = 'block';
            cache.popup.element = element;
            cache.popup.trigger = trigger || null;
            cache.popup.sticky = sticky || null;
        }
        else {
            hideUIPopup();
        }
    }; // showUIPopup()


    var showUITextareaPopup = function (text, width, height, trigger, onOkay, onCancel) {
        var textarea = document.getElementById('textarea_popup');
        var okay = document.getElementById('button_popup_okay');
        var cancel = document.getElementById('button_popup_cancel');
        if (!width || !height) {
            var lines = text.split('\n');
            for (width = 0, height = 0; height < lines.length; height++)
                width = max(width, lines[height].length);
            width = min(width + 5, 100);
            height = min(height + 2, 30);
        }
        showUIPopup(document.getElementById('div_popup'), trigger, onOkay ? textarea : null);
        okay.style.display = (onOkay ? '' : 'none');
        cancel.style.display = (onCancel ? '' : 'none');
        cache.popup.onOkay = onOkay;
        cache.popup.onCancel = onCancel;
        textarea.cols = width;
        textarea.rows = height;
        textarea.value = text;
        textarea.focus();
        textarea.select();
    }; // showUITextareaPopup()
    this.displayPopup = showUITextareaPopup; // for route.js


    var hideUIPopup = function () {
        if (cache.popup.element) {
            document.removeEventListener('mousedown', onDocumentMousedown, true);
            document.removeEventListener('click', onDocumentClickFocus, true);
            document.removeEventListener('focus', onDocumentClickFocus, true);
            cache.popup.element.style.display = 'none';
            cache.popup.element = null;
            cache.popup.trigger = null;
            cache.popup.sticky = false;
        }
    }; // hideUIPopup()


    var importLoadout = function (text) {
        // if it's valid (optionally URI-encoded) base64, assume it's also gzipped
        var gztext = null, enctext = null;
        try {
            enctext = text.replace(/[ \t\r\n]+/g, '');
            gztext = decodeURIComponent(enctext);
            gztext = atob((gztext + '===').slice(0, gztext.length + ((4 - (gztext.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/'));
        } catch (exc) {
            gztext = enctext = null;
        }
        if (gztext) {
            if (pako) {
                text = pako.inflate(gztext, {to: 'string'});
            }
            else if (Zlib) {
                tz0 = (new Date()).getTime();
                var gzarray = [];
                for (var i = 0; i < gztext.length; i++)
                    gzarray.push(gztext.charCodeAt(i));
                gztext = null;
                var gunzipper = new Zlib.Gunzip(gzarray);
                var dataarray = gunzipper.decompress();
                gzarray = gunzipper = null;
                var textarray = [];
                for (var i = 0; i < dataarray.length; i++)
                    textarray.push(String.fromCharCode(dataarray[i]));
                text = textarray.join('');
                dataarray = textarray = null;
                tz1 = (new Date()).getTime();
            }
            else {
                alert('Import failed: gzip library missing');
                return false;
            }
        }

        // if it looks like a URL, import it as such
        if (text.match(/^[ \t\r\n]*[a-z]*:\/\/[^#]*edshipyard[^#]*#/i)) {
            if (!handleHashChange(text.slice(text.indexOf('#')))) {
                alert('Import failed: Invalid loadout URL');
                return false;
            }
            setSelectedStoredFitting();
            return true;
        }

        // if it's valid JSON, import it in either Coriolis or API format
        var json = null;
        try {
            json = JSON.parse(text);
        } catch (exc) {
            json = null;
        }
        if (json && !enctext) {
            if (pako) {
                enctext = text.replace(/[ \t\r\n]+/g, '');
                enctext = pako.gzip(enctext, {to: 'string'});
                enctext = btoa(enctext);
            }
            else {
                enctext = text;
            }
        }
        if (enctext)
            enctext = enctext.replace(/.{80}/g, function (a) {
                return a + '\n';
            });
        if (((json && (json['$schema'] || (json[0] && json[0]['$schema']))) || '').indexOf('coriolis.io') >= 0) {
            return importLoadoutFromCoriolis(json);
        }
        else if (json && json.event == "Loadout" && json.Ship && json.Modules) { // journal Loadout event
            var jsonCAPI = {
                'ship': {
                    'id': json.ShipID,
                    'name': json.Ship,
                    'shipName': json.ShipName,
                    'shipID': json.ShipIdent,
                    'modules': {}
                }
            };
            for (var m = 0; m < json.Modules.length; m++) {
                jsonCAPI.ship.modules[json.Modules[m].Slot] = {
                    'module': {
                        'name': json.Modules[m].Item,
                        'value': json.Modules[m].Value,
                        'health': ((json.Modules[m].Health * 1000000 + 0.5) | 0),
                        'on': json.Modules[m].On,
                        'priority': json.Modules[m].Priority
                    }
                };
                if (json.Modules[m].Engineering) {
                    jsonCAPI.ship.modules[json.Modules[m].Slot].engineer = {
                        'engineerId': json.Modules[m].Engineering.EngineerID,
                        'recipeName': json.Modules[m].Engineering.BlueprintName,
                        'recipeLevel': json.Modules[m].Engineering.Level
                    };
                    jsonCAPI.ship.modules[json.Modules[m].Slot].WorkInProgress_modifications = {};
                    for (var md = 0; md < json.Modules[m].Engineering.Modifiers.length; md++) {
                        jsonCAPI.ship.modules[json.Modules[m].Slot].WorkInProgress_modifications[json.Modules[m].Engineering.Modifiers[md].Label] = {
                            'value': json.Modules[m].Engineering.Modifiers[md].Value
                        };
                    }
                }
            }
            return importLoadoutFromAPI(jsonCAPI, enctext);
        }
        else if (json && ((json.modules && json.name) || json.ship || json.ships)) { // CAPI /profile endpoint
            return importLoadoutFromAPI(json, enctext);
        }

        // otherwise, assume it's plain-text format
        var errors = [];
        var loadout = decodeLoadoutFromText(text, errors);
        if (loadout)
            isShipLoadoutValid(loadout, true, errors, null);
        if (!loadout || !loadout.ship) {
            alert('Import failed: No ship loadout found');
            return false;
        }

        setUILoadout(loadout);
        setSelectedStoredFitting();
        updateStatistics();
        updateJumpCalc();
        updateSpeedCalc();
        updateDamageCalc();

        if (errors.length > 0) {
            showUITextareaPopup(
                    'Loadout imported with errors:\n\n* ' + errors.join('\n* '),
                    0, 0, null, true, false
                    );
        }

        return true;
    }; // importLoadout()


    var handleHashChange = function (hash, loading) {
        var blocks = hash.split('/');
        if (blocks[0] != '#')
            return false;
        for (var b = 1; b < blocks.length; b++) {
            switch (blocks[b].slice(0, 2)) {
                case 'L=':
                    // TODO: support multiple loadouts in the hash?
                    var loadouthash = blocks[b].slice(2);
                    if (importLoadoutFromHash(loadouthash)) {
                        if (loading)
                            setSelectedStoredFitting(loadouthash);
                    }
                    break;
                case 'I=':
                    return importLoadout(blocks[b].slice(2));
            }
        }
        window.location.replace(hash);
        return true;
    }; // handleHashChange()


    var encodeLoadoutToHash = function (loadout) {
        var version = HASH_VERSION; // TODO: update any time existing ships or modules change in a way that would break old hashes

        // ship hull and cargo hatch
        var bits = (loadout.hatch.powered ? 0 : 0x8) | ((loadout.hatch.priority - 1) & 0x7);
        var hash = hashEncode(version, 1) + hashEncode(loadout.ship, 2) + hashEncode(bits, 1);

        // hardpoints
        hash += ',';
        var gap = 0;
        for (var slot = 0; slot < loadout.hardpoint.length; slot++) {
            if (loadout.hardpoint[slot] && loadout.hardpoint[slot].module) {
                hash += (gap ? hashEncode(199900 + gap, 3) : '') + encodeLoadoutModuleToHash(loadout.hardpoint[slot]);
                gap = 0;
            }
            else {
                gap++;
            }
        }

        // utilities
        hash += ',';
        var gap = 0;
        for (var slot = 0; slot < loadout.utility.length; slot++) {
            if (loadout.utility[slot] && loadout.utility[slot].module) {
                hash += (gap ? hashEncode(199900 + gap, 3) : '') + encodeLoadoutModuleToHash(loadout.utility[slot]);
                gap = 0;
            }
            else {
                gap++;
            }
        }

        // components
        hash += ',';
        for (var slot = 0; slot < loadout.component.length; slot++) {
            hash += encodeLoadoutModuleToHash(loadout.component[slot]);
        }

        // military
        hash += ',';
        var gap = 0;
        for (slot = 0; slot < loadout.military.length; slot++) {
            if (loadout.military[slot] && loadout.military[slot].module) {
                hash += (gap ? hashEncode(199900 + gap, 3) : '') + encodeLoadoutModuleToHash(loadout.military[slot]);
                gap = 0;
            }
            else {
                gap++;
            }
        }

        // internals
        hash += ',';
        var gap = 0;
        for (slot = 0; slot < loadout.internal.length; slot++) {
            if (loadout.internal[slot] && loadout.internal[slot].module) {
                hash += (gap ? hashEncode(199900 + gap, 3) : '') + encodeLoadoutModuleToHash(loadout.internal[slot]);
                gap = 0;
            }
            else {
                gap++;
            }
        }

        return hash;
    }; // encodeLoadoutToHash()


    var encodeLoadoutModuleToHash = function (loadoutModule) {
        var hash = '';
        if (loadoutModule) {
            var module = eddb.module[loadoutModule.module];
            var num = 0;
            if (loadoutModule.modified) {
                for (var a = 0; a < eddb.mtype[module.mtype].modifiable.length; a++) {
                    var attr = eddb.mtype[module.mtype].modifiable[a];
                    var modifier = loadoutModule.modifier[attr] || 0;
                    if (eddb.attribute[attr] && modifier != 0) {
                        num++;
                        hash += hashEncode(((a & 0xF) << 20) | (float20Encode(modifier) & 0xFFFFF), 4);
                    }
                }
            }
            var bits = (num ? 0x10 : 0) | (loadoutModule.powered ? 0 : 0x8) | ((loadoutModule.priority - 1) & 0x7);
            hash = hashEncode(loadoutModule.module, 3) + hashEncode(bits, 1) + (num ? (hashEncode(loadoutModule.blueprint, 1) + hashEncode(num, 1) + hash) : '');
        }
        return hash;
    }; // encodeLoadoutModuleToHash()


    var importLoadoutFromHash = function (hash) {
        var errors = [];
        var loadout = decodeLoadoutFromHash(hash);
        if (loadout)
            isShipLoadoutValid(loadout, true, errors, null);
        if (!loadout || !loadout.ship) {
            alert('Invalid loadout hash');
            return false;
        }
        setUILoadout(loadout);
        updateStatistics();
        updateJumpCalc();
        updateSpeedCalc();
        updateDamageCalc();

        if (errors.length > 0) {
            showUITextareaPopup(
                    'Hash loaded with errors:\n\n* ' + errors.join('\n* '),
                    0, 0, null, true, false
                    );
        }

        return true;
    }; // importLoadoutFromHash()


    var getHashVersionMaps = function (version) {
        var map = {
            ship: {},
            module: {},
            hardpoint: {},
            utility: {},
            component: [{}, {}, {}, {}, {}, {}, {}, {}],
            military: {},
            internal: {},
        };

        switch (version) {
            case 0:
            case 1:
                // accidentally used octal notation for some module IDs;
                // only some of them were valid octal numbers, however
                map.utility = {
                    //	00090:  90,
                    01060: 1060,
                    //	02090:2090,
                    //	03090:3090,
                };
                map.internal = {
                    // Auto Field-Maintenance Units
                    01150: 1150, 01140: 1140, 01130: 1130, 01120: 1120, 01110: 1110,
                    01250: 1250, 01240: 1240, 01230: 1230, 01220: 1220, 01210: 1210,
                    01350: 1350, 01340: 1340, 01330: 1330, 01320: 1320, 01310: 1310,
                    01450: 1450, 01440: 1440, 01430: 1430, 01420: 1420, 01410: 1410,
                    01550: 1550, 01540: 1540, 01530: 1530, 01520: 1520, 01510: 1510,
                    01650: 1650, 01640: 1640, 01630: 1630, 01620: 1620, 01610: 1610,
                    01750: 1750, 01740: 1740, 01730: 1730, 01720: 1720, 01710: 1710,
                    //	01850:1850, 01840:1840, 01830:1830, 01820:1820, 01810:1810,
                    // Cargo Racks
                    00150: 150, 00250: 250, 00350: 350, 00450: 450, 00550: 550, 00650: 650, 00750: 750, // 00850:850,
                    // Docking Computers
                    03150: 3150,
                    // Refineries
                    02150: 2150, 02140: 2140, 02130: 2130, 02120: 2120, 02110: 2110,
                    02250: 2250, 02240: 2240, 02230: 2230, 02220: 2220, 02210: 2210,
                    02350: 2350, 02340: 2340, 02330: 2330, 02320: 2320, 02310: 2310,
                    02450: 2450, 02440: 2440, 02430: 2430, 02420: 2420, 02410: 2410,
                };
            case 2:
            case 3:
            case 4:
            case 5:
                // the Fer-de-Lance was recategorized from multipurpose to combat
                map.ship[7] = 24;
            case 6:
                // 1F/G Pulse Laser is actually 1G/G
                map.hardpoint = {
                    22161: 62171
                };
            case 7:
                // Bulkheads are now rating A-C instead of I
                map.component[cache.component.abbrSlot.BH] = {
                    191: 40131,
                    192: 40122,
                    193: 40113,
                    194: 40114,
                    195: 40115,
                };
            case 8:
                // in v9 we're unifying the mID space, requiring lots of changes to avoid conflicts

                // miscelanneous hardpoints -> 8xxxx
                map.hardpoint = {
                    22161: 62171, // 1F/G Pulse Laser from v6, just in case
                    60190: 80190, 61190: 80191, 60290: 80290, // Mine Launchers
                    70140: 81140, 70240: 81240, 70144: 81144, // Mining Lasers
                    50120: 82120, 50123: 82123, 50220: 82220, 50223: 82223, 50224: 82224, 50225: 82225, // Missile Launchers
                    24230: 83230, 41320: 83320, 41410: 83410, 41324: 83324, // Plasma Accelerators
                    40140: 84140, 40220: 84220, 40224: 84224, // Rail Guns
                    51193: 85193, 51293: 85293, // Torpedo Pylons
                };

                // thermal and kinetic weapons -> 6xxxx - 7xxxx
                var mapBatch = [
                    20150, 20151, 20162, 20240, 20241, 20252, 20330, 20331, 20332, 20410, 20411, 20154, // Beam Lasers
                    21160, 21171, 21172, 21250, 21261, 21262, 21340, 21351, 21352, 21450, 21451, 21164, // Burst Lasers
                    22160, 22171, 22172, 22250, 22261, 22262, 22350, 22361, 22362, 22410, 22411, 22254, // Pulse Lasers
                    30140, 30151, 30162, 30240, 30241, 30252, 30330, 30331, 30342, 30420, 30421, // Cannons
                    31150, 31151, 31152, 31210, 31241, 31242, 31330, 31331, 31332, 31334, // Fragment Cannons
                    32160, 32171, 32172, 32250, 32261, 32262, 32330, 32331, 32410, 32411, 30144  // Multi-cannons
                ];
                for (var i = 0; i < mapBatch.length; i++) {
                    map.hardpoint[mapBatch[i]] = mapBatch[i] + 40000;
                }
                map.hardpoint[30144] = 72144; // Enforcer Cannon is not actually a Cannon but a Multi-cannon

                // Chaff, ECM, Heat Sink, Point Defence, Shield Boosters -> 50xxx - 54xxx
                var mapBatch = [90, 1060, 2090, 3090, 4050, 4040, 4030, 4020, 4010];
                for (var i = 0; i < mapBatch.length; i++) {
                    map.utility[mapBatch[i]] = mapBatch[i] + 50000;
                }

                // Manifest, Wake, Kill Warrant Scanners -> 55xxx - 57xxx
                var mapBatch = [
                    14050, 14040, 14030, 14020, 14010,
                    15050, 15040, 15030, 15020, 15010,
                    16050, 16040, 16030, 16020, 16010
                ];
                for (var i = 0; i < mapBatch.length; i++) {
                    map.utility[mapBatch[i]] = mapBatch[i] + 41000;
                }

                // all core components -> 40xxx - 47xxx
                var mapBatch = [
                    131, 122, 113, 114, 115, // Bulkheads
                    211, 311, // special Thrusters
                    150, 140, 130, 120, 110,
                    250, 240, 230, 220, 210,
                    350, 340, 330, 320, 310,
                    450, 440, 430, 420, 410,
                    550, 540, 530, 520, 510,
                    650, 640, 630, 620, 610,
                    750, 740, 730, 720, 710,
                    850, 840, 830, 820, 810
                ];
                for (var slot = 0; slot < eddb.group.component.length; slot++) {
                    for (var i = 0; i < mapBatch.length; i++) {
                        map.component[slot][mapBatch[i]] = 40000 + (1000 * slot) + mapBatch[i];
                    }
                }

                // Frame Shift Drive Interdictors, Hatch Breaker Limpet Controllers -> 25xxx - 26xxx
                var mapBatch = [
                    40150, 40140, 40130, 40120, 40110,
                    40250, 40240, 40230, 40220, 40210,
                    40350, 40340, 40330, 40320, 40310,
                    40450, 40440, 40430, 40420, 40410,
                    41150, 41140, 41130, 41120, 41110,
                    41350, 41340, 41330, 41320, 41310,
                    41550, 41540, 41530, 41520, 41510,
                    41750, 41740, 41730, 41720, 41710
                ];
                for (var i = 0; i < mapBatch.length; i++) {
                    map.internal[mapBatch[i]] = mapBatch[i] - 15000;
                }

                // optional Fuel Tanks -> 47xxx
                var mapBatch = [21130, 21230, 21330, 21430, 21530, 21630, 21730, 21830];
                for (var i = 0; i < mapBatch.length; i++) {
                    map.internal[mapBatch[i]] = mapBatch[i] + 26000;
                }
        }

        return map;
    }; // getHashVersionMaps()


    var decodeLoadoutFromHash = function (hash) {
        var version = hashDecode(hash.slice(0, 1));
        chunks = hash.slice(1).split(',');
        var map = getHashVersionMaps(version);

        // ship hull and cargo hatch
        var sID = hashDecode(chunks[0].slice(0, 2));
        sID = map.ship[sID] || sID;
        var ship = eddb.ship[sID];
        if (!ship)
            return null;
        var bits = ((version < 8) ? 0 : hashDecode(chunks[0].slice(2, 3)));
        var loadout = createLoadoutStruct(sID);
        loadout.hatch.powered = !(bits & 0x8);
        loadout.hatch.priority = (bits & 0x7) + 1;

        // modules
        decodeLoadoutGroupFromHash(loadout, 'hardpoint', chunks[1], version, map);
        if (version < 9) {
            if (chunks.length < 4)
                return null;
            decodeLoadoutGroupFromHash(loadout, 'component', chunks[2], version, map);
            decodeLoadoutGroupFromHash(loadout, 'internal', chunks[3], version, map);
        }
        else if (version < 10) {
            if (chunks.length < 5)
                return null;
            decodeLoadoutGroupFromHash(loadout, 'utility', chunks[2], version, map);
            decodeLoadoutGroupFromHash(loadout, 'component', chunks[3], version, map);
            decodeLoadoutGroupFromHash(loadout, 'internal', chunks[4], version, map);
        }
        else {
            if (chunks.length < 6)
                return null;
            decodeLoadoutGroupFromHash(loadout, 'utility', chunks[2], version, map);
            decodeLoadoutGroupFromHash(loadout, 'component', chunks[3], version, map);
            decodeLoadoutGroupFromHash(loadout, 'military', chunks[4], version, map);
            decodeLoadoutGroupFromHash(loadout, 'internal', chunks[5], version, map);
        }

        // modify the loadout for backwards compatibility
        // TODO add cases whenever HASH_VERSION changes due to slot layout
        switch (version) {
            case 0:
            case 1:
                if (sID == 31) {
                    // Hauler's hardpoints updated from UUS -> SUU
                    loadout.hardpoint.unshift(loadout.hardpoint.pop());
                }
                else if (sID == 41) {
                    // Adder's hardpoints updated from UUSSM -> MSSUU
                    var moduleObj = loadout.hardpoint.pop();
                    loadout.hardpoint.unshift(loadout.hardpoint.pop());
                    loadout.hardpoint.unshift(loadout.hardpoint.pop());
                    loadout.hardpoint.unshift(moduleObj);
                }
                else if (sID == 32) {
                    // Type-6's hardpoints updated from UUUSS -> SSUUU
                    loadout.hardpoint.unshift(loadout.hardpoint.pop());
                    loadout.hardpoint.unshift(loadout.hardpoint.pop());
                }
            case 2:
                if (sID == 33) {
                    // Type-7's hardpoints updated from UUUUSSSS -> SSSSUUUU
                    loadout.hardpoint.unshift(loadout.hardpoint.pop());
                    loadout.hardpoint.unshift(loadout.hardpoint.pop());
                    loadout.hardpoint.unshift(loadout.hardpoint.pop());
                    loadout.hardpoint.unshift(loadout.hardpoint.pop());
                }
            case 4:
                if (version == 4 && sID == 51) {
                    // somebody claimed the Orca had two fewer internals, but they were wrong;
                    // should have made sure to verify before making that change in v3. lesson learned.
                    loadout.internal.unshift(createLoadoutModuleStruct(0));
                    loadout.internal.unshift(createLoadoutModuleStruct(0));
                }
            case 7:
                if (sID == 4) {
                    // Federal Dropship's hardpoints updated from UUUUMMLMM -> LMMMMUUUU
                    loadout.hardpoint.push(loadout.hardpoint.shift());
                    loadout.hardpoint.push(loadout.hardpoint.shift());
                    loadout.hardpoint.push(loadout.hardpoint.shift());
                    loadout.hardpoint.push(loadout.hardpoint.shift());
                    var moduleObj = loadout.hardpoint[2];
                    loadout.hardpoint[2] = loadout.hardpoint[1];
                    loadout.hardpoint[1] = loadout.hardpoint[0];
                    loadout.hardpoint[0] = moduleObj;
                }
            case 8:
                loadout.utility = [];
                if (sID == 42) {
                    // Asp Explorer had its four utilities listed before hardpoints, all others had them after
                    for (var n = 0; n < 4 && loadout.hardpoint.length > 0; n++)
                        loadout.utility.push(loadout.hardpoint.shift());
                }
                else {
                    while (loadout.hardpoint.length > ship.slots.hardpoint.length)
                        loadout.utility.push(loadout.hardpoint.pop());
                    loadout.utility.reverse();
                }
                while (loadout.hardpoint.length < ship.slots.hardpoint.length)
                    loadout.hardpoint.push(createLoadoutModuleStruct(0));
                while (loadout.utility.length < ship.slots.utility.length)
                    loadout.utility.push(createLoadoutModuleStruct(0));
            case 10:
                if (sID == 34) {
                    // Type-9 gained a size 8 internal slot
                    loadout.internal.unshift(createLoadoutModuleStruct(0));
                    loadout.internal.pop();
                }
        }

        return loadout;
    }; // decodeLoadoutFromHash()


    var decodeLoadoutGroupFromHash = function (loadout, group, hashchunk, version, map) {
        for (var slot = 0, i = 0, j = 0; i < hashchunk.length; i = j) {
            var mID = hashDecode(hashchunk.slice(j, (j += ((version < 9 && group == 'component') ? 2 : 3))));
            if (mID >= 199900) {
                var num = mID - 199900;
                while (num-- > 0) {
                    loadout[group][slot] = createLoadoutModuleStruct(0);
                    slot++;
                }
            }
            else if (group == 'component' && slot >= eddb.group.component.length) {
                break;
            }
            else {
                var bits = ((version < 8) ? 0 : hashDecode(hashchunk.slice(j, (j += 1))));
                if (bits & 0x10) {
                    if (version >= 9)
                        j += 1; // blueprint
                    var num = hashDecode(hashchunk.slice(j, (j += 1)));
                    j += 4 * num; // modifiers
                }
                loadout[group][slot] = decodeLoadoutSlotFromHash(group, slot, hashchunk.slice(i, j), version, map);
                slot++;
            }
        }
    }; // decodeLoadoutGroupFromHash()


    var decodeLoadoutSlotFromHash = function (group, slot, hashchunk, version, map) {
        var j = 0;
        var mID = hashDecode(hashchunk.slice(j, (j += ((version < 9 && group == 'component') ? 2 : 3))));
        if (group == 'hardpoint') {
            mID = map.hardpoint[mID] || map.utility[mID] || mID;
        }
        else if (group == 'component') {
            mID = map.component[slot][mID] || mID;
        }
        else {
            mID = map[group][mID] || mID;
        }
        mID = (map.module[mID] || mID) & 0x3FFFF;
        var bits = ((version < 8) ? 0 : hashDecode(hashchunk.slice(j, (j += 1))));
        var moduleObj = createLoadoutModuleStruct(mID);
        moduleObj.powered = !(bits & 0x8);
        moduleObj.priority = (bits & 0x7) + 1;
        if (bits & 0x10) {
            moduleObj.modified = true;
            moduleObj.blueprint = ((version < 9) ? 0 : hashDecode(hashchunk.slice(j, (j += 1))));
            var module = eddb.module[mID];
            var num = hashDecode(hashchunk.slice(j, (j += 1)));
            while (num--) {
                var mod = hashDecode(hashchunk.slice(j, (j += 4)));
                if (module && eddb.mtype[module.mtype].modifiable) {
                    var attr = eddb.mtype[module.mtype].modifiable[(mod & 0xF00000) >> 20];
                    if (eddb.attribute[attr]) {
                        var modifier = float20Decode(mod & 0x0FFFFF);
                        // some modifiers can be translated on-the-fly from previous hash versions
                        switch (version) {
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                                // these attributes are now modmods so that they can apply even when the base value is 0;
                                // unfortunately translating them from their previous modifier format requires the base
                                // attribute values, so we'll duplicate those for possible affected modules to guard against
                                // them possibly changing in the future and breaking the conversion
                                if (attr == 'hullbst') {
                                    var v0 = {C: 80, B: 152, A: 250}[module.rating] || getModuleAttributeValue(module, attr);
                                    var v1 = v0 * (1 + modifier);
                                    modifier = (1 + (v1 / eddb.attribute[attr].modmod)) / (1 + (v0 / eddb.attribute[attr].modmod)) - 1;
                                }
                                else if (attr == 'shieldbst') {
                                    var v0 = {E: 4, D: 8, C: 12, B: 16, A: 20}[module.rating] || getModuleAttributeValue(module, attr);
                                    var v1 = v0 * (1 + modifier);
                                    modifier = (1 + (v1 / eddb.attribute[attr].modmod)) / (1 + (v0 / eddb.attribute[attr].modmod)) - 1;
                                }
                                else if (attr == 'kinres' || attr == 'thmres' || attr == 'expres') {
                                    if (module.mtype == 'cbh') {
                                        var v0 = ({1: {k: -20, t: 0, e: -40}, 2: {k: -20, t: 0, e: -40}, 3: {k: -20, t: 0, e: -40}, 4: {k: -75, t: 50, e: -50}, 5: {k: 25, t: -40, e: 20}}[mID % 10] || {})[attr[0]] || getModuleAttributeValue(module, attr);
                                    }
                                    else if (module.mtype == 'ihrp') {
                                        var v0 = [0, 0.5, 1, 1.5, 2, 2.5][module.class] || getModuleAttributeValue(module, attr);
                                    }
                                    else if (module.mtype == 'isg') {
                                        var v0 = {k: 40, t: -20, e: 50}[attr[0]] || getModuleAttributeValue(module, attr);
                                    }
                                    else {
                                        var v0 = 0;
                                    }
                                    var v1 = v0 + modifier;
                                    modifier = (1 + (v1 / eddb.attribute[attr].modmod)) / (1 + (v0 / eddb.attribute[attr].modmod)) - 1;
                                }
                        }
                        moduleObj.modifier[attr] = modifier;
                    }
                }
            }
            // other modifiers have to be translated after the fact, because they may depend on other modifiers
            switch (version) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    if (moduleObj.modifier.bstsize) {
                        // bstsize changed from modadd to modset, but was only available on Frag Cannons
                        // which all had bstsize=1, so we can just add 1 to the old modifier
                        moduleObj.modifier.bstsize += 1;
                    }
                    if (moduleObj.modifier.bstint) {
                        // all rof modifiers were changed in-place to bstint, so we have to recalibrate the modifier
                        var rof = getModuleAttributeValue(module, 'rof', moduleObj.modifier.bstint);
                        var bstint = getModuleAttributeValue(module, 'bstint');
                        var bstrof = getModuleAttributeValue(module, 'bstrof', moduleObj.modifier.bstrof);
                        var bstsize = getModuleAttributeValue(module, 'bstsize', moduleObj.modifier.bstsize);
                        if (bstsize > 1) {
                            if (bstrof > 0) {
                                moduleObj.modifier.bstint = (bstsize / rof - (bstsize - 1) / bstrof) / bstint - 1;
                            }
                            else {
                                moduleObj.modifier.bstint = 0;
                                moduleObj.modifier.bstrof = (bstsize - 1) / (bstsize / rof - bstint);
                            }
                        }
                        else {
                            moduleObj.modifier.bstint = 1 / (1 + moduleObj.modifier.bstint) - 1;
                        }
                    }
            }
        }
        return moduleObj;
    }; // decodeLoadoutSlotFromHash()


    var encodeLoadoutToText = function (loadout, detailed) {
        var ship = eddb.ship[loadout.ship];
        if (!ship)
            return null;

        // ship hull and cargo hatch
        var text = '[' + ship.name + (loadout.label ? (', ' + loadout.label.replace(/\[/g, '(').replace(/\]/g, ')')) : '') + '] [' + (loadout.hatch.powered ? '+' : '-') + loadout.hatch.priority + ']\n';

        // hardpoints
        var textgroup = '';
        for (var slot = 0; slot < ship.slots.hardpoint.length; slot++)
            textgroup += encodeLoadoutSlotToText(loadout, ship, 'hardpoint', slot);
        if (textgroup)
            text += textgroup + '\n';

        // utilities
        var textgroup = '';
        for (var slot = 0; slot < ship.slots.utility.length; slot++)
            textgroup += encodeLoadoutSlotToText(loadout, ship, 'utility', slot);
        if (textgroup)
            text += textgroup + '\n';

        // components
        var textgroup = '';
        for (var slot = 0; slot < ship.slots.component.length; slot++)
            textgroup += encodeLoadoutSlotToText(loadout, ship, 'component', slot);
        if (textgroup)
            text += textgroup + '\n';

        // military
        var textgroup = '';
        for (var slot = 0; slot < ship.slots.military.length; slot++)
            textgroup += encodeLoadoutSlotToText(loadout, ship, 'military', slot);
        if (textgroup)
            text += textgroup + '\n';

        // internals
        var textgroup = '';
        for (var slot = 0; slot < ship.slots.internal.length; slot++)
            textgroup += encodeLoadoutSlotToText(loadout, ship, 'internal', slot);
        if (textgroup)
            text += textgroup;

        // details?
        if (detailed) {
            text += ('---\n');
            text += ('Shield: ' + (cache.stats.shield ? formatNum1(cache.stats.shield) : 'none') + '\n');
            text += ('Power : ' + formatNum2(cache.stats.passivedraw) + ' MW retracted'
                    + ' (' + formatPct0(cache.stats.passivedraw / cache.stats.power) + ')'
                    + '\n'
                    );
            text += ('        ' + formatNum2(cache.stats.passivedraw + cache.stats.activedraw) + ' MW deployed'
                    + ' (' + formatPct0((cache.stats.passivedraw + cache.stats.activedraw) / cache.stats.power) + ')'
                    + '\n'
                    );
            text += ('        ' + formatNum2(cache.stats.power) + ' MW available\n');
            text += ('Cargo : ' + formatNum0(cache.stats.cargo) + '\n');
            text += ('Fuel  : ' + formatNum0(cache.stats.fuel) + ' T\n');
            text += ('Mass  : ' + formatNum2(cache.stats.mass) + ' T empty\n');
            text += ('        ' + formatNum2(cache.stats.mass + cache.stats.fuel + cache.stats.cargo) + ' T full\n');
            text += ('Range : ' + formatNum2(cache.stats.rangeUnladen) + ' LY unladen\n');
            text += ('        ' + formatNum2(cache.stats.rangeLaden) + ' LY laden\n');
            text += ('Price : ' + formatNum0(cache.stats.realcost) + ' CR\n');
            text += ('Re-Buy: ' + formatNum0(cache.stats.realcost * 0.05) + ' CR @ 95% insurance\n');
        }

        return text;
    }; // encodeLoadoutToText()


    var encodeLoadoutSlotToText = function (loadout, ship, group, slot) {
        var text = '';
        var mID = loadout[group][slot].module;
        var module = ship.module[mID] || eddb.module[mID];
        if (module) {
            if (group == 'hardpoint') {
                text += 'USMLH'[ship.slots.hardpoint[slot]];
            }
            else if (group == 'utility') {
                text += 'U';
            }
            else if (group == 'component') {
                text += cache.component.slotAbbr[slot];
            }
            else if (group == 'military') {
                text += 'MC';
            }
            else if (group == 'internal') {
                text += ship.slots.internal[slot];
            }
            else {
                return '';
            }
            text += ': ' + getModuleLabel(module);
            if (module.pwrdraw)
                text += ' [' + (loadout[group][slot].powered ? '+' : '-') + loadout[group][slot].priority + ']';
            text += '\n';
            if (loadout[group][slot].modified && eddb.mtype[module.mtype].modifiable) {
                if (eddb.mtype[module.mtype].blueprint && eddb.mtype[module.mtype].blueprint[loadout[group][slot].blueprint])
                    text += ((group == 'component') ? '**: ' : '*: ') + eddb.mtype[module.mtype].blueprint[loadout[group][slot].blueprint].name + ' ' + eddb.mtype[module.mtype].blueprint[loadout[group][slot].blueprint].grade + '\n';
                var textLine = '';
                for (var a = 0; a < eddb.mtype[module.mtype].modifiable.length; a++) {
                    var attr = eddb.mtype[module.mtype].modifiable[a];
                    if (eddb.attribute[attr]) {
                        var mod = (loadout[group][slot].modifier[attr] || 0);
                        if (mod != 0) {
                            var textMod = '; ' + eddb.attribute[attr].name + ' ' + encodeModuleAttributeModifierToText(module, attr, mod);
                            if (textLine && (textLine.length + textMod.length > 65)) {
                                text += ((group == 'component') ? '**:' : '*:') + textLine.slice(1) + '\n';
                                textLine = '';
                            }
                            textLine += textMod;
                        }
                    }
                }
                if (textLine)
                    text += ((group == 'component') ? '**:' : '*:') + textLine.slice(1) + '\n';
            }
        }
        return text;
    }; // encodeLoadoutSlotToText()


    var decodeLoadoutFromText = function (text, errors) {
        // initialize maps for backwards compatibility
        // TODO: add special cases for any modules whose class, rating, mount, missiletype or name changes, and any attribute whose name changes
        var map = {
            ship: {
                'ASP': 'ASP EXPLORER',
                'COBRA MK III': 'COBRA MKIII',
                'COBRA MK IV': 'COBRA MKIV',
                'VIPER': 'VIPER MKIII',
                'VIPER MK IV': 'VIPER MKIV',
            },
            hardpoint: {
                '1D/F MINING LANCE': '1D/F MINING LANCE BEAM LASER',
                '1B/FS MISSILE RACK': '1B/FS SEEKER MISSILE RACK',
                '2B/FS MISSILE RACK': '2B/FS SEEKER MISSILE RACK',
                '1F/G PULSE LASER': '1G/G PULSE LASER',
                '2E/F PULSE DISRUPTOR': '2E/F PULSE DISRUPTOR LASER',
            },
            utility: {
                '0A CARGO SCANNER': '0A MANIFEST SCANNER',
                '0B CARGO SCANNER': '0B MANIFEST SCANNER',
                '0C CARGO SCANNER': '0C MANIFEST SCANNER',
                '0D CARGO SCANNER': '0D MANIFEST SCANNER',
                '0E CARGO SCANNER': '0E MANIFEST SCANNER',
                '0I POINT DEFENCE': '0I/T POINT DEFENCE',
            },
            component: {
                0: {
                    '1I LIGHTWEIGHT ALLOY': '1C LIGHTWEIGHT ALLOY',
                    '1I REINFORCED ALLOY': '1B REINFORCED ALLOY',
                    '1I MILITARY GRADE COMPOSITE': '1A MILITARY GRADE COMPOSITE',
                    '1I MIRRORED SURFACE COMPOSITE': '1A MIRRORED SURFACE COMPOSITE',
                    '1I REACTIVE GRADE COMPOSITE': '1A REACTIVE GRADE COMPOSITE',
                },
                7: {
                    '1C FUEL TANK (CAPACITY: 2)': '1C FUEL TANK (CAP: 2)',
                    '2C FUEL TANK (CAPACITY: 4)': '2C FUEL TANK (CAP: 4)',
                    '3C FUEL TANK (CAPACITY: 8)': '3C FUEL TANK (CAP: 8)',
                    '4C FUEL TANK (CAPACITY: 16)': '4C FUEL TANK (CAP: 16)',
                    '5C FUEL TANK (CAPACITY: 32)': '5C FUEL TANK (CAP: 32)',
                    '6C FUEL TANK (CAPACITY: 64)': '6C FUEL TANK (CAP: 64)',
                    '7C FUEL TANK (CAPACITY: 128)': '7C FUEL TANK (CAP: 128)',
                    '8C FUEL TANK (CAPACITY: 256)': '8C FUEL TANK (CAP: 256)',
                },
            },
            military: {
            },
            internal: {
                '1E CARGO RACK (CAPACITY: 2)': '1E CARGO RACK (CAP: 2)',
                '1E CORROSION RESISTANT CARGO RACK (CAPACITY: 1)': '1E CORROSION RESISTANT CARGO RACK (CAP: 1)',
                '1F CORROSION RESISTANT CARGO RACK (CAPACITY: 2)': '1F CORROSION RESISTANT CARGO RACK (CAP: 2)',
                '2E CARGO RACK (CAPACITY: 4)': '2E CARGO RACK (CAP: 4)',
                '3E CARGO RACK (CAPACITY: 8)': '3E CARGO RACK (CAP: 8)',
                '4E CARGO RACK (CAPACITY: 16)': '4E CARGO RACK (CAP: 16)',
                '5E CARGO RACK (CAPACITY: 32)': '5E CARGO RACK (CAP: 32)',
                '6E CARGO RACK (CAPACITY: 64)': '6E CARGO RACK (CAP: 64)',
                '7E CARGO RACK (CAPACITY: 128)': '7E CARGO RACK (CAP: 128)',
                '8E CARGO RACK (CAPACITY: 256)': '8E CARGO RACK (CAP: 256)',
                '1C FUEL TANK (CAPACITY: 2)': '1C FUEL TANK (CAP: 2)',
                '2C FUEL TANK (CAPACITY: 4)': '2C FUEL TANK (CAP: 4)',
                '3C FUEL TANK (CAPACITY: 8)': '3C FUEL TANK (CAP: 8)',
                '4C FUEL TANK (CAPACITY: 16)': '4C FUEL TANK (CAP: 16)',
                '5C FUEL TANK (CAPACITY: 32)': '5C FUEL TANK (CAP: 32)',
                '6C FUEL TANK (CAPACITY: 64)': '6C FUEL TANK (CAP: 64)',
                '7C FUEL TANK (CAPACITY: 128)': '7C FUEL TANK (CAP: 128)',
                '8C FUEL TANK (CAPACITY: 256)': '8C FUEL TANK (CAP: 256)',
                '1E FUEL TRANSFERER LIMPET CONTROLLER': '1E FUEL TRANSFER LIMPET CONTROLLER',
                '1D FUEL TRANSFERER LIMPET CONTROLLER': '1D FUEL TRANSFER LIMPET CONTROLLER',
                '1C FUEL TRANSFERER LIMPET CONTROLLER': '1C FUEL TRANSFER LIMPET CONTROLLER',
                '1B FUEL TRANSFERER LIMPET CONTROLLER': '1B FUEL TRANSFER LIMPET CONTROLLER',
                '1A FUEL TRANSFERER LIMPET CONTROLLER': '1A FUEL TRANSFER LIMPET CONTROLLER',
                '3E FUEL TRANSFERER LIMPET CONTROLLER': '3E FUEL TRANSFER LIMPET CONTROLLER',
                '3D FUEL TRANSFERER LIMPET CONTROLLER': '3D FUEL TRANSFER LIMPET CONTROLLER',
                '3C FUEL TRANSFERER LIMPET CONTROLLER': '3C FUEL TRANSFER LIMPET CONTROLLER',
                '3B FUEL TRANSFERER LIMPET CONTROLLER': '3B FUEL TRANSFER LIMPET CONTROLLER',
                '3A FUEL TRANSFERER LIMPET CONTROLLER': '3A FUEL TRANSFER LIMPET CONTROLLER',
                '5E FUEL TRANSFERER LIMPET CONTROLLER': '5E FUEL TRANSFER LIMPET CONTROLLER',
                '5D FUEL TRANSFERER LIMPET CONTROLLER': '5D FUEL TRANSFER LIMPET CONTROLLER',
                '5C FUEL TRANSFERER LIMPET CONTROLLER': '5C FUEL TRANSFER LIMPET CONTROLLER',
                '5B FUEL TRANSFERER LIMPET CONTROLLER': '5B FUEL TRANSFER LIMPET CONTROLLER',
                '5A FUEL TRANSFERER LIMPET CONTROLLER': '5A FUEL TRANSFER LIMPET CONTROLLER',
                '7E FUEL TRANSFERER LIMPET CONTROLLER': '7E FUEL TRANSFER LIMPET CONTROLLER',
                '7D FUEL TRANSFERER LIMPET CONTROLLER': '7D FUEL TRANSFER LIMPET CONTROLLER',
                '7C FUEL TRANSFERER LIMPET CONTROLLER': '7C FUEL TRANSFER LIMPET CONTROLLER',
                '7B FUEL TRANSFERER LIMPET CONTROLLER': '7B FUEL TRANSFER LIMPET CONTROLLER',
                '7A FUEL TRANSFERER LIMPET CONTROLLER': '7A FUEL TRANSFER LIMPET CONTROLLER',
            },
        };

        var lines = text.split('\n');
        var loadout = null;
        var ship, group, slot, module;
        for (var l = 0; l < lines.length; l++) {
            var line = lines[l].trim();
            if (line.length == 0) {
                // ignore
            }
            else if (!loadout && line[0] == '[') {
                var tokens = line.match(/^\[([^,\]]+),?([^\]]*)\] *\[?([^\]]*)/);
                if (tokens && tokens.length >= 4) {
                    var name = tokens[1].trim().toUpperCase();
                    var pwr = tokens[3].trim() || '-5';
                    var sID = getShipIDByName(map.ship[name] || name);
                    ship = eddb.ship[sID];
                    if (ship) {
                        loadout = createLoadoutStruct(sID);
                        loadout.label = tokens[2].trim();
                        loadout.hatch.powered = (pwr[0] != '-');
                        loadout.hatch.priority = parseInt(pwr.slice(1));
                    }
                    else {
                        if (errors)
                            errors.push('Unknown ship "' + name + '"');
                        loadout = null;
                    }
                }
                else {
                    if (errors)
                        errors.push('Malformed loadout header line "' + line + '"');
                }
            }
            else if (loadout && line.slice(0, 3) == '---') {
                break;
            }
            else if (loadout && line[0] != '*') {
                var tokens = line.match(/^([^ :]+) *: *([^\[]*)\[?([^\]]*)/);
                if (tokens && tokens.length >= 4) {
                    var size = tokens[1].trim().toUpperCase();
                    var name = tokens[2].trim().toUpperCase();
                    var pwr = tokens[3].trim() || '+1';
                    if (size.length == 1 && 'USMLH'.indexOf(size) >= 1) {
                        group = 'hardpoint';
                        var mID = getModuleIDByName(group, 0, map[group][name] || name);
                        module = ship.module[mID] || eddb.module[mID];
                        if (module) {
                            size = 'USMLH'.indexOf(size);
                            for (var s = 0; s < loadout[group].length && !(ship.slots[group][s] == size && loadout[group][s].module == 0); s++)
                                ;
                            if (s < loadout[group].length) {
                                slot = s;
                                loadout[group][slot].module = mID;
                                loadout[group][slot].powered = (pwr[0] != '-');
                                loadout[group][slot].priority = parseInt(pwr.slice(1));
                            }
                            else {
                                if (errors)
                                    errors.push('Too many class ' + size + ' hardpoints');
                                group = slot = module = null;
                            }
                        }
                        else {
                            if (errors)
                                errors.push(size + ' Hardpoint: Unknown module "' + name + '"');
                            group = slot = module = null;
                        }
                    }
                    else if (size == 'U') {
                        group = 'utility';
                        var mID = getModuleIDByName(group, 0, map[group][name] || name);
                        module = ship.module[mID] || eddb.module[mID];
                        if (module) {
                            size = 0;
                            for (var s = 0; s < loadout[group].length && !(ship.slots[group][s] == size && loadout[group][s].module == 0); s++)
                                ;
                            if (s < loadout[group].length) {
                                slot = s;
                                loadout[group][slot].module = mID;
                                loadout[group][slot].powered = (pwr[0] != '-');
                                loadout[group][slot].priority = parseInt(pwr.slice(1));
                            }
                            else {
                                if (errors)
                                    errors.push('Too many utility mounts');
                                group = slot = module = null;
                            }
                        }
                        else {
                            if (errors)
                                errors.push('Utility Mount: Unknown module "' + name + '"');
                            group = slot = module = null;
                        }
                    }
                    else if (cache.component.abbrSlot[size] !== undefined) {
                        group = 'component';
                        slot = cache.component.abbrSlot[size];
                        var mID = getModuleIDByName(group, slot, (map[group][slot] && map[group][slot][name]) || name);
                        module = ship.module[mID] || eddb.module[mID];
                        if (module) {
                            loadout[group][slot].module = mID;
                            loadout[group][slot].powered = (pwr[0] != '-');
                            loadout[group][slot].priority = parseInt(pwr.slice(1));
                        }
                        else {
                            if (errors)
                                errors.push(cache.component.slotLabel[slot] + ': Unknown module "' + name + '"');
                            group = slot = module = null;
                        }
                    }
                    else if (size == 'MC') {
                        group = 'military';
                        var mID = getModuleIDByName(group, 0, map[group][name] || name);
                        module = ship.module[mID] || eddb.module[mID];
                        if (module) {
                            size = module.class;
                            for (var s = 0; s < loadout[group].length && !(ship.slots[group][s] >= size && loadout[group][s].module == 0); s++)
                                ;
                            if (s < loadout[group].length) {
                                slot = s;
                                loadout[group][slot].module = mID;
                                loadout[group][slot].powered = (pwr[0] != '-');
                                loadout[group][slot].priority = parseInt(pwr.slice(1));
                            }
                            else {
                                if (errors)
                                    errors.push('Too many class ' + size + ' military modules');
                                group = slot = module = null;
                            }
                        }
                        else {
                            if (errors)
                                errors.push('C' + size + ' Military: Unknown module "' + name + '"');
                            group = slot = module = null;
                        }
                    }
                    else if (/^[1-8]$/.test(size)) {
                        group = 'internal';
                        var mID = getModuleIDByName(group, 0, map[group][name] || name);
                        module = ship.module[mID] || eddb.module[mID];
                        if (module) {
                            size = parseInt(size);
                            for (var s = 0; s < loadout[group].length && !(ship.slots[group][s] == size && loadout[group][s].module == 0); s++)
                                ;
                            if (s < loadout[group].length) {
                                slot = s;
                                loadout[group][slot].module = mID;
                                loadout[group][slot].powered = (pwr[0] != '-');
                                loadout[group][slot].priority = parseInt(pwr.slice(1));
                            }
                            else {
                                if (errors)
                                    errors.push('Too many class ' + size + ' internals');
                                group = slot = module = null;
                            }
                        }
                        else {
                            if (errors)
                                errors.push('C' + size + ' Internal: Unknown module "' + name + '"');
                            group = slot = module = null;
                        }
                    }
                    else {
                        if (errors)
                            errors.push('Invalid module line "' + line + '"');
                        group = slot = module = null;
                    }
                }
                else {
                    if (errors)
                        errors.push('Malformed module line "' + line + '"');
                }
            }
            else if (loadout && line[0] == '*') {
                if (module) {
                    if (eddb.mtype[module.mtype].modifiable) {
                        var tokens = line.slice(3).split(';');
                        for (var t = 0; t < tokens.length; t++) {
                            var i, name = null, mod = 0, val = 0;
                            if ((i = tokens[t].indexOf('=')) >= 0) {
                                name = tokens[t].slice(0, i).trim().toUpperCase();
                                mod = '';
                                val = tokens[t].slice(i + 1).trim();
                            }
                            else if ((i = max(tokens[t].indexOf('+'), tokens[t].indexOf('-'))) >= 0) {
                                name = tokens[t].slice(0, i).trim().toUpperCase();
                                mod = tokens[t].slice(i).trim();
                                val = '';
                            }
                            else if (eddb.mtype[module.mtype].blueprint) {
                                name = tokens[t].trim().toUpperCase();
                                loadout[group][slot].blueprint = 0;
                                for (var b in eddb.mtype[module.mtype].blueprint) {
                                    if (eddb.mtype[module.mtype].blueprint.hasOwnProperty(b) && (eddb.mtype[module.mtype].blueprint[b].name.toUpperCase() + ' ' + eddb.mtype[module.mtype].blueprint[b].grade) == name) {
                                        loadout[group][slot].blueprint = b;
                                        break;
                                    }
                                }
                                if (!loadout[group][slot].blueprint) {
                                    if (errors)
                                        errors.push('Invalid blueprint "' + tokens[t] + '"');
                                }
                                continue;
                            }
                            if (name && (mod || val)) {
                                for (var a = 0; a < eddb.mtype[module.mtype].modifiable.length; a++) {
                                    var attr = eddb.mtype[module.mtype].modifiable[a];
                                    if (eddb.attribute[attr] && eddb.attribute[attr].name.toUpperCase() == name) {
                                        loadout[group][slot].modified = true;
                                        if (val) {
                                            loadout[group][slot].modifier[attr] = getModuleAttributeModifier(module, attr, parseFloat(val));
                                        }
                                        else {
                                            loadout[group][slot].modifier[attr] = decodeModuleAttributeModifierFromText(module, attr, mod);
                                        }
                                        break;
                                    }
                                }
                                if (a >= eddb.mtype[module.mtype].modifiable.length) {
                                    if (errors)
                                        errors.push('Invalid modification "' + tokens[t] + '"');
                                }
                            }
                            else {
                                if (errors)
                                    errors.push('Malformed modification "' + tokens[t] + '"');
                            }
                        }
                    }
                    else {
                        if (errors)
                            errors.push('Ignored modifications to unmodifiable module: "' + line + '"');
                    }
                }
                else {
                    if (errors)
                        errors.push('Ignored modifications to invalid module: "' + line + '"');
                }
            }
            else {
                // no loadout begun yet, and this isn't one either
            }
        }

        return loadout;
    }; // decodeLoadoutFromText()


    var importLoadoutFromAPI = function (exportObj, importdata) {
        // take inventory of all the ship loadouts we have, plus the commander name if it's provided
        var cmdrs = (exportObj && exportObj.commander && exportObj.commander.name);
        cmdrs = (cmdrs ? (cmdrs + "'s") : 'My');
        var activeID = -1;
        var shipIDs = [];
        var shipObj = {};
        if (exportObj.modules && exportObj.name) {
            activeID = exportObj.id || 0;
            shipIDs.push(activeID);
            shipObj[activeID] = exportObj;
        }
        else {
            if (exportObj.ship && exportObj.ship.modules && exportObj.ship.name) {
                activeID = exportObj.ship.id || 0;
                shipIDs.push(activeID);
                shipObj[activeID] = exportObj.ship;
            }
            if (exportObj.ships) {
                for (var id in exportObj.ships) {
                    if (exportObj.ships.hasOwnProperty(id) && !shipObj[id] && exportObj.ships[id].modules && exportObj.ships[id].name) {
                        activeID = activeID || id;
                        shipIDs.push(id);
                        shipObj[id] = exportObj.ships[id];
                    }
                }
            }
        }

        var save = false;
        if (shipIDs.length > 1) {
            if (cache.feature.storage) {
                save = confirm(
                        'This Companion API export contains multiple ship loadouts;\n' +
                        'only your currently active ship will be loaded for viewing.\n' +
                        '\n' +
                        'Click OK if you would also like to import all of these ships into\n' +
                        'your saved loadouts. They will be named like "{CMDR}\'s {Ship} #{ID}",\n' +
                        'overwriting any existing saved loadouts with the same name.\n' +
                        '\n' +
                        'Click Cancel to just load the active ship without modifying\n' +
                        'any of your saved loadouts.'
                        );
            }
            else {
                /*
                 alert(
                 'This Companion API export contains multiple ship loadouts;\n' +
                 'only your currently active ship will be loaded for viewing.\n' +
                 '\n' +
                 'Because your browser does not support Local Storage, the other\n' +
                 'ships cannot be imported and will be ignored.'
                 );
                 */
            }
        }

        var shipLoadout = {};
        var shipNamehash = {};
        var errors = [];
        var unsupported = {};
        for (var i = 0; i < shipIDs.length; i++) {
            if (save || (shipIDs[i] == activeID)) {
                var prefix = ((shipIDs.length > 1) ? ('Loadout #' + shipIDs[i] + ' ') : '');
                var loadout = decodeLoadoutFromAPIExport(shipObj[shipIDs[i]], errors, unsupported, prefix);
                if (loadout)
                    isShipLoadoutValid(loadout, true, errors, prefix);
                if (loadout && loadout.ship) {
                    shipLoadout[shipIDs[i]] = loadout;
                    if (save) {
                        shipNamehash[shipIDs[i]] = hashEncodeS(cmdrs + ' ' + eddb.ship[loadout.ship].name + ' #' + shipIDs[i]);
                        cache.stored.fitting[shipNamehash[shipIDs[i]]] = encodeLoadoutToHash(loadout);
                    }
                }
            }
        }

        if (!shipLoadout[activeID]) {
            alert('Import failed: No ships found');
            return false;
        }

        setUILoadout(shipLoadout[activeID]);
        if (save) {
            writeStoredFittings();
            updateStoredFittings(shipNamehash[activeID]);
        }
        else {
            setSelectedStoredFitting();
        }
        updateStatistics();
        updateJumpCalc();
        updateSpeedCalc();
        updateDamageCalc();

        var text = '';
        for (var tag in unsupported) {
            if (unsupported.hasOwnProperty(tag)) {
                text += '* ' + tag + ':';
                for (var mod in unsupported[tag]) {
                    if (unsupported[tag].hasOwnProperty(mod))
                        text += ' ' + mod;
                }
                text += '\n';
            }
        }
        if (text) {
            text = (
                    'Some of your engineer modifications are not yet supported:\n\n'
                    + text + '\n'
                    + 'YOU CAN HELP! Please use the links in the top-right corner to\n'
                    + 'send me this complete message (including the data below!)\n'
                    + 'along with screenshots of the "MODIFICATIONS" view for each\n'
                    + 'affected module in the in-game outfitter. Your contributions are\n'
                    + 'the only way for me to add support for more modifications. Thanks!\n'
                    + '\n'
                    + '----- BEGIN IMPORT DATA -----\n'
                    + importdata
                    + '\n----- END IMPORT DATA -----\n'
                    );
        }
        if (errors.length > 0) {
            text = 'API ship(s) imported with errors:\n\n* ' + errors.join('\n* ') + (text ? ('\n\n' + text) : '');
        }
        if (text) {
            showUITextareaPopup(text, 0, 0, null, true, false);
        }

        return true;
    }; // importLoadoutFromAPI()


    var decodeLoadoutFromAPIExport = function (shipObj, errors, unsupported, prefix) {
        prefix = prefix || '';

        var ship;
        for (var sID in eddb.ship) {
            if (eddb.ship.hasOwnProperty(sID) && eddb.ship[sID].fdname.toUpperCase() == shipObj.name.toUpperCase()) {
                ship = eddb.ship[sID];
                break;
            }
        }
        if (!ship || ship.id != sID) {
            if (errors)
                errors.push(prefix + 'Unknown ship "' + shipObj.name + '"');
            return null;
        }
        else if (!shipObj.modules) {
            if (errors)
                errors.push(prefix + 'Missing modules data');
            return null;
        }

        var loadout = createLoadoutStruct(sID);
        if (shipObj.modules.CargoHatch && shipObj.modules.CargoHatch.module && (shipObj.modules.CargoHatch.module.name || '').toUpperCase() == 'MODULARCARGOBAYDOOR') {
            loadout.hatch.powered = !!shipObj.modules.CargoHatch.module.on;
            loadout.hatch.priority = parseInt(shipObj.modules.CargoHatch.module.priority) + 1;
        }
        else {
            loadout.hatch.powered = false;
            loadout.hatch.priority = 5;
        }

        // build fdid/fdname maps
        var mapFDID = {};
        var mapFDname = {};
        for (var mID in eddb.module) {
            if (eddb.module.hasOwnProperty(mID)) {
                if (eddb.module[mID].fdid)
                    mapFDID[eddb.module[mID].fdid] = mID;
                if (eddb.module[mID].fdname)
                    mapFDname[eddb.module[mID].fdname.toUpperCase()] = mID;
            }
        }
        for (var mID in ship.module) {
            if (ship.module.hasOwnProperty(mID)) {
                if (ship.module[mID].fdid)
                    mapFDID[ship.module[mID].fdid] = mID;
                if (ship.module[mID].fdname)
                    mapFDname[ship.module[mID].fdname.toUpperCase()] = mID;
            }
        }

        // process hardpoints
        var mapHardpointSize = [null, 'SmallHardpoint', 'MediumHardpoint', 'LargeHardpoint', 'HugeHardpoint'];
        var lastSlot = {};
        for (var slot = 0; slot < ship.slots.hardpoint.length; slot++) {
            var size = ship.slots.hardpoint[slot];
            var num = ((lastSlot[size] || 0) + 1);
            lastSlot[size] = num;
            var slotObj = shipObj.modules[mapHardpointSize[size] + num];
            var mID = (slotObj && slotObj.module && (mapFDID[slotObj.module.id] || mapFDname[(slotObj.module.name || '').toUpperCase()])) || 0;
            loadout.hardpoint[slot].module = mID;
            if (mID) {
                loadout.hardpoint[slot].powered = !!slotObj.module.on;
                loadout.hardpoint[slot].priority = parseInt(slotObj.module.priority) + 1;
                var modifier = decodeLoadoutModuleModifiersFromAPIExport(ship.module[mID] || eddb.module[mID], slotObj, errors, unsupported, (prefix + 'Hardpoint #' + (slot + 1)));
                loadout.hardpoint[slot].modified = !!modifier;
                loadout.hardpoint[slot].blueprint = modifier ? decodeLoadoutModuleBlueprintFromAPIExport(ship.module[mID] || eddb.module[mID], slotObj, errors, unsupported, (prefix + 'Hardpoint #' + (slot + 1))) : 0;
                loadout.hardpoint[slot].modifier = modifier || {};
            }
            else if (errors) {
                if (!slotObj) {
                    // normally omitted for empty slots in 2.4 beta
                    //errors.push(prefix + 'Hardpoint #'+(slot+1)+': Missing slot data');
                }
                else if (slotObj.module && slotObj.module.id) {
                    errors.push(prefix + 'Hardpoint #' + (slot + 1) + ': Unknown module #' + slotObj.module.id + ' "' + slotObj.module.name + '"');
                }
            }
        }

        // process utility mounts
        var lastSlot = {};
        for (var slot = 0; slot < ship.slots.utility.length; slot++) {
            var size = 0;
            var num = ((lastSlot[size] || 0) + 1);
            lastSlot[size] = num;
            var slotObj = shipObj.modules['TinyHardpoint' + num];
            var mID = (slotObj && slotObj.module && (mapFDID[slotObj.module.id] || mapFDname[(slotObj.module.name || '').toUpperCase()])) || 0;
            loadout.utility[slot].module = mID;
            if (mID) {
                loadout.utility[slot].powered = !!slotObj.module.on;
                loadout.utility[slot].priority = parseInt(slotObj.module.priority) + 1;
                var modifier = decodeLoadoutModuleModifiersFromAPIExport(ship.module[mID] || eddb.module[mID], slotObj, errors, unsupported, (prefix + 'Utility #' + (slot + 1)));
                loadout.utility[slot].modified = !!modifier;
                loadout.utility[slot].blueprint = modifier ? decodeLoadoutModuleBlueprintFromAPIExport(ship.module[mID] || eddb.module[mID], slotObj, errors, unsupported, (prefix + 'Utility #' + (slot + 1))) : 0;
                loadout.utility[slot].modifier = modifier || {};
            }
            else if (errors) {
                if (!slotObj) {
                    // normally omitted for empty slots in 2.4 beta
                    //errors.push(prefix + 'Utility #'+(slot+1)+': Missing slot data');
                }
                else if (slotObj.module && slotObj.module.id) {
                    errors.push(prefix + 'Utility #' + (slot + 1) + ': Unknown module #' + slotObj.module.id + ' "' + slotObj.module.name + '"');
                }
            }
        }

        // process core components
        var mapSlot = ['Armour', 'PowerPlant', 'MainEngines', 'FrameShiftDrive', 'LifeSupport', 'PowerDistributor', 'Radar', 'FuelTank'];
        for (var slot = 0; slot < ship.slots.component.length; slot++) {
            var slotObj = shipObj.modules[mapSlot[slot]];
            var mID = (slotObj && slotObj.module && (mapFDID[slotObj.module.id] || mapFDname[(slotObj.module.name || '').toUpperCase()])) || 0;
            loadout.component[slot].module = mID;
            if (mID) {
                loadout.component[slot].powered = !!slotObj.module.on;
                loadout.component[slot].priority = parseInt(slotObj.module.priority) + 1;
                var modifier = decodeLoadoutModuleModifiersFromAPIExport(ship.module[mID] || eddb.module[mID], slotObj, errors, unsupported, prefix);
                loadout.component[slot].modified = !!modifier;
                loadout.component[slot].blueprint = modifier ? decodeLoadoutModuleBlueprintFromAPIExport(ship.module[mID] || eddb.module[mID], slotObj, errors, unsupported, prefix) : 0;
                loadout.component[slot].modifier = modifier || {};
            }
            else if (errors) {
                if (!slotObj) {
                    // normally omitted for empty slots in 2.4 beta
                    //errors.push(prefix + mapSlot[slot] + ': Missing slot data');
                }
                else if (!slotObj.module || (!slotObj.module.id && !slotObj.module.name)) {
                    errors.push(prefix + mapSlot[slot] + ': Missing module data');
                }
                else {
                    errors.push(prefix + mapSlot[slot] + ': Unknown module #' + slotObj.module.id + ' "' + slotObj.module.name + '"');
                }
            }
        }

        // process military compartments
        for (var slot = 0; slot < ship.slots.military.length; slot++) {
            var size = ship.slots.military[slot];
            var slotObj = shipObj.modules['Military' + ((slot < 9) ? '0' : '') + (slot + 1)];
            var mID = (slotObj && slotObj.module && (mapFDID[slotObj.module.id] || mapFDname[(slotObj.module.name || '').toUpperCase()])) || 0;
            loadout.military[slot].module = mID;
            if (mID) {
                loadout.military[slot].powered = !!slotObj.module.on;
                loadout.military[slot].priority = parseInt(slotObj.module.priority) + 1;
                var modifier = decodeLoadoutModuleModifiersFromAPIExport(ship.module[mID] || eddb.module[mID], slotObj, errors, unsupported, (prefix + 'Military #' + (slot + 1)));
                loadout.military[slot].modified = !!modifier;
                loadout.military[slot].blueprint = modifier ? decodeLoadoutModuleBlueprintFromAPIExport(ship.module[mID] || eddb.module[mID], slotObj, errors, unsupported, (prefix + 'Military #' + (slot + 1))) : 0;
                loadout.military[slot].modifier = modifier || {};
            }
            else if (errors) {
                if (!slotObj) {
                    // normally omitted for empty slots in 2.4 beta
                    //errors.push(prefix + 'Military #'+(slot+1)+': Missing slot data');
                }
                else if (slotObj.module && slotObj.module.id) {
                    errors.push(prefix + 'Military #' + (slot + 1) + ': Unknown module #' + slotObj.module.id + ' "' + slotObj.module.name + '"');
                }
            }
        }

        // process internals
        // the API's internal slot numbers sometimes have gaps in them,
        // and ships are sometimes patched to have more and/or larger slots,
        // so we'll have to match them in a best-fit kind of way
        var importSlots = [];
        for (var key in shipObj.modules) {
            var tokens = key.match(/^slot([0-9]+)_size([0-9]+)$/i);
            if (shipObj.modules.hasOwnProperty(key) && tokens && shipObj.modules[key].module)
                importSlots.push({key: key, slot: parseInt(tokens[1]), size: parseInt(tokens[2])});
        }
        importSlots.sort(function (i1, i2) {
            return ((i1.size == i2.size) ? (i1.slot - i2.slot) : (i2.size - i1.size));
        });
        var loadoutSlots = [];
        for (var slot = 0; slot < ship.slots.internal.length; slot++)
            loadoutSlots.push(slot);
        loadoutSlots.sort(function (s1, s2) {
            return ((ship.slots.internal[s1] == ship.slots.internal[s2]) ? (s1 - s2) : (ship.slots.internal[s2] - ship.slots.internal[s1]));
        });
        for (var l = importSlots.length - 1; l >= 0; l--) {
            var size = importSlots[l].size;
            var slotObj = shipObj.modules[importSlots[l].key];
            for (var s = loadoutSlots.length - 1; s >= 0; s--) {
                var slot = loadoutSlots[s];
                if (ship.slots.internal[slot] >= size && !loadout.internal[slot].module)
                    break;
            }
            if (s >= 0 && s < loadoutSlots.length) {
                var mID = (slotObj.module && (mapFDID[slotObj.module.id] || mapFDname[(slotObj.module.name || '').toUpperCase()])) || 0;
                if (mID) {
                    loadout.internal[slot].module = mID;
                    loadout.internal[slot].powered = !!slotObj.module.on;
                    loadout.internal[slot].priority = parseInt(slotObj.module.priority) + 1;
                    var modifier = decodeLoadoutModuleModifiersFromAPIExport(ship.module[mID] || eddb.module[mID], slotObj, errors, unsupported, (prefix + 'Internal #' + (slot + 1)));
                    loadout.internal[slot].modified = !!modifier;
                    loadout.internal[slot].blueprint = modifier ? decodeLoadoutModuleBlueprintFromAPIExport(ship.module[mID] || eddb.module[mID], slotObj, errors, unsupported, (prefix + 'Internal #' + (slot + 1))) : 0;
                    loadout.internal[slot].modifier = modifier || {};
                }
                else if (slotObj.module && slotObj.module.id) {
                    if (errors)
                        errors.push(prefix + 'Internal #' + (slot + 1) + ': Unknown module #' + slotObj.module.id + ' "' + slotObj.module.name + '"');
                }
            }
            else if (errors) {
                errors.push(prefix + 'Too many class ' + size + ' internals');
            }
        }

        return loadout;
    }; // decodeLoadoutFromAPIExport()


    var decodeLoadoutModuleBlueprintFromAPIExport = function (module, slotObj, errors, unsupported, prefix) {
        if (!slotObj || !slotObj.module)
            return 0;

        var recipeName = (slotObj.engineer ? slotObj.engineer.recipeName : slotObj.module.recipeName); // after 2.4 beta or before 2.3
        var recipeLevel = (slotObj.engineer ? slotObj.engineer.recipeLevel : slotObj.module.recipeLevel); // after 2.4 beta or before 2.3

        var recipeNameUpdate = {
            'CHAFFLAUNCHER_CHAFFCAPACITY': 'Misc_ChaffCapacity',
            'CHAFFLAUNCHER_LIGHTWEIGHT': 'Misc_LightWeight',
            'CHAFFLAUNCHER_REINFORCED': 'Misc_Reinforced',
            'CHAFFLAUNCHER_SHIELDED': 'Misc_Shielded',
            'ECM_LIGHTWEIGHT': 'Misc_LightWeight',
            'ECM_REINFORCED': 'Misc_Reinforced',
            'ECM_SHIELDED': 'Misc_Shielded',
            'HEATSINKLAUNCHER_HEATSINKCAPACITY': 'Misc_HeatSinkCapacity',
            'HEATSINKLAUNCHER_LIGHTWEIGHT': 'Misc_LightWeight',
            'HEATSINKLAUNCHER_REINFORCED': 'Misc_Reinforced',
            'HEATSINKLAUNCHER_SHIELDED': 'Misc_Shielded',
            'SENSOR_KILLWARRANTSCANNER_FASTSCAN': 'Sensor_FastScan',
            'SENSOR_KILLWARRANTSCANNER_WIDEANGLE': 'Sensor_WideAngle',
            'KILLWARRANTSCANNER_LONGRANGE': 'Sensor_LongRange',
            'KILLWARRANTSCANNER_LIGHTWEIGHT': 'Misc_LightWeight',
            'KILLWARRANTSCANNER_REINFORCED': 'Misc_Reinforced',
            'KILLWARRANTSCANNER_SHIELDED': 'Misc_Shielded',
            'SENSOR_CARGOSCANNER_FASTSCAN': 'Sensor_FastScan',
            'SENSOR_CARGOSCANNER_LONGRANGE': 'Sensor_LongRange',
            'SENSOR_CARGOSCANNER_WIDEANGLE': 'Sensor_WideAngle',
            'CARGOSCANNER_LIGHTWEIGHT': 'Misc_LightWeight',
            'CARGOSCANNER_REINFORCED': 'Misc_Reinforced',
            'CARGOSCANNER_SHIELDED': 'Misc_Shielded',
            'POINTDEFENCE_POINTDEFENSECAPACITY': 'Misc_PointDefenseCapacity',
            'POINTDEFENCE_LIGHTWEIGHT': 'Misc_LightWeight',
            'POINTDEFENCE_REINFORCED': 'Misc_Reinforced',
            'POINTDEFENCE_SHIELDED': 'Misc_Shielded',
            'SENSOR_WAKESCANNER_FASTSCAN': 'Sensor_FastScan',
            'SENSOR_WAKESCANNER_LONGRANGE': 'Sensor_LongRange',
            'SENSOR_WAKESCANNER_WIDEANGLE': 'Sensor_WideAngle',
            'WAKESCANNER_LIGHTWEIGHT': 'Misc_LightWeight',
            'WAKESCANNER_REINFORCED': 'Misc_Reinforced',
            'WAKESCANNER_SHIELDED': 'Misc_Shielded',

            'LIFESUPPORT_LIGHTWEIGHT': 'Misc_LightWeight',
            'LIFESUPPORT_REINFORCED': 'Misc_Reinforced',
            'LIFESUPPORT_SHIELDED': 'Misc_Shielded',
            'SENSOR_SENSOR_LIGHTWEIGHT': 'Sensor_LightWeight',
            'SENSOR_SENSOR_LONGRANGE': 'Sensor_LongRange',
            'SENSOR_SENSOR_WIDEANGLE': 'Sensor_WideAngle',

            'AFM_SHIELDED': 'Misc_Shielded',
            'COLLECTIONLIMPET_LIGHTWEIGHT': 'Misc_LightWeight',
            'COLLECTIONLIMPET_REINFORCED': 'Misc_Reinforced',
            'COLLECTIONLIMPET_SHIELDED': 'Misc_Shielded',
            'FUELSCOOP_SHIELDED': 'Misc_Shielded',
            'FUELTRANSFERLIMPET_LIGHTWEIGHT': 'Misc_LightWeight',
            'FUELTRANSFERLIMPET_REINFORCED': 'Misc_Reinforced',
            'FUELTRANSFERLIMPET_SHIELDED': 'Misc_Shielded',
            'HATCHBREAKERLIMPET_LIGHTWEIGHT': 'Misc_LightWeight',
            'HATCHBREAKERLIMPET_REINFORCED': 'Misc_Reinforced',
            'HATCHBREAKERLIMPET_SHIELDED': 'Misc_Shielded',
            'PROSPECTINGLIMPET_LIGHTWEIGHT': 'Misc_LightWeight',
            'PROSPECTINGLIMPET_REINFORCED': 'Misc_Reinforced',
            'PROSPECTINGLIMPET_SHIELDED': 'Misc_Shielded',
            'REFINERIES_SHIELDED': 'Misc_Shielded',
            'SENSOR_SURFACESCANNER_FASTSCAN': 'Sensor_FastScan',
            'SENSOR_SURFACESCANNER_LONGRANGE': 'Sensor_LongRange',
            'SENSOR_SURFACESCANNER_WIDEANGLE': 'Sensor_WideAngle',
        };
        recipeName = recipeNameUpdate[recipeName.toUpperCase()] || recipeName;
        if (recipeName.toUpperCase() == 'MISC_CHAFFCAPACITY' || recipeName.toUpperCase() == 'MISC_HEATSINKCAPACITY' || recipeName.toUpperCase() == 'MISC_POINTDEFENSECAPACITY')
            recipeLevel = 1;

        if (recipeName && recipeLevel) {
            if (eddb.mtype[module.mtype].blueprint) {
                for (var bID in eddb.mtype[module.mtype].blueprint) {
                    var bp = eddb.mtype[module.mtype].blueprint[bID];
                    if (eddb.mtype[module.mtype].blueprint.hasOwnProperty(bID) && bp.grade == recipeLevel && bp.fdname.toUpperCase() == recipeName.toUpperCase()) {
                        return bID;
                    }
                }
            }
            if (errors)
                errors.push(prefix + ': Unknown blueprint "' + recipeName + ' ' + recipeLevel + '"');
        }
        return 0;
    }; // decodeLoadoutModuleBlueprintFromAPIExport()


    var decodeLoadoutModuleModifiersFromAPIExport = function (module, slotObj, errors, unsupported, prefix) {
        if (!slotObj || !slotObj.module)
            return null;

        prefix = prefix || '';
        var modifier = {};

        var modArray = (slotObj.module.modifiers ? slotObj.module.modifiers.modifiers : null); // before 2.3
        var modObj = slotObj.modifications || slotObj.WorkInProgress_modifications; // after 2.4 beta

        if (modObj) {
            var mapModifier = eddb.fdfieldattr;
            for (var field in modObj) {
                var attr = mapModifier[field];
                var value = modObj[field].value;
                if (attr) { // 2.4+ CAPI
                    if (attr == 'rof') { // CAPI returns rof as a crazy inverted bstint
                        attr = 'bstint';
                        value = 1 / (value - 1) + 1;
                    }
                    if (!isModuleAttributeModifiable(module, attr)) {
                        // ignore; CAPI now normally returns modifiers to base=0 attributes (i.e. Lightweight Bulkhead mass, DSS integrity/powerdraw)
                    }
                    else if (eddb.attribute[attr].modmod) {
                        // CAPI encodes modifiers-to-modifiers inconsistently;
                        // some (Shield Boost on anything, Resistance on Shield Generators) are given as modifiers to the module's base value,
                        // while others are given as final effective values (but stated backwards in the case of Resistance on Shield Boosters, Bulkheads and HRPs)
                        // TODO: remove this if/when these are fixed
                        if (attr == 'shieldbst') {
                            modifier[attr] = value - 1;
                            //	} else if ((attr == 'kinres' || attr == 'thmres' || attr == 'expres') && module.mtype == 'isg') { // bug fixed in 2.4b4
                            //		modifier[attr] = value - 1;
                        }
                        else {
                            modifier[attr] = getModuleAttributeModifier(module, attr, eddb.attribute[attr].modmod * (value - 1));
                        }
                    }
                    else if (eddb.attribute[attr].modset) {
                        modifier[attr] = value;
                    }
                    else {
                        modifier[attr] = value - 1;
                    }
                }
                else if (attr === null) {
                    // ignore; CAPI now normally returns modifiers to phantom attributes (i.e. CollisionResistance)
                }
                else {
                    attr = mapModifier['OutfittingFieldType_' + field];
                    if (attr) { // 2.5+ Journal
                        if (attr == 'rof') { // Journal returns rof as effective value, so we have to consider bstrof and bstsize to calculate the bstint modifier
                            var bstrof = modObj.BurstRateOfFire ? modObj.BurstRateOfFire.value : getModuleAttributeValue(module, 'bstrof');
                            var bstsize = modObj.BurstSize ? modObj.BurstSize.value : getModuleAttributeValue(module, 'bstsize');
                            attr = 'bstint';
                            value = (bstsize / value) - ((bstsize > 1) ? ((bstsize - 1) / bstrof) : 0);
                        }
                        if (!isModuleAttributeModifiable(module, attr)) {
                            // ignore; Journal probably also returns modifiers to base=0 attributes (i.e. Lightweight Bulkhead mass, DSS integrity/powerdraw)
                        }
                        else {
                            modifier[attr] = getModuleAttributeModifier(module, attr, value);
                        }
                    }
                    else if (attr === null) {
                        // ignore; Journal probably also returns modifiers to phantom attributes (i.e. CollisionResistance)
                    }
                    else if (unsupported) {
                        var tag = getModuleLabel(module) + (prefix ? (' (' + prefix + ')') : '');
                        if (!unsupported[tag])
                            unsupported[tag] = {};
                        unsupported[tag][field] = 1;
                    }
                    else if (errors) {
                        errors.push(prefix + ': Unknown modification "' + field + '"');
                    }
                }
            }
            if (modifier.maxrng > 0 && !modifier.dmgfall) {
                // TODO: remove this whenever FD fixes the API to include damage falloff for long range weapons
                var recipeName = (slotObj.engineer ? slotObj.engineer.recipeName : slotObj.module.recipeName); // after 2.4 beta or before 2.3
                modifier.dmgfall = (recipeName.toUpperCase() === 'WEAPON_LONGRANGE') ? 10 : modifier.maxrng;
            }
            // CAPI in 2.4b identifies the special modifications but does not report their side effects,
            // so convert them to the old style and let the old code handle it just like for pre-2.4
            modArray = [];
            if (slotObj.specialModifications) {
                for (var field in slotObj.specialModifications) {
                    modArray.push({name: field, value: 1});
                }
            }
        }

        if (modArray && (modArray.length || 0) > 0) {
            var mapModifier = eddb.fdattrmod;
            var modFalloffFromRange = false;
            for (var m = 0; m < modArray.length; m++) {
                if (modArray[m].name == 'mod_weapon_clip_size_override') {
                    modifier.ammoclip = (modArray[m].value / (module.ammoclip || eddb.attribute.ammoclip.default)) - 1;
                }
                else if (modArray[m].name == 'mod_weapon_falloffrange_from_range') {
                    modFalloffFromRange = true;
                }
                else if (mapModifier[modArray[m].name]) {
                    for (var attr in mapModifier[modArray[m].name]) {
                        if (mapModifier[modArray[m].name].hasOwnProperty(attr) && (module[attr] || eddb.attribute[attr].default || eddb.attribute[attr].modset || eddb.attribute[attr].modadd || eddb.attribute[attr].modmod)) {
                            if (eddb.attribute[attr].modset) {
                                modifier[attr] = (mapModifier[modArray[m].name][attr] * modArray[m].value);
                            }
                            else if (eddb.attribute[attr].modadd) {
                                modifier[attr] = (modifier[attr] || 0) + (mapModifier[modArray[m].name][attr] * modArray[m].value);
                            }
                            else {
                                modifier[attr] = ((1 + (modifier[attr] || 0)) * (1 + (mapModifier[modArray[m].name][attr] * modArray[m].value))) - 1;
                            }
                        }
                    }
                }
                else if (unsupported) {
                    var tag = getModuleLabel(module) + (prefix ? (' (' + prefix + ')') : '');
                    if (!unsupported[tag])
                        unsupported[tag] = {};
                    unsupported[tag][modArray[m].name] = 1;
                }
                else if (errors) {
                    errors.push(prefix + ' Modification #' + (m + 1) + ': Unknown modifier "' + modArray[m].name + '"');
                }
            }
            if (modFalloffFromRange && modifier.maxrng) {
                modifier.dmgfall = getModuleAttributeModifier(module, 'dmgfall', getModuleAttributeValue(module, 'maxrng', modifier.maxrng));
            }
        }

        // apply and re-calculate all modifiers to account for step values
        var modified = false;
        for (var attr in modifier) {
            modified = true;
            if (modifier.hasOwnProperty(attr) && eddb.attribute[attr].step) {
                // clip modifiers round up, all others round down
                modifier[attr] = getModuleAttributeModifier(module, attr, getModuleAttributeValue(module, attr, modifier[attr], ((attr == 'ammoclip') ? 1 : -1)));
            }
        }

        return modified ? modifier : null;
    }; // decodeLoadoutModuleModifiersFromAPIExport()


    var importLoadoutFromCoriolis = function (exportObj) {
        // the export button returns just the build object;
        // the options->detailed export link returns an array of all saved build objects
        if (exportObj.length === undefined)
            exportObj = [exportObj];

        var save = false;
        if (exportObj.length > 1) {
            if (cache.feature.storage) {
                save = confirm(
                        'This Coriolis export contains multiple ship builds;\n' +
                        'only the first one will be loaded for viewing.\n' +
                        '\n' +
                        'Click OK if you would also like to import all of these\n' +
                        'builds into your saved loadouts. They will be named like\n' +
                        '"Coriolis Sidewinder - Label", overwriting any existing\n' +
                        'saved loadouts with the same name.\n' +
                        '\n' +
                        'Click Cancel to just load the first build without\n' +
                        'modifying any of your saved loadouts.'
                        );
            }
            else {
                /*
                 alert(
                 'This Coriolis export contains multiple ship builds;\n' +
                 'only the first one will be loaded for viewing.\n' +
                 '\n' +
                 'Because your browser does not support Local Storage,\n' +
                 'the other builds cannot be imported and will be ignored.'
                 );
                 */
            }
        }

        var activeloadout = null;
        var activehash = null;
        var errors = [];
        for (var l = 0; l < exportObj.length; l++) {
            var prefix = ((exportObj.length > 1) ? ('Loadout #' + (l + 1) + ' ') : '');
            var loadout = decodeLoadoutFromCoriolisExport(exportObj[l], errors, prefix);
            if (loadout)
                isShipLoadoutValid(loadout, true, errors, prefix);
            if (loadout && loadout.ship) {
                activeloadout = activeloadout || loadout;
                if (save) {
                    var hash = hashEncodeS('(Coriolis) ' + eddb.ship[loadout.ship].name + ' - ' + exportObj[l].name);
                    activehash = activehash || hash;
                    cache.stored.fitting[hash] = encodeLoadoutToHash(loadout);
                }
                else {
                    break;
                }
            }
        }

        if (!activeloadout) {
            alert('Import failed: No ship builds found');
            return false;
        }

        setUILoadout(activeloadout);
        if (save) {
            writeStoredFittings();
            updateStoredFittings(activehash);
        }
        else {
            setSelectedStoredFitting();
        }
        updateStatistics();
        updateJumpCalc();
        updateSpeedCalc();
        updateDamageCalc();

        if (errors.length > 0) {
            showUITextareaPopup(
                    'Coriolis build(s) imported with errors:\n\n* ' + errors.join('\n* '),
                    0, 0, null, true, false
                    );
        }

        return true;
    }; // importLoadoutFromCoriolis()


    var decodeLoadoutFromCoriolisExport = function (loadoutObj, errors, prefix) {
        prefix = prefix || '';

        // initialize maps for cross-compatibility
        var map = {
            ship: {
                'COBRA MK III': 'COBRA MKIII',
                'COBRA MK IV': 'COBRA MKIV',
                'VIPER': 'VIPER MKIII',
                'VIPER MK III': 'VIPER MKIII',
                'VIPER MK IV': 'VIPER MKIV',
            },
            hardpoint: {
                '3C/F PACIFIER FRAGMENT CANNON': '3C/F PACIFIER FRAG-CANNON',
                '1D/F MINING LANCE MINING LASER': '1D/F MINING LANCE BEAM LASER',
                '2B/FD ROCKET PROPELLED FSD DISRUPTOR MISSILE RACK': '2B/FD ROCKET PROPELLED FSD DISRUPTER',
                '1F/F ENFORCER MULTI-CANNON': '1F/F ENFORCER CANNON',
                '2E/F DISRUPTOR PULSE LASER': '2E/F PULSE DISRUPTOR LASER',
            },
            utility: {
                '0A CARGO SCANNER': '0A MANIFEST SCANNER',
                '0B CARGO SCANNER': '0B MANIFEST SCANNER',
                '0C CARGO SCANNER': '0C MANIFEST SCANNER',
                '0D CARGO SCANNER': '0D MANIFEST SCANNER',
                '0E CARGO SCANNER': '0E MANIFEST SCANNER',
            },
            componentslot: ['bulkheads', 'powerPlant', 'thrusters', 'frameShiftDrive', 'lifeSupport', 'powerDistributor', 'sensors', 'fuelTank'],
            componentlabel: ['Bulkhead', 'Power Plant', 'Thrusters', 'Frame Shift Drive', 'Life Support', 'Power Distributor', 'Sensors', 'Fuel Tank'],
            component: [
                {// bulkhead
                    'LIGHTWEIGHT ALLOY': '1C LIGHTWEIGHT ALLOY',
                    'REINFORCED ALLOY': '1B REINFORCED ALLOY',
                    'MILITARY GRADE COMPOSITE': '1A MILITARY GRADE COMPOSITE',
                    'MIRRORED SURFACE COMPOSITE': '1A MIRRORED SURFACE COMPOSITE',
                    'REACTIVE SURFACE COMPOSITE': '1A REACTIVE SURFACE COMPOSITE',
                },
                {}, // reactor
                {}, // thruster
                {}, // fsd
                {}, // environment
                {}, // coupling
                {}, // sensor
                {// fuel
                    '1C FUEL TANK': '1C FUEL TANK (CAPACITY: 2)',
                    '2C FUEL TANK': '2C FUEL TANK (CAPACITY: 4)',
                    '3C FUEL TANK': '3C FUEL TANK (CAPACITY: 8)',
                    '4C FUEL TANK': '4C FUEL TANK (CAPACITY: 16)',
                    '5C FUEL TANK': '5C FUEL TANK (CAPACITY: 32)',
                    '6C FUEL TANK': '6C FUEL TANK (CAPACITY: 64)',
                    '7C FUEL TANK': '7C FUEL TANK (CAPACITY: 128)',
                    '8C FUEL TANK': '8C FUEL TANK (CAPACITY: 256)',
                },
            ],
            military: {
            },
            internal: {
                '1E CARGO RACK': '1E CARGO RACK (CAPACITY: 2)',
                '2E CARGO RACK': '2E CARGO RACK (CAPACITY: 4)',
                '3E CARGO RACK': '3E CARGO RACK (CAPACITY: 8)',
                '4E CARGO RACK': '4E CARGO RACK (CAPACITY: 16)',
                '5E CARGO RACK': '5E CARGO RACK (CAPACITY: 32)',
                '6E CARGO RACK': '6E CARGO RACK (CAPACITY: 64)',
                '7E CARGO RACK': '7E CARGO RACK (CAPACITY: 128)',
                '8E CARGO RACK': '8E CARGO RACK (CAPACITY: 256)',
                '1E CORROSION RESISTANT CARGO RACK': '1E CORROSION RESISTANT CARGO RACK (CAPACITY: 1)',
                '1F CORROSION RESISTANT CARGO RACK': '1F CORROSION RESISTANT CARGO RACK (CAPACITY: 2)',
                '1C FUEL TANK': '1C FUEL TANK (CAPACITY: 2)',
                '2C FUEL TANK': '2C FUEL TANK (CAPACITY: 4)',
                '3C FUEL TANK': '3C FUEL TANK (CAPACITY: 8)',
                '4C FUEL TANK': '4C FUEL TANK (CAPACITY: 16)',
                '5C FUEL TANK': '5C FUEL TANK (CAPACITY: 32)',
                '6C FUEL TANK': '6C FUEL TANK (CAPACITY: 64)',
                '7C FUEL TANK': '7C FUEL TANK (CAPACITY: 128)',
                '8C FUEL TANK': '8C FUEL TANK (CAPACITY: 256)',
                '5B/L LUXURY PASSENGER CABIN': '5B/L LUXURY CLASS PASSENGER CABIN',
                '6B/L LUXURY PASSENGER CABIN': '6B/L LUXURY CLASS PASSENGER CABIN',
            },
            attr: {// https://github.com/EDCD/coriolis-data/blob/master/modifications/modifiers.json (44 lines, 42 entries as of 2016-Dec-01)
                'ammo': 'ammomax',
                'boot': 'boottime',
                'brokenregen': 'bgenrate',
                'burst': 'bstsize',
                'burstrof': 'bstrof',
                'clip': 'ammoclip',
                'damage': 'damage',
                'distdraw': 'distdraw',
                'duration': 'duration', // coriolis conflates "jam duration" of chaff with "duration" of heatsinks and SCBs
                'eff': 'heateff',
                'engcap': 'engcap',
                'engrate': 'engchg',
                'explres': 'expres',
                'facinglimit': 'facinglim',
                'hullboost': 'hullbst',
                'hullreinforcement': 'hullrnf',
                'integrity': 'integ',
                'jitter': 'jitter',
                'kinres': 'kinres',
                'mass': 'mass',
                'maxfuel': 'maxfuel',
                'optmass': 'optmass',
                'optmul': 'optmul',
                'pgen': 'pwrcap',
                'piercing': 'pierce',
                'power': 'pwrdraw',
                'range': 'maxrng', // coriolis conflates "range" of ECM, "scanner range" of manifest/kill/wake scanners, "target range" of limpets, and "maximum range" of weapons
                'ranget': 'timerng', // but at least it differentiates "range" in seconds of FSDI
                'regen': 'genrate',
                'reload': 'rldtime',
                'rof': 'rof',
                'shield': null, // ?
                'shieldboost': 'shieldbst',
                'spinup': 'spinup',
                'syscap': 'syscap',
                'sysrate': 'syschg',
                'thermload': 'thmload',
                'thermres': 'thmres',
                'wepcap': 'wepcap',
                'weprate': 'wepchg',
                'shieldreinforcement': 'shieldrnf',
                'type': null, // damage type
            },
            blueprint: {// https://github.com/EDCD/coriolis-data/blob/master/modifications/blueprints.json (93 lines, 91 entries as of 2016-Dec-01)
                // most of them are the same
                'Lightweight': 'Light Weight',
                'Dirty': 'Dirty Tuning',
                'Clean': 'Clean Tuning',
                'Faster boot sequence': 'Faster Boot',
                'Enhanced low power': 'Enhanced, Low Power',
            },
        };

        var name = (loadoutObj.ship || '').trim().toUpperCase();
        var sID = getShipIDByName(map.ship[name] || name);
        var ship = eddb.ship[sID];
        if (!ship) {
            if (errors)
                errors.push(prefix + 'Unknown ship "' + name + '"');
            return null;
        }
        var loadout = createLoadoutStruct(sID);
        loadout.label = loadoutObj.name;
        loadout.hatch.powered = !!loadoutObj.components.standard.cargoHatch.enabled;
        loadout.hatch.priority = parseInt(loadoutObj.components.standard.cargoHatch.priority);

        // some ships' hardpoints are arranged in unusual orders (a few ascending, one mixed) but coriolis pretends all hardpoints are sorted descending
        map.hardpointslot = [];
        for (var slot = 0; slot < ship.slots.hardpoint.length; slot++)
            map.hardpointslot.push(ship.slots.hardpoint[slot]);
        map.hardpointslot.sort();
        map.hardpointslot.reverse();
        var next = {};
        for (var slot = 0; slot < map.hardpointslot.length; slot++) {
            var size = map.hardpointslot[slot];
            map.hardpointslot[slot] = ship.slots.hardpoint.indexOf(size, next[size] || 0);
            next[size] = map.hardpointslot[slot] + 1;
        }

        // process hardpoints
        for (var i = 0; i < loadoutObj.components.hardpoints.length; i++) {
            var slot = map.hardpointslot[i];
            var moduleObj = loadoutObj.components.hardpoints[i];
            if (!moduleObj)
                continue;

            if (moduleObj.group && moduleObj.name && moduleObj.name.substring(moduleObj.name.length - moduleObj.group.length) == moduleObj.group)
                moduleObj.group = '';
            if ((moduleObj.missile || '').substring(0, 1) == 'S' && moduleObj.group == 'Missile Rack' && !moduleObj.name)
                moduleObj.name = 'Seeker';

            var name = (
                    (moduleObj.class || '0') + (moduleObj.rating || '?') +
                    ((moduleObj.mount || moduleObj.missile) ? '/' : '') +
                    (moduleObj.mount || '').substring(0, 1) + (moduleObj.missile || '').substring(0, 1) +
                    ' ' + (moduleObj.name ? (moduleObj.name + ' ') : '') + (moduleObj.group || '')
                    ).trim().toUpperCase();
            var mID = getModuleIDByName('hardpoint', slot, (map.hardpoint[name] || name));
            if (mID) {
                loadout.hardpoint[slot].module = mID;
                loadout.hardpoint[slot].powered = !!moduleObj.enabled;
                loadout.hardpoint[slot].priority = parseInt(moduleObj.priority);
                var modifier = decodeLoadoutModuleModifiersFromCoriolisExport(ship.module[mID] || eddb.module[mID], moduleObj, map, errors, (prefix + 'Hardpoint #' + (i + 1) + ' '));
                loadout.hardpoint[slot].modified = !!modifier;
                loadout.hardpoint[slot].blueprint = modifier ? decodeLoadoutModuleBlueprintFromCoriolisExport(ship.module[mID] || eddb.module[mID], moduleObj, map, errors, (prefix + 'Hardpoint #' + (i + 1) + ' ')) : 0;
                loadout.hardpoint[slot].modifier = modifier || {};
            }
            else if (errors) {
                errors.push(prefix + 'Hardpoint #' + (i + 1) + ': Unknown module "' + name + '"');
            }
        }

        // process utility mounts
        for (var slot = 0; slot < loadoutObj.components.utility.length; slot++) {
            var moduleObj = loadoutObj.components.utility[slot];
            if (!moduleObj)
                continue;

            if (moduleObj.group && moduleObj.name && moduleObj.name.substring(moduleObj.name.length - moduleObj.group.length) == moduleObj.group)
                moduleObj.group = '';
            if (moduleObj.group == 'Countermeasure')
                moduleObj.group = '';
            if (moduleObj.name == 'Point Defence' && !moduleObj.mount)
                moduleObj.mount = 'T';

            var name = (
                    (moduleObj.class || '0') + (moduleObj.rating || '?') +
                    ((moduleObj.mount || moduleObj.missile) ? '/' : '') +
                    (moduleObj.mount || '').substring(0, 1) + (moduleObj.missile || '').substring(0, 1) +
                    ' ' + (moduleObj.name ? (moduleObj.name + ' ') : '') + (moduleObj.group || '')
                    ).trim().toUpperCase();
            var mID = getModuleIDByName('utility', slot, (map.utility[name] || name));
            if (mID) {
                loadout.utility[slot].module = mID;
                loadout.utility[slot].powered = !!moduleObj.enabled;
                loadout.utility[slot].priority = parseInt(moduleObj.priority);
                var modifier = decodeLoadoutModuleModifiersFromCoriolisExport(ship.module[mID] || eddb.module[mID], moduleObj, map, errors, (prefix + 'Utility #' + (slot + 1) + ' '));
                loadout.utility[slot].modified = !!modifier;
                loadout.utility[slot].blueprint = modifier ? decodeLoadoutModuleBlueprintFromCoriolisExport(ship.module[mID] || eddb.module[mID], moduleObj, map, errors, (prefix + 'Utility #' + (i + 1) + ' ')) : 0;
                loadout.utility[slot].modifier = modifier || {};
            }
            else if (errors) {
                errors.push(prefix + 'Utility #' + (slot + 1) + ': Unknown module "' + name + '"');
            }
        }

        // process core components
        for (var slot = 0; slot < ship.slots.component.length; slot++) {
            var moduleObj = loadoutObj.components.standard[map.componentslot[slot]];
            if (moduleObj) {
                // coriolis doesn't export a full object for bulkheads, just the plain name as a string (which means it drops bulkhead modifications, too)
                var name = ((slot == cache.component.abbrSlot.BH) ? moduleObj : (
                        (moduleObj.class || '0') + (moduleObj.rating || '?') +
                        ((moduleObj.mount || moduleObj.missile) ? '/' : '') +
                        (moduleObj.mount || '').substring(0, 1) + (moduleObj.missile || '').substring(0, 1) +
                        ' ' + (moduleObj.name ? (moduleObj.name + ' ') : '') + (moduleObj.group || map.componentlabel[slot] || '')
                        )).trim().toUpperCase();
                var mID = getModuleIDByName('component', slot, (map.component[slot][name] || name));
                if (mID) {
                    loadout.component[slot].module = mID;
                    loadout.component[slot].powered = ((slot == cache.component.abbrSlot.BH) ? true : !!moduleObj.enabled);
                    loadout.component[slot].priority = ((slot == cache.component.abbrSlot.BH) ? 1 : parseInt(moduleObj.priority));
                    var modifier = decodeLoadoutModuleModifiersFromCoriolisExport(ship.module[mID] || eddb.module[mID], moduleObj, map, errors, (prefix + cache.component.slotLabel[slot] + ' '));
                    loadout.component[slot].modified = !!modifier;
                    loadout.component[slot].blueprint = modifier ? decodeLoadoutModuleBlueprintFromCoriolisExport(ship.module[mID] || eddb.module[mID], moduleObj, map, errors, (prefix + cache.component.slotLabel[slot] + ' ')) : 0;
                    loadout.component[slot].modifier = modifier || {};
                }
                else if (errors) {
                    errors.push(prefix + cache.component.slotLabel[slot] + ': Unknown module "' + name + '"');
                }
            }
            else if (errors) {
                errors.push(prefix + cache.component.slotLabel[slot] + ': Missing slot data');
            }
        }

        // TODO military
        // coriolis in its infinite wisdom just tosses military slots into the middle of the regular optional internal slots,
        // so there's no way to tell which is which; we could theoretically handle that by just slotting internals into
        // the next available military if it's valid module, but that's a pain; hopefully soon we can just standardize on an
        // API-derived JSON format and then this won't be a problem

        // process internals
        for (var slot = 0; slot < loadoutObj.components.internal.length; slot++) {
            var moduleObj = loadoutObj.components.internal[slot];
            if (!moduleObj)
                continue;

            if (moduleObj.group && moduleObj.group.substring(moduleObj.group.length - 15) == 'Passenger Cabin')
                moduleObj.cabin = moduleObj.group.substring(0, 1);
            if (moduleObj.group && moduleObj.name && moduleObj.name.substring(moduleObj.name.length - moduleObj.group.length) == moduleObj.group)
                moduleObj.group = '';

            var name = (
                    (moduleObj.class || '0') + (moduleObj.rating || '?') +
                    ((moduleObj.mount || moduleObj.missile || moduleObj.cabin) ? '/' : '') +
                    (moduleObj.mount || '').substring(0, 1) + (moduleObj.missile || '').substring(0, 1) + (moduleObj.cabin || '').substring(0, 1) +
                    ' ' + (moduleObj.name ? (moduleObj.name + ' ') : '') + (moduleObj.group || '')
                    ).trim().toUpperCase();
            var mID = getModuleIDByName('internal', slot, (map.internal[name] || name));
            if (mID) {
                loadout.internal[slot].module = mID;
                loadout.internal[slot].powered = !!moduleObj.enabled;
                loadout.internal[slot].priority = parseInt(moduleObj.priority);
                var modifier = decodeLoadoutModuleModifiersFromCoriolisExport(ship.module[mID] || eddb.module[mID], moduleObj, map, errors, (prefix + 'Internal #' + (slot + 1) + ' '));
                loadout.internal[slot].modified = !!modifier;
                loadout.internal[slot].blueprint = modifier ? decodeLoadoutModuleBlueprintFromCoriolisExport(ship.module[mID] || eddb.module[mID], moduleObj, map, errors, (prefix + 'Internal #' + (i + 1) + ' ')) : 0;
                loadout.internal[slot].modifier = modifier || {};
            }
            else if (errors) {
                errors.push(prefix + 'Internal #' + (slot + 1) + ': Unknown module "' + name + '"');
            }
        }

        return loadout;
    }; // decodeLoadoutFromCoriolisExport()


    var decodeLoadoutModuleBlueprintFromCoriolisExport = function (module, moduleObj, map, errors, prefix) {
        if (moduleObj && moduleObj.blueprint && moduleObj.blueprint.name && moduleObj.blueprint.grade) {
            if (eddb.mtype[module.mtype].blueprint) {
                for (var bID in eddb.mtype[module.mtype].blueprint) {
                    var bp = eddb.mtype[module.mtype].blueprint[bID];
                    if (eddb.mtype[module.mtype].blueprint.hasOwnProperty(bID) && bp.name.toUpperCase() == (map.blueprint[moduleObj.blueprint.name] || moduleObj.blueprint.name).toUpperCase() && bp.grade == moduleObj.blueprint.grade) {
                        return bID;
                    }
                }
            }
            if (errors)
                errors.push(prefix + ': Unknown blueprint "' + moduleObj.blueprint.name + ' ' + moduleObj.blueprint.grade + '"');
        }
        return 0;
    }; // decodeLoadoutModuleBlueprintFromCoriolisExport()


    var decodeLoadoutModuleModifiersFromCoriolisExport = function (module, moduleObj, map, errors, prefix) {
        prefix = prefix || '';

        if (!moduleObj || !moduleObj.modifications)
            return null;

        var modifier = {};
        for (var cattr in moduleObj.modifications) {
            if (moduleObj.modifications.hasOwnProperty(cattr)) {
                var attr = map.attr[cattr];
                if (attr) {
                    // coriolis conflates "jam duration" of chaff with "duration" of heatsinks and SCBs
                    if (attr == 'duration' && module.mtype == 'ucl')
                        attr = 'jamdur';

                    // coriolis conflates "range" of ECM, "scanner range" of manifest/kill/wake scanners, "target range" of limpets, and "maximum range" of weapons
                    if (attr == 'maxrng' && module.mtype == 'uec')
                        attr = 'range';
                    if (attr == 'maxrng' && (module.mtype == 'ucs' || module.mtype == 'ukws' || module.mtype == 'ufsws'))
                        attr = 'scanrng';
                    if (attr == 'maxrng' && (module.mtype == 'iclc' || module.mtype == 'idlc' || module.mtype == 'iftlc' || module.mtype == 'ihblc' || module.mtype == 'iplc' || module.mtype == 'inlc' || module.mtype == 'irlc' || module.mtype == 'islc'))
                        attr = 'targetrng';

                    if (attr == 'shieldbst' || attr == 'hullbst') {
                        modifier[attr] = getModuleAttributeModifier(module, attr, getModuleAttributeValue(module, attr) * (1 + moduleObj.modifications[cattr] / 10000));
                    }
                    else if (attr == 'expres' || attr == 'kinres' || attr == 'thmres') {
                        modifier[attr] = getModuleAttributeModifier(module, attr, getModuleAttributeValue(module, attr) + moduleObj.modifications[cattr] / 100);
                    }
                    else if (attr == 'jitter' || attr == 'bstrof' || attr == 'bstsize') {
                        modifier[attr] = moduleObj.modifications[cattr] / 100;
                    }
                    else {
                        modifier[attr] = moduleObj.modifications[cattr] / 10000;
                    }
                }
                else if (errors) {
                    errors.push(prefix + 'Modification: Unknown attribute "' + cattr + '"');
                }
            }
        }

        // translate rof modifier to bstint
        if (modifier.rof) {
            var rof = getModuleAttributeValue(module, 'rof', modifier.rof);
            var bstint = getModuleAttributeValue(module, 'bstint');
            var bstrof = getModuleAttributeValue(module, 'bstrof', modifier.bstrof);
            var bstsize = getModuleAttributeValue(module, 'bstsize', modifier.bstsize);
            if (bstsize > 1) {
                if (bstrof > 0) {
                    modifier.bstint = (bstsize / rof - (bstsize - 1) / bstrof) / bstint - 1;
                }
                else {
                    modifier.bstrof = (bstsize - 1) / (bstsize / rof - bstint);
                }
            }
            else {
                modifier.bstint = 1 / (1 + modifier.rof) - 1;
            }
            delete modifier['rof'];
        }

        // apply and re-calculate all modifiers to account for step values
        for (var attr in modifier) {
            if (modifier.hasOwnProperty(attr) && eddb.attribute[attr].step) {
                modifier[attr] = getModuleAttributeModifier(module, attr, getModuleAttributeValue(module, attr, modifier[attr]));
            }
        }

        return modifier;
    }; // decodeLoadoutModuleModifiersFromCoriolisExport()


    var updateHash = function (loadout) {
        window.location.replace('#/L=' + encodeLoadoutToHash(loadout || getUILoadout()));
    }; // updateHash()


    var updateStatistics = function (noHashChange) {
        var insurance = parseFloat(document.getElementById('select_insurance').value);
        var discount = document.getElementById('select_discount').value.split('_');
        var discountAll = (discount[0] == 'all') ? parseFloat(discount[1]) : 0;
        var discountShip = (discount[0] == 'ship') ? parseFloat(discount[1]) : 0;
        var loadout = getUILoadout();
        var mass = 0, pwrcap = 0, retpowerdraw = [0, 0, 0, 0, 0, 0], deppowerdraw = [0, 0, 0, 0, 0, 0], fuel = 0, cargo = 0, realcost = 0, mycost = 0;

        // ship hull and cargo hatch
        var ship = eddb.ship[loadout.ship];
        mass += (ship.mass || 0);
        if (loadout.hatch.powered)
            retpowerdraw[loadout.hatch.priority] += POWER_HATCH;
        realcost += ship.cost * (1 - discountAll) - (ship.retail * discountShip);
        if (document.getElementById('checkbox_ship_priced').checked)
            mycost += ship.cost * (1 - discountAll) - (ship.retail * discountShip);
        document.getElementById('span_ship_cost').innerHTML = formatNumHTML(ship.cost * (1 - discountAll) - (ship.retail * discountShip), 0);
        // TODO: when module discounts are supported, we'll want to update them here so they react to the discount select dropdown

        // hardpoints
        for (var slot = 0; slot < loadout.hardpoint.length; slot++) {
            var mID = loadout.hardpoint[slot].module;
            var module = ship.module[mID] || eddb.module[mID];
            if (module) {
                mass += getModuleAttributeValue(module, 'mass', ((loadout.hardpoint[slot].modified && loadout.hardpoint[slot].modifier['mass']) || 0));
                if (loadout.hardpoint[slot].powered)
                    deppowerdraw[loadout.hardpoint[slot].priority] += getModuleAttributeValue(module, 'pwrdraw', ((loadout.hardpoint[slot].modified && loadout.hardpoint[slot].modifier['pwrdraw']) || 0));
                realcost += (module.cost || 0) * (1 - discountAll);
                if (document.getElementById('checkbox_hardpoint_' + slot + '_priced').checked)
                    mycost += (module.cost || 0) * (1 - discountAll);
            }
        }

        // utilities
        for (var slot = 0; slot < loadout.utility.length; slot++) {
            var mID = loadout.utility[slot].module;
            var module = ship.module[mID] || eddb.module[mID];
            if (module) {
                mass += getModuleAttributeValue(module, 'mass', ((loadout.utility[slot].modified && loadout.utility[slot].modifier['mass']) || 0));
                if (loadout.utility[slot].powered)
                    (module.passive ? retpowerdraw : deppowerdraw)[loadout.utility[slot].priority] += getModuleAttributeValue(module, 'pwrdraw', ((loadout.utility[slot].modified && loadout.utility[slot].modifier['pwrdraw']) || 0));
                realcost += (module.cost || 0) * (1 - discountAll);
                if (document.getElementById('checkbox_utility_' + slot + '_priced').checked)
                    mycost += (module.cost || 0) * (1 - discountAll);
            }
        }

        // components
        for (var slot = 0; slot < loadout.component.length; slot++) {
            var mID = loadout.component[slot].module;
            var module = ship.module[mID] || eddb.module[mID];
            if (module) {
                mass += getModuleAttributeValue(module, 'mass', ((loadout.component[slot].modified && loadout.component[slot].modifier['mass']) || 0));
                pwrcap += getModuleAttributeValue(module, 'pwrcap', ((loadout.component[slot].modified && loadout.component[slot].modifier['pwrcap']) || 0));
                if (loadout.component[slot].powered)
                    retpowerdraw[loadout.component[slot].priority] += getModuleAttributeValue(module, 'pwrdraw', ((loadout.component[slot].modified && loadout.component[slot].modifier['pwrdraw']) || 0));
                fuel += getModuleAttributeValue(module, 'fuelcap', ((loadout.component[slot].modified && loadout.component[slot].modifier['fuelcap']) || 0));
                realcost += (module.cost || 0) * (1 - discountAll);
                if (document.getElementById('checkbox_component_' + slot + '_priced').checked)
                    mycost += (module.cost || 0) * (1 - discountAll);
            }
        }

        // military
        for (var slot = 0; slot < loadout.military.length; slot++) {
            var mID = loadout.military[slot].module;
            var module = ship.module[mID] || eddb.module[mID];
            if (module) {
                mass += getModuleAttributeValue(module, 'mass', ((loadout.military[slot].modified && loadout.military[slot].modifier['mass']) || 0));
                if (loadout.military[slot].powered)
                    retpowerdraw[loadout.military[slot].priority] += getModuleAttributeValue(module, 'pwrdraw', ((loadout.military[slot].modified && loadout.military[slot].modifier['pwrdraw']) || 0));
                realcost += (module.cost || 0) * (1 - discountAll);
                if (document.getElementById('checkbox_military_' + slot + '_priced').checked)
                    mycost += (module.cost || 0) * (1 - discountAll);
            }
        }

        // internals
        for (var slot = 0; slot < loadout.internal.length; slot++) {
            var mID = loadout.internal[slot].module;
            var module = ship.module[mID] || eddb.module[mID];
            if (module) {
                mass += getModuleAttributeValue(module, 'mass', ((loadout.internal[slot].modified && loadout.internal[slot].modifier['mass']) || 0));
                if (loadout.internal[slot].powered) /* && module.mtype != 'iss') // FINALLY FIXED in 2.3! */
                    retpowerdraw[loadout.internal[slot].priority] += getModuleAttributeValue(module, 'pwrdraw', ((loadout.internal[slot].modified && loadout.internal[slot].modifier['pwrdraw']) || 0));
                cargo += getModuleAttributeValue(module, 'cargocap', ((loadout.internal[slot].modified && loadout.internal[slot].modifier['cargocap']) || 0));
                fuel += getModuleAttributeValue(module, 'fuelcap', ((loadout.internal[slot].modified && loadout.internal[slot].modifier['fuelcap']) || 0));
                realcost += (module.cost || 0) * (1 - discountAll);
                if (document.getElementById('checkbox_internal_' + slot + '_priced').checked)
                    mycost += (module.cost || 0) * (1 - discountAll);
            }
        }

        // update thruster options
        var slot = cache.component.abbrSlot.TH;
        var mID = loadout.component[slot].module;
        var module = ship.module[mID] || eddb.module[mID];
        var compmass = mass + fuel + cargo - getModuleAttributeValue(module, 'mass', ((loadout.component[slot].modified && loadout.component[slot].modifier['mass']) || 0))
        var div = document.getElementById('div_component_' + slot + '_module_popup');
        var inputs = div.getElementsByTagName('INPUT');
        for (var i = 0; i < inputs.length; i++) {
            var mID = parseInt(inputs[i].value);
            var module = ship.module[mID] || eddb.module[mID];
            inputs[i].className = (module && (module.maxmass >= compmass + module.mass)) ? '' : 'warning';
        }

        // update power calc
        var classes = '';
        for (var i = 1; i <= 5; i++) {
            retpowerdraw[0] += retpowerdraw[i];
            var w = (100.0 * retpowerdraw[i] / pwrcap);
            var abbr = document.getElementById('abbr_powercalc_ret_' + i);
            abbr.title = formatPct1(retpowerdraw[0] / pwrcap) + ' (' + formatNum2(retpowerdraw[0]) + ' / ' + formatNum2(pwrcap) + ' MW)';
            abbr.style.display = (w > 0.0) ? '' : 'none';
            abbr.style.width = w.toFixed(3) + '%';
            abbr.className = (retpowerdraw[0] > pwrcap) ? 'powererror' : (retpowerdraw[0] > 0.5 * pwrcap) ? 'powerwarning' : 'powerokay';
            if (i == 1)
                abbr.parentNode.className = abbr.className;

            deppowerdraw[0] += retpowerdraw[i] + deppowerdraw[i];
            var w = (100.0 * (retpowerdraw[i] + deppowerdraw[i]) / pwrcap);
            var abbr = document.getElementById('abbr_powercalc_dep_' + i);
            abbr.title = formatPct1(deppowerdraw[0] / pwrcap) + ' (' + formatNum2(deppowerdraw[0]) + ' / ' + formatNum2(pwrcap) + ' MW)';
            abbr.style.display = (w > 0.0) ? '' : 'none';
            abbr.style.width = w.toFixed(3) + '%';
            abbr.className = (deppowerdraw[0] > pwrcap) ? 'powererror' : (deppowerdraw[0] > 0.5 * pwrcap) ? 'powerwarning' : 'powerokay';
            if (i == 1)
                abbr.parentNode.className = abbr.className;

            if (retpowerdraw[0] > pwrcap) {
                classes += ' power' + i + 'error';
            }
            else if (deppowerdraw[0] > pwrcap) {
                classes += ' power' + i + 'warning';
            }
            else if (deppowerdraw[0] <= 0.5 * pwrcap) {
                classes += ' power' + i + 'okay';
            }
        }
        document.getElementById('table_loadout').className = classes.substring(1);

        /* TODO
         // update idle heat
         var slot = cache.component.abbrSlot.PP;
         var mID = loadout.component[slot].module;
         var module = ship.module[mID] || eddb.module[mID];
         var span = document.getElementById('span_heat_idle');
         if (span) {
         span.innerHTML = (
         formatNumHTML(100 * getIdleHeat(ship.heatcap, module.heateff, retpowerdraw[0]) / ship.heatcap, 0) + '/' +
         formatNumHTML(100 * getIdleHeat(ship.heatcap, module.heateff, deppowerdraw[0]) / ship.heatcap, 0)
         );
         }
         */

        // update stats cache
        cache.stats.mass = mass;
        cache.stats.fuel = fuel;
        cache.stats.cargo = cargo;
        cache.stats.power = pwrcap;
        cache.stats.passivedraw = retpowerdraw[0];
        cache.stats.activedraw = deppowerdraw[0] - retpowerdraw[0];
        cache.stats.mycost = mycost;
        cache.stats.realcost = realcost;

        // update stats displays
        document.getElementById('span_total_mass_empty').innerHTML = formatNum1(mass);
        document.getElementById('span_total_mass_full').innerHTML = formatNum1(mass + fuel + cargo);
        document.getElementById('span_total_power_retracted').innerHTML = formatNum2(retpowerdraw[0]) + ' (' + formatPct0(retpowerdraw[0] / pwrcap) + ')';
        document.getElementById('span_total_power_retracted').className = (retpowerdraw[0] > pwrcap) ? 'error' : '';
        document.getElementById('span_total_power_deployed').innerHTML = formatNum2(deppowerdraw[0]) + ' (' + formatPct0(deppowerdraw[0] / pwrcap) + ')';
        document.getElementById('span_total_power_deployed').className = (deppowerdraw[0] > pwrcap) ? 'error' : '';
        document.getElementById('span_total_fuel').innerHTML = formatNum0(fuel) + ' T';
        document.getElementById('span_total_cargo').innerHTML = formatNum0(cargo);
        document.getElementById('span_total_cost_buy').innerHTML = (isNaN(mycost) ? '??' : formatNum0(mycost));
        document.getElementById('span_total_cost_rebuy').innerHTML = (isNaN(realcost) ? '??' : formatNum0(realcost * (1 - insurance)));
        document.getElementById('input_jumpcalc_cargo').value = min(max(parseFloat(document.getElementById('input_jumpcalc_cargo').value), 0), cargo);
        document.getElementById('input_routecalc_cargo').value = min(max(parseFloat(document.getElementById('input_routecalc_cargo').value), 0), cargo);
        if (!noHashChange)
            updateHash(loadout);
    }; // updateStatistics()


    var handleJumpCalcFuelChange = function (v) {
        document.getElementById('input_jumpcalc_fuel').value = min(max(v, 0), 100);
        updateJumpCalc();
    }; // handleJumpCalcFuelChange()


    var handleJumpCalcCargoChange = function (v) {
        document.getElementById('input_jumpcalc_cargo').value = min(max(v | 0, 0), cache.stats.cargo);
        updateJumpCalc();
    }; // handleJumpCalcCargoChange()


    var updateJumpCalc = function () {
        var slot = cache.component.abbrSlot.FD;
        var fsd = getUISlotModule('component', slot);
        var fsdOpt = getUISlotAttributeValue('component', slot, 'optmass');
        var fsdMax = getUISlotAttributeValue('component', slot, 'maxfuel');
        var fsdMul = getUISlotAttributeValue('component', slot, 'fuelmul');
        var fsdPwr = getUISlotAttributeValue('component', slot, 'fuelpower');
        var mass = max(0, cache.stats.mass);
        var maxfuel = max(0, cache.stats.fuel);
        var maxcargo = max(0, cache.stats.cargo);
        var userfuel = max(0, min(100, parseFloat(document.getElementById('input_jumpcalc_fuel').value))) / 100.0 * maxfuel;
        var usercargo = max(0, min(maxcargo, parseFloat(document.getElementById('input_jumpcalc_cargo').value)));
        document.getElementById('input_jumpcalc_cargo').value = usercargo;

        document.getElementById('span_jumpcalc_min_unladen').innerHTML = formatNum2(getJumpRange(mass + min(fsdMax, maxfuel), min(fsdMax, maxfuel), fsdOpt, fsdMul, fsdPwr));
        document.getElementById('span_jumpcalc_min_user').innerHTML = formatNum2(getJumpRange(mass + min(fsdMax, maxfuel) + usercargo, min(fsdMax, maxfuel), fsdOpt, fsdMul, fsdPwr));
        document.getElementById('span_jumpcalc_min_laden').innerHTML = formatNum2(getJumpRange(mass + min(fsdMax, maxfuel) + maxcargo, min(fsdMax, maxfuel), fsdOpt, fsdMul, fsdPwr));
        document.getElementById('span_jumpcalc_user_unladen').innerHTML = formatNum2(getJumpRange(mass + userfuel, min(fsdMax, userfuel), fsdOpt, fsdMul, fsdPwr));
        document.getElementById('span_jumpcalc_user_user').innerHTML = formatNum2(getJumpRange(mass + userfuel + usercargo, min(fsdMax, userfuel), fsdOpt, fsdMul, fsdPwr));
        document.getElementById('span_jumpcalc_user_laden').innerHTML = formatNum2(getJumpRange(mass + userfuel + maxcargo, min(fsdMax, userfuel), fsdOpt, fsdMul, fsdPwr));
        var unladen = getJumpRange(mass + maxfuel, min(fsdMax, maxfuel), fsdOpt, fsdMul, fsdPwr);
        document.getElementById('span_jumpcalc_max_unladen').innerHTML = formatNum2(unladen);
        document.getElementById('span_jumpcalc_max_user').innerHTML = formatNum2(getJumpRange(mass + maxfuel + usercargo, min(fsdMax, maxfuel), fsdOpt, fsdMul, fsdPwr));
        var laden = getJumpRange(mass + maxfuel + maxcargo, min(fsdMax, maxfuel), fsdOpt, fsdMul, fsdPwr);
        document.getElementById('span_jumpcalc_max_laden').innerHTML = formatNum2(laden);

        cache.stats.rangeUnladen = unladen;
        cache.stats.rangeLaden = laden;
    }; // updateJumpCalc()


    var handleSpeedCalcPipsChange = function (v) {
        document.getElementById('input_speedcalc_pips').value = (round(min(max(v, 0), 4) * 2) / 2).toFixed(1);
        updateSpeedCalc();
    }; // handleSpeedCalcPipsChange()


    var updateSpeedCalc = function () {
        var ship = eddb.ship[parseInt(document.getElementById('select_ship').value)];
        var slot = cache.component.abbrSlot.TH;
        var minMass = getUISlotAttributeValue('component', slot, 'minmass');
        var optMass = getUISlotAttributeValue('component', slot, 'optmass');
        var maxMass = getUISlotAttributeValue('component', slot, 'maxmass');
        var minMulSpd = getUISlotAttributeValue('component', slot, 'minmulspd') / 100.0;
        var optMulSpd = getUISlotAttributeValue('component', slot, 'optmulspd') / 100.0;
        var maxMulSpd = getUISlotAttributeValue('component', slot, 'maxmulspd') / 100.0;
        var minMulRot = getUISlotAttributeValue('component', slot, 'minmulrot') / 100.0;
        var optMulRot = getUISlotAttributeValue('component', slot, 'optmulrot') / 100.0;
        var maxMulRot = getUISlotAttributeValue('component', slot, 'maxmulrot') / 100.0;
        var slot = cache.component.abbrSlot.PD;
        var engCap = getUISlotAttributeValue('component', slot, 'engcap');
        var engChg = getUISlotAttributeValue('component', slot, 'engchg');
        var canboost = (engCap >= ship.boostcost + BOOST_MARGIN);
        var mass = max(0, cache.stats.mass);
        var maxfuel = max(0, cache.stats.fuel);
        var maxcargo = max(0, cache.stats.cargo);
        var pips = parseFloat(document.getElementById('input_speedcalc_pips').value);
        var mulRot, pitch, roll, yaw;
        var mulSpd, speed, boost;

        mulRot = getMassCurveMultiplier(mass + maxfuel, minMass, optMass, maxMass, minMulRot, optMulRot, maxMulRot);
        pitch = ship.pitch * mulRot;
        roll = ship.roll * mulRot;
        yaw = ship.yaw * mulRot;
        document.getElementById('span_flightcalc_pitch_unladen').innerHTML = isNaN(pitch) ? 'ERR' : (formatNum0(pitch) + '<small>&deg;/s</small><BR>' + formatSeconds(360.0 / pitch));
        document.getElementById('span_flightcalc_roll_unladen').innerHTML = isNaN(roll) ? 'ERR' : (formatNum0(roll) + '<small>&deg;/s</small><BR>' + formatSeconds(360.0 / roll));
        document.getElementById('span_flightcalc_yaw_unladen').innerHTML = isNaN(yaw) ? 'ERR' : (formatNum0(yaw) + '<small>&deg;/s</small><BR>' + formatSeconds(360.0 / yaw));

        mulRot = getMassCurveMultiplier(mass + maxfuel + maxcargo, minMass, optMass, maxMass, minMulRot, optMulRot, maxMulRot);
        pitch = ship.pitch * mulRot;
        roll = ship.roll * mulRot;
        yaw = ship.yaw * mulRot;
        document.getElementById('span_flightcalc_pitch_laden').innerHTML = isNaN(pitch) ? 'ERR' : (formatNum0(pitch) + '<small>&deg;/s</small><BR>' + formatSeconds(360.0 / pitch));
        document.getElementById('span_flightcalc_roll_laden').innerHTML = isNaN(roll) ? 'ERR' : (formatNum0(roll) + '<small>&deg;/s</small><BR>' + formatSeconds(360.0 / roll));
        document.getElementById('span_flightcalc_yaw_laden').innerHTML = isNaN(yaw) ? 'ERR' : (formatNum0(yaw) + '<small>&deg;/s</small><BR>' + formatSeconds(360.0 / yaw));

        mulSpd = getMassCurveMultiplier(mass + maxfuel, minMass, optMass, maxMass, minMulSpd, optMulSpd, maxMulSpd);
        speed = ship.topspd * mulSpd;
        boost = ship.bstspd * mulSpd;
        document.getElementById('span_speedcalc_0p_unladen').innerHTML = isNaN(speed) ? 'ERR' : formatNum0(speed * ship.minthrust / 100.0);
        document.getElementById('span_speedcalc_2p_unladen').innerHTML = isNaN(speed) ? 'ERR' : formatNum0(speed * (((1 - (pips / 4)) * ship.minthrust / 100.0) + (pips / 4)));
        document.getElementById('span_speedcalc_4p_unladen').innerHTML = isNaN(speed) ? 'ERR' : formatNum0(speed);
        document.getElementById('span_speedcalc_boost_unladen').innerHTML = canboost ? (isNaN(boost) ? 'ERR' : formatNum0(boost)) : '<abbr class="error" title="Cannot boost with this power distributor">ERR</abbr>';

        mulSpd = getMassCurveMultiplier(mass + maxfuel + maxcargo, minMass, optMass, maxMass, minMulSpd, optMulSpd, maxMulSpd);
        speed = ship.topspd * mulSpd;
        boost = ship.bstspd * mulSpd;
        document.getElementById('span_speedcalc_0p_laden').innerHTML = isNaN(speed) ? 'ERR' : formatNum0(speed * ship.minthrust / 100.0);
        document.getElementById('span_speedcalc_2p_laden').innerHTML = isNaN(speed) ? 'ERR' : formatNum0(speed * (((1 - (pips / 4)) * ship.minthrust / 100.0) + (pips / 4)));
        document.getElementById('span_speedcalc_4p_laden').innerHTML = isNaN(speed) ? 'ERR' : formatNum0(speed);
        document.getElementById('span_speedcalc_boost_laden').innerHTML = canboost ? (isNaN(boost) ? 'ERR' : formatNum0(boost)) : '<abbr class="error" title="Cannot boost with this power distributor">ERR</abbr>';

        if (canboost) {
            var frq = ship.boostcost / (engChg * pow(pips / 4.0, 1.1));
            document.getElementById('span_speedcalc_2p_boost').innerHTML = formatSeconds(frq < 5.0 ? (1 / 0) : frq);
            var frq = ship.boostcost / engChg;
            document.getElementById('span_speedcalc_4p_boost').innerHTML = formatSeconds(frq < 5.0 ? (1 / 0) : frq);
        }
        else {
            document.getElementById('span_speedcalc_2p_boost').innerHTML = '<abbr class="error" title="Cannot boost with this power distributor">ERR</abbr>';
            document.getElementById('span_speedcalc_4p_boost').innerHTML = '<abbr class="error" title="Cannot boost with this power distributor">ERR</abbr>';
        }
    }; // updateSpeedCalc()


    var handleDamageCalcPipsChange = function (v) {
        document.getElementById('input_damagecalc_pips').value = (round(min(max(v, 0), 4) * 2) / 2).toFixed(1);
        updateDamageCalc();
    }; // handleDamageCalcPipsChange()


    var updateDamageCalc = function () {
        var ship = eddb.ship[parseInt(document.getElementById('select_ship').value)];
        var pips = parseFloat(document.getElementById('input_damagecalc_pips').value);
        var module, dmgwgt, dmgmod, cycletime, ammotime, recharge, bursttime, sustlevel;
        var modulePierce, moduleROF, moduleClip, moduleAmmo, moduleReload, moduleDist;
        var dps0 = 0, dpsE = 0, eps = 0, ammo0 = 1 / 0, ammoE = 1 / 0;

        // defenses
        var tgtdef = document.getElementById('select_damagecalc_tgtdef').value.split('_');
        var kinmod = 1 - (parseInt(tgtdef[0]) / 100);
        var thmmod = 1 - (parseInt(tgtdef[1]) / 100);
        var expmod = 1 - (parseInt(tgtdef[2]) / 100);
        var axemod = 1;
        var hardness = (parseInt(tgtdef[3]) > 0) ? parseInt(document.getElementById('select_damagecalc_tgtship').value) : 0;

        // hardpoints
        for (var i = 0; i < ship.slots.hardpoint.length; i++) {
            module = getUISlotModule('hardpoint', i);
            if (module && document.getElementById('checkbox_hardpoint_' + i + '_powered').checked) {
                modulePierce = getUISlotAttributeValue('hardpoint', i, 'pierce');
                moduleDmg = getUISlotAttributeValue('hardpoint', i, 'damage') * getUISlotAttributeValue('hardpoint', i, 'rounds');
                moduleROF = getUISlotAttributeValue('hardpoint', i, 'rof');
                moduleClip = getUISlotAttributeValue('hardpoint', i, 'ammoclip');
                moduleAmmo = getUISlotAttributeValue('hardpoint', i, 'ammomax');
                moduleReload = getUISlotAttributeValue('hardpoint', i, 'rldtime');
                moduleDist = getUISlotAttributeValue('hardpoint', i, 'distdraw');
                dmgmod = 1.0;
                dmgwgt = ((module.abswgt || 0) + (module.kinwgt || 0) + (module.thmwgt || 0) + (module.expwgt || 0) + (module.axewgt || 0));
                if (dmgwgt > 0)
                    dmgmod *= (1 * (module.abswgt || 0) + kinmod * (module.kinwgt || 0) + thmmod * (module.thmwgt || 0) + expmod * (module.expwgt || 0) + axemod * (module.axewgt || 0)) / dmgwgt;
                dmgmod *= min(1, modulePierce / hardness);
                cycletime = isFinite(moduleROF) ? (moduleReload ? (((moduleClip || 1) - 1) / moduleROF + moduleReload) : ((moduleClip || 1) / moduleROF)) : 1;
                ammotime = cycletime - moduleReload + (moduleClip ? (cycletime * moduleAmmo / moduleClip) : 1 / 0);
                if (moduleDist) {
                    eps += moduleDist * (moduleClip || 1) / cycletime;
                    if (moduleDmg)
                        dpsE += dmgmod * moduleDmg * (moduleClip || 1) / cycletime;
                    ammoE = min(ammoE, ammotime);
                }
                else {
                    if (moduleDmg)
                        dps0 += dmgmod * moduleDmg * (moduleClip || 1) / cycletime;
                    ammo0 = min(ammo0, ammotime);
                }
            }
        }
        document.getElementById('span_damagecalc_burstdps').innerHTML = formatNumHTML(dps0 + dpsE, 1);

        // power coupling/distributor
        var slot = cache.component.abbrSlot.PD;
        module = getUISlotModule('component', slot);
        if (module) {
            var moduleCap = getUISlotAttributeValue('component', slot, 'wepcap');
            var moduleChg = getUISlotAttributeValue('component', slot, 'wepchg');
            recharge = 0;
            bursttime = moduleCap / max(0, eps - recharge);
            sustlevel = eps ? 0 : 1;
            ammotime = min(ammo0, (ammoE <= bursttime) ? ammoE : bursttime + (ammoE - bursttime) / sustlevel);
            document.getElementById('span_damagecalc_0p_bursttime').innerHTML = formatSeconds(bursttime);
            document.getElementById('span_damagecalc_0p_sustlevel').innerHTML = formatPctHTML(sustlevel, 0);
            document.getElementById('span_damagecalc_0p_sustdps').innerHTML = formatNumHTML(sustlevel * dpsE + dps0, 1);
            document.getElementById('span_damagecalc_0p_ammotime').innerHTML = formatSeconds(ammotime);

            recharge = moduleChg * pow(pips / 4.0, 1.1);
            bursttime = moduleCap / max(0, eps - recharge);
            sustlevel = min(1, recharge / eps);
            ammotime = min(ammo0, (ammoE <= bursttime) ? ammoE : bursttime + (ammoE - bursttime) / sustlevel);
            document.getElementById('span_damagecalc_2p_bursttime').innerHTML = formatSeconds(bursttime);
            document.getElementById('span_damagecalc_2p_sustlevel').innerHTML = formatPctHTML(sustlevel, 0);
            document.getElementById('span_damagecalc_2p_sustdps').innerHTML = formatNumHTML(sustlevel * dpsE + dps0, 1);
            document.getElementById('span_damagecalc_2p_ammotime').innerHTML = formatSeconds(ammotime);

            recharge = moduleChg;
            bursttime = moduleCap / max(0, eps - recharge);
            sustlevel = min(1, recharge / eps);
            ammotime = min(ammo0, (ammoE <= bursttime) ? ammoE : bursttime + (ammoE - bursttime) / sustlevel);
            document.getElementById('span_damagecalc_4p_bursttime').innerHTML = formatSeconds(bursttime);
            document.getElementById('span_damagecalc_4p_sustlevel').innerHTML = formatPctHTML(sustlevel, 0);
            document.getElementById('span_damagecalc_4p_sustdps').innerHTML = formatNumHTML(sustlevel * dpsE + dps0, 1);
            document.getElementById('span_damagecalc_4p_ammotime').innerHTML = formatSeconds(ammotime);
        }
    }; // updateDamageCalc()


    var reloadStoredFittings = function () {
        if (!cache.feature.storage)
            return false;
        cache.stored.fitting = {};
        var item = 'edshipyard_loadouts' + ((window.location.pathname.indexOf('/beta/') >= 0) ? '_beta' : '');
        var data = (window.localStorage.getItem(item) || '').split('/');
        for (var i = 0; i < data.length; i++) {
            var entry = data[i].split('=');
            if (entry.length == 2)
                cache.stored.fitting[entry[0]] = entry[1];
        }
        return true;
    }; // reloadStoredFittings()


    var writeStoredFittings = function () {
        if (!cache.feature.storage)
            return;
        var data = [];
        for (var namehash in cache.stored.fitting) {
            if (namehash && cache.stored.fitting[namehash] && cache.stored.fitting.hasOwnProperty(namehash))
                data.push(namehash + '=' + cache.stored.fitting[namehash]);
        }
        var item = 'edshipyard_loadouts' + ((window.location.pathname.indexOf('/beta/') >= 0) ? '_beta' : '');
        window.localStorage.setItem(item, data.join('/'));
    }; // writeStoredFittings()


    var updateStoredFittings = function (curnamehash) {
        if (!cache.feature.storage)
            return;
        var select = document.getElementById('select_storedfitting');
        clearSelectOptions(select, '', '(New Loadout)');
        select.options[0].style.fontStyle = 'italic';
        var names = [];
        var nameNamehash = {};
        for (var namehash in cache.stored.fitting) {
            if (namehash && cache.stored.fitting.hasOwnProperty(namehash) && cache.stored.fitting[namehash]) {
                var name = hashDecodeS(namehash);
                names.push(name);
                nameNamehash[name] = namehash;
            }
        }
        names.sort();
        curnamehash = curnamehash || select.value;
        var s = select.selectedIndex;
        if (s > 0)
            s = -1;
        for (var i = 0; i < names.length; i++) {
            while (!select.options[1 + i])
                select.appendChild(document.createElement('option'));
            select.options[1 + i].value = nameNamehash[names[i]];
            select.options[1 + i].text = names[i];
            if (nameNamehash[names[i]] == curnamehash)
                s = 1 + i;
        }
        while (select.options[1 + i])
            select.removeChild(select.options[select.options.length - 1]);
        select.selectedIndex = s;
        document.title = DOCUMENT_TITLE + ' - ' + ((s > 0) ? names[s - 1] : eddb.ship[document.getElementById('select_ship').value].name);
    }; // updateStoredFittings()


    var setSelectedStoredFitting = function (loadouthash) {
        if (!cache.feature.storage)
            return;
        var select = document.getElementById('select_storedfitting');
        if (loadouthash) {
            for (var namehash in cache.stored.fitting) {
                if (namehash && cache.stored.fitting.hasOwnProperty(namehash) && cache.stored.fitting[namehash]) {
                    if (cache.stored.fitting[namehash] == loadouthash) {
                        for (var i = 1; i < select.options.length; i++) {
                            if (select.options[i].value == namehash) {
                                select.selectedIndex = i;
                                document.title = DOCUMENT_TITLE + ' - ' + hashDecodeS(namehash);
                                return true;
                            }
                        }
                    }
                }
            }
        }
        select.selectedIndex = 0;
        document.title = DOCUMENT_TITLE + ' - ' + eddb.ship[document.getElementById('select_ship').value].name;
        return false;
    }; // setSelectedStoredFitting()


    var reloadStoredModules = function () {
        if (!cache.feature.storage)
            return false;
        var versionMap = {};
        cache.stored.module = {};
        var item = 'edshipyard_modules' + ((window.location.pathname.indexOf('/beta/') >= 0) ? '_beta' : '');
        var data = (window.localStorage.getItem(item) || '').split('/');
        for (var i = 0; i < data.length; i++) {
            var entry = data[i].split('=');
            if (entry.length == 2) {
                var namehash = entry[0];
                var modulehash = entry[1];
                var version = hashDecode(modulehash.slice(0, 1));
                versionMap[version] = versionMap[version] || getHashVersionMaps(version);
                var mID = hashDecode(modulehash.slice(1, 4)); // since stored modules didn't exist before v9, it will always be 3 bytes
                mID = versionMap[version].module[mID] || mID; // likewise, we only need to check the single module map
                if (mID && namehash && modulehash) {
                    if (!cache.stored.module[mID])
                        cache.stored.module[mID] = {};
                    cache.stored.module[mID][namehash] = modulehash;
                }
            }
        }
        return true;
    }; // reloadStoredModules()


    var writeStoredModules = function () {
        if (!cache.feature.storage)
            return;
        var data = [];
        for (var mID in cache.stored.module) {
            if (cache.stored.module.hasOwnProperty(mID)) {
                for (var namehash in cache.stored.module[mID]) {
                    if (namehash && cache.stored.module[mID][namehash] && cache.stored.module[mID].hasOwnProperty(namehash))
                        data.push(namehash + '=' + cache.stored.module[mID][namehash]);
                }
            }
        }
        var item = 'edshipyard_modules' + ((window.location.pathname.indexOf('/beta/') >= 0) ? '_beta' : '');
        window.localStorage.setItem(item, data.join('/'));
    }; // writeStoredModules()


    var updateStoredModules = function (group, slot, curnamehash) {
        if (!cache.feature.storage)
            return;
        var mID = getUISlotModuleID(group, slot);
        var select = document.getElementById('select_' + group + '_' + slot + '_storedmodule');
        var names = [];
        var nameNamehash = {};
        if (cache.stored.module[mID]) {
            for (var namehash in cache.stored.module[mID]) {
                if (namehash && cache.stored.module[mID].hasOwnProperty(namehash) && cache.stored.module[mID][namehash]) {
                    var name = hashDecodeS(namehash);
                    names.push(name);
                    nameNamehash[name] = namehash;
                }
            }
        }
        names.sort();
        curnamehash = curnamehash || select.value;
        var s = select.selectedIndex;
        if (s > 0)
            s = -1;
        for (var i = 0; i < names.length; i++) {
            while (!select.options[1 + i])
                select.appendChild(document.createElement('option'));
            select.options[1 + i].value = nameNamehash[names[i]];
            select.options[1 + i].text = names[i];
            if (nameNamehash[names[i]] == curnamehash)
                s = 1 + i;
        }
        while (select.options[1 + i])
            select.removeChild(select.options[select.options.length - 1]);
        select.selectedIndex = s;
    }; // updateStoredModules()


    /* **********************************************************************
     * EVENT HANDLERS
     ********************************************************************** */


    var onDocumentDragover = function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }; // onDocumentDragover()


    var onDocumentDrop = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        if (file) {
            var reader = new FileReader();
            reader.addEventListener('load', onImportFileReadComplete);
            reader.readAsText(file);
        }
    }; // onDocumentDrop()


    var onImportFileReadComplete = function (e) {
        hideUIPopup();
        importLoadout(e.target.result);
    }; // onImportFileReadComplete()


    var onDocumentMousedown = function (e) {
        cache.mousedown = e.target;
    }; // onDocumentMousedown()


    var onDocumentClickFocus = function (e) {
        if (!cache.popup.element)
            return;
        var element = e.target;
        while (element && (element !== cache.popup.element && element !== cache.popup.trigger))
            element = element.parentNode;
        if (!element) {
            if (cache.popup.sticky) {
                e.preventDefault();
                cache.popup.sticky.focus();
                if (cache.popup.sticky.select)
                    cache.popup.sticky.select();
            }
            else {
                hideUIPopup();
            }
        }
    }; //onDocumentClickFocus()


    var onFormSubmit = function (e) {
        e.preventDefault();
    }; // onFormSubmit()


    var onSelectKeydown = function (e) {
        var pgDir = 0;
        if ((e.key == 'PageUp') || ((e.keyCode || e.which) == 33)) {
            pgDir = -1;
        }
        else if ((e.key == 'PageDown') || ((e.keyCode || e.which) == 34)) {
            pgDir = 1;
        }

        if (pgDir != 0) {
            e.preventDefault();
            // from the current selection, seek until we find an option in a different optgroup
            var o = e.target.selectedIndex;
            var parent = e.target.options[o].parentNode;
            while ((o >= 0) && (o < e.target.options.length) && (e.target.options[o].parentNode === parent))
                o += pgDir;
            // if the next optgroup was more than one option away, come back one to end up at the edge of the same group
            if (o != e.target.selectedIndex + pgDir)
                o -= pgDir;
            o = min(max(o, 0), e.target.options.length - 1);
            // Firefox ignores the preventDefault(), so if we set the new
            // selection immediately, it will just be changed again by
            // however much the browser feels like. Chrome behaves correctly.
            window.setTimeout(function () {
                e.target.selectedIndex = o;
                e.target.dispatchEvent(new Event('change'));
            }, 1);
            return;
        }

        var arrowDir = 0;
        if ((e.key == 'ArrowUp') || (e.key == 'Up') || ((e.keyCode || e.which) == 38)) {
            arrowDir = -1;
        }
        else if ((e.key == 'ArrowDown') || (e.key == 'Down') || ((e.keyCode || e.which) == 40)) {
            arrowDir = 1;
        }

        if (arrowDir != 0) {
            // Firefox doesn't trigger onchange when arrowing through a select
            // until the select loses focus; Chrome does, which is nice because
            // it's easier to quickly compare stats of similar modules.
            // So, just wait a tick and quickly blur and refocus, so that Firefox
            // notices the new value and triggers onchange; Chrome won't care
            // because it will have done so already.
            window.setTimeout(function () {
                e.target.blur();
                e.target.focus();
            }, 1);
            return;
        }
    }; // onSelectKeydown()


    var onSelectShipChange = function (e) {
        setUILoadout(getDefaultShipLoadout(parseInt(e.target.value)));
        setSelectedStoredFitting();
        updateStatistics();
        updateJumpCalc();
        updateSpeedCalc();
        updateDamageCalc();
    }; // onSelectShipChange()


    var onSelectModuleChange = function (e) {
        var tokens = e.target.id.split('_');
        var group = tokens[1];
        var slot = tokens[2];
        setUISlotModule(group, slot, parseInt(e.target.value));
        updateStatistics();
        updateJumpCalc();
        updateSpeedCalc();
        updateDamageCalc();
    }; // onSelectModuleChange()


    var onUIPopupWheel = function (e) {
        // it's silly to have to reimplement this basic function,
        // but it's by far the simplest way to prevent over-scrolling on a child element
        // from propagating to scroll the document body, which is irritating
        var node = e.target;
        while (node && node.scrollHeight <= node.clientHeight)
            node = node.parentNode;
        if (node) {
            e.preventDefault();
            node.scrollTop += (e.deltaY > 0) ? 30 : -30;
        }
    }; // onUIPopupWheel()


    var onUIPopupEscapeHide = function (e) {
        if ((e.key == 'Escape') || ((e.keyCode || e.which) == 27)) {
            if (e.currentTarget === cache.popup.element && cache.popup.trigger) {
                e.preventDefault();
                var trigger = cache.popup.trigger;
                hideUIPopup();
                trigger.focus();
            }
        }
    }; // onUIPopupEscapeHide()


    var setUISlotModulePopupSelection = function (group, slot, mID) {
        var div = document.getElementById('div_' + group + '_' + slot + '_module_popup');
        var label = document.getElementById('label_' + group + '_' + slot + '_module_' + mID);
        if (!div || !label || !label.offsetParent)
            return false;
        var input = label.firstChild;
        var divR = div.getBoundingClientRect();
        var labelR = label.getBoundingClientRect();
        div.scrollTop += (min(0, labelR.top - 15 - divR.top) + max(0, labelR.bottom + 15 - divR.bottom));
        input.checked = true;
        input.focus();
        return true;
    }; // setUISlotModulePopupSelection()


    var onUISlotModuleButtonClick = function (e) {
        e.preventDefault();
        var tokens = e.target.id.split('_');
        var group = tokens[1];
        var slot = tokens[2];
        var div = document.getElementById('div_' + group + '_' + slot + '_module_popup');
        if (div === cache.popup.element && e.target === cache.popup.trigger) {
            hideUIPopup();
        }
        else {
            showUIPopup(div, e.target);
            setUISlotModulePopupSelection(group, slot, parseInt(e.target.value));
        }
    }; // onUISlotModuleButtonClick()


    var onUISlotModuleKeydown = function (e) {
        //	console.log(e.key+'/'+e.keyCode+'/'+e.which);
        var backsp = (e.key == 'Backspace') || ((e.keyCode || e.which) == 8);
        var enter = (e.key == 'Enter') || ((e.keyCode || e.which) == 13);
        var escape = (e.key == 'Escape') || ((e.keyCode || e.which) == 27);
        var space = (e.key == ' ') || ((e.keyCode || e.which) == 32);
        var pageU = (e.key == 'PageUp') || ((e.keyCode || e.which) == 33);
        var pageD = (e.key == 'PageDown') || ((e.keyCode || e.which) == 34);
        var end = (e.key == 'End') || ((e.keyCode || e.which) == 35);
        var home = (e.key == 'Home') || ((e.keyCode || e.which) == 36);
        var arrowL = (e.key == 'ArrowLeft') || (e.key == 'Left') || ((e.keyCode || e.which) == 37);
        var arrowU = (e.key == 'ArrowUp') || (e.key == 'Up') || ((e.keyCode || e.which) == 38);
        var arrowR = (e.key == 'ArrowRight') || (e.key == 'Right') || ((e.keyCode || e.which) == 39);
        var arrowD = (e.key == 'ArrowDown') || (e.key == 'Down') || ((e.keyCode || e.which) == 40);
        var del = (e.key == 'Delete') || ((e.keyCode || e.which) == 46);

        var popup = (e.currentTarget === cache.popup.element);
        var tokens = e.currentTarget.id.split('_');
        var group = tokens[1];
        var slot = tokens[2];
        var sID = getUIShipID();
        var mID = parseInt((popup ? document.forms.loadout.elements['radio_' + group + '_' + slot] : document.getElementById('button_' + group + '_' + slot + '_module')).value);
        var label = document.getElementById('label_' + group + '_' + slot + '_module_' + mID);
        var input = null;
        var divType, divRow;

        if (space || escape || enter) {
            // space/enter on the button is handled by the click event
            if (popup) {
                e.preventDefault();
                if (space || enter) {
                    input = label.firstChild;
                    if (!input.disabled && setUISlotModule(group, slot, parseInt(input.value))) {
                        updateStatistics();
                        updateJumpCalc();
                        updateSpeedCalc();
                        updateDamageCalc();
                    }
                    else {
                        return;
                    }
                }
                var trigger = cache.popup.trigger;
                hideUIPopup();
                trigger.focus();
            }
            return;
        }
        else if (backsp || del) {
            e.preventDefault();
            input = document.getElementById('label_' + group + '_' + slot + '_module_0').firstChild;
        }
        else if (pageU || pageD) {
            e.preventDefault();
            divType = label.parentNode.parentNode.parentNode;
            do {
                divType = divType[pageU ? 'previousSibling' : 'nextSibling'];
                if (!divType)
                    return;
                var inputs = divType.getElementsByTagName('INPUT');
                for (var i = 0; !input && i < inputs.length; i++) {
                    if ((popup && inputs[i].offsetParent) || (!popup && !inputs[i].disabled && isShipSlotModuleValid(sID, group, slot, parseInt(inputs[i].value))))
                        input = inputs[i];
                }
            } while (!input);
        }
        else if (home || arrowL || arrowR || end) {
            e.preventDefault();
            var col = 0;
            while (label.previousSibling) {
                label = label.previousSibling;
                col++;
            }
            var inputs = label.parentNode.getElementsByTagName('INPUT');
            var i = (home ? -1 : (end ? inputs.length : col));
            do {
                i += (arrowL || end) ? -1 : 1;
                if (i < 0 || i >= inputs.length)
                    return;
                if ((popup && inputs[i].offsetParent) || (!popup && !inputs[i].disabled && isShipSlotModuleValid(sID, group, slot, parseInt(inputs[i].value))))
                    input = inputs[i];
            } while (!input);
        }
        else if (arrowU || arrowD) {
            e.preventDefault();
            var col = 0;
            while (label.previousSibling) {
                label = label.previousSibling;
                col++;
            }
            divRow = label.parentNode.parentNode;
            do {
                if (divRow[arrowU ? 'previousSibling' : 'nextSibling']) {
                    divRow = divRow[arrowU ? 'previousSibling' : 'nextSibling'];
                }
                else if (divRow.parentNode[arrowU ? 'previousSibling' : 'nextSibling']) {
                    divRow = divRow.parentNode[arrowU ? 'previousSibling' : 'nextSibling'][arrowU ? 'lastChild' : 'firstChild'];
                }
                else {
                    return;
                }
                var inputs = divRow.getElementsByTagName('INPUT');
                for (var i = 0; !input && i < max(1 + col, inputs.length - col); i++) {
                    if ((col - i >= 0) && (col - i < inputs.length) && (((popup && inputs[col - i].offsetParent) || (!popup && !inputs[col - i].disabled && isShipSlotModuleValid(sID, group, slot, parseInt(inputs[col - i].value)))))) {
                        input = inputs[col - i];
                    }
                    else if ((col + i >= 0) && (col + i < inputs.length) && (((popup && inputs[col + i].offsetParent) || (!popup && !inputs[col + i].disabled && isShipSlotModuleValid(sID, group, slot, parseInt(inputs[col + i].value)))))) {
                        input = inputs[col + i];
                    }
                }
            } while (!input);
        }

        if (popup && input && input.offsetParent) {
            setUISlotModulePopupSelection(group, slot, parseInt(input.value));
        }
        else if (!popup && input && !input.disabled && setUISlotModule(group, slot, parseInt(input.value))) {
            updateStatistics();
            updateJumpCalc();
            updateSpeedCalc();
            updateDamageCalc();
        }
    }; // onUISlotModuleKeydown()


    var onUISlotModulePopupMouseup = function (e) {
        // we capture mouseup instead of click because the <label><input><span></label> fires click twice:
        // once on the visible span and again when the label wrapper relays it to the hidden input.
        // we then have to also make sure mouseup happened on the same element as mousedown
        // to confirm that it was really a click and not an errant drag
        if (e.target !== cache.mousedown)
            return;
        var tokens = e.currentTarget.id.split('_');
        var group = tokens[1];
        var slot = tokens[2];
        var label = e.target;
        while (label && label.tagName !== 'LABEL')
            label = label.parentNode;
        if (label && label.firstChild && label.firstChild.tagName === 'INPUT') {
            var sID = getUIShipID();
            var mID = parseInt(label.firstChild.value);
            if (!label.firstChild.disabled && setUISlotModule(group, slot, mID)) {
                updateStatistics();
                updateJumpCalc();
                updateSpeedCalc();
                updateDamageCalc();
                var trigger = cache.popup.trigger;
                hideUIPopup();
                trigger.focus();
                return;
            }
        }
        // clicked a disabled label or outside any label; refocus so keyboard controls keep working
        label = document.getElementById('label_' + group + '_' + slot + '_module_' + parseInt(document.forms.loadout.elements['radio_' + group + '_' + slot].value));
        if (label && label.firstChild && label.firstChild.tagName === 'INPUT')
            label.firstChild.focus();
    }; // onUISlotModulePopupMouseup()


    var onUISlotModificationButtonClick = function (e) {
        e.preventDefault();
        var tokens = e.target.id.split('_');
        var group = tokens[1];
        var slot = tokens[2];
        var div = document.getElementById('div_' + group + '_' + slot + '_modification_popup');
        if (div === cache.popup.element && e.target === cache.popup.trigger) {
            hideUIPopup();
        }
        else {
            updateStoredModules(group, slot);
            showUIPopup(div, e.target);
            document.getElementById('select_' + group + '_' + slot + '_blueprint').focus();
        }
    }; // onUISlotModificationButtonButtonClick()


    var onUISlotModificationFocus = function (e) {
        if (e.target.select)
            e.target.select();
    }; // onUISlotModificationFocus()


    var onUISlotModificationKeydown = function (e) {
        var enter = (e.key == 'Enter') || ((e.keyCode || e.which) == 13);
        var escape = (e.key == 'Escape') || ((e.keyCode || e.which) == 27);

        if (enter) {
            if (e.target.tagName === 'INPUT') {
                e.preventDefault();
            }
        }
        else if (escape) {
            if (e.currentTarget === cache.popup.element && cache.popup.trigger) {
                e.preventDefault();
                var trigger = cache.popup.trigger;
                hideUIPopup();
                trigger.focus();
            }
        }
    }; // onUISlotModificationKeydown()


    var handleUISlotModificationSliderMove = function (slider, position, doUpdate) {
        if (!slider || slider.className !== 'slider')
            return false;
        var tr = slider.parentNode;
        while (tr && tr.tagName !== 'TR')
            tr = tr.parentNode;
        if (!tr)
            return false;
        var tokens = cache.popup.element.id.split('_');
        var group = tokens[1];
        var slot = tokens[2];
        var input = tr.cells[1].firstChild;
        var attr = input.name;
        var rect = slider.getBoundingClientRect();
        var modifier = (eddb.attribute[attr].bad ? -1 : 1) * sliderPosToModifier((position - (rect.left | 0)) / rect.width);
        if (eddb.attribute[attr].modset) {
            var module = getUISlotModule(group, slot);
            var base = getModuleAttributeValue(module, attr);
            modifier = modifier * 100 + base;
        }
        else if (eddb.attribute[attr].modadd) {
            modifier = modifier * 100;
        }
        else if (eddb.attribute[attr].modmod) {
            var module = getUISlotModule(group, slot);
            var base = getModuleAttributeValue(module, attr);
            if (attr == 'kinres' || attr == 'thmres' || attr == 'expres' || base == 0) {
                modifier = getModuleAttributeModifier(module, attr, base + (modifier * 100));
            }
            else {
                modifier = getModuleAttributeModifier(module, attr, base * (1 + modifier));
            }
        }
        else if (attr == 'rof') {
            attr = 'bstint';
            var bstsize = getUISlotAttributeValue(group, slot, 'bstsize');
            var bstrof = getUISlotAttributeValue(group, slot, 'bstrof');
            if (bstsize > 1 && bstrof > 0) {
                var module = getUISlotModule(group, slot);
                var rof = getModuleAttributeValue(module, 'rof', modifier);
                var bstint = getModuleAttributeValue(module, 'bstint');
                modifier = (bstsize / rof - (bstsize - 1) / bstrof) / bstint - 1;
            }
            else {
                modifier = 1 / (1 + modifier) - 1;
            }
        }
        setUISlotAttributeModifier(group, slot, attr, modifier);
        if (doUpdate) {
            updateUISlotAttributes(group, slot);
            updateStatistics();
            updateJumpCalc();
            updateSpeedCalc();
            updateDamageCalc();
            input.focus();
            input.select();
        }
    }; // handleUISlotModificationSliderMove()


    var onUISlotModificationMousedown = function (e) {
        var slider = e.target;
        while (slider && slider.className !== 'slider')
            slider = slider.parentNode;
        var tr = slider;
        while (tr && tr.tagName !== 'TR')
            tr = tr.parentNode;
        if (slider && tr) {
            e.preventDefault();
            var tokens = cache.popup.element.id.split('_');
            var group = tokens[1];
            var slot = tokens[2];
            if (tr.cells[1].firstChild.name == 'dps') {
                // cannot directly modify dps
            }
            else {
                cache.mousedown = slider;
                document.addEventListener('mousemove', onUISlotModificationMousemove, true);
                document.addEventListener('mouseup', onUISlotModificationMouseup, true);
                setUISlotModified(group, slot, true);
                handleUISlotModificationSliderMove(slider, e.clientX, false);
            }
        }
    }; // onUISlotModificationMousedown()


    var onUISlotModificationMousemove = function (e) {
        handleUISlotModificationSliderMove(cache.mousedown, e.clientX, false);
    }; // onUISlotModificationMousemove()


    var onUISlotModificationMouseup = function (e) {
        e.preventDefault();
        document.removeEventListener('mousemove', onUISlotModificationMousemove, true);
        document.removeEventListener('mouseup', onUISlotModificationMouseup, true);
        handleUISlotModificationSliderMove(cache.mousedown, e.clientX, true);
    }; // onUISlotModificationMouseup()


    var onUISlotModificationChange = function (e) {
        var div = e.target;
        while (div && div.tagName !== 'DIV')
            div = div.parentNode;
        if (!div)
            return;
        var tokens = div.id.split('_');
        var group = tokens[1];
        var slot = tokens[2];
        var module = getUISlotModule(group, slot);
        var attr = e.target.name;
        var value = e.target.value.trim();
        if (value.slice(-1) == '%' && (eddb.attribute[attr].unit != '%' || value[0] == '+' || value[0] == '-')) {
            var modifier = decodeModuleAttributeModifierFromText(module, attr, value);
        }
        else {
            var modifier = getModuleAttributeModifier(module, attr, parseFloat(value));
        }
        if (attr == 'rof') {
            attr = 'bstint';
            var bstsize = getUISlotAttributeValue(group, slot, 'bstsize');
            var bstrof = getUISlotAttributeValue(group, slot, 'bstrof');
            if (bstsize > 1 && bstrof > 0) {
                var rof = getModuleAttributeValue(module, 'rof', modifier);
                var bstint = getModuleAttributeValue(module, 'bstint');
                modifier = (bstsize / rof - (bstsize - 1) / bstrof) / bstint - 1;
            }
            else {
                modifier = 1 / (1 + modifier) - 1;
            }
        }
        setUISlotModified(group, slot, true);
        setUISlotAttributeModifier(group, slot, attr, modifier);
        updateUISlotAttributes(group, slot);
        updateStatistics();
        updateJumpCalc();
        updateSpeedCalc();
        updateDamageCalc();
    }; // onUISlotModificationChange()


    var onUISlotModificationBlueprintSelectChange = function (e) {
        var tokens = e.target.id.split('_');
        var group = tokens[1];
        var slot = tokens[2];
        setUISlotBlueprint(group, slot, parseInt(e.target.value));
        updateHash();
    }; // onUISlotModificationBlueprintSelectChange()


    var onUISlotModificationBlueprintButtonClick = function (e) {
        e.preventDefault();
        var tokens = e.target.id.split('_');
        var group = tokens[1];
        var slot = tokens[2];
        var module = getUISlotModule(group, slot);
        var select = document.getElementById('select_' + group + '_' + slot + '_blueprint');
        if (!module || !select)
            return;
        var bID = parseInt(select.value);

        switch (tokens[4]) {
            case 'good':
                var bonusroll = 0.8;
                var malusroll = 0.2;
                break;
            case 'max':
                var bonusroll = 1.0;
                var malusroll = 0.0;
                break;
            case 'best':
                var bonusroll = 1.0;
                var malusroll = 1.0;
                break;
            case 'avg':
            default:
                var bonusroll = 0.5;
                var malusroll = 0.5;
                break;
        }
        var modifier = getModuleBlueprintRolledModifiers(module, bID, bonusroll, malusroll);
        setUISlotModifications(group, slot, true, bID, modifier);
        updateUISlotAttributes(group, slot);
        updateStatistics();
        updateJumpCalc();
        updateSpeedCalc();
        updateDamageCalc();
    }; // onUISlotModificationBlueprintButtonClick()


    var onUISlotPriorityButtonClick = function (e) {
        e.preventDefault();
        var tokens = e.target.id.split('_');
        var group = tokens[1];
        var slot = tokens[2];
        var n = ((parseInt(e.target.innerHTML) - 1 + ((e.which === 1 || e.button === 1) ? 1 : -1)) % 5) + 1;
        if (isNaN(n))
            n = 1;
        setUISlotPowerPriority(group, slot, undefined, n);
        updateStatistics();
    }; // setUISlotPowerPriority()


    var onFormStatsChange = function (e) {
        // when we manually change a utility powered checkbox, find and update the shield generator in case we enabled/disabled a booster
        var tokens = e.target.id.split('_');
        if ((tokens.length == 4) && (tokens[0] == 'checkbox') && (tokens[1] == 'utility') && (tokens[3] == 'powered')) {
            var module = getUISlotModule('utility', tokens[2]);
            if (module && module.mtype == 'usb')
                updateSpecificModuleAttributes('internal', 'isg');
        }

        updateStatistics();
        updateDamageCalc();
    }; // onFormStatsChange()


    var onInputWheel = function (e) {
        e.preventDefault();
        var mod;
        if (e.deltaY) {
            mod = (e.deltaY > 0) ? -1 : 1;
        }
        else if (e.detail) {
            mod = (e.detail > 0) ? -1 : 1;
        }
        else if (e.wheelDelta) {
            mod = (e.wheelDelta > 0) ? 1 : -1;
        }
        else {
            return;
        }

        var scale = 0;
        var value = parseFloat(e.target.value);
        var step = (e.shiftKey ? 10 : 1);
        value = (((mod > 0) ? (floor(round(value / pow(10, -scale)) / step) + 1) : (ceil(round(value / pow(10, -scale)) / step) - 1)) * pow(10, -scale) * step).toFixed(scale);
        switch (e.target.id) {
            case 'input_jumpcalc_fuel':
                handleJumpCalcFuelChange(value);
                break;
            case 'input_jumpcalc_cargo':
                handleJumpCalcCargoChange(value);
                break;
        }
    }; // onInputWheel()


    var onInputPipsWheel = function (e) {
        e.preventDefault();
        var mod;
        if (e.deltaY) {
            mod = (e.deltaY > 0) ? -1 : 1;
        }
        else if (e.detail) {
            mod = (e.detail > 0) ? -1 : 1;
        }
        else if (e.wheelDelta) {
            mod = (e.wheelDelta > 0) ? 1 : -1;
        }
        else {
            return;
        }

        var value = parseFloat(e.target.value) + (mod * 0.5);
        switch (e.target.id) {
            case 'input_speedcalc_pips':
                handleSpeedCalcPipsChange(value);
                break;
            case 'input_damagecalc_pips':
                handleDamageCalcPipsChange(value);
                break;
        }
    }; // onInputPipsWheel()


    var onInputJumpCalcFuelChange = function (e) {
        handleJumpCalcFuelChange(parseFloat(e.target.value));
    }; // onInputJumpCalcFuelChange()


    var onInputJumpCalcCargoChange = function (e) {
        handleJumpCalcCargoChange(parseFloat(e.target.value));
    }; // onInputJumpCalcCargoChange()


    var onInputSpeedCalcPipsChange = function (e) {
        handleSpeedCalcPipsChange(parseFloat(e.target.value));
    }; // onInputSpeedCalcPipsChange()


    var onInputDamageCalcPipsChange = function (e) {
        handleDamageCalcPipsChange(parseFloat(e.target.value));
    }; // onInputDamageCalcPipsChange()


    var onSelectDamageCalcTargetChange = function (e) {
        updateDamageCalc();
    }; // onSelectDamageCalcTargetChange()


    var onStorageEvent = function (e) {
        reloadStoredFittings();
        updateStoredFittings();
        reloadStoredModules();
        // TODO: reload all storedmodule selectors, or at least the one currently visible
    }; // onStorageEvent()


    var onSelectStoredFittingChange = function (e) {
        var namehash = e.target.value;
        var loadouthash = cache.stored.fitting[namehash];
        if (loadouthash) {
            if (importLoadoutFromHash(loadouthash))
                document.title = DOCUMENT_TITLE + ' - ' + hashDecodeS(namehash);
        }
    }; // onSelectStoredFittingChange()


    var onButtonStoredFittingActionClick = function (e) {
        e.preventDefault();
        var tokens = e.target.id.split('_');
        var action = tokens[2];
        var select = document.getElementById('select_storedfitting');
        var namehash = select.value;

        switch (action) {
            case 'reload':
                onSelectStoredFittingChange({target: select});
                break;

            case 'save':
            case 'saveas':
                var oldnamehash = namehash;
                if (action == 'saveas' || !namehash) {
                    var name = hashDecodeS(namehash) || eddb.ship[document.getElementById('select_ship').value].name;
                    do {
                        name = prompt("Enter a label for the current loadout", name);
                        if (name === null)
                            return;
                        name = (name || '').trim();
                        namehash = hashEncodeS(name);
                    } while (!name || (cache.stored.fitting[namehash] && !confirm("A loadout labeled\n\n    " + name + "\n\nalready exists. Overwrite?")));
                }
                cache.stored.fitting[namehash] = encodeLoadoutToHash(getUILoadout());
                writeStoredFittings();
                if (namehash != oldnamehash) {
                    updateStoredFittings(namehash);
                    document.title = DOCUMENT_TITLE + ' - ' + name;
                }
                break;

            case 'rename':
                if (!namehash || !cache.stored.fitting[namehash])
                    return;
                var oldnamehash = namehash;
                var name = hashDecodeS(namehash);
                do {
                    name = prompt("Enter a new label for the stored loadout", name);
                    if (name === null)
                        return;
                    name = (name || '').trim();
                    namehash = hashEncodeS(name);
                    if (namehash == oldnamehash)
                        return;
                } while (!name || (cache.stored.fitting[namehash] && !confirm("A loadout labeled\n\n    " + name + "\n\nalready exists. Overwrite?")));
                cache.stored.fitting[namehash] = cache.stored.fitting[oldnamehash];
                delete cache.stored.fitting[oldnamehash];
                writeStoredFittings();
                updateStoredFittings(namehash);
                document.title = DOCUMENT_TITLE + ' - ' + name;
                break;

            case 'delete':
                if (!namehash || !cache.stored.fitting[namehash])
                    return;
                var name = hashDecodeS(namehash);
                if (!confirm("The stored loadout labeled\n\n    " + name + "\n\nwill be deleted. Are you sure?"))
                    return;
                delete cache.stored.fitting[namehash];
                writeStoredFittings();
                updateStoredFittings();
                document.title = DOCUMENT_TITLE + ' - ' + eddb.ship[document.getElementById('select_ship').value].name;
                break;
        }
    }; // onButtonStoredFittingActionClick()


    var onSelectStoredModuleChange = function (e) {
        var tokens = e.target.id.split('_');
        var group = tokens[1];
        var slot = tokens[2];
        var mID = getUISlotModuleID(group, slot);
        if (cache.stored.module[mID]) {
            var namehash = e.target.value;
            var modulehash = cache.stored.module[mID][namehash];
            if (namehash && modulehash) {
                var version = hashDecode(modulehash.slice(0, 1));
                var map = getHashVersionMaps(version);
                var moduleObj = decodeLoadoutSlotFromHash(group, slot, modulehash.slice(1), version, map);
                setUISlotModifications(group, slot, true, moduleObj.blueprint, moduleObj.modifier);
            }
            else {
                resetUISlotModification(group, slot);
            }
        }
        else {
            resetUISlotModification(group, slot);
        }
        updateUISlotAttributes(group, slot);
        updateStatistics();
        updateJumpCalc();
        updateSpeedCalc();
        updateDamageCalc();
        return false;
    }; // onSelectStoredModuleChange()


    var onButtonStoredModuleActionClick = function (e) {
        e.preventDefault();
        var tokens = e.target.id.split('_');
        var group = tokens[1];
        var slot = tokens[2];
        var action = tokens[4];
        var mID = getUISlotModuleID(group, slot);
        var select = document.getElementById('select_' + group + '_' + slot + '_storedmodule');
        var namehash = select.value;

        switch (action) {
            case 'reload':
                onSelectStoredModuleChange({target: select});
                break;

            case 'save':
            case 'saveas':
                var moduleObj = getUILoadoutSlot(group, slot);
                if (!moduleObj.modified)
                    return;
                var oldnamehash = namehash;
                if (action == 'saveas' || !namehash) {
                    var name = hashDecodeS(namehash) || ('New ' + eddb.module[mID].name);
                    do {
                        name = prompt("Enter a label for the current module", name);
                        if (name === null)
                            return;
                        name = (name || '').trim();
                        namehash = hashEncodeS(name);
                    } while (!name || (cache.stored.module[mID] && cache.stored.module[mID][namehash] && !confirm("A module labeled\n\n    " + name + "\n\nalready exists. Overwrite?")));
                }
                if (!cache.stored.module[mID])
                    cache.stored.module[mID] = {};
                cache.stored.module[mID][namehash] = hashEncode(HASH_VERSION, 1) + encodeLoadoutModuleToHash(moduleObj);
                writeStoredModules();
                if (namehash != oldnamehash)
                    updateStoredModules(group, slot, namehash);
                break;

            case 'rename':
                if (!namehash || !cache.stored.module[mID] || !cache.stored.module[mID][namehash])
                    return;
                var oldnamehash = namehash;
                var name = hashDecodeS(namehash);
                do {
                    name = prompt("Enter a new label for the stored module", name);
                    if (name === null)
                        return;
                    name = (name || '').trim();
                    namehash = hashEncodeS(name);
                    if (namehash == oldnamehash)
                        return;
                } while (!name || (cache.stored.module[mID] && cache.stored.module[mID][namehash] && !confirm("A module labeled\n\n    " + name + "\n\nalready exists. Overwrite?")));
                cache.stored.module[mID][namehash] = cache.stored.module[mID][oldnamehash];
                delete cache.stored.module[mID][oldnamehash];
                writeStoredModules();
                updateStoredModules(group, slot, namehash);
                break;

            case 'delete':
                if (!namehash || !cache.stored.module[mID] || !cache.stored.module[mID][namehash])
                    return;
                var name = hashDecodeS(namehash);
                if (!confirm("The stored module labeled\n\n    " + name + "\n\nwill be deleted. Are you sure?"))
                    return;
                delete cache.stored.module[mID][namehash];
                writeStoredModules();
                updateStoredModules(group, slot);
                break;
        }
    }; // onButtonStoredModuleActionClick()


    var onTextareaPopupButtonClick = function (e) {
        e.preventDefault();
        var trigger = cache.popup.trigger;
        hideUIPopup();
        if (trigger)
            trigger.focus();
        if (e.target.id == 'button_popup_okay' && (typeof cache.popup.onOkay === 'function'))
            cache.popup.onOkay(document.getElementById('textarea_popup').value);
        if (e.target.id == 'button_popup_cancel' && (typeof cache.popup.onCancel === 'function'))
            cache.popup.onCancel(document.getElementById('textarea_popup').value);
    }; // onTextareaPopupButtonClick()


    var onButtonImportClick = function (e) {
        e.preventDefault();
        if (e.target === cache.popup.trigger) {
            hideUIPopup();
        }
        else {
            showUITextareaPopup(
                    'Paste your loadout here. Supported formats are:\n' +
                    '\n' +
                    '* E:D Shipyard URL hash\n' +
                    '* E:D Shipyard text export\n' +
                    '* Coriolis JSON export (single or batch)\n' +
                    '* Companion API JSON export (via EDAPI, EDCE, EDMC, etc)\n' +
                    '* Journal "Loadout" event JSON object\n' +
                    '\n' +
                    'If you have loadout(s) saved to a file in any of these formats,\n' +
                    'you may also drag and drop the file onto the page to import it.',
                    80, 30, e.target, importLoadout, true
                    );
        }
    }; // onButtonImportClick()


    var onButtonExportClick = function (e) {
        e.preventDefault();
        if (e.target === cache.popup.trigger) {
            hideUIPopup();
        }
        else {
            showUITextareaPopup(encodeLoadoutToText(getUILoadout(), false), null, null, e.target);
        }
    }; // onButtonExportClick()


    var onButtonExportStatsClick = function (e) {
        e.preventDefault();
        if (e.target === cache.popup.trigger) {
            hideUIPopup();
        }
        else {
            showUITextareaPopup(encodeLoadoutToText(getUILoadout(), true), null, null, e.target);
        }
    }; // onButtonExportStatsClick()


    var onLinkEmailClick = function (e) {
        e.preventDefault();
        if (e.target === cache.popup.trigger) {
            hideUIPopup();
        }
        else {
            showUITextareaPopup(String.fromCharCode(116, 97, 108, 101, 100, 101, 110, 48, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109), null, null, e.target); // just to dissuade any email harvesting bots
        }
    }; // onLinkEmailClick()


    var onButtonRoutecalcInitClick = function (e) {
        e.preventDefault();
        if (!window.edshipyard.routecalc) {
            window.edshipyard.routecalc = {extra: e.shiftKey, verbose: e.ctrlKey, stats: cache.stats};
            var script = document.createElement('script');
            script.setAttribute('type', 'application/javascript');
            script.setAttribute('src', 'route.js');
            document.body.appendChild(script);
        }
    }; // onButtonRoutecalcInitClick()


    /* **********************************************************************
     * MAIN INITIALIZATION
     ********************************************************************** */


    var cache = {
        mousedown: null,
        popup: {},
        feature: {},
        stored: {
            fitting: {},
            module: {},
        },

        order: {},
        hardpoint: {},
        component: {},
        icon: {
            mount: {},
            missile: {},
        },

        stats: {
            mass: null,
            fuel: null,
            cargo: null,
            power: null,
            passivedraw: null,
            activedraw: null,
            mycost: null,
            realcost: null,
            shield: null,
            rangeUnladen: null,
            rangeLaden: null,
        },
    };


    var generateGroupDisplayOrder = function (group, slot) {
        var mtypes = [];
        var mtypeModules = {};
        // identify the valid modules and mtypes for this group/slot
        for (var mID in eddb.module) {
            if (eddb.module.hasOwnProperty(mID)) {
                var mtype = eddb.module[mID].mtype;
                if (((group == 'component') ? eddb.group[group][slot] : eddb.group[group]).mtypes[mtype]) {
                    if (!mtypeModules[mtype]) {
                        mtypes.push(mtype);
                        mtypeModules[mtype] = [];
                    }
                    mtypeModules[mtype].push(mID);
                }
            }
        }
        mtypes.sort(function (m1, m2) {
            var v1 = eddb.mtype[m1].name;
            var v2 = eddb.mtype[m2].name;
            return (v1 < v2) ? -1 : ((v1 > v2) ? 1 : 0);
        });
        for (mtype in mtypeModules) {
            mtypeModules[mtype].sort(function (i1, i2) {
                var m1 = eddb.module[i1];
                var m2 = eddb.module[i2];
                var v1 = 0 - (m1.class || 0);
                var v2 = 0 - (m2.class || 0);
                if (v1 == v2) {
                    v1 = 0 + !(eddb.mtype[mtype].modulenames[m1.name]);
                    v2 = 0 + !(eddb.mtype[mtype].modulenames[m2.name]);
                    if (v1 == v2) {
                        if (v1 && m1.name != m2.name) {
                            v1 = (m1.name < m2.name) ? -1 : ((m1.name > m2.name) ? 1 : 0);
                            v2 = 0;
                        }
                        else {
                            v1 = 0 + (m1.mount || ' ').charCodeAt(0);
                            v2 = 0 + (m2.mount || ' ').charCodeAt(0);
                            if (v1 == v2) {
                                v1 = 0 + (m1.missile || ' ').charCodeAt(0);
                                v2 = 0 + (m2.missile || ' ').charCodeAt(0);
                                if (v1 == v2) {
                                    v1 = 0 + ((m1.cabincls == 'E') ? 0 : (m1.cabincls || ' ').charCodeAt(0));
                                    v2 = 0 + ((m2.cabincls == 'E') ? 0 : (m2.cabincls || ' ').charCodeAt(0));
                                    if (v1 == v2) {
                                        v1 = 0 - (m1.rating || ' ').charCodeAt(0);
                                        v2 = 0 - (m2.rating || ' ').charCodeAt(0);
                                        if (v1 == v2) {
                                            v1 = 0 - (m1.cost || 0);
                                            v2 = 0 - (m2.cost || 0);
                                            if (v1 == v2) {
                                                v1 = (m1.name < m2.name) ? -1 : ((m1.name > m2.name) ? 1 : 0);
                                                v2 = 0;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //	if (!(eddb.mtype[mtype].modulenames[m1.name])) {
                        //		v1 = -v1;
                        //		v2 = -v2;
                        //	}
                    }
                }
                return v1 - v2;
            });
        }
        return {
            mtypes: mtypes,
            mtypeModules: mtypeModules,
        };
    }; // generateGroupDisplayOrder()


    var initializeDisplayOrders = function () {
        cache.order.hardpoint = generateGroupDisplayOrder('hardpoint');
        cache.order.utility = generateGroupDisplayOrder('utility');
        cache.order.component = [];
        for (var slot = 0; slot < eddb.group.component.length; slot++)
            cache.order.component[slot] = generateGroupDisplayOrder('component', slot);
        cache.order.military = generateGroupDisplayOrder('military');
        cache.order.internal = generateGroupDisplayOrder('internal');
    }; // initializeDisplayOrders()


    var onDOMContentLoaded = function (e) {
        // test for browser features
        cache.feature.file = (window.File && window.FileReader && window.FileList);
        cache.feature.storage = (window.localStorage && window.localStorage.getItem && window.localStorage.setItem && window.localStorage.removeItem);
        if (cache.feature.storage) {
            try {
                window.localStorage.setItem('edshipyard_localstorage_test', 'edshipyard_localstorage_test');
                if (window.localStorage.getItem('edshipyard_localstorage_test') !== 'edshipyard_localstorage_test')
                    throw 'err';
                window.localStorage.removeItem('edshipyard_localstorage_test');
            } catch (err) {
                cache.feature.storage = false;
            }
        }

        // prep UI cache data
        cache.icon.mount = {F: '<span class="icon mountFixed"></span>', G: '<span class="icon mountGimballed"></span>', T: '<span class="icon mountTurreted"></span>'};
        cache.icon.missile = {D: '<span class="icon missileDumbfire"></span>', S: '<span class="icon missileSeeking"></span>'};
        initializeDisplayOrders();
        cache.order.attribute = Object.keys(eddb.attribute);
        cache.order.attribute.sort(function (i1, i2) {
            var m1 = eddb.attribute[i1], m2 = eddb.attribute[i2];
            if (m1.order != m2.order)
                return ((m1.order < m2.order) ? -1 : 1);
            if (m1.name != m2.name)
                return ((m1.name < m2.name) ? -1 : 1);
            return 0;
        });
        cache.order.mtypeBlueprints = {};
        for (var mtype in eddb.mtype) {
            if (eddb.mtype.hasOwnProperty(mtype)) {
                cache.order.mtypeBlueprints[mtype] = Object.keys(eddb.mtype[mtype].blueprint || {});
                cache.order.mtypeBlueprints[mtype].sort(function (i1, i2) {
                    var b1 = eddb.mtype[mtype].blueprint[i1], b2 = eddb.mtype[mtype].blueprint[i2];
                    if (b1.name != b2.name)
                        return ((b1.name < b2.name) ? -1 : 1);
                    if (b1.grade != b2.grade)
                        return ((b1.grade < b2.grade) ? -1 : 1);
                    return i1 - i2;
                });
            }
        }
        cache.hardpoint = {
            classLabel: ['Utility Mount', 'Small Hardpoint', 'Medium Hardpoint', 'Large Hardpoint', 'Huge Hardpoint'],
        };
        cache.component = {
            slotLabel: ['Bulkhead', 'Power Plant', 'Thruster', 'Frame Shift Drive', 'Life Support', 'Power Distributor', 'Sensor', 'Fuel Tank'],
            slotAbbr: ['BH', 'PP', 'TH', 'FD', 'LS', 'PD', 'SS', 'FT'],
            abbrSlot: {
                BH: 0, PP: 1, TH: 2, FD: 3, LS: 4, PD: 5, SS: 6, FT: 7,
                RB: 1, TM: 2, FH: 3, EC: 4, PC: 5, FS: 7, // old style
            },
        };
        for (var sID in eddb.ship) {
            for (var mID in eddb.ship[sID].module) {
                for (var attr in eddb.module[mID]) {
                    if (eddb.module[mID].hasOwnProperty(attr) && !eddb.ship[sID].module[mID].hasOwnProperty(attr))
                        eddb.ship[sID].module[mID][attr] = eddb.module[mID][attr];
                }
            }
        }

        // initialize ship selector
        var order = Object.keys(eddb.ship);
        order.sort(function (i1, i2) {
            var s1 = eddb.ship[i1], s2 = eddb.ship[i2];
            if (s1.name != s2.name)
                return ((s1.name < s2.name) ? -1 : 1);
            return (s2.cost - s1.cost);
        });
        var select = document.getElementById('select_ship');
        var select_tgt = document.getElementById('select_damagecalc_tgtship');
        for (var i = 0; i < order.length; i++) {
            var ship = eddb.ship[order[i]];
            option = document.createElement('option');
            option.value = order[i];
            option.text = ship.name;
            option.selected = (ship.name == 'Sidewinder');
            select.appendChild(option);

            option = document.createElement('option');
            option.value = ship.hardness;
            option.text = ship.name;
            select_tgt.appendChild(option);
        }
        select.focus();
        select.addEventListener('change', onSelectShipChange);
        select.addEventListener('keydown', onSelectKeydown);

        // initialize drag+drop import
        if (cache.feature.file) {
            document.addEventListener('dragover', onDocumentDragover);
            document.addEventListener('drop', onDocumentDrop);
        }

        // initialize loadout selector
        if (cache.feature.storage) {
            reloadStoredFittings();
            updateStoredFittings();
            reloadStoredModules();
            document.getElementById('select_storedfitting').addEventListener('change', onSelectStoredFittingChange);
            document.getElementById('button_storedfitting_reload').style.display = 'none'; // addEventListener('click', onButtonStoredFittingActionClick);
            document.getElementById('button_storedfitting_save').style.display = 'none'; // addEventListener('click', onButtonStoredFittingActionClick);
            document.getElementById('button_storedfitting_saveas').addEventListener('click', onButtonStoredFittingActionClick);
            document.getElementById('button_storedfitting_rename').style.display = 'none'; // .addEventListener('click', onButtonStoredFittingActionClick);
            document.getElementById('button_storedfitting_delete').addEventListener('click', onButtonStoredFittingActionClick);
            window.addEventListener('storage', onStorageEvent);
        }
        else {
            document.getElementById('div_select_storedfitting').style.display = 'none';
            document.getElementById('div_select_storedfitting').parentNode.appendChild(document.createTextNode('SHIP LOADOUT'));
        }

        // attach other static event handlers
        document.forms.loadout.addEventListener('submit', onFormSubmit);
        document.getElementById('checkbox_ship_hatch_powered').addEventListener('change', onFormStatsChange);
        document.getElementById('button_ship_hatch_priority').addEventListener('click', onUISlotPriorityButtonClick);
        document.getElementById('checkbox_ship_priced').addEventListener('change', onFormStatsChange);
        document.getElementById('select_discount').addEventListener('change', onFormStatsChange);
        document.getElementById('select_insurance').addEventListener('change', onFormStatsChange);
        document.getElementById('button_import_text').addEventListener('click', onButtonImportClick);
        document.getElementById('button_export_text').addEventListener('click', onButtonExportClick);
        document.getElementById('button_export_text_stats').addEventListener('click', onButtonExportStatsClick);

        document.getElementById('input_jumpcalc_fuel').addEventListener('wheel', onInputWheel);
        document.getElementById('input_jumpcalc_fuel').addEventListener('change', onInputJumpCalcFuelChange);
        document.getElementById('input_jumpcalc_cargo').addEventListener('wheel', onInputWheel);
        document.getElementById('input_jumpcalc_cargo').addEventListener('change', onInputJumpCalcCargoChange);

        document.getElementById('input_speedcalc_pips').addEventListener('wheel', onInputPipsWheel);
        document.getElementById('input_speedcalc_pips').addEventListener('change', onInputSpeedCalcPipsChange);

        document.getElementById('input_damagecalc_pips').addEventListener('wheel', onInputPipsWheel);
        document.getElementById('input_damagecalc_pips').addEventListener('change', onInputDamageCalcPipsChange);
        document.getElementById('select_damagecalc_tgtdef').addEventListener('change', onSelectDamageCalcTargetChange);
        document.getElementById('select_damagecalc_tgtship').addEventListener('change', onSelectDamageCalcTargetChange);

        document.getElementById('button_routecalc_init').addEventListener('click', onButtonRoutecalcInitClick);

        document.getElementById('link_email').addEventListener('click', onLinkEmailClick);
        document.getElementById('div_popup').addEventListener('keydown', onUIPopupEscapeHide, true);
        document.getElementById('textarea_popup').addEventListener('wheel', onUIPopupWheel);
        document.getElementById('button_popup_okay').addEventListener('click', onTextareaPopupButtonClick);
        document.getElementById('button_popup_cancel').addEventListener('click', onTextareaPopupButtonClick);

        // restore from hash, or load the Sidewinder if the hash didn't specify a loadout
        if (window.location.hash.length > 0) {
            handleHashChange(window.location.hash, true);
        }
        else {
            setUILoadout(getDefaultShipLoadout(1)); // Sidewinder
            setSelectedStoredFitting();
            updateStatistics(true);
            updateJumpCalc();
            updateSpeedCalc();
            updateDamageCalc();
        }

        // finally, load the donate button (dynamically, so that it doesn't stop the page from loading if the remote server is slow)
        document.getElementById('div_donate').innerHTML = '\
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">\
<input type="hidden" name="cmd" value="_s-xclick">\
<input type="hidden" name="hosted_button_id" value="X76V6PNF8CAV4">\
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal">\
<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">\
</form>';

        /* DEBUG *
         for (var sID in eddb.ship) {
         var ship = eddb.ship[sID];
         var cost = ship.cost;
         for (var group in ship.stock) {
         for (var i = 0;  i < ship.stock[group].length;  i++) {
         if (ship.stock[group][i]) {
         cost += eddb.module[ship.stock[group][i]].cost || 0;
         }
         }
         }
         if (cost != ship.retail)
         console.log(ship.name+':'+(cost - ship.retail));
         }
         /* */

        /* DEBUG *
         var bpAttrRangeMtypes = {};
         for (var mtype in eddb.mtype) {
         for (var bID in (eddb.mtype[mtype].blueprint || {})) {
         var bp = eddb.mtype[mtype].blueprint[bID];
         var label = bp.fdname + ' ' + bp.grade;
         for (var attr in eddb.attribute) {
         if (attr != 'name' && attr != 'grade' && attr != 'fdname') {
         var range = (bp[attr] ? ('[' + bp[attr][0] + ',' + bp[attr][1] + ']') : '[0,0]');
         if (!bpAttrRangeMtypes[label])
         bpAttrRangeMtypes[label] = {};
         if (!bpAttrRangeMtypes[label][attr])
         bpAttrRangeMtypes[label][attr] = {};
         if (!bpAttrRangeMtypes[label][attr][range])
         bpAttrRangeMtypes[label][attr][range] = [];
         bpAttrRangeMtypes[label][attr][range].push(mtype);
         }
         }
         }
         }
         var str = '';
         for (var label in bpAttrRangeMtypes) {
         for (var attr in bpAttrRangeMtypes[label]) {
         var ranges=[];
         for (var range in bpAttrRangeMtypes[label][attr]) {
         ranges.push(label + '\t' + attr + '\t' + range + '\t' + bpAttrRangeMtypes[label][attr][range].join(',') + '\n');
         }
         if (ranges.length > 1)
         str += ranges.join('');
         }
         }
         showUITextareaPopup(str);
         /* */
    }; // onDOMContentLoaded()


    window.addEventListener('DOMContentLoaded', onDOMContentLoaded);
})();