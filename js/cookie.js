import { cartCookieName, savedCookieName } from './app.js'
import { addToCart, updateProdBtn } from './app.js'

// Create cookies
async function createCookies(name) {
    if(!document.cookie.includes(name)) {
        document.cookie = `${name}=;`;
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
    document.cookie = `${cookieName}=${JSON.stringify(cartList)}`;
}

createCookies(cartCookieName);
createCookies(savedCookieName);

export const addCookiesToCart = async function(name, cartType, cartSection, cartList) {
    const cookies = document.cookie.split(';')
    let cartCookies = cookies.find((el) => el.includes(`${name}`))
    // if cookies is not empty add to cart
    if(cartCookies.match(/=(?=\W+\w+)/g)) {
        const cookieList = getCookie(name);
        for(let item of cookieList) {
            await addToCart(item.id, cartSection, cartList);
            updateProdBtn(parseInt(item.id), cartType);
        }
}}
