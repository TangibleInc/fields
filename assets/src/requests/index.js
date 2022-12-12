const post = (url, data) => {
  
  const { api } = TangibleFields

  return fetch(url, {
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
  .then(resp => (resp.json()))
}

const get = (url, data = false) => {

  const { api } = TangibleFields

  return fetch(`${url}?${data ? new URLSearchParams(data) : ''}`, {
    method: 'GET',
    headers:{
      'X-WP-Nonce': api.nonce ?? false,
    },
    credentials: 'same-origin',
  })
  .then(resp => (resp.json()))
}

export {
  post,
  get
}
