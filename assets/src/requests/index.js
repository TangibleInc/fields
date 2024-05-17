const post = (url, data) => {

  /**
   * Simulate request in jest tests 
   */
  if( process.env.JEST_WORKER_ID ) {
    return new Promise(resolve => (
      resolve(window.tangibleTests.fetchResponse)
    )) 
  }
  
  const { api } = TangibleFields

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

  /**
   * Simulate request in jest tests
   */
  if( process.env.JEST_WORKER_ID ) {
    return new Promise(resolve => (
      resolve(window.tangibleTests.fetchResponse)
    )) 
  }

  const { api } = TangibleFields

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
