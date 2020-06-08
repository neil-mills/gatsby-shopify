import React, { createContext } from "react"
import Client from "shopify-buy"
import useShopifyCheckout from "../hooks/useShopifyCheckout"
import useToggle from "../hooks/useToggle"

const client = Client.buildClient({
  domain: "gatsby-store-playground.myshopify.com",
  storefrontAccessToken: "b3b4aa000ee27663f95c29ab22c59fac",
})
const defaultValues = {
  isCartOpen: false,
  toggleCartOpen: () => {},
  cart: [],
  addProductToCart: () => {},
  removeProductFromCart: () => {},
  client,
  checkout: {
    lineItems: [],
  },
  checkoutLoading: true,
  checkoutError: false,
}

export const StoreContext = createContext(defaultValues)

export const StoreProvider = ({ children }) => {
  const { loading, error, checkout, setCheckout } = useShopifyCheckout(
    "checkoutId",
    client,
    null
  )
  const { isToggled: isCartOpen, toggle: toggleCartOpen } = useToggle(false)
  const removeProductFromCart = async lineItemId => {
    try {
      const newCheckout = await client.checkout.removeLineItems(checkout.id, [
        lineItemId,
      ])
      setCheckout(newCheckout)
    } catch (e) {
      console.log(e)
    }
  }

  const addProductToCart = async variantId => {
    try {
      const lineItems = [
        {
          variantId,
          quantity: 1,
        },
      ]
      const newCheckout = await client.checkout.addLineItems(
        checkout.id,
        lineItems
      )
      //console.log(addItems.webUrl)
      setCheckout(newCheckout)
    } catch (e) {
      console.error(e)
    }
  }

  const checkCoupon = async coupon => {
    try {
      const newCheckout = await client.checkout.addDiscount(
        checkout.id,
        coupon
      )
      setCheckout(newCheckout)
    } catch (e) {
      console.error(e)
    }
  }

  const removeCoupon = async coupon => {
    try {
      const newCheckout = await client.checkout.removeDiscount(
        checkout.id,
        coupon
      )
      setCheckout(newCheckout);
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <StoreContext.Provider
      value={{
        ...defaultValues,
        checkoutLoading: loading,
        checkoutError: error,
        checkout,
        addProductToCart,
        removeProductFromCart,
        isCartOpen,
        toggleCartOpen,
        checkCoupon,
        removeCoupon
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
