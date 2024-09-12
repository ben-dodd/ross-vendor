/* eslint-disable @next/next/no-img-element */
import ScreenSaver from '@/components/screenSaver'
import {
  useVendorByUid,
  useVendorPaymentsByUid,
  useVendorSalesByUid,
  useVendorStockByUid,
  useVendorStockMovementByUid,
} from '@/lib/swr-hooks'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Dashboard from '@/components/dashboard'

export default function VendorScreen() {
  const router = useRouter()
  const { id } = router.query
  const { vendor, isVendorLoading, isVendorError } = useVendorByUid(id)
  const { vendorStock, isVendorStockLoading, isVendorStockError } =
    useVendorStockByUid(id)
  const { isVendorStockMovementLoading, isVendorStockMovementError } =
    useVendorStockMovementByUid(id)
  const { vendorSales, isVendorSalesLoading, isVendorSalesError } =
    useVendorSalesByUid(id)
  const { vendorPayments, isVendorPaymentsLoading, isVendorPaymentsError } =
    useVendorPaymentsByUid(id)
  const loading =
    isVendorLoading ||
    isVendorStockLoading ||
    isVendorStockMovementLoading ||
    isVendorSalesLoading ||
    isVendorPaymentsLoading
  const error =
    isVendorError ||
    isVendorStockError ||
    isVendorStockMovementError ||
    isVendorSalesError ||
    isVendorPaymentsError

  return (
    <>
      <Head>
        <title>R.O.S.S. VENDOR SHEET</title>
      </Head>
      {loading ? (
        <div className="flex h-screen w-screen p-8">
          <div className="loading-icon" />
        </div>
      ) : error ? (
        <div className="flex h-screen w-screen p-8">
          AN UNKNOWN ERROR HAS OCCURRED!
        </div>
      ) : vendor?.id !== undefined ? (
        <div className="flex h-screen w-screen p-4 md:p-8">
          <div
            style={{
              width: '1000px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <div className="pb-4">
              <img
                src="https://ross.syd1.digitaloceanspaces.com/img/POS-RIDEONSUPERSOUNDLOGOBLACK.png"
                width="500px"
                alt="RIDE ON SUPER SOUND"
              />
            </div>
            <div className="bg-orange-800 font-4xl font-black italic text-white uppercase py-1 mb-2 px-2 flex justify-between">
              <div>{vendor?.name}</div>
              <div>{`VENDOR ID: ${vendor?.id}`}</div>
            </div>
            <Dashboard
              sales={vendorSales}
              stock={vendorStock}
              payments={vendorPayments}
            />
          </div>
        </div>
      ) : (
        <ScreenSaver />
      )}
    </>
  )
}
