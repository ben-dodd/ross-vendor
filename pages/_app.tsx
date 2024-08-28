import '../styles/index.css'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import minMax from 'dayjs/plugin/minMax'

function MyApp({ Component, pageProps }) {
  dayjs.extend(isBetween)
  dayjs.extend(minMax)
  return <Component {...pageProps} />
}

export default MyApp
