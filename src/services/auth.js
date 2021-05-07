import _ from './utility.js'
import $ from 'jquery'

export function _isAuth () {
  return localStorage.getItem(_.C.AUTH)
}

export function _logOut () {
  localStorage.removeItem(_.C.AUTH)
}

export function _logIn (done, fail, credentials) {
  const request = $.get({
    url: _.C.API_LOGIN,
    method: 'post',
    data: {
      _: credentials.name,
      __: credentials.pass
    }
  })
  console.log(credentials.name + ' : ' + credentials.pass)
  request.done(data => {
    const authId = data.auth_id
    if (authId) {
      done()
      localStorage.setItem(_.C.AUTH, authId)
    } else {
      localStorage.removeItem(_.C.AUTH)
      fail()
    }
  })
  request.fail(function (jqXHR, textStatus) {
    fail()
    localStorage.removeItem(_.C.AUTH)
  })
}
