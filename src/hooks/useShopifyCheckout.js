import { useState, useEffect } from "react"

const useShopifyCheckout = (name, client, initial) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [checkout, setCheckout] = useState(initial)

  if (!name) setError("Provide a local storage object name as first parameter")
  if (!client)
    setError("You must provide the shopify client as second parameter")

  const isBrowser = typeof window !== undefined
  const checkoutId = isBrowser ? localStorage.getItem(name) : null

  const getNewCheckout = async () => {
    const checkout = await client.checkout.create()
    if (isBrowser) localStorage.setItem(name, checkout.id)
    return checkout
  }

  const fetchCheckout = async () => {
    let newCheckout = checkout
    setLoading(true)
    setError(false)
    try {
      if (!checkoutId) {
        newCheckout = getNewCheckout()
      } else {
        newCheckout = await client.checkout.fetch(checkoutId)
        if (newCheckout.completedAt) {
          newCheckout = getNewCheckout()
        }
      }
    } catch (e) {
      setError(e.message)
    }
    setCheckout(newCheckout)
    setLoading(false)
  }

  useEffect(() => {
    fetchCheckout()
  }, [checkoutId])

  return { loading, error, checkout, setCheckout }
}

export default useShopifyCheckout
