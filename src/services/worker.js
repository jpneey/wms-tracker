import _ from './utility.js'
import { _isAuth } from './auth'
import moment from 'moment'
import $ from 'jquery'

const auth = _isAuth()

function locationFetched (position) {
  const timestamp = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const postData = {
    userid: auth,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    timestamp: timestamp
  }
  $.ajax({
    url: _.C.API_LOC,
    method: 'POST',
    data: postData,
    success: function (data) {
      console.log(data)
    },
    error: function (request, status, error) {
      console.log(request.responseText)
    }
  })
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
    window.cordova.plugins.backgroundMode.setEnabled(true)
    // window.cordova.plugins.backgroundMode.overrideBackButton()
    window.cordova.plugins.backgroundMode.on('activate', function () {
      window.cordova.plugins.backgroundMode.disableWebViewOptimizations()
      setInterval(() => {
        navigator.geolocation.getCurrentPosition(locationFetched, locationFailed, { enableHighAccuracy: true, timeout: 10000 })
      }, 5000)
    })
  } else {
    console.log('background fetched stopped. Reason: logged out')
    return false
  }
}
