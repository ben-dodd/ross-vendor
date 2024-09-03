import '../styles/index.css'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import minMax from 'dayjs/plugin/minMax'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

function MyApp({ Component, pageProps }) {
  dayjs.extend(isBetween)
  dayjs.extend(minMax)
  dayjs.extend(isSameOrAfter)
  dayjs.extend(isSameOrBefore)
  return <Component {...pageProps} />
}

export default MyApp
