"use client"

import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { productSlice } from "./store"

export function Providers({ children, initialCategory }) {
  // Create store with initial category if provided
  const store = configureStore({
    reducer: {
      products: productSlice.reducer,
    },
    preloadedState: initialCategory
      ? {
          products: {
            ...productSlice.getInitialState(),
            filters: {
              category: initialCategory,
              filters: {},
            },
          },
        }
      : undefined,
  })

  return <Provider store={store}>{children}</Provider>
}
