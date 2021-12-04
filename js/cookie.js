import { cartCookieName, savedCookieName } from './cart.js'

// Create cookies
async function createCookies(name) {
    if(!document.cookie.includes(name)) {
        document.cookie = `${name}=; secure`;
    }}

export function getCookie(cookieName) {
    const cookies = document.cookie.split(';')
    let cartCookies = cookies.find((el) => el.includes(`${cookieName}`))
    try {
        cartCookies = JSON.parse(cartCookies.split(`${cookieName}=`).splice(1))
    } catch {
        cartCookies = [];
    }
    return cartCookies;
}

export function setCookie(cookieName, cartList) {
    document.cookie = `${cookieName}=${JSON.stringify(cartList)}; secure`;
}

createCookies(cartCookieName);
createCookies(savedCookieName);
