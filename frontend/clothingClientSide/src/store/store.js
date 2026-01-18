export const STORAGE_KEY = "styloai_store_v1";

export const initialState = {
  cart: { items: {} },
  wishlist: { ids: [] },

  addresses: {
    list: [], // array of address objects
    selectedId: null, // which address is selected for checkout
  },

  orders: {
    list: [], // array of orders
  },
};

// Action types
export const ACTIONS = {
  HYDRATE: "HYDRATE",

  CART_ADD: "CART_ADD", // add or +1
  CART_INC: "CART_INC",
  CART_DEC: "CART_DEC",
  CART_REMOVE: "CART_REMOVE",

  WISHLIST_TOGGLE: "WISHLIST_TOGGLE", // add if not, remove if yes

  MOVE_WISHLIST_TO_CART: "MOVE_WISHLIST_TO_CART",
  MOVE_CART_TO_WISHLIST: "MOVE_CART_TO_WISHLIST",
  ADDRESS_ADD: "ADDRESS_ADD",
  ADDRESS_UPDATE: "ADDRESS_UPDATE",
  ADDRESS_DELETE: "ADDRESS_DELETE",
  ADDRESS_SELECT: "ADDRESS_SELECT",

  ORDER_PLACE: "ORDER_PLACE",
};

function addToWishlistIds(ids, productId) {
  // avoid duplicates
  if (ids.includes(productId)) return ids;
  return [...ids, productId];
}

function removeFromWishlistIds(ids, productId) {
  // remove all occurrences meaning filter out
  return ids.filter((id) => id !== productId);
}

export function reducer(state, action) {
  // reducer function to handle state changes
  switch (action.type) {
    case ACTIONS.HYDRATE: {
      //
      // payload should be a full state object
      return action.payload ?? state;
    }

    // ----- CART -----
    case ACTIONS.CART_ADD: {
      // add or +1
      const productId = action.payload; // product ID to add
      const prevQty = state.cart.items[productId] || 0; // previous quantity

      return {
        ...state,
        cart: {
          ...state.cart,
          items: {
            ...state.cart.items,
            [productId]: prevQty + 1,
          },
        },
      };
    }

    case ACTIONS.CART_INC: {
      const productId = action.payload; // product ID to increment
      const prevQty = state.cart.items[productId] || 0; // previous quantity
      if (prevQty <= 0) return state;

      return {
        ...state,
        cart: {
          ...state.cart,
          items: { ...state.cart.items, [productId]: prevQty + 1 },
        },
      };
    }

    case ACTIONS.CART_DEC: {
      const productId = action.payload; // product ID to decrement
      const prevQty = state.cart.items[productId] || 0; // previous quantity
      if (prevQty <= 0) return state;

      const nextQty = prevQty - 1;

      // if qty becomes 0 => remove
      const nextItems = { ...state.cart.items };
      if (nextQty === 0) delete nextItems[productId];
      else nextItems[productId] = nextQty;

      return {
        ...state,
        cart: { ...state.cart, items: nextItems },
      };
    }

    case ACTIONS.CART_REMOVE: {
      const productId = action.payload; // product ID to remove
      const nextItems = { ...state.cart.items };
      delete nextItems[productId];

      return {
        ...state,
        cart: { ...state.cart, items: nextItems },
      };
    }

    // ----- WISHLIST -----
    case ACTIONS.WISHLIST_TOGGLE: {
      const productId = action.payload; // product ID to toggle
      const exists = state.wishlist.ids.includes(productId); // check if exists

      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          ids: exists
            ? removeFromWishlistIds(state.wishlist.ids, productId)
            : addToWishlistIds(state.wishlist.ids, productId),
        },
      };
    }

    case ACTIONS.MOVE_WISHLIST_TO_CART: {
      const productId = action.payload; // product ID to move

      // remove from wishlist + add to cart
      const nextWishlistIds = removeFromWishlistIds(
        state.wishlist.ids,
        productId
      );
      const prevQty = state.cart.items[productId] || 0;

      return {
        ...state,
        wishlist: { ...state.wishlist, ids: nextWishlistIds },
        cart: {
          ...state.cart,
          items: { ...state.cart.items, [productId]: prevQty + 1 },
        },
      };
    }

    case ACTIONS.MOVE_CART_TO_WISHLIST: {
      const productId = action.payload; // product ID to move

      // add to wishlist + remove from cart
      const nextWishlistIds = addToWishlistIds(state.wishlist.ids, productId);
      const nextItems = { ...state.cart.items };
      delete nextItems[productId];

      return {
        ...state,
        wishlist: { ...state.wishlist, ids: nextWishlistIds },
        cart: { ...state.cart, items: nextItems },
      };
    }

    // ----- ADDRESS -----
    case ACTIONS.ADDRESS_ADD: {
      const address = action.payload; // { name, phone, line1, city, state, pincode, country }
      const newAddr = {
        ...address,
        _id: uid("addr"),
        createdAt: new Date().toISOString(),
      };

      const nextList = [newAddr, ...state.addresses.list];
      const nextSelected = state.addresses.selectedId ?? newAddr._id;

      return {
        ...state,
        addresses: { list: nextList, selectedId: nextSelected },
      };
    }

    case ACTIONS.ADDRESS_UPDATE: {
      const { _id, updates } = action.payload;
      const nextList = state.addresses.list.map((a) =>
        a._id === _id ? { ...a, ...updates } : a
      );
      return { ...state, addresses: { ...state.addresses, list: nextList } };
    }

    case ACTIONS.ADDRESS_DELETE: {
      const addrId = action.payload;
      const nextList = state.addresses.list.filter((a) => a._id !== addrId);

      // if deleted selected, pick first available or null
      const nextSelected =
        state.addresses.selectedId === addrId
          ? (nextList[0]?._id ?? null)
          : state.addresses.selectedId;

      return {
        ...state,
        addresses: { list: nextList, selectedId: nextSelected },
      };
    }

    case ACTIONS.ADDRESS_SELECT: {
      const addrId = action.payload;
      return {
        ...state,
        addresses: { ...state.addresses, selectedId: addrId },
      };
    }

    // ----- ORDER -----
    case ACTIONS.ORDER_PLACE: {
      const { items, totals, address } = action.payload;

      const order = {
        _id: uid("order"),
        createdAt: new Date().toISOString(),
        items, // [{ productId, qty, priceAtPurchase }]
        totals, // { subtotal, shipping, total }
        address, // snapshot of selected address
        status: "PLACED",
      };

      return {
        ...state,
        orders: { list: [order, ...state.orders.list] },
        cart: { items: {} }, // clear cart after placing order
      };
    }

    default:
      return state;
  }
}

// Selectors (helper functions)
export function getCartCount(cartItems) {
  // cartItems = { productId: quantity }
  return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0); // sum of quantities
}
function uid(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
