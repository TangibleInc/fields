import { getConfig } from '../index.tsx'

const post = (url, data) => {

  const { api, fetchResponse } = getConfig()

  if ( fetchResponse ) {
    return new Promise(resolve => resolve(fetchResponse))
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      body: data,
      headers:{
        'X-WP-Nonce': api.nonce ?? false,
        'enctype': 'multipart/form-data'
      },
      credentials: 'same-origin',
      processData: false,
      contentType: false
    })
    .then(resp => (
      resp.ok
        ? resolve(resp.json())
        : resp.json().then(reject)
    ))
  })
}

const get = (url, data = false) => {

  const { api, fetchResponse } = getConfig()

  if ( fetchResponse ) {
    return new Promise(resolve => resolve(fetchResponse))
  }

  return new Promise((resolve, reject) => {
    fetch(`${url}?${data ? new URLSearchParams(data) : ''}`, {
      method: 'GET',
      headers:{
        'X-WP-Nonce': api.nonce ?? false,
      },
      credentials: 'same-origin',
    })
    .then(resp => (
      resp.ok
        ? resolve(resp.json())
        : resp.json().then(reject)
    ))
  })
}

export {
  post,
  get
}
