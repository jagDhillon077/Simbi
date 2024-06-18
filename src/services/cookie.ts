import Cookie from 'universal-cookie';
import { ColorSelect } from '../react/components/AccessibilityPage';
import CryptoJS, { AES } from 'crypto-js'; //Find way to get a encryption key unique to this device

export enum CookieKeys {
    // Accessibility (content)
    FONT_SIZE = 'font_size',
    LINE_SP = 'line_spacing',
    LETTER_SP = 'letter_spacing',

    // Accessibility (style)
    HEADING_COL = 'headings_color',
    BODY_COL = 'body_text_color',
    BACKGROUND_COL = 'background_color',
    LINK_COL = 'link_color',
    LINK_HL = 'highlight_links',
    READABILITY = 'readable_font',
    HEADING_HL = 'highlight_headings',
    
    // Accessibility (navigation)

    // Login
    TOKEN = 'access_token',
}

const cookie = new Cookie();

class CookieService {
    get(key: string, decrypt?: boolean) {
        const returnCookie = cookie.get(key);

        if (decrypt) return returnCookie? AES.decrypt(returnCookie, key).toString(CryptoJS.enc.Utf8) : returnCookie;
        else return returnCookie;
    }

    getBoolean(key: string) {
        switch(cookie.get(key)){
            case true:
            case "true":
                return true;
            default:
                return false;
        }
    }

    getColorSelect(key: string, fallback: ColorSelect) {
        const value = "#"+cookie.get(key);
        const colors = Object.values(ColorSelect);
        for (let i = 0; i < colors.length; i++) {
            if (`${colors[i]}` == value) return colors[i];
        };
        return fallback;
    }

    set(key: string, value: string | boolean, options: Object, encypt?: boolean) {
        if (typeof value === 'string') console.log(AES.encrypt(value, key).toString());
        if (typeof value === "string" && value[0] === '#') cookie.set(key, (encypt)? AES.encrypt(value.substring(1).toString(), key) : value.substring(1), options);
        else if (typeof value === "boolean") cookie.set(key, value, options);
        else cookie.set(key, (encypt)? AES.encrypt(value, key).toString() : value, options);
    }

    remove(key: string) {
        cookie.remove(key);
    }

    removeSet(keys: string[]) {
        keys.forEach((key: string) => {
            cookie.remove(key);
        })
    }
}

export default new CookieService;