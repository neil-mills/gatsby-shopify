import React, { Fragment, useState, useContext } from "react"
import { StoreContext } from "../../context/StoreContext"
import { animated } from "react-spring"

const Cart = ({ style }) => {
  const {
    toggleCartOpen,
    checkout,
    removeProductFromCart,
    checkoutLoading,
    checkoutError,
    checkCoupon,
    removeCoupon
  } = useContext(StoreContext)
  const [coupon, setCoupon] = useState("")
  return (
    <animated.div
      style={{
        zIndex: 100,
        position: "fixed",
        padding: "30px",
        top: 0,
        right: 0,
        width: "50%",
        height: "100%",
        background: "white",
        boxShadow: "var(--elevation-4)",
        ...style,
      }}
    >
      <h3 className="title">Cart</h3>
      <button
        style={{
          background: "var(--red)",
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
        className="delete is-large"
        onClick={toggleCartOpen}
      >
        Close
      </button>
      {checkoutLoading ? (
        <p>Loading</p>
      ) : (
        checkout.lineItems.map(item => {
          return (
            <div
              key={item.id}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <div style={{ width: "60px", overflow: "hidden" }}>
                <img src={item.variant.image.src} />
              </div>
              <div>
                <h4 className="title is-4">{item.title}</h4>
                <p className="subtitle is-5" style={{ marginBottom: 5 }}>
                  {item.variant.title}
                </p>
                <p className="subtitle is-5">${item.variant.price}</p>
                <p className="subtitle is-5">Qty: {item.quantity}</p>
                <button
                  onClick={() => removeProductFromCart(item.id)}
                  className="button is-small is-danger is-outlined"
                >
                  Remove
                </button>
              </div>
            </div>
          )
        })
      )}
      <div>
        {checkout.discountApplications.length > 0 ? (
          <Fragment>
            <p>Coupon {checkout.discountApplications[0].code} applied</p>
            <button
              onClick={e => removeCoupon(checkout.discountApplications[0].code)}
              className="button"
            >
              Remove Coupon
            </button>
          </Fragment>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault()
              checkCoupon(coupon)
            }}
          >
            <div className="field">
              <label htmlFor="coupon" className="label">
                Coupon
              </label>
              <input
                type="text"
                className="input"
                id="coupon"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
              />
            </div>
            <div className="field">
              <button className="button">Check Coupon</button>
            </div>
          </form>
        )}
      </div>
      <hr />
      <div>
        Total: <h5 className="title">${checkout.totalPrice}</h5>
      </div>
      <div>
        <a href={checkout.webUrl} className="button is-fullwidth is-success">
          Checkout Now
        </a>
      </div>
    </animated.div>
  )
}

export default Cart
