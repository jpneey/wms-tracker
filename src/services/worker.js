import { _isAuth } from './auth'
import moment from 'moment'
// import $ from 'jquery'

const auth = _isAuth()

function locationFetched (position) {
  const timestamp = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const postData = {
    userid: auth,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    timestamp: timestamp
  }
  console.log(postData)
}

function locationFailed (error) {
  console.log(error.code)
  console.log(error.message)
  window.cordova.plugins.settings.open('location', function () {
    console.log('opened settings')
  }, function () {
    console.log(error.message)
  })
}

export async function inBG () {
  if (auth) {
    navigator.geolocation.getCurrentPosition(locationFetched, locationFailed, { enableHighAccuracy: true, timeout: 10000 })
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(locationFetched, locationFailed, { enableHighAccuracy: true, timeout: 10000 })
    }, 10000)
  } else {
    console.log('background fetched stopped. Reason: logged out')
    return false
  }
}
