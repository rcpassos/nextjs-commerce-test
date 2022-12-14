import { useCallback } from 'react'
import type { MutationHook } from '@vercel/commerce/utils/types'
import { CommerceError } from '@vercel/commerce/utils/errors'
import useAddItem, {
  type UseAddItem,
} from '@vercel/commerce/wishlist/use-add-item'
import type { AddItemHook } from '@vercel/commerce/types/wishlist'
import useCustomer from '../customer/use-customer'
import useWishlist from './use-wishlist'

export default useAddItem as UseAddItem<typeof handler>

export const handler: MutationHook<AddItemHook> = {
  fetchOptions: {
    url: '/api/commerce/wishlist',
    method: 'POST',
  },
  useHook:
    ({ fetch }) =>
    () => {
      const { data: customer } = useCustomer()
      const { mutate } = useWishlist()

      return useCallback(
        async function addItem(item) {
          if (!customer) {
            // A signed customer is required in order to have a wishlist
            throw new CommerceError({
              message: 'Signed customer not found',
            })
          }

          // TODO: add validations before doing the fetch
          const data = await fetch({ input: { item } })
          await mutate()
          return data
        },
        [fetch, mutate, customer]
      )
    },
}
