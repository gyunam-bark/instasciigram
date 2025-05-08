const resultBox = document.getElementById('result')

function showResponse(data) {
  resultBox.textContent = JSON.stringify(data, null, 2)
}

// POST
document.getElementById('create-post-form').addEventListener('submit', async (element) => {
  element.preventDefault()
  const form = new FormData(element.target)
  const body = Object.fromEntries(form)
  body.tags = body.tags?.split(',').map(tag => tag.trim())
  body.size = Number(body.size)
  body.pixels = JSON.parse(body.pixels || '[]')

  if (!body.password) { return showResponse({ error: 'password is required.' }) }

  const max = body.size * body.size
  if (body.pixels.length > max) {
    return showResponse({ error: `pixels must be under ${max} (size x size).` })
  }

  if (body.pixels.length < 1) {
    return showResponse({ error: `pixels must have at leat one hex.` })
  }

  try {
    const res = await axios.post('/posts', body)
    showResponse(res.data)
  } catch (error) {
    showResponse(error.response?.data || error.message)
  }
})

// GET ALL
document.getElementById('get-posts-form').addEventListener('submit', async (element) => {
  element.preventDefault()
  const page = Number(document.getElementById('get-page').value)
  const pageSize = Number(document.getElementById('get-pageSize').value)
  const keyword = document.getElementById('get-keyword').value.trim()

  try {
    const res = await axios.get('/posts', {
      params: {
        ...(page ? { page } : { page: 1 }),
        ...(pageSize ? { pageSize } : { pageSize: 10 }),
        ...(keyword ? { keyword } : { keyword: '' })
      }
    })
    showResponse(res.data)
  } catch (error) {
    showResponse(error.response?.data || error.message)
  }
})

// GET ONE
document.getElementById('get-post-form').addEventListener('submit', async (element) => {
  element.preventDefault()
  const id = document.getElementById('get-id').value
  if (!id) { return showResponse({ error: 'id is required.' }) }

  try {
    const res = await axios.get(`/posts/${id}`)
    showResponse(res.data)
  } catch (error) {
    showResponse(error.response?.data || error.message)
  }
})

// PATCH
document.getElementById('patch-post-form').addEventListener('submit', async (element) => {
  element.preventDefault()
  const form = new FormData(element.target)
  const id = form.get('id')
  const password = form.get('password')
  if (!id) { return showResponse({ error: 'id is required.' }) }
  if (!password) { return showResponse({ error: 'password is required.' }) }

  const body = Object.fromEntries(form)
  body.tags = body.tags?.split(',').map(tag => tag.trim())
  body.size = Number(body.size)
  body.pixels = body.pixels ? JSON.parse(body.pixels) : undefined

  try {
    const res = await axios.patch(`/posts/${id}`, body)
    showResponse(res.data)
  } catch (error) {
    showResponse(error.response?.data || error.message)
  }
})

// DELETE
document.getElementById('delete-post-form').addEventListener('submit', async (element) => {
  element.preventDefault()
  const id = document.getElementById('delete-id').value
  const password = document.getElementById('delete-password').value
  if (!id) { return showResponse({ error: 'id is required.' }) }
  if (!password) { return showResponse({ error: 'password is required.' }) }

  try {
    const res = await axios.delete(`/posts/${id}?password=${encodeURIComponent(password)}`)
    showResponse(res.data)
  } catch (error) {
    showResponse(error.response?.data || error.message)
  }
})